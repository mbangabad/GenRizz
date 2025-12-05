import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Flame } from 'lucide-react';

export default function TrendingSection({ games, onGameClick }) {
  if (!games.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-bold text-gray-800">Trending Now</h2>
        <Flame className="w-4 h-4 text-orange-500" />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:-mx-8 md:px-8 scrollbar-hide">
        {games.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onGameClick(game.id)}
            className="flex-shrink-0 w-36 md:w-44 bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100 cursor-pointer hover:border-orange-200 transition-all"
          >
            {/* Rank */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-black text-gray-200">#{i + 1}</span>
              <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-green-700">{Math.floor(Math.random() * 200 + 50)}</span>
              </div>
            </div>

            {/* Icon */}
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md mb-2"
              style={{ backgroundColor: game.color }}
            >
              {game.icon}
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{game.title}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}