import { Router } from 'express';
import { continuePlayer, createPlayer, getPlayerSummary } from '../services/playerService.js';

export const playersRouter = Router();

playersRouter.post('/', (request, response, next) => {
  try {
    const result = createPlayer(request.body?.nickname);
    if (result.error === 'INVALID_NICKNAME') return response.status(400).json({ ok: false, error: { code: result.error, message: 'Please enter a nickname using 2–16 letters, numbers, spaces, underscores, or hyphens.' } });
    if (result.error === 'NICKNAME_TAKEN') return response.status(409).json({ ok: false, error: { code: result.error, message: 'That nickname is already in use. Continue with its player code or choose another name.' } });
    return response.status(201).json({ ok: true, data: result });
  } catch (error) { return next(error); }
});

playersRouter.post('/continue', (request, response, next) => {
  try {
    const result = continuePlayer(request.body?.nickname, request.body?.recoveryCode);
    if (result.error) return response.status(401).json({ ok: false, error: { code: 'PROFILE_NOT_FOUND', message: 'Could not restore that profile.' } });
    return response.json({ ok: true, data: result });
  } catch (error) { return next(error); }
});

playersRouter.get('/:id/summary', (request, response, next) => {
  try { const result = getPlayerSummary(request.params.id); return result.error ? response.status(404).json({ ok: false, error: { code: result.error, message: 'Player not found.' } }) : response.json({ ok: true, data: result }); } catch (error) { return next(error); }
});
