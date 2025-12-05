import React from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight } from 'lucide-react';

// Mock friends activity - in production, this would come from real data
const MOCK_ACTIVITY = [
  { name: 'Sarah', avatar: '👩', action: 'scored 95% on', game: 'Gen Z Fluency', emoji: '💀', time: '2m ago' },
  { name: 'Mike', avatar: '👨', action: 'beat your score on', game: 'Dad Jokes', emoji: '😂', time: '15m ago' },
  { name: 'Emma', avatar: '👧', action: 'is playing', game: 'Mental Age', emoji: '🎂', time: 'now' },
  { name: 'Jake', avatar: '🧑', action: 'unlocked', game: 'Meme Lord badge', emoji: '👑', time: '1h ago' },
];

export default function FriendsActivity({ friends = MOCK_ACTIVITY }) {
  if (!friends.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 shadow-lg border-2 border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-gray-800">Friends Activity</h3>
        </div>
        <button className="text-sm text-purple-500 font-medium flex items-center gap-1 hover:underline">
          See all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Activity list */}
      <div className="space-y-3">
        {friends.slice(0, 3).map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-xl">
              {activity.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">
                <span className="font-bold">{activity.name}</span>
                {' '}{activity.action}{' '}
                <span className="font-medium">{activity.game}</span>
                {' '}{activity.emoji}
              </p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>

            {/* Live indicator */}
            {activity.time === 'now' && (
              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-green-700">LIVE</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}