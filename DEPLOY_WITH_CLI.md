# 🚀 Deploy with CLI Tools

Great! You have Supabase and Vercel CLI installed. Let's use them to deploy!

## Prerequisites Check

✅ Supabase CLI installed  
✅ Vercel CLI installed  
⏳ Need to verify login status

---

## Step 1: Supabase Setup

### Check Supabase CLI Status
```bash
supabase status
```

### If Not Linked:
```bash
# Link to existing project
supabase link --project-ref your-project-ref

# OR create new project
supabase projects create genrizz
```

### Initialize Supabase (if needed)
```bash
supabase init
```

### Deploy Database Schema
```bash
# Option 1: Push schema directly
supabase db push

# Option 2: Run SQL file
supabase db execute -f supabase/schema.sql
```

### Get API Keys
```bash
supabase status
# This will show your project URL and keys
```

---

## Step 2: Vercel Deployment

### Check Vercel Login
```bash
vercel whoami
```

### If Not Logged In:
```bash
vercel login
```

### Deploy to Vercel
```bash
# First deployment (will ask questions)
vercel

# Production deployment
vercel --prod
```

### Add Environment Variables
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_APP_URL
```

---

## Quick Deploy Script

I can create a deployment script that:
1. Checks CLI status
2. Links Supabase project
3. Deploys database schema
4. Deploys to Vercel
5. Sets environment variables

Would you like me to create this script?

