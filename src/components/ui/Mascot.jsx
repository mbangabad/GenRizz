import React from 'react';
import { motion } from 'framer-motion';

// GenRizz Mascot - "Rizzy" the flame character
// Different moods for different contexts

const MASCOT_MOODS = {
  happy: { emoji: '🔥', eyes: '😄' },
  excited: { emoji: '🔥', eyes: '🤩' },
  thinking: { emoji: '🔥', eyes: '🤔' },
  shocked: { emoji: '💥', eyes: '😱' },
  cool: { emoji: '🔥', eyes: '😎' },
  sad: { emoji: '🔥', eyes: '😢' },
  sleeping: { emoji: '🔥', eyes: '😴' },
  love: { emoji: '💖', eyes: '😍' },
  fire: { emoji: '🔥', eyes: '🔥' },
  celebration: { emoji: '🎉', eyes: '🥳' },
};

export default function Mascot({ 
  mood = 'happy', 
  size = 'md', 
  animate = true,
  className = '',
  showSpeech = false,
  speech = ''
}) {
  const mascot = MASCOT_MOODS[mood] || MASCOT_MOODS.happy;
  
  const sizes = {
    xs: { container: 'w-10 h-10', emoji: 'text-xl' },
    sm: { container: 'w-14 h-14', emoji: 'text-2xl' },
    md: { container: 'w-20 h-20', emoji: 'text-4xl' },
    lg: { container: 'w-28 h-28', emoji: 'text-5xl' },
    xl: { container: 'w-36 h-36', emoji: 'text-6xl' },
    '2xl': { container: 'w-48 h-48', emoji: 'text-7xl' },
  };
  
  const s = sizes[size] || sizes.md;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Speech Bubble */}
      {showSpeech && speech && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow-lg text-sm font-bold whitespace-nowrap z-10"
        >
          {speech}
          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white transform rotate-45" />
        </motion.div>
      )}

      {/* Mascot Container */}
      <motion.div
        animate={animate ? {
          y: [0, -8, 0],
          rotate: [0, -3, 3, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${s.container} relative`}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD93D]/30 to-[#FF6B35]/30 rounded-full blur-xl" />
        
        {/* Main Character */}
        <motion.div 
          className={`relative ${s.container} rounded-full bg-gradient-to-br from-[#FFD93D] via-[#FF8F35] to-[#FF6B35] flex items-center justify-center shadow-lg`}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          style={{
            boxShadow: '0 8px 0 #E55A2B, 0 12px 30px rgba(255, 107, 53, 0.4)'
          }}
        >
          {/* Face */}
          <span className={s.emoji}>{mascot.eyes}</span>
          
          {/* Flame Top */}
          <motion.div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {mascot.emoji}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Mini mascot for inline use
export function MiniMascot({ mood = 'happy', className = '' }) {
  const mascot = MASCOT_MOODS[mood] || MASCOT_MOODS.happy;
  
  return (
    <motion.span 
      className={`inline-block ${className}`}
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {mascot.emoji}
    </motion.span>
  );
}

// Celebration mascot with confetti
export function CelebrationMascot({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Mascot mood="celebration" size="xl" />
      
      {/* Confetti */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: ['#A6E22E', '#FF6B9D', '#58D0FF', '#FFD93D', '#B388FF'][i % 5],
            left: `${20 + Math.random() * 60}%`,
            top: '-20px',
          }}
          animate={{
            y: [0, 200],
            x: [0, (Math.random() - 0.5) * 100],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
}