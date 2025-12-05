import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, Copy, Twitter, X } from 'lucide-react';
import { GAMES, getTier } from '@/components/constants/games';

export default function ShareCard({ 
  gameId, 
  score, 
  totalQuestions, 
  percentage, 
  tier,
  xpEarned,
  maxStreak,
  onClose 
}) {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const game = GAMES[gameId];

  useEffect(() => {
    if (!canvasRef.current || !game) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 600;
    const height = 400;
    
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle pattern
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Game color accent bar
    ctx.fillStyle = game.color;
    ctx.fillRect(0, 0, 8, height);

    // RIZZ Logo
    ctx.font = 'bold 24px system-ui';
    ctx.fillStyle = '#fff';
    ctx.fillText('🔥 RIZZ', 30, 40);

    // Game title
    ctx.font = 'bold 28px system-ui';
    ctx.fillStyle = '#fff';
    ctx.fillText(game.title, 30, 90);

    // Game icon background
    ctx.fillStyle = game.color;
    ctx.beginPath();
    ctx.roundRect(width - 100, 20, 70, 70, 16);
    ctx.fill();
    
    // Tier result (large)
    ctx.font = 'bold 48px system-ui';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${tier.emoji} ${tier.name}`, 30, 170);

    // Score
    ctx.font = 'bold 72px system-ui';
    ctx.fillStyle = game.color;
    ctx.fillText(`${percentage}%`, 30, 260);

    // Stats row
    ctx.font = '18px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(`Score: ${score}/${totalQuestions}`, 30, 300);
    if (maxStreak >= 3) {
      ctx.fillText(`🔥 ${maxStreak}x Streak`, 180, 300);
    }
    ctx.fillText(`+${xpEarned} XP`, 320, 300);

    // Message quote
    ctx.font = 'italic 16px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    const message = `"${tier.message}"`;
    // Word wrap
    const words = message.split(' ');
    let line = '';
    let y = 340;
    words.forEach((word) => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width - 60) {
        ctx.fillText(line, 30, y);
        line = word + ' ';
        y += 20;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 30, y);

    // Challenge CTA
    ctx.font = 'bold 14px system-ui';
    ctx.fillStyle = game.color;
    ctx.fillText('Can you beat this? → rizz.game', 30, height - 20);

    // Convert to image
    setImageUrl(canvas.toDataURL('image/png'));
  }, [game, score, percentage, tier, xpEarned, maxStreak, totalQuestions]);

  const handleShare = async () => {
    const text = `I got ${tier.emoji} ${tier.name} on ${game.title}!\n\nScore: ${percentage}%\n\n"${tier.message}"\n\nCan you beat me? 🔥`;
    
    if (navigator.share && imageUrl) {
      try {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], 'rizz-result.png', { type: 'image/png' });
        await navigator.share({
          title: `RIZZ - ${game.title}`,
          text,
          files: [file],
        });
      } catch (e) {
        // Fallback to text only
        await navigator.share({ title: `RIZZ - ${game.title}`, text });
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = `rizz-${gameId}-result.png`;
    link.href = imageUrl;
    link.click();
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(
      `I got ${tier.emoji} ${tier.name} on ${game.title}!\n\nScore: ${percentage}%\n\n"${tier.message}"\n\nCan you beat me? 🔥 rizz.game`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  if (!game) return null;

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
        className="bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden border border-slate-700"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Canvas preview */}
        <div className="p-4">
          <canvas ref={canvasRef} className="w-full rounded-xl" style={{ display: imageUrl ? 'none' : 'block' }} />
          {imageUrl && (
            <img src={imageUrl} alt="Share card" className="w-full rounded-xl" />
          )}
        </div>

        {/* Share buttons */}
        <div className="p-4 border-t border-slate-800 flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleTwitter}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}