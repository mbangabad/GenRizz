import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { auth } from '@/api/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, Zap, Trophy, ChevronRight, Star, Crown, Sparkles } from 'lucide-react';
import { GAMES_LIST, GAME_CATEGORIES_META } from '@/components/constants/games';
import Mascot, { CelebrationMascot } from '@/components/ui/Mascot';

const LIVE_STATS = {
  playersOnline: 12847,
  totalPlayers: 847293,
  gamesPlayedToday: 128472,
};

const TIER_RESULTS = [
  { tier: "Chronically Online", emoji: "💀", game: "Gen Z Fluency", score: 95, color: "lime" },
  { tier: "iPad Baby", emoji: "📱", game: "Boomer Quiz", score: 23, color: "pink" },
  { tier: "Old Soul", emoji: "🧓", game: "Mental Age", score: 87, color: "purple" },
  { tier: "Meme Lord", emoji: "👑", game: "Emoji Detective", score: 100, color: "yellow" },
];

const CATEGORY_ICONS = [
  { emoji: '💀', name: 'Gen Z', color: '#58D0FF' },
  { emoji: '📻', name: 'Boomer', color: '#FFD93D' },
  { emoji: '📼', name: 'Millennial', color: '#FF6B9D' },
  { emoji: '🚩', name: 'Red Flags', color: '#FF6B35' },
  { emoji: '🧠', name: 'Mental Age', color: '#B388FF' },
  { emoji: '💬', name: 'Dating IQ', color: '#A6E22E' },
];

export default function Landing() {
  const [stats, setStats] = useState(LIVE_STATS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hoveredTier, setHoveredTier] = useState(null);

  useEffect(() => {
    auth.getSession().then(session => setIsAuthenticated(!!session));
    
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        playersOnline: prev.playersOnline + Math.floor(Math.random() * 20) - 8,
        gamesPlayedToday: prev.gamesPlayedToday + Math.floor(Math.random() * 10),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handlePlay = () => {
    if (isAuthenticated) {
      window.location.href = createPageUrl('Home');
    } else {
      auth.redirectToLogin(createPageUrl('Home'));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#3C3C3C] overflow-x-hidden">
      {/* Promo Banner */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-[#B388FF] via-[#FF6B9D] to-[#FFD93D] text-white text-center py-3 px-4"
      >
        <div className="flex items-center justify-center gap-3 flex-wrap font-bold">
          <span className="text-xl">🎁</span>
          <span>BLACK FRIDAY SALE!</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Premium $9.99/yr</span>
          <span className="bg-black/20 px-2 py-0.5 rounded text-xs font-black">67% OFF</span>
        </div>
      </motion.div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-light border-b border-[#E5E0DA]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 0 #3D8C02' }}>
              <span className="text-xl">🔥</span>
            </div>
            <span className="font-black text-xl tracking-tight text-[#3C3C3C]">GenRizz</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-[#777777]">
            <a href="#games" className="hover:text-[#58CC02] transition-colors">Games</a>
            <a href="#pricing" className="hover:text-[#58CC02] transition-colors">Premium</a>
            <Link to={createPageUrl('Help')} className="hover:text-[#58CC02] transition-colors">Help</Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <motion.button 
                onClick={handlePlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d btn-3d-green px-6 py-2.5 text-sm"
              >
                Play Now
              </motion.button>
            ) : (
              <>
                <motion.button 
                  onClick={() => auth.redirectToLogin(createPageUrl('Home'))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-3d btn-3d-ghost px-5 py-2.5 text-sm"
                >
                  Sign In
                </motion.button>
                <motion.button 
                  onClick={() => auth.redirectToLogin(createPageUrl('Onboarding'))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-3d btn-3d-green px-5 py-2.5 text-sm"
                >
                  Sign Up Free
                </motion.button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#58CC02]/15 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-[#FF86D0]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#1CB0F6]/10 rounded-full blur-[100px]" />
          
          {/* Floating Emojis */}
          {[
            { emoji: '💀', x: 8, y: 20 }, { emoji: '🔥', x: 88, y: 15 },
            { emoji: '👴', x: 5, y: 50 }, { emoji: '📱', x: 92, y: 40 },
            { emoji: '🎮', x: 12, y: 75 }, { emoji: '💯', x: 85, y: 70 },
            { emoji: '😂', x: 20, y: 30 }, { emoji: '🧢', x: 78, y: 25 },
            { emoji: '👑', x: 6, y: 65 }, { emoji: '🐐', x: 90, y: 55 },
            { emoji: '💅', x: 45, y: 12 }, { emoji: '🗿', x: 55, y: 85 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl md:text-5xl select-none opacity-60"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              animate={{ 
                y: [0, -30, 0],
                rotate: [0, 20, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 4 + (i % 3), 
                repeat: Infinity, 
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Live Stats Pills */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-10 flex-wrap"
          >
            <div className="badge-3d badge-green">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>{stats.playersOnline.toLocaleString()} playing now</span>
            </div>
            <div className="badge-3d badge-blue">
              <span>🎮 {(stats.gamesPlayedToday / 1000).toFixed(0)}K games today</span>
            </div>
          </motion.div>

          {/* Mascot */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-8"
          >
            <Mascot mood="excited" size="xl" showSpeech speech="Ready to get roasted? 🔥" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 leading-[1.1]"
          >
            <span className="text-[#3C3C3C]">Do You Have</span>
            <br />
            <span className="text-gradient-rainbow">RIZZ?</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-[#777777] mb-10 max-w-2xl mx-auto font-semibold"
          >
            20 viral quizzes testing your <span className="text-[#1CB0F6]">Gen Z slang</span>,{' '}
            <span className="text-[#FF9600]">Boomer wisdom</span>, and everything in between.
            <br />
            <span className="text-[#FF86D0]">Can you beat your parents?</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.button 
              onClick={handlePlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-3d btn-3d-green w-full sm:w-auto px-10 py-5 text-lg flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6 fill-current" />
              PLAY FREE
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            
            <Link to={createPageUrl('FamilyChallenge')}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d btn-3d-pink w-full sm:w-auto px-10 py-5 text-lg flex items-center justify-center gap-3"
              >
                <span className="text-2xl">👨‍👩‍👧</span>
                PARENT VS KID
              </motion.button>
            </Link>
          </motion.div>

          {/* Tier Result Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {TIER_RESULTS.map((result, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                onHoverStart={() => setHoveredTier(i)}
                onHoverEnd={() => setHoveredTier(null)}
                className={`card-3d card-3d-${result.color} p-4 cursor-pointer min-w-[160px]`}
              >
                <motion.div 
                  className="text-4xl mb-2"
                  animate={hoveredTier === i ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {result.emoji}
                </motion.div>
                <div className="font-bold text-[#3C3C3C]">{result.tier}</div>
                <div className="text-xs text-[#AFAFAF] mb-2">{result.game}</div>
                <div className="badge-3d badge-green text-xs py-1 px-2">
                  {result.score}%
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-24 border-t border-[#E5E0DA]" id="games">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="text-gradient-green">20</span> Games
            </h2>
            <p className="text-lg text-[#777777] font-semibold">Across 10 categories of generational chaos</p>
          </motion.div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {CATEGORY_ICONS.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                className="card-3d card-3d-interactive p-6 text-center cursor-pointer group"
              >
                <motion.div 
                  className="game-icon-3d game-icon-lg mx-auto mb-3"
                  style={{ background: `linear-gradient(135deg, ${cat.color}40 0%, ${cat.color}20 100%)` }}
                  whileHover={{ rotate: 10 }}
                >
                  {cat.emoji}
                </motion.div>
                <div className="font-bold text-sm text-[#3C3C3C]">{cat.name}</div>
              </motion.div>
            ))}
          </div>

          {/* All Categories */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.values(GAME_CATEGORIES_META).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="card-3d p-4 text-center cursor-pointer"
                onClick={handlePlay}
              >
                <motion.div 
                  className="text-3xl mb-2"
                  whileHover={{ scale: 1.3, rotate: 15 }}
                >
                  {cat.emoji}
                </motion.div>
                <div className="font-bold text-sm text-[#3C3C3C]">{cat.name}</div>
                <div className="text-xs text-[#AFAFAF]">2 games</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-24 border-t border-[#E5E0DA]" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-[#3C3C3C]">
              Go <span className="text-gradient-yellow">Premium</span>
            </h2>
            <p className="text-lg text-[#777777] font-semibold">Unlimited games, no ads, exclusive perks</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="card-3d p-8"
            >
              <h3 className="text-2xl font-black mb-2 text-[#3C3C3C]">Free</h3>
              <div className="text-5xl font-black mb-6 text-gradient-blue">$0</div>
              <ul className="space-y-4 mb-8">
                {["5 games/day", "All 20 games", "Friend challenges", "Leaderboards"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-[#3C3C3C]">
                    <span className="text-[#58CC02] text-xl">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button 
                onClick={handlePlay}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-3d btn-3d-ghost w-full py-4 text-lg"
              >
                Play Free
              </motion.button>
            </motion.div>

            {/* Premium */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="relative card-3d card-3d-yellow p-8 overflow-hidden"
            >
              <div className="absolute -top-1 right-6 bg-[#FF4B4B] text-white px-4 py-1.5 rounded-b-xl text-sm font-black">
                67% OFF
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-[#FFC800]" />
                <h3 className="text-2xl font-black text-[#3C3C3C]">Premium</h3>
              </div>
              
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-5xl font-black text-gradient-yellow">$9.99</span>
                <span className="text-[#AFAFAF] line-through font-bold">$29.99</span>
                <span className="text-[#777777] text-sm font-semibold">/year</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {["∞ Unlimited games", "Zero ads forever", "Exclusive badges", "Streak shields", "Early access", "VIP Discord"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-[#3C3C3C]">
                    <span className="text-[#FFC800] text-xl">★</span>
                    {f}
                  </li>
                ))}
              </ul>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-3d btn-3d-yellow w-full py-4 text-lg"
              >
                Get Premium — Save $20
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-16 border-t border-[#E5E0DA] bg-[#F7F4F0]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #3D8C02' }}>
                <span className="text-xl">🔥</span>
              </div>
              <span className="font-black text-xl text-[#3C3C3C]">GenRizz</span>
            </div>
            
            <div className="flex gap-4">
              {['Twitter', 'TikTok', 'Instagram', 'Discord'].map((s) => (
                <a key={s} href="#" className="text-[#AFAFAF] hover:text-[#58CC02] transition-colors font-bold text-sm">
                  {s}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to={createPageUrl('Help')} className="text-[#777777] hover:text-[#58CC02] transition-colors font-semibold text-sm">
              Help & Support
            </Link>
            <Link to={createPageUrl('Premium')} className="text-[#777777] hover:text-[#58CC02] transition-colors font-semibold text-sm">
              Premium
            </Link>
            <Link to={createPageUrl('Roadmap')} className="text-[#777777] hover:text-[#58CC02] transition-colors font-semibold text-sm">
              Roadmap
            </Link>
            <a href="#" className="text-[#777777] hover:text-[#58CC02] transition-colors font-semibold text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-[#777777] hover:text-[#58CC02] transition-colors font-semibold text-sm">
              Terms of Service
            </a>
          </div>
          
          <div className="text-center text-[#AFAFAF] text-sm font-semibold">
            © 2025 GenRizz. Made with 🔥 for every generation.
          </div>
        </div>
      </footer>
    </div>
  );
}