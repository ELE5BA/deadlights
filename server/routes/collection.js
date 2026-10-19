import { Router } from 'express';
import { getCollection, unlockCreature, craftWithFragments } from '../services/collectionService.js';

export const collectionRouter = Router();

collectionRouter.get('/players/:id/collection', (request, response, next) => {
  try {
    const result = getCollection(request.params.id);
    return result.error ? response.status(404).json({ ok: false, error: { code: result.error, message: 'Player not found.' } }) : response.json({ ok: true, data: result });
  } catch (error) { return next(error); }
});

collectionRouter.post('/players/:id/collection/:creatureId/unlock', (request, response, next) => {
  try {
    const result = unlockCreature(request.params.id, request.params.creatureId);
    if (result.error === 'NOT_FOUND') return response.status(404).json({ ok: false, error: { code: result.error, message: 'Card not found.' } });
    if (result.error === 'ALREADY_OWNED') return response.status(409).json({ ok: false, error: { code: result.error, message: 'Already in your collection.' } });
    if (result.error === 'INSUFFICIENT_SHARDS') return response.status(400).json({ ok: false, error: { code: result.error, message: 'Not enough Rift Shards.' } });
    return response.json({ ok: true, data: result });
  } catch (error) { return next(error); }
});

collectionRouter.post('/players/:id/collection/:creatureId/craft', (request, response, next) => {
  try {
    const result = craftWithFragments(request.params.id, request.params.creatureId);
    if (result.error === 'NOT_FOUND') return response.status(404).json({ ok: false, error: { code: result.error, message: 'Card not found.' } });
    if (result.error === 'ALREADY_OWNED') return response.status(409).json({ ok: false, error: { code: result.error, message: 'Already in your collection.' } });
    if (result.error === 'INSUFFICIENT_FRAGMENTS') return response.status(400).json({ ok: false, error: { code: result.error, message: 'Not enough Card Fragments.' } });
    return response.json({ ok: true, data: result });
  } catch (error) { return next(error); }
});
