import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, TrendingUp, Share2, X } from 'lucide-react';

export default function WeeklyRecap({ 
  isOpen, 
  onClose, 
  stats = {
    gamesPlayed: 0,
    totalXP: 0,
    avgScore: 0,
    bestGame: null,
    streak: 0,
    percentile: 50,
    improvement: 0,
  }
}) {
  if (!isOpen) return null;

  const shareRecap = () => {
    const text = `📊 My GenRizz Weekly Recap

🎮 ${stats.gamesPlayed} games played
⚡ ${stats.totalXP} XP earned
🎯 ${stats.avgScore}% average
🔥 ${stats.streak} day streak
📈 Top ${100 - stats.percentile}% of players

Play at genrizz.com`;

    if (navigator.share) {
      navigator.share({ title: 'My GenRizz Weekly Recap', text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="card-3d max-w-sm w-full p-6 relative overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F0EDE8] flex items-center justify-center"
        >
          <X className="w-4 h-4 text-[#777777]" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-3"
          >
            📊
          </motion.div>
          <h2 className="text-2xl font-black text-[#3C3C3C]">Weekly Recap</h2>
          <p className="text-[#777777] font-semibold">Your stats this week</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-3d card-3d-blue p-4 text-center">
            <Zap className="w-6 h-6 text-[#1CB0F6] mx-auto mb-1" />
            <p className="text-2xl font-black text-[#3C3C3C]">{stats.totalXP}</p>
            <p className="text-xs text-[#777777] font-semibold">XP Earned</p>
          </div>

          <div className="card-3d card-3d-green p-4 text-center">
            <Target className="w-6 h-6 text-[#58CC02] mx-auto mb-1" />
            <p className="text-2xl font-black text-[#3C3C3C]">{stats.avgScore}%</p>
            <p className="text-xs text-[#777777] font-semibold">Avg Score</p>
          </div>

          <div className="card-3d card-3d-orange p-4 text-center">
            <span className="text-2xl">🔥</span>
            <p className="text-2xl font-black text-[#3C3C3C]">{stats.streak}</p>
            <p className="text-xs text-[#777777] font-semibold">Day Streak</p>
          </div>

          <div className="card-3d card-3d-purple p-4 text-center">
            <TrendingUp className="w-6 h-6 text-[#CE82FF] mx-auto mb-1" />
            <p className="text-2xl font-black text-[#3C3C3C]">Top {100 - stats.percentile}%</p>
            <p className="text-xs text-[#777777] font-semibold">Ranking</p>
          </div>
        </div>

        {/* Best Game */}
        {stats.bestGame && (
          <div className="card-3d card-3d-yellow p-4 mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#FFC800]" />
              <div>
                <p className="text-xs text-[#777777] font-semibold">Best Performance</p>
                <p className="font-black text-[#3C3C3C]">{stats.bestGame.title}</p>
                <p className="text-sm text-[#58CC02] font-bold">{stats.bestGame.score}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Improvement */}
        {stats.improvement !== 0 && (
          <div className={`text-center mb-6 ${stats.improvement > 0 ? 'text-[#58CC02]' : 'text-[#FF4B4B]'}`}>
            <span className="font-black text-lg">
              {stats.improvement > 0 ? '📈' : '📉'} {stats.improvement > 0 ? '+' : ''}{stats.improvement}% from last week
            </span>
          </div>
        )}

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={shareRecap}
          className="btn-3d btn-3d-pink w-full py-4 flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share My Recap
        </motion.button>
      </motion.div>
    </motion.div>
  );
}