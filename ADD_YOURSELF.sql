-- Add yourself to allowed users
-- Replace 'YOUR_EMAIL@example.com' with your actual email

INSERT INTO allowed_users (email) 
VALUES ('YOUR_EMAIL@example.com')
ON CONFLICT (email) DO NOTHING;

-- OR create an invite code (easier for testing)
INSERT INTO invite_codes (code, max_uses, status) 
VALUES ('BETA2024', 1000, 'active')
ON CONFLICT (code) DO NOTHING;

