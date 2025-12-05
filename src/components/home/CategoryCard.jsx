import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getGameLevel } from '../constants/games';
import GameIcon from './GameIcon';

export default function CategoryCard({ category, games, progressMap, onGameClick, index }) {
  const gamesPlayed = games.filter(g => progressMap[g.id]?.total_plays > 0).length;
  const avgScore = games.reduce((sum, g) => sum + (progressMap[g.id]?.highest_score || 0), 0) / (gamesPlayed || 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-3d overflow-hidden"
    >
      {/* Category Header */}
      <div 
        className="p-5 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${category.color}15, ${category.color}05)` 
        }}
      >
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-10"
          style={{ background: category.color }} 
        />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="game-icon-3d game-icon-lg"
              style={{ 
                background: `linear-gradient(135deg, ${category.color}, ${category.color}CC)`,
              }}
            >
              {category.emoji}
            </motion.div>
            <div>
              <h3 className="font-black text-[#3C3C3C] text-xl">{category.name}</h3>
              <p className="text-sm text-[#777777] font-semibold">{games.length} games</p>
            </div>
          </div>
          
          {gamesPlayed > 0 && (
            <div className="text-right">
              <p className="text-2xl font-black" style={{ color: category.color }}>{Math.round(avgScore)}%</p>
              <p className="text-xs text-[#AFAFAF] font-semibold">avg score</p>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 progress-bar-3d">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(gamesPlayed / games.length) * 100}%` }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-full rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${category.color}, ${category.color}CC)`,
            }}
          />
        </div>
        <p className="text-xs text-[#AFAFAF] mt-2 font-semibold">
          {gamesPlayed}/{games.length} completed
        </p>
      </div>

      {/* Games List */}
      <div className="p-3 space-y-2">
        {games.map((game) => {
          const progress = progressMap[game.id];
          const level = getGameLevel(progress?.total_xp || 0);
          const hasPlayed = progress?.total_plays > 0;
          
          return (
            <motion.button
              key={game.id}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onGameClick(game.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#F7F4F0] hover:bg-[#F0EDE8] border border-[#E5E0DA] hover:border-[#D4CFC7] transition-all text-left cursor-pointer"
            >
              <GameIcon gameId={game.id} size="sm" />
              
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#3C3C3C] truncate">{game.title}</p>
                <p className="text-xs text-[#777777] truncate font-semibold">
                  {hasPlayed 
                    ? `Lvl ${level.level} · ${progress.highest_score}% best` 
                    : game.subtitle
                  }
                </p>
              </div>
              
              {hasPlayed ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{level.emoji}</span>
                  <ChevronRight className="w-4 h-4 text-[#AFAFAF]" />
                </div>
              ) : (
                <span className="badge-3d badge-green text-xs py-1 px-2">
                  NEW
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}