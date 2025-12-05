import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserStreak } from '@/api/entities';
import { Flame, Shield, Calendar, Gift, X, Check } from 'lucide-react';

const STREAK_MILESTONES = [
  { days: 7, reward: '🏆 7-Day Badge', xp: 100 },
  { days: 30, reward: '👑 Monthly Master', xp: 500 },
  { days: 100, reward: '🔥 Century Legend', xp: 2000 },
  { days: 365, reward: '💎 Year Champion', xp: 10000 },
];

export default function StreakWidget({ userId }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: streakData } = useQuery({
    queryKey: ['userStreak', userId],
    queryFn: async () => {
      const streaks = await UserStreak.filter({ user_id: userId });
      return streaks[0] || { current_streak: 0, longest_streak: 0, streak_calendar: [] };
    },
    enabled: !!userId,
  });

  const currentStreak = streakData?.current_streak || 0;
  const longestStreak = streakData?.longest_streak || 0;
  const streakCalendar = streakData?.streak_calendar || [];
  const hasStreakFreeze = streakData?.streak_freeze_available || false;

  // Get last 7 days for display
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last7Days.push({
      date: dateStr,
      day: date.toLocaleDateString('en', { weekday: 'short' })[0],
      completed: streakCalendar.includes(dateStr),
      isToday: i === 0
    });
  }

  // Check next milestone
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > currentStreak);

  return (
    <>
      <motion.button
        onClick={() => setShowCalendar(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="card-3d card-3d-orange p-4 text-center cursor-pointer w-full"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <motion.div
            animate={{ scale: currentStreak > 0 ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5, repeat: currentStreak > 0 ? Infinity : 0, repeatDelay: 2 }}
          >
            <Flame className="w-8 h-8 text-[#FF9600]" />
          </motion.div>
          <span className="text-4xl font-black text-[#FF9600]">{currentStreak}</span>
        </div>
        <p className="text-sm font-bold text-[#3C3C3C]">Day Streak</p>
        
        {/* Mini calendar */}
        <div className="flex justify-center gap-1 mt-3">
          {last7Days.map((day, i) => (
            <div 
              key={i}
              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                day.completed 
                  ? 'bg-[#FF9600] text-white' 
                  : day.isToday 
                    ? 'bg-[#E5E0DA] text-[#777777]' 
                    : 'bg-[#F7F4F0] text-[#AFAFAF]'
              }`}
            >
              {day.completed ? <Check className="w-3 h-3" /> : day.day}
            </div>
          ))}
        </div>
        
        {hasStreakFreeze && (
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-[#1CB0F6] font-bold">
            <Shield className="w-3 h-3" />
            Freeze Ready
          </div>
        )}
      </motion.button>

      {/* Streak Modal */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCalendar(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="card-3d p-6 max-w-sm w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-[#3C3C3C]">🔥 Streak Stats</h3>
                <button 
                  onClick={() => setShowCalendar(false)}
                  className="w-8 h-8 rounded-lg bg-[#F7F4F0] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#777777]" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-[#FF9600]/10 to-[#FF9600]/5 rounded-xl">
                  <Flame className="w-6 h-6 text-[#FF9600] mx-auto mb-1" />
                  <p className="text-3xl font-black text-[#FF9600]">{currentStreak}</p>
                  <p className="text-xs text-[#777777] font-bold">Current</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#CE82FF]/10 to-[#CE82FF]/5 rounded-xl">
                  <Gift className="w-6 h-6 text-[#CE82FF] mx-auto mb-1" />
                  <p className="text-3xl font-black text-[#CE82FF]">{longestStreak}</p>
                  <p className="text-xs text-[#777777] font-bold">Best</p>
                </div>
              </div>

              {/* Calendar */}
              <div className="mb-6">
                <p className="text-sm font-bold text-[#777777] mb-3">Last 7 Days</p>
                <div className="flex justify-between">
                  {last7Days.map((day, i) => (
                    <div key={i} className="text-center">
                      <div 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${
                          day.completed 
                            ? 'bg-[#FF9600] text-white' 
                            : day.isToday 
                              ? 'bg-[#FFC800]/20 border-2 border-[#FFC800]' 
                              : 'bg-[#F7F4F0]'
                        }`}
                      >
                        {day.completed ? (
                          <Flame className="w-5 h-5" />
                        ) : (
                          <span className="text-[#AFAFAF]">-</span>
                        )}
                      </div>
                      <span className={`text-xs font-bold ${day.isToday ? 'text-[#FFC800]' : 'text-[#AFAFAF]'}`}>
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Milestone */}
              {nextMilestone && (
                <div className="bg-[#F7F4F0] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#AFAFAF] uppercase mb-2">Next Milestone</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-[#3C3C3C]">{nextMilestone.reward}</p>
                      <p className="text-sm text-[#777777]">{nextMilestone.days - currentStreak} days to go</p>
                    </div>
                    <div className="badge-3d badge-xp">
                      +{nextMilestone.xp} XP
                    </div>
                  </div>
                  <div className="mt-3 progress-bar-3d h-2">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#FF9600] to-[#FFC800]"
                      style={{ width: `${(currentStreak / nextMilestone.days) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Streak Freeze */}
              <div className="mt-4 flex items-center justify-between p-3 bg-[#1CB0F6]/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#1CB0F6]" />
                  <span className="font-bold text-[#3C3C3C]">Streak Freeze</span>
                </div>
                {hasStreakFreeze ? (
                  <span className="text-sm font-bold text-[#1CB0F6]">1 Available</span>
                ) : (
                  <span className="text-sm font-bold text-[#AFAFAF]">0 Available</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}