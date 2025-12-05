import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { DailyPlayCount, Score } from '@/api/entities';
import { Target, Zap, CheckCircle, Circle, Gift, ChevronRight } from 'lucide-react';

const DAILY_QUESTS = [
  { id: 'play_3', title: 'Play 3 Games', xp: 50, target: 3, icon: '🎮' },
  { id: 'score_80', title: 'Score 80%+ on any game', xp: 100, target: 1, icon: '🎯' },
  { id: 'daily_challenge', title: 'Complete Daily Challenge', xp: 150, target: 1, icon: '⭐' },
  { id: 'streak', title: 'Maintain your streak', xp: 75, target: 1, icon: '🔥' },
];

export default function DailyQuests({ userId }) {
  const today = new Date().toISOString().split('T')[0];

  const { data: playCount } = useQuery({
    queryKey: ['dailyPlayCount', userId, today],
    queryFn: async () => {
      const counts = await DailyPlayCount.filter({ user_id: userId, date: today });
      return counts[0]?.count || counts[0]?.games_played || 0;
    },
    enabled: !!userId,
  });

  const { data: todayScores = [] } = useQuery({
    queryKey: ['todayScores', userId, today],
    queryFn: async () => {
      return await Score.filter({ user_id: userId });
    },
    enabled: !!userId,
  });

  // Calculate quest progress
  const getQuestProgress = (questId) => {
    switch (questId) {
      case 'play_3':
        return { current: playCount || 0, completed: (playCount || 0) >= 3 };
      case 'score_80':
        const has80 = todayScores.some(s => s.percentage >= 80);
        return { current: has80 ? 1 : 0, completed: has80 };
      case 'daily_challenge':
        return { current: 0, completed: false }; // Would need DailyScore check
      case 'streak':
        return { current: 1, completed: true }; // Simplified
      default:
        return { current: 0, completed: false };
    }
  };

  const completedCount = DAILY_QUESTS.filter(q => getQuestProgress(q.id).completed).length;
  const totalXP = DAILY_QUESTS.filter(q => getQuestProgress(q.id).completed).reduce((sum, q) => sum + q.xp, 0);
  const allComplete = completedCount === DAILY_QUESTS.length;

  return (
    <div className="card-3d p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#58CC02]" />
          <h3 className="font-black text-[#3C3C3C]">Daily Quests</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#777777]">{completedCount}/{DAILY_QUESTS.length}</span>
          {totalXP > 0 && (
            <div className="badge-3d badge-xp text-xs py-0.5 px-2">
              +{totalXP} XP
            </div>
          )}
        </div>
      </div>

      {/* All Complete Bonus */}
      {allComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-[#58CC02] to-[#46A302] rounded-xl p-4 mb-4 text-white text-center"
        >
          <Gift className="w-8 h-8 mx-auto mb-2" />
          <p className="font-black">All Quests Complete! 🎉</p>
          <p className="text-sm opacity-80">+200 Bonus XP</p>
        </motion.div>
      )}

      {/* Quests List */}
      <div className="space-y-3">
        {DAILY_QUESTS.map((quest, i) => {
          const progress = getQuestProgress(quest.id);
          
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                progress.completed ? 'bg-[#58CC02]/10' : 'bg-[#F7F4F0]'
              }`}
            >
              {/* Status Icon */}
              {progress.completed ? (
                <div className="w-8 h-8 rounded-lg bg-[#58CC02] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#E8E4DF] flex items-center justify-center text-lg">
                  {quest.icon}
                </div>
              )}

              {/* Quest Info */}
              <div className="flex-1">
                <p className={`font-bold text-sm ${progress.completed ? 'text-[#58CC02] line-through' : 'text-[#3C3C3C]'}`}>
                  {quest.title}
                </p>
                {!progress.completed && quest.target > 1 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-[#E8E4DF] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#58CC02] rounded-full"
                        style={{ width: `${Math.min(100, (progress.current / quest.target) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#AFAFAF] font-bold">{progress.current}/{quest.target}</span>
                  </div>
                )}
              </div>

              {/* XP Reward */}
              <div className={`flex items-center gap-1 font-bold text-sm ${
                progress.completed ? 'text-[#58CC02]' : 'text-[#FFC800]'
              }`}>
                <Zap className="w-4 h-4" />
                <span>{progress.completed ? '✓' : `+${quest.xp}`}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}