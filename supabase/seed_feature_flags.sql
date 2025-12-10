-- Seed defaults for feature flags used by the Admin panel
INSERT INTO feature_flags (key, value) VALUES
  ('BLITZ', true),
  ('REMATCH', true),
  ('SWIPE', true),
  ('DAILY_DROP', true),
  ('EVENTS', true),
  ('ADS_RECOVERY_ONLY', true),
  ('ROAST_YOURSELF', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
