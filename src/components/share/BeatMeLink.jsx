import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share2, MessageCircle, Send, Twitter } from 'lucide-react';
import { GAMES, getTier } from '@/components/constants/games';

export default function BeatMeLink({ gameId, score, percentage, userName }) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const game = GAMES[gameId];
  const tier = getTier(gameId, percentage);
  
  // Generate unique challenge link
  const challengeCode = `${gameId}-${percentage}-${Date.now().toString(36)}`;
  const BASE_URL = import.meta.env.VITE_APP_URL || window.location.origin;
  const shareUrl = `${BASE_URL}/#/Challenge?code=${challengeCode}&game=${gameId}&score=${percentage}`;
  
  // Create emoji grid for visual appeal
  const emojiGrid = Array(10).fill(null).map((_, i) => 
    i < Math.round(percentage / 10) ? '🟩' : '⬜'
  ).join('');
  
  // Generate shareable text
  const shareText = `${game?.icon || '🎮'} GenRizz: ${game?.title}

${tier.emoji} ${tier.name}
${emojiGrid}
${percentage}% · ${score}/10

🔥 Can you beat me?
${shareUrl}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Beat my ${percentage}% on ${game?.title}!`,
        text: shareText,
        url: shareUrl,
      });
    } else {
      copyLink();
    }
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToiMessage = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTikTok = () => {
    // TikTok doesn't have direct share API, so we copy and open TikTok
    navigator.clipboard.writeText(shareText);
    window.open('https://www.tiktok.com/upload', '_blank');
  };

  return (
    <div className="space-y-3">
      {/* Main CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowOptions(!showOptions)}
        className="btn-3d btn-3d-pink w-full py-4 text-lg flex items-center justify-center gap-3"
      >
        <Share2 className="w-5 h-5" />
        🔥 Challenge Friends to Beat {percentage}%
      </motion.button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Preview Card */}
            <div className="card-3d p-4 bg-[#F7F4F0]">
              <p className="text-xs text-[#AFAFAF] font-semibold mb-2">SHARE PREVIEW</p>
              <pre className="text-xs text-[#3C3C3C] font-mono whitespace-pre-wrap break-all">
                {shareText.slice(0, 150)}...
              </pre>
            </div>

            {/* Share Buttons Grid */}
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareToWhatsApp}
                className="btn-3d py-3 flex items-center justify-center gap-2 text-sm"
                style={{ background: '#25D366', color: 'white', boxShadow: '0 3px 0 #1DA851' }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareToiMessage}
                className="btn-3d py-3 flex items-center justify-center gap-2 text-sm"
                style={{ background: '#34C759', color: 'white', boxShadow: '0 3px 0 #28A745' }}
              >
                <Send className="w-4 h-4" />
                iMessage
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareToTelegram}
                className="btn-3d py-3 flex items-center justify-center gap-2 text-sm"
                style={{ background: '#0088CC', color: 'white', boxShadow: '0 3px 0 #006699' }}
              >
                <Send className="w-4 h-4" />
                Telegram
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareToTwitter}
                className="btn-3d py-3 flex items-center justify-center gap-2 text-sm"
                style={{ background: '#1DA1F2', color: 'white', boxShadow: '0 3px 0 #0C85D0' }}
              >
                <Twitter className="w-4 h-4" />
                Twitter/X
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareToTikTok}
                className="btn-3d py-3 flex items-center justify-center gap-2 text-sm col-span-2"
                style={{ background: '#000000', color: 'white', boxShadow: '0 3px 0 #333333' }}
              >
                <span className="text-lg">🎵</span>
                TikTok (Copy & Post)
              </motion.button>
            </div>

            {/* Copy Link */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={copyLink}
              className="btn-3d btn-3d-ghost w-full py-3 flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#58CC02]" />
                  <span className="text-[#58CC02]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </motion.button>

            {/* Native Share (mobile) */}
            {navigator.share && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareNative}
                className="btn-3d btn-3d-blue w-full py-3 flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                More Options...
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}