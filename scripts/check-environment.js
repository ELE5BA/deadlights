import fs from 'node:fs';
import { databasePath } from '../server/db/index.js';

const major = Number(process.versions.node.split('.')[0]);
if (major !== 22) {
  console.error(`Expected Node 22; found ${process.version}.`);
  process.exitCode = 1;
} else {
  console.log(`Node ${process.version} matches the project baseline.`);
}
console.log(`Local database path: ${databasePath}`);
console.log(fs.existsSync(databasePath) ? 'Database file exists.' : 'Database will be created at first server start.');
