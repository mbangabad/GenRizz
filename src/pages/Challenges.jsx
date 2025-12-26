import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { Friendship, Challenge } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES } from '@/components/constants/games';
import ChallengeCard from '@/components/challenge/ChallengeCard';
import CreateChallengeModal from '@/components/challenge/CreateChallengeModal';
import { Swords, Plus, Trophy, Crown, ArrowLeft, Home, Clock, XCircle } from 'lucide-react';

export default function Challenges() {
  const [user, setUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [preselectedChallenge, setPreselectedChallenge] = useState(null);
  const queryClient = useQueryClient();

  // Parse URL params for direct challenge creation
  const urlParams = new URLSearchParams(window.location.search);
  const challengedIdFromUrl = urlParams.get('challengedId');
  const gameIdFromUrl = urlParams.get('gameId');

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  // Fetch friend info if challengedId is in URL
  const { data: friendships = [] } = useQuery({
    queryKey: ['friendships', user?.id],
    queryFn: () => Friendship.filter({ user_id: user?.id, status: 'accepted' }),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (challengedIdFromUrl && user && friendships.length > 0) {
      const friend = friendships.find(f => f.friend_id === challengedIdFromUrl);
      if (friend) {
        setPreselectedChallenge({ friend, gameId: gameIdFromUrl });
        setShowCreateModal(true);
      }
    }
  }, [challengedIdFromUrl, gameIdFromUrl, user, friendships]);

  const { data: allChallenges = [], isLoading } = useQuery({
    queryKey: ['challenges', user?.id],
    queryFn: async () => {
      const [sent, received] = await Promise.all([
        Challenge.filter({ challenger_id: user?.id }),
        Challenge.filter({ challenged_id: user?.id }),
      ]);
      const openChallenges = await Challenge.filter({ challenged_id: null });
      const open = openChallenges.filter(c => c.challenger_id !== user?.id);
      return [...sent, ...received, ...open].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!user?.id,
  });

  const acceptMutation = useMutation({
    mutationFn: (c) => Challenge.update(c.id, { status: 'accepted', challenged_id: user.id, challenged_name: user.full_name }),
    onSuccess: () => queryClient.invalidateQueries(['challenges']),
  });

  const declineMutation = useMutation({
    mutationFn: (c) => Challenge.update(c.id, { status: 'declined' }),
    onSuccess: () => queryClient.invalidateQueries(['challenges']),
  });

  const filtered = allChallenges.filter(c => {
    if (statusFilter === 'pending') return c.status === 'pending' || c.status === 'accepted';
    if (statusFilter === 'completed') return ['completed', 'expired', 'declined'].includes(c.status);
    return true;
  });

  const received = filtered.filter(c => c.challenged_id === user?.id || (!c.challenged_id && c.challenger_id !== user?.id));
  const sent = filtered.filter(c => c.challenger_id === user?.id);
  const wins = allChallenges.filter(c => c.winner_id === user?.id).length;
  const losses = allChallenges.filter(c => c.status === 'completed' && c.winner_id && c.winner_id !== user?.id).length;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--page-bg)]">
        <div className="card-3d p-8 text-center max-w-sm">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-hover)] flex items-center justify-center text-4xl mb-6 shadow-lg" style={{ boxShadow: '0 4px 0 var(--brand-orange-dark)' }}>⚔️</div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Sign In Required</h2>
          <p className="text-[var(--text-secondary)] font-semibold mb-6">Sign in to challenge friends</p>
          <button onClick={() => auth.redirectToLogin()} className="btn-3d btn-3d-green w-full py-4">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[var(--page-bg)]">
      <header className="glass-header px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')}>
              <button className="w-10 h-10 rounded-xl bg-white border-2 border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors">
                <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </Link>
            <Swords className="w-6 h-6 text-[var(--brand-orange)]" />
            <h1 className="text-xl font-black text-[var(--text-primary)]">Challenges</h1>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn-3d btn-3d-green px-4 py-2 text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="card-3d card-3d-green p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-1 text-[var(--brand-green)]" />
            <p className="text-2xl font-black text-[var(--text-primary)]">{wins}</p>
            <p className="text-xs text-[var(--text-secondary)] font-semibold">Wins</p>
          </div>
          <div className="card-3d card-3d-red p-4 text-center">
            <XCircle className="w-6 h-6 mx-auto mb-1 text-[var(--brand-red)]" />
            <p className="text-2xl font-black text-[var(--text-primary)]">{losses}</p>
            <p className="text-xs text-[var(--text-secondary)] font-semibold">Losses</p>
          </div>
          <div className="card-3d card-3d-yellow p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-1 text-[var(--brand-yellow)]" />
            <p className="text-2xl font-black text-[var(--text-primary)]">{allChallenges.filter(c => ['pending', 'accepted'].includes(c.status)).length}</p>
            <p className="text-xs text-[var(--text-secondary)] font-semibold">Pending</p>
          </div>
        </div>

        <div className="flex gap-2">
          {['all', 'pending', 'completed'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      statusFilter === f 
                        ? 'bg-[var(--brand-blue)] text-white shadow-md' 
                        : 'bg-white border-2 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    style={statusFilter === f ? { boxShadow: '0 3px 0 var(--brand-blue-dark)' } : {}}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {received.length > 0 && (
          <div>
            <h2 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Swords className="w-5 h-5 text-[var(--brand-orange)]" /> Received
            </h2>
            <div className="space-y-3">
              {received.map(c => <ChallengeCard key={c.id} challenge={c} userId={user.id} onAccept={acceptMutation.mutate} onDecline={declineMutation.mutate} />)}
            </div>
          </div>
        )}

        {sent.length > 0 && (
          <div>
            <h2 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--brand-purple)]" /> Sent
            </h2>
            <div className="space-y-3">
              {sent.map(c => <ChallengeCard key={c.id} challenge={c} userId={user.id} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="card-3d p-8 text-center">
            <Swords className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
            <p className="text-[var(--text-secondary)] font-semibold">No challenges yet</p>
            <button onClick={() => setShowCreateModal(true)} className="btn-3d btn-3d-green mt-4 px-6 py-3">Create Challenge</button>
          </div>
        )}
      </main>

      {/* Navigation handled by Layout */}

      <CreateChallengeModal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          setPreselectedChallenge(null);
        }} 
        user={user}
        preSelectedGame={preselectedChallenge?.gameId}
        challengedUser={preselectedChallenge?.friend}
      />
    </div>
  );
}
