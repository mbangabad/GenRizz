import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, Twitter, MessageCircle, Users } from 'lucide-react';
import { Challenge } from '@/api/entities';

export default function ChallengeButton({ 
  gameId, 
  score, 
  percentage, 
  userId, 
  userName,
  compact = false 
}) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [challengeCode, setChallengeCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateChallenge = async () => {
    setLoading(true);
    const code = `${gameId.slice(0, 3).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;
    
    try {
      await Challenge.create({
        challenger_id: userId,
        challenger_name: userName,
        game_id: gameId,
        challenger_score: score,
        challenger_percentage: percentage,
        challenge_code: code,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setChallengeCode(code);
    } catch (e) {
      setChallengeCode(code); // Still show code even if save fails
    }
    setLoading(false);
    setShowModal(true);
  };

  const challengeUrl = `${window.location.origin}/#/Challenge?code=${challengeCode}`;
  
  const shareText = `🔥 Can you beat my ${percentage}% on GenRizz?\n\nI challenge you! 👊\n\n${challengeUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(challengeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'GenRizz Challenge', text: shareText, url: challengeUrl });
      } catch (e) {}
    }
  };

  if (compact) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateChallenge}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
        >
          <Users className="w-4 h-4" />
          Challenge
        </motion.button>

        <ChallengeModal 
          show={showModal} 
          onClose={() => setShowModal(false)}
          challengeUrl={challengeUrl}
          percentage={percentage}
          copied={copied}
          onCopy={handleCopy}
          onWhatsApp={handleWhatsApp}
          onTwitter={handleTwitter}
          onNativeShare={handleNativeShare}
        />
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateChallenge}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200"
      >
        <Users className="w-6 h-6" />
        {loading ? 'Creating...' : 'Challenge a Friend'}
      </motion.button>

      <ChallengeModal 
        show={showModal} 
        onClose={() => setShowModal(false)}
        challengeUrl={challengeUrl}
        percentage={percentage}
        copied={copied}
        onCopy={handleCopy}
        onWhatsApp={handleWhatsApp}
        onTwitter={handleTwitter}
        onNativeShare={handleNativeShare}
      />
    </>
  );
}

function ChallengeModal({ show, onClose, challengeUrl, percentage, copied, onCopy, onWhatsApp, onTwitter, onNativeShare }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">👊</div>
              <h2 className="text-2xl font-black text-gray-900">Challenge Sent!</h2>
              <p className="text-gray-500 mt-1">Dare your friends to beat {percentage}%</p>
            </div>

            {/* Link Box */}
            <div className="bg-gray-100 rounded-xl p-3 mb-4 flex items-center gap-2">
              <input 
                type="text" 
                value={challengeUrl} 
                readOnly 
                className="flex-1 bg-transparent text-sm text-gray-600 outline-none truncate"
              />
              <button 
                onClick={onCopy}
                className="p-2 bg-white rounded-lg shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onWhatsApp}
                className="flex flex-col items-center gap-1 p-3 bg-green-50 rounded-xl hover:bg-green-100"
              >
                <MessageCircle className="w-6 h-6 text-green-600" />
                <span className="text-xs font-medium text-green-700">WhatsApp</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onTwitter}
                className="flex flex-col items-center gap-1 p-3 bg-blue-50 rounded-xl hover:bg-blue-100"
              >
                <Twitter className="w-6 h-6 text-blue-500" />
                <span className="text-xs font-medium text-blue-700">Twitter</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNativeShare}
                className="flex flex-col items-center gap-1 p-3 bg-purple-50 rounded-xl hover:bg-purple-100"
              >
                <Share2 className="w-6 h-6 text-purple-500" />
                <span className="text-xs font-medium text-purple-700">More</span>
              </motion.button>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}