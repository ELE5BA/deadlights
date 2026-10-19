import { Router } from 'express';
import { startSession } from '../services/sessionService.js';
import { finishSession } from '../services/scoreService.js';

export const sessionsRouter = Router();

sessionsRouter.post('/', (request, response, next) => {
  try {
    const result = startSession(request.body ?? {});
    if (result.error === 'PLAYER_NOT_FOUND' || result.error === 'CONFIG_NOT_FOUND') return response.status(400).json({ ok: false, error: { code: result.error, message: 'The player or game configuration is unavailable.' } });
    if (result.error) return response.status(409).json({ ok: false, error: { code: result.error, message: 'This run token cannot start another session.' } });
    return response.status(result.existing ? 200 : 201).json({ ok: true, data: result });
  } catch (error) { return next(error); }
});

sessionsRouter.post('/:id/finish', (request, response, next) => {
  try {
    const result = finishSession(request.params.id, request.body);
    if (result.error === 'SESSION_NOT_FOUND') return response.status(404).json({ ok: false, error: { code: result.error, message: result.message } });
    if (result.error === 'COMPLETED_RUN_CONFLICT' || result.error === 'SESSION_NOT_RUNNING') return response.status(409).json({ ok: false, error: { code: result.error, message: result.message } });
    if (result.error) return response.status(422).json({ ok: false, error: { code: result.error, message: result.message } });
    return response.json({ ok: true, data: result });
  } catch (error) { return next(error); }
});
