import { getDatabase } from '../db/index.js';

export function getLeaderboard(inputLimit) {
  const limit = Math.max(1, Math.min(20, Number.isInteger(inputLimit) ? inputLimit : 10));
  const rows = getDatabase().prepare(`WITH ranked AS (
    SELECT s.player_id, s.score, s.survival_seconds AS survivalSeconds, s.ended_at AS endedAt, p.nickname,
      ROW_NUMBER() OVER (PARTITION BY s.player_id ORDER BY s.score DESC, s.survival_seconds DESC, s.shards_collected DESC, s.ended_at ASC) AS player_rank
    FROM game_sessions s JOIN players p ON p.id = s.player_id WHERE s.status = 'completed'
  ) SELECT nickname, score, survivalSeconds, endedAt FROM ranked WHERE player_rank = 1
  ORDER BY score DESC, survivalSeconds DESC, endedAt ASC LIMIT ?`).all(limit);
  return rows.map((row, index) => ({ rank: index + 1, ...row }));
}
