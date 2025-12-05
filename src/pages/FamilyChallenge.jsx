import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { auth } from '@/api/auth';
import ParentKidChallenge, { ParentKidResults } from '@/components/challenge/ParentKidChallenge';
import QuestionCardEnhanced from '@/components/game/QuestionCardEnhanced';
import DramaticReveal from '@/components/viral/DramaticReveal';
import { GAMES, LEVEL_CONFIG, getTier } from '@/components/constants/games';
import { getQuestionsForGame } from '@/components/constants/questions';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Confetti from '@/components/ui/Confetti';

export default function FamilyChallenge() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Game state
  const [phase, setPhase] = useState('setup'); // setup, player1-playing, player1-reveal, switch, player2-playing, player2-reveal, results
  const [challengeConfig, setChallengeConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Player scores
  const [player1Score, setPlayer1Score] = useState({ correct: 0, answers: [] });
  const [player2Score, setPlayer2Score] = useState({ correct: 0, answers: [] });
  
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const handleStartChallenge = (config) => {
    setChallengeConfig(config);
    
    // Load questions
    const allQuestions = getQuestionsForGame(config.gameId);
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, LEVEL_CONFIG.questionsPerPlay));
    
    setPhase('player1-playing');
  };

  const handlePlayer1Answer = (isCorrect) => {
    setPlayer1Score(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      answers: [...prev.answers, isCorrect]
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Player 1 finished
      setPhase('player1-reveal');
    }
  };

  const handlePlayer1RevealComplete = () => {
    setPhase('switch');
    setCurrentQuestionIndex(0);
  };

  const handleStartPlayer2 = () => {
    setPhase('player2-playing');
  };

  const handlePlayer2Answer = (isCorrect) => {
    setPlayer2Score(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      answers: [...prev.answers, isCorrect]
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Player 2 finished
      setPhase('player2-reveal');
    }
  };

  const handlePlayer2RevealComplete = () => {
    setShowConfetti(true);
    setPhase('results');
  };

  const handlePlayAgain = () => {
    setPhase('setup');
    setChallengeConfig(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setPlayer1Score({ correct: 0, answers: [] });
    setPlayer2Score({ correct: 0, answers: [] });
    setShowConfetti(false);
  };

  const game = challengeConfig ? GAMES[challengeConfig.gameId] : null;
  const player1Percentage = questions.length > 0 ? Math.round((player1Score.correct / questions.length) * 100) : 0;
  const player2Percentage = questions.length > 0 ? Math.round((player2Score.correct / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Confetti trigger={showConfetti} duration={4000} />
      
      {/* Header for gameplay phases */}
      {phase !== 'setup' && phase !== 'results' && (
        <header className="px-4 py-3 glass-panel border-b border-white/5 sticky top-0 z-40">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button 
              onClick={() => setPhase('setup')}
              className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              {game && (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: game.color }}>
                    {game.icon}
                  </div>
                  <div>
                    <h1 className="font-bold text-sm">{game.title}</h1>
                    <p className="text-xs text-slate-400">
                      {phase.includes('player1') ? `${challengeConfig.player1Role === 'kid' ? '👶 Kid' : '👨 Parent'}'s Turn` : 
                       phase.includes('player2') ? `${challengeConfig.player1Role === 'kid' ? '👨 Parent' : '👶 Kid'}'s Turn` : 
                       'Family Challenge'}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                phase.includes('player1') ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* Setup Phase */}
          {phase === 'setup' && (
            <ParentKidChallenge onStartChallenge={handleStartChallenge} />
          )}

          {/* Player 1 Playing */}
          {phase === 'player1-playing' && questions[currentQuestionIndex] && (
            <motion.div
              key="player1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-4"
            >
              <QuestionCardEnhanced
                question={questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onAnswer={handlePlayer1Answer}
                gameColor={game?.color}
                timedMode={true}
                autoAdvance={true}
                streak={0}
                onTimeBonus={() => {}}
              />
            </motion.div>
          )}

          {/* Player 1 Reveal */}
          {phase === 'player1-reveal' && (
            <DramaticReveal
              gameId={challengeConfig.gameId}
              score={player1Score.correct}
              total={questions.length}
              onComplete={handlePlayer1RevealComplete}
            />
          )}

          {/* Switch Screen */}
          {phase === 'switch' && (
            <motion.div
              key="switch"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 px-4"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                🔄
              </motion.div>
              
              <h2 className="text-2xl font-black mb-2">Pass the Phone!</h2>
              <p className="text-slate-400 mb-8">
                Time for <span className="font-bold text-white">
                  {challengeConfig.player1Role === 'kid' ? 'Parent' : 'Kid'}
                </span> to play!
              </p>

              {/* Hidden score */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-8">
                <p className="text-sm text-slate-400">
                  {challengeConfig.player1Role === 'kid' ? 'Kid' : 'Parent'}'s score is hidden...
                </p>
                <p className="text-2xl mt-2">🤫 ???%</p>
              </div>

              <Button
                onClick={handleStartPlayer2}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-cyan-600"
              >
                <Play className="w-5 h-5 mr-2" />
                {challengeConfig.player1Role === 'kid' ? 'Parent' : 'Kid'}'s Turn!
              </Button>
            </motion.div>
          )}

          {/* Player 2 Playing */}
          {phase === 'player2-playing' && questions[currentQuestionIndex] && (
            <motion.div
              key="player2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-4"
            >
              <QuestionCardEnhanced
                question={questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onAnswer={handlePlayer2Answer}
                gameColor={game?.color}
                timedMode={true}
                autoAdvance={true}
                streak={0}
                onTimeBonus={() => {}}
              />
            </motion.div>
          )}

          {/* Player 2 Reveal */}
          {phase === 'player2-reveal' && (
            <DramaticReveal
              gameId={challengeConfig.gameId}
              score={player2Score.correct}
              total={questions.length}
              onComplete={handlePlayer2RevealComplete}
            />
          )}

          {/* Results */}
          {phase === 'results' && (
            <ParentKidResults
              gameId={challengeConfig.gameId}
              player1={{
                role: challengeConfig.player1Role,
                score: player1Score.correct,
                percentage: player1Percentage
              }}
              player2={{
                role: challengeConfig.player1Role === 'kid' ? 'parent' : 'kid',
                score: player2Score.correct,
                percentage: player2Percentage
              }}
              total={questions.length}
              onPlayAgain={handlePlayAgain}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}