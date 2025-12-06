import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Challenge, Score, Notification } from '@/api/entities';
import { GAMES, GAMES_LIST } from '@/components/constants/games';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Send, Link2, Copy, Check, Trophy } from 'lucide-react';

import { createPageUrl } from '@/utils';

export default function CreateChallengeModal({ isOpen, onClose, user, preSelectedGame, preSelectedScore, challengedUser }) {
  const [selectedGame, setSelectedGame] = useState(preSelectedGame || '');
  const [isCreating, setIsCreating] = useState(false);
  const [createdChallenge, setCreatedChallenge] = useState(null);
  const [copied, setCopied] = useState(false);

  const { data: userScores = [] } = useQuery({
    queryKey: ['userScores', user?.id],
    queryFn: () => Score.filter({ user_id: user?.id }).then(scores => 
      scores.sort((a, b) => b.percentage - a.percentage).slice(0, 100)
    ),
    enabled: !!user?.id,
  });

  const getBestScore = (gameId) => {
    const scores = userScores.filter(s => s.game_id === gameId);
    return scores.length ? scores.reduce((best, s) => s.percentage > best.percentage ? s : best) : null;
  };

  const handleCreate = async () => {
    if (!selectedGame) return;
    const bestScore = preSelectedScore || getBestScore(selectedGame);
    if (!bestScore && !preSelectedScore) return;

    setIsCreating(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const created = await Challenge.create({
      challenger_id: user.id,
      challenger_name: user.full_name || 'Anonymous',
      challenged_id: challengedUser?.friend_id || null,
      challenged_name: challengedUser?.friend_name || null,
      game_id: selectedGame,
      challenger_score: preSelectedScore?.score || bestScore.score,
      challenger_percentage: preSelectedScore?.percentage || bestScore.percentage,
      target_tier: preSelectedScore?.tier_name || bestScore?.tier_name,
      challenge_code: code,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
    });

    // Send notification to challenged user if specified
    if (challengedUser?.friend_id) {
      await Notification.create({
        user_id: challengedUser.friend_id,
        type: 'challenge_received',
        title: 'New Challenge! ⚔️',
        message: `${user.full_name || 'Someone'} challenged you to beat ${preSelectedScore?.percentage || bestScore.percentage}% on ${game.title}!`,
        from_user_id: user.id,
        from_user_name: user.full_name,
        related_id: created.id,
        action_url: createPageUrl('Challenges'),
      }).catch(() => {});
    }

    setCreatedChallenge({ ...created, challenge_code: code });
    setIsCreating(false);
  };

  const BASE_URL = import.meta.env.VITE_APP_URL || window.location.origin;
  const getChallengeUrl = () => `${BASE_URL}?challenge=${createdChallenge?.challenge_code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(getChallengeUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const game = GAMES[createdChallenge.game_id];
    const text = `🔥 I challenge you to beat my ${createdChallenge.challenger_percentage}% on ${game.title}! 48 hours to prove yourself!`;
    if (navigator.share) {
      await navigator.share({ title: 'Roast Yourself Challenge', text, url: getChallengeUrl() }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const resetModal = () => {
    setCreatedChallenge(null);
    setSelectedGame(preSelectedGame || '');
    onClose();
  };

  const game = selectedGame ? GAMES[selectedGame] : null;
  const bestScore = selectedGame ? (preSelectedScore || getBestScore(selectedGame)) : null;

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="border-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-light)', maxWidth: '400px' }}>
        <DialogHeader>
          <DialogTitle className="text-white font-black flex items-center gap-2">
            ⚔️ {createdChallenge ? 'Challenge Created!' : 'Create Challenge'}
          </DialogTitle>
        </DialogHeader>

        {!createdChallenge ? (
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm text-[var(--text-muted)] mb-2 block">Select Game</label>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger style={{ background: 'var(--bg-elevated)' }}>
                  <SelectValue placeholder="Choose a game" />
                </SelectTrigger>
                <SelectContent style={{ background: 'var(--bg-elevated)' }}>
                  {GAMES_LIST.map(g => {
                    const score = getBestScore(g.id);
                    return (
                      <SelectItem key={g.id} value={g.id} disabled={!score && !preSelectedScore}>
                        {g.icon} {g.title} {score && `(${score.percentage}%)`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {game && bestScore && (
              <div className="card-elevated p-4">
                <div className="flex items-center gap-3">
                  <div className="game-icon" style={{ background: game.color }}>{game.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-white">Score to Beat</p>
                    <p className="text-sm text-[var(--text-muted)]">{bestScore.tier_name}</p>
                  </div>
                  <p className="text-2xl font-black text-white">{bestScore.percentage}%</p>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl" style={{ background: 'rgba(255, 150, 0, 0.1)', border: '2px solid rgba(255, 150, 0, 0.3)' }}>
              <p className="text-sm" style={{ color: 'var(--accent-orange)' }}>⏰ Friend has <b>48 hours</b> to beat your score!</p>
            </div>

            <button onClick={handleCreate} disabled={!selectedGame || !bestScore || isCreating} className="btn btn-primary w-full py-4 text-base">
              {isCreating ? 'Creating...' : 'Create Challenge'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(88, 204, 2, 0.2)' }}>
                <Trophy className="w-8 h-8" style={{ color: 'var(--accent-green)' }} />
              </div>
              <p className="text-[var(--text-secondary)]">Share the link with your friend!</p>
            </div>

            <div className="card-elevated p-4">
              <p className="text-xs text-[var(--text-muted)] mb-2">Challenge Link</p>
              <div className="flex gap-2">
                <input type="text" value={getChallengeUrl()} readOnly className="flex-1 px-3 py-2 rounded-lg text-sm text-white truncate" style={{ background: 'var(--bg-primary)' }} />
                <button onClick={handleCopy} className="btn btn-secondary py-2 px-3">
                  {copied ? <Check className="w-4 h-4" style={{ color: 'var(--accent-green)' }} /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button onClick={handleShare} className="btn btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Share Challenge
            </button>
            <button onClick={resetModal} className="btn btn-secondary w-full py-3">Done</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}