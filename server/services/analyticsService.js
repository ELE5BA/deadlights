import { getDatabase } from '../db/index.js';

function localRange(from, to) {
  const day = /^\d{4}-\d{2}-\d{2}$/;
  const start = day.test(from ?? '') ? new Date(`${from}T00:00:00+08:00`) : new Date(0);
  const endDay = day.test(to ?? '') ? new Date(`${to}T00:00:00+08:00`) : new Date();
  if (Number.isNaN(start.valueOf()) || Number.isNaN(endDay.valueOf()) || endDay < start) return null;
  endDay.setUTCDate(endDay.getUTCDate() + 1);
  return [start.toISOString(), endDay.toISOString()];
}
function median(values) { if (!values.length) return null; const sorted = [...values].sort((a, b) => a - b); const middle = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2; }

export function getAnalytics({ from, to } = {}) {
  const range = localRange(from, to); if (!range) return { error: 'INVALID_DATE_RANGE' };
  const [start, end] = range; const db = getDatabase();
  const runs = db.prepare(`SELECT s.*, p.nickname, COALESCE(p.full_name, p.nickname) AS fullName, COALESCE(p.section, '') AS section FROM game_sessions s JOIN players p ON p.id = s.player_id WHERE s.status = 'completed' AND s.ended_at >= ? AND s.ended_at < ? ORDER BY s.ended_at`).all(start, end);
  const scores = runs.map((run) => run.score); const survivals = runs.map((run) => run.survival_seconds); const shards = runs.map((run) => run.shards_collected + (run.rare_bonus_count * 3));
  const profileCounts = new Map(); runs.forEach((run) => profileCounts.set(run.player_id, (profileCounts.get(run.player_id) ?? 0) + 1));
  const uniqueProfiles = profileCounts.size; const repeatProfiles = [...profileCounts.values()].filter((count) => count >= 2).length;
  const best = [...runs].sort((a, b) => b.score - a.score || a.ended_at.localeCompare(b.ended_at))[0];
  const obstacles = db.prepare(`SELECT e.entity_key AS entityKey, SUM(CASE WHEN e.event_type='obstacle_spawn' THEN 1 ELSE 0 END) AS spawns, SUM(CASE WHEN e.event_type='collision' THEN 1 ELSE 0 END) AS collisions FROM game_events e JOIN game_sessions s ON s.id=e.session_id WHERE s.status='completed' AND s.ended_at >= ? AND s.ended_at < ? AND e.event_type IN ('obstacle_spawn','collision') GROUP BY e.entity_key`).all(start, end).map((row) => ({ ...row, collisionRate: row.spawns ? (row.collisions / row.spawns) * 100 : null }));
  const daily = new Map(); const reasons = new Map();
  for (const run of runs) { const localDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date(run.ended_at)); daily.set(localDate, (daily.get(localDate) ?? 0) + 1); reasons.set(run.end_reason, (reasons.get(run.end_reason) ?? 0) + 1); }
  const medianSurvival = median(survivals); const medianShards = median(shards); const recommendations = [];
  for (const obstacle of obstacles) if (obstacle.spawns >= 30 && obstacle.collisionRate > 35) recommendations.push({ id: 'P-01', sample: obstacle.spawns, observed: `${obstacle.entityKey}: ${obstacle.collisionRate.toFixed(1)}%`, text: `Reduce ${obstacle.entityKey} frequency by about 10% or increase its telegraph time.` });
  if (runs.length >= 20 && medianSurvival < 20) recommendations.push({ id: 'P-02', sample: runs.length, observed: `Median survival: ${medianSurvival.toFixed(1)} sec`, text: 'Reduce early-game speed or widen the first 20-second spawn interval.' });
  if (runs.length >= 10 && medianShards < 5) recommendations.push({ id: 'P-03', sample: runs.length, observed: `Median shards: ${medianShards.toFixed(1)}`, text: 'Slightly increase pickups or lower the first paid-card cost by 1–2 shards.' });
  if (runs.length >= 20 && medianSurvival >= 55 && obstacles.some((row) => row.collisionRate !== null && row.collisionRate < 10)) recommendations.push({ id: 'P-04', sample: runs.length, observed: `Median survival: ${medianSurvival.toFixed(1)} sec`, text: 'Increase only late-stage speed or tighten late-stage spacing slightly.' });
  const cardsUnlocked = db.prepare('SELECT COUNT(1) AS total FROM player_collections').get().total;
  const metrics = { completedRuns: runs.length, uniqueProfiles, averageScore: runs.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / runs.length) : null, medianScore: median(scores), averageSurvival: runs.length ? Number((survivals.reduce((sum, value) => sum + value, 0) / runs.length).toFixed(1)) : null, medianSurvival, bestScore: best ? { score: best.score, nickname: best.nickname, fullName: best.fullName, section: best.section, endedAt: best.ended_at } : null, totalShardsEarned: shards.reduce((sum, value) => sum + value, 0), cardsUnlocked, repeatProfileRate: uniqueProfiles ? Number(((repeatProfiles / uniqueProfiles) * 100).toFixed(1)) : null };
  const estimates = { expectedShardsPerRun: runs.length >= 10 ? medianShards : null, expectedShardsNeeded: Math.max(0, 10 - runs.length), nextDayRuns: daily.size >= 3 ? Number(([...daily.values()].slice(-3).reduce((sum, value) => sum + value, 0) / 3).toFixed(1)) : null, nextDayRunsNeeded: Math.max(0, 3 - daily.size) };
  
  const playerRoster = db.prepare(`
    SELECT 
      p.id AS playerId,
      p.nickname,
      COALESCE(p.full_name, p.nickname) AS fullName,
      COALESCE(p.section, '') AS section,
      p.created_at AS createdAt,
      p.last_seen_at AS lastSeenAt,
      COUNT(s.id) AS totalRuns,
      COALESCE(MAX(s.score), 0) AS bestScore,
      COALESCE(MAX(s.survival_seconds), 0) AS bestSurvival,
      COALESCE(MAX(s.stages_cleared), 0) AS maxStagesCleared,
      COALESCE(SUM(s.shards_collected), 0) AS totalShards
    FROM players p
    LEFT JOIN game_sessions s ON s.player_id = p.id AND s.status = 'completed'
    GROUP BY p.id
    ORDER BY p.last_seen_at DESC
  `).all();

  const recentRuns = runs.slice(-50).reverse().map((r) => ({
    id: r.id,
    playerId: r.player_id,
    nickname: r.nickname,
    fullName: r.fullName,
    section: r.section,
    score: r.score,
    survivalSeconds: r.survival_seconds,
    stagesCleared: r.stages_cleared,
    shards: r.shards_collected,
    endedAt: r.ended_at,
    endReason: r.end_reason,
  }));

  return { range: { from: start, to: end, timeZone: 'Asia/Manila' }, metrics, series: { daily: [...daily].map(([date, count]) => ({ date, count })), endReasons: [...reasons].map(([reason, count]) => ({ reason, count })) }, obstacleStats: obstacles, recommendations, estimates, sampleCounts: { completedRuns: runs.length, recordedDates: daily.size }, playerRoster, recentRuns };
}
