import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Lock, TrendingUp } from 'lucide-react';
import { getGameLevel } from '../constants/games';
import GameIcon from './GameIcon';

export default function GameCardNew({ 
  game, 
  progress, 
  onClick, 
  playersNow = 0,
  isNew = false,
  isLocked = false,
  isMastered = false,
  index = 0
}) {
  const level = getGameLevel(progress?.total_xp || 0);
  const hasPlayed = progress?.total_plays > 0;
  const highScore = progress?.highest_score || 0;
  
  // Progress calculation
  const xpForNextLevel = 500;
  const progressPercent = Math.min((progress?.total_xp || 0) / xpForNextLevel, 1) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={isLocked ? undefined : onClick}
      className={`
        relative bg-white rounded-3xl overflow-hidden cursor-pointer
        border border-gray-100 hover:border-gray-200
        shadow-sm hover:shadow-xl
        transition-shadow duration-300
        ${isLocked ? 'opacity-60' : ''}
      `}
    >
      {/* Players now badge */}
      {playersNow > 0 && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-gray-700">{playersNow}</span>
        </div>
      )}

      {/* New badge */}
      {isNew && !hasPlayed && (
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-violet-500 to-purple-500 px-2.5 py-1 rounded-full shadow-lg"
        >
          <Sparkles className="w-3 h-3 text-white" />
          <span className="text-xs font-bold text-white">NEW</span>
        </motion.div>
      )}

      {/* Mastered badge */}
      {isMastered && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 px-2.5 py-1 rounded-full shadow-lg"
        >
          <Crown className="w-3 h-3 text-amber-900" />
          <span className="text-xs font-bold text-amber-900">MASTER</span>
        </motion.div>
      )}

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-20 bg-gray-900/30 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <Lock className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Icon with progress ring */}
        <div className="relative w-14 h-14 mb-4">
          {/* Progress ring */}
          {hasPlayed && (
            <svg className="absolute -inset-1 w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="3"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke={game.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={188.5}
                initial={{ strokeDashoffset: 188.5 }}
                animate={{ strokeDashoffset: 188.5 - (progressPercent / 100) * 188.5 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </svg>
          )}
          
          {/* Icon */}
          <GameIcon gameId={game.id} size="md" />
        </div>
        
        {/* Title & Subtitle */}
        <h3 className="font-bold text-gray-900 mb-0.5 leading-tight tracking-tight">{game.title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">{game.subtitle}</p>
        
        {/* Bottom stats */}
        <div className="flex items-center justify-between">
          {hasPlayed ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg">{level.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-900">Level {level.level}</span>
                  <span className="text-[10px] text-gray-400">{progress.total_xp} XP</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 text-gray-500" />
                <span className="text-sm font-bold text-gray-700">{highScore}%</span>
              </div>
            </>
          ) : (
            <motion.div 
              whileHover={{ x: 4 }}
              className="text-sm font-medium text-gray-500 flex items-center gap-1"
            >
              Start playing 
              <span className="text-gray-400">→</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}