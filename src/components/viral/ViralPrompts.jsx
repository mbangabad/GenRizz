import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Users, Trophy, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GAMES, getTier } from '@/components/constants/games';

// Contextual share prompts based on performance
export function SharePrompt({ percentage, tierName, gameName, onShare, onDismiss }) {
  const getPromptConfig = () => {
    if (percentage >= 90) {
      return {
        emoji: '🏆',
        title: 'Legendary Score!',
        subtitle: 'Your friends NEED to see this flex',
        cta: 'Show Off',
        color: 'from-yellow-500 to-orange-500',
      };
    } else if (percentage >= 70) {
      return {
        emoji: '🔥',
        title: 'That was fire!',
        subtitle: 'Challenge your friends to beat this',
        cta: 'Send Challenge',
        color: 'from-orange-500 to-red-500',
      };
    } else if (percentage >= 50) {
      return {
        emoji: '😏',
        title: 'Not bad...',
        subtitle: 'But can your friends do better?',
        cta: 'Find Out',
        color: 'from-purple-500 to-pink-500',
      };
    } else {
      return {
        emoji: '💀',
        title: 'Humbling...',
        subtitle: 'Share your L and challenge friends',
        cta: 'Share the Pain',
        color: 'from-slate-600 to-slate-700',
      };
    }
  };

  const config = getPromptConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${config.color} rounded-xl p-4 text-white`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{config.emoji}</span>
        <div className="flex-1">
          <h3 className="font-bold">{config.title}</h3>
          <p className="text-sm opacity-90">{config.subtitle}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button
          onClick={onShare}
          className="flex-1 bg-white/20 hover:bg-white/30 text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {config.cta}
        </Button>
        <Button
          onClick={onDismiss}
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          Later
        </Button>
      </div>
    </motion.div>
  );
}

// Floating share button that appears after results
export function FloatingShareButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 flex items-center justify-center z-40"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Share2 className="w-6 h-6 text-white" />
    </motion.button>
  );
}

// Challenge friends inline prompt
export function ChallengeFriendsPrompt({ gameId, score, onChallenge }) {
  const game = GAMES[gameId];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: game?.color }}>
          <Users className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Think you're smart?</p>
          <p className="text-xs text-slate-400">See if friends can beat {score}%</p>
        </div>
        <Button size="sm" onClick={onChallenge} className="bg-purple-600">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// "Your friends scored" teaser for returning users
export function FriendScoreTeaser({ friendName, friendScore, gameId, onPlay }) {
  const game = GAMES[gameId];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">{friendName} scored {friendScore}%</p>
          <p className="text-xs text-slate-400">on {game?.title}</p>
        </div>
        <Button size="sm" onClick={onPlay} className="bg-purple-600">
          Beat It
        </Button>
      </div>
    </motion.div>
  );
}

// Social proof notification
export function SocialProofToast({ count, gameName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-20 left-4 right-4 bg-slate-800 rounded-xl p-3 border border-slate-700 shadow-xl z-50 flex items-center gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-green-400" />
      </div>
      <p className="text-sm flex-1">
        <span className="font-bold text-green-400">{count}</span> people are playing {gameName} right now
      </p>
    </motion.div>
  );
}

// Achievement unlock animation
export function AchievementUnlock({ achievement, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: -50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -50 }}
      className="fixed top-20 left-4 right-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-4 shadow-xl z-50"
      onClick={onDismiss}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1 }}
          className="text-4xl"
        >
          🏆
        </motion.div>
        <div>
          <p className="font-bold text-white">Achievement Unlocked!</p>
          <p className="text-sm text-white/80">{achievement.name}</p>
        </div>
        <div className="ml-auto">
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            +{achievement.xp} XP
          </span>
        </div>
      </div>
    </motion.div>
  );
}