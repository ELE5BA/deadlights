import { Router } from 'express';
import { getDatabase } from '../db/index.js';
import { GAME_CONFIG } from '../../shared/gameConfig.js';

export const catalogRouter = Router();
catalogRouter.get('/', (_request, response, next) => {
  try {
    const creatures = getDatabase().prepare('SELECT id, name, rarity, shard_cost AS shardCost, description, color_hex AS colorHex, art_key AS artKey, sort_order AS sortOrder FROM creatures WHERE active = 1 ORDER BY sort_order').all();
    response.json({ ok: true, data: { creatures, configVersion: GAME_CONFIG.version } });
  } catch (error) { next(error); }
});
