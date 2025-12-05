import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, Clock } from 'lucide-react';
import { getCurrentEvent } from '../constants/games';

export default function SeasonalBanner({ onClose }) {
  const event = getCurrentEvent();
  
  if (!event) return null;

  const endDate = new Date(event.endDate);
  const now = new Date();
  const hoursLeft = Math.max(0, Math.floor((endDate - now) / (1000 * 60 * 60)));

  const eventColors = {
    'black-friday': 'from-gray-900 to-gray-800',
    'christmas': 'from-red-600 to-green-600',
    'new-years': 'from-purple-600 to-pink-600',
    'valentines': 'from-pink-500 to-red-500',
    'april-fools': 'from-yellow-400 to-orange-500',
    'summer': 'from-cyan-400 to-blue-500',
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${eventColors[event.id] || 'from-purple-600 to-pink-600'} p-4 text-white mb-6`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '100%',
              opacity: 0 
            }}
            animate={{ 
              y: '-100%',
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            {event.emoji}
          </motion.div>
          <div>
            <h3 className="font-black text-lg">{event.name}</h3>
            <p className="text-sm text-white/80">
              {event.multiplier}x XP on all games!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-bold">{hoursLeft}h left</span>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}