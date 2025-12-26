
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
  const devAdminBypass = String(import.meta.env.VITE_DEV_ADMIN_BYPASS || '').toLowerCase() === 'true';
  const devAdminEmail = import.meta.env.VITE_DEV_ADMIN_EMAIL || 'dev@genrizz.local';
  
  // Don't check auth for login page
  if (location.pathname === '/login' || location.pathname.startsWith('/login')) {
    return <>{children}</>;
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Local dev/admin bypass
        if (devAdminBypass) {
          setUser({ id: 'dev-admin', email: devAdminEmail, role: 'admin' });
          setAuthorized(true);
          setLoading(false);
          return;
        }

        // Development bypass: If Supabase is not configured, allow access for testing
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--page-bg)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ 
              background: 'linear-gradient(to bottom right, var(--brand-green), var(--brand-green-hover))',
              boxShadow: '0 4px 0 var(--brand-green-dark)'
            }}
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
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--brand-green)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <LanguageProvider>
        <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: 'var(--page-bg)' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="text-center max-w-md w-full p-8 rounded-3xl shadow-2xl border-2"
            style={{
              backgroundColor: 'var(--surface-0)',
              borderColor: 'var(--border-subtle)'
            }}
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
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg" style={{ 
                background: 'linear-gradient(to bottom right, #0f172a, #334155)',
                boxShadow: '0 4px 0 #1e293b'
              }}>
                🔒
              </div>
            </motion.div>
            <h1 className="text-3xl font-black mb-3 tracking-tight" style={{ color: 'var(--text-strong)' }}>Private Access</h1>
            <p className="font-semibold mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>This environment is restricted to authorized personnel only.</p>
            <Link 
              to="/login"
              className="w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg no-underline"
              style={{
                background: 'linear-gradient(to bottom right, #0f172a, #334155)',
                color: 'var(--text-inverse)'
              }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to bottom right, #1e293b, #475569)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to bottom right, #0f172a, #334155)'}
              style={{ boxShadow: '0 4px 0 #1e293b' }}
            >
              <Lock className="w-5 h-5" /> Authenticate
            </Link>
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
    <div className="min-h-screen font-sans" style={{ 
      backgroundColor: 'var(--page-bg)', 
      color: 'var(--text-primary)' 
    }}>
      <OfflineIndicator />
      <InstallPrompt />
      <PWAInstallBanner />
      
      {/* Enhanced Desktop Header */}
      <header className="hidden md:block glass-header z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Enhanced Logo */}
        <Link to={createPageUrl('Home')} className="flex items-center gap-3 group" aria-label="Go to Home">
            <motion.div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
              style={{ 
                background: 'linear-gradient(to bottom right, var(--brand-green), var(--brand-green-hover))',
                boxShadow: '0 3px 0 var(--brand-green-dark)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">⚡</span>
            </motion.div>
            <span className="text-xl font-black tracking-tight transition-colors" style={{ color: 'var(--text-strong)' }} onMouseEnter={(e) => e.target.style.color = 'var(--brand-green)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-strong)'}
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
                  aria-label={`Go to ${item.name}`}
                >
                  <motion.div
                    className="px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all relative"
                    style={{
                      backgroundColor: isActive ? 'rgba(88, 204, 2, 0.1)' : 'transparent',
                      color: isActive ? 'var(--brand-green)' : 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.color = 'var(--text-primary)';
                        e.target.style.backgroundColor = 'var(--surface-2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.color = 'var(--text-secondary)';
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl" style={{ backgroundColor: 'rgba(88, 204, 2, 0.1)' }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon className="w-4 h-4 relative z-10" style={{ color: isActive ? 'var(--brand-green)' : 'inherit' }} />
                    <span className="relative z-10">{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: 'var(--border-subtle)' }}>
                <NotificationBell userId={user.id} />
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.full_name}</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                </div>
                <Link to={createPageUrl('Profile')}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black cursor-pointer"
                    style={{ 
                      background: 'linear-gradient(to bottom right, var(--brand-green), var(--brand-green-hover))',
                      color: 'var(--text-inverse)',
                      boxShadow: '0 3px 0 var(--brand-green-dark)'
                    }}
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
                      className="absolute inset-0 rounded-xl" style={{ backgroundColor: 'var(--brand-green)' }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className="w-5 h-5 relative z-10" style={{ color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)' }} />
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Footer */}
      <footer className="hidden md:block mt-20 py-8 border-t" style={{ 
        borderColor: 'var(--border-subtle)',
        backgroundColor: 'var(--surface-1)'
      }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
          <p>© 2025 GenRizz. Made with 🔥</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Privacy</a>
            <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Terms</a>
            <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Contact</a>
          </div>
        </div>
        </footer>
        </div>
        </LanguageProvider>
        );
        }
