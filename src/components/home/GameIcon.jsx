import React from 'react';
import { motion } from 'framer-motion';
import { GAMES } from '../constants/games';

// Emoji-based icons with vibrant 3D styling
const ICON_CONFIG = {
  // Consolidated games (12 total)
  'gen-z-fluency': { emoji: '💀', gradient: 'from-[var(--brand-blue)] to-[var(--brand-blue-dark)]' },
  'boomer-era': { emoji: '📻', gradient: 'from-[var(--brand-yellow)] to-[var(--brand-yellow-dark)]' },
  'millennial-nostalgia': { emoji: '📼', gradient: 'from-[var(--brand-pink)] to-[var(--brand-pink-dark)]' },
  'gen-x-wisdom': { emoji: '🎸', gradient: 'from-[var(--brand-blue)] to-[var(--brand-blue-dark)]' },
  'gen-alpha': { emoji: '🧒', gradient: 'from-[var(--brand-purple)] to-[var(--brand-purple-dark)]' },
  'mental-age': { emoji: '🧠', gradient: 'from-[var(--brand-green)] to-[var(--brand-green-dark)]' },
  'generation-quiz': { emoji: '🧬', gradient: 'from-[var(--brand-green)] to-[var(--brand-blue)]' },
  'social-iq': { emoji: '💬', gradient: 'from-[var(--brand-pink)] to-[var(--brand-purple)]' },
  'family-bridge': { emoji: '👨‍👩‍👧‍👦', gradient: 'from-[var(--brand-blue)] to-[var(--brand-blue-hover)]' },
  'vibe-check': { emoji: '✨', gradient: 'from-[var(--brand-green)] to-[var(--brand-green-hover)]' },
  'social-awareness': { emoji: '🧠', gradient: 'from-[var(--brand-pink)] to-[var(--brand-blue)]' },
  'boomer-humor': { emoji: '👔', gradient: 'from-[var(--brand-yellow)] to-[var(--brand-orange)]' },
  
  // Legacy mappings for backward compatibility
  'emoji-detective': { emoji: '🔍', gradient: 'from-[var(--brand-blue)] to-[var(--brand-blue-hover)]' },
  'revenge-of-boomers': { emoji: '📻', gradient: 'from-[var(--brand-yellow)] to-[var(--brand-yellow-dark)]' },
  'analog-life': { emoji: '☎️', gradient: 'from-[var(--brand-orange)] to-[var(--brand-orange-dark)]' },
  'y2k-culture': { emoji: '💿', gradient: 'from-[var(--brand-pink)] to-[var(--brand-pink-hover)]' },
  'nineties-music': { emoji: '🎵', gradient: 'from-[var(--brand-blue)] to-[var(--brand-blue-hover)]' },
  'dating-decoder': { emoji: '💬', gradient: 'from-[var(--brand-pink)] to-[var(--brand-purple)]' },
  'text-interpretation': { emoji: '📱', gradient: 'from-[var(--brand-purple)] to-[var(--brand-pink)]' },
  'generation-gap': { emoji: '👨‍👩‍👧‍👦', gradient: 'from-[var(--brand-blue)] to-[var(--brand-blue-hover)]' },
  'communication-styles': { emoji: '💬', gradient: 'from-[var(--brand-blue-hover)] to-[var(--brand-blue)]' },
  'red-flag-detector': { emoji: '✨', gradient: 'from-[var(--brand-green)] to-[var(--brand-green-hover)]' },
  'social-intelligence': { emoji: '🧠', gradient: 'from-[var(--brand-pink)] to-[var(--brand-orange)]' },
  'dad-jokes': { emoji: '👔', gradient: 'from-[var(--brand-yellow)] to-[var(--brand-orange)]' },
  'vintage-comedy': { emoji: '🎭', gradient: 'from-[var(--brand-yellow)] to-[var(--brand-yellow-hover)]' },
  'ipad-kid-culture': { emoji: '📱', gradient: 'from-[var(--brand-purple)] to-[var(--brand-purple-dark)]' },
  'tiktok-natives': { emoji: '🎵', gradient: 'from-[var(--brand-purple)] to-[var(--brand-pink)]' },
};

export default function GameIcon({ gameId, size = 'md', className = '' }) {
  const config = ICON_CONFIG[gameId] || { emoji: '🎮', gradient: 'from-[var(--brand-blue)] to-[var(--brand-blue-dark)]' };
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