# 🚀 Complete Supabase + Vercel Deployment Guide

A comprehensive guide to deploying your React/Vite application with Supabase backend to Vercel.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development](#local-development)
4. [Vercel Deployment](#vercel-deployment)
5. [Environment Variables](#environment-variables)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ installed
- Git repository for your project
- GitHub account (for Vercel integration)
- Email for Supabase account

---

## Supabase Setup

### 1. Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Click **"New Project"**
5. Choose your organization (or create one)
6. Fill in project details:
   - **Name**: `your-app-name`
   - **Database Password**: Use generated password (save it!)
   - **Region**: Choose closest to your users
7. Click **"Create new project"**
8. Wait 2-3 minutes for provisioning

### 2. Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API** in the left sidebar
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

### 3. Create Database Tables

1. Go to **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Paste your SQL schema:

```sql
-- Example: User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example: Posts table
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

4. Click **"Run"** to execute
5. Verify tables appear in **Table Editor**

---

## Local Development

### 1. Install Dependencies

```bash
# Install Supabase client
npm install @supabase/supabase-js

# For TypeScript projects, types are included
```

### 2. Create Environment File

Create `.env.local` in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_URL=http://localhost:5173

# Optional: Feature flags
VITE_ENABLE_AUTH=true
VITE_ENABLE_ANALYTICS=false
```

**Important**: Add `.env.local` to your `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

### 3. Create Supabase Client

Create `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
```

### 4. Test Local Connection

Create a simple test:

```javascript
// src/components/TestConnection.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function TestConnection() {
  const [status, setStatus] = useState('testing...')

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
        
        if (error) throw error
        setStatus('✅ Connected to Supabase!')
      } catch (error) {
        setStatus(`❌ Error: ${error.message}`)
      }
    }

    testConnection()
  }, [])

  return <div>Supabase Status: {status}</div>
}
```

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and verify the connection works.

---

## Vercel Deployment

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Deploy via GitHub (Recommended)

**Option A: Through Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables (see next section)
7. Click **"Deploy"**

**Option B: Through CLI**

```bash
# From your project root
vercel

# Follow the prompts:
# ? Set up and deploy "~/your-project"? Y
# ? Which scope? Your username/team
# ? Link to existing project? N
# ? What's your project's name? your-app-name
# ? In which directory is your code located? ./
```

---

## Environment Variables

### 1. Add to Vercel Dashboard

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Production, Preview, Development |
| `VITE_APP_URL` | `https://your-app.vercel.app` | Production |
| `VITE_APP_URL` | `https://your-app-git-branch.vercel.app` | Preview |
| `VITE_APP_URL` | `http://localhost:5173` | Development |

### 2. Add via CLI

```bash
# Production
vercel env add VITE_SUPABASE_URL production
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste your anon key when prompted

# Preview (for PR deployments)
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_ANON_KEY preview

# Development (for vercel dev)
vercel env add VITE_SUPABASE_URL development
vercel env add VITE_SUPABASE_ANON_KEY development
```

### 3. Update Supabase Auth Settings

1. Go to Supabase dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URLs:

**Site URL**: `https://your-app.vercel.app`

**Redirect URLs** (add all these):
```
http://localhost:5173/**
https://your-app.vercel.app/**
https://your-app-git-*.vercel.app/**
https://*.your-app.vercel.app/**
```

---

## Testing & Verification

### 1. Build Locally First

```bash
# Test production build locally
npm run build
npm run preview

# Visit http://localhost:4173 and test
```

### 2. Deploy and Test

```bash
# Redeploy with new env vars
vercel --prod

# Or trigger redeploy in dashboard
```

### 3. Test Production App

1. Visit your Vercel URL
2. Check browser console for errors
3. Test Supabase features:
   - Database queries
   - Authentication (if implemented)
   - Real-time subscriptions (if implemented)

### 4. Monitor Deployments

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs your-deployment-url
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. "Missing Supabase environment variables"

**Problem**: App can't connect to Supabase

**Solution**:
```bash
# Check if env vars are set
vercel env ls

# Add missing variables
vercel env add VITE_SUPABASE_URL production
```

#### 2. CORS Errors

**Problem**: Supabase rejecting requests from Vercel domain

**Solution**: Add your Vercel domain to Supabase **Authentication** → **URL Configuration**

#### 3. Environment Variables Not Updating

**Problem**: Changes to env vars not reflected in app

**Solution**:
```bash
# Redeploy to pick up new env vars
vercel --prod

# Or in dashboard: Deployments → Redeploy
```

#### 4. Build Failures

**Problem**: Vercel build failing

**Check**:
- Build command is correct: `npm run build`
- Output directory is correct: `dist`
- All dependencies in `package.json`
- No environment variables used at build time without `VITE_` prefix

#### 5. Database Connection Issues

**Problem**: Can't connect to Supabase database

**Debug**:
```javascript
// Add to your app temporarily
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
```

#### 6. Authentication Redirects

**Problem**: Auth redirects failing

**Solution**:
1. Check Supabase **Authentication** → **URL Configuration**
2. Ensure all Vercel URLs are added
3. Include wildcard patterns for preview deployments

---

## Best Practices

### 1. Security

```bash
# Never commit these files
echo ".env.local" >> .gitignore
echo ".env" >> .gitignore

# Use environment-specific values
# Production: Real Supabase project
# Preview: Staging Supabase project (optional)
# Development: Local Supabase or shared dev project
```

### 2. Database Migrations

```sql
-- Create migrations for schema changes
-- Store in version control
-- Apply via Supabase SQL Editor or CLI
```

### 3. Environment Variables

```bash
# Prefix all client-side vars with VITE_
VITE_SUPABASE_URL=...
VITE_PUBLIC_API_URL=...

# Server-only vars (if using API routes)
SUPABASE_SERVICE_ROLE_KEY=...
SECRET_KEY=...
```

### 4. Deployment Strategy

```bash
# Use branches for environments
main → Production deployment
staging → Preview deployment
feature/* → Preview deployments
```

---

## Example Files

### `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```

### `vercel.json` (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Quick Reference

### Environment Variables Checklist

- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- [ ] `VITE_APP_URL` - Your app's URL (different per environment)
- [ ] Added all variables to all environments (production, preview, development)
- [ ] Added Vercel URLs to Supabase Auth settings

### Pre-Deploy Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] Local build works: `npm run build && npm run preview`
- [ ] Database tables created in Supabase
- [ ] Supabase client properly configured
- [ ] No hardcoded URLs or API keys in code

### Post-Deploy Checklist

- [ ] App loads without console errors
- [ ] Database connections work
- [ ] Authentication flows work (if applicable)
- [ ] Environment-specific features work
- [ ] Performance is acceptable

---

## Advanced Topics

### 1. Multiple Environments

```bash
# Create separate Supabase projects
Production: your-app-prod
Staging: your-app-staging
Development: your-app-dev

# Use different env vars per environment
```

### 2. Database Migrations

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize migrations
supabase init

# Create migration
supabase migration new add_user_profiles

# Apply to remote
supabase db push
```

### 3. Edge Functions

```bash
# Create edge function
supabase functions new hello-world

# Deploy
supabase functions deploy hello-world
```

### 4. Real-time Features

```javascript
// Subscribe to changes
const channel = supabase
  .channel('public:posts')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe()
```

---

That's it! You now have a complete guide to deploying React/Vite apps with Supabase to Vercel. 🚀