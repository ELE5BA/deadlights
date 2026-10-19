import { GAME_CONFIG } from '../../shared/gameConfig.js';
import { ENTITY_KEYS, EVENT_TYPES } from '../../shared/eventNames.js';
import { calculateScore, calculateShardAward } from '../../shared/scoreRules.js';
import { getDatabase } from '../db/index.js';

const END_REASONS = new Set(['hit_points_zero', 'time_limit', 'player_exit', 'client_recovery', 'all_stages_cleared', 'card_missed']);
const knownEventRules = {
  [EVENT_TYPES.OBSTACLE_SPAWN]: new Set([ENTITY_KEYS.BLOCKER_CRATE, ENTITY_KEYS.SHADOW_WAVE, ENTITY_KEYS.SWAYING_SPECTER, ENTITY_KEYS.DOUBLE_BLOCKADE]),
  [EVENT_TYPES.COLLISION]: new Set([ENTITY_KEYS.BLOCKER_CRATE, ENTITY_KEYS.SHADOW_WAVE, ENTITY_KEYS.SWAYING_SPECTER, ENTITY_KEYS.DOUBLE_BLOCKADE]),
  [EVENT_TYPES.SHARD_PICKUP]: new Set([ENTITY_KEYS.RIFT_SHARD]),
  [EVENT_TYPES.RARE_PICKUP]: new Set([ENTITY_KEYS.AMBER_ORB]),
  [EVENT_TYPES.FRAGMENT_PICKUP]: new Set([ENTITY_KEYS.CARD_FRAGMENT]),
  [EVENT_TYPES.CARD_MISSED]: new Set([ENTITY_KEYS.CARD_FRAGMENT]),
  [EVENT_TYPES.STAGE_CLEAR]: new Set([
    ENTITY_KEYS.STAGE_1, ENTITY_KEYS.STAGE_2, ENTITY_KEYS.STAGE_3,
    ENTITY_KEYS.STAGE_4, ENTITY_KEYS.STAGE_5, ENTITY_KEYS.STAGE_6,
  ]),
  [EVENT_TYPES.MILESTONE]: new Set([ENTITY_KEYS.MILESTONE_15, ENTITY_KEYS.MILESTONE_30, ENTITY_KEYS.MILESTONE_45]),
  [EVENT_TYPES.JUMP]: new Set([ENTITY_KEYS.PLAYER_JUMP]),
  [EVENT_TYPES.LANE_CHANGE]: new Set([ENTITY_KEYS.LEFT, ENTITY_KEYS.CENTER, ENTITY_KEYS.RIGHT]),
};

const STAGE_CREATURE_MAP = {
  [ENTITY_KEYS.STAGE_1]: 'mossbyte',
  [ENTITY_KEYS.STAGE_2]: 'lantern-hare',
  [ENTITY_KEYS.STAGE_3]: 'static-moth',
  [ENTITY_KEYS.STAGE_4]: 'velvet-wisp',
  [ENTITY_KEYS.STAGE_5]: 'clockwork-crow',
  [ENTITY_KEYS.STAGE_6]: 'grinfin',
};

function invalid(message) { return { error: 'INVALID_RUN_EVENTS', message }; }

function validateEvents(events, durationMs) {
  if (!Array.isArray(events) || events.length > GAME_CONFIG.eventCap) return invalid('Run events are missing or exceed the allowed limit.');
  const milestoneKeys = new Set();
  const stageKeys = new Set();

  for (const event of events) {
    if (!event || typeof event !== 'object' || !knownEventRules[event.eventType]?.has(event.entityKey)) return invalid('Run events contain an unknown type or entity.');
    if (!Number.isInteger(event.elapsedMs) || event.elapsedMs < 0 || event.elapsedMs > durationMs + 5000) return invalid('Run event timing is invalid.');
    if (event.laneIndex !== null && event.laneIndex !== undefined && (!Number.isInteger(event.laneIndex) || event.laneIndex < 0 || event.laneIndex > 2)) return invalid('Run event lane is invalid.');

    let expectedAmount = 0;
    if (event.eventType === EVENT_TYPES.SHARD_PICKUP) expectedAmount = 1;
    else if (event.eventType === EVENT_TYPES.RARE_PICKUP) expectedAmount = 3;
    else if (event.eventType === EVENT_TYPES.FRAGMENT_PICKUP) expectedAmount = 1;
    else if (event.eventType === EVENT_TYPES.STAGE_CLEAR) expectedAmount = 1;
    else if (event.eventType === EVENT_TYPES.MILESTONE) expectedAmount = 1;

    if (event.amount !== expectedAmount) return invalid('Run event amount is invalid.');

    if (event.eventType === EVENT_TYPES.MILESTONE) {
      if (milestoneKeys.has(event.entityKey)) return invalid('A milestone can only be recorded once.');
      milestoneKeys.add(event.entityKey);
    }
    if (event.eventType === EVENT_TYPES.STAGE_CLEAR) {
      if (stageKeys.has(event.entityKey)) return invalid('A stage clear can only be recorded once.');
      stageKeys.add(event.entityKey);
    }
  }
  return { events };
}

function formatResult(db, session) {
  const wallet = db.prepare('SELECT shards_balance FROM player_wallets WHERE player_id = ?').get(session.player_id);
  const best = db.prepare("SELECT MAX(score) AS best_score FROM game_sessions WHERE player_id = ? AND status = 'completed'").get(session.player_id);
  const fragments = db.prepare('SELECT creature_id, fragments_count FROM player_card_fragments WHERE player_id = ?').all(session.player_id);
  const unlocked = db.prepare('SELECT creature_id FROM player_collections WHERE player_id = ?').all(session.player_id);

  return {
    score: session.score,
    survivalSeconds: session.survival_seconds,
    stagesCleared: session.stages_cleared ?? 0,
    fragmentsEarned: session.fragments_collected ?? 0,
    shardsEarned: session.shards_collected + (session.rare_bonus_count * 3) + ((session.stages_cleared ?? 0) * (GAME_CONFIG.rewards.stageClearShards ?? 15)),
    wallet: { shardsBalance: wallet.shards_balance },
    bestScore: best.best_score ?? session.score,
    fragments: fragments.reduce((acc, f) => ({ ...acc, [f.creature_id]: f.fragments_count }), {}),
    unlockedCards: unlocked.map((u) => u.creature_id),
    saved: true,
  };
}

export function finishSession(sessionId, payload) {
  const { runToken, durationMs, distanceM, endReason, events } = payload ?? {};
  if (typeof runToken !== 'string' || !Number.isInteger(durationMs) || durationMs < 0 || durationMs > 375000 || !Number.isFinite(distanceM) || distanceM < 0 || !END_REASONS.has(endReason)) {
    return { error: 'INVALID_RUN_SUMMARY', message: 'The run summary is invalid.' };
  }
  const eventValidation = validateEvents(events, durationMs);
  if (eventValidation.error) return eventValidation;
  const db = getDatabase();
  const session = db.prepare('SELECT * FROM game_sessions WHERE id = ? AND run_token = ?').get(sessionId, runToken);
  if (!session) return { error: 'SESSION_NOT_FOUND', message: 'This run session was not found.' };
  if (session.status === 'completed') {
    if (session.duration_ms !== durationMs || session.distance_m !== distanceM || session.end_reason !== endReason) return { error: 'COMPLETED_RUN_CONFLICT', message: 'This run has already been completed with different data.' };
    return { ...formatResult(db, session), idempotent: true };
  }
  if (session.status !== 'running') return { error: 'SESSION_NOT_RUNNING', message: 'This run is no longer active.' };

  const normalShardPickups = events.filter((event) => event.eventType === EVENT_TYPES.SHARD_PICKUP).length;
  const rareBonusPickups = events.filter((event) => event.eventType === EVENT_TYPES.RARE_PICKUP).length;
  const milestonesReached = events.filter((event) => event.eventType === EVENT_TYPES.MILESTONE).length;
  const collisionsCount = events.filter((event) => event.eventType === EVENT_TYPES.COLLISION).length;
  const stageClearEvents = events.filter((event) => event.eventType === EVENT_TYPES.STAGE_CLEAR);
  const stagesCleared = stageClearEvents.length;
  const fragmentPickups = events.filter((event) => event.eventType === EVENT_TYPES.FRAGMENT_PICKUP).length;
  const totalFragmentsEarned = fragmentPickups + stagesCleared;

  const survivalSeconds = Math.min(GAME_CONFIG.roundCapSeconds, durationMs / 1000);
  const score = calculateScore({
    survivalSeconds,
    normalShardPickups,
    rareBonusPickups,
    milestonesReached,
    stagesCleared,
    fragmentsCollected: totalFragmentsEarned,
  });
  const shardAward = calculateShardAward({ normalShardPickups, rareBonusPickups, stagesCleared });
  const now = new Date().toISOString();

  db.transaction(() => {
    const insertEvent = db.prepare(`INSERT INTO game_events (session_id, event_type, entity_type, entity_key, elapsed_ms, lane_index, amount, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const event of events) insertEvent.run(session.id, event.eventType, event.entityType ?? 'gameplay', event.entityKey, event.elapsedMs, event.laneIndex ?? null, event.amount, now);

    // Update wallet
    db.prepare(`UPDATE player_wallets SET shards_balance = shards_balance + ?, shards_earned_total = shards_earned_total + ?, updated_at = ? WHERE player_id = ?`)
      .run(shardAward, shardAward, now, session.player_id);

    // Award card fragments per stage cleared
    const upsertFragment = db.prepare(`INSERT INTO player_card_fragments (player_id, creature_id, fragments_count, updated_at)
      VALUES (?, ?, 1, ?)
      ON CONFLICT(player_id, creature_id) DO UPDATE SET fragments_count = fragments_count + 1, updated_at = excluded.updated_at`);

    const checkCollection = db.prepare('SELECT 1 FROM player_collections WHERE player_id = ? AND creature_id = ?');
    const autoUnlockCard = db.prepare(`INSERT OR IGNORE INTO player_collections (player_id, creature_id, unlocked_at, shards_paid) VALUES (?, ?, ?, 0)`);

    for (const stageEvent of stageClearEvents) {
      const creatureId = STAGE_CREATURE_MAP[stageEvent.entityKey];
      if (creatureId) {
        upsertFragment.run(session.player_id, creatureId, now);
        // Check if player now has >= 3 fragments and auto-unlock card
        const currentFrag = db.prepare('SELECT fragments_count FROM player_card_fragments WHERE player_id = ? AND creature_id = ?').get(session.player_id, creatureId);
        if (currentFrag && currentFrag.fragments_count >= GAME_CONFIG.fragmentsToUnlockCard) {
          if (!checkCollection.get(session.player_id, creatureId)) {
            autoUnlockCard.run(session.player_id, creatureId, now);
          }
        }
      }
    }

    db.prepare(`UPDATE game_sessions SET
      status = 'completed',
      ended_at = ?,
      duration_ms = ?,
      survival_seconds = ?,
      distance_m = ?,
      score = ?,
      shards_collected = ?,
      rare_bonus_count = ?,
      milestones_reached = ?,
      stages_cleared = ?,
      fragments_collected = ?,
      collisions_count = ?,
      end_reason = ?,
      saved_at = ?
      WHERE id = ?`)
      .run(now, durationMs, survivalSeconds, distanceM, score, normalShardPickups, rareBonusPickups, milestonesReached, stagesCleared, totalFragmentsEarned, collisionsCount, endReason, now, session.id);
  })();

  return formatResult(db, db.prepare('SELECT * FROM game_sessions WHERE id = ?').get(session.id));
}
