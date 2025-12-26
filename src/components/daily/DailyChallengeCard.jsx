import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Trophy, ChevronRight, Sparkles } from 'lucide-react';
import { GAMES } from '@/components/constants/games';

export default function DailyChallengeCard({ 
  challenge, 
  onPlay, 
  completed = false, 
  userScore = null 
}) {
  const [timeLeft, setTimeLeft] = useState('');
  const game = GAMES[challenge?.game_id];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!game) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border-2 border-[var(--brand-yellow)]/30"
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ background: `linear-gradient(135deg, ${game.color}, var(--brand-purple-dark))` }}
      />

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-yellow)]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[var(--brand-yellow)]" />
            </div>
            <div>
              <p className="text-[var(--brand-yellow)] font-bold text-sm">DAILY CHALLENGE</p>
              <p className="text-xs text-white/40">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-[var(--surface-2)] px-3 py-1.5 rounded-full border border-white/10">
            <Clock className="w-4 h-4 text-[var(--brand-orange)]" />
            <span className="text-sm font-mono font-bold text-[var(--brand-orange)]">{timeLeft}</span>
          </div>
        </div>

        {/* Game Info */}
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
            style={{ background: game.color }}
          >
            {game.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-white">{game.title}</h3>
            <p className="text-white/50 text-sm">{game.subtitle}</p>
          </div>
        </div>

        {/* XP Bonus */}
        <div className="flex items-center gap-2 bg-[var(--brand-blue)]/15 border border-[var(--brand-blue)]/30 rounded-xl px-4 py-2 mb-4">
          <Zap className="w-5 h-5 text-[var(--brand-blue)]" />
          <span className="text-[var(--brand-blue)] font-bold">2x XP BONUS</span>
          <span className="text-[var(--brand-blue)]/60 text-sm">• Today only!</span>
        </div>

        {/* Action */}
        {completed ? (
          <div className="flex items-center justify-between bg-[var(--brand-green)]/15 border border-[var(--brand-green)]/30 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--brand-green)]" />
              <span className="text-[var(--brand-green)] font-bold">Completed!</span>
            </div>
            {userScore && (
              <span className="text-[var(--brand-green)] font-bold">{userScore}%</span>
            )}
          </div>
        ) : (
          <button
            onClick={onPlay}
            className="btn btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            Play Now
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Completions */}
        {challenge?.completions > 0 && (
          <p className="text-center text-xs text-white/40 mt-3">
            {challenge.completions.toLocaleString()} players completed today
          </p>
        )}
      </div>
    </motion.div>
  );
}