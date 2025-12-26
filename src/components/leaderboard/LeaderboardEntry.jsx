import React from 'react';
import { Swords, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES, getGameLevel } from '../constants/games';
import { motion } from 'framer-motion';

export default function LeaderboardEntry({ score, rank, isMe, showGame = true, showChallenge = false, gameId }) {
  const game = GAMES[score.game_id];
  const level = getGameLevel(score.user_level_xp || 0);
  const isPremium = score.is_premium;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(rank * 0.03, 0.3) }}
      className={`card-3d p-4 ${isMe ? 'ring-2 ring-[var(--brand-purple)] card-3d-purple' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
          rank === 1 ? 'bg-gradient-to-br from-[var(--brand-yellow)] to-[#FFB347] text-white' :
          rank === 2 ? 'bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0] text-white' :
          rank === 3 ? 'bg-gradient-to-br from-[#CD7F32] to-[#B87333] text-white' :
          'bg-[var(--surface-3)] text-[var(--text-secondary)]'
        }`} style={rank <= 3 ? { boxShadow: '0 3px 0 rgba(0,0,0,0.2)' } : {}}>
          {rank}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-[var(--text-primary)] truncate">
              {isMe ? 'You' : (score.user_name || `Player ${score.user_id?.slice(-4)}`)}
            </p>
            {isPremium && (
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[var(--brand-yellow)] to-[#FFB347] flex items-center justify-center flex-shrink-0"
                   style={{ boxShadow: '0 2px 0 var(--brand-yellow-dark)' }}>
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
            {level && (
              <span className="badge-3d badge-level text-xs py-0.5">
                {level.emoji}
              </span>
            )}
          </div>
          {showGame && game && (
            <p className="text-xs text-[var(--text-secondary)] font-semibold">{game.icon} {game.title}</p>
          )}
          {score.tier_name && (
            <p className="text-xs text-[var(--text-muted)] font-semibold">{score.tier_emoji} {score.tier_name}</p>
          )}
        </div>

        {/* Score & Actions */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xl font-black text-[var(--text-primary)]">{score.percentage}%</p>
            <p className="text-xs text-[var(--text-muted)] font-semibold">{score.score}/{score.max_score}</p>
          </div>
          
          {showChallenge && !isMe && (
            <Link 
              to={createPageUrl(`Challenges?challengedId=${score.user_id}&gameId=${gameId || score.game_id}`)}
              className="p-2.5 rounded-xl bg-[var(--brand-orange)]/20 text-[var(--brand-orange)] hover:bg-[var(--brand-orange)]/30 transition-colors"
              title="Challenge"
            >
              <Swords className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}