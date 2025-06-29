-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at VARCHAR(30) NOT NULL
);

-- Journal Entries table
CREATE TABLE journal_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    content TEXT,
    location GEOMETRY(POINT, 4326),
    photo_url VARCHAR(255),
    ai_summary TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    shareable_link VARCHAR(36),
    created_at VARCHAR(30) NOT NULL
);

-- Index for geospatial queries
CREATE INDEX journal_entries_location_idx ON journal_entries USING GIST (location);