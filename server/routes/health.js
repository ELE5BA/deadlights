import { Router } from 'express';
import { getDatabase } from '../db/index.js';
import { GAME_CONFIG } from '../../shared/gameConfig.js';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  try {
    getDatabase().prepare('SELECT 1').get();
    response.json({ ok: true, data: { appVersion: '0.1.0', dbStatus: 'ready', configVersion: GAME_CONFIG.version } });
  } catch {
    response.status(503).json({ ok: false, error: { code: 'DATABASE_UNAVAILABLE', message: 'The local database is not ready.' } });
  }
});
