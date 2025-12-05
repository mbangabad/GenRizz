import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Friendship, Score } from '@/api/entities';

export default function FriendLeaderboard({ userId, gameId = null }) {
  const { data: friendships = [] } = useQuery({
    queryKey: ['friendships', userId],
    queryFn: () => Friendship.filter({ user_id: userId, status: 'accepted' }),
    enabled: !!userId,
  });

  const friendIds = friendships.map(f => f.friend_id);

  const { data: friendScores = [] } = useQuery({
    queryKey: ['friendScores', friendIds, gameId],
    queryFn: async () => {
      if (friendIds.length === 0) return [];
      
      let allScores = [];
      for (const friendId of friendIds) {
        const scores = gameId 
          ? await Score.filter({ user_id: friendId, game_id: gameId }).then(s => s.sort((a, b) => b.percentage - a.percentage).slice(0, 1))
          : await Score.filter({ user_id: friendId }).then(s => s.sort((a, b) => b.percentage - a.percentage).slice(0, 3));
        allScores.push(...scores);
      }
      return allScores;
    },
    enabled: friendIds.length > 0,
  });

  // Get current user's scores for comparison
  const { data: myScores = [] } = useQuery({
    queryKey: ['myScores', userId, gameId],
    queryFn: () => gameId 
      ? Score.filter({ user_id: userId, game_id: gameId }).then(s => s.sort((a, b) => b.percentage - a.percentage).slice(0, 1))
      : Score.filter({ user_id: userId }).then(s => s.sort((a, b) => b.percentage - a.percentage).slice(0, 3)),
    enabled: !!userId,
  });

  // Combine and rank
  const leaderboard = [...friendScores, ...myScores]
    .reduce((acc, score) => {
      const existing = acc.find(s => s.user_id === score.user_id);
      if (!existing || score.percentage > existing.percentage) {
        return [...acc.filter(s => s.user_id !== score.user_id), score];
      }
      return acc;
    }, [])
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);

  const myRank = leaderboard.findIndex(s => s.user_id === userId) + 1;

  if (friendships.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="font-bold text-gray-900 mb-1">No Friends Yet</h3>
        <p className="text-sm text-gray-500 mb-4">Add friends to compete on leaderboards!</p>
        <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium text-sm">
          Find Friends
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <h3 className="font-bold">Friend Leaderboard</h3>
          </div>
          {myRank > 0 && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
              You're #{myRank}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="divide-y divide-gray-100">
        {leaderboard.map((entry, index) => {
          const isMe = entry.user_id === userId;
          const friendship = friendships.find(f => f.friend_id === entry.user_id);
          
          return (
            <motion.div
              key={entry.user_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-4 ${isMe ? 'bg-purple-50' : ''}`}
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-amber-100 text-amber-700' :
                index === 1 ? 'bg-gray-200 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-500'
              }`}>
                {index === 0 ? <Crown className="w-4 h-4" /> : index + 1}
              </div>

              {/* Avatar & Name */}
              <div className="flex-1">
                <p className={`font-medium ${isMe ? 'text-purple-700' : 'text-gray-900'}`}>
                  {isMe ? 'You' : friendship?.friend_name || 'Friend'}
                </p>
                <p className="text-xs text-gray-400">{entry.tier_name || 'Player'}</p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="font-bold text-gray-900">{entry.percentage}%</p>
                <p className="text-xs text-gray-400">{entry.tier_emoji}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Your Position (if not in top 10) */}
      {myRank === 0 && myScores.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <p className="text-sm text-gray-500">
              Play more to appear on the leaderboard!
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}