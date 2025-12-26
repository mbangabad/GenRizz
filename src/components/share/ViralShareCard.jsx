import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Copy, Check, Users, Smartphone } from 'lucide-react';
import { GAMES, getTier } from '@/components/constants/games';
import { createPageUrl } from '@/utils';

export default function ViralShareCard({ 
  gameId, 
  percentage, 
  score, 
  totalQuestions, 
  answers = [],
  userId,
  userName 
}) {
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  const game = GAMES[gameId];
  const tier = getTier(gameId, percentage);
  
  // Generate emoji grid (Wordle-style)
  const emojiGrid = answers.map(a => a.correct ? '🟢' : '🔴').join('');
  const gridRows = [];
  for (let i = 0; i < answers.length; i += 5) {
    gridRows.push(answers.slice(i, i + 5).map(a => a.correct ? '🟢' : '🔴').join(''));
  }
  
  const shareText = `🔥 GenRizz - ${game?.title || 'Quiz'}
${gridRows.join('\n')}
${score}/${totalQuestions} • ${tier.emoji} ${tier.name}
"${tier.roast}"
Can you beat me? 👇
genrizz.app`;

  const BASE_URL = import.meta.env.VITE_APP_URL || window.location.origin;
  const shareUrl = `${BASE_URL}${createPageUrl('Gameplay')}?gameId=${gameId}`;
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText + '\n' + shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `I scored ${percentage}% on ${game?.title}!`,
        text: shareText,
        url: shareUrl,
      });
    } else {
      setShowShare(true);
    }
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(shareText);
    const tweetUrl = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const waText = encodeURIComponent(shareText + '\n' + shareUrl);
    window.open(`https://wa.me/?text=${waText}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Result Card - Instagram Story Format */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-3d overflow-hidden"
        style={{ borderColor: game?.color || '#58CC02' }}
      >
        {/* Header */}
        <div 
          className="p-4 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${game?.color || '#58CC02'}, ${game?.color || '#58CC02'}CC)` }}
        >
          <p className="font-black text-lg">🔥 GenRizz</p>
          <p className="text-sm opacity-80">{game?.title}</p>
        </div>

        {/* Score Display */}
        <div className="p-6 text-center" style={{ backgroundColor: 'var(--surface-0)' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl mb-3"
          >
            {tier.emoji}
          </motion.div>
          
          <h3 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>{tier.name}</h3>
          
          <div className="text-5xl font-black mb-2" style={{ color: game?.color }}>
            {percentage}%
          </div>
          
          {/* Emoji Grid */}
          <div className="rounded-xl p-3 mb-4 font-mono text-lg" style={{ backgroundColor: 'var(--surface-1)' }}>
            {gridRows.map((row, i) => (
              <div key={i}>{row}</div>
            ))}
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{score}/{totalQuestions} correct</p>
          </div>
          
          {/* Roast */}
          <p className="text-sm font-semibold italic" style={{ color: 'var(--text-secondary)' }}>
            "{tier.roast}"
          </p>
        </div>

        {/* CTA */}
        <div className="p-4 text-center" style={{ backgroundColor: 'var(--surface-1)' }}>
          <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Can you beat this?</p>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>genrizz.app</p>
        </div>
      </motion.div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNativeShare}
          className="btn-3d btn-3d-green py-3 flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="btn-3d btn-3d-ghost py-3 flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-5 h-5" style={{ color: 'var(--brand-green)' }} /> : <Copy className="w-5 h-5" />}
          {copied ? 'Copied!' : 'Copy'}
        </motion.button>
      </div>

      {/* Social Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTwitterShare}
          className="flex-1 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2"
          style={{ backgroundColor: '#1DA1F2', boxShadow: '0 4px 0 #1a8cd8' }}
        >
          <Twitter className="w-5 h-5" />
          Tweet
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsAppShare}
          className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--brand-green)', color: 'var(--text-inverse)', boxShadow: '0 4px 0 var(--brand-green-dark)' }}
        >
          <Smartphone className="w-5 h-5" />
          WhatsApp
        </motion.button>
      </div>

      {/* Challenge Friend */}
      {userId && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-3d btn-3d-pink py-4 flex items-center justify-center gap-2"
        >
          <Users className="w-5 h-5" />
          Challenge a Friend to Beat This!
        </motion.button>
      )}
    </div>
  );
}