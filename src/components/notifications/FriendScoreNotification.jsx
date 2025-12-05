import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Flame, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Friendship, Score } from '@/api/entities';
import { GAMES } from '../constants/games';

export default function FriendScoreNotification({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  // Fetch friend activity
  const { data: friendships = [] } = useQuery({
    queryKey: ['friendships', userId],
    queryFn: () => Friendship.filter({ user_id: userId, status: 'accepted' }),
    enabled: !!userId,
  });

  const friendIds = friendships.map(f => f.friend_id);

  const { data: recentFriendScores = [] } = useQuery({
    queryKey: ['recentFriendScores', friendIds],
    queryFn: async () => {
      if (friendIds.length === 0) return [];
      
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      let allScores = [];
      
      for (const friendId of friendIds.slice(0, 5)) { // Limit to 5 friends
        const scores = await Score.filter({ user_id: friendId });
        const recentScores = scores
          .filter(s => new Date(s.created_at) > new Date(oneHourAgo))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        allScores.push(...recentScores);
      }
      
      return allScores.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    enabled: friendIds.length > 0,
    refetchInterval: 60000, // Refetch every minute
  });

  useEffect(() => {
    // Create notifications for high scores
    const newNotifications = recentFriendScores
      .filter(score => score.percentage >= 80 && !dismissed.has(score.id))
      .slice(0, 3)
      .map(score => {
        const friend = friendships.find(f => f.friend_id === score.user_id);
        const game = GAMES[score.game_id];
        return {
          id: score.id,
          friendName: friend?.friend_name || 'A friend',
          percentage: score.percentage,
          gameTitle: game?.title || 'a quiz',
          gameIcon: game?.icon || '🎮',
          tier: score.tier_name,
        };
      });

    setNotifications(newNotifications);
  }, [recentFriendScores, friendships, dismissed]);

  const dismissNotification = (id) => {
    setDismissed(prev => new Set([...prev, id]));
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg">
              {notif.gameIcon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-gray-900 text-sm truncate">
                  {notif.friendName}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">
                scored <span className="font-bold text-amber-600">{notif.percentage}%</span> on {notif.gameTitle}!
              </p>
              {notif.tier && (
                <p className="text-xs text-gray-400 mt-1">
                  Achieved: {notif.tier}
                </p>
              )}
            </div>

            <button
              onClick={() => dismissNotification(notif.id)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}