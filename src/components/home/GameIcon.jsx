import React from 'react';
import { motion } from 'framer-motion';
import { GAMES } from '../constants/games';

// Emoji-based icons with vibrant 3D styling
const ICON_CONFIG = {
  // Consolidated games (12 total)
  'gen-z-fluency': { emoji: '💀', gradient: 'from-[#58D0FF] to-[#3DBEE8]' },
  'boomer-era': { emoji: '📻', gradient: 'from-[#FFD93D] to-[#F5C800]' },
  'millennial-nostalgia': { emoji: '📼', gradient: 'from-[#FF6B9D] to-[#E85A8A]' },
  'gen-x-wisdom': { emoji: '🎸', gradient: 'from-[#4DB6AC] to-[#26A69A]' },
  'gen-alpha': { emoji: '🧒', gradient: 'from-[#B388FF] to-[#9B6FE8]' },
  'mental-age': { emoji: '🧠', gradient: 'from-[#A6E22E] to-[#8BC926]' },
  'generation-quiz': { emoji: '🧬', gradient: 'from-[#A6E22E] to-[#64FFDA]' },
  'social-iq': { emoji: '💬', gradient: 'from-[#FF6B9D] to-[#B388FF]' },
  'family-bridge': { emoji: '👨‍👩‍👧‍👦', gradient: 'from-[#58D0FF] to-[#64FFDA]' },
  'vibe-check': { emoji: '✨', gradient: 'from-[#58CC02] to-[#A6E22E]' },
  'social-awareness': { emoji: '🧠', gradient: 'from-[#FF6B9D] to-[#00CED1]' },
  'boomer-humor': { emoji: '👔', gradient: 'from-[#FFD93D] to-[#FFB347]' },
  
  // Legacy mappings for backward compatibility
  'emoji-detective': { emoji: '🔍', gradient: 'from-[#58D0FF] to-[#00CED1]' },
  'revenge-of-boomers': { emoji: '📻', gradient: 'from-[#FFD93D] to-[#F5C800]' },
  'analog-life': { emoji: '☎️', gradient: 'from-[#FFB347] to-[#FF8F35]' },
  'y2k-culture': { emoji: '💿', gradient: 'from-[#FF6B9D] to-[#FF8FB3]' },
  'nineties-music': { emoji: '🎵', gradient: 'from-[#4DB6AC] to-[#00CED1]' },
  'dating-decoder': { emoji: '💬', gradient: 'from-[#FF6B9D] to-[#B388FF]' },
  'text-interpretation': { emoji: '📱', gradient: 'from-[#B388FF] to-[#FF6B9D]' },
  'generation-gap': { emoji: '👨‍👩‍👧‍👦', gradient: 'from-[#58D0FF] to-[#64FFDA]' },
  'communication-styles': { emoji: '💬', gradient: 'from-[#64FFDA] to-[#58D0FF]' },
  'red-flag-detector': { emoji: '✨', gradient: 'from-[#58CC02] to-[#A6E22E]' },
  'social-intelligence': { emoji: '🧠', gradient: 'from-[#FF6B9D] to-[#FF6B35]' },
  'dad-jokes': { emoji: '👔', gradient: 'from-[#FFD93D] to-[#FFB347]' },
  'vintage-comedy': { emoji: '🎭', gradient: 'from-[#FFE066] to-[#FFD93D]' },
  'ipad-kid-culture': { emoji: '📱', gradient: 'from-[#B388FF] to-[#9B6FE8]' },
  'tiktok-natives': { emoji: '🎵', gradient: 'from-[#B388FF] to-[#FF6B9D]' },
};

export default function GameIcon({ gameId, size = 'md', className = '' }) {
  const config = ICON_CONFIG[gameId] || { emoji: '🎮', gradient: 'from-[#58D0FF] to-[#3DBEE8]' };
  const game = GAMES[gameId];
  
  const sizeClasses = {
    xs: 'w-8 h-8 text-lg rounded-lg',
    sm: 'w-12 h-12 text-xl rounded-xl',
    md: 'w-14 h-14 text-2xl rounded-2xl',
    lg: 'w-16 h-16 text-3xl rounded-2xl',
    xl: 'w-20 h-20 text-4xl rounded-3xl',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${sizeClasses[size]} 
        bg-gradient-to-br ${config.gradient}
        flex items-center justify-center
        game-icon-3d
        ${className}
      `}
    >
      {game?.icon || config.emoji}
    </motion.div>
  );
}