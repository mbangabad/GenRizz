#!/usr/bin/env bash
set -euo pipefail

# Adjust this path if your repo lives elsewhere
REPO="/Users/cortex/klogW/ventures/games/genRizz"
cd "$REPO"

# Create migration with content safety + events + daily drop tables
MIG="supabase/migrations/$(date +%Y%m%d%H%M%S)_content_safety_events.sql"
cat > "$MIG" <<'SQL'
-- Content Safety Whitelist (admin-managed)
CREATE TABLE IF NOT EXISTS content_safety_whitelist (
  term TEXT PRIMARY KEY,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spotlight / Events playlists (server-configured)
CREATE TABLE IF NOT EXISTS events_playlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  start_date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT TRUE,
  games JSONB, -- array of game_ids or playlist items
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Drop configuration
CREATE TABLE IF NOT EXISTS daily_drop (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Daily Drop',
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  weight_generational INTEGER DEFAULT 1,
  weight_social INTEGER DEFAULT 1,
  weight_personality INTEGER DEFAULT 1,
  weight_humor INTEGER DEFAULT 1,
  last_rotation TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
SQL

echo "📄 Migration written to $MIG"
echo "Push to Supabase when ready (requires supabase CLI configured):"
echo "  supabase db push"
echo "Optional seed examples:"
echo "  supabase db remote commit \"INSERT INTO content_safety_whitelist(term, active) VALUES ('example', true) ON CONFLICT (term) DO NOTHING;\""
echo "Seed Spotlight/Daily Drop via SQL editor or remote commit as needed."
