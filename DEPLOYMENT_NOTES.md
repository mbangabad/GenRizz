# 🚀 Deployment Configuration Notes

## Deployment Targets
- **Frontend:** Vercel
- **Backend/Database:** Supabase
- **Storage:** Supabase Storage
- **Email:** Resend (via Supabase or direct)

---

## Vercel Configuration

### Environment Variables Needed:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_URL=https://your-domain.vercel.app
VITE_OPENAI_API_KEY=sk-... (optional)
VITE_RESEND_API_KEY=re_... (optional)
```

### Build Settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Important Notes:
- Vercel automatically handles SPA routing
- No additional configuration needed for React Router
- Environment variables are set in Vercel dashboard

---

## Supabase Configuration

### Required Setup:
1. **Create Project** at https://supabase.com
2. **Run SQL Schema:**
   - Execute `supabase/schema.sql` in SQL Editor
   - Enable Row Level Security (RLS) on all tables
   - Verify all policies are created

3. **Storage Buckets:**
   - Create `uploads` bucket (public)
   - Create `private-uploads` bucket (private)
   - Set appropriate policies

4. **Authentication:**
   - Enable Email/Password auth
   - Configure email templates (optional)
   - Set up redirect URLs

### Environment Variables:
- `VITE_SUPABASE_URL` - Project URL
- `VITE_SUPABASE_ANON_KEY` - Anon/Public key (safe for client)

---

## Pre-Deployment Checklist

### Vercel:
- [ ] Project created
- [ ] Environment variables set
- [ ] Domain configured (if custom)
- [ ] Build settings verified

### Supabase:
- [ ] Project created
- [ ] Database schema deployed
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Auth providers configured
- [ ] API keys copied to Vercel

### Code:
- [ ] All hardcoded URLs fixed
- [ ] `.env.example` created
- [ ] Error boundaries in place
- [ ] 404 route configured
- [ ] Build succeeds locally

---

## Post-Deployment

### Verify:
1. Health check: `https://your-domain.vercel.app/health`
2. All routes accessible
3. Authentication works
4. Games load and play
5. Database operations work
6. Sharing links work (check URLs)

### Monitoring:
- Vercel Analytics
- Supabase Dashboard
- Error tracking (Sentry, etc.)

---

## Important Reminders

1. **Never commit `.env.local`** - Use Vercel environment variables
2. **Use `VITE_APP_URL`** for all share links (not hardcoded URLs)
3. **Supabase RLS** must be enabled for security
4. **Vercel** handles SPA routing automatically
5. **Build output** goes to `dist/` directory

---

## Troubleshooting

### Build Fails:
- Check environment variables are set
- Verify all dependencies in package.json
- Check build logs in Vercel dashboard

### Routes Don't Work:
- Verify `dist/index.html` exists
- Check Vercel rewrites configuration
- Ensure React Router is configured correctly

### Database Errors:
- Verify Supabase credentials
- Check RLS policies
- Verify table names match schema

---

**Last Updated:** $(date)  
**Deployment Status:** Ready after fixes

