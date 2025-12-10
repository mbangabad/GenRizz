-- GenRizz Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Core User Data
-- ============================================

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  hearts INTEGER DEFAULT 5,
  is_premium BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress per game
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  total_plays INTEGER DEFAULT 0,
  highest_score INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  last_played_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- User streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  freeze_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- Gameplay & Content
-- ============================================

-- Questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'swipe', 'audio', 'ranking', 'slider', 'matching', 'would_you_rather')),
  question TEXT NOT NULL,
  options JSONB,
  correct_index INTEGER,
  explanation TEXT,
  difficulty INTEGER DEFAULT 5 CHECK (difficulty >= 1 AND difficulty <= 10),
  times_shown INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  xp_earned INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  time_taken INTEGER,
  challenge_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User submitted questions (UGC)
CREATE TABLE IF NOT EXISTS user_submitted_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  correct_index INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connection puzzles (daily puzzles)
CREATE TABLE IF NOT EXISTS connection_puzzles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  groups JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Social & Viral
-- ============================================

-- Squads (teams/clans)
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  join_code TEXT UNIQUE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Squad members
CREATE TABLE IF NOT EXISTS squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(squad_id, user_id)
);

-- Friendships
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Challenges (PvP)
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenger_name TEXT,
  challenger_percentage INTEGER,
  challenged_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  challenged_name TEXT,
  game_id TEXT NOT NULL,
  challenge_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Economy & System
-- ============================================

-- Daily challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT NOT NULL,
  date DATE NOT NULL UNIQUE,
  xp_multiplier DECIMAL DEFAULT 2.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily scores
CREATE TABLE IF NOT EXISTS daily_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  date DATE NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id, date)
);

-- Daily play counts
CREATE TABLE IF NOT EXISTS daily_play_counts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Daily rewards
CREATE TABLE IF NOT EXISTS daily_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  reward_type TEXT CHECK (reward_type IN ('xp', 'hearts', 'powerup')),
  reward_value INTEGER,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

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

-- Rematch challenges (share/rematch links)
CREATE TABLE IF NOT EXISTS rematch_challenges (
  id TEXT PRIMARY KEY,
  game_id TEXT,
  challenger_id TEXT,
  challenger_name TEXT,
  challenger_score INTEGER,
  responder_id TEXT,
  responder_name TEXT,
  responder_score INTEGER,
  status TEXT DEFAULT 'pending',
  responses JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('hearts', 'powerup', 'subscription')),
  item_id TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Power ups
CREATE TABLE IF NOT EXISTS power_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('skip', 'hint', 'time_freeze', 'streak_freeze')),
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements (master list)
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id),
  CHECK (referrer_id != referred_id)
);

-- Reports (moderation)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('question', 'user', 'message')),
  content_id UUID NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform stats
CREATE TABLE IF NOT EXISTS platform_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value JSONB,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_name, date)
);

-- ============================================
-- Beta Access & Admin
-- ============================================

-- Allowed users (legacy)
CREATE TABLE IF NOT EXISTS allowed_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invite codes
CREATE TABLE IF NOT EXISTS invite_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  max_uses INTEGER DEFAULT 0, -- 0 = unlimited
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disabled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beta access
CREATE TABLE IF NOT EXISTS beta_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  code_used TEXT,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- User progress indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_game ON user_progress(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);

-- Scores indexes
CREATE INDEX IF NOT EXISTS idx_scores_user_game ON scores(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_scores_user ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_game ON scores(game_id);
CREATE INDEX IF NOT EXISTS idx_scores_created ON scores(created_at DESC);

-- Questions indexes
CREATE INDEX IF NOT EXISTS idx_questions_game ON questions(game_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);

-- Challenges indexes
CREATE INDEX IF NOT EXISTS idx_challenges_code ON challenges(challenge_code);
CREATE INDEX IF NOT EXISTS idx_challenges_challenger ON challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_challenges_challenged ON challenges(challenged_id);

-- Squads indexes
CREATE INDEX IF NOT EXISTS idx_squads_code ON squads(join_code);
CREATE INDEX IF NOT EXISTS idx_squad_members_squad ON squad_members(squad_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_user ON squad_members(user_id);

-- Friendships indexes
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

-- Daily tables indexes
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_date ON daily_scores(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_play_counts_user_date ON daily_play_counts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_rewards_user_date ON daily_rewards(user_id, date);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_submitted_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_play_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowed_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE beta_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE rematch_challenges ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can read/update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User progress: Users can manage their own progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage own progress" ON user_progress;
CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Questions: Public read, admin write
DROP POLICY IF EXISTS "Questions are publicly readable" ON questions;
CREATE POLICY "Questions are publicly readable" ON questions
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage questions" ON questions;
CREATE POLICY "Admins can manage questions" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Scores: Users can view their own and public leaderboards
DROP POLICY IF EXISTS "Users can view own scores" ON scores;
CREATE POLICY "Users can view own scores" ON scores
  FOR SELECT USING (auth.uid() = user_id OR true); -- Public for leaderboards
DROP POLICY IF EXISTS "Users can create own scores" ON scores;
CREATE POLICY "Users can create own scores" ON scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Challenges: Users can view and manage their own challenges
DROP POLICY IF EXISTS "Challenges are publicly readable" ON challenges;
CREATE POLICY "Challenges are publicly readable" ON challenges
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create challenges" ON challenges;
CREATE POLICY "Users can create challenges" ON challenges
  FOR INSERT WITH CHECK (auth.uid() = challenger_id);
DROP POLICY IF EXISTS "Users can update own challenges" ON challenges;
CREATE POLICY "Users can update own challenges" ON challenges
  FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- Rematch challenges: readable by all, insert/update by challenger or responder
DROP POLICY IF EXISTS "Rematches are publicly readable" ON rematch_challenges;
CREATE POLICY "Rematches are publicly readable" ON rematch_challenges
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create rematch challenge" ON rematch_challenges;
CREATE POLICY "Users can create rematch challenge" ON rematch_challenges
  FOR INSERT WITH CHECK (auth.uid() = challenger_id OR challenger_id IS NULL);
DROP POLICY IF EXISTS "Users can update rematch challenge" ON rematch_challenges;
CREATE POLICY "Users can update rematch challenge" ON rematch_challenges
  FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = responder_id OR auth.uid() IS NULL);

-- Add more policies as needed for other tables...
-- (This is a simplified version - you may want more granular policies)

-- ============================================
-- Functions & Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_power_ups_updated_at ON power_ups;
CREATE TRIGGER update_power_ups_updated_at
  BEFORE UPDATE ON power_ups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rematch_challenges_updated_at ON rematch_challenges;
CREATE TRIGGER update_rematch_challenges_updated_at
  BEFORE UPDATE ON rematch_challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Feature Flags (for Admin sync)
-- ============================================
CREATE TABLE IF NOT EXISTS feature_flags (
  key TEXT PRIMARY KEY,
  value BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Minimal RLS: allow authenticated admins; fallback to anon read-only if needed
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS feature_flags_read ON feature_flags;
CREATE POLICY feature_flags_read ON feature_flags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS feature_flags_write ON feature_flags;
CREATE POLICY feature_flags_write ON feature_flags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated')
  TO authenticated;

DROP POLICY IF EXISTS feature_flags_update ON feature_flags;
CREATE POLICY feature_flags_update ON feature_flags
  FOR UPDATE USING (auth.role() = 'authenticated')
  TO authenticated;

COMMENT ON TABLE feature_flags IS 'Admin-managed feature flags synced from the Command Center.';
