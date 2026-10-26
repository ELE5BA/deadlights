-- Migration 003: Add full_name [Last Name, First Name] and section [#Section] to players
ALTER TABLE players ADD COLUMN full_name TEXT;
ALTER TABLE players ADD COLUMN section TEXT;

CREATE INDEX IF NOT EXISTS idx_players_section ON players(section);
CREATE INDEX IF NOT EXISTS idx_players_full_name ON players(full_name);
