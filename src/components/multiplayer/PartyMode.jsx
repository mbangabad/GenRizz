import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, Check, Play, Crown, Loader2, X } from 'lucide-react';
// PartyMode - no base44 dependencies needed
import { GAMES } from '@/components/constants/games';

// Generate 6-character room code
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array(6).fill(null).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export default function PartyMode({ 
  isOpen, 
  onClose, 
  user,
  onStartGame 
}) {
  const [mode, setMode] = useState('menu'); // menu, create, join, lobby
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const createRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    setPlayers([{ id: user?.id, name: user?.full_name || 'Host', isHost: true, score: null }]);
    setMode('lobby');
  };

  const joinRoom = () => {
    if (inputCode.length !== 6) return;
    setRoomCode(inputCode.toUpperCase());
    setIsHost(false);
    setPlayers([
      { id: 'host', name: 'Host', isHost: true, score: null },
      { id: user?.id, name: user?.full_name || 'Player', isHost: false, score: null }
    ]);
    setMode('lobby');
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoom = () => {
    const text = `🎮 Join my GenRizz party!\n\nRoom Code: ${roomCode}\n\nJoin at genrizz.com`;
    if (navigator.share) {
      navigator.share({ title: 'GenRizz Party', text });
    } else {
      copyCode();
    }
  };

  const startGame = () => {
    if (selectedGame && onStartGame) {
      onStartGame({
        gameId: selectedGame,
        roomCode,
        players,
        isHost,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="card-3d max-w-md w-full p-6 relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center"
        >
          <X className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>

        {/* Menu */}
        {mode === 'menu' && (
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Party Mode</h2>
            <p className="text-[var(--text-secondary)] font-semibold mb-6">Play with friends in real-time!</p>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createRoom}
                className="btn-3d btn-3d-green w-full py-4 text-lg"
              >
                Create Room
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('join')}
                className="btn-3d btn-3d-blue w-full py-4 text-lg"
              >
                Join Room
              </motion.button>
            </div>

            <p className="text-xs text-[var(--text-muted)] font-semibold mt-4">
              2-8 players • Real-time competition
            </p>
          </div>
        )}

        {/* Join */}
        {mode === 'join' && (
          <div className="text-center">
            <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Join Room</h2>
            <p className="text-[var(--text-secondary)] font-semibold mb-6">Enter the 6-digit room code</p>

            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABCD12"
              className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 rounded-xl border-2 border-[var(--border-subtle)] bg-white mb-4"
              maxLength={6}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setMode('menu')}
                className="btn-3d btn-3d-ghost flex-1 py-3"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={joinRoom}
                disabled={inputCode.length !== 6}
                className="btn-3d btn-3d-green flex-1 py-3 disabled:opacity-50"
              >
                Join
              </motion.button>
            </div>
          </div>
        )}

        {/* Lobby */}
        {mode === 'lobby' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-[var(--text-primary)] mb-2">Room Code</h2>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl font-black tracking-[0.3em] text-[var(--brand-blue)]">{roomCode}</span>
                <button
                  onClick={copyCode}
                  className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center"
                >
                  {copied ? <Check className="w-5 h-5 text-[var(--brand-green)]" /> : <Copy className="w-5 h-5 text-[var(--text-secondary)]" />}
                </button>
              </div>
              <button
                onClick={shareRoom}
                className="text-sm text-[var(--brand-blue)] font-bold"
              >
                📤 Share invite link
              </button>
            </div>

            {/* Players */}
            <div className="card-3d p-4 mb-4">
              <p className="text-xs text-[var(--text-secondary)] font-semibold mb-3">PLAYERS ({players.length}/8)</p>
              <div className="space-y-2">
                {players.map((player, i) => (
                  <div key={player.id} className="flex items-center gap-3 p-2 rounded-xl bg-[var(--surface-1)]"
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-hover)] flex items-center justify-center text-white font-bold">
                      {player.name[0]}
                    </div>
                    <span className="font-bold text-[var(--text-primary)] flex-1">{player.name}</span>
                    {player.isHost && (
                      <Crown className="w-5 h-5 text-[var(--brand-yellow)]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Selection (Host only) */}
            {isHost && (
              <div className="mb-4">
                <p className="text-xs text-[var(--text-secondary)] font-semibold mb-2">SELECT GAME</p>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {Object.values(GAMES).slice(0, 6).map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        selectedGame === game.id
                          ? 'bg-[var(--brand-green)]/20 border-2 border-[var(--brand-green)]'
                          : 'bg-[var(--surface-1)] border-2 border-transparent'
                      }`}
                    >
                      <span className="text-2xl">{game.icon}</span>
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">{game.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start Button */}
            {isHost ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                disabled={!selectedGame || players.length < 2}
                className="btn-3d btn-3d-green w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-5 h-5" />
                Start Game
              </motion.button>
            ) : (
              <div className="text-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-blue)] mx-auto mb-2" />
                <p className="text-[var(--text-secondary)] font-semibold">Waiting for host to start...</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}