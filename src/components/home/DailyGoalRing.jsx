import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Gift } from 'lucide-react';

export default function DailyGoalRing({ 
  gamesPlayed = 0, 
  dailyGoal = 3, 
  streak = 0,
  xpToday = 0 
}) {
  const progress = Math.min(gamesPlayed / dailyGoal, 1);
  const isComplete = gamesPlayed >= dailyGoal;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-5 ${
        isComplete 
          ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200' 
          : 'bg-white border-2 border-gray-100'
      } shadow-lg`}
    >
      <div className="flex items-center gap-5">
        {/* Ring */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isComplete ? '#F59E0B' : '#FF6B35'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-3xl"
              >
                🎉
              </motion.div>
            ) : (
              <>
                <Target className="w-5 h-5 text-orange-500 mb-0.5" />
                <span className="text-lg font-black text-gray-800">{gamesPlayed}/{dailyGoal}</span>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-800 text-lg">
              {isComplete ? 'Goal Complete!' : 'Daily Goal'}
            </h3>
            {isComplete && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full"
              >
                +50 XP
              </motion.span>
            )}
          </div>
          
          <p className="text-gray-500 text-sm mb-3">
            {isComplete 
              ? 'Amazing work! Come back tomorrow 🔥' 
              : `Play ${dailyGoal - gamesPlayed} more game${dailyGoal - gamesPlayed > 1 ? 's' : ''} to complete`
            }
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 bg-orange-100 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-600">{streak} day streak</span>
              </div>
            )}
            {xpToday > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1 rounded-full">
                <Gift className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-amber-600">+{xpToday} XP today</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}