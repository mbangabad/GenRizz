import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#4ade80', '#facc15', '#38bdf8', '#c084fc', '#fb923c', '#f472b6'];

export default function Confetti({ trigger, duration = 2000 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.3,
        rotation: Math.random() * 360,
        size: 6 + Math.random() * 8,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: `${p.x}vw`, 
              y: -20, 
              rotate: 0,
              opacity: 1 
            }}
            animate={{ 
              y: '110vh', 
              rotate: p.rotation + 720,
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2 + Math.random(), 
              delay: p.delay,
              ease: 'easeIn'
            }}
            className="absolute"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}