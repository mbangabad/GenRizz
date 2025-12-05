import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Share2, RotateCcw, Home, Zap, Swords, TrendingUp, Flame, Clock, Copy, Twitter, MessageCircle } from 'lucide-react';
import { GAMES, getTier, getGameLevel, getXpProgress, calculateXpEarned } from '../constants/games';
import CreateChallengeModal from '../challenge/CreateChallengeModal';
import { Notification } from '@/api/entities';
import Confetti from '@/components/ui/Confetti';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import EmojiResultGrid from '@/components/share/EmojiResultGrid';
import CompareWithFriends from '@/components/viral/CompareWithFriends';
import { SharePrompt } from '@/components/viral/ViralPrompts';
import ShareComparePrompt from '@/components/share/ShareComparePrompt';
import { motion } from 'framer-motion';

export default function ResultsCard({ gameId, score, totalQuestions, userLevel, previousBest, onPlayAgain, user, totalXp = 0, maxStreak = 0, timeBonus = 0, answers = [] }) {
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSharePrompt, setShowSharePrompt] = useState(true);
  const game = GAMES[gameId];
  const percentage = Math.round((score / totalQuestions) * 100);
  const tier = getTier(gameId, percentage);
  const isNewBest = percentage > (previousBest || 0);
  
  // userLevel is now the full level object from Gameplay
  const currentLevelNum = userLevel?.level || 1;
  let xpEarned = calculateXpEarned(percentage, currentLevelNum);
  // Add streak and time bonuses
  const streakBonus = maxStreak * 2;
  xpEarned += streakBonus + timeBonus;

  // Show confetti on good results
  useEffect(() => {
    if (percentage >= 70) {
      setShowConfetti(true);
    }
  }, [percentage]);
  
  const newTotalXp = totalXp + xpEarned;
  const previousLevel = getGameLevel(totalXp);
  const newLevel = getGameLevel(newTotalXp);
  const leveledUp = newLevel.level > previousLevel.level;
  const xpProgress = getXpProgress(newTotalXp);

  // Create level-up notification if leveled up
  React.useEffect(() => {
    if (leveledUp && user?.id) {
      Notification.create({
        user_id: user.id,
        type: 'level_up',
        title: `Level Up! ${newLevel.emoji}`,
        message: `You reached Level ${newLevel.level}: ${newLevel.title} in ${game.title}!`,
        action_url: createPageUrl('Profile'),
      }).catch(() => {});
    }
  }, [leveledUp, user?.id]);

  // Create new record notification
  React.useEffect(() => {
    if (isNewBest && user?.id && percentage > 0) {
      Notification.create({
        user_id: user.id,
        type: 'new_record',
        title: 'New Personal Best! 🏆',
        message: `You scored ${percentage}% on ${game.title}!`,
        action_url: createPageUrl('Profile'),
      }).catch(() => {});
    }
  }, [isNewBest, user?.id]);

  const handleShare = async () => {
    const text = `I got ${tier.name} ${tier.emoji} on ${game.title}!\n\nScore: ${score}/${totalQuestions} (${percentage}%)\n\n"${tier.message}"\n\nCan you beat me? 🔥`;
    if (navigator.share) {
      await navigator.share({ title: `Roast Yourself - ${game.title}`, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <>
    <Confetti trigger={showConfetti} duration={3000} />
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="card p-8 text-center animate-bounce-in">
        {/* Tier Emoji */}
        <div className="relative mb-6">
          <div className="game-icon-lg mx-auto animate-float" style={{ background: game.color }}>
            {tier.emoji}
          </div>
          {isNewBest && (
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center animate-pulse-glow"
                 style={{ background: 'var(--accent-yellow)' }}>
              🏆
            </div>
          )}
        </div>

        {/* Tier Name */}
        <h1 className="text-3xl font-black text-white mb-2">{tier.name}</h1>
        
        {/* Score */}
        <div className="mb-4">
          <AnimatedCounter 
            value={score} 
            className="text-6xl font-black" 
            duration={1} 
          />
          <span className="text-2xl text-[var(--text-muted)]" style={{ color: game.color }}>/{totalQuestions}</span>
          <p className="text-xl text-[var(--text-secondary)] mt-1">
            <AnimatedCounter value={percentage} suffix="%" duration={1.2} />
          </p>
        </div>

        {/* Message */}
        <div className="card-elevated p-4 mb-6">
          <p className="text-[var(--text-secondary)] italic">"{tier.message}"</p>
        </div>

        {/* Level Up Celebration */}
        {leveledUp && (
          <div className="p-4 rounded-xl mb-6 border-2 border-yellow-500/50 animate-bounce-in" 
               style={{ background: 'linear-gradient(135deg, rgba(255, 200, 0, 0.2), rgba(255, 150, 0, 0.15))' }}>
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-yellow-400 font-black text-lg mb-1">LEVEL UP!</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{newLevel.emoji}</span>
              <span className="font-bold text-white">{newLevel.title}</span>
            </div>
            <p className="text-sm text-yellow-200/80 italic">"{newLevel.roast}"</p>
            {newLevel.unlock && (
              <div className="mt-3 px-3 py-1 bg-yellow-500/20 rounded-full inline-block">
                <p className="text-xs text-yellow-300">🔓 Unlocked: {newLevel.unlock}</p>
              </div>
            )}
          </div>
        )}

        {/* XP Earned */}
        <div className="p-4 rounded-xl mb-6" style={{ background: 'linear-gradient(135deg, rgba(0, 206, 209, 0.15), rgba(100, 255, 218, 0.1))' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00CED1]" />
              <span className="font-bold text-white">+{xpEarned} XP</span>
              {newLevel.xpMultiplier > 1 && (
                <span className="text-xs text-[#00CED1]">({Math.round((newLevel.xpMultiplier - 1) * 100)}% bonus!)</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">{newLevel.emoji}</span>
              <span className="text-xs text-white/40">Lvl {newLevel.level}</span>
            </div>
          </div>
          {xpProgress.nextLevel && (
            <>
              <div className="progress-bar h-3">
                <div className="progress-fill-xp" style={{ width: `${xpProgress.progress}%` }} />
              </div>
              <p className="text-[10px] text-white/40 mt-1">
                {xpProgress.current}/{xpProgress.needed} XP to {xpProgress.nextLevel.emoji} {xpProgress.nextLevel.title}
              </p>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="stat-card">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" style={{ color: isNewBest ? '#4ADE80' : '#6B6B6B' }} />
            <p className="font-bold text-white text-sm">{isNewBest ? 'NEW!' : `${previousBest || 0}%`}</p>
            <p className="text-[10px] text-white/40">{isNewBest ? 'Record' : 'Previous'}</p>
          </div>
          <div className="stat-card">
            <span className="text-lg mb-1">{newLevel.emoji}</span>
            <p className="font-bold text-white text-sm capitalize">{newLevel.difficulty}</p>
            <p className="text-[10px] text-white/40">Difficulty</p>
          </div>
          <div className="stat-card">
            <Zap className="w-5 h-5 mx-auto mb-1 text-[#00CED1]" />
            <p className="font-bold text-white text-sm">+{xpEarned}</p>
            <p className="text-[10px] text-white/40">XP</p>
          </div>
        </div>

        {/* Streak & Time Bonus */}
        {(maxStreak >= 3 || timeBonus > 0) && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {maxStreak >= 3 && (
              <div className="p-3 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/30">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-[#FF6B35]" />
                  <span className="font-bold text-[#FF6B35]">{maxStreak}x Streak</span>
                </div>
                <p className="text-xs text-[#FF8F6B]">+{streakBonus} XP</p>
              </div>
            )}
            {timeBonus > 0 && (
              <div className="p-3 rounded-xl bg-[#00CED1]/10 border border-[#00CED1]/30">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-[#00CED1]" />
                  <span className="font-bold text-[#00CED1]">Speed Bonus</span>
                </div>
                <p className="text-xs text-[#64FFDA]">+{timeBonus} XP</p>
              </div>
            )}
          </div>
        )}

        {isNewBest && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-[#FFE066]/20 border-2 border-[#FFE066]">
            <span>🏆</span>
            <span className="font-bold text-sm text-[#FFE066]">New Personal Best!</span>
          </div>
        )}

        {/* Wordle-style Emoji Grid Share */}
        {answers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <p className="text-sm text-white/50 mb-3 text-center">📊 Share your result grid!</p>
            <EmojiResultGrid
              answers={answers}
              gameName={game.title}
              gameEmoji={game.icon}
              score={score}
              total={totalQuestions}
              percentage={percentage}
              tierName={tier.name}
              tierEmoji={tier.emoji}
              streak={maxStreak}
              compact={false}
            />
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-6">
        {user && (
          <button onClick={() => setShowChallengeModal(true)} className="btn btn-orange w-full py-4 text-base flex items-center justify-center gap-2">
            <Swords className="w-5 h-5" />
            Challenge a Friend
          </button>
        )}

        {answers.length === 0 && (
          <button onClick={handleShare} className="btn btn-blue w-full py-4 text-base flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        )}

        <button onClick={onPlayAgain} className="btn btn-secondary w-full py-4 text-base flex items-center justify-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>

        {/* Compare with Friends */}
        {user && (
          <CompareWithFriends
            gameId={gameId}
            userScore={percentage}
            userName={user.full_name}
          />
        )}

        <Link to={createPageUrl('Home')} className="block">
          <button className="btn btn-secondary w-full py-4 text-base flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Back to Games
          </button>
        </Link>
      </div>

      {/* Share Prompt */}
      {showSharePrompt && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SharePrompt
            percentage={percentage}
            tierName={tier.name}
            gameName={game.title}
            onShare={handleShare}
            onDismiss={() => setShowSharePrompt(false)}
          />
        </motion.div>
      )}

      {user && (
        <CreateChallengeModal 
          isOpen={showChallengeModal}
          onClose={() => setShowChallengeModal(false)}
          user={user}
          preSelectedGame={gameId}
          preSelectedScore={{ score, percentage, tier_name: tier.name }}
        />
      )}

      {/* Floating Share Compare Prompt */}
      <ShareComparePrompt
        gameId={gameId}
        percentage={percentage}
        score={score}
        totalQuestions={totalQuestions}
        showAfterDelay={3000}
      />
    </div>
    </>
  );
}