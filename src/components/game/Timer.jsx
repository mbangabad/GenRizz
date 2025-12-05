import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ seconds, onTimeUp, isPaused, bonusTime }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (bonusTime > 0) {
      setTimeLeft(prev => prev + bonusTime);
      setShowBonus(true);
      setTimeout(() => setShowBonus(false), 1000);
    }
  }, [bonusTime]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onTimeUp, timeLeft]);

  const percentage = (timeLeft / seconds) * 100;
  const isLow = timeLeft <= 5;
  const color = isLow ? 'var(--accent-red)' : timeLeft <= 10 ? 'var(--accent-orange)' : 'var(--accent-green)';

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full" 
           style={{ background: 'var(--bg-secondary)' }}>
        <Clock className={`w-4 h-4 ${isLow ? 'animate-pulse' : ''}`} style={{ color }} />
        <span className={`font-bold text-lg ${isLow ? 'animate-pulse' : ''}`} style={{ color }}>
          {timeLeft}s
        </span>
      </div>
      
      {/* Progress bar under timer */}
      <div className="absolute -bottom-1 left-0 right-0 h-1 rounded-full overflow-hidden" 
           style={{ background: 'var(--bg-card)' }}>
        <div className="h-full transition-all duration-1000 ease-linear rounded-full"
             style={{ width: `${percentage}%`, background: color }} />
      </div>

      {/* Bonus time animation */}
      {showBonus && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold animate-bounce"
             style={{ color: 'var(--accent-blue)' }}>
          +10s!
        </div>
      )}
    </div>
  );
}