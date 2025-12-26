import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Copy, Check, Users, MessageCircle, Smartphone } from 'lucide-react';
import { GAMES, getTier } from '../constants/games';
import ChallengeButton from '../social/ChallengeButton';

export default function ShareableResultCard({ 
  gameId, 
  percentage, 
  score, 
  totalQuestions,
  percentile = null,
  streak = 0,
  userId = null,
  userName = null,
  onShare 
}) {
  const [copied, setCopied] = React.useState(false);
  const cardRef = useRef(null);
  
  const game = GAMES[gameId];
  const tier = getTier(gameId, percentage);
  
  // Generate emoji grid (like Wordle)
  const generateEmojiGrid = () => {
    const correct = '🟩';
    const wrong = '🟥';
    const grid = [];
    for (let i = 0; i < totalQuestions; i++) {
      grid.push(i < score ? correct : wrong);
    }
    return grid.join('');
  };
  
  const shareText = `${game?.icon || '🎮'} GenRizz: ${game?.title || 'Quiz'}

${tier.emoji} ${tier.name}
${generateEmojiGrid()}

${percentage}% · ${score}/${totalQuestions}
${percentile ? `Better than ${percentile}% of players!` : ''}
${streak > 0 ? `🔥 ${streak} streak` : ''}

Play now: genrizz.app`;

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

  // Tier-specific gradients
  const tierGradients = {
    0: 'from-gray-600 to-gray-700',
    40: 'from-amber-600 to-orange-600',
    60: 'from-blue-600 to-indigo-600',
    75: 'from-purple-600 to-pink-600',
    90: 'from-amber-400 to-yellow-500',
  };
  
  const getGradient = (pct) => {
    if (pct >= 90) return tierGradients[90];
    if (pct >= 75) return tierGradients[75];
    if (pct >= 60) return tierGradients[60];
    if (pct >= 40) return tierGradients[40];
    return tierGradients[0];
  };

  return (
    <div className="space-y-4">
      {/* The Card */}
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getGradient(percentage)} p-6 text-white shadow-2xl`}
      >
        {/* Background decoration */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                🔥
              </div>
              <span className="font-bold text-sm opacity-90">GenRizz</span>
            </div>
            <span className="text-xs opacity-70">{game?.title}</span>
          </div>

          {/* Main Result */}
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-6xl mb-3"
            >
              {tier.emoji}
            </motion.div>
            <h2 className="text-2xl font-black mb-1">{tier.name}</h2>
            <p className="text-white/70 text-sm max-w-xs mx-auto">{tier.message}</p>
          </div>

          {/* Score */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-black">{percentage}%</p>
                <p className="text-xs opacity-70">Score</p>
              </div>
              {percentile && (
                <>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">Top {100 - percentile}%</p>
                    <p className="text-xs opacity-70">Global Rank</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Emoji Grid */}
          <div className="text-center">
            <p className="text-2xl tracking-wide font-mono">{generateEmojiGrid()}</p>
            <p className="text-xs opacity-50 mt-2">{score}/{totalQuestions} correct</p>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <span>🔥</span>
                <span className="font-bold">{streak} day streak</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Challenge Button */}
        {userId && (
          <ChallengeButton 
            gameId={gameId}
            score={score}
            percentage={percentage}
            userId={userId}
            userName={userName}
          />
        )}

        {/* Share Buttons Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {/* WhatsApp */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')}
            className="flex flex-col items-center gap-1 p-2 rounded-xl"
            style={{ backgroundColor: 'rgba(37, 211, 102, 0.1)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-green)' }}>
              <MessageCircle className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: 'var(--brand-green)' }}>WhatsApp</span>
          </motion.button>

          {/* iMessage/SMS */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`sms:?&body=${encodeURIComponent(shareText)}`, '_self')}
            className="flex flex-col items-center gap-1 p-2 rounded-xl"
            style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#34C759' }}>
              <Smartphone className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#34C759' }}>iMessage</span>
          </motion.button>

          {/* TikTok */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              await navigator.clipboard.writeText(shareText);
              window.open('https://www.tiktok.com/upload', '_blank');
            }}
            className="flex flex-col items-center gap-1 p-2 rounded-xl"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
          >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <span className="text-lg">🎵</span>
            </div>
            <span className="text-[10px] font-bold" style={{ color: 'var(--text-primary)' }}>TikTok</span>
          </motion.button>

          {/* Twitter/X */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTwitterShare}
            className="flex flex-col items-center gap-1 p-2 rounded-xl"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
          >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <Twitter className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: 'var(--text-primary)' }}>X</span>
          </motion.button>

          {/* Share */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1 p-2 rounded-xl"
            style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#007AFF' }}>
              <Share2 className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: '#007AFF' }}>Share</span>
          </motion.button>

          {/* Copy */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex flex-col items-center gap-1 p-2 rounded-xl"
            style={{ backgroundColor: 'var(--surface-3)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--text-secondary)' }}>
              {copied ? <Check className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} /> : <Copy className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />}
            </div>
            <span className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>
        </div>
      </div>

      {/* Roast Text */}
      {tier.roast && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm italic rounded-xl p-3" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--surface-1)' }}
        >
          "{tier.roast}"
        </motion.div>
      )}
    </div>
  );
}