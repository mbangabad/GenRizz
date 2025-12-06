
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { auth } from '@/api/auth';
import { BetaAccess, AllowedUser } from '@/api/entities';
import { Home, Users, Trophy, Award, User, Zap, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationBell from '@/components/notifications/NotificationBell';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import Mascot from '@/components/ui/Mascot';
      import OfflineIndicator from '@/components/pwa/OfflineIndicator';
      import PWAInstallBanner from '@/components/pwa/PWAInstallBanner';
      import { LanguageProvider } from '@/components/contexts/LanguageContext';
      import BetaGate from '@/components/auth/BetaGate';

      const NAV_ITEMS = [
  { name: 'Home', icon: Home, path: 'Home', emoji: '🏠' },
  { name: 'Social', icon: Users, path: 'Social', emoji: '👥' },
  { name: 'Rank', icon: Trophy, path: 'Leaderboards', emoji: '🏆' },
  { name: 'Badges', icon: Award, path: 'Achievements', emoji: '🎖️' },
  { name: 'Profile', icon: User, path: 'Profile', emoji: '👤' },
  ];

  // Dev/QA Route - Hidden from main nav but accessible
  const isDev = process.env.NODE_ENV === 'development' || true; // Always enabled for preview

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Development bypass: If Supabase is not configured, allow access for testing
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        // TEMPORARY: Allow access if tables don't exist yet (for initial deployment)
        // Remove this after schema is deployed and auth is working
        try {
          const testAccess = await BetaAccess.filter({ user_id: 'test' });
        } catch (e) {
          // Tables don't exist yet - allow access temporarily
          console.warn('⚠️  Database tables not found - enabling temporary access for deployment');
          setAuthorized(true);
          setUser({ id: 'temp-user', email: 'temp@genrizz.local', role: 'user' });
          setLoading(false);
          return;
        }
        
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
          console.warn('⚠️  Supabase not configured - enabling development mode');
          if (import.meta.env.DEV) {
            setAuthorized(true);
            setUser({ id: 'dev-user', email: 'dev@genrizz.local', role: 'user' });
            setLoading(false);
            return;
          }
        }
        
        const currentUser = await auth.me();
        setUser(currentUser);
        
        if (currentUser) {
          if (currentUser.role === 'admin') {
            setAuthorized(true);
          } else {
            // 1. Check BetaAccess (The new way)
            const access = await BetaAccess.filter({ user_id: currentUser.id });

            // 2. Check AllowedUser (The old way - Legacy support)
            const email = currentUser.email;
            const allowedExact = await AllowedUser.filter({ email: email });
            const allowedLower = await AllowedUser.filter({ email: email.toLowerCase() });

            if (access.length > 0 || allowedExact.length > 0 || allowedLower.length > 0) {
              setAuthorized(true);
            }
          }
        }
      } catch (e) {
        // Not logged in or Supabase error
        console.error('Auth check error:', e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 4px 0 #3D8C02' }}
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-3xl">⚡</span>
          </motion.div>
          <Loader2 className="w-6 h-6 text-[#58CC02] animate-spin" />
          <p className="text-sm font-semibold text-[#777777]">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="text-center max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border-2 border-[#E5E0DA]"
          >
            <motion.div 
              className="mb-6 flex justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center text-4xl shadow-lg" style={{ boxShadow: '0 4px 0 #1e293b' }}>
                🔒
              </div>
            </motion.div>
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Private Access</h1>
            <p className="text-slate-600 font-semibold mb-8 leading-relaxed">This environment is restricted to authorized personnel only.</p>
            <motion.button 
              onClick={() => auth.redirectToLogin()}
              className="w-full py-4 bg-gradient-to-br from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
              style={{ boxShadow: '0 4px 0 #1e293b' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Lock className="w-5 h-5" /> Authenticate
            </motion.button>
          </motion.div>
        </div>
      </LanguageProvider>
    );
  }

  if (!authorized) {
    return (
      <LanguageProvider>
        <BetaGate 
          user={user} 
          onSuccess={() => setAuthorized(true)} 
        />
      </LanguageProvider>
    );
  }

  // Immersive pages handle their own layout
  if (['Gameplay', 'Landing', 'Onboarding', 'Premium', 'Challenge', 'Home', 'Help', 'Settings', 'FamilyChallenge', 'Shop', 'Squads', 'CreatorStudio', 'Admin', 'Blueprint'].includes(currentPageName)) {
    return (
      <LanguageProvider>
        {children}
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <OfflineIndicator />
      <InstallPrompt />
      <PWAInstallBanner />
      
      {/* Enhanced Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 glass-light border-b border-slate-200/50 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
              style={{ boxShadow: '0 3px 0 #3D8C02' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">⚡</span>
            </motion.div>
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-[#58CC02] transition-colors">
              GenRizz
            </span>
          </Link>

          {/* Enhanced Desktop Nav with smooth transitions */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPageName === item.path;
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                >
                  <motion.div
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all relative ${
                      isActive 
                        ? 'bg-[#58CC02]/10 text-[#58CC02]' 
                        : 'text-[#777777] hover:text-[#3C3C3C] hover:bg-[#F0EDE8]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-[#58CC02]/10 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-[#58CC02]' : ''}`} />
                    <span className="relative z-10">{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-[#E5E0DA]">
                <NotificationBell userId={user.id} />
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-[#3C3C3C]">{user.full_name}</p>
                  <p className="text-xs text-[#AFAFAF] font-semibold">{user.email}</p>
                </div>
                <Link to={createPageUrl('Profile')}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center text-sm font-black text-white cursor-pointer"
                    style={{ boxShadow: '0 3px 0 #3D8C02' }}
                  >
                    {user.avatar || user.full_name?.[0] || '?'}
                  </motion.div>
                </Link>
              </div>
            ) : (
              <button 
                onClick={() => auth.redirectToLogin()}
                className="btn-3d btn-3d-lime px-5 py-2.5 text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Enhanced Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
        <nav className="nav-dock-3d px-3 py-3 flex items-center justify-around gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPageName === item.path;
            return (
              <Link
                key={item.name}
                to={createPageUrl(item.path)}
                className="flex-1"
              >
                <motion.div
                  className={`nav-item-3d ${isActive ? 'active' : ''}`}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeMobileNav"
                      className="absolute inset-0 bg-[#58CC02] rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-[#777777]'}`} />
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Footer */}
      <footer className="hidden md:block mt-20 py-8 border-t border-[#E5E0DA] bg-[#F7F4F0]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-[#AFAFAF] text-sm font-semibold">
          <p>© 2025 GenRizz. Made with 🔥</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#3C3C3C] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#3C3C3C] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#3C3C3C] transition-colors">Contact</a>
          </div>
        </div>
        </footer>
        </div>
        </LanguageProvider>
        );
        }
