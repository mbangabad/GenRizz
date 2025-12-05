# 🚀 GenRizz Migration Quick Start Guide

## TL;DR - What Needs to Happen

1. **Replace Base44 SDK** → Supabase client
2. **Migrate 30+ database entities** → Supabase tables
3. **Replace Base44 Auth** → Supabase Auth
4. **Replace integrations** (LLM, Email, Files) → Third-party APIs + Supabase Storage
5. **Deploy to Vercel** → Configure and deploy
6. **Build mobile apps** → Capacitor wrapper for iOS/Android

---

## 📦 Immediate Action Items

### Step 1: Set Up Supabase (Day 1)
```bash
# 1. Create account at supabase.com
# 2. Create new project
# 3. Note down:
#    - Project URL: https://xxxxx.supabase.co
#    - Anon Key: eyJhbGc...
#    - Service Role Key: eyJhbGc... (keep secret!)
```

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js
npm uninstall @base44/sdk  # After migration complete
```

### Step 3: Create Environment File
```bash
# Create .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 4: Create Supabase Client
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## 🔄 Migration Pattern

### Before (Base44):
```javascript
import { base44 } from '@/api/base44Client'

// Auth
const user = await base44.auth.me()
await base44.auth.redirectToLogin()

// Entities
const questions = await base44.entities.Question.filter({ game_id: 'genz' })
await base44.entities.Score.create({ ... })
```

### After (Supabase):
```javascript
import { supabase } from '@/lib/supabase'
import { Question, Score } from '@/api/entities'

// Auth
const { data: { user } } = await supabase.auth.getUser()

// Entities
const questions = await Question.filter({ game_id: 'genz' })
await Score.create({ ... })
```

---

## 📊 Database Entities to Migrate

| Base44 Entity | Supabase Table | Status |
|--------------|----------------|--------|
| Question | `questions` | ⏳ |
| Score | `scores` | ⏳ |
| UserProgress | `user_progress` | ⏳ |
| Challenge | `challenges` | ⏳ |
| Friendship | `friendships` | ⏳ |
| Squad | `squads` | ⏳ |
| SquadMember | `squad_members` | ⏳ |
| UserStreak | `user_streaks` | ⏳ |
| Achievement | `achievements` | ⏳ |
| UserAchievement | `user_achievements` | ⏳ |
| ... (20+ more) | ... | ⏳ |

---

## 🔧 Integration Replacements

| Base44 Integration | Replacement | Cost |
|-------------------|-------------|------|
| `InvokeLLM` | OpenAI API | ~$0.01/1K tokens |
| `SendEmail` | Resend API | Free tier: 3K/month |
| `UploadFile` | Supabase Storage | Included |
| `GenerateImage` | OpenAI DALL-E | ~$0.04/image |

---

## 📱 Mobile App Strategy

**Recommended: Capacitor** (reuse React code)
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npx cap init
```

**Timeline:**
- Week 4-5: Capacitor setup
- Week 5: iOS build & submission
- Week 6: Android build & submission

---

## ⚠️ Critical Files to Update

1. **`src/api/base44Client.js`** → Delete
2. **`src/api/entities.js`** → Rewrite (291 occurrences)
3. **`src/api/integrations.js`** → Rewrite
4. **`src/pages/Layout.jsx`** → Update auth
5. **All page components** → Update imports

---

## 🎯 Migration Order (Recommended)

1. ✅ **Week 1:** Database schema + Auth migration
2. ✅ **Week 2:** Entity operations migration
3. ✅ **Week 3:** Integrations + Vercel deployment
4. ✅ **Week 4-5:** Mobile app setup
5. ✅ **Week 6:** Testing + App store submission

---

## 💡 Pro Tips

1. **Keep Base44 running** until migration is 100% complete
2. **Test incrementally** - migrate one feature at a time
3. **Use feature flags** to toggle between Base44 and Supabase
4. **Create migration scripts** to move production data
5. **Set up staging environment** before production migration

---

## 📞 Need Help?

- Full details: See `MIGRATION_PLAN.md`
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Capacitor Docs: https://capacitorjs.com/docs

---

**Ready to start? Begin with Step 1 above! 🚀**

