import crypto from 'node:crypto';
import { getDatabase } from '../db/index.js';

const NICKNAME_PATTERN = /^[A-Za-z0-9 _-]+$/;

export function normalizeNickname(value) {
  if (typeof value !== 'string') return null;
  const nickname = value.trim().replace(/\s+/g, ' ');
  if (nickname.length < 2 || nickname.length > 16 || !NICKNAME_PATTERN.test(nickname)) return null;
  return { nickname, normalized: nickname.toLowerCase() };
}

function hashRecoveryCode(recoveryCode) {
  const secret = process.env.RECOVERY_CODE_SECRET;
  if (!secret) throw new Error('RECOVERY_CODE_SECRET is not configured.');
  return crypto.createHmac('sha256', secret).update(recoveryCode).digest('hex');
}

function publicPlayerSummary(db, player) {
  const wallet = db.prepare('SELECT shards_balance, shards_earned_total, shards_spent_total FROM player_wallets WHERE player_id = ?').get(player.id);
  const best = db.prepare("SELECT MAX(score) AS best_score FROM game_sessions WHERE player_id = ? AND status = 'completed'").get(player.id);
  return { playerId: player.id, nickname: player.nickname, wallet: { shardsBalance: wallet.shards_balance, shardsEarnedTotal: wallet.shards_earned_total, shardsSpentTotal: wallet.shards_spent_total }, bestScore: best.best_score ?? 0 };
}

export function createPlayer(nicknameInput) {
  const name = normalizeNickname(nicknameInput);
  if (!name) return { error: 'INVALID_NICKNAME' };
  const db = getDatabase();
  if (db.prepare('SELECT 1 FROM players WHERE nickname_normalized = ?').get(name.normalized)) return { error: 'NICKNAME_TAKEN' };

  const playerId = crypto.randomUUID();
  const recoveryCode = crypto.randomBytes(9).toString('base64url').toUpperCase();
  const now = new Date().toISOString();
  try {
    db.transaction(() => {
      db.prepare('INSERT INTO players (id, nickname, nickname_normalized, recovery_code_hash, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?)')
        .run(playerId, name.nickname, name.normalized, hashRecoveryCode(recoveryCode), now, now);
      db.prepare('INSERT INTO player_wallets (player_id, updated_at) VALUES (?, ?)').run(playerId, now);
      db.prepare("INSERT INTO player_collections (player_id, creature_id, unlocked_at, shards_paid) VALUES (?, 'mossbyte', ?, 0)")
        .run(playerId, now);
    })();
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) return { error: 'NICKNAME_TAKEN' };
    throw error;
  }
  return { playerId, nickname: name.nickname, recoveryCode, wallet: { shardsBalance: 0 }, collection: ['mossbyte'] };
}

export function continuePlayer(nicknameInput, recoveryCode) {
  const name = normalizeNickname(nicknameInput);
  if (!name || typeof recoveryCode !== 'string') return { error: 'PROFILE_NOT_FOUND' };
  const db = getDatabase();
  const player = db.prepare('SELECT * FROM players WHERE nickname_normalized = ?').get(name.normalized);
  if (!player) return { error: 'PROFILE_NOT_FOUND' };
  const candidate = Buffer.from(hashRecoveryCode(recoveryCode));
  const stored = Buffer.from(player.recovery_code_hash ?? '');
  if (candidate.length !== stored.length || !crypto.timingSafeEqual(candidate, stored)) return { error: 'PROFILE_NOT_FOUND' };
  db.prepare('UPDATE players SET last_seen_at = ? WHERE id = ?').run(new Date().toISOString(), player.id);
  return publicPlayerSummary(db, player);
}

export function getPlayerSummary(playerId) {
  const db = getDatabase();
  const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
  return player ? publicPlayerSummary(db, player) : { error: 'PLAYER_NOT_FOUND' };
}
