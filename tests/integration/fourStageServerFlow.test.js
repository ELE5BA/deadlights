import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Isolate this process from the booth database and secrets before any server module loads.
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'deadlights-test-'));
process.env.NODE_ENV = 'test';
process.env.DEADLIGHTS_DB_PATH = path.join(tempDir, 'test.sqlite');
process.env.RECOVERY_CODE_SECRET = crypto.randomBytes(16).toString('hex');
process.env.ADMIN_PASSPHRASE = crypto.randomBytes(16).toString('hex');

const { app } = await import('../../server/app.js');
const { closeDatabase, databasePath } = await import('../../server/db/index.js');
const { GAME_CONFIG } = await import('../../shared/gameConfig.js');
const { calculateScore, calculateShardAward } = await import('../../shared/scoreRules.js');
const { createHeadlessEngine, runFrames } = await import('../helpers/headlessEngine.js');

let server;
let baseUrl;

before(async () => {
  assert.ok(databasePath.startsWith(tempDir), 'tests must never touch data/deadlights.sqlite');
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  closeDatabase();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

async function api(method, route, body, cookie) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json(), headers: response.headers };
}

function playPerfectRun() {
  let summary = null;
  const { engine } = createHeadlessEngine({ onRunEnd: (result) => { summary = result; } });
  engine.devGodMode = true;
  engine.devAutoPilot = true;
  engine.start();
  runFrames(engine, { maxFrames: 60 * 60 * 6 });
  assert.ok(summary, 'engine produced a run summary');
  return summary;
}

async function newPlayerSession(firstName) {
  const player = await api('POST', '/api/players', { firstName, lastName: 'Tester', section: '4ISB' });
  assert.equal(player.status, 201, JSON.stringify(player.body));
  const runToken = crypto.randomUUID();
  const session = await api('POST', '/api/sessions', { playerId: player.body.data.playerId, runToken, configVersion: GAME_CONFIG.version });
  assert.equal(session.status, 201, JSON.stringify(session.body));
  return { playerId: player.body.data.playerId, sessionId: session.body.data.sessionId, runToken };
}

test('a perfect 4-round run from the real engine is accepted and rewarded by the server', async () => {
  const health = await api('GET', '/api/health');
  assert.equal(health.body.data.configVersion, GAME_CONFIG.version);

  const { playerId, sessionId, runToken } = await newPlayerSession('Perfect');
  const summary = playPerfectRun();
  const finish = await api('POST', `/api/sessions/${sessionId}/finish`, { runToken, ...summary });
  assert.equal(finish.status, 200, JSON.stringify(finish.body));

  const result = finish.body.data;
  const count = (type) => summary.events.filter((e) => e.eventType === type).length;
  assert.equal(result.stagesCleared, 4);
  assert.equal(result.survivalSeconds, GAME_CONFIG.roundCapSeconds);
  assert.equal(result.score, calculateScore({
    survivalSeconds: GAME_CONFIG.roundCapSeconds,
    normalShardPickups: count('shard_pickup'),
    rareBonusPickups: count('rare_pickup'),
    milestonesReached: count('milestone'),
    stagesCleared: 4,
    fragmentsCollected: count('fragment_pickup') + 4,
  }));
  const shardAward = calculateShardAward({ normalShardPickups: count('shard_pickup'), rareBonusPickups: count('rare_pickup'), stagesCleared: 4 });
  assert.equal(result.wallet.shardsBalance, shardAward);

  // One fragment per cleared round, for that round's theme creature only.
  assert.deepEqual(result.fragments, { 'static-moth': 1, 'velvet-wisp': 1, 'clockwork-crow': 1, grinfin: 1 });

  const collection = await api('GET', `/api/players/${playerId}/collection`);
  assert.equal(collection.status, 200);
  assert.equal(collection.body.data.catalog.length, 8, 'all 8 cards remain in the catalog (stage 1 & 2 cards stay available as starter / shard unlocks)');
});

test('the server rejects forged clears for stages that no longer exist', async () => {
  const { sessionId, runToken } = await newPlayerSession('Forger');
  for (const stageKey of ['stage_5', 'stage_6']) {
    const forged = await api('POST', `/api/sessions/${sessionId}/finish`, {
      runToken,
      durationMs: 60000,
      distanceM: 900,
      endReason: 'all_stages_cleared',
      events: [{ eventType: 'stage_clear', entityType: 'gameplay', entityKey: stageKey, elapsedMs: 60000, laneIndex: null, amount: 1 }],
    });
    assert.equal(forged.status, 422, `${stageKey} must be rejected`);
    assert.equal(forged.body.error.code, 'INVALID_RUN_EVENTS');
  }
});

test('admin analytics, roster and leaderboard reflect the 4-round run', async () => {
  const login = await api('POST', '/api/admin/login', { passphrase: process.env.ADMIN_PASSPHRASE });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];

  const analytics = await api('GET', '/api/admin/analytics', undefined, cookie);
  assert.equal(analytics.status, 200, JSON.stringify(analytics.body));
  const data = analytics.body.data;
  assert.equal(data.metrics.completedRuns, 1);
  assert.equal(data.metrics.bestScore.fullName, 'Tester, Perfect');
  assert.deepEqual(data.series.endReasons, [{ reason: 'all_stages_cleared', count: 1 }]);
  assert.equal(data.recentRuns[0].stagesCleared, 4);
  assert.equal(data.recentRuns[0].survivalSeconds, GAME_CONFIG.roundCapSeconds);
  const perfect = data.playerRoster.find((p) => p.fullName === 'Tester, Perfect');
  assert.equal(perfect.maxStagesCleared, 4);
  assert.ok(data.obstacleStats.length > 0, 'hazard telemetry was recorded');

  const leaderboard = await api('GET', '/api/leaderboard');
  assert.equal(leaderboard.body.data.entries[0].fullName, 'Tester, Perfect');
});
