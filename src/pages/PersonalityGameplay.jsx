import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { UserProgress } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES, getGameLevel } from '@/components/constants/games';
import { getQuestionsForGame } from '@/components/constants/questions';
import { ArrowLeft, Loader2, Zap, Home, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GameIcon from '@/components/home/GameIcon';
import Mascot, { CelebrationMascot } from '@/components/ui/Mascot';

// Personality Question Card - No right/wrong, just selection
function PersonalityQuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer,
  gameColor
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    setSelectedIndex(null);
    setShowTransition(false);
  }, [question.question]);

  const handleSelect = (index) => {
    if (showTransition) return;
    setSelectedIndex(index);
    setShowTransition(true);
    
    setTimeout(() => {
      onAnswer(index, question.weights?.[index] || question.traits?.[index]);
    }, 600);
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-[#777777]">{questionNumber} of {totalQuestions}</span>
          <span className="text-[#AFAFAF] font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar-3d">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${gameColor}, ${gameColor}CC)` }}
          />
        </div>
      </div>

      {/* No wrong answers banner */}
      {questionNumber === 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d card-3d-purple p-3 text-center"
        >
          <p className="text-sm font-bold text-[#3C3C3C]">
            ✨ No wrong answers — just be honest!
          </p>
        </motion.div>
      )}

      {/* Question */}
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

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(index)}
              disabled={showTransition}
              className={`w-full answer-3d ${isSelected ? 'selected border-[#CE82FF] bg-[#CE82FF]/10' : ''}`}
              style={isSelected ? { borderColor: gameColor, backgroundColor: `${gameColor}15` } : {}}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black transition-all ${
                  isSelected ? 'text-white' : 'bg-[#E8E4DF] text-[#777777]'
                }`} style={isSelected ? { backgroundColor: gameColor } : {}}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 text-[#3C3C3C] font-semibold text-left">{option}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: gameColor }} />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation after selection */}
      <AnimatePresence>
        {showTransition && question.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card-3d card-3d-blue p-4"
          >
            <p className="text-sm text-[#3C3C3C] font-semibold">💡 {question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mental Age Results
function MentalAgeResults({ averageWeight, answers, onPlayAgain, user }) {
  const mentalAge = Math.round(averageWeight);
  
  // Determine life stage
  const getLifeStage = (age) => {
    if (age <= 22) return { stage: 'Young Soul', emoji: '🌟', color: '#58CC02', desc: "You have youthful energy and a fresh perspective on life!" };
    if (age <= 32) return { stage: 'Prime Time', emoji: '💪', color: '#1CB0F6', desc: "You're in the sweet spot - mature but still full of energy!" };
    if (age <= 45) return { stage: 'Wise & Balanced', emoji: '🦉', color: '#CE82FF', desc: "You've found balance between experience and openness." };
    if (age <= 58) return { stage: 'Seasoned Pro', emoji: '🧙', color: '#FF9600', desc: "You have the wisdom of experience and peace of mind." };
    return { stage: 'Old Soul', emoji: '👴', color: '#FFD93D', desc: "You possess ancient wisdom and deep perspective." };
  };

  const lifeStage = getLifeStage(mentalAge);

  // Category breakdown (mock - could be calculated from actual answers)
  const categories = [
    { name: 'Technology', icon: '📱', score: Math.max(16, mentalAge - 8 + Math.floor(Math.random() * 10)) },
    { name: 'Lifestyle', icon: '💼', score: Math.max(18, mentalAge + Math.floor(Math.random() * 10) - 5) },
    { name: 'Social', icon: '🎉', score: Math.max(16, mentalAge - 5 + Math.floor(Math.random() * 8)) },
    { name: 'Values', icon: '❤️', score: Math.min(75, mentalAge + 8 + Math.floor(Math.random() * 10)) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-center">
        <CelebrationMascot />
      </div>

      {/* Main Result Card */}
      <div className="card-3d p-6 text-center" style={{ borderColor: lifeStage.color }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-6xl mb-4"
        >
          {lifeStage.emoji}
        </motion.div>
        
        <p className="text-[#AFAFAF] font-bold uppercase text-sm mb-2">Your Mental Age Is</p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-7xl font-black" style={{ color: lifeStage.color }}>{mentalAge}</span>
        </motion.div>
        
        <div className="mt-4">
          <h3 className="text-2xl font-black text-[#3C3C3C]">{lifeStage.stage}</h3>
          <p className="text-[#777777] font-semibold mt-2">{lifeStage.desc}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card-3d p-5">
        <h4 className="font-black text-[#3C3C3C] mb-4">Mental Age by Category</h4>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-[#3C3C3C] text-sm">{cat.name}</span>
                  <span className="font-black text-sm" style={{ color: lifeStage.color }}>{cat.score}</span>
                </div>
                <div className="progress-bar-3d h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (cat.score / 75) * 100)}%` }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: lifeStage.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Roast */}
      <div className="card-3d card-3d-pink p-4 text-center">
        <p className="font-bold text-[#3C3C3C]">
          {mentalAge < 25 ? "You still have WiFi as a basic need in your hierarchy of needs 📶" :
           mentalAge < 35 ? "You have opinions about coffee and skincare routines ☕" :
           mentalAge < 50 ? "You've started making 'oof' sounds when sitting down 🪑" :
           "You've accepted that your back will never fully recover 💀"}
        </p>
      </div>

      {/* Share */}
      <div className="card-3d p-4">
        <p className="text-center font-bold text-[#3C3C3C] mb-3">Share your mental age!</p>
        <div className="bg-[#F7F4F0] rounded-xl p-3 text-center">
          <p className="text-sm font-mono text-[#777777]">
            🧠 My mental age is {mentalAge}!<br/>
            I'm a "{lifeStage.stage}" {lifeStage.emoji}<br/>
            genrizz.app
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlayAgain}
          className="btn-3d btn-3d-lime w-full py-4 text-lg"
        >
          TAKE AGAIN
        </motion.button>
        
        <Link to={createPageUrl('Home')} className="block">
          <button className="btn-3d btn-3d-ghost w-full py-4 text-lg">
            Back to Games
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

// Generation Quiz Results
function GenerationResults({ traitCounts, answers, onPlayAgain, user }) {
  const total = Object.values(traitCounts).reduce((a, b) => a + b, 0) || 1;
  
  const generations = [
    { id: 'genz', name: 'Gen Z', emoji: '💀', color: '#00E5FF', years: '1997-2012' },
    { id: 'millennial', name: 'Millennial', emoji: '📼', color: '#FF6B9D', years: '1981-1996' },
    { id: 'genx', name: 'Gen X', emoji: '🎸', color: '#4DB6AC', years: '1965-1980' },
    { id: 'boomer', name: 'Boomer', emoji: '📻', color: '#FFB347', years: '1946-1964' },
    { id: 'genalpha', name: 'Gen Alpha', emoji: '🤖', color: '#B388FF', years: '2013+' },
  ];

  const results = generations.map(gen => ({
    ...gen,
    count: traitCounts[gen.id] || 0,
    percentage: Math.round(((traitCounts[gen.id] || 0) / total) * 100)
  })).sort((a, b) => b.percentage - a.percentage);

  const dominant = results[0];
  const secondary = results[1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-center">
        <CelebrationMascot />
      </div>

      {/* Main Result */}
      <div className="card-3d p-6 text-center" style={{ borderColor: dominant.color }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-7xl mb-4"
        >
          {dominant.emoji}
        </motion.div>
        
        <p className="text-[#AFAFAF] font-bold uppercase text-sm mb-2">You Are</p>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black"
          style={{ color: dominant.color }}
        >
          {dominant.percentage}% {dominant.name}
        </motion.h2>
        
        <p className="text-[#777777] font-semibold mt-2">
          with {secondary.percentage}% {secondary.name} energy
        </p>
      </div>

      {/* Breakdown */}
      <div className="card-3d p-5">
        <h4 className="font-black text-[#3C3C3C] mb-4">Generation Breakdown</h4>
        <div className="space-y-3">
          {results.filter(r => r.percentage > 0).map((gen, i) => (
            <motion.div 
              key={gen.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl w-8">{gen.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-[#3C3C3C] text-sm">{gen.name}</span>
                  <span className="font-black text-sm" style={{ color: gen.color }}>{gen.percentage}%</span>
                </div>
                <div className="progress-bar-3d h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gen.percentage}%` }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: gen.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Roast */}
      <div className="card-3d card-3d-pink p-4 text-center">
        <p className="font-bold text-[#3C3C3C]">
          {dominant.id === 'genz' ? "Your humor is unhinged and your attention span is 💀" :
           dominant.id === 'millennial' ? "You've killed 47 industries and you're still paying student loans" :
           dominant.id === 'genx' ? "You're fine. Everything's fine. You raised yourself anyway." :
           dominant.id === 'boomer' ? "You still print emails and that's somehow charming" :
           "Skibidi toilet is peak comedy to you and that's concerning"}
        </p>
      </div>

      {/* Share */}
      <div className="card-3d p-4">
        <p className="text-center font-bold text-[#3C3C3C] mb-3">Share your generation!</p>
        <div className="bg-[#F7F4F0] rounded-xl p-3 text-center">
          <p className="text-sm font-mono text-[#777777]">
            🧬 I'm {dominant.percentage}% {dominant.name}! {dominant.emoji}<br/>
            (with {secondary.percentage}% {secondary.name} vibes)<br/>
            genrizz.app
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlayAgain}
          className="btn-3d btn-3d-lime w-full py-4 text-lg"
        >
          TAKE AGAIN
        </motion.button>
        
        <Link to={createPageUrl('Home')} className="block">
          <button className="btn-3d btn-3d-ghost w-full py-4 text-lg">
            Back to Games
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function PersonalityGameplay() {
  const [gameId, setGameId] = useState(null);
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [weightSum, setWeightSum] = useState(0);
  const [traitCounts, setTraitCounts] = useState({});
  
  const queryClient = useQueryClient();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setGameId(urlParams.get('gameId'));
  }, []);

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const game = gameId ? GAMES[gameId] : null;

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.id, gameId],
    queryFn: async () => {
      const results = await UserProgress.filter({ user_id: user?.id, game_id: gameId });
      return results[0] || null;
    },
    enabled: !!user?.id && !!gameId,
  });

  const { data: allQuestions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', gameId],
    queryFn: () => getQuestionsForGame(gameId),
    enabled: !!gameId,
  });

  const currentLevel = getGameLevel(userProgress?.total_xp || 0);

  const startGame = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 15); // 15 questions for personality
    setQuestions(selected);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setWeightSum(0);
    setTraitCounts({});
    setGameState('playing');
  };

  const handleAnswer = (selectedIndex, weightOrTrait) => {
    const newAnswers = [...answers, { questionIndex: currentQuestionIndex, selectedIndex, weightOrTrait }];
    setAnswers(newAnswers);
    
    // For mental-age: accumulate weights
    if (game?.resultType === 'mental-age' && typeof weightOrTrait === 'number') {
      setWeightSum(prev => prev + weightOrTrait);
    }
    
    // For generation: count traits
    if (game?.resultType === 'generation' && typeof weightOrTrait === 'string') {
      setTraitCounts(prev => ({
        ...prev,
        [weightOrTrait]: (prev[weightOrTrait] || 0) + 1
      }));
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('results');
    }
  };

  if (gameId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-10 h-10 animate-spin text-[#58CC02]" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
        <div className="card-3d p-8 text-center max-w-md w-full">
          <Mascot mood="sad" size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-black text-[#3C3C3C] mb-2">Game Not Found</h2>
          <Link to={createPageUrl('Home')}>
            <button className="btn-3d btn-3d-lime px-6 py-3 flex items-center justify-center gap-2 mx-auto">
              <Home className="w-5 h-5" /> Go Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
              <p className="text-xs text-[#AFAFAF] font-semibold">Personality Assessment</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {gameState === 'intro' && (
          <div className="text-center py-6 space-y-6">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <GameIcon gameId={gameId} size="xl" className="mx-auto" />
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-black text-[#3C3C3C]">{game.title}</h2>
              <p className="text-[#777777] mt-1 font-semibold">{game.description}</p>
            </div>

            <div className="card-3d card-3d-purple p-5">
              <Sparkles className="w-8 h-8 text-[#CE82FF] mx-auto mb-3" />
              <h3 className="font-black text-[#3C3C3C] mb-2">This is a personality assessment</h3>
              <p className="text-sm text-[#777777] font-semibold">
                There are no right or wrong answers. Just answer honestly and discover something about yourself!
              </p>
            </div>

            <div className="card-3d p-4 text-left">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <div>
                  <p className="font-bold text-[#3C3C3C]">15 Questions</p>
                  <p className="text-xs text-[#AFAFAF] font-semibold">Takes about 3 minutes</p>
                </div>
              </div>
            </div>

            {questionsLoading ? (
              <button className="btn-3d btn-3d-ghost w-full py-4 flex items-center justify-center gap-2" disabled>
                <Loader2 className="w-5 h-5 animate-spin" /> Loading...
              </button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame} 
                className="btn-3d btn-3d-lime w-full py-5 text-xl flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6" />
                START ASSESSMENT
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            )}
          </div>
        )}

        {gameState === 'playing' && questions[currentQuestionIndex] && (
          <PersonalityQuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            gameColor={game.color}
          />
        )}

        {gameState === 'results' && game.resultType === 'mental-age' && (
          <MentalAgeResults
            averageWeight={weightSum / answers.length}
            answers={answers}
            onPlayAgain={startGame}
            user={user}
          />
        )}

        {gameState === 'results' && game.resultType === 'generation' && (
          <GenerationResults
            traitCounts={traitCounts}
            answers={answers}
            onPlayAgain={startGame}
            user={user}
          />
        )}
      </main>
    </div>
  );
}