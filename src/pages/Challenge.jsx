import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
// Challenge page - already migrated
import { motion } from 'framer-motion';
import { ArrowLeft, Swords, Play, Trophy, Crown, Zap } from 'lucide-react';
import { GAMES, getTier } from '@/components/constants/games';

export default function Challenge() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get challenge code from URL
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const code = urlParams.get('code') || hashParams.get('code');

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    const loadChallenge = async () => {
      if (!code) {
        setError('No challenge code provided');
        setLoading(false);
        return;
      }

      try {
        const challenges = await Challenge.filter({ challenge_code: code });
        if (challenges.length === 0) {
          setError('Challenge not found');
        } else {
          setChallenge(challenges[0]);
        }
      } catch (e) {
        setError('Failed to load challenge');
      }
      setLoading(false);
    };

    loadChallenge();
  }, [code]);

  const handleAccept = () => {
    if (!user) {
      auth.redirectToLogin(window.location.href);
      return;
    }
    // Navigate to gameplay with challenge context
    navigate(createPageUrl('Gameplay') + `?gameId=${challenge.game_id}&challengeId=${challenge.id}`);
  };

  const game = challenge?.game_id ? GAMES[challenge.game_id] : null;
  const tier = game ? getTier(challenge.game_id, challenge.challenger_percentage || 0) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--brand-green)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !challenge || !game) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center p-4">
        <div className="card-3d p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--brand-red)]/20 flex items-center justify-center text-3xl">
            ❌
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{error || 'Challenge Not Found'}</h2>
          <p className="text-[var(--text-secondary)] font-semibold mb-6">This challenge may have expired or doesn't exist.</p>
          <Link to={createPageUrl('Home')} className="btn-3d btn-3d-green py-3 px-6 inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = challenge.expires_at && new Date(challenge.expires_at) < new Date();
  const isOwn = user?.id === challenge.challenger_id;
  const alreadyCompleted = challenge.status === 'completed';

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Header */}
      <header className="glass-header px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white border-2 border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-[var(--brand-orange)]" />
            <span className="font-bold text-[var(--text-primary)]">Challenge</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 max-w-lg mx-auto">
        {/* Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d card-3d-orange overflow-hidden"
        >
          {/* Game Banner */}
          <div 
            className="h-32 relative flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${game.color}30, ${game.color}10)` }}
          >
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
              style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}CC)`, boxShadow: `0 4px 0 ${game.color}80` }}
            >
              {game.icon}
            </div>
            <div className="absolute top-4 right-4 badge-3d badge-streak">
              ⚔️ CHALLENGE
            </div>
          </div>

          <div className="p-6">
            {/* Challenger Info */}
            <div className="text-center mb-6">
              <p className="text-[var(--text-secondary)] text-sm font-semibold mb-1">Challenged by</p>
              <h2 className="text-2xl font-black text-[var(--text-primary)]">{challenge.challenger_name || 'A Player'}</h2>
            </div>

            {/* Game Info */}
            <div className="card-3d p-4 mb-6">
              <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1">{game.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm font-semibold">{game.subtitle}</p>
            </div>

            {/* Score to Beat */}
            <div className="card-3d card-3d-orange p-4 mb-6">
              <p className="text-center text-[var(--text-secondary)] text-sm font-semibold mb-2">Score to Beat</p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-black text-[var(--brand-orange)]">{challenge.challenger_percentage}%</p>
                  <p className="text-sm text-[var(--text-secondary)] font-semibold">{challenge.challenger_score} correct</p>
                </div>
                {tier && (
                  <div className="text-center">
                    <p className="text-3xl">{tier.emoji}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold">{tier.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* XP Bonus */}
            <div className="badge-3d badge-xp justify-center w-full py-3 mb-6">
              <Zap className="w-5 h-5" />
              <span className="font-bold">2x XP for challenge games!</span>
            </div>

            {/* Actions */}
            {isExpired ? (
              <div className="card-3d p-4 text-center" style={{ background: 'rgba(255,75,75,0.1)', borderColor: 'rgba(255,75,75,0.3)' }}>
                <p className="text-[var(--brand-red)] font-bold">This challenge has expired</p>
              </div>
            ) : isOwn ? (
              <div className="card-3d p-4 text-center">
                <p className="text-[var(--text-secondary)] font-semibold">This is your own challenge</p>
                <p className="text-sm text-[var(--text-muted)] font-semibold mt-1">Share the link with friends!</p>
              </div>
            ) : alreadyCompleted ? (
              <div className="card-3d card-3d-green p-4 text-center">
                <Trophy className="w-8 h-8 text-[var(--brand-green)] mx-auto mb-2" />
                <p className="text-[var(--brand-green)] font-bold">Challenge Completed!</p>
                {challenge.winner_id === user?.id && (
                  <p className="text-[var(--brand-green-dark)] text-sm font-semibold mt-1">You won! 🎉</p>
                )}
              </div>
            ) : (
              <button
                onClick={handleAccept}
                className="btn-3d btn-3d-orange w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                <Play className="w-6 h-6" />
                Accept Challenge
              </button>
            )}

            {!user && !isExpired && !alreadyCompleted && (
              <p className="text-center text-sm text-[var(--text-secondary)] font-semibold mt-3">
                You'll need to sign in to accept this challenge
              </p>
            )}
          </div>
        </motion.div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to={createPageUrl('Home')} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-semibold">
            ← Back to Games
          </Link>
        </div>
      </main>
    </div>
  );
}
