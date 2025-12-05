import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Crown, Play, Zap, Gift, Clock } from 'lucide-react';

const FREE_DAILY_LIMIT = 5;

export default function PlayLimitBanner({ 
  gamesPlayed = 0, 
  bonusPlays = 0,
  isPremium = false,
  onWatchAd 
}) {
  const remaining = FREE_DAILY_LIMIT + bonusPlays - gamesPlayed;
  const atLimit = remaining <= 0;
  const nearLimit = remaining <= 2 && remaining > 0;

  if (isPremium) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
        <Crown className="w-5 h-5 text-yellow-400" />
        <span className="text-sm font-bold text-purple-300">Premium — Unlimited Games</span>
      </div>
    );
  }

  if (atLimit) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="font-bold text-white">Daily limit reached!</p>
            <p className="text-sm text-slate-400">You've played {gamesPlayed} games today</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link 
            to={createPageUrl('Premium')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm"
          >
            <Crown className="w-4 h-4" />
            Go Premium — Unlimited
          </Link>
          
          <button
            onClick={onWatchAd}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            Watch Ad
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-3">
          <Gift className="w-3 h-3 inline mr-1" />
          Black Friday: Premium just $9.99/year!
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`flex items-center justify-between px-4 py-2 rounded-xl ${
      nearLimit 
        ? 'bg-orange-500/10 border border-orange-500/30' 
        : 'bg-slate-800/50 border border-slate-700'
    }`}>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[...Array(FREE_DAILY_LIMIT)].map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-6 rounded-sm ${
                i < gamesPlayed ? 'bg-purple-500' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        <span className={`text-sm font-bold ${nearLimit ? 'text-orange-400' : 'text-slate-400'}`}>
          {remaining} game{remaining !== 1 ? 's' : ''} left today
        </span>
      </div>

      <Link 
        to={createPageUrl('Premium')}
        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
      >
        <Zap className="w-3 h-3" />
        Unlimited
      </Link>
    </div>
  );
}

export function PlayLimitModal({ onClose, onWatchAd, onUpgrade }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-700 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
          <Clock className="w-10 h-10 text-orange-400" />
        </div>

        <h3 className="text-2xl font-black mb-2">Daily Limit Reached</h3>
        <p className="text-slate-400 mb-6">
          You've used all 5 free games today. Come back tomorrow or upgrade to Premium!
        </p>

        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold"
          >
            <Crown className="w-5 h-5" />
            Go Premium — $9.99/year
          </button>

          <button
            onClick={onWatchAd}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-700 rounded-xl font-bold hover:bg-slate-600 transition-colors"
          >
            <Play className="w-5 h-5" />
            Watch Ad for +1 Game
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-slate-400 hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}