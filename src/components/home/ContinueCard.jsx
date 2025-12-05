import React from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight, TrendingUp } from 'lucide-react';
import { GAMES, getGameLevel } from '../constants/games';

export default function ContinueCard({ lastGame, progress, onPlay }) {
  if (!lastGame || !progress) return null;
  
  const game = GAMES[lastGame.game_id];
  if (!game) return null;
  
  const level = getGameLevel(progress.total_xp || 0);
  const lastPlayed = progress.last_played_date;
  const daysAgo = lastPlayed 
    ? Math.floor((Date.now() - new Date(lastPlayed).getTime()) / 86400000)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onPlay(game.id)}
      className="bg-white rounded-3xl p-5 shadow-lg border-2 border-gray-100 cursor-pointer hover:border-orange-200 hover:shadow-xl transition-all"
    >
      <div className="flex items-center gap-4">
        {/* Game Icon */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md flex-shrink-0"
          style={{ backgroundColor: game.color }}
        >
          {game.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-medium text-orange-500 uppercase tracking-wide">Continue Playing</span>
            {daysAgo === 0 && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Today</span>
            )}
          </div>
          <h3 className="font-bold text-gray-800 text-lg truncate">{game.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500">{level.emoji} Level {level.level}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">{progress.highest_score || 0}% best</span>
          </div>
        </div>

        {/* Play button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200"
        >
          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((progress.total_xp / 1000) * 100, 100)}%` }}
            className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <TrendingUp className="w-3 h-3" />
          <span>{progress.total_xp || 0} XP</span>
        </div>
      </div>
    </motion.div>
  );
}