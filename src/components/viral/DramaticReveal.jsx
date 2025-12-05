import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES, getTier } from '@/components/constants/games';

// Dramatic countdown before showing results
export default function DramaticReveal({ 
  gameId, 
  score, 
  total, 
  onComplete 
}) {
  const [phase, setPhase] = useState('counting'); // counting, reveal, done
  const [displayNumber, setDisplayNumber] = useState(0);
  const game = GAMES[gameId];
  const percentage = Math.round((score / total) * 100);
  const tier = getTier(gameId, percentage);

  useEffect(() => {
    // Animate counting up
    const duration = 1500;
    const steps = 30;
    const increment = percentage / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setDisplayNumber(percentage);
        clearInterval(timer);
        setTimeout(() => setPhase('reveal'), 300);
      } else {
        setDisplayNumber(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [percentage]);

  useEffect(() => {
    if (phase === 'reveal') {
      const timer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {phase === 'counting' && (
          <motion.div
            key="counting"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-center"
          >
            {/* Pulsing background */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 50%)',
                  'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 60%)',
                  'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            
            <div className="relative">
              <motion.div
                className="text-8xl font-black"
                style={{ color: game?.color }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                {displayNumber}%
              </motion.div>
              <p className="text-slate-400 mt-2">Calculating...</p>
            </div>
          </motion.div>
        )}

        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.3, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="text-center"
          >
            {/* Explosion effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full"
                  style={{ 
                    background: game?.color,
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos(i * 30 * Math.PI / 180) * 150,
                    y: Math.sin(i * 30 * Math.PI / 180) * 150,
                    opacity: [1, 1, 0]
                  }}
                  transition={{ duration: 0.8 }}
                />
              ))}
            </motion.div>

            {/* Main reveal */}
            <motion.div
              className="text-9xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5 }}
            >
              {tier.emoji}
            </motion.div>
            
            <motion.h1
              className="text-4xl font-black mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {tier.name}
            </motion.h1>
            
            <motion.div
              className="text-6xl font-black"
              style={{ color: game?.color }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {percentage}%
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mini reveal for inline use
export function MiniReveal({ percentage, emoji, color, onComplete }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
      onComplete?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="flex items-center justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        className="text-5xl"
        animate={revealed ? { scale: [0, 1.2, 1] } : {}}
        transition={{ type: 'spring', bounce: 0.5 }}
      >
        {emoji}
      </motion.span>
      <motion.span
        className="text-4xl font-black"
        style={{ color }}
        animate={revealed ? { 
          opacity: [0, 1],
          x: [-20, 0]
        } : { opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        {percentage}%
      </motion.span>
    </motion.div>
  );
}