# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (for database)
- OpenAI API key (optional, for AI features)
- Resend API key (optional, for email features)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI (Optional - for AI features)
VITE_OPENAI_API_KEY=sk-your-key-here

# Resend (Optional - for email features)
VITE_RESEND_API_KEY=re_your-key-here

# Port (Optional - defaults to 5174)
PORT=5174
```

## Step 3: Set Up Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor
3. Copy and run the SQL from `supabase/schema.sql`
4. Enable Row Level Security (RLS) policies
5. Copy your project URL and anon key to `.env.local`

## Step 4: Check Port Availability

Before starting, check if port 5174 is available:

```bash
npm run check:port dev
```

If the port is in use, use a different port:

```bash
PORT=5175 npm run dev
```

## Step 5: Start Development Server

```bash
npm run dev
```

Or use the safe port version:

```bash
npm run dev:safe
```

The app will be available at `http://localhost:5174` (or your custom port).

## Step 6: Test the Application

1. Open `http://localhost:5174` in your browser
2. You should see the authentication screen
3. Sign up or sign in with Supabase Auth
4. Navigate through the app to test features

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

```bash
# Check what's using the port
lsof -i :5174

# Use a different port
PORT=5175 npm run dev
```

### Supabase Connection Issues

- Verify your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check that RLS policies are enabled in Supabase
- Verify the database schema was created successfully

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## Next Steps

1. ✅ Test all features
2. ✅ Set up production environment variables
3. ✅ Deploy to Vercel
4. ✅ Configure Supabase production settings

## Port Configuration

See `PORT_CONFIGURATION.md` for detailed port management information.

