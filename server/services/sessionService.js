import crypto from 'node:crypto';
import { getDatabase } from '../db/index.js';

export function startSession({ playerId, runToken, configVersion }) {
  if (typeof playerId !== 'string' || typeof runToken !== 'string' || typeof configVersion !== 'string') return { error: 'INVALID_SESSION_REQUEST' };
  const db = getDatabase();
  if (!db.prepare('SELECT 1 FROM players WHERE id = ?').get(playerId)) return { error: 'PLAYER_NOT_FOUND' };
  if (!db.prepare('SELECT 1 FROM config_versions WHERE version_id = ?').get(configVersion)) return { error: 'CONFIG_NOT_FOUND' };
  const existing = db.prepare('SELECT id, player_id, started_at, config_version FROM game_sessions WHERE run_token = ?').get(runToken);
  if (existing) {
    if (existing.config_version === configVersion && existing.player_id === playerId) return { sessionId: existing.id, startedAt: existing.started_at, configVersion: existing.config_version, existing: true };
    return { error: 'RUN_TOKEN_CONFLICT' };
  }
  const sessionId = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  db.prepare(`INSERT INTO game_sessions (id, player_id, run_token, status, started_at, config_version)
    VALUES (?, ?, ?, 'running', ?, ?)`)
    .run(sessionId, playerId, runToken, startedAt, configVersion);
  return { sessionId, startedAt, configVersion, existing: false };
}
