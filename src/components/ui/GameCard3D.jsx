import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Star, TrendingUp } from 'lucide-react';

export default function GameCard3D({ 
  game, 
  progress, 
  level, 
  onClick, 
  isLocked = false,
  isNew = false,
  hasPersonalBest = false,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onClick={!isLocked ? onClick : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative h-52 rounded-2xl overflow-hidden cursor-pointer ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
      whileHover={!isLocked ? { scale: 1.03, y: -5 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0"
        animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <img 
          src={game.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"} 
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
      </motion.div>

      {/* Glow Effect on Hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${game.color}30 0%, transparent 70%)`,
        }}
      />

      {/* Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `inset 0 0 0 2px ${game.color}60, 0 0 30px ${game.color}40`,
        }}
      />

      {/* Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        {isNew && (
          <motion.span 
            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-500 text-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            NEW
          </motion.span>
        )}
        {hasPersonalBest && (
          <motion.div
            className="ml-auto"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
          </motion.div>
        )}
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-[#0A0A0A]/60 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <Lock className="w-8 h-8 text-white/40 mx-auto mb-2" />
            <p className="text-xs text-white/40">Unlock at Level 5</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <motion.div 
          className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center text-2xl shadow-lg"
          style={{ background: game.color }}
          animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {game.icon}
        </motion.div>
        
        <h3 className="font-bold text-white mb-1 group-hover:text-white transition-colors">
          {game.title}
        </h3>
        
        {progress ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${game.color}, ${game.color}80)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((progress.total_xp % 100), 100)}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <span className="text-[10px] font-bold text-white/60">Lvl {level?.level || 1}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/40">
              <TrendingUp className="w-3 h-3" />
              <span>Best: {progress.highest_score || 0}%</span>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-white/40 line-clamp-1">{game.subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}