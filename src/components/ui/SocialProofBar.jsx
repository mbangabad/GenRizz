import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Gamepad2, Flame, Trophy, TrendingUp } from 'lucide-react';

const ACTIVITY_FEED = [
  { type: 'score', name: 'Sarah', action: 'scored 95% on Gen Z Fluency', emoji: '💀' },
  { type: 'level', name: 'Marcus', action: 'reached Level 10!', emoji: '🔥' },
  { type: 'challenge', name: 'Emma', action: 'beat Jake in a challenge', emoji: '⚔️' },
  { type: 'streak', name: 'Alex', action: 'hit a 30-day streak!', emoji: '🔥' },
  { type: 'score', name: 'Jordan', action: 'got iPad Baby 📱', emoji: '📱' },
  { type: 'achievement', name: 'Taylor', action: 'unlocked Meme Lord!', emoji: '👑' },
];

export default function SocialProofBar({ compact = false }) {
  const [playersOnline, setPlayersOnline] = useState(3847);
  const [currentActivity, setCurrentActivity] = useState(0);

  useEffect(() => {
    // Simulate live player count
    const playerInterval = setInterval(() => {
      setPlayersOnline(prev => prev + Math.floor(Math.random() * 20) - 8);
    }, 5000);

    // Rotate activity feed
    const activityInterval = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % ACTIVITY_FEED.length);
    }, 3000);

    return () => {
      clearInterval(playerInterval);
      clearInterval(activityInterval);
    };
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 font-bold">{playersOnline.toLocaleString()}</span>
          <span className="text-slate-500">online</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-3">
      <div className="flex items-center justify-between">
        {/* Players Online */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-green-400 font-bold">{playersOnline.toLocaleString()}</span>
            <span className="text-slate-500 text-sm">playing now</span>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="flex-1 mx-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActivity}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 justify-center text-sm"
            >
              <span className="text-slate-500">{ACTIVITY_FEED[currentActivity].emoji}</span>
              <span className="text-white font-medium">{ACTIVITY_FEED[currentActivity].name}</span>
              <span className="text-slate-400">{ACTIVITY_FEED[currentActivity].action}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Join Count */}
        <div className="flex items-center gap-1.5 text-sm">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 font-bold">127K+</span>
          <span className="text-slate-500">players</span>
        </div>
      </div>
    </div>
  );
}

export function RecentActivityFeed() {
  const [activities, setActivities] = useState(ACTIVITY_FEED.slice(0, 5));

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-bold text-slate-400 uppercase">Live Activity</h4>
      {activities.map((activity, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg"
        >
          <span className="text-lg">{activity.emoji}</span>
          <div className="flex-1">
            <span className="text-white font-medium">{activity.name}</span>
            <span className="text-slate-400 text-sm"> {activity.action}</span>
          </div>
          <span className="text-xs text-slate-500">just now</span>
        </motion.div>
      ))}
    </div>
  );
}