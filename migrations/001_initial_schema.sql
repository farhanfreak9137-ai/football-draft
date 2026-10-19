-- PostgreSQL Schema Migration: 001_initial_schema.sql
-- Historical Football Draft Game Engine

-- 1. Verified Historical Sources
CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    access_date DATE NOT NULL,
    reliability_tier VARCHAR(32) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Real-World Player Identities (Enforces Uniqueness across all historical editions)
CREATE TABLE IF NOT EXISTS player_identities (
    id VARCHAR(64) PRIMARY KEY,
    canonical_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(128) NOT NULL,
    primary_position VARCHAR(16) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Historical Team Editions (20 National Teams, 20 Clubs)
CREATE TABLE IF NOT EXISTS team_editions (
    id VARCHAR(64) PRIMARY KEY,
    team_id VARCHAR(64) NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    edition_type VARCHAR(16) NOT NULL CHECK (edition_type IN ('national', 'club')),
    year_or_season VARCHAR(32) NOT NULL,
    competition VARCHAR(255) NOT NULL,
    achievement VARCHAR(255) NOT NULL,
    coach VARCHAR(255) NOT NULL,
    tactical_formation VARCHAR(32) NOT NULL,
    verified_source_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Verified Historical Player Versions (Specific Tournament Squad or Club Season form)
CREATE TABLE IF NOT EXISTS player_versions (
    id VARCHAR(64) PRIMARY KEY,
    identity_id VARCHAR(64) NOT NULL REFERENCES player_identities(id) ON DELETE CASCADE,
    edition_id VARCHAR(64) NOT NULL REFERENCES team_editions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    squad_number INTEGER NOT NULL,
    ovr INTEGER NOT NULL CHECK (ovr >= 1 AND ovr <= 100),
    natural_positions JSONB NOT NULL DEFAULT '[]'::jsonb,
    secondary_positions JSONB NOT NULL DEFAULT '[]'::jsonb,
    has_legend_seal BOOLEAN NOT NULL DEFAULT FALSE,
    legend_seal_reason TEXT,
    stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    rating_rationale TEXT NOT NULL,
    methodology_version VARCHAR(16) NOT NULL DEFAULT '1.0',
    reviewer VARCHAR(64) NOT NULL DEFAULT 'Human Reviewer',
    review_date DATE NOT NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'verified',
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Game Rooms & Active Multiplayer Sessions
CREATE TABLE IF NOT EXISTS rooms (
    room_code VARCHAR(16) PRIMARY KEY,
    status VARCHAR(32) NOT NULL,
    mode VARCHAR(16) NOT NULL,
    pool_type VARCHAR(16) NOT NULL,
    state_json JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Match Simulations & Final Records
CREATE TABLE IF NOT EXISTS match_simulations (
    match_id VARCHAR(64) PRIMARY KEY,
    room_code VARCHAR(16) REFERENCES rooms(room_code) ON DELETE SET NULL,
    seed BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL,
    host_score INTEGER NOT NULL DEFAULT 0,
    guest_score INTEGER NOT NULL DEFAULT 0,
    winner VARCHAR(16),
    win_method VARCHAR(32),
    simulation_state_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_versions_identity ON player_versions(identity_id);
CREATE INDEX IF NOT EXISTS idx_player_versions_edition ON player_versions(edition_id);
CREATE INDEX IF NOT EXISTS idx_rooms_expires_at ON rooms(expires_at);
CREATE INDEX IF NOT EXISTS idx_team_editions_type ON team_editions(edition_type);

