import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Trophy, Target } from 'lucide-react';
import ProgressRing from '../ui/ProgressRing';

export default function StatsGrid({ streak, totalXP, gamesPlayed, avgScore }) {
  const stats = [
    {
      icon: Flame,
      value: streak || 0,
      label: 'Day Streak',
      color: 'var(--brand-orange)',
      bgGradient: 'from-[var(--brand-orange)]/20 to-[var(--brand-red)]/20',
      animate: streak > 0,
    },
    {
      icon: Zap,
      value: totalXP || 0,
      label: 'Total XP',
      color: 'var(--brand-blue)',
      bgGradient: 'from-[var(--brand-blue)]/20 to-[var(--brand-blue-hover)]/20',
    },
    {
      icon: Trophy,
      value: gamesPlayed || 0,
      label: 'Games',
      color: 'var(--brand-yellow)',
      bgGradient: 'from-[var(--brand-yellow)]/20 to-[var(--brand-orange)]/20',
    },
    {
      icon: Target,
      value: avgScore ? `${avgScore}%` : '0%',
      label: 'Avg Score',
      color: 'var(--brand-green)',
      bgGradient: 'from-[var(--brand-green)]/20 to-[var(--brand-blue-hover)]/20',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`relative p-3 rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-white/5 text-center overflow-hidden`}
        >
          {/* Glow Effect */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${stat.color}, transparent 70%)`,
            }}
          />
          
          <motion.div
            animate={stat.animate ? { 
              scale: [1, 1.2, 1],
              rotate: [-5, 5, -5],
            } : {}}
            transition={{ duration: 0.6, repeat: stat.animate ? Infinity : 0 }}
          >
            <stat.icon 
              className="w-5 h-5 mx-auto mb-1" 
              style={{ color: stat.color }}
              fill={stat.animate ? stat.color : 'none'}
            />
          </motion.div>
          
          <motion.p 
            className="text-lg font-black text-white"
            key={stat.value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
          </motion.p>
          <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}