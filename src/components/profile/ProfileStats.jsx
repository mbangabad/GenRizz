import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Star, Trophy, TrendingUp, Calendar } from 'lucide-react';

export default function ProfileStats({ stats }) {
  const statItems = [
    { value: stats.streak || 0, label: 'Day Streak', icon: Flame, color: '#FF9600' },
    { value: stats.totalPlays || 0, label: 'Games Played', icon: Target, color: '#1CB0F6' },
    { value: `${stats.avgScore || 0}%`, label: 'Avg Score', icon: Star, color: '#FFC800' },
    { value: stats.gamesUnlocked || 0, label: 'Games Tried', icon: Trophy, color: '#CE82FF' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statItems.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card-3d p-4 text-center"
        >
          <div 
            className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${stat.color}20` }}
          >
            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
          </div>
          <p className="text-2xl font-black text-[#3C3C3C]">{stat.value}</p>
          <p className="text-xs text-[#AFAFAF] font-semibold">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}