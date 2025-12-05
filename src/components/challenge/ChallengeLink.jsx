import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Copy, Check, Share2, Twitter, MessageCircle, Send } from 'lucide-react';
import { GAMES } from '@/components/constants/games';

export default function ChallengeLink({ 
  challengeCode, 
  gameId, 
  score, 
  percentage,
  tierName 
}) {
  const [copied, setCopied] = useState(false);
  const game = GAMES[gameId];
  
  const challengeUrl = `${window.location.origin}/#/Challenge?code=${challengeCode}`;
  
  const shareText = `🔥 I challenge you to beat my ${percentage}% on ${game?.title}!\n\n${tierName} achieved. Think you can do better?\n\n`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(challengeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `RIZZ Challenge - ${game?.title}`,
        text: shareText,
        url: challengeUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(shareText + challengeUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(shareText + challengeUrl);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegram = () => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(challengeUrl);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-purple-400" />
        <span className="font-bold">Share Challenge Link</span>
      </div>

      {/* URL Box */}
      <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-3 mb-4">
        <input
          type="text"
          value={challengeUrl}
          readOnly
          className="flex-1 bg-transparent text-sm text-slate-300 outline-none truncate"
        />
        <button
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-purple-600 hover:bg-purple-500 text-white'
          }`}
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4" />
              Copied!
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="w-4 h-4" />
              Copy
            </span>
          )}
        </button>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
        >
          <Share2 className="w-5 h-5 text-purple-400" />
          <span className="text-xs">Share</span>
        </button>
        
        <button
          onClick={handleTwitter}
          className="flex flex-col items-center gap-1 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
        >
          <Twitter className="w-5 h-5 text-blue-400" />
          <span className="text-xs">Twitter</span>
        </button>
        
        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-1 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-green-400" />
          <span className="text-xs">WhatsApp</span>
        </button>
        
        <button
          onClick={handleTelegram}
          className="flex flex-col items-center gap-1 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
        >
          <Send className="w-5 h-5 text-blue-300" />
          <span className="text-xs">Telegram</span>
        </button>
      </div>

      {/* Challenge Preview */}
      <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
        <p className="text-xs text-slate-400 mb-1">Challenge Preview:</p>
        <p className="text-sm text-slate-300">
          Beat my <span className="font-bold text-purple-400">{percentage}%</span> on{' '}
          <span className="font-bold">{game?.title}</span> {game?.icon}
        </p>
      </div>
    </div>
  );
}