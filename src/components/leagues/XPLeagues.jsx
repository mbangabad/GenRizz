import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
// XPLeagues component - no base44 dependencies found
import { Trophy, ChevronUp, ChevronDown, Crown, Minus, X, Medal } from 'lucide-react';

const LEAGUES = [
  { id: 'bronze', name: 'Bronze', emoji: '🥉', color: '#CD7F32', minXP: 0 },
  { id: 'silver', name: 'Silver', emoji: '🥈', color: '#C0C0C0', minXP: 500 },
  { id: 'gold', name: 'Gold', emoji: '🥇', color: '#FFD700', minXP: 1500 },
  { id: 'platinum', name: 'Platinum', emoji: '💎', color: '#E5E4E2', minXP: 3000 },
  { id: 'diamond', name: 'Diamond', emoji: '💠', color: '#B9F2FF', minXP: 5000 },
  { id: 'obsidian', name: 'Obsidian', emoji: '🖤', color: '#3C3C3C', minXP: 10000 },
];

// Get current league based on XP
function getCurrentLeague(weeklyXP) {
  let league = LEAGUES[0];
  for (const l of LEAGUES) {
    if (weeklyXP >= l.minXP) league = l;
    else break;
  }
  return league;
}

// Generate fake leaderboard for demo
function generateFakeLeaderboard(userId, userXP) {
  const names = ['Alex', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Quinn', 'Avery', 'Skyler', 'Drew'];
  const entries = names.map((name, i) => ({
    id: `fake_${i}`,
    name,
    xp: Math.floor(Math.random() * 500) + 100,
    isUser: false,
  }));
  
  // Add user
  entries.push({
    id: userId,
    name: 'You',
    xp: userXP || 250,
    isUser: true,
  });
  
  // Sort by XP
  entries.sort((a, b) => b.xp - a.xp);
  
  // Add rank
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

export default function XPLeagues({ userId }) {
  const [showModal, setShowModal] = useState(false);
  
  // Get user's weekly XP
  const { data: userProgress = [] } = useQuery({
    queryKey: ['userProgress', userId],
    queryFn: () => UserProgress.filter({ user_id: userId }),
    enabled: !!userId,
  });

  const totalXP = userProgress.reduce((sum, p) => sum + (p.total_xp || 0), 0);
  const weeklyXP = Math.floor(totalXP * 0.3); // Simulate weekly XP as 30% of total
  const currentLeague = getCurrentLeague(weeklyXP);
  const nextLeague = LEAGUES[LEAGUES.indexOf(currentLeague) + 1];
  
  const leaderboard = generateFakeLeaderboard(userId, weeklyXP);
  const userRank = leaderboard.find(e => e.isUser)?.rank || 0;
  
  // Determine promotion/demotion zone
  const getZone = (rank) => {
    if (rank <= 3) return 'promote';
    if (rank >= 8) return 'demote';
    return 'safe';
  };

  return (
    <>
      {/* League Badge */}
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="card-3d p-4 text-center cursor-pointer w-full"
        style={{ borderColor: `${currentLeague.color}50` }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl mb-2"
        >
          {currentLeague.emoji}
        </motion.div>
        <p className="font-black text-lg" style={{ color: currentLeague.color }}>
          {currentLeague.name}
        </p>
        <p className="text-sm text-[#777777] font-semibold">Rank #{userRank}</p>
        
        {/* Progress to next league */}
        {nextLeague && (
          <div className="mt-3">
            <div className="progress-bar-3d h-2">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${Math.min(100, ((weeklyXP - currentLeague.minXP) / (nextLeague.minXP - currentLeague.minXP)) * 100)}%`,
                  backgroundColor: currentLeague.color 
                }}
              />
            </div>
            <p className="text-xs text-[#AFAFAF] mt-1 font-semibold">
              {nextLeague.minXP - weeklyXP} XP to {nextLeague.name}
            </p>
          </div>
        )}
      </motion.button>

      {/* League Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="card-3d p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{currentLeague.emoji}</span>
                  <div>
                    <h3 className="text-xl font-black" style={{ color: currentLeague.color }}>
                      {currentLeague.name} League
                    </h3>
                    <p className="text-sm text-[#777777] font-semibold">Week 48 • 3 days left</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg bg-[#F7F4F0] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#777777]" />
                </button>
              </div>

              {/* League Progress */}
              <div className="flex justify-center gap-2 mb-6">
                {LEAGUES.map((league, i) => (
                  <div 
                    key={league.id}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      LEAGUES.indexOf(currentLeague) >= i 
                        ? 'opacity-100' 
                        : 'opacity-30'
                    }`}
                    style={{ 
                      backgroundColor: `${league.color}20`,
                      border: LEAGUES.indexOf(currentLeague) === i ? `2px solid ${league.color}` : 'none'
                    }}
                  >
                    {league.emoji}
                  </div>
                ))}
              </div>

              {/* Leaderboard */}
              <div className="space-y-2">
                {leaderboard.map((entry, i) => {
                  const zone = getZone(entry.rank);
                  
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        entry.isUser ? 'bg-[#58CC02]/10 border-2 border-[#58CC02]' :
                        zone === 'promote' ? 'bg-[#58CC02]/5' :
                        zone === 'demote' ? 'bg-[#FF4B4B]/5' :
                        'bg-[#F7F4F0]'
                      }`}
                    >
                      {/* Rank */}
                      <div className={`w-8 text-center font-black ${
                        entry.rank === 1 ? 'text-[#FFD700]' :
                        entry.rank === 2 ? 'text-[#C0C0C0]' :
                        entry.rank === 3 ? 'text-[#CD7F32]' :
                        'text-[#777777]'
                      }`}>
                        {entry.rank <= 3 ? (
                          <Medal className="w-5 h-5 mx-auto" />
                        ) : (
                          entry.rank
                        )}
                      </div>

                      {/* Name */}
                      <div className="flex-1">
                        <p className={`font-bold ${entry.isUser ? 'text-[#58CC02]' : 'text-[#3C3C3C]'}`}>
                          {entry.name}
                        </p>
                      </div>

                      {/* XP */}
                      <div className="text-right">
                        <p className="font-black text-[#3C3C3C]">{entry.xp}</p>
                        <p className="text-xs text-[#AFAFAF]">XP</p>
                      </div>

                      {/* Zone indicator */}
                      {zone === 'promote' && (
                        <ChevronUp className="w-4 h-4 text-[#58CC02]" />
                      )}
                      {zone === 'demote' && (
                        <ChevronDown className="w-4 h-4 text-[#FF4B4B]" />
                      )}
                      {zone === 'safe' && (
                        <Minus className="w-4 h-4 text-[#AFAFAF]" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 p-3 bg-[#F7F4F0] rounded-xl text-xs">
                <div className="flex items-center justify-between text-[#777777]">
                  <span className="flex items-center gap-1">
                    <ChevronUp className="w-3 h-3 text-[#58CC02]" />
                    Top 3 promote
                  </span>
                  <span className="flex items-center gap-1">
                    <ChevronDown className="w-3 h-3 text-[#FF4B4B]" />
                    Bottom 3 demote
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { LEAGUES, getCurrentLeague };