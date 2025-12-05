import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, Twitter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Generate emoji grid based on answer results
const generateEmojiGrid = (answers, gameEmoji = '🔥') => {
  const rows = [];
  const emojisPerRow = 5;
  
  for (let i = 0; i < answers.length; i += emojisPerRow) {
    const row = answers.slice(i, i + emojisPerRow).map(correct => 
      correct ? '🟩' : '🟥'
    );
    rows.push(row.join(''));
  }
  
  return rows.join('\n');
};

// Generate share text
const generateShareText = ({ 
  gameName, 
  score, 
  total, 
  percentage, 
  tierName, 
  tierEmoji,
  streak,
  emojiGrid,
  gameEmoji = '🔥'
}) => {
  const header = `${gameEmoji} RIZZ: ${gameName}`;
  const scoreText = `${score}/${total} (${percentage}%) ${tierEmoji}`;
  const tierText = `"${tierName}"`;
  const streakText = streak > 0 ? `🔥 ${streak} streak` : '';
  
  const lines = [
    header,
    scoreText,
    tierText,
    '',
    emojiGrid,
    '',
    streakText,
    '',
    '🎮 rizz.game'
  ].filter(Boolean);
  
  return lines.join('\n');
};

export default function EmojiResultGrid({ 
  answers = [], // Array of booleans: true = correct, false = incorrect
  gameName,
  gameEmoji = '🔥',
  score,
  total,
  percentage,
  tierName,
  tierEmoji,
  streak = 0,
  compact = false
}) {
  const emojiGrid = useMemo(() => generateEmojiGrid(answers, gameEmoji), [answers, gameEmoji]);
  
  const shareText = useMemo(() => generateShareText({
    gameName,
    score,
    total,
    percentage,
    tierName,
    tierEmoji,
    streak,
    emojiGrid,
    gameEmoji
  }), [gameName, score, total, percentage, tierName, tierEmoji, streak, emojiGrid, gameEmoji]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied! Now paste it anywhere 📋');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `RIZZ: ${gameName}`,
          text: shareText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const shareToTwitter = () => {
    const tweetText = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const waText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${waText}`, '_blank');
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Compact emoji grid preview */}
        <div className="bg-slate-900 rounded-lg p-3 font-mono text-center text-lg leading-relaxed">
          {emojiGrid.split('\n').map((row, i) => (
            <div key={i}>{row}</div>
          ))}
        </div>
        
        {/* Share buttons row */}
        <div className="flex gap-2">
          <Button
            onClick={copyToClipboard}
            className="flex-1 bg-slate-700 hover:bg-slate-600"
            size="sm"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button
            onClick={shareNative}
            className="flex-1 bg-purple-600 hover:bg-purple-500"
            size="sm"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Full share card preview */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="text-xl font-bold">
            {gameEmoji} RIZZ: {gameName}
          </div>
          <div className="text-2xl font-black mt-1">
            {score}/{total} ({percentage}%) {tierEmoji}
          </div>
          <div className="text-sm text-slate-400 italic">"{tierName}"</div>
        </div>

        {/* Emoji Grid */}
        <div className="bg-slate-950/50 rounded-lg p-4 font-mono text-center text-xl leading-relaxed tracking-wider">
          {emojiGrid.split('\n').map((row, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {row}
            </motion.div>
          ))}
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="text-center mt-3 text-orange-400 font-bold">
            🔥 {streak} streak
          </div>
        )}

        {/* Branding */}
        <div className="text-center mt-3 text-slate-500 text-sm">
          🎮 rizz.game
        </div>
      </div>

      {/* Share buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={copyToClipboard}
          className="bg-slate-700 hover:bg-slate-600 h-12"
        >
          <Copy className="w-5 h-5 mr-2" />
          Copy Result
        </Button>
        
        <Button
          onClick={shareNative}
          className="bg-purple-600 hover:bg-purple-500 h-12"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share
        </Button>

        <Button
          onClick={shareToTwitter}
          variant="outline"
          className="border-slate-600 hover:bg-slate-800"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter/X
        </Button>

        <Button
          onClick={shareToWhatsApp}
          variant="outline"
          className="border-slate-600 hover:bg-slate-800"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
      </div>
    </motion.div>
  );
}

// Hook to track answers during gameplay
export function useAnswerTracking() {
  const [answers, setAnswers] = React.useState([]);

  const recordAnswer = (isCorrect) => {
    setAnswers(prev => [...prev, isCorrect]);
  };

  const resetAnswers = () => {
    setAnswers([]);
  };

  return { answers, recordAnswer, resetAnswers };
}