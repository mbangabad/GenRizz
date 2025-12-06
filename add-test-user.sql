-- Quick script to add yourself to allowed users
-- Run this in Supabase SQL Editor after schema is deployed

-- Option 1: Add your email to allowed_users (replace with your email)
INSERT INTO allowed_users (email) 
VALUES ('your-email@example.com')
ON CONFLICT (email) DO NOTHING;

-- Option 2: Create a test invite code
INSERT INTO invite_codes (code, max_uses, status) 
VALUES ('BETA2024', 1000, 'active')
ON CONFLICT (code) DO NOTHING;

-- Option 3: If you're already logged in, add yourself to beta_access
-- (Replace 'your-user-id' with your actual auth.users id)
-- INSERT INTO beta_access (user_id, email, code_used)
-- VALUES ('your-user-id', 'your-email@example.com', 'BETA2024')
-- ON CONFLICT (user_id) DO NOTHING;

