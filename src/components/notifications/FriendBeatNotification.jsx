import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Swords, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES } from '@/components/constants/games';

export default function FriendBeatNotification({ 
  friendName, 
  friendScore, 
  gameId, 
  userScore,
  onDismiss,
  autoHide = true 
}) {
  const [visible, setVisible] = useState(true);
  const game = GAMES[gameId];
  const didBeat = userScore > friendScore;

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50"
        >
          <div className={`card-3d p-4 ${didBeat ? 'card-3d-green' : 'card-3d-orange'}`}>
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-[var(--text-secondary)]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                didBeat ? 'bg-[var(--brand-green)]/20' : 'bg-[var(--brand-orange)]/20'
              }`}>
                {didBeat ? '🎉' : '😤'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[var(--text-primary)]">
                  {didBeat ? 'You beat' : 'Challenge from'} {friendName}!
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {game?.title} - {friendScore}%
                </p>
              </div>
            </div>

            {!didBeat && (
              <Link 
                to={createPageUrl('Gameplay') + `?gameId=${gameId}`}
                onClick={handleDismiss}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-3d btn-3d-orange py-3 flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  Beat Their Score!
                </motion.button>
              </Link>
            )}

            {didBeat && (
              <div className="flex items-center justify-center gap-2 text-[var(--brand-green)] font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>Your {userScore}% wins!</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}