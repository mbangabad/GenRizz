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
          className="w-11 h-11 flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--brand-green)', color: 'var(--text-inverse)' }}
        >
          <MessageCircle className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNativeShare}
          className="w-11 h-11 flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--text-inverse)' }}
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="w-11 h-11 flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--surface-3)', color: 'var(--text-secondary)' }}
        >
          {copied ? <Check className="w-5 h-5" style={{ color: 'var(--brand-green)' }} /> : <Copy className="w-5 h-5" />}
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
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors" style={{ backgroundColor: 'rgba(88, 204, 2, 0.1)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-green)' }}>
            <MessageCircle className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
          </div>
          <span className="text-xs font-bold" style={{ color: 'var(--brand-green)' }}>WhatsApp</span>
        </motion.button>

        {/* iMessage/SMS */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleiMessage}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors" style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#34C759' }}>
            <Smartphone className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
          </div>
          <span className="text-xs font-bold" style={{ color: '#34C759' }}>iMessage</span>
        </motion.button>

        {/* Twitter/X */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTwitter}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors" style={{ backgroundColor: 'rgba(29, 161, 242, 0.1)' }}
        >
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Twitter className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
          </div>
          <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>X</span>
        </motion.button>

        {/* Telegram */}
        {showAll && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTelegram}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors" style={{ backgroundColor: 'rgba(0, 136, 204, 0.1)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0088CC' }}>
              <Send className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#0088CC' }}>Telegram</span>
          </motion.button>
        )}

        {/* TikTok */}
        {showAll && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTikTok}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
          >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <span className="text-lg">🎵</span>
            </div>
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>TikTok</span>
          </motion.button>
        )}

        {/* Copy Link */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors" style={{ backgroundColor: 'var(--surface-3)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--text-secondary)' }}>
            {copied ? <Check className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} /> : <Copy className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />}
          </div>
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{copied ? 'Copied!' : 'Copy'}</span>
        </motion.button>
      </div>
    </div>
  );
}