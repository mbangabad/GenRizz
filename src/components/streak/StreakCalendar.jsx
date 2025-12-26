import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Shield, Lock } from 'lucide-react';

export default function StreakCalendar({ 
  currentStreak = 0, 
  longestStreak = 0, 
  calendar = [], 
  streakFreezeAvailable = false,
  isPremium = false 
}) {
  // Generate last 30 days
  const today = new Date();
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      day: date.getDate(),
      isToday: i === 0,
      played: calendar.includes(dateStr),
    });
  }

  return (
    <div className="bg-[var(--surface-1)] rounded-2xl p-6 border border-[color-mix(in_srgb,var(--text-inverse),transparent_90%)]"
      {/* Stats Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-red)] flex items-center justify-center"
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--brand-orange)]">{currentStreak}</p>
              <p className="text-xs text-white/40">Day Streak</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/10" />
          
          <div>
            <p className="text-lg font-bold text-white">{longestStreak}</p>
            <p className="text-xs text-white/40">Best Streak</p>
          </div>
        </div>

        {/* Streak Freeze */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
          streakFreezeAvailable 
            ? 'bg-[color-mix(in_srgb,#00CED1,transparent_80%)] border border-[color-mix(in_srgb,#00CED1,transparent_70%)]' 
            : 'bg-[var(--surface-3)]'
        }`}>
          {isPremium ? (
            <>
              <Shield className={`w-5 h-5 ${streakFreezeAvailable ? 'text-[#00CED1]' : 'text-[color-mix(in_srgb,var(--text-inverse),transparent_60%)]'}`} />
              <span className="text-xs font-bold">
                {streakFreezeAvailable ? '1 Freeze Ready' : 'Freeze Used'}
              </span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/40">Premium</span>
            </>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-10 gap-1">
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold relative ${
              day.isToday 
                ? 'ring-2 ring-[var(--brand-orange)] ring-offset-2 ring-offset-[var(--surface-1)]'
                : ''
            } ${
              day.played 
                ? 'bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-red)] text-[var(--text-inverse)]' 
                : 'bg-[var(--surface-3)] text-[color-mix(in_srgb,var(--text-inverse),transparent_60%)]'
            }`}
            title={day.date}
          >
            {day.played ? (
              <Flame className="w-3 h-3" />
            ) : (
              day.day
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/40">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-red)]" />
          <span>Played</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[var(--surface-3)]" />
          <span>Missed</span>
        </div>
      </div>

      {/* Streak Message */}
      {currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-[color-mix(in_srgb,var(--brand-orange),transparent_90%)] border border-[color-mix(in_srgb,var(--brand-orange),transparent_70%)] rounded-xl text-center"
        >
          <p className="text-[var(--brand-orange)] text-sm">
            🔥 {currentStreak === 1 
              ? "Great start! Keep it going tomorrow!" 
              : currentStreak < 7 
                ? `${currentStreak} days strong! Don't break it!`
                : currentStreak < 30
                  ? `Amazing ${currentStreak}-day streak! You're on fire!`
                  : `LEGENDARY ${currentStreak}-day streak! 🏆`
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}