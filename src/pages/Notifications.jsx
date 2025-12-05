import React, { useState, useEffect } from 'react';
// Notifications page - using mock data for now
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, ArrowLeft, Heart, Zap, Trophy, UserPlus, 
  MessageCircle, Check, Trash2, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// Mock Notifications
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'challenge_received',
    title: 'New Challenge!',
    message: 'Sarah challenged you to "Gen Z Fluency"',
    time: '2m ago',
    read: false,
    actionUrl: 'Challenge?id=123'
  },
  {
    id: 2,
    type: 'friend_accepted',
    title: 'Friend Request Accepted',
    message: 'Alex is now your friend',
    time: '1h ago',
    read: false,
    actionUrl: 'Profile?id=456'
  },
  {
    id: 3,
    type: 'streak_warning',
    title: 'Streak at Risk!',
    message: 'Play now to save your 5-day streak 🔥',
    time: '5h ago',
    read: true,
    actionUrl: 'Home'
  },
  {
    id: 4,
    type: 'reward',
    title: 'Daily Reward',
    message: 'You earned 50 XP for logging in',
    time: '1d ago',
    read: true,
    actionUrl: 'Rewards'
  },
  {
    id: 5,
    type: 'level_up',
    title: 'Level Up!',
    message: 'You reached Level 5: Certified Mid',
    time: '2d ago',
    read: true,
    actionUrl: 'Profile'
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'challenge_received': return <Trophy className="w-5 h-5 text-[#FFC800]" />;
      case 'friend_accepted': return <UserPlus className="w-5 h-5 text-[#58CC02]" />;
      case 'streak_warning': return <Zap className="w-5 h-5 text-[#FF9600]" />;
      case 'reward': return <Star className="w-5 h-5 text-[#CE82FF]" />;
      case 'level_up': return <Crown className="w-5 h-5 text-[#1CB0F6]" />;
      default: return <Bell className="w-5 h-5 text-[#777777]" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'challenge_received': return '#FFC800';
      case 'friend_accepted': return '#58CC02';
      case 'streak_warning': return '#FF9600';
      case 'reward': return '#CE82FF';
      case 'level_up': return '#1CB0F6';
      default: return '#777777';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      <header className="glass-light border-b border-[#E5E0DA] sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')}>
              <button className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E0DA] flex items-center justify-center hover:bg-[#F0EDE8] transition-colors">
                <ArrowLeft className="w-5 h-5 text-[#777777]" />
              </button>
            </Link>
            <div>
              <h1 className="font-black text-[#3C3C3C] text-lg">Notifications</h1>
              <p className="text-xs text-[#AFAFAF] font-semibold">Stay updated</p>
            </div>
          </div>
          <button 
            onClick={markAllRead}
            className="text-xs font-bold text-[#1CB0F6] hover:text-[#1899D6] bg-[#1CB0F6]/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            Mark all read
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-[#E5E0DA] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-[#AFAFAF]" />
              </div>
              <h3 className="font-bold text-[#777777]">No notifications</h3>
              <p className="text-sm text-[#AFAFAF]">You're all caught up!</p>
            </motion.div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                layout
                className={`card-3d p-4 flex gap-4 ${!notification.read ? 'bg-white border-[#1CB0F6]/30' : 'bg-[#FAF8F5] border-transparent shadow-none'}`}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center bg-white border-2 border-[#E5E0DA]"
                  style={{ borderColor: !notification.read ? getColor(notification.type) : undefined }}
                >
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold truncate pr-2 ${!notification.read ? 'text-[#3C3C3C]' : 'text-[#777777]'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] font-bold text-[#AFAFAF] whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-[#777777] leading-snug mb-2">
                    {notification.message}
                  </p>
                  
                  {notification.actionUrl && (
                    <div className="flex gap-2">
                       {/* In real app, use Link or button depending on action */}
                       <button className="text-xs font-bold text-[#1CB0F6] hover:underline">
                         View Details
                       </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => deleteNotification(notification.id)}
                  className="self-start p-1 text-[#AFAFAF] hover:text-[#FF4B4B] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
    
function Crown({ className }) { return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> }