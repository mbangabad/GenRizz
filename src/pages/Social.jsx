import React, { useState, useEffect } from 'react';
import FriendsList from '@/components/social/FriendsList';
import ActivityFeed from '@/components/social/ActivityFeed';
import { useQuery } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { Friendship, Notification } from '@/api/entities';
import { motion } from 'framer-motion';
import { Users, Trophy, Gift, Plus, Search, Bell, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';

import ReferralCard from '@/components/social/ReferralCard';
import FriendLeaderboard from '@/components/social/FriendLeaderboard';
import DailyRewardCalendar from '@/components/rewards/DailyRewardCalendar';
import SeasonalBanner from '@/components/events/SeasonalBanner';
import SubmitQuestion from '@/components/ugc/SubmitQuestion';

export default function Social() {
  const [user, setUser] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [tab, setTab] = useState('friends');

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: friendships = [], refetch: refetchFriends } = useQuery({
    queryKey: ['friendships', user?.id],
    queryFn: () => Friendship.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pendingRequests', user?.id],
    queryFn: () => Friendship.filter({ friend_id: user?.id, status: 'pending' }),
    enabled: !!user?.id,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => Notification.filter({ user_id: user?.id, read: false }).then(n => 
      n.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
    ),
    enabled: !!user?.id,
  });

  const handleAddFriend = async () => {
    if (!searchEmail.trim()) return;
    
    try {
      await Friendship.create({
        user_id: user.id,
        friend_id: searchEmail, // In real app, look up user by email
        friend_email: searchEmail,
        status: 'pending',
      });
      setSearchEmail('');
      refetchFriends();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    await Friendship.update(requestId, { status: 'accepted' });
    refetchFriends();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="card-3d p-8 text-center max-w-sm">
          <Users className="w-16 h-16 text-[#AFAFAF] mx-auto mb-4" />
          <h2 className="text-xl font-black text-[#3C3C3C] mb-2">Sign in to connect</h2>
          <p className="text-[#777777] font-semibold mb-4">See friends, leaderboards, and rewards</p>
          <button onClick={() => auth.redirectToLogin()} className="btn-3d btn-3d-green px-6 py-3">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const acceptedFriends = friendships.filter(f => f.status === 'accepted');

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-32">
      {/* Seasonal Event Banner */}
      <SeasonalBanner />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF86D0] to-[#E56AB8] flex items-center justify-center shadow-lg"
                 style={{ boxShadow: '0 4px 0 #C44D9A' }}>
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#3C3C3C]">Social Hub</h1>
              <p className="text-[#777777] font-semibold">Connect, compete, earn rewards</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingRequests.length > 0 && (
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E0DA] flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#777777]" />
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4B4B] rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {pendingRequests.length}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 bg-[#E8E4DF] p-1 rounded-2xl">
          {[
            { id: 'friends', label: 'Friends', icon: Users },
            { id: 'rewards', label: 'Rewards', icon: Gift },
            { id: 'invite', label: 'Invite', icon: UserPlus },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                tab === t.id ? 'bg-white text-[#3C3C3C] shadow-md' : 'text-[#777777] hover:text-[#3C3C3C]'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Friends Tab */}
        {tab === 'friends' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Add Friend */}
            <div className="card-3d p-4">
              <h3 className="font-bold text-[#3C3C3C] mb-3">Add Friend</h3>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AFAFAF]" />
                  <Input
                    value={searchEmail}
                    onChange={e => setSearchEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="pl-10 border-2 border-[#E5E0DA] rounded-xl"
                  />
                </div>
                <button onClick={handleAddFriend} className="btn-3d btn-3d-green px-4">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="card-3d card-3d-yellow p-4">
                <h3 className="font-bold text-[#3C3C3C] mb-3">Friend Requests</h3>
                <div className="space-y-2">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#E5E0DA]">
                      <span className="text-[#3C3C3C] font-semibold">{req.friend_email || 'Someone'}</span>
                      <button onClick={() => handleAcceptRequest(req.id)} className="btn-3d btn-3d-green px-4 py-2 text-sm">
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Feed */}
            <ActivityFeed userId={user.id} />

            {/* Friend Leaderboard */}
            <FriendLeaderboard userId={user.id} />

            {/* Friends List (Enhanced) */}
            <FriendsList userId={user.id} />
          </motion.div>
        )}

        {/* Rewards Tab */}
        {tab === 'rewards' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <DailyRewardCalendar userId={user.id} />

            {/* Upcoming Rewards */}
            <div className="card-3d p-5">
              <h3 className="font-bold text-[#3C3C3C] mb-4">Upcoming Rewards</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#F7F4F0] rounded-xl">
                  <span className="text-2xl">🏆</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#3C3C3C]">Weekly Champion</p>
                    <p className="text-xs text-[#777777] font-semibold">Top scorer gets 500 XP</p>
                  </div>
                  <span className="text-sm text-[#AFAFAF] font-semibold">3d left</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F7F4F0] rounded-xl">
                  <span className="text-2xl">🔥</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#3C3C3C]">30-Day Streak</p>
                    <p className="text-xs text-[#777777] font-semibold">Exclusive badge + 1000 XP</p>
                  </div>
                  <span className="text-sm text-[#AFAFAF] font-semibold">23d left</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Invite Tab */}
        {tab === 'invite' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ReferralCard userId={user.id} />

            {/* How it works */}
            <div className="card-3d p-5">
              <h3 className="font-bold text-[#3C3C3C] mb-4">How Referrals Work</h3>
              <div className="space-y-4">
                {[
                  { step: 1, text: 'Share your unique link with friends', icon: '🔗' },
                  { step: 2, text: 'They sign up and play their first game', icon: '🎮' },
                  { step: 3, text: 'You both earn 100 XP bonus!', icon: '⚡' },
                ].map(item => (
                  <div key={item.step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#CE82FF]/20 flex items-center justify-center text-[#CE82FF] font-bold text-sm">
                      {item.step}
                    </div>
                    <span className="text-[#3C3C3C] font-semibold flex-1">{item.text}</span>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}