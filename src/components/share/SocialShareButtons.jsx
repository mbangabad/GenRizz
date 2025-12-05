import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Twitter, MessageCircle, Send, Smartphone } from 'lucide-react';

export default function SocialShareButtons({ 
  shareText, 
  shareUrl, 
  title = "Share", 
  compact = false,
  showAll = false 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl || shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = shareUrl ? `${shareText}\n\n${shareUrl}` : shareText;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTwitter = () => {
    const text = shareUrl ? `${shareText}\n\n${shareUrl}` : shareText;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTelegram = () => {
    const text = shareUrl ? `${shareText}\n\n${shareUrl}` : shareText;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl || '')}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleiMessage = () => {
    const text = shareUrl ? `${shareText}\n\n${shareUrl}` : shareText;
    window.open(`sms:?&body=${encodeURIComponent(text)}`, '_self');
  };

  const handleTikTok = async () => {
    const text = shareUrl ? `${shareText}\n\n${shareUrl}` : shareText;
    await navigator.clipboard.writeText(text);
    window.open('https://www.tiktok.com/upload', '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: title, 
          text: shareText, 
          url: shareUrl 
        });
      } catch (e) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  if (compact) {
    return (
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsApp}
          className="w-11 h-11 flex items-center justify-center bg-[#25D366] text-white rounded-xl"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNativeShare}
          className="w-11 h-11 flex items-center justify-center bg-[#3C3C3C] text-white rounded-xl"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="w-11 h-11 flex items-center justify-center bg-[#E8E4DF] text-[#777777] rounded-xl"
        >
          {copied ? <Check className="w-5 h-5 text-[#58CC02]" /> : <Copy className="w-5 h-5" />}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Share Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNativeShare}
        className="w-full btn-3d btn-3d-green py-4 flex items-center justify-center gap-2"
      >
        <Share2 className="w-5 h-5" />
        Share Result
      </motion.button>

      {/* Social Grid */}
      <div className={`grid ${showAll ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-4'} gap-2`}>
        {/* WhatsApp - Most Important */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold text-[#25D366]">WhatsApp</span>
        </motion.button>

        {/* iMessage/SMS */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleiMessage}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#34C759]/10 hover:bg-[#34C759]/20 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#34C759] flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold text-[#34C759]">iMessage</span>
        </motion.button>

        {/* Twitter/X */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTwitter}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#000000] flex items-center justify-center">
            <Twitter className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold text-[#3C3C3C]">X</span>
        </motion.button>

        {/* Telegram */}
        {showAll && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTelegram}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0088CC]/10 hover:bg-[#0088CC]/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#0088CC] flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-[#0088CC]">Telegram</span>
          </motion.button>
        )}

        {/* TikTok */}
        {showAll && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTikTok}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-black/5 hover:bg-black/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <span className="text-lg">🎵</span>
            </div>
            <span className="text-xs font-bold text-[#3C3C3C]">TikTok</span>
          </motion.button>
        )}

        {/* Copy Link */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#E8E4DF] hover:bg-[#D4CFC7] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#777777] flex items-center justify-center">
            {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
          </div>
          <span className="text-xs font-bold text-[#777777]">{copied ? 'Copied!' : 'Copy'}</span>
        </motion.button>
      </div>
    </div>
  );
}