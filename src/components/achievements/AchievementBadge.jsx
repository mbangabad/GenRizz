import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const RARITY_COLORS = {
  common: { bg: 'from-[var(--brand-green)] to-[var(--brand-green-dark)]', border: 'border-[var(--brand-green)]', glow: 'shadow-[var(--brand-green)]/30', text: 'var(--brand-green)' },
  rare: { bg: 'from-[var(--brand-blue)] to-[#1899D6]', border: 'border-[var(--brand-blue)]', glow: 'shadow-[var(--brand-blue)]/30', text: 'var(--brand-blue)' },
  epic: { bg: 'from-[var(--brand-purple)] to-[var(--brand-purple-dark)]', border: 'border-[var(--brand-purple)]', glow: 'shadow-[var(--brand-purple)]/30', text: 'var(--brand-purple)' },
  legendary: { bg: 'from-[var(--brand-yellow)] to-[var(--brand-orange)]', border: 'border-[var(--brand-yellow)]', glow: 'shadow-[var(--brand-yellow)]/30', text: 'var(--brand-yellow)' },
};

export default function AchievementBadge({ 
  achievement, 
  unlocked = false, 
  progress = 0,
  size = 'md' 
}) {
  const rarity = RARITY_COLORS[achievement?.rarity || 'common'];
  
  const sizes = {
    sm: { wrapper: 'w-12 h-12', icon: 'text-xl', ring: 'p-0.5' },
    md: { wrapper: 'w-16 h-16', icon: 'text-2xl', ring: 'p-1' },
    lg: { wrapper: 'w-24 h-24', icon: 'text-4xl', ring: 'p-1.5' },
  };
  const s = sizes[size];

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`relative ${s.ring} rounded-full bg-gradient-to-br ${rarity.bg} ${
        unlocked ? `shadow-lg ${rarity.glow}` : 'opacity-60 grayscale'
      }`}
    >
      <div className={`${s.wrapper} rounded-full bg-white flex items-center justify-center relative overflow-hidden border-2 border-[var(--border-subtle)]`}>
        {unlocked ? (
          <span className={s.icon}>{achievement?.icon}</span>
        ) : (
          <>
            <span className={`${s.icon} opacity-30`}>{achievement?.icon}</span>
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Lock className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
          </>
        )}
        
        {/* Progress ring for locked achievements */}
        {!unlocked && progress > 0 && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="var(--surface-3)"
              strokeWidth="4"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={rarity.text}
              strokeWidth="4"
              strokeDasharray={`${progress * 2.83} 283`}
            />
          </svg>
        )}
      </div>
      
      {/* Shine effect for unlocked */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

export function AchievementCard({ achievement, unlocked = false, unlockedAt = null }) {
  const rarity = RARITY_COLORS[achievement?.rarity || 'common'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${
        unlocked 
          ? `bg-white ${rarity.border}` 
          : 'bg-[var(--surface-1)] border-[var(--border-subtle)] opacity-70'
      }`}
    >
      <AchievementBadge achievement={achievement} unlocked={unlocked} size="md" />
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-[var(--text-primary)]">{achievement?.name}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${rarity.bg} text-white font-bold`}>
            {achievement?.rarity}
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] font-semibold">{achievement?.description}</p>
        {unlockedAt && (
          <p className="text-xs text-[var(--text-muted)] font-semibold mt-1">
            Unlocked {new Date(unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
      
      <div className="text-right">
        <p className="text-sm font-bold text-[var(--brand-purple)]">+{achievement?.xp_reward || 0} XP</p>
      </div>
    </motion.div>
  );
}

export function AchievementUnlockPopup({ achievement, onClose }) {
  const rarity = RARITY_COLORS[achievement?.rarity || 'common'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="card-3d p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center"
        >
          <AchievementBadge achievement={achievement} unlocked size="lg" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-[var(--brand-yellow)] font-bold text-sm mt-6 mb-2">🎉 ACHIEVEMENT UNLOCKED!</p>
          <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">{achievement?.name}</h3>
          <p className="text-[var(--text-secondary)] font-semibold mb-4">{achievement?.description}</p>
          
          <div className="badge-3d badge-xp justify-center py-2">
            <span className="font-bold">+{achievement?.xp_reward || 0} XP</span>
          </div>
        </motion.div>

        <button
          onClick={onClose}
          className="w-full mt-6 btn-3d btn-3d-green py-3"
        >
          Awesome!
        </button>
      </motion.div>
    </motion.div>
  );
}