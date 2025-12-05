import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { UserProgress, UserStreak, Question, Score, ConnectionPuzzle, SquadMember, Squad } from '@/api/entities';
import { Link, Navigate } from 'react-router-dom';
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
import ConnectionBoard from '@/components/game/mechanics/ConnectionBoard';
import TimelineDraggable from '@/components/game/mechanics/TimelineDraggable';
import VibeCheckSwipe from '@/components/game/mechanics/VibeCheckSwipe';

const GAME_MODES = {
  STANDARD: { questions: 10, label: 'Standard', icon: '📝', time: null },
  QUICK: { questions: 5, label: 'Quick', icon: '⚡', time: 60 },
  BLITZ: { questions: 10, label: 'Blitz', icon: '🔥', time: 90 },
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
  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.entries(GAME_MODES).map(([key, mode]) => (
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
  userLevel, 
  previousBest, 
  onPlayAgain, 
  user, 
  maxStreak,
  streak,
  challengeData = null 
}) {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const game = GAMES[gameId];
  const percentage = Math.round((score / totalQuestions) * 100);
  const tier = getTier(gameId, percentage);
  const xpEarned = calculateXpEarned(percentage, userLevel.level) + (maxStreak * 2);
  const isNewBest = !previousBest || percentage > previousBest;
  const percentile = Math.min(95, Math.max(5, percentage + Math.floor(Math.random() * 10)));

  // Trigger confetti and celebration sound on good scores
  React.useEffect(() => {
    if (percentage >= 70) {
      setShowConfetti(true);
      playSound('celebration');
    }
  }, [percentage]);

  // Generate share text
  const shareText = `${game?.icon || '🎮'} GenRizz: ${game?.title}\n\n${tier.emoji} ${tier.name}\n${percentage}% · ${score}/${totalQuestions}\n${streak > 0 ? `🔥 ${streak} day streak\n` : ''}\nCan you beat me?`;
  const shareUrl = `${window.location.origin}/#/Challenge?game=${gameId}&score=${percentage}`;

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
        {challengeData && (
          <RematchButton
            challengerId={challengeData.challengerId}
            challengerName={challengeData.challengerName}
            challengerScore={challengeData.challengerScore}
            gameId={gameId}
            onRematch={onPlayAgain}
          />
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
      />

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
  
  const queryClient = useQueryClient();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('gameId');
    setGameId(id);
    
    // Check for challenge params
    const challengerId = urlParams.get('challengerId');
    const challengerName = urlParams.get('challengerName');
    const challengerScore = urlParams.get('challengerScore');
    if (challengerId && challengerScore) {
      setChallengeData({
        challengerId,
        challengerName: challengerName || 'Friend',
        challengerScore: parseInt(challengerScore, 10),
      });
    }
  }, []);

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const game = gameId ? GAMES[gameId] : null;

  useEffect(() => {
    if (gameState !== 'playing' || gameMode !== 'BLITZ') return;
    const timer = setInterval(() => {
      setBlitzTimeLeft(prev => {
        if (prev <= 1) { endGame(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, gameMode]);

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
    const mode = GAME_MODES[gameMode];
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, mode.questions).map(q => {
      if (!q.options || !Array.isArray(q.options)) {
        return q;
      }
      const opts = q.options.map((o, i) => ({ o, correct: i === q.correct_index }));
      const shuffledOpts = [...opts].sort(() => Math.random() - 0.5);
      return { ...q, options: shuffledOpts.map(x => x.o), correct_index: shuffledOpts.findIndex(x => x.correct) };
    }).filter(q => q.options && Array.isArray(q.options) && q.options.length > 0);
    
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

  const endGame = () => {
    const percentage = Math.round((score / questions.length) * 100);
    const tier = getTier(gameId, percentage);
    let xpEarned = calculateXpEarned(percentage, currentLevel.level) + maxStreak * 2 + timeBonus + streakBonus;
    if (gameMode === 'QUICK') xpEarned = Math.round(xpEarned * 0.8);
    if (gameMode === 'BLITZ') xpEarned = Math.round(xpEarned * 1.5);

    if (user?.id) {
      saveScoreMutation.mutate({
        user_id: user.id, game_id: gameId, score, max_score: questions.length,
        percentage, tier_name: tier.name, tier_emoji: tier.emoji, xp_earned: xpEarned,
      });

      // Update Squad XP
      SquadMember.filter({ user_id: user.id }).then(members => {
        if (members.length > 0) {
          const member = members[0];
          SquadMember.update(member.id, {
            contribution_xp: (member.contribution_xp || 0) + xpEarned
          }).catch(console.error);
          Squad.filter({ id: member.squad_id }).then(squads => {
            if (squads.length > 0) {
              Squad.update(squads[0].id, {
                total_xp: (squads[0].total_xp || 0) + xpEarned
              }).catch(console.error);
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
    }
    
    setGameState('results');
  };

  const handleAnswer = (isCorrect, timeRemaining = 0) => {
    // Reset power-up effects for next question
    setHiddenOptions([]);
    setShowHint(false);
    setBonusTime(0);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(m => Math.max(m, newStreak));
      
      // Play correct sound
      playSound('correct');
      if (newStreak >= 3) playSound('streak');
      
      // Time bonus: +5 XP for answers under 3 seconds (timeRemaining > 12 if 15s timer)
      if (timeRemaining >= 12) {
        setTimeBonus(prev => prev + 5);
      }
      
      // Streak bonus: multiplier for consecutive correct
      if (newStreak >= 5) {
        setStreakBonus(prev => prev + 10); // 3x at 5+
      } else if (newStreak >= 3) {
        setStreakBonus(prev => prev + 5); // 2x at 3+
      }
    } else {
      setStreak(0);
      playSound('incorrect');
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      endGame();
    }
  };

  // Loading state while parsing gameId
  if (gameId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-10 h-10 animate-spin text-[#58CC02]" />
      </div>
    );
  }

  // Redirect personality games to PersonalityGameplay
  if (game?.gameMode === 'personality') {
    return <Navigate to={createPageUrl('PersonalityGameplay') + `?gameId=${gameId}`} replace />;
  }

  // Redirect opinion games to OpinionGameplay
  if (game?.gameMode === 'opinion') {
    return <Navigate to={createPageUrl('OpinionGameplay') + `?gameId=${gameId}`} replace />;
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
  const mode = GAME_MODES[gameMode];
  const isQuickMode = gameMode === 'QUICK' || gameMode === 'BLITZ';

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
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
                <Loader2 className="w-5 h-5 animate-spin" /> Loading...
              </button>
            ) : allQuestions.length === 0 ? (
              <div className="text-[#777777]">
                <p className="text-4xl mb-3">🚧</p>
                <p className="font-semibold">No questions yet!</p>
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

        {gameState === 'playing' && questions[currentQuestionIndex] && (
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
              
              if (q.type === 'image' || q.type === 'image_options' || q.type === 'video-ref') return <ImageQuestion {...props} />;
              if (q.type === 'audio') return <AudioQuestion {...props} />;
              if (q.type === 'swipe') return <SwipeQuestion {...props} />;
              if (q.type === 'matching') return <MatchingQuestion {...props} />;
              if (q.type === 'ranking') return <RankingQuestion {...props} />;
              if (q.type === 'scenario') return <ScenarioSwipe {...props} />;
              if (q.type === 'would-you-rather') return <WouldYouRather {...props} />;
              if (q.type === 'connection') return <ConnectionBoard puzzle={q.puzzleData} onComplete={(res) => handleAnswer(res.success, 0, 100)} />;
              if (q.type === 'ordering') return <TimelineDraggable question={q} onAnswer={(success) => handleAnswer(success, 0)} />;
              if (q.type === 'poll') return <VibeCheckSwipe question={q} onAnswer={() => handleAnswer(true, 0)} />;

              return <QuestionCard3D {...props} gameColor={game.color} streak={streak} quickMode={isQuickMode} />;
            })()}
          </>
        )}

        {gameState === 'results' && (
          <>
            <ResultsCard3D
              gameId={gameId} score={score} totalQuestions={questions.length}
              userLevel={currentLevel} previousBest={userProgress?.highest_score}
              onPlayAgain={startGame} user={user} maxStreak={maxStreak} streak={userStreak || 0}
              challengeData={challengeData}
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