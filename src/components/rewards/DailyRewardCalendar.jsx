import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Zap, Shield, Sparkles, Check, Lock } from 'lucide-react';
import { DailyReward, UserProgress } from '@/api/entities';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const DAILY_REWARDS = [
  { day: 1, type: 'xp', amount: 25, icon: '⚡', label: '25 XP' },
  { day: 2, type: 'xp', amount: 50, icon: '⚡', label: '50 XP' },
  { day: 3, type: 'power_up', amount: 1, icon: '🎯', label: '50/50' },
  { day: 4, type: 'xp', amount: 75, icon: '⚡', label: '75 XP' },
  { day: 5, type: 'streak_freeze', amount: 1, icon: '🛡️', label: 'Streak Freeze' },
  { day: 6, type: 'xp', amount: 100, icon: '⚡', label: '100 XP' },
  { day: 7, type: 'mystery_box', amount: 1, icon: '🎁', label: 'Mystery Box' },
];

export default function DailyRewardCalendar({ userId }) {
  const [showClaim, setShowClaim] = useState(false);
  const [claimedReward, setClaimedReward] = useState(null);
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: rewards = [] } = useQuery({
    queryKey: ['dailyRewards', userId],
    queryFn: () => DailyReward.filter({ user_id: userId }),
    enabled: !!userId,
  });

  // Calculate current day in cycle (1-7)
  const getConsecutiveDays = () => {
    const sortedRewards = rewards
      .filter(r => r.claimed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedRewards.length === 0) return 1;
    
    const lastClaim = sortedRewards[0];
    const lastDate = new Date(lastClaim.date);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return lastClaim.day_number; // Already claimed today
    if (diffDays === 1) return (lastClaim.day_number % 7) + 1; // Continue streak
    return 1; // Reset to day 1
  };

  const currentDay = getConsecutiveDays();
  const todayClaimed = rewards.some(r => r.date === today && r.claimed);
  const currentReward = DAILY_REWARDS.find(r => r.day === currentDay);

  const claimMutation = useMutation({
    mutationFn: async () => {
      await DailyReward.create({
        user_id: userId,
        date: today,
        day_number: currentDay,
        reward_type: currentReward.type,
        reward_amount: currentReward.amount,
        claimed: true,
      });
      
      // Add XP if reward is XP
      if (currentReward.type === 'xp') {
        const userProgress = await UserProgress.filter({ user_id: userId });
        if (userProgress.length > 0) {
          await UserProgress.update(userProgress[0].id, {
            total_xp: (userProgress[0].total_xp || 0) + currentReward.amount
          });
        }
      }
    },
    onSuccess: () => {
      setClaimedReward(currentReward);
      setShowClaim(true);
      queryClient.invalidateQueries(['dailyRewards']);
    }
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-5 border border-purple-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Daily Rewards</h3>
              <p className="text-xs text-gray-500">Day {currentDay} of 7</p>
            </div>
          </div>
          
          {!todayClaimed && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => claimMutation.mutate()}
              disabled={claimMutation.isLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg"
            >
              Claim!
            </motion.button>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {DAILY_REWARDS.map((reward) => {
            const isPast = reward.day < currentDay;
            const isCurrent = reward.day === currentDay;
            const isFuture = reward.day > currentDay;
            const isClaimed = isPast || (isCurrent && todayClaimed);

            return (
              <motion.div
                key={reward.day}
                whileHover={{ scale: 1.05 }}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 ${
                  isClaimed 
                    ? 'bg-green-100 border-2 border-green-300' 
                    : isCurrent 
                      ? 'bg-purple-100 border-2 border-purple-400 shadow-lg' 
                      : 'bg-white border border-gray-200'
                }`}
              >
                {isClaimed && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {isFuture && (
                  <Lock className="w-3 h-3 text-gray-300 absolute top-1 right-1" />
                )}
                <span className="text-lg">{reward.icon}</span>
                <span className={`text-[10px] font-medium ${isClaimed ? 'text-green-700' : isCurrent ? 'text-purple-700' : 'text-gray-500'}`}>
                  Day {reward.day}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentDay / 7) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
          />
        </div>
      </motion.div>

      {/* Claim Animation Modal */}
      <AnimatePresence>
        {showClaim && claimedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowClaim(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="bg-white rounded-3xl p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-7xl mb-4"
              >
                {claimedReward.icon}
              </motion.div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Reward Claimed!</h2>
              <p className="text-lg text-gray-600 mb-4">{claimedReward.label}</p>
              <p className="text-sm text-gray-400">Come back tomorrow for Day {(currentDay % 7) + 1}!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}