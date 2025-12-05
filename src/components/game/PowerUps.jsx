import React from 'react';
import { Zap, Clock, Eye, SkipForward } from 'lucide-react';

const POWER_UPS = [
  { id: 'fifty', icon: '50/50', name: '50/50', description: 'Remove 2 wrong answers', color: '#CE82FF' },
  { id: 'time', icon: Clock, name: '+10s', description: 'Add 10 seconds', color: '#1CB0F6' },
  { id: 'hint', icon: Eye, name: 'Hint', description: 'Show a hint', color: '#58CC02' },
  { id: 'skip', icon: SkipForward, name: 'Skip', description: 'Skip question (counts as correct)', color: '#FF9600' },
];

export default function PowerUps({ available, onUse, disabled }) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      {POWER_UPS.map(powerUp => {
        const count = available[powerUp.id] || 0;
        const Icon = powerUp.icon;
        const isDisabled = disabled || count === 0;
        
        return (
          <button
            key={powerUp.id}
            onClick={() => !isDisabled && onUse(powerUp.id)}
            disabled={isDisabled}
            className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
              isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
            }`}
            style={{ 
              background: isDisabled ? 'var(--bg-secondary)' : `${powerUp.color}20`,
              border: `2px solid ${isDisabled ? 'var(--border-color)' : powerUp.color}`,
              boxShadow: isDisabled ? 'none' : `0 4px 0 ${powerUp.color}40`
            }}
            title={powerUp.description}
          >
            {typeof Icon === 'string' ? (
              <span className="text-xs font-black" style={{ color: powerUp.color }}>{Icon}</span>
            ) : (
              <Icon className="w-5 h-5" style={{ color: powerUp.color }} />
            )}
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ background: powerUp.color }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { POWER_UPS };