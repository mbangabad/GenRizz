export const BLUEPRINT_MARKDOWN = `# 📘 GenRizz Project Blueprint
> **Architecture, Design & Mechanics Documentation**
> *Use this blueprint to bootstrap the "Worldly" project on Base44.*

## 1. Core Philosophy & Vision
**"Generational Intelligence & Social Gamification"**
- **Goal:** Bridge generational gaps (Boomer vs Gen Z) and improve social intelligence through gamified learning.
- **Tone:** Playful, "roast-heavy", vibrant, slightly chaotic (Internet culture), but educational at its core.
- **UX Principle:** "Duolingo for Culture" - Quick bites, streaks, immediate feedback, 3D tactile UI.

---

## 2. Design System ("RizzUI")
*A custom implementation of a flat-3D, high-contrast aesthetic.*

### 🎨 Color Palette (CSS Variables)
- **Primary (Action/Success):** \`Lime Green\` (#58CC02)
- **Secondary (Info/Ice):** \`Sky Blue\` (#1CB0F6)
- **Accent (XP/Gold):** \`Sunflower Yellow\` (#FFC800)
- **Streak (Fire):** \`Orange\` (#FF9600)
- **Danger (Error/Love):** \`Rose Red\` (#FF4B4B)
- **Social (Vibes):** \`Hot Pink\` (#FF86D0)
- **Premium:** \`Amethyst\` (#CE82FF)
- **Background:** \`Warm Cream\` (#FAF8F5) - *Crucial for the friendly feel.*

### 🧩 UI Components
- **3D Buttons:** Translate Y-axis on click, solid bottom border for depth.
- **Cards:** Floating with shadows, hover effects, rounded corners (16px-24px).
- **Mascot ("Rizzy"):** Reactive flame character (Happy, Shocked, Cool).
- **Typography:** \`Nunito\` (Rounded, friendly, high readability).

---

## 3. Data Architecture (Entities)
*Base44 Entity Schemas required for the platform.*

### Core User Data
- **\`User\`** (Built-in): ID, Email, Name, Role.
- **\`UserProgress\`**: Tracks XP, high scores, and level per \`game_id\`.
- **\`UserStreak\`**: Manages daily streak count, freeze logic, and calendar history.
- **\`UserAchievement\`**: Unlocked badges and milestones.

### Gameplay & Content
- **\`Question\`**: The core content unit (Type: \`mcq\`, \`swipe\`, \`audio\`, \`ranking\`).
- **\`UserSubmittedQuestion\`**: UGC pipeline for community content.
- **\`Game\`** (Static Config): Defined in code (\`constants/games.js\`), not DB, for performance.

### Social & Viral
- **\`Squad\`**: Groups/Clans with \`total_xp\` and \`members\`.
- **\`SquadMember\`**: Link table for Users <-> Squads.
- **\`Friendship\`**: Bi-directional follower system.
- **\`Challenge\`**: PvP records (Challenger vs Challenged).

### Economy & System
- **\`DailyReward\`**: Login bonus tracking.
- **\`Purchase\`**: IAP records for gems/subscriptions.
- **\`Report\`**: Moderation queue for UGC.
- **\`PlatformStats\`**: Aggregated analytics for Admin Dashboard.

---

## 4. Gameplay Mechanics
*The "Loop" that keeps users engaged.*

### The Core Loop
1.  **Select Game:** Categories (Generational, Social, Personality).
2.  **Play Session:** 10 Questions, timed or untimed.
3.  **Feedback:** Immediate "Correct/Incorrect" with a roast/compliment.
4.  **Result:** Score %, XP Earned, Streak updated.
5.  **Meta:** Level up, Unlock Achievement, Check Leaderboard.

### Progression System
- **XP (Rizz Points):** Earned per correct answer.
- **Levels (1-15):** From "Clueless Noob" to "Meme Lord Supreme".
- **Tiers:** Dynamic badges based on performance (Normie -> Goated).
- **Leagues:** Weekly leaderboards (Bronze -> Diamond).

### Engagement Hooks
- **Daily Streak:** Visual fire counter, "Streak Freeze" item.
- **Daily Challenge:** 2x XP for playing a specific game.
- **Push Notifications:** "Friend beat your score", "Streak at risk".

---

## 5. Technical Architecture (Base44)

### Directory Structure
\`\`\`text
/entities           # JSON Schemas (Database)
/pages              # Route Views (Home, Gameplay, Profile)
/components
  /ui               # Generic Atoms (Button, Card, Input)
  /game             # Game Mechanics (Timer, Question Types)
  /home             # Dashboard Widgets
  /social           # Leaderboards, Friends
  /admin            # Backoffice Tools
  /constants        # Static Configs (Games list, Levels)
/layout             # Main App Wrapper (Nav, Auth check)
\`\`\`

### Key Integrations
- **\`base44.auth\`**: User session management.
- **\`react-query\`**: Data fetching, caching, and optimistic updates.
- **\`framer-motion\`**: All UI animations (Pop, Slide, Shake).
- **\`lucide-react\`**: Iconography.

---

## 6. Feature Set Checklist

### ✅ Phase 1: MVP
- [x] Authentication (Login/Signup)
- [x] Home Dashboard (Stats, Game Grid)
- [x] Core Gameplay Engine (Quiz Mode)
- [x] Profile & Stats Tracking

### 🚀 Phase 2: Retention
- [x] Streak System
- [x] Leaderboards (Global & Friends)
- [x] Daily Rewards (Calendar)
- [x] Achievements System

### 🎨 Phase 3: Content & Viral
- [x] Creator Studio (Submit Questions)
- [x] Shareable Results (Images/Links)
- [x] Party Mode (Multiplayer Logic)
- [x] Admin Dashboard (Content Approval)

### 💎 Phase 4: Monetization (Worldly Goal)
- [ ] Shop (Power-ups, Skins)
- [ ] Premium Subscription (No Ads, Unlimited Hearts)

---

## 7. Content Strategy (The "GenRizz" Flavor)
*To be adapted for "Worldly".*

- **Categories:** 
  1. *Generational IQ* (History, Slang, Tech)
  2. *Social Intelligence* (EQ, Situations)
  3. *Personality* (Vibe Checks)
- **Roast System:** Don't just say "Wrong". Say "My grandma knows this one."
- **Visuals:** Use emojis heavily. They are universal and lightweight.

---

## 8. Future Roadmap items (To Carry Over)
- **World Map Mode:** Unlock regions (perfect for "Worldly").
- **Language Learning:** Integrated mini-games.
- **Real-time PvP:** Live trivia battles.
`;