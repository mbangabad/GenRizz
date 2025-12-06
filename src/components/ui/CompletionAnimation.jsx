import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Crown } from 'lucide-react';
import { hapticLevelUp } from '@/utils/haptic';
import Celebration from './Celebration';

/**
 * Completion Animation Component
 * Shows satisfying end-of-game animations like Duolingo
 */
export default function CompletionAnimation({
  trigger,
  percentage,
  xpEarned,
  tier,
  isNewBest = false,
  onComplete
}) {
  const [phase, setPhase] = useState('idle');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (trigger) {
      setPhase('entering');
      hapticLevelUp();
      
      // Sequence: Enter -> Celebrate -> Show Results
      setTimeout(() => {
        setPhase('celebrating');
        setShowCelebration(true);
      }, 500);

      setTimeout(() => {
        setPhase('complete');
        setShowCelebration(false);
        if (onComplete) onComplete();
      }, 3000);
    }
  }, [trigger, onComplete]);

  if (!trigger || phase === 'idle') return null;

  const isExcellent = percentage >= 90;
  const isGreat = percentage >= 75;
  const isGood = percentage >= 60;

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* Celebration overlay */}
          {showCelebration && (
            <Celebration
              trigger={showCelebration}
              type="levelUp"
              showXP={true}
              xpEarned={xpEarned}
            />
          )}

          {/* Main completion card */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ 
              scale: phase === 'celebrating' ? [1, 1.1, 1] : 1,
              rotate: 0,
              opacity: 1
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            className="relative bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
          >
            {/* Trophy/Icon */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              {isExcellent ? (
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-7xl"
                >
                  🏆
                </motion.div>
              ) : isGreat ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-7xl"
                >
                  ⭐
                </motion.div>
              ) : (
                <div className="text-7xl">🎯</div>
              )}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black text-[#3C3C3C] mb-2"
            >
              {isExcellent ? 'Excellent!' : isGreat ? 'Great Job!' : isGood ? 'Good Work!' : 'Keep Going!'}
            </motion.h2>

            {/* Tier */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-full border-2 border-amber-200">
                <span className="text-2xl">{tier?.emoji || '🎯'}</span>
                <span className="font-black text-amber-700">{tier?.name || 'Player'}</span>
              </div>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className="text-5xl font-black text-[#58CC02] mb-2">
                {percentage}%
              </div>
              <p className="text-[#777777] font-semibold">Score</p>
            </motion.div>

            {/* XP Earned */}
            {xpEarned > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-3 rounded-xl border-2 border-yellow-200"
              >
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-black text-yellow-600">
                  +{xpEarned} XP
                </span>
              </motion.div>
            )}

            {/* New Best Badge */}
            {isNewBest && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border-2 border-purple-200"
              >
                <Crown className="w-4 h-4 text-purple-500" />
                <span className="font-black text-purple-700 text-sm">New Personal Best!</span>
              </motion.div>
            )}

            {/* Progress bar animation */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-6 h-2 bg-[#E8E4DF] rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#58CC02] to-[#4ADE80] rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

