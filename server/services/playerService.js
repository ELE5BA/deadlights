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
  return val.trim().replace(/^#+/, '').toUpperCase();
}

export function formatFullName(val) {
  if (!val || typeof val !== 'string') return '';
  return val.trim();
}

export function createPlayer(input, extra = {}) {
  const isObject = typeof input === 'object' && input !== null;
  const firstName = (isObject ? (input.firstName || '') : (extra.firstName || '')).trim();
  const lastName = (isObject ? (input.lastName || '') : (extra.lastName || '')).trim();
  const rawFullName = formatFullName(
    firstName && lastName
      ? `${lastName}, ${firstName}`
      : (isObject ? input.fullName : extra.fullName)
  );
  const rawSection = formatSectionTag(isObject ? input.section : extra.section);
  let nicknameCandidate = (isObject ? input.nickname : input) || '';

  // Auto-generate specialized arcade call-sign if not explicitly specified
  if (!nicknameCandidate || typeof nicknameCandidate !== 'string' || !nicknameCandidate.trim()) {
    let firstClean = firstName.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    let lastClean = lastName.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    let secClean = rawSection.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    if ((!firstClean || !lastClean) && rawFullName) {
      if (rawFullName.includes(',')) {
        const parts = rawFullName.split(',').map((p) => p.trim());
        lastClean = (parts[0] || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        firstClean = (parts[1] || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      } else {
        const parts = rawFullName.split(/\s+/);
        firstClean = (parts[0] || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        lastClean = (parts[parts.length - 1] || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      }
    }

    if (firstClean && lastClean) {
      // E.g. JUAN_DEL4ISB
      nicknameCandidate = `${firstClean.slice(0, 6)}_${lastClean.slice(0, 3)}${secClean.slice(0, 4)}`.slice(0, 16);
    } else if (lastClean) {
      nicknameCandidate = `${lastClean.slice(0, 8)}_${secClean.slice(0, 4)}`.slice(0, 16);
    } else {
      nicknameCandidate = `P1_${secClean.slice(0, 4) || Math.floor(100 + Math.random() * 899)}`.slice(0, 16);
    }
  }

  let name = normalizeNickname(nicknameCandidate);
  if (!name) return { error: 'INVALID_NICKNAME' };

  const db = getDatabase();
  // If call-sign is taken, append 2-digit suffix for uniqueness
  if (db.prepare('SELECT 1 FROM players WHERE nickname_normalized = ?').get(name.normalized)) {
    for (let s = 2; s <= 99; s++) {
      const suffix = `_${s}`;
      const base = name.nickname.slice(0, 16 - suffix.length);
      const alt = `${base}${suffix}`;
      const altNorm = normalizeNickname(alt);
      if (altNorm && !db.prepare('SELECT 1 FROM players WHERE nickname_normalized = ?').get(altNorm.normalized)) {
        name = altNorm;
        break;
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
  const candidate = (isObject ? (nicknameInput.nickname || nicknameInput.fullName) : nicknameInput) || '';
  const code = (isObject ? nicknameInput.recoveryCode : recoveryCode) || '';

  if (typeof candidate !== 'string' || !candidate.trim() || typeof code !== 'string') {
    return { error: 'PROFILE_NOT_FOUND' };
  }

  const trimmed = candidate.trim();
  const db = getDatabase();
  const lowerCand = trimmed.toLowerCase();
  const normalizedCandidate = trimmed.replace(/\s+/g, ' ').toLowerCase();

  let player = db.prepare(
    'SELECT * FROM players WHERE nickname_normalized = ? OR LOWER(full_name) = ? OR LOWER(nickname) = ?'
  ).get(normalizedCandidate, lowerCand, lowerCand);

  if (!player && trimmed.includes(' ') && !trimmed.includes(',')) {
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      const reversedLastFirst = `${parts.slice(1).join(' ')}, ${parts[0]}`.toLowerCase();
      player = db.prepare('SELECT * FROM players WHERE LOWER(full_name) = ?').get(reversedLastFirst);
    }
  }

  if (!player) return { error: 'PROFILE_NOT_FOUND' };
  const candidateHash = Buffer.from(hashRecoveryCode(code));
  const storedHash = Buffer.from(player.recovery_code_hash ?? '');
  if (candidateHash.length !== storedHash.length || !crypto.timingSafeEqual(candidateHash, storedHash)) {
    return { error: 'PROFILE_NOT_FOUND' };
  }
  db.prepare('UPDATE players SET last_seen_at = ? WHERE id = ?').run(new Date().toISOString(), player.id);
  return publicPlayerSummary(db, player);
}

export function getPlayerSummary(playerId) {
  const db = getDatabase();
  const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
  return player ? publicPlayerSummary(db, player) : { error: 'PLAYER_NOT_FOUND' };
}
