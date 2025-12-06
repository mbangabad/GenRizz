import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';
import { Question } from '@/api/entities';
// Temporarily disabled to fix React hooks error
// import { toast } from 'sonner';
const toast = { error: () => {}, success: () => {}, info: () => {} };

export default function VibeCheckSwipe({ question, onAnswer }) {
  const [voted, setVoted] = useState(false);
  const [stats, setStats] = useState(question.poll_stats || { left_count: 50, right_count: 50 });

  const handleVote = async (direction) => {
    if (voted) return;
    setVoted(true);

    // Optimistic Update
    const newStats = { ...stats };
    if (direction === 'left') newStats.left_count++;
    else newStats.right_count++;
    setStats(newStats);

    try {
      // Update DB
      const updateKey = direction === 'left' ? 'poll_stats.left_count' : 'poll_stats.right_count';
      // Note: base44 simple client might not support nested increment easily, 
      // but for now we assume we can send the full object or rely on backend logic.
      // Simulating update for prototype
      await Question.update(question.id, {
        poll_stats: {
            left_count: newStats.left_count,
            right_count: newStats.right_count
        }
      });
      
      toast.success("Vote recorded!");
      setTimeout(() => onAnswer(true), 2000); // Always 'correct' essentially
    } catch (e) {
      console.error("Vote failed", e);
    }
  };

  const total = (stats.left_count || 0) + (stats.right_count || 0) || 1;
  const leftPercent = Math.round((stats.left_count / total) * 100);
  const rightPercent = 100 - leftPercent;

  const config = question.poll_config || {
    left_label: "Cringe",
    right_label: "Based",
    left_emoji: "😬",
    right_emoji: "🔥"
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 flex flex-col h-full justify-center">
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-[#CE82FF]/10 text-[#CE82FF] text-xs font-black uppercase tracking-widest mb-4">
          Vibe Check
        </span>
        <h2 className="text-3xl font-black text-[#3C3C3C] leading-tight">{question.question}</h2>
      </div>

      {!voted ? (
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote('left')}
            className="aspect-[4/5] rounded-3xl bg-[#FF4B4B] text-white flex flex-col items-center justify-center gap-4 shadow-[0_8px_0_#B91C1C] active:translate-y-[8px] active:shadow-none transition-all"
          >
            <span className="text-6xl">{config.left_emoji}</span>
            <span className="font-black text-xl uppercase">{config.left_label}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote('right')}
            className="aspect-[4/5] rounded-3xl bg-[#58CC02] text-white flex flex-col items-center justify-center gap-4 shadow-[0_8px_0_#3D8C02] active:translate-y-[8px] active:shadow-none transition-all"
          >
            <span className="text-6xl">{config.right_emoji}</span>
            <span className="font-black text-xl uppercase">{config.right_label}</span>
          </motion.button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-3d p-6 bg-white"
        >
          <h3 className="text-center font-black text-[#3C3C3C] text-xl mb-6">Community Vibes</h3>
          
          <div className="space-y-6">
            {/* Left Bar */}
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-[#FF4B4B] flex items-center gap-2">
                   {config.left_emoji} {config.left_label}
                </span>
                <span className="text-[#3C3C3C]">{leftPercent}%</span>
              </div>
              <div className="h-4 bg-[#F0EDE8] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${leftPercent}%` }}
                  className="h-full bg-[#FF4B4B]"
                />
              </div>
            </div>

            {/* Right Bar */}
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-[#58CC02] flex items-center gap-2">
                   {config.right_emoji} {config.right_label}
                </span>
                <span className="text-[#3C3C3C]">{rightPercent}%</span>
              </div>
              <div className="h-4 bg-[#F0EDE8] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${rightPercent}%` }}
                  className="h-full bg-[#58CC02]"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
             <p className="text-sm font-bold text-[#AFAFAF]">
               {leftPercent > rightPercent 
                 ? `Most people think this is ${config.left_label}` 
                 : `Most people think this is ${config.right_label}`}
             </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}