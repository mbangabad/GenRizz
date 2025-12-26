import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingXP({ show, amount, x = '50%', y = '50%' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -60, scale: 1 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed z-50 pointer-events-none font-black text-2xl"
          style={{ 
            left: x, 
            top: y,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-pink))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(192, 132, 252, 0.5)'
          }}
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}