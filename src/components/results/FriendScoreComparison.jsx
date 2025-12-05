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
        <Users className="w-8 h-8 mx-auto mb-2 text-[#AFAFAF]" />
        <p className="text-[#777777] font-semibold text-sm">No friends have played this game yet</p>
        <p className="text-[#AFAFAF] text-xs mt-1">Challenge them to beat your score!</p>
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
      <div className="p-4 border-b border-[#E5E0DA] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#CE82FF]" />
          <h3 className="font-bold text-[#3C3C3C]">Friend Comparison</h3>
        </div>
        <span className="badge-3d badge-purple text-xs">
          #{userRank} of {totalFriends + 1}
        </span>
      </div>

      {/* Summary */}
      <div className="p-4 bg-gradient-to-r from-[#CE82FF]/10 to-[#A855F7]/10">
        <div className="flex items-center justify-center gap-2">
          {beatsCount > 0 ? (
            <>
              <TrendingUp className="w-5 h-5 text-[#58CC02]" />
              <span className="font-bold text-[#3C3C3C]">
                You beat {beatsCount} friend{beatsCount > 1 ? 's' : ''}!
              </span>
            </>
          ) : userRank === 1 ? (
            <>
              <Trophy className="w-5 h-5 text-[#FFC800]" />
              <span className="font-bold text-[#3C3C3C]">You're #1 among friends!</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-5 h-5 text-[#FF4B4B]" />
              <span className="font-bold text-[#3C3C3C]">
                {userRank - 1} friend{userRank > 2 ? 's' : ''} beat you
              </span>
            </>
          )}
        </div>
      </div>

      {/* Friend List */}
      <div className="divide-y divide-[#E5E0DA] max-h-48 overflow-y-auto">
        {friendScores.slice(0, 5).map((score, i) => {
          const isAhead = score.percentage > userScore;
          const isBehind = score.percentage < userScore;
          
          return (
            <div 
              key={score.user_id}
              className={`flex items-center gap-3 p-3 ${
                isAhead ? 'bg-[#FF4B4B]/5' : isBehind ? 'bg-[#58CC02]/5' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                i === 0 ? 'bg-[#FFC800] text-white' : 
                i === 1 ? 'bg-[#C0C0C0] text-white' :
                i === 2 ? 'bg-[#CD7F32] text-white' :
                'bg-[#E8E4DF] text-[#777777]'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#3C3C3C] text-sm truncate">
                  {score.user_name || 'Friend'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#3C3C3C]">{score.percentage}%</span>
                {isAhead && <TrendingUp className="w-4 h-4 text-[#FF4B4B]" />}
                {isBehind && <TrendingDown className="w-4 h-4 text-[#58CC02]" />}
                {!isAhead && !isBehind && <Minus className="w-4 h-4 text-[#AFAFAF]" />}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}