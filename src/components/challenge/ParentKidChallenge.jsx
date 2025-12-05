import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Zap, Trophy, ArrowRight, RotateCcw, Share2, Swords, Baby, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GAMES } from '@/components/constants/games';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

// Games that work well for Parent vs Kid
const FAMILY_GAMES = [
  { id: 'gen-z-fluency', kidAdvantage: true, description: 'Can your parents speak Gen Z?' },
  { id: 'revenge-of-boomers', kidAdvantage: false, description: 'Can you understand Boomer culture?' },
  { id: 'millennial-nostalgia', kidAdvantage: false, description: 'Who knows the 90s/2000s better?' },
  { id: 'emoji-detective', kidAdvantage: true, description: 'Decode emoji meanings!' },
  { id: 'dad-jokes', kidAdvantage: false, description: 'Peak dad humor showdown!' },
  { id: 'y2k-culture', kidAdvantage: false, description: 'Early internet knowledge!' },
];

export default function ParentKidChallenge({ onStartChallenge }) {
  const [step, setStep] = useState('intro'); // intro, select-game, ready
  const [selectedGame, setSelectedGame] = useState(null);
  const [player1Role, setPlayer1Role] = useState('kid'); // kid or parent

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    setStep('ready');
  };

  const startChallenge = () => {
    onStartChallenge({
      gameId: selectedGame,
      mode: 'parent-vs-kid',
      player1Role,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto text-center py-8"
          >
            {/* Hero */}
            <motion.div 
              className="text-6xl mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👨‍👩‍👧‍👦
            </motion.div>
            
            <h1 className="text-3xl font-black mb-2">
              <span className="text-purple-400">Parent</span> vs <span className="text-cyan-400">Kid</span>
            </h1>
            <p className="text-slate-400 mb-8">
              The ultimate generational showdown! Who understands the other generation better?
            </p>

            {/* How it works */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-8 text-left">
              <h3 className="font-bold mb-3 text-center">How it works:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">1</div>
                  <p className="text-sm text-slate-300">Choose a game category</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">2</div>
                  <p className="text-sm text-slate-300">Parent plays first, then kid (or vice versa)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">3</div>
                  <p className="text-sm text-slate-300">Compare scores and share the results!</p>
                </div>
              </div>
            </div>

            {/* Who goes first */}
            <p className="text-sm text-slate-400 mb-3">Who's playing first?</p>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setPlayer1Role('kid')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  player1Role === 'kid' 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-slate-700 bg-slate-800/50'
                }`}
              >
                <Baby className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <p className="font-bold">Kid</p>
              </button>
              <button
                onClick={() => setPlayer1Role('parent')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  player1Role === 'parent' 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-slate-700 bg-slate-800/50'
                }`}
              >
                <User className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="font-bold">Parent</p>
              </button>
            </div>

            <Button
              onClick={() => setStep('select-game')}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
            >
              Choose a Game
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 'select-game' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto py-8"
          >
            <button 
              onClick={() => setStep('intro')}
              className="text-slate-400 mb-4 flex items-center gap-2"
            >
              ← Back
            </button>
            
            <h2 className="text-2xl font-black mb-2 text-center">Pick Your Battleground</h2>
            <p className="text-slate-400 text-center mb-6">Which generation will have the advantage?</p>

            <div className="space-y-3">
              {FAMILY_GAMES.map(fg => {
                const game = GAMES[fg.id];
                if (!game) return null;
                
                return (
                  <motion.button
                    key={fg.id}
                    onClick={() => handleGameSelect(fg.id)}
                    className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all text-left flex items-center gap-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: game.color }}
                    >
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{game.title}</h3>
                        {fg.kidAdvantage ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">Kid Advantage</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">Parent Advantage</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{fg.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 'ready' && selectedGame && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md mx-auto text-center py-8"
          >
            <button 
              onClick={() => setStep('select-game')}
              className="text-slate-400 mb-4 flex items-center gap-2"
            >
              ← Change game
            </button>

            <div className="mb-8">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
                style={{ background: GAMES[selectedGame].color }}
              >
                {GAMES[selectedGame].icon}
              </div>
              <h2 className="text-2xl font-black">{GAMES[selectedGame].title}</h2>
            </div>

            {/* VS Display */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`p-4 rounded-xl ${player1Role === 'kid' ? 'bg-cyan-500/20 border-2 border-cyan-500' : 'bg-slate-800'}`}>
                <Baby className="w-10 h-10 mx-auto mb-2 text-cyan-400" />
                <p className="font-bold text-sm">Kid</p>
                {player1Role === 'kid' && <p className="text-xs text-cyan-400">Goes First</p>}
              </div>
              
              <div className="text-3xl font-black text-slate-500">VS</div>
              
              <div className={`p-4 rounded-xl ${player1Role === 'parent' ? 'bg-purple-500/20 border-2 border-purple-500' : 'bg-slate-800'}`}>
                <User className="w-10 h-10 mx-auto mb-2 text-purple-400" />
                <p className="font-bold text-sm">Parent</p>
                {player1Role === 'parent' && <p className="text-xs text-purple-400">Goes First</p>}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-400">
                <span className="font-bold text-white">{player1Role === 'kid' ? 'Kid' : 'Parent'}</span> will play first. 
                After finishing, pass the phone to <span className="font-bold text-white">{player1Role === 'kid' ? 'Parent' : 'Kid'}</span>!
              </p>
            </div>

            <Button
              onClick={startChallenge}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
            >
              <Swords className="w-5 h-5 mr-2" />
              Start Battle!
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Results comparison component
export function ParentKidResults({ 
  gameId, 
  player1 = { role: 'kid', score: 0, percentage: 0 },
  player2 = { role: 'parent', score: 0, percentage: 0 },
  total = 10,
  onPlayAgain,
  onShare
}) {
  const game = GAMES[gameId];
  const winner = player1.percentage > player2.percentage ? player1 : 
                 player2.percentage > player1.percentage ? player2 : null;
  const isTie = player1.percentage === player2.percentage;

  const generateShareText = () => {
    const kidScore = player1.role === 'kid' ? player1 : player2;
    const parentScore = player1.role === 'parent' ? player1 : player2;
    
    let result = isTie ? "It's a TIE!" : 
                 winner.role === 'kid' ? "KID WINS! 🎉" : "PARENT WINS! 🎉";
    
    return `👨‍👩‍👧‍👦 Parent vs Kid Challenge\n${game.icon} ${game.title}\n\n👶 Kid: ${kidScore.percentage}%\n👨 Parent: ${parentScore.percentage}%\n\n${result}\n\n🎮 rizz.game`;
  };

  const handleShare = async () => {
    const text = generateShareText();
    if (navigator.share) {
      await navigator.share({ title: 'Parent vs Kid Challenge', text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div 
      className="max-w-md mx-auto text-center py-8 px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Winner announcement */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        className="text-6xl mb-4"
      >
        {isTie ? '🤝' : winner?.role === 'kid' ? '🎉' : '👑'}
      </motion.div>

      <h1 className="text-3xl font-black mb-2">
        {isTie ? "It's a TIE!" : `${winner?.role === 'kid' ? 'Kid' : 'Parent'} Wins!`}
      </h1>
      
      <p className="text-slate-400 mb-8">{game.title}</p>

      {/* Score comparison */}
      <div className="flex items-stretch justify-center gap-4 mb-8">
        {[player1, player2].map((player, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`flex-1 p-4 rounded-xl ${
              !isTie && winner?.role === player.role 
                ? 'bg-gradient-to-b from-yellow-500/20 to-transparent border-2 border-yellow-500/50' 
                : 'bg-slate-800/50 border border-slate-700'
            }`}
          >
            <div className="text-3xl mb-2">
              {player.role === 'kid' ? '👶' : '👨'}
            </div>
            <p className="font-bold text-sm mb-2 capitalize">{player.role}</p>
            <div className="text-4xl font-black mb-1" style={{ color: player.role === 'kid' ? '#22d3ee' : '#c084fc' }}>
              {player.percentage}%
            </div>
            <p className="text-xs text-slate-500">{player.score}/{total}</p>
            {!isTie && winner?.role === player.role && (
              <div className="mt-2">
                <Trophy className="w-5 h-5 mx-auto text-yellow-500" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Difference callout */}
      {!isTie && (
        <motion.div 
          className="bg-slate-800/50 rounded-xl p-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm">
            {winner?.role === 'kid' ? (
              <span>The kid won by <span className="font-bold text-cyan-400">{Math.abs(player1.percentage - player2.percentage)}%</span>! Gen Z slang skills on point! 💀</span>
            ) : (
              <span>Parent dominated by <span className="font-bold text-purple-400">{Math.abs(player1.percentage - player2.percentage)}%</span>! Old school wisdom wins! 👑</span>
            )}
          </p>
        </motion.div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleShare}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Results
        </Button>
        
        <Button
          onClick={onPlayAgain}
          variant="outline"
          className="w-full h-12 border-slate-600"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Rematch
        </Button>
        
        <Link to={createPageUrl('Home')} className="block">
          <Button variant="ghost" className="w-full">
            Back to Games
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}