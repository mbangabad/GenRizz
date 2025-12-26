import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getGameLevel } from '../constants/games';
import GameIcon from './GameIcon';
import { createPageUrl } from '@/utils';
import { emitEvent } from '@/services/telemetry';

export default function CategoryCard({ category, games, progressMap, onGameClick, index }) {
  const navigate = useNavigate();
  const gamesPlayed = games.filter(g => progressMap[g.id]?.total_plays > 0).length;
  const avgScore = games.reduce((sum, g) => sum + (progressMap[g.id]?.highest_score || 0), 0) / (gamesPlayed || 1);
  const goToGame = (gameId) => {
    const url = createPageUrl('Gameplay') + '?gameId=' + gameId;
    emitEvent('cta_click', { cta: 'category_play', gameId, category: category.id });
    try {
      navigate(url);
    } catch {
      window.location.href = url; // hard fallback
    }
    if (onGameClick) onGameClick(gameId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-3d overflow-hidden card-3d-interactive"
      role="region"
      aria-label={`${category.name} games`}
      tabIndex={0}
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
              <h3 className="font-black text-[var(--text-primary)] text-xl">{category.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] font-semibold">{games.length} games</p>
            </div>
          </div>
          
          {gamesPlayed > 0 && (
            <div className="text-right">
              <p className="text-2xl font-black" style={{ color: category.color }}>{Math.round(avgScore)}%</p>
              <p className="text-xs text-[var(--text-muted)] font-semibold">avg score</p>
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
        <p className="text-xs text-[var(--text-muted)] mt-2 font-semibold">
          {gamesPlayed}/{games.length} completed
        </p>
      </div>

      {/* Games List */}
      <div className="p-3 space-y-2">
        {games.map((game) => {
          const progress = progressMap[game.id];
          const level = getGameLevel(progress?.total_xp || 0);
          const hasPlayed = progress?.total_plays > 0;
          const gameUrl = createPageUrl('Gameplay') + '?gameId=' + game.id;
          
          return (
            <motion.a
              key={game.id}
              href={gameUrl}
              onClick={(e) => {
                e.preventDefault();
                goToGame(game.id);
              }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-1)] hover:bg-[var(--surface-2)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all text-left cursor-pointer group no-underline outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
              aria-label={`Play ${game.title}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              role="button"
            >
              <GameIcon gameId={game.id} size="sm" />
              
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--brand-green)] transition-colors">{game.title}</p>
                <p className="text-xs text-[var(--text-secondary)] truncate font-semibold">
                  {hasPlayed 
                    ? `Lvl ${level.level} · ${progress.highest_score}% best` 
                    : game.subtitle
                  }
                </p>
              </div>
              
              {hasPlayed ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{level.emoji}</span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-green)] transition-colors" />
                </div>
              ) : (
                <span className="badge-3d badge-green text-xs py-1 px-2">
                  NEW
                </span>
              )}
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}
