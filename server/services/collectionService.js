import { getDatabase } from '../db/index.js';
import { GAME_CONFIG } from '../../shared/gameConfig.js';

function catalogRows(db) {
  return db.prepare('SELECT id, name, rarity, shard_cost AS shardCost, description, color_hex AS colorHex, art_key AS artKey, sort_order AS sortOrder FROM creatures WHERE active = 1 ORDER BY sort_order').all();
}

export function getCollection(playerId) {
  const db = getDatabase();
  if (!db.prepare('SELECT 1 FROM players WHERE id = ?').get(playerId)) return { error: 'PLAYER_NOT_FOUND' };
  const wallet = db.prepare('SELECT shards_balance AS shardsBalance FROM player_wallets WHERE player_id = ?').get(playerId);
  const unlocked = db.prepare('SELECT creature_id AS creatureId, unlocked_at AS unlockedAt FROM player_collections WHERE player_id = ?').all(playerId);
  const fragmentRows = db.prepare('SELECT creature_id AS creatureId, fragments_count AS fragmentsCount FROM player_card_fragments WHERE player_id = ?').all(playerId);
  const fragments = fragmentRows.reduce((acc, row) => ({ ...acc, [row.creatureId]: row.fragmentsCount }), {});
  return { catalog: catalogRows(db), unlocked, wallet, fragments };
}

export function unlockCreature(playerId, creatureId) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const player = db.prepare('SELECT 1 FROM players WHERE id = ?').get(playerId);
  const creature = db.prepare('SELECT id, name, shard_cost AS shardCost FROM creatures WHERE id = ? AND active = 1').get(creatureId);
  if (!player || !creature) return { error: 'NOT_FOUND' };
  try {
    db.transaction(() => {
      if (db.prepare('SELECT 1 FROM player_collections WHERE player_id = ? AND creature_id = ?').get(playerId, creatureId)) throw new Error('ALREADY_OWNED');
      const wallet = db.prepare('SELECT shards_balance FROM player_wallets WHERE player_id = ?').get(playerId);
      if (wallet.shards_balance < creature.shardCost) throw new Error('INSUFFICIENT_SHARDS');
      db.prepare('UPDATE player_wallets SET shards_balance = shards_balance - ?, shards_spent_total = shards_spent_total + ?, updated_at = ? WHERE player_id = ?').run(creature.shardCost, creature.shardCost, now, playerId);
      db.prepare('INSERT INTO player_collections (player_id, creature_id, unlocked_at, shards_paid) VALUES (?, ?, ?, ?)').run(playerId, creatureId, now, creature.shardCost);
    })();
  } catch (error) {
    if (error.message === 'ALREADY_OWNED' || error.message === 'INSUFFICIENT_SHARDS') return { error: error.message };
    throw error;
  }
  return { creature, ...getCollection(playerId) };
}

export function craftWithFragments(playerId, creatureId) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const player = db.prepare('SELECT 1 FROM players WHERE id = ?').get(playerId);
  const creature = db.prepare('SELECT id, name, shard_cost AS shardCost FROM creatures WHERE id = ? AND active = 1').get(creatureId);
  if (!player || !creature) return { error: 'NOT_FOUND' };
  try {
    db.transaction(() => {
      if (db.prepare('SELECT 1 FROM player_collections WHERE player_id = ? AND creature_id = ?').get(playerId, creatureId)) throw new Error('ALREADY_OWNED');
      const fragRow = db.prepare('SELECT fragments_count FROM player_card_fragments WHERE player_id = ? AND creature_id = ?').get(playerId, creatureId);
      const needed = GAME_CONFIG.fragmentsToUnlockCard ?? 3;
      if (!fragRow || fragRow.fragments_count < needed) throw new Error('INSUFFICIENT_FRAGMENTS');
      db.prepare('INSERT INTO player_collections (player_id, creature_id, unlocked_at, shards_paid) VALUES (?, ?, ?, 0)').run(playerId, creatureId, now);
    })();
  } catch (error) {
    if (error.message === 'ALREADY_OWNED' || error.message === 'INSUFFICIENT_FRAGMENTS') return { error: error.message };
    throw error;
  }
  return { creature, ...getCollection(playerId) };
}
