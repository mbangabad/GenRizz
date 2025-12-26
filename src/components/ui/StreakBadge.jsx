import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function StreakBadge({ streak }) {
  if (!streak || streak <= 0) return null;

  return (
    <motion.div
      className="relative flex items-center gap-1.5 bg-gradient-to-r from-[color-mix(in_srgb,var(--brand-orange),transparent_80%)] to-[color-mix(in_srgb,var(--brand-red),transparent_80%)] border border-[color-mix(in_srgb,var(--brand-orange),transparent_70%)] px-3 py-1.5 rounded-full overflow-hidden"
      animate={{ 
        boxShadow: [
          '0 0 10px color-mix(in srgb, var(--brand-orange), transparent 70%)',
          '0 0 20px color-mix(in srgb, var(--brand-orange), transparent 50%)',
          '0 0 10px color-mix(in srgb, var(--brand-orange), transparent 70%)',
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Flame className="w-4 h-4 text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
      </motion.div>
      <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-red)]">
        {streak} Day{streak > 1 ? 's' : ''}
      </span>
      
      {/* Fire particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[var(--brand-orange)]"
          style={{ left: `${20 + i * 15}%` }}
          animate={{
            y: [0, -15, -25],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}
    </motion.div>
  );
}