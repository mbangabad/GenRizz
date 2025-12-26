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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--page-bg)' }}>
        <div className="card-3d p-8 text-center max-w-sm">
          <User className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Sign in to view profile</h2>
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
    <div className="min-h-screen pb-32" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d card-3d-purple p-6 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-2xl" style={{ backgroundColor: 'rgba(206, 130, 255, 0.2)' }} />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                     style={{ 
                       background: 'linear-gradient(to bottom right, var(--brand-purple), var(--brand-purple-dark))',
                       color: 'var(--text-inverse)',
                       boxShadow: '0 4px 0 var(--brand-purple-dark)'
                     }}>
                  {user.avatar || user.full_name?.[0] || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{user.full_name}</h1>
                    {isPremium && <PremiumBadge size="sm" />}
                  </div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                  {user.bio && <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{user.bio}</p>}
                </div>
              </div>
              <button 
                onClick={() => setEditing(true)}
                className="p-2.5 rounded-xl border-2 transition-colors"
                style={{
                  backgroundColor: 'var(--surface-0)',
                  borderColor: 'var(--border-subtle)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--surface-0)'}
              >
                <Edit2 className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            {/* Badge & XP */}
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
              <span className="text-3xl">{badge.emoji}</span>
              <div className="flex-1">
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{badge.name}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{totalXP.toLocaleString()} Total XP</p>
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
        <div className="flex gap-2 p-1 rounded-2xl" style={{ backgroundColor: 'var(--surface-3)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--surface-0)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: activeTab === tab.id ? 'var(--shadow-2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.color = 'var(--text-secondary)';
                }
              }}
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
              <button className="w-full py-3 border-2 rounded-xl flex items-center justify-center gap-2 font-black transition-colors"
                style={{
                  backgroundColor: 'rgba(28, 176, 246, 0.1)',
                  borderColor: 'rgba(28, 176, 246, 0.3)',
                  color: 'var(--brand-blue)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(28, 176, 246, 0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(28, 176, 246, 0.1)'}
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
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-colors mb-3"
            style={{
              backgroundColor: 'var(--surface-0)',
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-subtle)'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--surface-0)'}
            <SettingsIcon className="w-5 h-5" />
            Settings
          </button>
        </Link>

        {/* Help Link */}
        <Link to={createPageUrl('Help')}>
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-colors mb-3"
            style={{
              backgroundColor: 'var(--surface-0)',
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-subtle)'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--surface-0)'}
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </button>
        </Link>

        {/* Logout */}
        <button
          onClick={() => auth.signOut()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-colors"
          style={{
            backgroundColor: 'var(--surface-0)',
            color: 'var(--brand-red)',
            borderColor: 'var(--border-subtle)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#FFF5F5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--surface-0)'}
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
              <h2 className="text-xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Edit Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Avatar (emoji)</label>
                  <Input
                    value={editForm.avatar}
                    onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                    placeholder="🔥"
                    maxLength={2}
                    className="border-2 rounded-xl"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Bio</label>
                  <Input
                    value={editForm.bio}
                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    placeholder="Chronically online since 2020"
                    maxLength={100}
                    className="border-2 rounded-xl"
                    style={{ borderColor: 'var(--border-subtle)' }}
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