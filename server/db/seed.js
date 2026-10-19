import { GAME_CONFIG, GAME_CONFIG_NOTES } from '../../shared/gameConfig.js';
import { getDatabase, closeDatabase } from './index.js';
import { runMigrations } from './migrate.js';

const catalog = [
  ['mossbyte', 'Mossbyte', 'starter', 0, 'A tiny moss-covered stone sprite with cyan eyes.', '#43D9F2', 'mossbyte', 1],
  ['lantern-hare', 'Lantern Hare', 'common', 6, 'A long-eared shadow animal with a warm lantern belly.', '#F7C56B', 'lantern-hare', 2],
  ['static-moth', 'Static Moth', 'common', 10, 'An angular moth with electric cyan wing veins.', '#43D9F2', 'static-moth', 3],
  ['velvet-wisp', 'Velvet Wisp', 'uncommon', 14, 'A floating draped ghost with a magenta core.', '#E94462', 'velvet-wisp', 4],
  ['clockwork-crow', 'Clockwork Crow', 'uncommon', 18, 'A brass-feather bird with a rotating eye disc.', '#F7C56B', 'clockwork-crow', 5],
  ['grinfin', 'Grinfin', 'rare', 24, 'A playful rift creature with a crescent grin.', '#43D9F2', 'grinfin', 6],
  ['moonjaw', 'Moonjaw', 'rare', 30, 'A chunky moon-stone beast with gold cracks.', '#F7C56B', 'moonjaw', 7],
  ['the-tethered', 'The Tethered', 'mythic', 40, 'An original balloon-shadow entity from the rift.', '#E94462', 'the-tethered', 8],
];

export function seedDatabase() {
  runMigrations();
  const db = getDatabase();
  const now = new Date().toISOString();
  db.prepare('INSERT OR IGNORE INTO config_versions (version_id, notes, config_json, created_at) VALUES (?, ?, ?, ?)')
    .run(GAME_CONFIG.version, GAME_CONFIG_NOTES, JSON.stringify(GAME_CONFIG), now);
  const insertCreature = db.prepare(`INSERT OR IGNORE INTO creatures
    (id, name, rarity, shard_cost, description, color_hex, art_key, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  db.transaction(() => catalog.forEach((creature) => insertCreature.run(...creature)))();
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1].replaceAll('\\', '/')}`).href) {
  seedDatabase();
  closeDatabase();
  console.log('Database migrations and seed data are ready.');
}
