async function request(path) {
  const response = await fetch(path, { headers: { Accept: 'application/json' }, credentials: 'include' });
  const body = await response.json();
  if (!response.ok || !body.ok) throw new Error(body.error?.code || 'REQUEST_FAILED');
  return body.data;
}

async function send(path, body) {
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    const error = new Error(payload.error?.message || 'Request failed');
    error.code = payload.error?.code;
    throw error;
  }
  return payload.data;
}

export function getHealth() {
  return request('/api/health');
}

export function createPlayer(params) {
  const body = typeof params === 'string' ? { nickname: params } : params;
  return send('/api/players', body);
}
export function startSession(playerId, runToken, configVersion) { return send('/api/sessions', { playerId, runToken, configVersion }); }
export function finishSession(sessionId, summary) { return send(`/api/sessions/${sessionId}/finish`, summary); }
export function continuePlayer(nicknameOrParams, recoveryCode) {
  const body = typeof nicknameOrParams === 'object' && nicknameOrParams !== null
    ? nicknameOrParams
    : { nickname: nicknameOrParams, recoveryCode };
  return send('/api/players/continue', body);
}
export function getPlayerSummary(playerId) { return request(`/api/players/${playerId}/summary`); }
export function getCollection(playerId) { return request(`/api/players/${playerId}/collection`); }
export function unlockCreature(playerId, creatureId) { return send(`/api/players/${playerId}/collection/${creatureId}/unlock`, {}); }
export function craftCreature(playerId, creatureId) { return send(`/api/players/${playerId}/collection/${creatureId}/craft`, {}); }
export function getLeaderboard() { return request('/api/leaderboard?limit=10'); }
export function adminLogin(passphrase) { return send('/api/admin/login', { passphrase }); }
export function adminLogout() { return send('/api/admin/logout', {}); }
export function getAnalytics(from, to) { const query = new URLSearchParams(); if (from) query.set('from', from); if (to) query.set('to', to); return request(`/api/admin/analytics?${query}`); }
