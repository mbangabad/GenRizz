# 🚀 GenRizz Migration Plan: Base44 → Vercel + Supabase + App Stores

## Executive Summary

This document outlines the complete refactoring plan to migrate GenRizz from Base44 to:
- **Vercel** (Web hosting)
- **Supabase** (Backend-as-a-Service: Database, Auth, Storage)
- **App Stores** (iOS & Android via React Native or Capacitor)

**Estimated Timeline:** 4-6 weeks
**Complexity:** High (Full backend migration + Mobile app creation)

---

## 📊 Current Architecture Assessment

### What We Have
- ✅ React 18 + Vite frontend
- ✅ Base44 SDK for backend operations
- ✅ 30+ database entities (Questions, Scores, UserProgress, etc.)
- ✅ Base44 Auth system
- ✅ Base44 integrations (LLM, Email, File Upload)
- ✅ PWA support (can be leveraged for mobile)
- ✅ React Router for navigation
- ✅ Tailwind CSS + Radix UI components

### What Needs to Change
- ❌ Replace `@base44/sdk` with `@supabase/supabase-js`
- ❌ Migrate all entity operations to Supabase tables
- ❌ Replace Base44 auth with Supabase Auth
- ❌ Replace Base44 integrations with alternatives
- ❌ Add Vercel deployment configuration
- ❌ Create mobile app wrapper (Capacitor or React Native)

---

## 🗂️ Phase 1: Database Schema Migration (Week 1)

### 1.1 Supabase Database Setup

**Create Supabase Project:**
1. Create new Supabase project at supabase.com
2. Note down: Project URL, Anon Key, Service Role Key

**Database Tables to Create** (based on entities.js):

```sql
-- Core User Data
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  total_plays INTEGER DEFAULT 0,
  highest_score INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  last_played_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  freeze_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Gameplay & Content
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'mcq', 'swipe', 'audio', 'ranking', etc.
  question TEXT NOT NULL,
  options JSONB,
  correct_index INTEGER,
  explanation TEXT,
  difficulty INTEGER DEFAULT 5,
  times_shown INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  percentage INTEGER NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  time_taken INTEGER,
  challenge_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_submitted_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  correct_index INTEGER,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE connection_puzzles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  groups JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social & Viral
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  join_code TEXT UNIQUE NOT NULL,
  total_xp INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(squad_id, user_id)
);

CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenger_name TEXT,
  challenger_percentage INTEGER,
  challenged_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  challenged_name TEXT,
  game_id TEXT NOT NULL,
  challenge_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Economy & System
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT NOT NULL,
  date DATE NOT NULL UNIQUE,
  xp_multiplier DECIMAL DEFAULT 2.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE daily_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  date DATE NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id, date)
);

CREATE TABLE daily_play_counts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE TABLE daily_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  reward_type TEXT, -- 'xp', 'hearts', 'powerup'
  reward_value INTEGER,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, -- 'monthly', 'yearly'
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'hearts', 'powerup', 'subscription'
  item_id TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE power_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'skip', 'hint', 'time_freeze', 'streak_freeze'
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'question', 'user', 'message'
  content_id UUID NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE platform_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value JSONB,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_name, date)
);

-- Beta Access & Admin
CREATE TABLE allowed_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  max_uses INTEGER DEFAULT 0, -- 0 = unlimited
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'disabled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE beta_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code_used TEXT,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

**Row Level Security (RLS) Policies:**
- Enable RLS on all tables
- Create policies for authenticated users to read/write their own data
- Create policies for public read access where appropriate (leaderboards, public questions)
- Admin-only policies for moderation tables

**Indexes:**
```sql
-- Performance indexes
CREATE INDEX idx_user_progress_user_game ON user_progress(user_id, game_id);
CREATE INDEX idx_scores_user_game ON scores(user_id, game_id);
CREATE INDEX idx_questions_game ON questions(game_id);
CREATE INDEX idx_challenges_code ON challenges(challenge_code);
CREATE INDEX idx_squads_code ON squads(join_code);
CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_friend ON friendships(friend_id);
```

### 1.2 User Metadata Extension

Supabase Auth provides basic user fields. Extend with:

```sql
-- Add custom fields to auth.users metadata or create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  hearts INTEGER DEFAULT 5,
  is_premium BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user', -- 'user', 'admin', 'moderator'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 Phase 2: Authentication Migration (Week 1-2)

### 2.1 Replace Base44 Auth with Supabase Auth

**Create Supabase Client:**
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Create Auth Service:**
```javascript
// src/api/auth.js
import { supabase } from '@/lib/supabase'

export const auth = {
  // Get current user
  async me() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    // Fetch user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { ...user, ...profile }
  },
  
  // Sign in
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },
  
  // Sign up
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) throw error
    return data
  },
  
  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  
  // Update user
  async updateMe(updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    // Update auth metadata
    if (updates.email || updates.password) {
      const authUpdates = {}
      if (updates.email) authUpdates.email = updates.email
      if (updates.password) authUpdates.password = updates.password
      
      const { error } = await supabase.auth.updateUser(authUpdates)
      if (error) throw error
    }
    
    // Update profile
    const profileUpdates = { ...updates }
    delete profileUpdates.email
    delete profileUpdates.password
    
    if (Object.keys(profileUpdates).length > 0) {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ id: user.id, ...profileUpdates }, { onConflict: 'id' })
      if (error) throw error
    }
  },
  
  // Redirect to login (for compatibility)
  redirectToLogin(returnUrl = null) {
    window.location.href = `/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`
  }
}
```

**Update Layout.jsx:**
Replace `base44.auth.me()` with `auth.me()` from new auth service.

---

## 🗄️ Phase 3: Entity Operations Migration (Week 2-3)

### 3.1 Create Supabase Entity Service

**Create Entity Service Pattern:**
```javascript
// src/api/entities.js
import { supabase } from '@/lib/supabase'

// Generic entity operations
export const createEntityService = (tableName) => ({
  // List with sorting
  async list(orderBy = 'created_at', limit = 100) {
    const [column, direction] = orderBy.startsWith('-') 
      ? [orderBy.slice(1), 'desc'] 
      : [orderBy, 'asc']
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(column, { ascending: direction === 'asc' })
      .limit(limit)
    
    if (error) throw error
    return data
  },
  
  // Filter
  async filter(filters = {}) {
    let query = supabase.from(tableName).select('*')
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value)
      }
    })
    
    const { data, error } = await query
    if (error) throw error
    return data
  },
  
  // Get by ID
  async get(id) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
  
  // Create
  async create(record) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(record)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // Update
  async update(id, updates) {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // Delete
  async delete(id) {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
})

// Export entity services
export const Question = createEntityService('questions')
export const Score = createEntityService('scores')
export const UserProgress = createEntityService('user_progress')
export const Challenge = createEntityService('challenges')
export const Friendship = createEntityService('friendships')
export const DailyChallenge = createEntityService('daily_challenges')
export const DailyScore = createEntityService('daily_scores')
export const Message = createEntityService('messages')
export const Notification = createEntityService('notifications')
export const UserStreak = createEntityService('user_streaks')
export const Achievement = createEntityService('achievements')
export const UserAchievement = createEntityService('user_achievements')
export const Subscription = createEntityService('subscriptions')
export const DailyPlayCount = createEntityService('daily_play_counts')
export const PowerUp = createEntityService('power_ups')
export const PlatformStats = createEntityService('platform_stats')
export const Referral = createEntityService('referrals')
export const DailyReward = createEntityService('daily_rewards')
export const UserSubmittedQuestion = createEntityService('user_submitted_questions')
export const Squad = createEntityService('squads')
export const SquadMember = createEntityService('squad_members')
export const Purchase = createEntityService('purchases')
export const Report = createEntityService('reports')
export const AllowedUser = createEntityService('allowed_users')
export const InviteCode = createEntityService('invite_codes')
export const BetaAccess = createEntityService('beta_access')
export const ConnectionPuzzle = createEntityService('connection_puzzles')
```

### 3.2 Update All Component Imports

**Find and Replace:**
- `import { base44 } from '@/api/base44Client'` → Remove
- `base44.entities.*` → Import from new `@/api/entities`
- `base44.auth.*` → Import from new `@/api/auth`

**Files to Update (291 occurrences):**
- All files in `src/pages/`
- All files in `src/components/`
- `src/api/base44Client.js` → Delete
- `src/api/entities.js` → Rewrite
- `src/api/integrations.js` → Rewrite

---

## 🔧 Phase 4: Integrations Replacement (Week 3)

### 4.1 LLM Integration (InvokeLLM)

**Option 1: OpenAI API (Recommended)**
```javascript
// src/api/integrations.js
export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: response_json_schema ? { type: 'json_object' } : undefined
    })
  })
  
  const data = await response.json()
  const content = data.choices[0].message.content
  
  if (response_json_schema) {
    return JSON.parse(content)
  }
  return content
}
```

**Option 2: Supabase Edge Functions**
Create a Supabase Edge Function to proxy LLM calls (keeps API keys server-side).

### 4.2 Email Integration (SendEmail)

**Option 1: Resend API (Recommended)**
```javascript
export const SendEmail = async ({ to, subject, body }) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'GenRizz <noreply@genrizz.com>',
      to,
      subject,
      html: body
    })
  })
  
  return await response.json()
}
```

**Option 2: Supabase Edge Functions + Resend**
Keep API keys server-side.

### 4.3 File Upload Integration

**Use Supabase Storage:**
```javascript
// src/api/integrations.js
import { supabase } from '@/lib/supabase'

export const UploadFile = async (file, path, options = {}) => {
  const { data, error } = await supabase.storage
    .from(options.bucket || 'uploads')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: options.upsert || false
    })
  
  if (error) throw error
  return data
}

export const CreateFileSignedUrl = async (path, expiresIn = 3600, bucket = 'uploads') => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)
  
  if (error) throw error
  return data
}

export const UploadPrivateFile = async (file, path, options = {}) => {
  // Same as UploadFile but to private bucket
  return UploadFile(file, path, { ...options, bucket: 'private-uploads' })
}
```

**Set up Supabase Storage Buckets:**
- `uploads` (public)
- `private-uploads` (authenticated only)
- `avatars` (public)

### 4.4 Image Generation

**Option 1: OpenAI DALL-E**
```javascript
export const GenerateImage = async ({ prompt }) => {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024'
    })
  })
  
  const data = await response.json()
  return data.data[0].url
}
```

**Option 2: Remove if not critical**

---

## 🐳 Phase 5: Docker Containerization (Week 3)

### 5.1 Docker Setup

**Why Containerize?**
- ✅ Avoid port conflicts (configurable ports)
- ✅ Consistent development environment
- ✅ Easy deployment to any platform
- ✅ Isolated dependencies
- ✅ Production-ready builds

**Docker Files Created:**
- `Dockerfile` - Production build with nginx
- `Dockerfile.dev` - Development server
- `docker-compose.yml` - Orchestration
- `nginx.conf` - Production web server config
- `.dockerignore` - Exclude unnecessary files

### 5.2 Port Conflict Prevention

**Configuration Options:**

1. **Environment Variables:**
```bash
export APP_PORT=5173      # Development port
export PROD_PORT=8080     # Production port
```

2. **docker-compose.override.yml:**
```yaml
services:
  app-dev:
    ports:
      - "3000:3000"  # Custom port if 5173 is in use
```

3. **Port Check Script:**
```bash
npm run check:port dev 5173  # Check if port is available
```

### 5.3 Development with Docker

```bash
# Start development container
npm run docker:dev

# Or with custom port
APP_PORT=3000 npm run docker:dev

# View logs
docker-compose logs -f app-dev
```

### 5.4 Production Build

```bash
# Build production image
npm run docker:build

# Run production container
npm run docker:run

# Or use docker-compose
npm run docker:prod
```

**See `DOCKER_GUIDE.md` for complete Docker documentation.**

---

## 🚀 Phase 6: Vercel Deployment (Week 3-4)

### 6.1 Vercel Configuration

**Note:** Vercel can deploy directly from the codebase (no Docker needed), but Docker containers can also be used for deployment to other platforms.

**Create `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

**Update `vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  // Vercel-specific optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})
```

### 6.2 Environment Variables

**Create `.env.example`:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_key (optional)
VITE_RESEND_API_KEY=your_resend_key (optional)
```

**Set in Vercel Dashboard:**
- Go to Project Settings → Environment Variables
- Add all required variables for Production, Preview, and Development

### 6.3 Deployment Steps

1. **Connect GitHub repo to Vercel**
2. **Configure build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Deploy**

---

## 📱 Phase 7: Mobile App Preparation (Week 4-5)

### 7.1 Choose Mobile Strategy

**Option A: Capacitor (Recommended for existing React app)**
- ✅ Reuse existing React codebase
- ✅ Single codebase for web + mobile
- ✅ Faster development
- ❌ Not native performance
- ❌ Limited native features

**Option B: React Native (Full rewrite)**
- ✅ True native performance
- ✅ Better app store presence
- ❌ Requires rewriting components
- ❌ Longer development time

**Recommendation: Start with Capacitor, migrate to React Native later if needed.**

### 7.2 Capacitor Setup

**Install Capacitor:**
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npx cap init
```

**Update `capacitor.config.ts`:**
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.genrizz.app',
  appName: 'GenRizz',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FAF8F5"
    }
  }
};

export default config;
```

**Add Capacitor Plugins:**
```bash
npm install @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar
npm install @capacitor/push-notifications  # For push notifications
```

**Update build script:**
```json
{
  "scripts": {
    "build": "vite build",
    "build:mobile": "vite build && npx cap sync",
    "ios": "npx cap open ios",
    "android": "npx cap open android"
  }
}
```

### 7.3 Mobile-Specific Adjustments

**Update PWA manifest for mobile:**
- Add app icons (1024x1024, 512x512, etc.)
- Configure splash screens
- Add mobile-specific shortcuts

**Handle Deep Links:**
```javascript
// src/utils/deepLinks.js
import { App } from '@capacitor/app'

export const setupDeepLinks = () => {
  App.addListener('appUrlOpen', (event) => {
    const url = new URL(event.url)
    // Handle challenge links, friend invites, etc.
  })
}
```

**Add Mobile UI Adjustments:**
- Safe area insets for notched devices
- Touch-optimized button sizes
- Swipe gestures where appropriate

### 7.4 iOS App Store Preparation

**Requirements:**
1. Apple Developer Account ($99/year)
2. App Store Connect setup
3. App icons (all sizes)
4. Screenshots (various device sizes)
5. Privacy policy URL
6. App description and metadata

**Build iOS App:**
```bash
npm run build:mobile
npx cap open ios
# Build in Xcode
# Archive and upload to App Store Connect
```

### 7.5 Android Play Store Preparation

**Requirements:**
1. Google Play Developer Account ($25 one-time)
2. Play Console setup
3. App icons and screenshots
4. Privacy policy URL
5. Content rating questionnaire

**Build Android App:**
```bash
npm run build:mobile
npx cap open android
# Build APK/AAB in Android Studio
# Upload to Play Console
```

---

## 🧪 Phase 8: Testing & Migration (Week 5-6)

### 8.1 Data Migration Script

**Create migration script to export from Base44 and import to Supabase:**
```javascript
// scripts/migrate-data.js
// 1. Export all data from Base44 (if API available)
// 2. Transform data to match Supabase schema
// 3. Import to Supabase using bulk insert
```

### 8.2 Testing Checklist

- [ ] Authentication (sign up, sign in, sign out)
- [ ] User profile updates
- [ ] Gameplay (questions, scoring)
- [ ] Leaderboards
- [ ] Social features (friends, challenges, squads)
- [ ] Admin features
- [ ] File uploads
- [ ] Email notifications
- [ ] Mobile app (iOS & Android)
- [ ] PWA functionality
- [ ] Offline support (if implemented)

### 8.3 Performance Optimization

- [ ] Add database indexes
- [ ] Implement query pagination
- [ ] Add caching layer (React Query already in use)
- [ ] Optimize bundle size
- [ ] Image optimization
- [ ] CDN for static assets

---

## 📋 Migration Checklist

### Pre-Migration
- [ ] Create Supabase project
- [ ] Design database schema
- [ ] Set up environment variables
- [ ] Create backup of current Base44 data

### Phase 1: Database
- [ ] Create all tables in Supabase
- [ ] Set up RLS policies
- [ ] Create indexes
- [ ] Test database operations

### Phase 2: Authentication
- [ ] Replace Base44 auth with Supabase auth
- [ ] Update all auth calls
- [ ] Test authentication flows
- [ ] Set up OAuth providers (Google, Apple) if needed

### Phase 3: Entities
- [ ] Create entity service layer
- [ ] Replace all `base44.entities.*` calls
- [ ] Update all component imports
- [ ] Test CRUD operations

### Phase 4: Integrations
- [ ] Set up OpenAI API (or alternative)
- [ ] Set up Resend (or alternative)
- [ ] Set up Supabase Storage
- [ ] Replace all integration calls
- [ ] Test integrations

### Phase 5: Docker Containerization
- [ ] Docker files created
- [ ] Port conflict prevention configured
- [ ] Development container tested
- [ ] Production container tested
- [ ] Docker guide documented

### Phase 6: Deployment
- [ ] Configure Vercel project
- [ ] Set environment variables
- [ ] Deploy to Vercel
- [ ] Test production build
- [ ] Set up custom domain

### Phase 7: Mobile
- [ ] Install and configure Capacitor
- [ ] Build iOS app
- [ ] Build Android app
- [ ] Test on physical devices
- [ ] Submit to app stores

### Phase 8: Final
- [ ] Migrate production data
- [ ] Run full test suite
- [ ] Performance testing
- [ ] Security audit
- [ ] Go live! 🎉

---

## 🔒 Security Considerations

1. **Row Level Security (RLS):** Enable on all tables
2. **API Keys:** Never expose in client code (use Edge Functions)
3. **Environment Variables:** Use Vercel's environment variable system
4. **CORS:** Configure Supabase CORS settings
5. **Rate Limiting:** Implement on API endpoints
6. **Input Validation:** Validate all user inputs
7. **SQL Injection:** Use parameterized queries (Supabase handles this)

---

## 💰 Cost Estimates

### Supabase
- **Free Tier:** 500MB database, 1GB file storage, 2GB bandwidth
- **Pro Tier:** $25/month (8GB database, 100GB storage, 250GB bandwidth)
- **Team Tier:** $599/month (for larger scale)

### Vercel
- **Hobby:** Free (for personal projects)
- **Pro:** $20/month (for commercial use)
- **Enterprise:** Custom pricing

### Additional Services
- **OpenAI API:** Pay-per-use (~$0.01-0.10 per 1K tokens)
- **Resend:** Free tier (3,000 emails/month), then $20/month
- **App Store Fees:** 
  - Apple: $99/year
  - Google: $25 one-time

---

## 🚨 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss during migration | High | Create backups, test migration script on staging |
| Breaking changes in API | High | Maintain backward compatibility layer during transition |
| Performance degradation | Medium | Load testing, database optimization |
| Mobile app rejection | Medium | Follow app store guidelines, test thoroughly |
| Integration API failures | Medium | Implement fallbacks, error handling |

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)

---

## 🎯 Next Steps

1. **Review this plan** with your team
2. **Set up Supabase project** and create database schema
3. **Start with Phase 1** (Database setup)
4. **Create a feature branch** for migration work
5. **Test incrementally** - don't migrate everything at once
6. **Keep Base44 running** until migration is complete and tested

---

**Good luck with your migration! 🚀**

