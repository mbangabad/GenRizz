import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Share2, Copy, Link as LinkIcon, Check, Trophy, TrendingUp, ArrowRight } from 'lucide-react';

import { Input } from '@/components/ui/input';
// Temporarily disabled to fix React hooks error
// import { toast } from 'sonner';
const toast = { error: () => {}, success: () => {}, info: () => {} };
import { GAMES } from '@/components/constants/games';

export default function CompareWithFriends({ 
  gameId, 
  userScore, 
  userName,
  onClose 
}) {
  const [copied, setCopied] = useState(false);
  const game = GAMES[gameId];
  
  // Generate unique challenge link
  const BASE_URL = import.meta.env.VITE_APP_URL || window.location.origin;
  const challengeLink = `${BASE_URL}/#/Challenge?game=${gameId}&score=${userScore}&name=${encodeURIComponent(userName || 'Someone')}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(challengeLink);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    const text = `Can you beat my ${userScore}% on ${game.title}? 🔥\n\n${challengeLink}`;
    if (navigator.share) {
      await navigator.share({ 
        title: `Beat my score on ${game.title}!`,
        text,
        url: challengeLink
      }).catch(() => {});
    } else {
      copyLink();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-3d card-3d-purple p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(206, 130, 255, 0.2)' }}>
          <Users className="w-5 h-5" style={{ color: 'var(--brand-purple)' }} />
        </div>
        <div>
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Compare With Friends</h3>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>See who knows more!</p>
        </div>
      </div>

      {/* Score display */}
      <div className="rounded-xl p-4 mb-4 text-center" style={{ backgroundColor: 'var(--surface-1)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Your Score</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">{game?.icon}</span>
          <span className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>{userScore}%</span>
        </div>
        <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>{game?.title}</p>
      </div>

      {/* Challenge link */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Input 
            value={challengeLink}
            readOnly
            className="bg-white border-2 text-xs pr-10 truncate rounded-xl" style={{ borderColor: 'var(--border-subtle)' }}
          />
          <button
            onClick={copyLink}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {copied ? (
              <Check className="w-4 h-4" style={{ color: 'var(--brand-green)' }} />
            ) : (
              <Copy className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <button
        onClick={shareNative}
        className="w-full btn-3d btn-3d-pink py-3 flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Challenge Friends
      </button>

      <p className="text-center text-xs font-semibold mt-3" style={{ color: 'var(--text-muted)' }}>
        Friends will play the same game and compare scores!
      </p>
    </motion.div>
  );
}

// Leaderboard comparison component
export function FriendLeaderboard({ scores = [], currentUserId }) {
  const sortedScores = [...scores].sort((a, b) => b.percentage - a.percentage);
  
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5" style={{ color: 'var(--brand-yellow)' }} />
        <h3 className="font-bold">Friend Scores</h3>
      </div>

      <div className="space-y-2">
        {sortedScores.map((score, i) => (
          <motion.div
            key={score.user_id || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg`}
            style={{
              backgroundColor: score.user_id === currentUserId 
                ? 'rgba(168, 85, 247, 0.2)' 
                : 'rgba(15, 23, 42, 0.5)',
              border: score.user_id === currentUserId 
                ? '1px solid rgba(168, 85, 247, 0.3)' 
                : 'none'
            }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: i === 0 ? 'var(--brand-yellow)' :
                               i === 1 ? '#94a3b8' :
                               i === 2 ? 'var(--brand-orange)' :
                               '#374151',
                color: i === 0 ? 'var(--text-primary)' :
                       i === 1 ? 'var(--text-primary)' :
                       i === 2 ? 'var(--text-inverse)' :
                       '#9ca3af'
              }}>
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm truncate">{score.user_name || 'Anonymous'}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">{score.percentage}%</p>
            </div>
          </motion.div>
        ))}

        {sortedScores.length === 0 && (
          <p className="text-center text-slate-500 py-4 text-sm">
            No friends have played yet. Share the challenge!
          </p>
        )}
      </div>
    </div>
  );
}