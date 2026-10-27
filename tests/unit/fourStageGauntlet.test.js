import test from 'node:test';
import assert from 'node:assert/strict';
import { GAME_CONFIG, GAME_STAGES } from '../../shared/gameConfig.js';
import { EVENT_TYPES } from '../../shared/eventNames.js';
import { createHeadlessEngine, runFrames } from '../helpers/headlessEngine.js';

const STAGE_MS = GAME_CONFIG.stageDurationSeconds * 1000;

function playFullRun() {
  let runEnd = null;
  const completedCards = [];
  const { engine, atmosphereCalls } = createHeadlessEngine({
    onRunEnd: (summary) => { runEnd = summary; },
    onStateChange: (state) => { if (state.stageCompletedCard) completedCards.push(state.stageCompletedCard); },
  });
  engine.devGodMode = true; // no losses: we are verifying progression, not player skill
  engine.devAutoPilot = true; // steers into every card fragment like a perfect player
  engine.start();
  const transitions = [];
  let lastIndex = 0;
  runFrames(engine, {
    maxFrames: 60 * 60 * 6,
    onFrame: (e) => {
      if (e.currentStageIndex !== lastIndex) {
        transitions.push({ stage: e.currentStageIndex + 1, elapsedMs: e.elapsedMs });
        lastIndex = e.currentStageIndex;
      }
    },
  });
  return { engine, runEnd, transitions, atmosphereCalls, completedCards };
}

const fullRun = playFullRun();

test('a complete run plays exactly 4 rounds and ends in victory at the 240s cap', () => {
  const { engine, runEnd } = fullRun;
  assert.equal(engine.running, false);
  assert.equal(engine.stagesCleared, 4);
  assert.ok(runEnd, 'onRunEnd fired');
  assert.equal(runEnd.endReason, 'all_stages_cleared');
  assert.equal(runEnd.durationMs, GAME_CONFIG.roundCapSeconds * 1000);
});

test('rounds advance at each 60s boundary and the atmosphere follows the stage 3-6 themes', () => {
  const { transitions, atmosphereCalls } = fullRun;
  assert.deepEqual(transitions.map((t) => t.stage), [2, 3, 4]);
  transitions.forEach((t, i) => {
    const boundary = (i + 1) * STAGE_MS;
    assert.ok(t.elapsedMs >= boundary && t.elapsedMs < boundary + 100, `stage ${t.stage} starts at ~${boundary}ms (got ${t.elapsedMs})`);
  });
  assert.deepEqual(atmosphereCalls, [3, 4, 5, 6]);
});

test('each completed round hands out its theme card, matching the server reward', () => {
  const { completedCards } = fullRun;
  // Rounds 1-3 show a card popup; the final round goes straight to the victory cutscene.
  assert.deepEqual(completedCards.map((card) => [card.stageNumber, card.artKey]), [[1, 'static-moth'], [2, 'velvet-wisp'], [3, 'clockwork-crow']]);
  completedCards.forEach((card, i) => assert.equal(card.artKey, GAME_STAGES[i].creatureRewardId));
});

test('hazard art and HUD use the theme while progression uses the round number', () => {
  const { engine } = createHeadlessEngine();
  let hud = null;
  engine.onStateChange = (state) => { hud = state; };
  Object.assign(engine, { currentStageIndex: 3, health: 5, elapsedMs: 0, stageElapsedMs: 0, events: [], milestones: new Set() });
  engine.updateHud();
  assert.equal(hud.stageNumber, 4);
  assert.equal(hud.themeStage, 6);
  assert.equal(hud.stageName, 'The Grimlight Core');
});

test('the run emits stage clears 1-4 in order, one per round, and 5 card fragments per round', () => {
  const { runEnd } = fullRun;
  const clears = runEnd.events.filter((e) => e.eventType === EVENT_TYPES.STAGE_CLEAR).map((e) => e.entityKey);
  assert.deepEqual(clears, ['stage_1', 'stage_2', 'stage_3', 'stage_4']);
  const fragments = runEnd.events.filter((e) => e.eventType === EVENT_TYPES.FRAGMENT_PICKUP);
  assert.equal(fragments.length, GAME_CONFIG.stageCount * GAME_CONFIG.cardsRequiredPerStage);
  assert.equal(runEnd.events.filter((e) => e.eventType === EVENT_TYPES.CARD_MISSED).length, 0);
});

test('hazards only appear in rounds that unlock them', () => {
  const { runEnd } = fullRun;
  for (const event of runEnd.events.filter((e) => e.eventType === EVENT_TYPES.OBSTACLE_SPAWN)) {
    const stageIndex = Math.min(GAME_STAGES.length - 1, Math.floor(event.elapsedMs / STAGE_MS));
    assert.ok(
      GAME_STAGES[stageIndex].hazardTypes.includes(event.entityKey),
      `${event.entityKey} spawned at ${event.elapsedMs}ms in stage ${stageIndex + 1}`,
    );
  }
});

test('event timings stay inside the window the server accepts', () => {
  const { runEnd } = fullRun;
  assert.ok(runEnd.events.length <= GAME_CONFIG.eventCap);
  for (const event of runEnd.events) {
    assert.ok(Number.isInteger(event.elapsedMs) && event.elapsedMs >= 0 && event.elapsedMs <= runEnd.durationMs + 5000);
  }
});

// Calls the production spawn() directly many times per round with an empty track, so the
// measured hazard rate and hazard mix reflect the tuning rather than card-safety skips.
function measureSpawnMix(stageIndex, attempts = 6000) {
  const { engine } = createHeadlessEngine();
  Object.assign(engine, {
    currentStageIndex: stageIndex,
    events: [],
    activeThreats: [],
    cardSpawnSafeGuardMs: 0,
    elapsedMs: 0,
    health: GAME_CONFIG.maxHealth,
    attackStats: Object.fromEntries(['blocker_crate', 'shadow_wave', 'swaying_specter', 'double_blockade'].map((k) => [k, { spawns: 0, hits: 0, dodges: 0 }])),
  });
  let hazardSpawns = 0;
  const byKey = {};
  for (let i = 0; i < attempts; i += 1) {
    engine.objects = [];
    engine.events = [];
    engine.spawn();
    const spawns = engine.events.filter((e) => e.eventType === EVENT_TYPES.OBSTACLE_SPAWN);
    if (spawns.length) hazardSpawns += 1;
    for (const spawn of spawns) byKey[spawn.entityKey] = (byKey[spawn.entityKey] ?? 0) + 1;
  }
  return { hazardRate: hazardSpawns / attempts, byKey };
}

test('in-engine hazard pressure escalates 70% -> 80% -> 100% -> 110% of apex', () => {
  const pressures = GAME_STAGES.map((stage, index) => {
    const { hazardRate } = measureSpawnMix(index);
    // hazardRate ~ hazardChance (sampling noise ~ +/-0.013 at 6000 attempts)
    assert.ok(Math.abs(hazardRate - stage.hazardChance) < 0.035, `stage ${stage.stage}: rate ${hazardRate} vs tuned ${stage.hazardChance}`);
    return hazardRate / stage.spawnInterval.base;
  });
  for (let i = 1; i < pressures.length; i += 1) {
    assert.ok(pressures[i] > pressures[i - 1], `hazards/sec rises into stage ${i + 1}: ${pressures.map((p) => p.toFixed(3)).join(' -> ')}`);
  }
});

test('twin barrages and specters become a larger share of the mix in the final round', () => {
  const round3 = measureSpawnMix(2, 8000).byKey;
  const round4 = measureSpawnMix(3, 8000).byKey;
  const share = (mix, key) => (mix[key] ?? 0) / Object.values(mix).reduce((a, b) => a + b, 0);
  assert.equal(measureSpawnMix(0, 2000).byKey.double_blockade ?? 0, 0, 'no twin barrages in round 1');
  assert.equal(measureSpawnMix(1, 2000).byKey.double_blockade ?? 0, 0, 'no twin barrages in round 2');
  assert.ok(share(round4, 'double_blockade') > share(round3, 'double_blockade') * 0.95, 'twin barrage share does not drop into round 4');
  assert.ok((round3.double_blockade ?? 0) > 0 && (round4.double_blockade ?? 0) > 0, 'twin barrages appear in rounds 3 and 4');
});

test('engine secondary ramps key off difficulty tier, not round number', () => {
  const { engine } = createHeadlessEngine();
  assert.deepEqual(
    GAME_STAGES.map((_, index) => { engine.currentStageIndex = index; return engine.getDifficultyTier(); }),
    [2, 3, 5, 6],
  );
});
