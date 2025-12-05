import React from 'react';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PremiumBadge({ size = 'sm', showLabel = false }) {
  const sizes = {
    xs: { container: 'w-5 h-5', icon: 'w-3 h-3' },
    sm: { container: 'w-6 h-6', icon: 'w-3.5 h-3.5' },
    md: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    lg: { container: 'w-10 h-10', icon: 'w-5 h-5' },
  };

  const s = sizes[size] || sizes.sm;

  return (
    <motion.div 
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      className={`inline-flex items-center gap-1.5 ${showLabel ? 'badge-3d badge-xp' : ''}`}
    >
      <div 
        className={`${s.container} rounded-lg bg-gradient-to-br from-[#FFC800] to-[#FFB347] flex items-center justify-center`}
        style={{ boxShadow: '0 2px 0 #E5B400' }}
      >
        <Crown className={`${s.icon} text-white`} />
      </div>
      {showLabel && <span className="font-bold text-[#3C3C3C]">Premium</span>}
    </motion.div>
  );
}