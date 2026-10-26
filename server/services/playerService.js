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
  return {
    playerId: player.id,
    nickname: player.nickname,
    fullName: player.full_name || player.nickname,
    section: player.section || '',
    wallet: {
      shardsBalance: wallet?.shards_balance ?? 0,
      shardsEarnedTotal: wallet?.shards_earned_total ?? 0,
      shardsSpentTotal: wallet?.shards_spent_total ?? 0,
    },
    bestScore: best?.best_score ?? 0,
  };
}

export function formatSectionTag(val) {
  if (!val || typeof val !== 'string') return '';
  const clean = val.trim();
  if (!clean) return '';
  return clean.startsWith('#') ? clean : `#${clean}`;
}

export function formatFullName(val) {
  if (!val || typeof val !== 'string') return '';
  return val.trim();
}

export function createPlayer(input, extra = {}) {
  const isObject = typeof input === 'object' && input !== null;
  const rawFullName = formatFullName(isObject ? input.fullName : extra.fullName);
  const rawSection = formatSectionTag(isObject ? input.section : extra.section);
  let nicknameCandidate = (isObject ? input.nickname : input) || '';

  // If nickname was not explicitly specified, derive a valid call-sign from fullName [Last Name, First Name]
  if (!nicknameCandidate && rawFullName) {
    const parts = rawFullName.split(',').map((p) => p.trim());
    const lastName = (parts[0] || '').replace(/[^A-Za-z0-9]/g, '');
    const firstPart = (parts[1] || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 3);
    const combined = firstPart ? `${lastName}_${firstPart}` : lastName;
    nicknameCandidate = combined.slice(0, 14) || `P1_${Math.floor(100 + Math.random() * 899)}`;
  }

  let name = normalizeNickname(nicknameCandidate);
  if (!name) return { error: 'INVALID_NICKNAME' };

  const db = getDatabase();
  // If derived name is taken, add numeric suffix if derived
  if (db.prepare('SELECT 1 FROM players WHERE nickname_normalized = ?').get(name.normalized)) {
    if (rawFullName) {
      for (let s = 2; s <= 99; s++) {
        const alt = `${name.nickname.slice(0, 13)}_${s}`;
        const altNorm = normalizeNickname(alt);
        if (altNorm && !db.prepare('SELECT 1 FROM players WHERE nickname_normalized = ?').get(altNorm.normalized)) {
          name = altNorm;
          break;
        }
      }
    }
  }

  if (db.prepare('SELECT 1 FROM players WHERE nickname_normalized = ?').get(name.normalized)) {
    return { error: 'NICKNAME_TAKEN' };
  }

  const playerId = crypto.randomUUID();
  const recoveryCode = crypto.randomBytes(9).toString('base64url').toUpperCase();
  const now = new Date().toISOString();
  try {
    db.transaction(() => {
      db.prepare('INSERT INTO players (id, nickname, nickname_normalized, full_name, section, recovery_code_hash, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(playerId, name.nickname, name.normalized, rawFullName || name.nickname, rawSection, hashRecoveryCode(recoveryCode), now, now);
      db.prepare('INSERT INTO player_wallets (player_id, updated_at) VALUES (?, ?)').run(playerId, now);
      db.prepare("INSERT INTO player_collections (player_id, creature_id, unlocked_at, shards_paid) VALUES (?, 'mossbyte', ?, 0)")
        .run(playerId, now);
    })();
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) return { error: 'NICKNAME_TAKEN' };
    throw error;
  }
  return {
    playerId,
    nickname: name.nickname,
    fullName: rawFullName || name.nickname,
    section: rawSection,
    recoveryCode,
    wallet: { shardsBalance: 0 },
    collection: ['mossbyte'],
  };
}

export function continuePlayer(nicknameInput, recoveryCode) {
  const isObject = typeof nicknameInput === 'object' && nicknameInput !== null;
  const candidateNick = isObject ? nicknameInput.nickname : nicknameInput;
  const code = isObject ? nicknameInput.recoveryCode : recoveryCode;

  const name = normalizeNickname(candidateNick);
  if (!name || typeof code !== 'string') return { error: 'PROFILE_NOT_FOUND' };
  const db = getDatabase();
  const player = db.prepare('SELECT * FROM players WHERE nickname_normalized = ?').get(name.normalized);
  if (!player) return { error: 'PROFILE_NOT_FOUND' };
  const candidate = Buffer.from(hashRecoveryCode(code));
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
