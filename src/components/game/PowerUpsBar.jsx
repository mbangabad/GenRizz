import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, SkipForward } from 'lucide-react';

const POWER_UPS = [
  { id: 'fifty', icon: '50/50', name: '50/50', description: 'Remove 2 wrong answers', color: 'var(--brand-purple)' },
  { id: 'time', icon: Clock, name: '+10s', description: 'Add 10 seconds', color: 'var(--brand-blue)' },
  { id: 'hint', icon: Eye, name: 'Hint', description: 'Show a hint', color: 'var(--brand-green)' },
  { id: 'skip', icon: SkipForward, name: 'Skip', description: 'Skip (counts as correct)', color: 'var(--brand-orange)' },
];

export default function PowerUpsBar({ available = {}, onUse, disabled = false, showHint = false }) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      {POWER_UPS.map(powerUp => {
        const count = available[powerUp.id] || 0;
        const Icon = powerUp.icon;
        const isDisabled = disabled || count === 0;
        
        // Special case: hide hint if already showing
        if (powerUp.id === 'hint' && showHint) return null;
        
        return (
          <motion.button
            key={powerUp.id}
            whileHover={!isDisabled ? { scale: 1.1 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            onClick={() => !isDisabled && onUse(powerUp.id)}
            disabled={isDisabled}
            className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
              isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
            style={{ 
              background: isDisabled ? 'var(--surface-3)' : `${powerUp.color}20`,
              border: `2px solid ${isDisabled ? 'var(--border-strong)' : powerUp.color}`,
              boxShadow: isDisabled ? 'none' : `0 4px 0 ${powerUp.color}40`
            }}
            title={powerUp.description}
          >
            {typeof Icon === 'string' ? (
              <span className="text-xs font-black" style={{ color: isDisabled ? 'var(--text-muted)' : powerUp.color }}>{Icon}</span>
            ) : (
              <Icon className="w-5 h-5" style={{ color: isDisabled ? 'var(--text-muted)' : powerUp.color }} />
            )}
            {count > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                style={{ background: powerUp.color }}
              >
                {count}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export { POWER_UPS };