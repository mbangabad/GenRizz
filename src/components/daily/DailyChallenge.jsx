import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { DailyScore } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES_LIST, GAMES } from '@/components/constants/games';
import { Calendar, Zap, Trophy, Clock, ChevronRight, Sparkles } from 'lucide-react';
import GameIcon from '@/components/home/GameIcon';

// Get today's daily challenge game (deterministic based on date)
function getDailyGame() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const gameIndex = dayOfYear % GAMES_LIST.length;
  return GAMES_LIST[gameIndex];
}

// Get time until next challenge
function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds, total: diff };
}

export default function DailyChallenge({ user }) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());
  const dailyGame = getDailyGame();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if user completed today's challenge
  const { data: todayScore } = useQuery({
    queryKey: ['dailyScore', user?.id, today, dailyGame.id],
    queryFn: async () => {
      const scores = await DailyScore.filter({
        user_id: user?.id,
        date: today,
        game_id: dailyGame.id
      });
      return scores[0] || null;
    },
    enabled: !!user?.id,
  });

  // Get today's leaderboard
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['dailyLeaderboard', today, dailyGame.id],
    queryFn: async () => {
      const scores = await DailyScore.filter({
        date: today,
        game_id: dailyGame.id
      });
      return scores.sort((a, b) => b.percentage - a.percentage).slice(0, 5);
    },
  });

  const isCompleted = !!todayScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-3d card-3d-purple overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#CE82FF] to-[#A855F7] p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-black text-lg">Daily Challenge</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <GameIcon gameId={dailyGame.id} size="lg" />
          <div className="flex-1">
            <h3 className="font-black text-[#3C3C3C] text-lg">{dailyGame.title}</h3>
            <p className="text-sm text-[#777777] font-semibold">{dailyGame.subtitle}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge-3d badge-xp text-xs py-0.5 px-2">
                <Zap className="w-3 h-3" />
                2x XP
              </span>
              {isCompleted && (
                <span className="badge-3d badge-green text-xs py-0.5 px-2">
                  ✓ Completed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* User's Score */}
        {isCompleted && (
          <div className="bg-[#F7F4F0] rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#777777]">Your Score</span>
              <span className="text-xl font-black text-[#CE82FF]">{todayScore.percentage}%</span>
            </div>
          </div>
        )}

        {/* Mini Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-[#AFAFAF] uppercase mb-2">Today's Top Scores</p>
            <div className="space-y-1">
              {leaderboard.slice(0, 3).map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-5 text-center font-black text-[#CE82FF]">{i + 1}</span>
                  <span className="flex-1 font-semibold text-[#3C3C3C] truncate">
                    {entry.user_id === user?.id ? 'You' : `Player ${i + 1}`}
                  </span>
                  <span className="font-black text-[#3C3C3C]">{entry.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link to={createPageUrl('Gameplay') + `?gameId=${dailyGame.id}&daily=true`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 font-black text-lg flex items-center justify-center gap-2 rounded-xl ${
              isCompleted 
                ? 'bg-[#F7F4F0] text-[#777777] border-2 border-[#E5E0DA]'
                : 'btn-3d btn-3d-green'
            }`}
          >
            {isCompleted ? (
              <>
                <Trophy className="w-5 h-5" />
                Play Again
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Start Challenge
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

export { getDailyGame, getTimeUntilMidnight };