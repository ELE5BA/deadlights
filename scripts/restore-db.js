import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { databasePath } from '../server/db/index.js';

const source = process.argv[2];
const destination = process.argv[3];
if (!source || !destination) throw new Error('Usage: node scripts/restore-db.js <verified-backup.sqlite> <separate-test-destination.sqlite>');
const sourcePath = path.resolve(source); const destinationPath = path.resolve(destination);
if (!fs.existsSync(sourcePath)) throw new Error('The specified backup file does not exist.');
if (destinationPath === databasePath) throw new Error('Refusing to overwrite the active database. Restore to a separate test path first.');
if (fs.existsSync(destinationPath)) throw new Error('Destination already exists. Choose a new, empty test path.');
fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
const sourceDb = new Database(sourcePath, { readonly: true });
await sourceDb.backup(destinationPath);
sourceDb.close();
if (!fs.statSync(destinationPath).size) throw new Error('Restore output is empty.');
console.log(`Restored test copy: ${destinationPath}`);
