import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function StreakCounter({ streak, show }) {
  if (!show || streak < 2) return null;

  const getMessage = () => {
    if (streak >= 10) return "UNSTOPPABLE! 🔥";
    if (streak >= 7) return "ON FIRE! 🔥";
    if (streak >= 5) return "AMAZING! ⚡";
    if (streak >= 3) return "Nice streak!";
    return `${streak} in a row!`;
  };

  const getMultiplier = () => {
    if (streak >= 10) return 2.0;
    if (streak >= 7) return 1.75;
    if (streak >= 5) return 1.5;
    if (streak >= 3) return 1.25;
    return 1;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: streak >= 5 
              ? 'linear-gradient(135deg, #FF6B35, #FF4B4B)' 
              : 'linear-gradient(135deg, #FFE066, #FF6B35)',
            boxShadow: `0 0 ${streak * 3}px ${streak >= 5 ? '#FF4B4B' : '#FF6B35'}`
          }}
        >
          <Flame className="w-5 h-5 text-white" />
          <span className="font-black text-white">{getMessage()}</span>
          {streak >= 3 && (
            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
              {getMultiplier()}x XP
            </span>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export const calculateStreakBonus = (baseXP, streak) => {
  if (streak >= 10) return Math.round(baseXP * 2.0);
  if (streak >= 7) return Math.round(baseXP * 1.75);
  if (streak >= 5) return Math.round(baseXP * 1.5);
  if (streak >= 3) return Math.round(baseXP * 1.25);
  return baseXP;
};