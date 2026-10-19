PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS config_versions (
  version_id TEXT PRIMARY KEY,
  notes TEXT NOT NULL,
  config_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  nickname_normalized TEXT NOT NULL UNIQUE,
  recovery_code_hash TEXT UNIQUE,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player_wallets (
  player_id TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  shards_balance INTEGER NOT NULL DEFAULT 0 CHECK (shards_balance >= 0),
  shards_earned_total INTEGER NOT NULL DEFAULT 0 CHECK (shards_earned_total >= 0),
  shards_spent_total INTEGER NOT NULL DEFAULT 0 CHECK (shards_spent_total >= 0),
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS creatures (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('starter','common','uncommon','rare','mythic')),
  shard_cost INTEGER NOT NULL CHECK (shard_cost >= 0),
  description TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  art_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1))
);

CREATE TABLE IF NOT EXISTS player_collections (
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  creature_id TEXT NOT NULL REFERENCES creatures(id),
  unlocked_at TEXT NOT NULL,
  shards_paid INTEGER NOT NULL DEFAULT 0 CHECK (shards_paid >= 0),
  PRIMARY KEY (player_id, creature_id)
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id),
  run_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('running','completed','abandoned','local_only')),
  started_at TEXT NOT NULL,
  ended_at TEXT,
  duration_ms INTEGER NOT NULL DEFAULT 0 CHECK (duration_ms >= 0),
  survival_seconds REAL NOT NULL DEFAULT 0 CHECK (survival_seconds >= 0 AND survival_seconds <= 60),
  distance_m REAL NOT NULL DEFAULT 0 CHECK (distance_m >= 0),
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
  shards_collected INTEGER NOT NULL DEFAULT 0 CHECK (shards_collected >= 0),
  rare_bonus_count INTEGER NOT NULL DEFAULT 0 CHECK (rare_bonus_count >= 0),
  milestones_reached INTEGER NOT NULL DEFAULT 0 CHECK (milestones_reached BETWEEN 0 AND 3),
  collisions_count INTEGER NOT NULL DEFAULT 0 CHECK (collisions_count >= 0),
  end_reason TEXT,
  config_version TEXT NOT NULL REFERENCES config_versions(version_id),
  saved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_player_score ON game_sessions(player_id, status, score DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_ended_at ON game_sessions(ended_at);
CREATE INDEX IF NOT EXISTS idx_sessions_config ON game_sessions(config_version);

CREATE TABLE IF NOT EXISTS game_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('obstacle_spawn','collision','shard_pickup','rare_pickup','milestone','jump','lane_change')),
  entity_type TEXT NOT NULL,
  entity_key TEXT NOT NULL,
  elapsed_ms INTEGER NOT NULL CHECK (elapsed_ms >= 0 AND elapsed_ms <= 65000),
  lane_index INTEGER CHECK (lane_index IS NULL OR lane_index BETWEEN 0 AND 2),
  amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_session_type ON game_events(session_id, event_type);
CREATE INDEX IF NOT EXISTS idx_events_entity_type ON game_events(entity_key, event_type);

CREATE TABLE IF NOT EXISTS admin_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  details_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
