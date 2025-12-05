# 🎮 GenRizz - Generational Intelligence & Social Gamification

A modern trivia game platform built with React, Vite, and Supabase.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials.

### 3. Start Development Server

```bash
# Safe port (5174) - recommended
npm run dev:safe

# Or custom port
PORT=5175 npm run dev:custom

# Or default (checks port first)
npm run dev
```

The app will be available at `http://localhost:5174` (or your custom port).

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Detailed setup instructions
- **[PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)** - Port management guide
- **[MIGRATION_PLAN.md](./MIGRATION_PLAN.md)** - Migration from Base44 to Supabase
- **[UI_UX_IMPROVEMENTS.md](./UI_UX_IMPROVEMENTS.md)** - UI/UX enhancements

## 🔧 Available Scripts

- `npm run dev` - Start dev server (default port 5174)
- `npm run dev:safe` - Start on port 5174 (no conflicts)
- `npm run dev:custom` - Start with custom PORT env var
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check:port` - Check if port is available

## 🎨 Features

- ✨ Modern 3D UI with smooth animations
- 🔐 Supabase authentication
- 🎯 Gamified learning experience
- 📱 Mobile-responsive design
- 🚀 PWA support
- 🎮 Multiple game modes
- 👥 Social features (friends, challenges, leaderboards)

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Supabase (Database, Auth, Storage)
- **Animations:** Framer Motion
- **UI Components:** Radix UI
- **State Management:** React Query
- **Deployment:** Vercel (web), Docker (containerized)

## 📦 Port Configuration

To avoid port conflicts, the app uses **port 5174** by default (instead of the common 5173).

See [PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md) for details.

## 🔒 Environment Variables

Required:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

Optional:
- `VITE_OPENAI_API_KEY` - For AI features
- `VITE_RESEND_API_KEY` - For email features
- `PORT` - Custom port (default: 5174)

## 📝 License

Private - All rights reserved
