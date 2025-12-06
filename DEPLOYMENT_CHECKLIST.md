# 🚀 Deployment Checklist

## What I Need From You

### Option 1: You Have Accounts Already
If you already have Supabase and Vercel accounts, I need:

1. **Supabase Project URL** (e.g., `https://xxxxx.supabase.co`)
2. **Supabase Anon Key** (starts with `eyJhbGc...`)
3. **Vercel Account** - Connected to GitHub
4. **GitHub Repository** - Is your code pushed to GitHub?

### Option 2: I'll Guide You Through Setup
If you don't have accounts yet, I can:
- Guide you through creating Supabase project
- Help you run the database schema
- Guide you through Vercel deployment
- Set up all environment variables

---

## Quick Deployment Steps

### Step 1: Supabase Setup (15-20 min)

1. **Create Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Name: `genrizz`
   - Choose region
   - Save database password

2. **Run Schema**
   - Go to SQL Editor
   - Copy contents of `supabase/schema.sql`
   - Paste and run

3. **Create Storage Buckets**
   - Storage → Create bucket: `uploads` (public)
   - Storage → Create bucket: `private-uploads` (private)

4. **Get API Keys**
   - Settings → API
   - Copy Project URL and anon key

### Step 2: Vercel Deployment (10-15 min)

1. **Connect Repository**
   - Go to https://vercel.com
   - Import your GitHub repo

2. **Configure Build**
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_APP_URL=https://your-project.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build
   - Copy deployment URL

### Step 3: Update Supabase (5 min)

1. **Update Redirect URLs**
   - Supabase → Authentication → Settings
   - Add your Vercel URL to redirect URLs
   - Update Site URL

---

## What Would You Like To Do?

**A)** I have Supabase/Vercel accounts - provide credentials and I'll help configure  
**B)** Guide me through creating accounts and setting up  
**C)** Just give me the step-by-step instructions (I'll do it myself)

Let me know which option you prefer!

