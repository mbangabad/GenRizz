import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES, getGameLevel, getTier } from '../constants/games';
import GameIcon from '../home/GameIcon';

export default function GameHistory({ progress, scores }) {
  // Sort by recent activity
  const sortedProgress = [...progress]
    .filter(p => GAMES[p.game_id])
    .sort((a, b) => new Date(b.last_played_date || 0) - new Date(a.last_played_date || 0))
    .slice(0, 5);

  if (sortedProgress.length === 0) {
    return (
      <div className="card-3d p-6 text-center">
        <p className="text-[#777777] font-semibold mb-3">No games played yet!</p>
        <Link to={createPageUrl('Home')} className="btn-3d btn-3d-green px-6 py-3 inline-block text-sm">
          Start Playing
        </Link>
      </div>
    );
  }

  // Calculate trend for each game
  const getTrend = (gameId) => {
    const gameScores = scores
      .filter(s => s.game_id === gameId)
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 3);
    
    if (gameScores.length < 2) return 'neutral';
    const recent = gameScores[0].percentage;
    const older = gameScores[gameScores.length - 1].percentage;
    if (recent > older + 5) return 'up';
    if (recent < older - 5) return 'down';
    return 'neutral';
  };

  return (
    <div className="card-3d overflow-hidden">
      <div className="p-4 border-b border-[#E5E0DA]">
        <h3 className="font-black text-[#3C3C3C]">Recent Games</h3>
      </div>
      <div className="divide-y divide-[#E5E0DA]">
        {sortedProgress.map((p, i) => {
          const game = GAMES[p.game_id];
          const level = getGameLevel(p.total_xp || 0);
          const tier = getTier(p.game_id, p.highest_score || 0);
          const trend = getTrend(p.game_id);

          return (
            <motion.div
              key={p.game_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                to={createPageUrl('Gameplay') + '?gameId=' + p.game_id}
                className="flex items-center gap-3 p-4 hover:bg-[#F7F4F0] transition-colors"
              >
                <GameIcon gameId={p.game_id} size="sm" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#3C3C3C] truncate">{game.title}</p>
                    <span className="badge-3d badge-level text-xs py-0.5 px-2">
                      {level.emoji} {level.level}
                    </span>
                  </div>
                  <p className="text-xs text-[#AFAFAF] font-semibold">
                    {tier.emoji} {tier.name} · {p.total_plays || 0} plays
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-black text-[#3C3C3C]">{p.highest_score || 0}%</p>
                    <p className="text-xs text-[#AFAFAF]">Best</p>
                  </div>
                  {trend === 'up' && <TrendingUp className="w-4 h-4 text-[#58CC02]" />}
                  {trend === 'down' && <TrendingDown className="w-4 h-4 text-[#FF4B4B]" />}
                  {trend === 'neutral' && <Minus className="w-4 h-4 text-[#AFAFAF]" />}
                  <ChevronRight className="w-4 h-4 text-[#AFAFAF]" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}