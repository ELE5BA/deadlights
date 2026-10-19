import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runMigrations } from './db/migrate.js';
import { seedDatabase } from './db/seed.js';
import { healthRouter } from './routes/health.js';
import { playersRouter } from './routes/players.js';
import { sessionsRouter } from './routes/sessions.js';
import { collectionRouter } from './routes/collection.js';
import { leaderboardRouter } from './routes/leaderboard.js';
import { catalogRouter } from './routes/catalog.js';
import { adminRouter } from './routes/admin.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { GAME_CONFIG } from '../shared/gameConfig.js';
import { abandonStaleSessions } from './services/maintenanceService.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..');
const isProduction = process.env.NODE_ENV === 'production';

runMigrations();
seedDatabase();
abandonStaleSessions();

export const app = express();
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: isProduction ? undefined : false }));
app.use(express.json({ limit: GAME_CONFIG.apiBodyLimit }));
app.use('/api/health', healthRouter);
app.use('/api/players', playersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api', collectionRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/admin', adminRouter);

if (isProduction) {
  app.use(express.static(path.join(projectRoot, 'dist')));
  app.get('/{*splat}', (_request, response) => response.sendFile(path.join(projectRoot, 'dist', 'index.html')));
}

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 4174);
  app.listen(port, '127.0.0.1', () => console.log(`DEADLIGHTS local server ready at http://127.0.0.1:${port}`));
}
