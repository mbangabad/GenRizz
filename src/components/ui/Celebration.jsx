import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Star, Zap } from 'lucide-react';
import { hapticSuccess, hapticStreak, hapticLevelUp } from '@/utils/haptic';

/**
 * Enhanced Celebration Component
 * Provides Duolingo-like micro-celebrations
 */
export default function Celebration({ 
  trigger, 
  type = 'correct', 
  streak = 0,
  showXP = false,
  xpEarned = 0,
  onComplete 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      
      // Haptic feedback
      if (type === 'correct') {
        hapticSuccess();
      } else if (type === 'streak') {
        hapticStreak();
      } else if (type === 'levelUp') {
        hapticLevelUp();
      }

      // Auto-hide after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger, type, onComplete]);

  if (!isVisible) return null;

  const confettiCount = type === 'levelUp' ? 50 : type === 'streak' ? 30 : 20;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Confetti particles */}
          {Array.from({ length: confettiCount }).map((_, i) => {
            const colors = ['#4ADE80', '#FBBF24', '#3B82F6', '#EF4444', '#A855F7', '#EC4899'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = 1 + Math.random() * 1;

            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: color,
                  left: `${left}%`,
                  top: '-10px',
                }}
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 360,
                  opacity: 0,
                  x: (Math.random() - 0.5) * 200,
                }}
                transition={{
                  duration,
                  delay,
                  ease: 'easeOut',
                }}
              />
            );
          })}

          {/* Main celebration message */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            <div className="text-center">
              {type === 'correct' && (
                <motion.div
                  className="text-6xl mb-2"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: 1,
                  }}
                >
                  ✨
                </motion.div>
              )}

              {type === 'streak' && (
                <motion.div
                  className="flex items-center justify-center gap-2 mb-2"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-12 h-12 text-yellow-400" />
                  <span className="text-4xl font-black text-yellow-400">
                    {streak} STREAK!
                  </span>
                  <Sparkles className="w-12 h-12 text-yellow-400" />
                </motion.div>
              )}

              {type === 'levelUp' && (
                <motion.div
                  className="mb-2"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: 1,
                  }}
                >
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
                  <p className="text-2xl font-black text-yellow-400 mt-2">LEVEL UP!</p>
                </motion.div>
              )}

              {showXP && xpEarned > 0 && (
                <motion.div
                  className="mt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-lg font-bold text-white">
                      +{xpEarned} XP
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Floating emojis */}
          {type === 'correct' && (
            <>
              {['🎉', '🔥', '💯', '⭐'].map((emoji, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: '40%',
                  }}
                  initial={{ y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    y: -100,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Simple confetti component for quick celebrations
 */
export function Confetti({ trigger, count = 30 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const colors = ['#4ADE80', '#FBBF24', '#3B82F6', '#EF4444', '#A855F7'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;

        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: color, left: `${left}%`, top: '-10px' }}
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: 0,
              x: (Math.random() - 0.5) * 200,
              rotate: 360,
            }}
            transition={{
              duration: 1 + Math.random(),
              delay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

