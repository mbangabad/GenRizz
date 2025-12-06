# 🚀 Deploy Now - Step by Step

Great! Both CLIs are available via `npx`. Let's deploy!

## ✅ What We Have

- ✅ Supabase CLI: `npx supabase`
- ✅ Vercel CLI: `npx vercel`
- ✅ Build successful
- ✅ Schema ready: `supabase/schema.sql`
- ✅ Vercel config: `vercel.json`

## 🎯 Deployment Steps

### Step 1: Supabase Setup

#### 1.1 Login to Supabase
```bash
npx supabase login
```
This will open a browser to authenticate.

#### 1.2 Create or Link Project

**Option A: Create New Project**
```bash
npx supabase projects create genrizz
# Choose region, set password
# Note the project reference ID
```

**Option B: Link Existing Project**
```bash
npx supabase link --project-ref your-project-ref
```

#### 1.3 Deploy Database Schema
```bash
# Option 1: Push schema (if using Supabase migrations)
npx supabase db push

# Option 2: Execute SQL file directly
npx supabase db execute -f supabase/schema.sql
```

#### 1.4 Get API Keys
```bash
npx supabase status
# This shows your project URL and keys
```

#### 1.5 Create Storage Buckets
You'll need to do this in the Supabase dashboard:
- Go to Storage → Create bucket: `uploads` (public)
- Go to Storage → Create bucket: `private-uploads` (private)

---

### Step 2: Vercel Deployment

#### 2.1 Login to Vercel
```bash
npx vercel login
```

#### 2.2 Deploy (First Time)
```bash
npx vercel
```
This will:
- Ask to link to existing project or create new
- Detect Vite framework
- Ask for environment variables

#### 2.3 Add Environment Variables
```bash
npx vercel env add VITE_SUPABASE_URL
npx vercel env add VITE_SUPABASE_ANON_KEY
npx vercel env add VITE_APP_URL
```

Or add them in Vercel dashboard:
- Go to Project → Settings → Environment Variables

#### 2.4 Deploy to Production
```bash
npx vercel --prod
```

---

## 🤖 Automated Deployment

I can run these commands for you! Just tell me:

1. **Do you have Supabase account?** (Yes/No)
2. **Do you have Vercel account?** (Yes/No)
3. **Do you want me to run the commands?** (Yes/No)

If yes, I'll:
- Check login status
- Guide you through authentication if needed
- Deploy database schema
- Deploy to Vercel
- Set up environment variables

---

## 📝 Quick Commands Reference

```bash
# Supabase
npx supabase login
npx supabase projects create genrizz
npx supabase link --project-ref xxx
npx supabase db push
npx supabase status

# Vercel
npx vercel login
npx vercel
npx vercel --prod
npx vercel env add VARIABLE_NAME
```

---

## 🎯 Ready to Deploy?

**Tell me:**
- "Yes, deploy now" - I'll guide you through each step
- "I'll do it manually" - I'll provide the exact commands
- "I need to create accounts first" - I'll guide you through account creation

What would you like to do?

