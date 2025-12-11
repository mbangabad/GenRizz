import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { UserProgress, UserStreak, Question, Score, ConnectionPuzzle, SquadMember, Squad } from '@/api/entities';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES, getTier, getGameLevel, getXpProgress, calculateXpEarned } from '@/components/constants/games';
import { getQuestionsForGame } from '@/components/constants/questions';
import { ArrowLeft, Play, Loader2, Zap, Home, Clock, Crown, CheckCircle, X, Rocket, Eye, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareableResultCard from '@/components/share/ShareableResultCard';
import ImageQuestion from '@/components/game/ImageQuestion';
import AudioQuestion from '@/components/game/AudioQuestion';
import SwipeQuestion from '@/components/game/SwipeQuestion';
import MatchingQuestion from '@/components/game/MatchingQuestion';
import RankingQuestion from '@/components/game/RankingQuestion';
import ScenarioSwipe from '@/components/game/ScenarioSwipe';
import WouldYouRather from '@/components/game/WouldYouRather';
import GameIcon from '@/components/home/GameIcon';
// Mascot removed for Modern Minimal design
import PowerUpsBar from '@/components/game/PowerUpsBar';
import Confetti from '@/components/ui/Confetti';
import SocialShareButtons from '@/components/share/SocialShareButtons';
import FriendScoreComparison from '@/components/results/FriendScoreComparison';
import ShareComparePrompt from '@/components/share/ShareComparePrompt';
import SoundToggleButton, { playSound } from '@/components/ui/SoundToggleButton';
import BeatMeLink from '@/components/share/BeatMeLink';
import AIRoast from '@/components/viral/AIRoast';
import RematchButton from '@/components/results/RematchButton';
import FriendBeatNotification from '@/components/notifications/FriendBeatNotification';
import RematchLinkBar from '@/components/share/RematchLinkBar';
import { buildRematchLink, createRematchChallenge, parseRematchParams, recordRematchResult } from '@/services/rematch';
import ConnectionBoard from '@/components/game/mechanics/ConnectionBoard';
import TimelineDraggable from '@/components/game/mechanics/TimelineDraggable';
import VibeCheckSwipe from '@/components/game/mechanics/VibeCheckSwipe';
import { GAME_MODES as CORE_GAME_MODES, getRenderer, renderByMode } from '@/game-core';
import { isFlagEnabled, getFlags } from '@/services/flags';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Celebration from '@/components/ui/Celebration';
import CompletionAnimation from '@/components/ui/CompletionAnimation';
import { emitEvent, emitError } from '@/services/telemetry';
import { hapticSuccess, hapticError, hapticStreak, hapticLevelUp } from '@/utils/haptic';

const GAME_MODES = {
  STANDARD: { questions: 10, label: 'Standard', icon: '📝', time: null },
  QUICK: { questions: 5, label: 'Quick', icon: '⚡', time: 60 },
  BLITZ: { questions: 10, label: 'Blitz', icon: '🔥', time: 90, flag: 'BLITZ' },
};

function ProgressBar3D({ current, total }) {
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(current / total) * 100}%` }}
        className="h-full bg-slate-900 rounded-full"
      />
    </div>
  );
}

function ModeSelector({ selectedMode, onSelectMode }) {
  const flags = getFlags();
  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.entries(GAME_MODES)
        .filter(([key, mode]) => {
          if (mode.flag && !flags[mode.flag]) return false;
          return true;
        })
        .map(([key, mode]) => (
          <button
            key={key}
            onClick={() => onSelectMode(key)}
            className={`p-4 rounded-xl text-center transition-all border ${
              selectedMode === key 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-2xl">{mode.icon}</span>
            <p className="font-bold text-sm mt-2">{mode.label}</p>
            <p className={`text-xs font-medium mt-1 ${selectedMode === key ? 'text-slate-300' : 'text-slate-500'}`}>
              {mode.questions}Q {mode.time ? `· ${mode.time}s` : ''}
            </p>
          </button>
        ))}
    </div>
  );
}

function QuestionTimer3D({ timeLeft }) {
  const color = timeLeft <= 5 ? '#FF4B4B' : timeLeft <= 10 ? '#FFC800' : '#58CC02';
  
  return (
    <motion.div 
      animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
      className="badge-3d"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, boxShadow: `0 2px 0 ${color}80`, color: 'white' }}
    >
      <Clock className="w-4 h-4" />
      <span className="font-black">{timeLeft}s</span>
    </motion.div>
  );
}

function QuestionCard3D({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  gameColor, 
  timedMode, 
  streak,
  quickMode = false,
  hiddenOptions = [],
  showHint = false,
  bonusTime = 0
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const baseTime = quickMode ? 10 : 15;
  const [timeLeft, setTimeLeft] = useState(baseTime + bonusTime);
  const [shakeScreen, setShakeScreen] = useState(false);

  useEffect(() => {
    setSelectedIndex(null);
    setShowResult(false);
    setTimeLeft(baseTime + bonusTime);
    setShakeScreen(false);
  }, [question.id || question.question, quickMode, bonusTime]);

  useEffect(() => {
    if (!timedMode || showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSelect(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timedMode, showResult, question]);

  const handleSelect = (index) => {
    if (showResult) return;
    
    setSelectedIndex(index);
    setShowResult(true);
    
    const isCorrect = index === question.correct_index;
    
    // Screen shake on wrong answer
    if (!isCorrect && index !== -1) {
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 400);
    }
    
    setTimeout(() => {
      onAnswer(isCorrect, timeLeft);
    }, quickMode ? 600 : 1200);
  };

  return (
    <motion.div 
      className="space-y-4"
      animate={shakeScreen ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#777777]">
          {questionNumber} / {totalQuestions}
        </span>
        {timedMode && <QuestionTimer3D timeLeft={timeLeft} />}
      </div>

      <ProgressBar3D current={questionNumber} total={totalQuestions} color={gameColor} />

      {streak >= 2 && (
        <motion.div
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <div className="badge-3d badge-streak">
            <span>🔥</span>
            <span>{streak} streak!</span>
            {streak >= 5 && <span className="text-xs ml-1">3x</span>}
            {streak >= 3 && streak < 5 && <span className="text-xs ml-1">2x</span>}
          </div>
        </motion.div>
      )}

      <motion.div
        key={question.question}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-3d p-6"
      >
        <h2 className="text-xl font-black text-[#3C3C3C] text-center leading-relaxed">
          {question.question}
        </h2>
      </motion.div>

      {/* Show hint if active */}
      {showHint && question.explanation && !showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-3d card-3d-green p-3"
        >
          <p className="text-sm text-[#3C3C3C] font-semibold">💡 Hint: {question.explanation}</p>
        </motion.div>
      )}

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correct_index;
          const isSelected = selectedIndex === index;
          const isHidden = hiddenOptions.includes(index);
          
          // Skip hidden options (50/50)
          if (isHidden && !showResult) return null;
          
          let optionClass = 'answer-3d';
          if (showResult) {
            if (isCorrect) optionClass = 'answer-3d correct';
            else if (isSelected) optionClass = 'answer-3d incorrect';
            else optionClass = 'answer-3d dimmed';
          } else if (isSelected) {
            optionClass = 'answer-3d selected';
          }

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isHidden ? 0 : 1, x: 0, scale: showResult && isCorrect ? [1, 1.02, 1] : 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(index)}
              disabled={showResult || isHidden}
              className={`w-full ${optionClass}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${
                  showResult && isCorrect
                    ? 'bg-[#58CC02] text-white'
                    : showResult && isSelected
                      ? 'bg-[#FF4B4B] text-white'
                      : 'bg-[#E8E4DF] text-[#777777]'
                }`}>
                  {showResult && isCorrect ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : showResult && isSelected ? (
                    <X className="w-5 h-5" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span className="flex-1 text-[#3C3C3C] font-semibold text-left">{option}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {!quickMode && (
        <AnimatePresence>
          {showResult && question.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`card-3d p-4 ${
                selectedIndex === question.correct_index ? 'card-3d-green' : 'card-3d-blue'
              }`}
            >
              <p className="text-sm text-[#3C3C3C] font-semibold">💡 {question.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function ResultsCard3D({ 
  gameId, 
  score, 
  totalQuestions, 
  effectiveQuestions = null,
  userLevel, 
  previousBest, 
  onPlayAgain, 
  user, 
  maxStreak,
  streak,
  challengeData = null,
  rematchEnabled = false,
  onRematch,
  finalPercentage = null,
  endReason = 'complete',
}) {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const game = GAMES[gameId];
  const denominator = Math.max(effectiveQuestions || totalQuestions, 1);
  const percentage = finalPercentage !== null ? finalPercentage : Math.round((score / denominator) * 100);
  const tier = getTier(gameId, percentage);
  const xpEarned = calculateXpEarned(percentage, userLevel.level) + (maxStreak * 2);
  const isNewBest = !previousBest || percentage > previousBest;
  const percentile = Math.min(95, Math.max(5, percentage + Math.floor(Math.random() * 10)));
  const endNote = endReason === 'timer' ? '⏱️ Time\'s up — score based on answered questions.' : null;

  // Trigger confetti and celebration sound on good scores
  React.useEffect(() => {
    if (percentage >= 70) {
      setShowConfetti(true);
      playSound('celebration');
    }
  }, [percentage]);

  // HIGH PRIORITY FIX: Use environment variable for share URL
  const appBaseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  // Generate share text
  const shareText = `${game?.icon || '🎮'} GenRizz: ${game?.title}\n\n${tier.emoji} ${tier.name}\n${percentage}% · ${score}/${denominator}\n${streak > 0 ? `🔥 ${streak} day streak\n` : ''}\nCan you beat me?`;
  const shareUrl = `${appBaseUrl}/#/Challenge?game=${gameId}&score=${percentage}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <Confetti trigger={showConfetti} duration={4000} />

      <div className="flex justify-center py-6">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl animate-bounce">
          🏆
        </div>
      </div>
      {endNote && (
        <div className="badge-3d badge-xp w-full justify-center text-sm">
          {endNote}
        </div>
      )}

      <ShareableResultCard 
        gameId={gameId}
        percentage={percentage}
        score={score}
        totalQuestions={totalQuestions}
        percentile={percentile}
        streak={streak}
        userId={user?.id}
        userName={user?.full_name}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="card-3d card-3d-yellow p-4 text-center">
          <Zap className="w-8 h-8 text-[#FFC800] mx-auto mb-2" />
          <p className="text-3xl font-black text-gradient-yellow">+{xpEarned}</p>
          <p className="text-xs text-[#777777] font-bold uppercase">XP Earned</p>
        </div>
        <div className="card-3d card-3d-orange p-4 text-center">
          <span className="text-3xl">🔥</span>
          <p className="text-3xl font-black text-[#FF9600]">{maxStreak}</p>
          <p className="text-xs text-[#777777] font-bold uppercase">Best Streak</p>
        </div>
      </div>

      {isNewBest && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="badge-3d badge-xp w-full justify-center py-3"
        >
          <Crown className="w-5 h-5" />
          <span className="font-black">New Personal Best!</span>
        </motion.div>
      )}

      {/* Friend Comparison */}
      {user?.id && (
        <FriendScoreComparison 
          gameId={gameId} 
          userScore={percentage} 
          userId={user.id} 
        />
      )}

      {/* Share Buttons */}
      <SocialShareButtons 
        shareText={shareText}
        shareUrl={shareUrl}
        title={`Beat my ${percentage}% on ${game?.title}!`}
        showAll={true}
      />

      <div className="space-y-3">
        {/* Rematch Button (if came from challenge) */}
        {challengeData && rematchEnabled && (
          <RematchButton
            challengerId={challengeData.challengerId}
            challengerName={challengeData.challengerName}
            challengerScore={challengeData.challengerScore}
            gameId={gameId}
            onRematch={onRematch || onPlayAgain}
          />
        )}
        {rematchEnabled && !challengeData && onRematch && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRematch}
            className="btn-3d btn-3d-blue w-full py-3"
          >
            Send a rematch link
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlayAgain}
          className="btn-3d btn-3d-lime w-full py-4 text-lg"
        >
          PLAY AGAIN
        </motion.button>
        
        <Link to={createPageUrl('Home')} className="block">
          <button className="btn-3d btn-3d-ghost w-full py-4 text-lg">
            Back to Games
          </button>
        </Link>
      </div>

      {/* AI Roast */}
      <AIRoast 
        gameId={gameId} 
        percentage={percentage} 
      />

      {/* Beat Me Link */}
      <BeatMeLink
        gameId={gameId}
        score={score}
        percentage={percentage}
        userName={user?.full_name}
        challengerId={user?.id}
      />

      {rematchEnabled && (
        <RematchLinkBar gameId={gameId} score={percentage} user={user} />
      )}

      {/* Floating Share Prompt */}
      <ShareComparePrompt
        gameId={gameId}
        percentage={percentage}
        score={score}
        totalQuestions={totalQuestions}
        showAfterDelay={4000}
      />
      </motion.div>
      );
}

export default function Gameplay() {
  const [gameId, setGameId] = useState(null);
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [gameMode, setGameMode] = useState('STANDARD');
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [endReason, setEndReason] = useState('complete');
  const [finalPercentage, setFinalPercentage] = useState(null);
  const [finalQuestionCount, setFinalQuestionCount] = useState(null);
  
  // Power-ups state
  const [powerUps, setPowerUps] = useState({ fifty: 3, time: 2, hint: 2, skip: 2 });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [bonusTime, setBonusTime] = useState(0);
  
  // XP bonuses
  const [timeBonus, setTimeBonus] = useState(0);
  const [streakBonus, setStreakBonus] = useState(0);
  
  // Challenge data (if came from a challenge link)
  const [challengeData, setChallengeData] = useState(null);
  const [friendBeatNotification, setFriendBeatNotification] = useState(null);
  
  // Celebration state
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const [celebrationType, setCelebrationType] = useState('correct');
  const [showXP, setShowXP] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const navigate = useNavigate();
  
  const queryClient = useQueryClient();
  const flags = getFlags();
  const swipeEnabled = Boolean(flags.SWIPE);
  const rematchEnabled = Boolean(flags.REMATCH);
  const blitzEnabled = Boolean(flags.BLITZ);
  const enabledModes = Object.entries(flags)
    .filter(([key, val]) => Boolean(val) && ['BLITZ', 'REMATCH', 'SWIPE'].includes(key))
    .map(([key]) => key);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('gameId');
    setGameId(id);
    const parsed = parseRematchParams();
    if (parsed) setChallengeData(parsed);
  }, []);

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const game = gameId ? GAMES[gameId] : null;
  const registryRenderer = game?.gameMode ? getRenderer(game.gameMode) : null;

  useEffect(() => {
    // CRITICAL FIX: Only start timer when game is playing, in BLITZ/QUICK mode, and questions are loaded
    if (gameState !== 'playing' || (gameMode !== 'BLITZ' && gameMode !== 'QUICK') || questions.length === 0) return;
    if (hasEnded) return;
    
    const timer = setInterval(() => {
      setBlitzTimeLeft(prev => {
        if (hasEnded) return prev;
        if (prev <= 1) { 
          setIsTimeUp(true);
          endGame({ reason: 'timer' });
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, gameMode, questions.length, hasEnded]);

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.id, gameId],
    queryFn: async () => {
      const results = await UserProgress.filter({ user_id: user?.id, game_id: gameId });
      return results[0] || null;
    },
    enabled: !!user?.id && !!gameId,
  });

  const { data: userStreak } = useQuery({
    queryKey: ['streak', user?.id],
    queryFn: async () => {
      const streaks = await UserStreak.filter({ user_id: user?.id });
      return streaks[0]?.current_streak || 0;
    },
    enabled: !!user?.id,
  });

  const currentLevel = getGameLevel(userProgress?.total_xp || 0);

  const handleRematch = () => {
    if (!rematchEnabled || !user) return;
    const answered = finalQuestionCount || questions.length || mode.questions || 10;
    const percentage = finalPercentage ?? Math.round((score / Math.max(answered, 1)) * 100);
    const challenge = createRematchChallenge({ gameId, percentage, user });
    const url = challenge?.link || buildRematchLink({ gameId, percentage, user });
    if (url) navigate(url);
    emitEvent('cta_click', { cta: 'rematch', gameId, percentage });
  };

  const { data: allQuestions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', gameId],
    queryFn: async () => {
      // Special handling for Connection Game (Daily Puzzle)
      if (GAMES[gameId]?.gameMode === 'connection') {
         try {
           const puzzles = await ConnectionPuzzle.list('-date', 1);
           if (puzzles.length > 0) return [{ type: 'connection', puzzleData: puzzles[0] }];
         } catch (e) {
           console.warn('Connection puzzle fetch failed, using fallback:', e);
         }
         // Fallback mock data
         return [{ 
             type: 'connection', 
             puzzleData: { 
                 groups: [
                     { theme: "SpongeBob Characters", items: ["SpongeBob", "Patrick", "Squidward", "Sandy"] },
                     { theme: "Gen Z Slang", items: ["Rizz", "Cap", "Bet", "Simp"] },
                     { theme: "Social Media Apps", items: ["TikTok", "Instagram", "Snapchat", "BeReal"] },
                     { theme: "Coffee Orders", items: ["Latte", "Cappuccino", "Espresso", "Mocha"] }
                 ] 
             } 
         }];
      }

      // Always try local questions first (they work without Supabase)
      const localQuestions = getQuestionsForGame(gameId);
      if (localQuestions.length > 0) {
        return localQuestions;
      }
      
      // Only try database if local questions are empty
      try {
        const dbQuestions = await Question.filter({ game_id: gameId });
        if (dbQuestions.length > 0) return dbQuestions;
      } catch (e) {
        console.warn('Database question fetch failed (Supabase may not be configured):', e);
      }
      
      // Return empty array if no questions found
      return [];
    },
    enabled: !!gameId,
  });

  const saveScoreMutation = useMutation({
    mutationFn: async (scoreData) => {
      await Score.create(scoreData);
      if (user?.id) {
        if (userProgress) {
          await UserProgress.update(userProgress.id, {
            total_plays: (userProgress.total_plays || 0) + 1,
            highest_score: Math.max(userProgress.highest_score || 0, scoreData.percentage),
            total_xp: (userProgress.total_xp || 0) + scoreData.xp_earned,
            last_played_date: new Date().toISOString().split('T')[0],
          });
        } else {
          await UserProgress.create({
            user_id: user.id, game_id: gameId, total_plays: 1,
            highest_score: scoreData.percentage, total_xp: scoreData.xp_earned,
            last_played_date: new Date().toISOString().split('T')[0],
          });
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['userProgress']),
  });

  const startGame = () => {
    // CRITICAL FIX: Validate questions exist
    if (!allQuestions || allQuestions.length === 0) {
      console.error('No questions available for this game');
      emitError({ message: 'No questions for game', page: 'Gameplay', meta: { gameId } });
      return;
    }

    // CRITICAL FIX: Validate game mode
    const mode = GAME_MODES[gameMode] || GAME_MODES.STANDARD;
    
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, mode.questions).map(q => {
      if (!q.options || !Array.isArray(q.options)) {
        return q;
      }
      const opts = q.options.map((o, i) => ({ o, correct: i === q.correct_index }));
      const shuffledOpts = [...opts].sort(() => Math.random() - 0.5);
      return { ...q, options: shuffledOpts.map(x => x.o), correct_index: shuffledOpts.findIndex(x => x.correct) };
    }).filter(q => {
      // CRITICAL FIX: Only filter out questions without options if they require options
      // Connection, ordering, and poll questions don't need options
      if (q.type === 'connection' || q.type === 'ordering' || q.type === 'poll') {
        return true;
      }
      return q.options && Array.isArray(q.options) && q.options.length > 0;
    });
    
    // CRITICAL FIX: Ensure we have at least one question
    if (selected.length === 0) {
      console.error('No valid questions selected');
      return;
    }
    
    setQuestions(selected);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeBonus(0);
    setStreakBonus(0);
    setHiddenOptions([]);
    setShowHint(false);
    setBonusTime(0);
    setAnsweredCount(0);
    setHasEnded(false);
    emitEvent('game_start', { gameId, mode: gameMode, blitz: gameMode === 'BLITZ' });
    setIsTimeUp(false);
    setEndReason('complete');
    setFinalPercentage(null);
    setFinalQuestionCount(null);
    // HIGH PRIORITY FIX: Reset power-ups between games
    setPowerUps({ fifty: 3, time: 2, hint: 2, skip: 2 });
    if (mode.time) setBlitzTimeLeft(mode.time);
    setGameState('playing');
  };

  // Handle power-up usage
  const usePowerUp = (powerUpId) => {
    if (powerUps[powerUpId] <= 0) return;
    
    setPowerUps(prev => ({ ...prev, [powerUpId]: prev[powerUpId] - 1 }));
    
    const currentQ = questions[currentQuestionIndex];
    
    switch (powerUpId) {
      case 'fifty':
        // Remove 2 wrong answers
        const wrongIndices = currentQ.options
          .map((_, i) => i)
          .filter(i => i !== currentQ.correct_index && !hiddenOptions.includes(i));
        const toHide = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
        setHiddenOptions(toHide);
        break;
      case 'time':
        setBonusTime(prev => prev + 10);
        break;
      case 'hint':
        setShowHint(true);
        break;
      case 'skip':
        // Skip counts as correct
        handleAnswer(true, 0);
        break;
    }
  };

  const endGame = ({ reason = 'complete', answeredOverride } = {}) => {
    if (hasEnded) return;
    setHasEnded(true);
    setEndReason(reason);
    if (reason === 'timer') setIsTimeUp(true);

    // CRITICAL FIX: Prevent division by zero and ensure score is calculated correctly
    const totalQuestions = questions.length;
    const answeredForScore = (gameMode === 'BLITZ' || gameMode === 'QUICK')
      ? (answeredOverride ?? answeredCount)
      : totalQuestions;
    const denominator = answeredForScore > 0 ? answeredForScore : (totalQuestions || 1);
    const percentage = Math.round((score / Math.max(denominator, 1)) * 100);
    setFinalPercentage(percentage);
    setFinalQuestionCount(denominator);
    
    const tier = getTier(gameId, percentage);
    let xpEarned = calculateXpEarned(percentage, currentLevel.level) + maxStreak * 2 + timeBonus + streakBonus;
    // MEDIUM PRIORITY FIX: Validate XP bounds
    xpEarned = Math.max(0, Math.min(xpEarned, 1000));
    if (gameMode === 'QUICK') xpEarned = Math.round(xpEarned * 0.8);
    if (gameMode === 'BLITZ') xpEarned = Math.round(xpEarned * 1.5);
    
    // Completion celebration
    if (percentage >= 90) {
      hapticLevelUp();
      setCelebrationType('levelUp');
      setXpEarned(xpEarned);
      setShowXP(true);
      setCelebrationTrigger(prev => prev + 1);
    }

    if (user?.id) {
      // CRITICAL FIX: Use answered questions count for max_score in BLITZ/QUICK modes
      const maxScore = denominator;
      
      saveScoreMutation.mutate({
        user_id: user.id, game_id: gameId, score, max_score: maxScore,
        percentage, tier_name: tier.name, tier_emoji: tier.emoji, xp_earned: xpEarned,
      });

      // HIGH PRIORITY FIX: Improve Squad XP error handling with retry
      SquadMember.filter({ user_id: user.id }).then(members => {
        if (members.length > 0) {
          const member = members[0];
          SquadMember.update(member.id, {
            contribution_xp: (member.contribution_xp || 0) + xpEarned
          }).catch(err => {
            console.error('Failed to update SquadMember XP:', err);
            // Retry once after 1 second
            setTimeout(() => {
              SquadMember.update(member.id, {
                contribution_xp: (member.contribution_xp || 0) + xpEarned
              }).catch(console.error);
            }, 1000);
          });
          Squad.filter({ id: member.squad_id }).then(squads => {
            if (squads.length > 0) {
              Squad.update(squads[0].id, {
                total_xp: (squads[0].total_xp || 0) + xpEarned
              }).catch(err => {
                console.error('Failed to update Squad XP:', err);
                // Retry once after 1 second
                setTimeout(() => {
                  Squad.update(squads[0].id, {
                    total_xp: (squads[0].total_xp || 0) + xpEarned
                  }).catch(console.error);
                }, 1000);
              });
            }
          }).catch(console.error);
        }
      }).catch(console.error);
    }
    
    // Show friend beat notification if came from challenge
    if (challengeData) {
      const didBeat = percentage > challengeData.challengerScore;
      setFriendBeatNotification({
        friendName: challengeData.challengerName,
        friendScore: challengeData.challengerScore,
        gameId,
        userScore: percentage,
        didBeat,
      });

      if (challengeData.challengeId) {
        recordRematchResult({
          challengeId: challengeData.challengeId,
          responderId: user?.id,
          responderName: user?.full_name,
          responderScore: percentage,
          gameId,
        });
      }
    }
    
    setGameState('results');
  };

  const handleAnswer = (isCorrect, timeRemaining = 0) => {
    if (hasEnded || isTimeUp) return;
    // Reset power-up effects for next question
    setHiddenOptions([]);
    setShowHint(false);
    setBonusTime(0);
    const nextAnswered = answeredCount + 1;
    setAnsweredCount(nextAnswered);
    
    // HIGH PRIORITY FIX: Fix streak calculation race condition
    if (isCorrect) {
      setScore(prev => prev + 1);
      let newStreakValue = 0;
      setStreak(prev => {
        newStreakValue = prev + 1;
        setMaxStreak(m => Math.max(m, newStreakValue));
        return newStreakValue;
      });
      
      // Play correct sound
      playSound('correct');
      if (newStreakValue >= 3) playSound('streak');
      
      // Haptic feedback
      hapticSuccess();
      if (newStreakValue >= 3) hapticStreak();
      
      // Calculate XP for this answer
      const baseXP = 10;
      const blitzBonus = blitzActive ? 1.2 : 1;
      const timeBonusXP = timeRemaining >= 12 ? (blitzActive ? 7 : 5) : 0;
      const streakMultiplier = newStreakValue >= 5 ? (blitzActive ? 3.5 : 3) : newStreakValue >= 3 ? (blitzActive ? 2.2 : 2) : 1;
      const answerXP = Math.round((baseXP + timeBonusXP) * streakMultiplier);
      
      // Celebration with XP display
      setCelebrationType(newStreakValue >= 5 ? 'streak' : 'correct');
      setXpEarned(answerXP);
      setShowXP(true);
      setCelebrationTrigger(prev => prev + 1);
      
      // Time bonus: +5 XP for answers under 3 seconds (timeRemaining > 12 if 15s timer)
      if (timeRemaining >= 12) {
        setTimeBonus(prev => prev + (blitzActive ? 7 : 5));
      }
      
      // Streak bonus: multiplier for consecutive correct
      if (newStreakValue >= 5) {
        setStreakBonus(prev => prev + (blitzActive ? 15 : 10)); // boosted in Blitz
      } else if (newStreakValue >= 3) {
        setStreakBonus(prev => prev + (blitzActive ? 8 : 5)); // boosted in Blitz
      }
    } else {
      setStreak(0);
      playSound('incorrect');
      
      // Haptic feedback for error
      hapticError();
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Auto-complete in Blitz after last question or when timer runs out
      const reason = blitzActive && blitzTimeLeft <= 0 ? 'timer' : 'complete';
      endGame({ reason, answeredOverride: nextAnswered });
    }
    emitEvent('game_complete', { gameId, mode: gameMode, percentage, reason, answered: denominator, score });
  };

  // Loading state while parsing gameId
  if (gameId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-10 h-10 animate-spin text-[#58CC02]" />
      </div>
    );
  }

  // If a renderer is registered for this gameMode, delegate to it (experimental/flagged).
  if (registryRenderer) {
    return renderByMode(game.gameMode, { gameId, user, game, initialState: { gameState, gameMode } });
  }

  // HIGH PRIORITY FIX: Preserve gameId in redirects
  // Redirect personality games to PersonalityGameplay
  if (game?.gameMode === 'personality') {
    const redirectUrl = createPageUrl('PersonalityGameplay') + (gameId ? `?gameId=${gameId}` : '');
    return <Navigate to={redirectUrl} replace />;
  }

  // Redirect opinion games to OpinionGameplay
  if (game?.gameMode === 'opinion') {
    const redirectUrl = createPageUrl('OpinionGameplay') + (gameId ? `?gameId=${gameId}` : '');
    return <Navigate to={redirectUrl} replace />;
  }

  // Game not found
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="card-3d p-8 text-center max-w-md w-full">
          <div className="mx-auto mb-4 text-4xl">😕</div>
          <h2 className="text-xl font-black text-[#3C3C3C] mb-2">Game Not Found</h2>
          <p className="text-[#777777] mb-6 font-semibold">Please select a game from home.</p>
          <Link to={createPageUrl('Home')}>
            <button className="btn-3d btn-3d-lime px-6 py-3 flex items-center justify-center gap-2 mx-auto">
              <Home className="w-5 h-5" /> Go Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const xpProgress = getXpProgress(userProgress?.total_xp || 0);
  const mode = GAME_MODES[gameMode] || GAME_MODES.STANDARD;
  const isQuickMode = gameMode === 'QUICK' || gameMode === 'BLITZ';
  const blitzActive = gameMode === 'BLITZ' && blitzEnabled;
  const totalQuestionsDisplay = finalQuestionCount || questions.length || mode.questions;
  const blitzBar = blitzActive && gameState === 'playing' ? Math.max(blitzTimeLeft, 0) : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {enabledModes.length > 0 && (
        <div className="sticky top-0 z-40 px-4 py-2 bg-yellow-50 text-xs font-bold text-yellow-700 flex items-center gap-2">
          Experimental modes active: {enabledModes.join(', ')}
        </div>
      )}
      {/* Celebration overlay */}
      <Celebration
        trigger={celebrationTrigger}
        type={celebrationType}
        streak={streak}
        showXP={showXP}
        xpEarned={xpEarned}
      />
      {blitzBar !== null && (
        <div className="max-w-lg mx-auto px-4 pt-2">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-400"
              style={{ width: `${Math.max((blitzBar / (mode.time || 1)) * 100, 0)}%`, transition: 'width 0.2s linear' }}
            />
          </div>
          <p className="text-[11px] text-[#AFAFAF] font-bold mt-1">Blitz ends in {blitzBar}s</p>
        </div>
      )}
      
      <header className="glass-light border-b border-[#E5E0DA] sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E0DA] flex items-center justify-center hover:bg-[#F0EDE8] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#777777]" />
            </button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <GameIcon gameId={gameId} size="sm" />
            <div>
              <h1 className="font-black text-[#3C3C3C]">{game.title}</h1>
              <p className="text-xs text-[#AFAFAF] font-semibold">{currentLevel.emoji} {currentLevel.title}</p>
            </div>
          </div>
          <SoundToggleButton />
          <div className="badge-3d badge-xp">
            <Zap className="w-4 h-4" />
            <span>{userProgress?.total_xp || 0}</span>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {gameState === 'intro' && (
          <div className="text-center py-4 space-y-4">
            <div className="py-4">
              <GameIcon gameId={gameId} size="xl" className="mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{game.title}</h2>
              <p className="text-slate-500 mt-2 text-lg">{game.description}</p>
            </div>

            <ModeSelector selectedMode={gameMode} onSelectMode={setGameMode} />

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-2xl">
                  {currentLevel.emoji}
                </div>
                <div>
                  <p className="font-bold text-slate-900">Level {currentLevel.level}: {currentLevel.title}</p>
                  <p className="text-sm text-slate-500">"{currentLevel.roast}"</p>
                </div>
              </div>
              {xpProgress.nextLevel && (
                <>
                  <ProgressBar3D current={xpProgress.current} total={xpProgress.needed} />
                  <p className="text-xs text-slate-400 mt-2 font-medium text-right">{xpProgress.current}/{xpProgress.needed} XP</p>
                </>
              )}
            </div>

            {questionsLoading ? (
              <button className="btn-3d btn-3d-ghost w-full py-4 flex items-center justify-center gap-2" disabled>
                <Loader2 className="w-5 h-5 animate-spin" /> Loading questions...
              </button>
            ) : allQuestions.length === 0 ? (
              <div className="text-center text-[#777777] p-6">
                <p className="text-4xl mb-3">🚧</p>
                <p className="font-semibold mb-2">No questions available!</p>
                <p className="text-sm">This game is still being set up. Check back soon!</p>
                <Link to={createPageUrl('Home')} className="btn-3d btn-3d-ghost mt-4 inline-block">
                  <Home className="w-4 h-4 inline mr-2" />
                  Go Home
                </Link>
              </div>
            ) : (
              <button 
                onClick={startGame} 
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-md hover:bg-black hover:shadow-lg transition-all flex items-center justify-center gap-3"
              >
                {gameMode === 'QUICK' ? <Rocket className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                {gameMode === 'QUICK' ? 'Quick Play' : 'Start Game'}
              </button>
            )}

            <div className="h-20" />
          </div>
        )}

        {gameState === 'playing' && questions.length > 0 && questions[currentQuestionIndex] && (
          <ErrorBoundary>
            <>
              {/* Power-ups bar */}
              <PowerUpsBar 
                available={powerUps} 
                onUse={usePowerUp} 
                disabled={false}
                showHint={showHint}
              />
              
              {(() => {
                const q = questions[currentQuestionIndex];
                const props = { 
                  question: q, 
                  questionNumber: currentQuestionIndex + 1, 
                  totalQuestions: questions.length, 
                  onAnswer: handleAnswer, 
                  timedMode: true,
                  hiddenOptions,
                  showHint,
                  bonusTime
                };
                
                // CRITICAL FIX: Add question type validation with error handling
                try {
                  if (q.type === 'image' || q.type === 'image_options' || q.type === 'video-ref') return <ImageQuestion {...props} />;
                  if (q.type === 'audio') return <AudioQuestion {...props} />;
                  if (q.type === 'swipe') return swipeEnabled ? <SwipeQuestion {...props} /> : <QuestionCard3D {...props} gameColor={game.color} streak={streak} quickMode={isQuickMode} />;
                  if (q.type === 'matching') return <MatchingQuestion {...props} />;
                  if (q.type === 'ranking') return <RankingQuestion {...props} />;
                  if (q.type === 'scenario') return <ScenarioSwipe {...props} />;
                  if (q.type === 'would-you-rather') return <WouldYouRather {...props} />;
                  if (q.type === 'connection') return <ConnectionBoard puzzle={q.puzzleData} onComplete={(res) => handleAnswer(res.success, 0, 100)} />;
                  if (q.type === 'ordering') return <TimelineDraggable question={q} onAnswer={(success) => handleAnswer(success, 0)} />;
                  if (q.type === 'poll') return swipeEnabled ? <VibeCheckSwipe question={q} onAnswer={() => handleAnswer(true, 0)} /> : <QuestionCard3D {...props} gameColor={game.color} streak={streak} quickMode={isQuickMode} />;

                  // Default fallback for unrecognized types
                  return <QuestionCard3D {...props} gameColor={game.color} streak={streak} quickMode={isQuickMode} />;
                } catch (error) {
                  if (process.env.NODE_ENV === 'development') {
                    console.error('Error rendering question:', error, q);
                  }
                  return (
                    <div className="card-3d p-6 text-center">
                      <p className="text-red-500 font-bold mb-2">Error loading question</p>
                      <button onClick={() => handleAnswer(false, 0)} className="btn-3d btn-3d-ghost">
                        Skip Question
                      </button>
                    </div>
                  );
                }
              })()}
            </>
          </ErrorBoundary>
        )}

        {gameState === 'results' && (
          <>
            {/* Completion Animation */}
            {(() => {
              const effectiveTotal = finalQuestionCount || questions.length || 1;
              const percentage = finalPercentage !== null
                ? finalPercentage
                : Math.round((score / effectiveTotal) * 100);
              const tier = getTier(gameId, percentage);
              const xpEarned = calculateXpEarned(percentage, currentLevel.level) + maxStreak * 2 + timeBonus + streakBonus;
              const isNewBest = userProgress && percentage > (userProgress.highest_score || 0);
              
              return (
                <CompletionAnimation
                  trigger={gameState === 'results'}
                  percentage={percentage}
                  xpEarned={xpEarned}
                  tier={tier}
                  isNewBest={isNewBest}
                />
              );
            })()}
            
            <ResultsCard3D
              gameId={gameId} score={score} totalQuestions={totalQuestionsDisplay}
              effectiveQuestions={finalQuestionCount}
              userLevel={currentLevel} previousBest={userProgress?.highest_score}
              onPlayAgain={startGame} user={user} maxStreak={maxStreak} streak={userStreak || 0}
              challengeData={challengeData}
              rematchEnabled={rematchEnabled}
              onRematch={handleRematch}
              finalPercentage={finalPercentage}
              endReason={endReason}
            />
            
            {/* Friend Beat Notification */}
            {friendBeatNotification && (
              <FriendBeatNotification
                friendName={friendBeatNotification.friendName}
                friendScore={friendBeatNotification.friendScore}
                gameId={friendBeatNotification.gameId}
                userScore={friendBeatNotification.userScore}
                onDismiss={() => setFriendBeatNotification(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
