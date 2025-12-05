import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { UserProgress, UserStreak, DailyPlayCount } from '@/api/entities';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/components/contexts/LanguageContext';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { GAMES_LIST, GAMES, getGameLevel, GAME_CATEGORIES_META, TRENDING_GAMES } from '@/components/constants/games';
import { Zap, ChevronRight, Bell, Play, Rocket, TrendingUp, Sparkles, Crown, MapIcon, Settings, HelpCircle } from 'lucide-react';

import CategoryCard from '@/components/home/CategoryCard';
import GameIcon from '@/components/home/GameIcon';
import Mascot from '@/components/ui/Mascot';
import DailyChallenge from '@/components/daily/DailyChallenge';
import StreakWidget from '@/components/streak/StreakWidget';
import DailyQuests from '@/components/quests/DailyQuests';
import HeartsSystem from '@/components/hearts/HeartsSystem';
import XPLeagues from '@/components/leagues/XPLeagues';
import PartyMode from '@/components/multiplayer/PartyMode';
import WeeklyRecap from '@/components/viral/WeeklyRecap';

export default function Home() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [showPartyMode, setShowPartyMode] = useState(false);
  const [showWeeklyRecap, setShowWeeklyRecap] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: userProgress = [] } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: () => UserProgress.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const { data: userStreak } = useQuery({
    queryKey: ['userStreak', user?.id],
    queryFn: async () => {
      const streaks = await UserStreak.filter({ user_id: user?.id });
      return streaks[0] || null;
    },
    enabled: !!user?.id,
  });

  const { data: dailyPlayCount } = useQuery({
    queryKey: ['dailyPlayCount', user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const counts = await DailyPlayCount.filter({ user_id: user?.id, date: today });
      return counts[0] || { count: 0, games_played: 0 };
    },
    enabled: !!user?.id,
  });

  const progressMap = userProgress.reduce((acc, p) => ({ ...acc, [p.game_id]: p }), {});
  const totalXP = userProgress.reduce((sum, p) => sum + (p.total_xp || 0), 0);
  const streak = userStreak?.current_streak || 0;
  const gamesPlayedToday = dailyPlayCount?.count || dailyPlayCount?.games_played || 0;

  // Check if it's Sunday for Weekly Recap
  useEffect(() => {
    const today = new Date();
    const lastRecapShown = localStorage.getItem('lastRecapShown');
    const currentWeek = `${today.getFullYear()}-${Math.ceil((today.getDate() + today.getDay()) / 7)}`;
    
    if (today.getDay() === 0 && lastRecapShown !== currentWeek && user && userProgress.length > 0) {
      setShowWeeklyRecap(true);
      localStorage.setItem('lastRecapShown', currentWeek);
    }
  }, [user, userProgress]);

  // Calculate weekly stats for recap
  const weeklyStats = {
    gamesPlayed: userProgress.reduce((sum, p) => sum + (p.total_plays || 0), 0),
    totalXP,
    avgScore: userProgress.length > 0 
      ? Math.round(userProgress.reduce((sum, p) => sum + (p.highest_score || 0), 0) / userProgress.length)
      : 0,
    bestGame: userProgress.length > 0 
      ? (() => {
          const best = userProgress.reduce((a, b) => (a.highest_score || 0) > (b.highest_score || 0) ? a : b);
          const game = GAMES[best.game_id];
          return game ? { title: game.title, score: best.highest_score } : null;
        })()
      : null,
    streak,
    percentile: Math.min(95, Math.max(5, 50 + Math.floor(totalXP / 100))),
    improvement: 0,
  };

  const lastPlayedProgress = userProgress
    .filter(p => p.last_played_date)
    .sort((a, b) => new Date(b.last_played_date) - new Date(a.last_played_date))[0];
  const lastGame = lastPlayedProgress ? GAMES[lastPlayedProgress.game_id] : null;

  const dayIndex = Math.floor(Date.now() / 86400000) % GAMES_LIST.length;
  const dailyGame = GAMES_LIST[dayIndex];

  const goToGame = (gameId) => {
    navigate(createPageUrl('Gameplay') + '?gameId=' + gameId);
  };

  const gamesByCategory = {};
  GAMES_LIST.forEach(game => {
    if (!gamesByCategory[game.category]) {
      gamesByCategory[game.category] = [];
    }
    gamesByCategory[game.category].push(game);
  });

  const dailyGoal = 3;
  const goalProgress = Math.min(gamesPlayedToday / dailyGoal, 1);
  const isGoalComplete = gamesPlayedToday >= dailyGoal;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Enhanced Header with better spacing */}
      <header className="glass-light border-b border-slate-200/50 sticky top-0 z-40 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto container-padding py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center text-white shadow-lg" style={{ boxShadow: '0 3px 0 #3D8C02' }}>
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <span className="font-black text-xl text-slate-900 tracking-tight">GenRizz</span>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {streak > 0 && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex badge-3d badge-streak"
              >
                <span>🔥</span>
                <span className="hidden md:inline">{streak} day streak</span>
                <span className="md:hidden">{streak}</span>
              </motion.div>
            )}

            <HeartsSystem userId={user?.id} />

            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="badge-3d badge-xp"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">{totalXP.toLocaleString()}</span>
              <span className="sm:hidden">{totalXP > 999 ? `${(totalXP/1000).toFixed(1)}k` : totalXP}</span>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-xl bg-white hover:bg-[#F0EDE8] flex items-center justify-center relative transition-all border-2 border-[#E5E0DA] shadow-sm"
            >
              <Bell className="w-5 h-5 text-[#777777]" />
            </motion.button>
            
            <Link to={createPageUrl('Help')}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl bg-white hover:bg-[#F0EDE8] flex items-center justify-center relative transition-all border-2 border-[#E5E0DA] shadow-sm"
              >
                <HelpCircle className="w-5 h-5 text-[#777777]" />
              </motion.button>
            </Link>

            <Link to={createPageUrl('Settings')}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl bg-white hover:bg-[#F0EDE8] flex items-center justify-center relative transition-all border-2 border-[#E5E0DA] shadow-sm"
              >
                <Settings className="w-5 h-5 text-[#777777]" />
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      {/* Enhanced Quick Nav Bar */}
      <div className="bg-white/50 border-b border-[#E5E0DA]/50 overflow-x-auto backdrop-blur-sm">
        <div className="max-w-7xl mx-auto container-padding py-3 flex items-center gap-2 md:gap-4 text-sm font-bold whitespace-nowrap scrollbar-hide">
          <Link 
            to={createPageUrl('Shop')} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#F7F4F0] text-[#3C3C3C] transition-all hover:scale-105"
          >
            <span className="text-lg">🛒</span> <span className="hidden sm:inline">Shop</span>
          </Link>
          <Link 
            to={createPageUrl('WorldMap')} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#F7F4F0] text-[#3C3C3C] transition-all hover:scale-105"
          >
            <span className="text-lg">🌍</span> <span className="hidden sm:inline">Map</span>
          </Link>
          <Link 
            to={createPageUrl('Squads')} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#F7F4F0] text-[#3C3C3C] transition-all hover:scale-105"
          >
            <span className="text-lg">🛡️</span> <span className="hidden sm:inline">Squads</span>
          </Link>
          <Link 
            to={createPageUrl('CreatorStudio')} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#F7F4F0] text-[#3C3C3C] transition-all hover:scale-105"
          >
            <span className="text-lg">🎨</span> <span className="hidden sm:inline">Creator</span>
          </Link>
          {user?.role === 'admin' && (
            <Link 
              to={createPageUrl('Admin')} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#FF4B4B]/10 text-[#FF4B4B] transition-all hover:scale-105"
            >
              <span className="text-lg">⚡</span> <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto container-padding py-6 md:py-8 space-section">
        {/* Enhanced Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Welcome + Goal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome with better typography */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-2"
            >
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {user ? (
                  <>
                    {t('common.greeting')}, <span className="text-gradient-rainbow">{user.full_name?.split(' ')[0] || 'Player'}</span>
                  </>
                ) : (
                  t('common.welcome')
                )}
              </h1>
              <p className="text-slate-600 text-lg font-semibold">{t('common.ready')}</p>
            </motion.div>

            {/* Daily Goal Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`card-3d p-5 ${isGoalComplete ? 'card-3d-yellow' : ''}`}
            >
              <div className="flex items-center gap-5">
                {/* Progress Ring */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E8E4DF" strokeWidth="10" />
                    <motion.circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke={isGoalComplete ? '#FFC800' : '#58CC02'}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={251}
                      initial={{ strokeDashoffset: 251 }}
                      animate={{ strokeDashoffset: 251 - (goalProgress * 251) }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isGoalComplete ? (
                      <motion.span 
                        className="text-3xl"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🎉
                      </motion.span>
                    ) : (
                      <span className="text-lg font-black text-[#3C3C3C]">{gamesPlayedToday}/{dailyGoal}</span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-black text-[#3C3C3C] text-xl">
                    {isGoalComplete ? t('common.goal_complete') : t('common.daily_goal')}
                  </h3>
                  <p className="text-[#777777] font-semibold">
                    {isGoalComplete 
                      ? 'Amazing! Come back tomorrow 🔥' 
                      : `${t('common.play_more')} (${dailyGoal - gamesPlayedToday})`
                    }
                  </p>
                </div>

                {streak > 0 && (
                  <div className="badge-3d badge-streak">
                    <span>🔥</span>
                    <span>{streak}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Continue Playing */}
            {lastGame && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => goToGame(lastGame.id)}
                className="card-3d card-3d-interactive p-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <GameIcon gameId={lastGame.id} size="md" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#58CC02] uppercase tracking-wide">{t('common.continue_playing')}</span>
                    <h3 className="font-black text-[#3C3C3C] text-lg truncate">{lastGame.title}</h3>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center shadow-lg"
                    style={{ boxShadow: '0 4px 0 #3D8C02' }}
                  >
                    <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Daily Challenge */}
          <DailyChallenge user={user} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Streak & League Widgets */}
          <div className="grid grid-cols-2 gap-4">
            <StreakWidget userId={user?.id} />
            <XPLeagues userId={user?.id} />
          </div>

          {/* Quick Play */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => goToGame(GAMES_LIST[Math.floor(Math.random() * GAMES_LIST.length)].id)}
            className="card-3d card-3d-blue p-5 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1CB0F6]/20 flex items-center justify-center">
                <Rocket className="w-7 h-7 text-[#1CB0F6]" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#3C3C3C] text-lg">{t('common.quick_play')}</h3>
                <p className="text-[#777777] font-semibold text-sm">5 questions, 90 seconds</p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#AFAFAF]" />
            </div>
          </motion.div>

          {/* Battle Arena */}
          <Link to={createPageUrl('BattleArena')}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="card-3d card-3d-orange p-5 cursor-pointer h-full mt-4 md:mt-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FF4B4B]/20 flex items-center justify-center text-3xl">
                  ⚔️
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-[#3C3C3C] text-lg">{t('common.battle_arena')}</h3>
                  <p className="text-[#777777] font-semibold text-sm">Live PvP Trivia</p>
                </div>
                <ChevronRight className="w-6 h-6 text-[#AFAFAF]" />
              </div>
            </motion.div>
          </Link>
          </div>

        {/* Daily Quests */}
        <div className="mb-8">
          <DailyQuests userId={user?.id} />
        </div>

        {/* Family Challenge & Party Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to={createPageUrl('FamilyChallenge')} className="block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="card-3d card-3d-pink p-5 cursor-pointer h-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FF86D0]/20 flex items-center justify-center text-3xl">
                  👨‍👩‍👧
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-[#3C3C3C] text-lg">Parent vs Kid</h3>
                  <p className="text-[#777777] font-semibold text-sm">Bridge the generation gap!</p>
                </div>
                <ChevronRight className="w-6 h-6 text-[#AFAFAF]" />
              </div>
            </motion.div>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowPartyMode(true)}
            className="card-3d card-3d-purple p-5 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#CE82FF]/20 flex items-center justify-center text-3xl">
                🎉
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#3C3C3C] text-lg">Party Mode</h3>
                <p className="text-[#777777] font-semibold text-sm">Play with 2-8 friends!</p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#AFAFAF]" />
            </div>
          </motion.div>
        </div>

        {/* Trending Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#FF86D0]" />
            <h2 className="text-xl font-black text-[#3C3C3C]">{t('common.trending')}</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {TRENDING_GAMES.map((gameId, i) => {
              const game = GAMES[gameId];
              if (!game) return null;
              const progress = progressMap[gameId];
              return (
                <motion.button
                  key={gameId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToGame(gameId)}
                  className="flex-shrink-0 card-3d card-3d-interactive p-4 min-w-[140px] text-center"
                >
                  <GameIcon gameId={gameId} size="md" className="mx-auto mb-3" />
                  <p className="font-bold text-[#3C3C3C] text-sm">{game.title}</p>
                  <p className="text-xs text-[#AFAFAF] font-semibold">{progress?.highest_score || 0}% best</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#3C3C3C] mb-6">{t('common.all_categories')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(GAME_CATEGORIES_META).map(([id, category], index) => {
              const games = gamesByCategory[id] || [];
              if (games.length === 0) return null;
              
              return (
                <CategoryCard
                  key={id}
                  category={category}
                  games={games}
                  progressMap={progressMap}
                  onGameClick={goToGame}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </main>

      <div className="h-32" />

      {/* Party Mode Modal */}
      <PartyMode
        isOpen={showPartyMode}
        onClose={() => setShowPartyMode(false)}
        user={user}
        onStartGame={({ gameId }) => {
          setShowPartyMode(false);
          navigate(createPageUrl('Gameplay') + '?gameId=' + gameId);
        }}
      />

      {/* Weekly Recap Modal */}
      <WeeklyRecap
        isOpen={showWeeklyRecap}
        onClose={() => setShowWeeklyRecap(false)}
        stats={weeklyStats}
      />
    </div>
  );
}