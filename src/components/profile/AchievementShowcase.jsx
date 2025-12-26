import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const SHOWCASE_BADGES = [
  { id: 'first_game', name: 'First Steps', emoji: '🎮', description: 'Play your first game', requirement: 1, type: 'games' },
  { id: 'streak_7', name: 'Week Warrior', emoji: '🔥', description: '7 day streak', requirement: 7, type: 'streak' },
  { id: 'perfect_score', name: 'Perfectionist', emoji: '💯', description: 'Get 100% on any game', requirement: 100, type: 'score' },
  { id: 'games_10', name: 'Explorer', emoji: '🗺️', description: 'Try 10 different games', requirement: 10, type: 'variety' },
  { id: 'xp_1000', name: 'XP Hunter', emoji: '⚡', description: 'Earn 1000 total XP', requirement: 1000, type: 'xp' },
  { id: 'social', name: 'Social Butterfly', emoji: '🦋', description: 'Add 5 friends', requirement: 5, type: 'friends' },
];

export default function AchievementShowcase({ stats, compact = false }) {
  const getProgress = (badge) => {
    switch (badge.type) {
      case 'games': return Math.min((stats.totalPlays || 0) / badge.requirement, 1);
      case 'streak': return Math.min((stats.streak || 0) / badge.requirement, 1);
      case 'score': return stats.hasPerfect ? 1 : 0;
      case 'variety': return Math.min((stats.gamesUnlocked || 0) / badge.requirement, 1);
      case 'xp': return Math.min((stats.totalXP || 0) / badge.requirement, 1);
      case 'friends': return Math.min((stats.friendCount || 0) / badge.requirement, 1);
      default: return 0;
    }
  };

  const unlockedCount = SHOWCASE_BADGES.filter(b => getProgress(b) >= 1).length;

  if (compact) {
    return (
      <Link to={createPageUrl('Achievements')} className="block">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="card-3d card-3d-interactive p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-yellow)]/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-[var(--brand-yellow)]" />
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)]">Achievements</p>
                <p className="text-sm text-[var(--text-secondary)]">{unlockedCount}/{SHOWCASE_BADGES.length} unlocked</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {SHOWCASE_BADGES.slice(0, 4).map((badge, i) => (
                  <div 
                    key={badge.id}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border-2 border-white ${
                      getProgress(badge) >= 1 ? 'bg-[var(--brand-yellow)]/20' : 'bg-[var(--surface-3)] grayscale'
                    }`}
                  >
                    {badge.emoji}
                  </div>
                ))}
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <div className="card-3d p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-[var(--text-primary)]">Badges</h3>
        <Link to={createPageUrl('Achievements')} className="text-sm text-[var(--brand-blue)] font-bold">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {SHOWCASE_BADGES.map((badge) => {
          const progress = getProgress(badge);
          const unlocked = progress >= 1;
          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.1 }}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-2 ${
                unlocked 
                  ? 'bg-gradient-to-br from-[var(--brand-yellow)]/20 to-[#FFB347]/20 border-2 border-[var(--brand-yellow)]/30' 
                  : 'bg-[var(--surface-3)]'
              }`}
            >
              <span className={`text-2xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
                {badge.emoji}
              </span>
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-3)]/80 rounded-xl">
                  <Lock className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
              )}
              {!unlocked && progress > 0 && (
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-[var(--border-strong)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--brand-green)]" 
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}