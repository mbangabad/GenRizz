import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { UserProgress, Score, UserStreak, Friendship } from '@/api/entities';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Trophy, Zap, Flame, Star, Edit2, LogOut, 
  ChevronRight, Award, Target, Calendar, Gift, Lightbulb, Crown,
  Settings as SettingsIcon, HelpCircle, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES, getGameLevel, getTotalXpBadge } from '@/components/constants/games';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import DailyRewardCalendar from '@/components/rewards/DailyRewardCalendar';
import ReferralCard from '@/components/social/ReferralCard';
import ProfileStats from '@/components/profile/ProfileStats';
import AchievementShowcase from '@/components/profile/AchievementShowcase';
import GameHistory from '@/components/profile/GameHistory';
import CreatorHub from '@/components/creator/CreatorHub';
import PremiumBadge from '@/components/premium/PremiumBadge';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ avatar: '', bio: '' });
  const queryClient = useQueryClient();

  useEffect(() => {
    auth.me().then(u => {
      setUser(u);
      setEditForm({ avatar: u.avatar_url || '', bio: u.bio || '' });
    }).catch(() => {});
  }, []);

  const { data: userProgress = [] } = useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: () => UserProgress.filter({ user_id: user?.id }),
    enabled: !!user?.id,
  });

  const { data: scores = [] } = useQuery({
    queryKey: ['recentScores', user?.id],
    queryFn: () => Score.filter({ user_id: user?.id }).then(scores => 
      scores.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20)
    ),
    enabled: !!user?.id,
  });

  const { data: userStreak } = useQuery({
    queryKey: ['streak', user?.id],
    queryFn: async () => {
      const streaks = await UserStreak.filter({ user_id: user?.id });
      return streaks[0] || { current_streak: 0, longest_streak: 0 };
    },
    enabled: !!user?.id,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => auth.updateMe(data),
    onSuccess: () => {
      setEditing(false);
      auth.me().then(setUser);
    },
  });

  const { data: friendships = [] } = useQuery({
    queryKey: ['friendships', user?.id],
    queryFn: () => Friendship.filter({ user_id: user?.id, status: 'accepted' }),
    enabled: !!user?.id,
  });

  const [activeTab, setActiveTab] = useState('stats');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="card-3d p-8 text-center max-w-sm">
          <User className="w-16 h-16 text-[#AFAFAF] mx-auto mb-4" />
          <h2 className="text-xl font-black text-[#3C3C3C] mb-2">Sign in to view profile</h2>
          <button onClick={() => auth.redirectToLogin()} className="btn-3d btn-3d-green px-6 py-3">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const totalXP = userProgress.reduce((sum, p) => sum + (p.total_xp || 0), 0);
  const totalPlays = userProgress.reduce((sum, p) => sum + (p.total_plays || 0), 0);
  const avgScore = scores.length > 0 
    ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length)
    : 0;
  const badge = getTotalXpBadge(totalXP);
  const hasPerfect = scores.some(s => s.percentage === 100);

  const profileStats = {
    streak: userStreak?.current_streak || 0,
    totalPlays,
    avgScore,
    gamesUnlocked: userProgress.length,
    totalXP,
    hasPerfect,
    friendCount: friendships.length,
  };

  // Top games by XP
  const topGames = [...userProgress]
    .sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0))
    .slice(0, 5);
  
  const isPremium = user.is_premium || false;

  const TABS = [
    { id: 'stats', label: 'Stats', icon: Trophy },
    { id: 'games', label: 'Games', icon: Target },
    { id: 'creator', label: 'Creator', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-32">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d card-3d-purple p-6 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#CE82FF]/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#CE82FF] to-[#A855F7] flex items-center justify-center text-4xl text-white shadow-lg"
                     style={{ boxShadow: '0 4px 0 #8B5CF6' }}>
                  {user.avatar || user.full_name?.[0] || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black text-[#3C3C3C]">{user.full_name}</h1>
                    {isPremium && <PremiumBadge size="sm" />}
                  </div>
                  <p className="text-[#777777] text-sm font-semibold">{user.email}</p>
                  {user.bio && <p className="text-[#3C3C3C] text-sm mt-1">{user.bio}</p>}
                </div>
              </div>
              <button 
                onClick={() => setEditing(true)}
                className="p-2.5 bg-white rounded-xl hover:bg-[#F0EDE8] border-2 border-[#E5E0DA] transition-colors"
              >
                <Edit2 className="w-5 h-5 text-[#777777]" />
              </button>
            </div>

            {/* Badge & XP */}
            <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
              <span className="text-3xl">{badge.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-[#3C3C3C]">{badge.name}</p>
                <p className="text-sm text-[#777777] font-semibold">{totalXP.toLocaleString()} Total XP</p>
              </div>
              {!isPremium && (
                <Link to={createPageUrl('Premium')} className="btn-3d btn-3d-yellow px-4 py-2 text-sm flex items-center gap-1.5">
                  <Crown className="w-4 h-4" />
                  Go Premium
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 bg-[#E8E4DF] p-1 rounded-2xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-[#3C3C3C] shadow-md' 
                  : 'text-[#777777] hover:text-[#3C3C3C]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <ProfileStats stats={profileStats} />
            
            <Link to={createPageUrl('StatsDeepDive')}>
              <button className="w-full py-3 bg-[#1CB0F6]/10 hover:bg-[#1CB0F6]/20 border-2 border-[#1CB0F6]/30 rounded-xl flex items-center justify-center gap-2 text-[#1CB0F6] font-black transition-colors">
                <TrendingUp className="w-5 h-5" />
                View Deep Dive Analytics
              </button>
            </Link>

            <AchievementShowcase stats={profileStats} />
            <DailyRewardCalendar userId={user.id} />
            <ReferralCard userId={user.id} />
          </motion.div>
        )}

        {activeTab === 'games' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <GameHistory progress={userProgress} scores={scores} />
          </motion.div>
        )}

        {activeTab === 'creator' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CreatorHub userId={user.id} />
          </motion.div>
        )}

        {/* Settings Link */}
        <Link to={createPageUrl('Settings')}>
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#777777] rounded-xl font-bold hover:bg-[#F0EDE8] transition-colors border-2 border-[#E5E0DA] mb-3">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </button>
        </Link>

        {/* Help Link */}
        <Link to={createPageUrl('Help')}>
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#777777] rounded-xl font-bold hover:bg-[#F0EDE8] transition-colors border-2 border-[#E5E0DA] mb-3">
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </button>
        </Link>

        {/* Logout */}
        <button
          onClick={() => auth.signOut()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#FF4B4B] rounded-xl font-bold hover:bg-[#FFF5F5] transition-colors border-2 border-[#E5E0DA]"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="card-3d p-6 max-w-sm w-full"
            >
              <h2 className="text-xl font-black text-[#3C3C3C] mb-4">Edit Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-[#777777] mb-1 block">Avatar (emoji)</label>
                  <Input
                    value={editForm.avatar}
                    onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                    placeholder="🔥"
                    maxLength={2}
                    className="border-2 border-[#E5E0DA] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#777777] mb-1 block">Bio</label>
                  <Input
                    value={editForm.bio}
                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    placeholder="Chronically online since 2020"
                    maxLength={100}
                    className="border-2 border-[#E5E0DA] rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditing(false)} className="flex-1 btn-3d btn-3d-ghost py-3">
                  Cancel
                </button>
                <button 
                  onClick={() => updateMutation.mutate(editForm)}
                  disabled={updateMutation.isLoading}
                  className="flex-1 btn-3d btn-3d-green py-3"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}