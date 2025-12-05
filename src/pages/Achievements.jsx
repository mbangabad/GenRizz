import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { auth } from '@/api/auth';
import { UserAchievement } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Lock, Zap } from 'lucide-react';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, getAchievementsByCategory } from '@/components/constants/achievements';
import AchievementBadge, { AchievementCard } from '@/components/achievements/AchievementBadge';

export default function Achievements() {
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: userAchievements = [] } = useQuery({
    queryKey: ['userAchievements', user?.id],
    queryFn: () => UserAchievement.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const unlockedIds = userAchievements.map(a => a.achievement_id);
  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;

  const filteredAchievements = activeCategory === 'all' 
    ? ACHIEVEMENTS 
    : getAchievementsByCategory(activeCategory);

  // Sort: unlocked first, then by rarity
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    const aUnlocked = unlockedIds.includes(a.id);
    const bUnlocked = unlockedIds.includes(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

  const totalXpFromAchievements = userAchievements.reduce((sum, ua) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === ua.achievement_id);
    return sum + (achievement?.xp_reward || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 glass-light border-b border-[#E5E0DA]">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E0DA] flex items-center justify-center hover:bg-[#F0EDE8] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#777777]" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-black text-[#3C3C3C]">Achievements</h1>
            <p className="text-sm text-[#777777] font-semibold">{unlockedCount}/{totalCount} unlocked</p>
          </div>
          <div className="badge-3d badge-xp">
            <Zap className="w-4 h-4" />
            <span>+{totalXpFromAchievements}</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto">
        {/* Progress Overview */}
        <div className="card-3d card-3d-yellow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFC800] to-[#FF9600] flex items-center justify-center shadow-lg"
                   style={{ boxShadow: '0 4px 0 #E58600' }}>
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#3C3C3C]">{unlockedCount}</h2>
                <p className="text-[#777777] text-sm font-semibold">Achievements Unlocked</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-[#CE82FF]">+{totalXpFromAchievements}</p>
              <p className="text-[#777777] text-sm font-semibold">XP Earned</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar-3d">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FFC800] to-[#FF9600]"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-[#777777] font-semibold mt-2 text-center">
            {totalCount - unlockedCount} more to unlock
          </p>
        </div>

        {/* Rarity Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { rarity: 'common', color: '#58CC02', count: ACHIEVEMENTS.filter(a => a.rarity === 'common').length },
            { rarity: 'rare', color: '#1CB0F6', count: ACHIEVEMENTS.filter(a => a.rarity === 'rare').length },
            { rarity: 'epic', color: '#CE82FF', count: ACHIEVEMENTS.filter(a => a.rarity === 'epic').length },
            { rarity: 'legendary', color: '#FFC800', count: ACHIEVEMENTS.filter(a => a.rarity === 'legendary').length },
          ].map((r) => {
            const unlocked = ACHIEVEMENTS.filter(a => 
              a.rarity === r.rarity && unlockedIds.includes(a.id)
            ).length;
            return (
              <div key={r.rarity} className="card-3d p-3 text-center">
                <div className="text-lg font-black" style={{ color: r.color }}>{unlocked}/{r.count}</div>
                <div className="text-xs text-[#777777] font-semibold capitalize">{r.rarity}</div>
              </div>
            );
          })}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-[#58CC02] text-white shadow-md'
                : 'bg-white border-2 border-[#E5E0DA] text-[#777777] hover:text-[#3C3C3C]'
            }`}
            style={activeCategory === 'all' ? { boxShadow: '0 3px 0 #46A302' } : {}}
          >
            All ({ACHIEVEMENTS.length})
          </button>
          {ACHIEVEMENT_CATEGORIES.map((cat) => {
            const count = getAchievementsByCategory(cat.id).length;
            const unlockedCatCount = getAchievementsByCategory(cat.id).filter(a => 
              unlockedIds.includes(a.id)
            ).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-[#58CC02] text-white shadow-md'
                    : 'bg-white border-2 border-[#E5E0DA] text-[#777777] hover:text-[#3C3C3C]'
                }`}
                style={activeCategory === cat.id ? { boxShadow: '0 3px 0 #46A302' } : {}}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-xs opacity-70">({unlockedCatCount}/{count})</span>
              </button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="space-y-3">
          {sortedAchievements.map((achievement, i) => {
            const unlocked = unlockedIds.includes(achievement.id);
            const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <AchievementCard
                  achievement={achievement}
                  unlocked={unlocked}
                  unlockedAt={userAchievement?.unlocked_at}
                />
              </motion.div>
            );
          })}
        </div>

        {sortedAchievements.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-[#AFAFAF]" />
            <p className="text-[#777777] font-semibold">No achievements in this category yet</p>
          </div>
        )}
      </main>
    </div>
  );
}