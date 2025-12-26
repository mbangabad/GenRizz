import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Friendship, Score } from '@/api/entities';
import { motion } from 'framer-motion';
import { Users, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GAMES } from '@/components/constants/games';

export default function FriendScoreComparison({ gameId, userScore, userId }) {
  const game = GAMES[gameId];

  // Fetch friends
  const { data: friendships = [] } = useQuery({
    queryKey: ['friendships', userId],
    queryFn: () => Friendship.filter({ user_id: userId, status: 'accepted' }),
    enabled: !!userId,
  });

  const friendIds = friendships.map(f => f.friend_id);

  // Fetch friend scores for this game
  const { data: friendScores = [] } = useQuery({
    queryKey: ['friendScores', gameId, friendIds],
    queryFn: async () => {
      if (friendIds.length === 0) return [];
      const allScores = await Score.filter({ game_id: gameId });
      // Get best score per friend
      const friendBest = {};
      allScores.forEach(s => {
        if (friendIds.includes(s.user_id)) {
          if (!friendBest[s.user_id] || s.percentage > friendBest[s.user_id].percentage) {
            friendBest[s.user_id] = s;
          }
        }
      });
      return Object.values(friendBest).sort((a, b) => b.percentage - a.percentage);
    },
    enabled: friendIds.length > 0,
  });

  if (friendScores.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-3d p-4 text-center"
      >
        <Users className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
        <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>No friends have played this game yet</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Challenge them to beat your score!</p>
      </motion.div>
    );
  }

  // Calculate user's rank among friends
  const userRank = friendScores.filter(s => s.percentage > userScore).length + 1;
  const totalFriends = friendScores.length;
  const beatsCount = friendScores.filter(s => s.percentage < userScore).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-3d overflow-hidden"
    >
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: 'var(--brand-purple)' }} />
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Friend Comparison</h3>
        </div>
        <span className="badge-3d badge-purple text-xs">
          #{userRank} of {totalFriends + 1}
        </span>
      </div>

      {/* Summary */}
      <div className="p-4" style={{ background: 'linear-gradient(to right, rgba(206, 130, 255, 0.1), rgba(168, 85, 247, 0.1))' }}>
        <div className="flex items-center justify-center gap-2">
          {beatsCount > 0 ? (
            <>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--brand-green)' }} />
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                You beat {beatsCount} friend{beatsCount > 1 ? 's' : ''}!
              </span>
            </>
          ) : userRank === 1 ? (
            <>
              <Trophy className="w-5 h-5" style={{ color: 'var(--brand-yellow)' }} />
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>You're #1 among friends!</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-5 h-5" style={{ color: 'var(--brand-red)' }} />
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                {userRank - 1} friend{userRank > 2 ? 's' : ''} beat you
              </span>
            </>
          )}
        </div>
      </div>

      {/* Friend List */}
      <div className="max-h-48 overflow-y-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {friendScores.slice(0, 5).map((score, i) => {
          const isAhead = score.percentage > userScore;
          const isBehind = score.percentage < userScore;
          
          return (
            <div 
              key={score.user_id}
              className="flex items-center gap-3 p-3"
              style={{
                backgroundColor: isAhead ? 'rgba(255, 75, 75, 0.05)' : 
                               isBehind ? 'rgba(88, 204, 2, 0.05)' : 
                               'transparent',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: i === 0 ? 'var(--brand-yellow)' : 
                                 i === 1 ? '#C0C0C0' :
                                 i === 2 ? '#CD7F32' :
                                 'var(--surface-3)',
                  color: i === 0 ? 'var(--text-primary)' : 
                         i === 1 ? 'var(--text-inverse)' :
                         i === 2 ? 'var(--text-inverse)' :
                         'var(--text-secondary)'
                }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                  {score.user_name || 'Friend'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black" style={{ color: 'var(--text-primary)' }}>{score.percentage}%</span>
                {isAhead && <TrendingUp className="w-4 h-4" style={{ color: 'var(--brand-red)' }} />}
                {isBehind && <TrendingDown className="w-4 h-4" style={{ color: 'var(--brand-green)' }} />}
                {!isAhead && !isBehind && <Minus className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}