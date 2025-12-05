import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Friendship, Score } from '@/api/entities';
import { motion } from 'framer-motion';
import { Trophy, Zap, Award, Users, Clock } from 'lucide-react';
import moment from 'moment';
import { GAMES } from '@/components/constants/games';
import GameIcon from '@/components/home/GameIcon';

const ACTIVITY_TYPES = {
  score: { icon: Trophy, color: '#58CC02', verb: 'scored' },
  level_up: { icon: Zap, color: '#FFC800', verb: 'leveled up to' },
  achievement: { icon: Award, color: '#CE82FF', verb: 'earned' },
  friend: { icon: Users, color: '#1CB0F6', verb: 'became friends with' },
};

export default function ActivityFeed({ userId }) {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activityFeed', userId],
    queryFn: async () => {
      // Get recent scores from friends
      const friendships = await Friendship.filter({ 
        user_id: userId,
        status: 'accepted' 
      });
      
      const friendIds = friendships.map(f => f.friend_id);
      if (friendIds.length === 0) return [];

      const recentScores = await Score.list('created_at', 20, false);
      
      // Filter to friend activities and format
      return recentScores
        .filter(s => friendIds.includes(s.user_id))
        .slice(0, 10)
        .map(s => ({
          id: s.id,
          type: 'score',
          user_name: friendships.find(f => f.friend_id === s.user_id)?.friend_name || 'Friend',
          game_id: s.game_id,
          percentage: s.percentage,
          tier_emoji: s.tier_emoji,
          created_date: s.created_at,
        }));
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="card-3d p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-3 border-[#E5E0DA] border-t-[#58CC02] rounded-full mx-auto"
        />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="card-3d p-8 text-center">
        <Users className="w-12 h-12 text-[#AFAFAF] mx-auto mb-3" />
        <p className="font-bold text-[#3C3C3C]">No recent activity</p>
        <p className="text-sm text-[#777777]">Add friends to see their activity here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-black text-lg text-[#3C3C3C] flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#777777]" />
        Friend Activity
      </h3>

      <div className="space-y-2">
        {activities.map((activity, i) => {
          const config = ACTIVITY_TYPES[activity.type];
          const Icon = config.icon;
          const game = GAMES[activity.game_id];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-3d p-4"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#3C3C3C]">
                    <span className="font-bold">{activity.user_name}</span>
                    {' '}{config.verb}{' '}
                    <span className="font-bold">{activity.percentage}%</span>
                    {' '}on{' '}
                    <span className="font-bold">{game?.title || activity.game_id}</span>
                    {activity.tier_emoji && ` ${activity.tier_emoji}`}
                  </p>
                  <p className="text-xs text-[#AFAFAF]">
                    {moment(activity.created_date).fromNow()}
                  </p>
                </div>

                {game && (
                  <GameIcon gameId={activity.game_id} size="xs" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}