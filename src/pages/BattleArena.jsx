import React, { useState, useEffect, useRef } from 'react';
import { auth } from '@/api/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, Trophy, X, Clock, Zap, Shield, Crown, 
  User, Ghost, AlertCircle, ArrowLeft, Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { emitEvent } from '@/services/telemetry';
import { GAMES_LIST } from '@/components/constants/games';
import { MiniMascot } from '@/components/ui/Mascot';
import Confetti from '@/components/ui/Confetti';

// Mock Opponents
const BOTS = [
  { name: 'Speedy_Gonzales', level: 8, avatar: '⚡' },
  { name: 'QuizMaster99', level: 12, avatar: '🧠' },
  { name: 'NoobSlayer', level: 5, avatar: '⚔️' },
  { name: 'RizzGod', level: 15, avatar: '👑' },
  { name: 'Guest_8821', level: 2, avatar: '👤' },
];

const QUESTIONS = [
  {
    id: 1,
    question: "What does 'no cap' mean?",
    options: ["No hat", "No lie / For real", "No limit", "No idea"],
    correct: 1
  },
  {
    id: 2,
    question: "Which generation came after Millennials?",
    options: ["Gen Alpha", "Gen X", "Gen Z", "Boomers"],
    correct: 2
  },
  {
    id: 3,
    question: "What is a 'Simp'?",
    options: ["Simple person", "Overly desperate for attention", "Someone who sings", "A type of shrimp"],
    correct: 1
  },
  {
    id: 4,
    question: "If someone has 'Rizz', they have...",
    options: ["Charisma", "Money", "Problems", "Hair"],
    correct: 0
  },
  {
    id: 5,
    question: "What is the 'Roman Empire' trend about?",
    options: ["Thinking about history often", "Cooking pasta", "Fighting gladiators", "Traveling to Italy"],
    correct: 0
  }
];

export default function BattleArena() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('lobby'); // lobby, searching, found, playing, result
  const [opponent, setOpponent] = useState(null);
  const [countdown, setCountdown] = useState(3);
  
  // Gameplay State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [myProgress, setMyProgress] = useState(0); // 0-100
  const [oppProgress, setOppProgress] = useState(0); // 0-100
  const [timer, setTimer] = useState(10); // Seconds per question
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Refs for intervals
  const timerRef = useRef(null);
  const botIntervalRef = useRef(null);

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
    return () => {
      clearInterval(timerRef.current);
      clearInterval(botIntervalRef.current);
    };
  }, []);

  const startMatchmaking = () => {
    setGameState('searching');
    emitEvent('battle_arena_matchmaking_start');
    // Mock search delay
    setTimeout(() => {
      const randomBot = BOTS[Math.floor(Math.random() * BOTS.length)];
      setOpponent(randomBot);
      setGameState('found');
      emitEvent('battle_arena_found', { opponent: randomBot.name });
      
      // Start Countdown
      let count = 3;
      setCountdown(count);
      const countInterval = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(countInterval);
          startGame();
        }
      }, 1000);
    }, 2000 + Math.random() * 2000);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQIndex(0);
    setMyScore(0);
    setOppScore(0);
    setMyProgress(0);
    setOppProgress(0);
    emitEvent('battle_arena_start', { opponent: opponent?.name || 'bot' });
    startQuestionTimer();
    startBotLogic();
  };

  const startQuestionTimer = () => {
    setTimer(10);
    setSelectedAnswer(null);
    setIsAnswered(false);
    
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      // Timeout counts as wrong
      setTimeout(nextQuestion, 1500);
    }
  };

  const startBotLogic = () => {
    // Bot answers randomly between 2s and 8s
    const answerTime = 2000 + Math.random() * 6000;
    
    clearInterval(botIntervalRef.current);
    botIntervalRef.current = setTimeout(() => {
      // Bot gets it right 70% of the time
      const isCorrect = Math.random() > 0.3;
      if (isCorrect) {
        setOppScore(prev => prev + 100);
      }
      // Update progress visually
      setOppProgress(prev => prev + (100 / QUESTIONS.length));
    }, answerTime);
  };

  const handleAnswer = (index) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswer(index);
    clearInterval(timerRef.current);

    const isCorrect = index === QUESTIONS[currentQIndex].correct;
    emitEvent('battle_arena_answer', { correct: isCorrect, questionId: QUESTIONS[currentQIndex].id });
    if (isCorrect) {
      // Score based on time remaining
      const points = 100 + (timer * 10);
      setMyScore(prev => prev + points);
    }

    setMyProgress(prev => prev + (100 / QUESTIONS.length));
    
    setTimeout(nextQuestion, 1500);
  };

  const nextQuestion = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      startQuestionTimer();
      startBotLogic();
    } else {
      endGame();
    }
  };

const endGame = () => {
  clearInterval(timerRef.current);
  clearInterval(botIntervalRef.current);
  setGameState('result');
  emitEvent('battle_arena_complete', { myScore, oppScore, opponent: opponent?.name || 'bot' });
};

  // --- RENDERERS ---

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen bg-[#2A0944] text-white p-4 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <Link to={createPageUrl('Home')} className="absolute top-6 left-6 z-20">
          <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center z-10 max-w-md w-full"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[var(--brand-red)] to-[var(--brand-red-dark)] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(255,75,75,0.4)] mb-8 transform rotate-3">
            <Swords className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-5xl font-black mb-4 italic tracking-tight">BATTLE<br/>ARENA</h1>
          <p className="text-gray-300 mb-12 text-lg font-semibold">Real-time PvP Trivia Battles</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <Trophy className="w-8 h-8 text-[var(--brand-yellow)] mx-auto mb-2" />
              <div className="font-black text-2xl">Ranked</div>
              <div className="text-xs text-gray-400">Climb the ladder</div>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 opacity-50">
              <Users className="w-8 h-8 text-[var(--brand-blue)] mx-auto mb-2" />
              <div className="font-black text-2xl">Friendly</div>
              <div className="text-xs text-gray-400">Coming soon</div>
            </div>
          </div>

          <button 
            onClick={startMatchmaking}
            className="w-full py-5 bg-[var(--brand-red)] hover:bg-[var(--brand-red-hover)] text-white rounded-2xl font-black text-xl shadow-[0_6px_0_var(--brand-red-dark)] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3"
          >
            <Swords className="w-6 h-6" /> FIND MATCH
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'searching') {
    return (
      <div className="min-h-screen bg-[#2A0944] text-white flex flex-col items-center justify-center z-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-8 border-[var(--brand-red)] border-t-transparent rounded-full mb-8"
        />
        <h2 className="text-2xl font-black animate-pulse">SEARCHING FOR OPPONENT...</h2>
        <p className="text-gray-400 mt-2">Estimated time: 5s</p>
        <div className="mt-12 flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mb-2 flex items-center justify-center border-2 border-white">
              <span className="text-2xl">{user?.avatar || '😎'}</span>
            </div>
            <span className="font-bold">You</span>
          </div>
          <div className="flex items-center text-2xl font-black text-gray-500">VS</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full mb-2 flex items-center justify-center border-2 border-dashed border-gray-600 animate-pulse">
              <span className="text-2xl">?</span>
            </div>
            <span className="font-bold text-gray-600">...</span>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'found') {
    return (
      <div className="min-h-screen bg-[#2A0944] text-white flex flex-col items-center justify-center z-50 relative overflow-hidden">
        {/* VS Animation */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1.5, rotate: 0 }}
          className="absolute z-10 text-[var(--brand-yellow)] font-black text-9xl italic drop-shadow-[0_10px_0_rgba(0,0,0,0.5)]"
        >
          VS
        </motion.div>

        <div className="flex w-full max-w-4xl justify-between px-12 items-center z-20">
          {/* You */}
          <motion.div 
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 bg-[var(--brand-blue)] rounded-3xl mb-4 border-4 border-white flex items-center justify-center shadow-[0_0_30px_var(--brand-blue)]">
              <span className="text-6xl">{user?.avatar || '😎'}</span>
            </div>
            <h2 className="text-3xl font-black">{user?.full_name || 'You'}</h2>
            <div className="badge-3d badge-xp inline-flex mt-2">Lvl {Math.floor((user?.xp || 0)/1000) + 1}</div>
          </motion.div>

          {/* Opponent */}
          <motion.div 
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 bg-[var(--brand-red)] rounded-3xl mb-4 border-4 border-white flex items-center justify-center shadow-[0_0_30px_var(--brand-red)]">
              <span className="text-6xl">{opponent.avatar}</span>
            </div>
            <h2 className="text-3xl font-black">{opponent.name}</h2>
            <div className="badge-3d badge-xp inline-flex mt-2">Lvl {opponent.level}</div>
          </motion.div>
        </div>

        <div className="absolute bottom-20 font-black text-4xl text-white animate-bounce">
          Starting in {countdown}...
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const question = QUESTIONS[currentQIndex];
    const progress = ((currentQIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-[#2A0944] flex flex-col">
        {/* HUD */}
        <div className="p-4 flex items-end justify-between bg-[#1a052b] border-b border-white/10">
          <div className="w-1/3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[var(--brand-blue)] rounded-lg flex items-center justify-center text-sm">{user?.avatar || '😎'}</div>
              <div className="font-bold text-white text-sm sm:text-base">You</div>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
              <motion.div 
                className="h-full bg-[var(--brand-blue)]" 
                initial={{ width: 0 }}
                animate={{ width: `${myProgress}%` }}
              />
            </div>
            <div className="text-[var(--brand-blue)] font-black text-xl mt-1">{myScore}</div>
          </div>

          <div className="w-20 flex flex-col items-center -mb-2">
            <div className={`text-4xl font-black ${timer <= 3 ? 'text-[var(--brand-red)] animate-pulse' : 'text-white'}`}>
              {timer}
            </div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Seconds</div>
          </div>

          <div className="w-1/3 text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <div className="font-bold text-white text-sm sm:text-base">{opponent.name}</div>
              <div className="w-8 h-8 bg-[var(--brand-red)] rounded-lg flex items-center justify-center text-sm">{opponent.avatar}</div>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
              <motion.div 
                className="h-full bg-[var(--brand-red)]" 
                initial={{ width: 0 }}
                animate={{ width: `${oppProgress}%` }}
              />
            </div>
            <div className="text-[var(--brand-red)] font-black text-xl mt-1">{oppScore}</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
          <div className="mb-8 text-center">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-gray-300 mb-4">
              Question {currentQIndex + 1} of {QUESTIONS.length}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {question.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full">
            {question.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === question.correct;
              const showResult = isAnswered;

              let bgClass = "bg-white text-[var(--text-primary)]";
              if (showResult) {
                if (isCorrect) bgClass = "bg-[var(--brand-green)] text-white border-[var(--brand-green-hover)]";
                else if (isSelected && !isCorrect) bgClass = "bg-[var(--brand-red)] text-white border-[var(--brand-red-dark)]";
                else bgClass = "bg-gray-200 text-gray-400 opacity-50";
              } else {
                if (isSelected) bgClass = "bg-[var(--brand-blue)] text-white";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={`
                    p-4 rounded-2xl font-bold text-lg text-left transition-all border-b-4 relative overflow-hidden
                    ${bgClass}
                    ${!isAnswered ? 'hover:brightness-95 active:translate-y-1 active:border-b-0' : ''}
                  `}
                >
                  <span className="relative z-10">{opt}</span>
                  {showResult && isCorrect && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const won = myScore > oppScore;
    const draw = myScore === oppScore;

    return (
      <div className="min-h-screen bg-[#2A0944] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {won && <Confetti />}
        
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative z-10"
        >
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            {won ? (
              <div className="w-32 h-32 bg-[var(--brand-yellow)] rounded-full flex items-center justify-center border-8 border-[#2A0944] shadow-xl">
                <Trophy className="w-16 h-16 text-white animate-bounce" />
              </div>
            ) : draw ? (
              <div className="w-32 h-32 bg-gray-400 rounded-full flex items-center justify-center border-8 border-[#2A0944] shadow-xl">
                <div className="text-5xl">🤝</div>
              </div>
            ) : (
              <div className="w-32 h-32 bg-[var(--brand-red)] rounded-full flex items-center justify-center border-8 border-[#2A0944] shadow-xl">
                <div className="text-5xl">💀</div>
              </div>
            )}
          </div>

          <h1 className="mt-12 text-4xl font-black text-[#3C3C3C] uppercase tracking-tight mb-2">
            {won ? 'Victory!' : draw ? 'Draw!' : 'Defeat!'}
          </h1>
          <p className="text-gray-500 font-bold mb-8">
            {won ? 'You crushed it! +50 XP' : 'Better luck next time!'}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <div className="text-xs font-bold text-gray-400 uppercase">You</div>
              <div className="text-3xl font-black text-[var(--brand-blue)]">{myScore}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <div className="text-xs font-bold text-gray-400 uppercase">Enemy</div>
              <div className="text-3xl font-black text-[var(--brand-red)]">{oppScore}</div>
            </div>
          </div>

          <button 
            onClick={() => setGameState('lobby')}
            className="w-full py-4 bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white rounded-2xl font-black text-lg shadow-[0_4px_0_var(--brand-green-dark)] active:shadow-none active:translate-y-[4px] transition-all mb-3"
          >
            PLAY AGAIN
          </button>
          <Link to={createPageUrl('Home')}>
            <button className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl font-bold text-lg transition-all">
              BACK TO HOME
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return null;
}

function CheckCircle({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
