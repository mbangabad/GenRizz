# ⚡ Quick Fix - 2 Steps

## Step 1: Deploy Schema (if not done)

1. Go to: https://supabase.com/dashboard/project/ifzdbimmruhhuepymgph/sql/new
2. Copy ALL of `supabase/schema.sql` (482 lines)
3. Paste and click "Run"
4. Wait for success message

## Step 2: Add Yourself to Allowed Users

**After schema is deployed, run this SQL:**

```sql
-- Add your email (replace with your actual email)
INSERT INTO allowed_users (email) 
VALUES ('YOUR_EMAIL_HERE')
ON CONFLICT (email) DO NOTHING;

-- OR create an invite code
INSERT INTO invite_codes (code, max_uses, status) 
VALUES ('BETA2024', 1000, 'active')
ON CONFLICT (code) DO NOTHING;
```

**Then:**
1. Go to your Vercel app: https://genrizz-ifbe3z7qw-enthalpy.vercel.app
2. Click "Authenticate"
3. Sign up/login with the email you added
4. If using invite code, enter "BETA2024"

---

**Which email should I add?** Tell me and I'll generate the exact SQL for you.

