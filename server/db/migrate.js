import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDatabase } from './index.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.join(here, 'migrations');

export function runMigrations() {
  const db = getDatabase();
  db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL)');
  const completed = new Set(db.prepare('SELECT id FROM schema_migrations').all().map(({ id }) => id));
  const files = fs.readdirSync(migrationsDirectory).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    if (completed.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDirectory, file), 'utf8');
    db.transaction(() => {
      db.exec(sql);
      db.prepare('INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)').run(file, new Date().toISOString());
    })();
  }
}
