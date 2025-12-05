import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { UserProgress, Question, Score } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES, getTier, getGameLevel, calculateXpEarned } from '@/components/constants/games';
import { getQuestionsForGame } from '@/components/constants/questions';
import { ArrowLeft, Zap, Home, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import WouldYouRather from '@/components/game/WouldYouRather';
import SliderQuestion from '@/components/game/SliderQuestion';
import ScenarioSwipe from '@/components/game/ScenarioSwipe';
import RankingQuestion from '@/components/game/RankingQuestion';
import GameIcon from '@/components/home/GameIcon';
import Mascot, { CelebrationMascot } from '@/components/ui/Mascot';
import ShareableResultCard from '@/components/share/ShareableResultCard';

export default function OpinionGameplay() {
  const [gameId, setGameId] = useState(null);
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [vibeScore, setVibeScore] = useState(0);
  
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

  const { data: allQuestions = [], isLoading } = useQuery({
    queryKey: ['questions', gameId],
    queryFn: () => getQuestionsForGame(gameId),
    enabled: !!gameId,
  });

  const currentLevel = getGameLevel(userProgress?.total_xp || 0);

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
    // Shuffle and select 10 questions of mixed types
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setVibeScore(0);
    setGameState('playing');
  };

  const handleAnswer = (answerData) => {
    const newAnswers = [...answers, answerData];
    setAnswers(newAnswers);
    
    // Calculate running vibe score based on crowd matches
    const matchBonus = answerData.matchesCrowd ? 10 : 5;
    setVibeScore(prev => prev + matchBonus);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // End game
      const finalScore = vibeScore + matchBonus;
      const percentage = Math.round((finalScore / (questions.length * 10)) * 100);
      const tier = getTier(gameId, percentage);
      const xpEarned = calculateXpEarned(percentage, currentLevel.level);

      if (user?.id) {
        saveScoreMutation.mutate({
          user_id: user.id, game_id: gameId, score: finalScore, max_score: questions.length * 10,
          percentage, tier_name: tier.name, tier_emoji: tier.emoji, xp_earned: xpEarned,
        });
      }
      setGameState('results');
    }
  };

  const renderQuestion = () => {
    const q = questions[currentIndex];
    if (!q) return null;

    const props = {
      question: q,
      questionNumber: currentIndex + 1,
      totalQuestions: questions.length,
      onAnswer: handleAnswer,
    };

    switch (q.type) {
      case 'would-you-rather':
        return <WouldYouRather {...props} />;
      case 'slider':
        return <SliderQuestion {...props} />;
      case 'scenario-swipe':
        return <ScenarioSwipe {...props} />;
      case 'ranking':
        return <RankingQuestion {...props} />;
      default:
        return <ScenarioSwipe {...props} />;
    }
  };

  // Loading state
  if (!gameId || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-10 h-10 animate-spin text-[#58CC02]" />
      </div>
    );
  }

  const percentage = Math.round((vibeScore / (questions.length * 10 || 1)) * 100);
  const tier = getTier(gameId, percentage);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
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
              <p className="text-xs text-[#AFAFAF] font-semibold">Opinion-based • No wrong answers</p>
            </div>
          </div>
          <div className="badge-3d badge-xp">
            <Zap className="w-4 h-4" />
            <span>{userProgress?.total_xp || 0}</span>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {/* Intro */}
        {gameState === 'intro' && (
          <div className="text-center py-8 space-y-6">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
            >
              <GameIcon gameId={gameId} size="xl" className="mx-auto" />
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-black text-[#3C3C3C]">{game.title}</h2>
              <p className="text-[#777777] mt-2 font-semibold">{game.description}</p>
            </div>

            <div className="card-3d card-3d-green p-4">
              <p className="font-bold text-[#3C3C3C]">✨ No right or wrong answers!</p>
              <p className="text-sm text-[#777777] mt-1">See how your vibes compare to the crowd</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="card-3d p-3">
                <span className="text-2xl block mb-1">🤔</span>
                <span className="font-bold text-[#3C3C3C]">Would You Rather</span>
              </div>
              <div className="card-3d p-3">
                <span className="text-2xl block mb-1">📊</span>
                <span className="font-bold text-[#3C3C3C]">Rate & Rank</span>
              </div>
              <div className="card-3d p-3">
                <span className="text-2xl block mb-1">✨</span>
                <span className="font-bold text-[#3C3C3C]">Vibe Checks</span>
              </div>
              <div className="card-3d p-3">
                <span className="text-2xl block mb-1">🎯</span>
                <span className="font-bold text-[#3C3C3C]">Crowd Comparison</span>
              </div>
            </div>

            {isLoading ? (
              <button className="btn-3d btn-3d-ghost w-full py-4" disabled>
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="btn-3d btn-3d-lime w-full py-5 text-xl"
              >
                START VIBE CHECK ✨
              </motion.button>
            )}
          </div>
        )}

        {/* Playing */}
        {gameState === 'playing' && renderQuestion()}

        {/* Results */}
        {gameState === 'results' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-4"
          >
            <div className="flex justify-center">
              <CelebrationMascot />
            </div>

            <ShareableResultCard
              gameId={gameId}
              percentage={percentage}
              score={vibeScore}
              totalQuestions={questions.length * 10}
              percentile={Math.min(95, percentage + Math.floor(Math.random() * 10))}
              streak={0}
              userId={user?.id}
              userName={user?.full_name}
            />

            <div className="card-3d card-3d-green p-5 text-center">
              <p className="text-4xl mb-2">{tier.emoji}</p>
              <h3 className="text-xl font-black text-[#3C3C3C]">{tier.name}</h3>
              <p className="text-[#777777] font-semibold mt-1">{tier.message}</p>
              {tier.roast && (
                <p className="text-sm text-[#AFAFAF] mt-2 italic">"{tier.roast}"</p>
              )}
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
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
          </motion.div>
        )}
      </main>
    </div>
  );
}