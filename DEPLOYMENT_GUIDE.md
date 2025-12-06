# 🚀 Deployment Guide - Supabase + Vercel

## Prerequisites

Before deploying, you need:

1. **Supabase Account** - https://supabase.com (free tier available)
2. **Vercel Account** - https://vercel.com (free tier available)
3. **GitHub Repository** - Your code should be pushed to GitHub

---

## Part 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name:** `genrizz` (or your preferred name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your users
4. Click **"Create new project"**
5. Wait ~2 minutes for project to initialize

### Step 2: Run Database Schema

1. In Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Open `supabase/schema.sql` from this project
4. Copy the entire file contents
5. Paste into SQL Editor
6. Click **"Run"** (or press `Cmd/Ctrl + Enter`)
7. Verify success - you should see "Success. No rows returned"

### Step 3: Create Storage Buckets

1. Go to **Storage** in left sidebar
2. Click **"Create bucket"**
3. Create `uploads` bucket:
   - **Name:** `uploads`
   - **Public bucket:** ✅ Yes
   - **File size limit:** 10MB
   - Click **"Create bucket"**
4. Create `private-uploads` bucket:
   - **Name:** `private-uploads`
   - **Public bucket:** ❌ No
   - **File size limit:** 10MB
   - Click **"Create bucket"**

### Step 4: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon public** key → This is your `VITE_SUPABASE_ANON_KEY`

### Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Add **Site URL:** `https://your-domain.vercel.app` (update after Vercel deployment)
4. Add **Redirect URLs:**
   - `http://localhost:5174` (for local dev)
   - `https://your-domain.vercel.app` (for production)
   - `https://your-domain.vercel.app/**` (wildcard)

---

## Part 2: Vercel Deployment

### Step 1: Connect GitHub Repository

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the `genRizz` repository

### Step 2: Configure Build Settings

Vercel should auto-detect Vite, but verify:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 3: Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_APP_URL=https://your-project.vercel.app
```

Optional (if using AI/Email features):
```
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_RESEND_API_KEY=re_your-key-here
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Once deployed, copy your deployment URL
4. Update Supabase redirect URLs with your Vercel URL

---

## Part 3: Post-Deployment

### Update Supabase Redirect URLs

1. Go back to Supabase → **Authentication** → **Settings**
2. Update **Site URL** to your Vercel URL
3. Add your Vercel URL to **Redirect URLs**

### Update VITE_APP_URL

1. In Vercel → **Settings** → **Environment Variables**
2. Update `VITE_APP_URL` to your actual Vercel deployment URL
3. Redeploy (or it will auto-update on next deploy)

### Test the Deployment

1. Visit your Vercel URL
2. Try signing up/signing in
3. Test a game
4. Check browser console for errors

---

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` has correct build script

### Authentication Not Working

- Verify Supabase redirect URLs include your Vercel domain
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check browser console for errors

### Database Errors

- Verify schema was run successfully in Supabase
- Check RLS policies are enabled
- Verify table names match your code

---

## Quick Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Storage buckets created
- [ ] API keys copied
- [ ] Vercel project connected to GitHub
- [ ] Environment variables added to Vercel
- [ ] First deployment successful
- [ ] Supabase redirect URLs updated
- [ ] App tested and working

---

## Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Check Supabase logs (Dashboard → Logs)
3. Check browser console for errors
4. Verify all environment variables are set correctly

