import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '../..');
export const dataDirectory = path.join(projectRoot, 'data');
// DEADLIGHTS_DB_PATH lets tests run against a throwaway database instead of the booth data.
export const databasePath = process.env.DEADLIGHTS_DB_PATH
  ? path.resolve(process.env.DEADLIGHTS_DB_PATH)
  : path.join(dataDirectory, 'deadlights.sqlite');

let db;

export function getDatabase() {
  if (db) return db;
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  db = new Database(databasePath);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = FULL');
  db.pragma('busy_timeout = 5000');
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = undefined;
  }
}
