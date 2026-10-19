import { getDatabase } from '../db/index.js';

export function abandonStaleSessions() {
  const cutoff = new Date(Date.now() - (5 * 60 * 1000)).toISOString();
  return getDatabase().prepare("UPDATE game_sessions SET status = 'abandoned', end_reason = 'client_recovery', ended_at = ? WHERE status = 'running' AND started_at < ?")
    .run(new Date().toISOString(), cutoff).changes;
}
