import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { Friendship, UserProgress, Squad, Score } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES, GAMES_LIST, getGameLevel } from '@/components/constants/games';
import { Trophy, Crown, Users, Globe, Medal, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LeaderboardEntry from '@/components/leaderboard/LeaderboardEntry';
import { motion } from 'framer-motion';

export default function Leaderboards() {
  const [user, setUser] = useState(null);
  const [selectedGame, setSelectedGame] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all_time');
  const [activeTab, setActiveTab] = useState('global');

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  // Fetch friendships for friends leaderboard
  const { data: friendships = [] } = useQuery({
    queryKey: ['friendships', user?.id],
    queryFn: () => Friendship.filter({ user_id: user?.id, status: 'accepted' }),
    enabled: !!user?.id,
  });

  const friendIds = friendships.map(f => f.friend_id);

  // Fetch user progress for level info
  const { data: allProgress = [] } = useQuery({
    queryKey: ['allProgress'],
    queryFn: () => UserProgress.list('total_xp', 500, false),
  });

  const progressMap = allProgress.reduce((acc, p) => {
    if (!acc[p.user_id]) acc[p.user_id] = {};
    acc[p.user_id][p.game_id] = p;
    return acc;
  }, {});

  // Squads Query
  const { data: squads = [] } = useQuery({
    queryKey: ['squadsLeaderboard'],
    queryFn: () => Squad.list('total_xp', 50, false),
    enabled: activeTab === 'squads'
  });

  const { data: scores = [], isLoading } = useQuery({
    queryKey: ['leaderboard', selectedGame, timeFilter, activeTab, friendIds],
    queryFn: async () => {
      if (activeTab === 'squads') return [];

      const allScores = await Score.list('percentage', 500, false);

      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;

      const userBestScores = {};
      allScores.forEach(score => {
        // Game filter
        if (selectedGame !== 'all' && score.game_id !== selectedGame) return;

        // Friends filter
        if (activeTab === 'friends') {
          if (score.user_id !== user?.id && !friendIds.includes(score.user_id)) return;
        }

        // Time filter
        const scoreDate = new Date(score.created_date);
        if (timeFilter === 'daily' && (now - scoreDate > oneDay)) return;
        if (timeFilter === 'weekly' && (now - scoreDate > oneDay * 7)) return;

        // Add level info from progress
        const userProgress = progressMap[score.user_id];
        const gameProgress = userProgress?.[score.game_id];
        score.user_level_xp = gameProgress?.total_xp || 0;

        // Keep best score per user
        const key = `${score.user_id}-${score.game_id}`;
        if (!userBestScores[key] || score.percentage > userBestScores[key].percentage) {
          userBestScores[key] = score;
        }
      });

      return Object.values(userBestScores)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 50);
    },
  });

  const userRank = scores.findIndex(s => s.user_id === user?.id) + 1;
  const userScore = scores.find(s => s.user_id === user?.id);

  const TABS = [
    { id: 'global', label: 'Global', icon: Globe },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'squads', label: 'Squads', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-32 md:pb-12">
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFC800] to-[#FFB347] flex items-center justify-center shadow-lg"
               style={{ boxShadow: '0 4px 0 #E5B400' }}>
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#3C3C3C]">Leaderboards</h1>
            <p className="text-[#777777] font-semibold">Compete for the top spot</p>
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

        {/* Filters */}
        {activeTab !== 'squads' && (
          <div className="flex gap-3">
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="flex-1 py-3 px-4 rounded-xl border-2 border-[#E5E0DA] bg-white font-semibold text-[#3C3C3C]">
                <SelectValue placeholder="All Games" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E5E0DA]">
                <SelectItem value="all">🎮 All Games</SelectItem>
                {GAMES_LIST.map(g => (
                  <SelectItem key={g.id} value={g.id}>{g.icon} {g.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-36 py-3 px-4 rounded-xl border-2 border-[#E5E0DA] bg-white font-semibold text-[#3C3C3C]">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#E5E0DA]">
                <SelectItem value="all_time">⏳ All Time</SelectItem>
                <SelectItem value="weekly">📅 Weekly</SelectItem>
                <SelectItem value="daily">🌅 Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Squads Leaderboard */}
        {activeTab === 'squads' && (
          <div className="space-y-3">
            {squads.length === 0 ? (
              <div className="card-3d p-8 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-[#AFAFAF]" />
                <p className="text-[#777777] font-semibold mb-4">No squads yet!</p>
                <Link to={createPageUrl('Squads')} className="btn-3d btn-3d-blue px-6 py-3 inline-block">
                  Join a Squad
                </Link>
              </div>
            ) : (
              squads.map((squad, i) => (
                <motion.div 
                  key={squad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-3d p-4 flex items-center gap-4"
                >
                  <div className="w-8 h-8 flex items-center justify-center font-black text-[#AFAFAF]">
                    #{i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#F7F4F0] flex items-center justify-center text-2xl">
                    {squad.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#3C3C3C]">{squad.name}</h3>
                    <p className="text-xs text-[#AFAFAF]">{squad.member_count} members</p>
                  </div>
                  <div className="badge-3d badge-yellow">
                    <Crown className="w-3 h-3 mr-1" />
                    {squad.total_xp} XP
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* User Rank Card - Only for Score Leaderboards */}
        {activeTab !== 'squads' && user && userRank > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-3d card-3d-purple p-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CE82FF] to-[#A855F7] flex items-center justify-center font-black text-white text-xl shadow-lg"
                   style={{ boxShadow: '0 4px 0 #8B5CF6' }}>
                {user.avatar || user.full_name?.[0] || '?'}
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#777777] font-semibold">Your Rank</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-black text-[#3C3C3C]">#{userRank}</p>
                  {userScore && (
                    <span className="badge-3d badge-level text-xs">
                      {getGameLevel(userScore.user_level_xp || 0).emoji} Lvl {getGameLevel(userScore.user_level_xp || 0).level}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#CE82FF]">
                  {userScore?.percentage || 0}%
                </p>
                <p className="text-sm text-[#777777] font-semibold">{userScore?.tier_emoji} {userScore?.tier_name}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Podium (when global) */}
        {activeTab === 'global' && scores.length >= 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            {[1, 0, 2].map((idx) => {
              const s = scores[idx];
              if (!s) return null;
              const medals = ['🥇', '🥈', '🥉'];
              const sizes = idx === 0 ? 'h-32' : 'h-24';
              return (
                <div key={idx} className={`flex flex-col items-center justify-end ${sizes}`}>
                  <div className="text-3xl mb-2">{medals[idx]}</div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    idx === 0 ? 'from-[#FFC800] to-[#FFB347]' : idx === 1 ? 'from-[#C0C0C0] to-[#A0A0A0]' : 'from-[#CD7F32] to-[#B87333]'
                  } flex items-center justify-center text-white font-black shadow-lg`}>
                    {s.user_name?.[0] || '?'}
                  </div>
                  <p className="text-sm font-bold text-[#3C3C3C] mt-2 truncate max-w-full">{s.user_name || 'Player'}</p>
                  <p className="text-xs text-[#777777] font-semibold">{s.percentage}%</p>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Score Leaderboard List */}
        {activeTab !== 'squads' && (
          <div className="space-y-3">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="card-3d p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E8E4DF]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 rounded bg-[#E8E4DF]" />
                      <div className="h-3 w-16 rounded bg-[#E8E4DF]" />
                    </div>
                  </div>
                </div>
              ))
            ) : scores.length === 0 ? (
              <div className="card-3d p-8 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-[#AFAFAF]" />
                <p className="text-[#777777] font-semibold mb-4">
                  {activeTab === 'friends' ? 'No friend scores yet! Add some friends.' : 'No scores yet!'}
                </p>
                <Link to={createPageUrl('Home')} className="btn-3d btn-3d-green px-6 py-3 inline-block">
                  Play Now
                </Link>
              </div>
            ) : (
              scores.slice(activeTab === 'global' ? 3 : 0).map((score, i) => (
                <LeaderboardEntry
                  key={score.id}
                  score={score}
                  rank={activeTab === 'global' ? i + 4 : i + 1}
                  isMe={score.user_id === user?.id}
                  showGame={selectedGame === 'all'}
                  showChallenge={activeTab === 'friends' && !!user}
                  gameId={selectedGame !== 'all' ? selectedGame : undefined}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}