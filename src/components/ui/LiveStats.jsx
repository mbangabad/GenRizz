import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Gamepad2, Zap } from 'lucide-react';

export default function LiveStats() {
  const [stats, setStats] = useState({
    playersOnline: Math.floor(Math.random() * 500) + 200,
    gamesToday: Math.floor(Math.random() * 5000) + 2000,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        playersOnline: Math.max(100, prev.playersOnline + Math.floor(Math.random() * 20) - 10),
        gamesToday: prev.gamesToday + Math.floor(Math.random() * 5),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 text-xs">
      <motion.div 
        className="flex items-center gap-1.5 text-green-400"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <Users className="w-3.5 h-3.5" />
        <span className="font-bold">{stats.playersOnline.toLocaleString()}</span>
        <span className="text-slate-500">online</span>
      </motion.div>
      
      <div className="flex items-center gap-1.5 text-purple-400">
        <Gamepad2 className="w-3.5 h-3.5" />
        <span className="font-bold">{stats.gamesToday.toLocaleString()}</span>
        <span className="text-slate-500">games today</span>
      </div>
    </div>
  );
}