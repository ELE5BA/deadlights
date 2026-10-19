import { Router } from 'express';
import { getLeaderboard } from '../services/leaderboardService.js';
export const leaderboardRouter = Router();
leaderboardRouter.get('/', (request, response, next) => { try { const parsed = Number.parseInt(request.query.limit, 10); response.json({ ok: true, data: { entries: getLeaderboard(Number.isNaN(parsed) ? 10 : parsed) } }); } catch (error) { next(error); } });
