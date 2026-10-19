PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS player_card_fragments (
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  creature_id TEXT NOT NULL REFERENCES creatures(id),
  fragments_count INTEGER NOT NULL DEFAULT 0 CHECK (fragments_count >= 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (player_id, creature_id)
);

CREATE TABLE IF NOT EXISTS game_sessions_v2 (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id),
  run_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('running','completed','abandoned','local_only')),
  started_at TEXT NOT NULL,
  ended_at TEXT,
  duration_ms INTEGER NOT NULL DEFAULT 0 CHECK (duration_ms >= 0),
  survival_seconds REAL NOT NULL DEFAULT 0 CHECK (survival_seconds >= 0 AND survival_seconds <= 400),
  distance_m REAL NOT NULL DEFAULT 0 CHECK (distance_m >= 0),
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
  shards_collected INTEGER NOT NULL DEFAULT 0 CHECK (shards_collected >= 0),
  rare_bonus_count INTEGER NOT NULL DEFAULT 0 CHECK (rare_bonus_count >= 0),
  milestones_reached INTEGER NOT NULL DEFAULT 0,
  stages_cleared INTEGER NOT NULL DEFAULT 0 CHECK (stages_cleared BETWEEN 0 AND 6),
  fragments_collected INTEGER NOT NULL DEFAULT 0 CHECK (fragments_collected >= 0),
  collisions_count INTEGER NOT NULL DEFAULT 0 CHECK (collisions_count >= 0),
  end_reason TEXT,
  config_version TEXT NOT NULL REFERENCES config_versions(version_id),
  saved_at TEXT
);

INSERT INTO game_sessions_v2 (id, player_id, run_token, status, started_at, ended_at, duration_ms, survival_seconds, distance_m, score, shards_collected, rare_bonus_count, milestones_reached, stages_cleared, fragments_collected, collisions_count, end_reason, config_version, saved_at)
SELECT id, player_id, run_token, status, started_at, ended_at, duration_ms, survival_seconds, distance_m, score, shards_collected, rare_bonus_count, milestones_reached, 0, 0, collisions_count, end_reason, config_version, saved_at FROM game_sessions;

DROP TABLE game_sessions;
ALTER TABLE game_sessions_v2 RENAME TO game_sessions;

CREATE INDEX IF NOT EXISTS idx_sessions_player_score ON game_sessions(player_id, status, score DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_ended_at ON game_sessions(ended_at);
CREATE INDEX IF NOT EXISTS idx_sessions_config ON game_sessions(config_version);

CREATE TABLE IF NOT EXISTS game_events_v2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_key TEXT NOT NULL,
  elapsed_ms INTEGER NOT NULL CHECK (elapsed_ms >= 0 AND elapsed_ms <= 400000),
  lane_index INTEGER CHECK (lane_index IS NULL OR lane_index BETWEEN 0 AND 2),
  amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
  created_at TEXT NOT NULL
);

INSERT INTO game_events_v2 (id, session_id, event_type, entity_type, entity_key, elapsed_ms, lane_index, amount, created_at)
SELECT id, session_id, event_type, entity_type, entity_key, elapsed_ms, lane_index, amount, created_at FROM game_events;

DROP TABLE game_events;
ALTER TABLE game_events_v2 RENAME TO game_events;

CREATE INDEX IF NOT EXISTS idx_events_session_type ON game_events(session_id, event_type);
CREATE INDEX IF NOT EXISTS idx_events_entity_type ON game_events(entity_key, event_type);

PRAGMA foreign_keys = ON;
