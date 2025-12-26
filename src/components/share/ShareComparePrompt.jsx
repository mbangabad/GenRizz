import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Users, X, Twitter, Copy, Check, MessageCircle } from 'lucide-react';
import { GAMES, getTier } from '../constants/games';

export default function ShareComparePrompt({ 
  gameId, 
  percentage, 
  score, 
  totalQuestions,
  onDismiss,
  showAfterDelay = 2000 
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const game = GAMES[gameId];
  const tier = getTier(gameId, percentage);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), showAfterDelay);
    return () => clearTimeout(timer);
  }, [showAfterDelay]);

  if (dismissed || !visible) return null;

  // Generate emoji grid
  const generateEmojiGrid = () => {
    const correct = '🟩';
    const wrong = '🟥';
    const grid = [];
    for (let i = 0; i < Math.min(totalQuestions, 10); i++) {
      grid.push(i < score ? correct : wrong);
    }
    return grid.join('');
  };

  const shareText = `${game?.icon || '🎮'} GenRizz: ${game?.title || 'Quiz'}

${tier.emoji} ${tier.name}
${generateEmojiGrid()}

${percentage}% · Can you beat me?

🔗 genrizz.app`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I got ${tier.name} on GenRizz!`,
          text: shareText,
        });
      } catch (e) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
      >
        <div className="card-3d card-3d-pink p-5 relative">
          {/* Close button */}
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center hover:bg-white transition-colors" style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 134, 208, 0.3)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--brand-pink)' }} />
            </div>
            <div>
              <h3 className="font-black" style={{ color: 'var(--text-primary)' }}>Compare with friends!</h3>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>See who's the real expert</p>
            </div>
          </div>

          {/* Result Preview */}
          <div className="bg-white/50 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{tier.emoji}</span>
              <div className="flex-1">
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{tier.name}</p>
                <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{generateEmojiGrid()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black" style={{ color: 'var(--brand-pink)' }}>{percentage}%</p>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNativeShare}
              className="flex-1 btn-3d btn-3d-pink py-3 text-sm flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share & Compare
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTwitterShare}
              className="w-12 h-12 flex items-center justify-center bg-black rounded-xl" style={{ color: 'var(--text-inverse)', boxShadow: '0 3px 0 #333' }}
            >
              <Twitter className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-xl border-2 rounded-xl" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)', boxShadow: '0 3px 0 var(--border-strong)' }}
            >
              {copied ? <Check className="w-5 h-5" style={{ color: 'var(--brand-green)' }} /> : <Copy className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Nudge text */}
          <p className="text-xs text-center mt-3 font-semibold" style={{ color: 'var(--text-muted)' }}>
            🔥 Players who share get 2x more friends competing!
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}