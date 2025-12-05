import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text, fullScreen = false }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinner = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3"
    >
      <motion.div
        className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center shadow-lg`}
        style={{ boxShadow: '0 4px 0 #3D8C02' }}
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="text-xl">⚡</span>
      </motion.div>
      <Loader2 className={`${sizeClasses[size]} text-[#58CC02] animate-spin`} />
      {text && (
        <p className="text-sm font-semibold text-[#777777]">{text}</p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

