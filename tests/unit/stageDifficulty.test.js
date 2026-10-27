import test from 'node:test';
import assert from 'node:assert/strict';
import { DIFFICULTY_APEX, GAME_CONFIG, GAME_STAGES, tuneStageDifficulty } from '../../shared/gameConfig.js';
import { POKEMON_CARD_ROSTER } from '../../src/game/GameEngine.js';

const EXPECTED_DIFFICULTY = [70, 80, 100, 110];
const close = (actual, expected, tolerance, label) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected} ± ${tolerance}, got ${actual}`);

test('the gauntlet has exactly 4 rounds at 70% / 80% / 100% / 110% difficulty', () => {
  assert.equal(GAME_STAGES.length, 4);
  assert.deepEqual(GAME_STAGES.map((stage) => stage.stage), [1, 2, 3, 4]);
  assert.deepEqual(GAME_STAGES.map((stage) => stage.difficultyPercent), EXPECTED_DIFFICULTY);
});

test('global config derives stage count and round cap from the stage list', () => {
  assert.equal(GAME_CONFIG.stageCount, 4);
  assert.equal(GAME_CONFIG.roundCapSeconds, 240);
  assert.equal(GAME_CONFIG.roundCapSeconds, GAME_STAGES.reduce((sum, stage) => sum + stage.durationSeconds, 0));
  assert.notEqual(GAME_CONFIG.version, '2.0.0', 'config version must change so 4-stage runs are distinguishable from 6-stage runs');
});

test('runner speed is exactly the difficulty percentage of apex speed', () => {
  for (const stage of GAME_STAGES) {
    const d = stage.difficultyPercent / 100;
    close(stage.speed.base, DIFFICULTY_APEX.speed.base * d, 0.001, `stage ${stage.stage} base speed`);
    close(stage.speed.maximum, DIFFICULTY_APEX.speed.maximum * d, 0.001, `stage ${stage.stage} max speed`);
    close(stage.speed.perSecond, DIFFICULTY_APEX.speed.perSecond * d, 0.00001, `stage ${stage.stage} speed ramp`);
  }
});

test('hazard pressure (hazards per second) is exactly the difficulty percentage of apex pressure', () => {
  const apexPressure = DIFFICULTY_APEX.hazardChance / DIFFICULTY_APEX.spawnInterval.base;
  for (const stage of GAME_STAGES) {
    const pressure = stage.hazardChance / stage.spawnInterval.base;
    close(pressure / apexPressure, stage.difficultyPercent / 100, 0.003, `stage ${stage.stage} hazard pressure ratio`);
  }
});

test('every difficulty knob escalates strictly from round to round', () => {
  for (let i = 1; i < GAME_STAGES.length; i += 1) {
    const prev = GAME_STAGES[i - 1];
    const next = GAME_STAGES[i];
    assert.ok(next.speed.base > prev.speed.base, `speed rises into stage ${next.stage}`);
    assert.ok(next.speed.maximum > prev.speed.maximum, `max speed rises into stage ${next.stage}`);
    assert.ok(next.hazardChance > prev.hazardChance, `hazard chance rises into stage ${next.stage}`);
    assert.ok(next.spawnInterval.base < prev.spawnInterval.base, `spawn interval tightens into stage ${next.stage}`);
    assert.ok(next.spawnInterval.minimum < prev.spawnInterval.minimum, `spawn floor tightens into stage ${next.stage}`);
    assert.ok(next.difficultyTier > prev.difficultyTier, `difficulty tier rises into stage ${next.stage}`);
    for (const hazard of prev.hazardTypes) {
      assert.ok(next.hazardTypes.includes(hazard), `stage ${next.stage} keeps ${hazard}`);
    }
  }
});

test('hazards unlock in the original order: specters from round 2, twin barrages from round 3', () => {
  assert.deepEqual(GAME_STAGES[0].hazardTypes, ['blocker_crate', 'shadow_wave']);
  assert.ok(GAME_STAGES[1].hazardTypes.includes('swaying_specter'));
  assert.ok(!GAME_STAGES[1].hazardTypes.includes('double_blockade'));
  assert.ok(GAME_STAGES[2].hazardTypes.includes('double_blockade'));
  assert.ok(GAME_STAGES[3].hazardTypes.includes('double_blockade'));
});

test('difficulty tiers place the rounds on the original 6-step ladder (steps 2, 3, 5, 6)', () => {
  assert.deepEqual(GAME_STAGES.map((stage) => stage.difficultyTier), [2, 3, 5, 6]);
});

test('within-stage ramps stay sane: speed tops out near its maximum and spawns never drop below their floor', () => {
  for (const stage of GAME_STAGES) {
    const speedAtEnd = Math.min(stage.speed.maximum, stage.speed.base + stage.speed.perSecond * stage.durationSeconds);
    assert.ok(speedAtEnd > stage.speed.base && speedAtEnd <= stage.speed.maximum, `stage ${stage.stage} speed ramp`);
    const intervalAtEnd = Math.max(stage.spawnInterval.minimum, stage.spawnInterval.base - stage.spawnInterval.perSecond * stage.durationSeconds);
    assert.ok(intervalAtEnd >= stage.spawnInterval.minimum && intervalAtEnd < stage.spawnInterval.base, `stage ${stage.stage} spawn ramp`);
    assert.ok(stage.hazardChance > 0 && stage.hazardChance < 1, `stage ${stage.stage} hazard chance is a probability`);
  }
});

test('rounds 1-4 wear the original stage 3-6 themes in order', () => {
  assert.deepEqual(GAME_STAGES.map((stage) => stage.themeStage), [3, 4, 5, 6]);
  assert.deepEqual(GAME_STAGES.map((stage) => stage.name), ['The Crimson Mire', 'The Glitch Rift', 'The Abyssal Void', 'The Grimlight Core']);
  assert.deepEqual(GAME_STAGES.map((stage) => stage.creatureRewardId), ['static-moth', 'velvet-wisp', 'clockwork-crow', 'grinfin']);
});

test('the Pokédex card shown for each round is the creature the server rewards', () => {
  for (const stage of GAME_STAGES) {
    assert.equal(POKEMON_CARD_ROSTER[stage.themeStage - 1].artKey, stage.creatureRewardId, `round ${stage.stage}`);
  }
});

test('round 3 matches the former Stage 6 apex and round 4 pushes beyond it', () => {
  assert.deepEqual(GAME_STAGES[2].speed, { ...DIFFICULTY_APEX.speed });
  const finalRound = GAME_STAGES[3];
  assert.ok(finalRound.speed.base > DIFFICULTY_APEX.speed.base, 'final round starts faster than the old apex');
  assert.ok(finalRound.speed.maximum > DIFFICULTY_APEX.speed.maximum, 'final round tops out faster than the old apex');
  assert.ok(finalRound.hazardChance > DIFFICULTY_APEX.hazardChance, 'final round throws hazards more often than the old apex');
  assert.ok(finalRound.spawnInterval.minimum < DIFFICULTY_APEX.spawnInterval.minimum, 'final round spawns tighter than the old apex');
});

test('tuneStageDifficulty reproduces apex tuning at 100% and rejects out-of-range input', () => {
  const apex = tuneStageDifficulty(100);
  assert.deepEqual(apex.speed, { ...DIFFICULTY_APEX.speed });
  assert.deepEqual(apex.spawnInterval, { ...DIFFICULTY_APEX.spawnInterval });
  assert.equal(apex.hazardChance, DIFFICULTY_APEX.hazardChance);
  assert.equal(apex.difficultyTier, 5);
  for (const bad of [0, -10, 121, Number.NaN, '50']) {
    assert.throws(() => tuneStageDifficulty(bad), RangeError, `rejects ${String(bad)}`);
  }
});
