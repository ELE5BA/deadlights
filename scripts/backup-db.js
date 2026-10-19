import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { dataDirectory, databasePath } from '../server/db/index.js';

if (!fs.existsSync(databasePath)) throw new Error('No local database exists to back up.');
const backupDirectory = path.join(dataDirectory, 'backups');
fs.mkdirSync(backupDirectory, { recursive: true });
const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const destination = path.join(backupDirectory, `deadlights-${stamp}.sqlite`);
const db = new Database(databasePath, { readonly: true });
await db.backup(destination);
db.close();
console.log(`Backup created: ${path.basename(destination)}`);
