import React from 'react';
import { motion } from 'framer-motion';
import { GAME_CATEGORIES_META, GAME_CATEGORIES } from '../constants/games';
import { getFlags } from '@/services/flags';

const baseCategories = [
  { id: 'all', label: 'All Games', emoji: '🎮' },
  { id: 'gen-z-fluency', label: 'Gen Z', emoji: '💀' },
  { id: 'revenge-of-boomers', label: 'Boomers', emoji: '📻' },
  { id: 'millennial-nostalgia', label: 'Millennials', emoji: '📼' },
  { id: 'gen-x-wisdom', label: 'Gen X', emoji: '🎸' },
  { id: 'gen-alpha', label: 'Gen Alpha', emoji: '🧒' },
  { id: 'mental-age', label: 'Mental Age', emoji: '🎂' },
  { id: 'dating-iq', label: 'Social IQ', emoji: '💬' },
  { id: 'family-bridge', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'red-flag', label: 'Red Flags', emoji: '🚩' },
  { id: 'boomer-humor', label: 'Dad Jokes', emoji: '😂' },
  { id: 'daily', label: 'Daily', emoji: '📅' },
  { id: 'events', label: 'Spotlight', emoji: '✨', flag: 'EVENTS' },
];

const getCategories = () => {
  const flags = getFlags();
  return baseCategories.filter(cat => {
    if (cat.flag && !flags[cat.flag]) return false;
    return true;
  });
}

// Re-export for backwards compatibility
export { GAME_CATEGORIES };

export default function CategoryTabs({ activeCategory, onCategoryChange }) {
  const categories = getCategories();
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            activeCategory === cat.id
              ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20'
              : 'bg-[#1E1E1E] text-white/50 hover:text-white hover:bg-[#252525] border border-white/5'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
          {activeCategory === cat.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-[#FF6B35] rounded-xl -z-10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
