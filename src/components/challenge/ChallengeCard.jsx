import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES } from '@/components/constants/games';
import { Clock, Trophy, Play, XCircle, Swords } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ChallengeCard({ challenge, userId, onAccept, onDecline }) {
  const game = GAMES[challenge.game_id];
  const isChallenger = challenge.challenger_id === userId;
  const isChallenged = challenge.challenged_id === userId || (!challenge.challenged_id && !isChallenger);
  const isExpired = new Date(challenge.expires_at) < new Date();
  const timeLeft = !isExpired ? formatDistanceToNow(new Date(challenge.expires_at), { addSuffix: true }) : 'Expired';

  const getStatus = () => {
    if (challenge.status === 'completed') {
      const won = challenge.winner_id === userId;
      return { text: won ? '🏆 Won' : '😅 Lost', color: won ? '#58CC02' : '#FF4B4B', bg: won ? 'rgba(88,204,2,0.15)' : 'rgba(255,75,75,0.15)' };
    }
    if (challenge.status === 'expired' || isExpired) return { text: '⏰ Expired', color: '#AFAFAF', bg: 'rgba(175,175,175,0.15)' };
    if (challenge.status === 'declined') return { text: 'Declined', color: '#FF4B4B', bg: 'rgba(255,75,75,0.15)' };
    if (challenge.status === 'accepted') return { text: 'In Progress', color: '#1CB0F6', bg: 'rgba(28,176,246,0.15)' };
    return { text: '⏳ Pending', color: '#FFC800', bg: 'rgba(255,200,0,0.15)' };
  };

  const status = getStatus();
  if (!game) return null;

  return (
    <div className="card-3d p-4">
      <div className="flex items-start gap-4">
        <div className="game-icon-3d game-icon-md" style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}CC)`, boxShadow: `0 4px 0 ${game.color}80` }}>{game.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: status.bg, color: status.color }}>
              {status.text}
            </span>
            {challenge.status === 'pending' && !isExpired && (
              <span className="text-xs text-[#AFAFAF] font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {timeLeft}
              </span>
            )}
          </div>
          <h3 className="font-bold text-[#3C3C3C]">{game.title}</h3>
          <p className="text-sm text-[#777777] font-semibold flex items-center gap-1">
            <Swords className="w-3 h-3" />
            {isChallenger ? `You challenged ${challenge.challenged_name || 'Anyone'}` : `${challenge.challenger_name} challenged you`}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span className="text-[#777777] font-semibold">Beat: <b className="text-[#3C3C3C]">{challenge.challenger_percentage}%</b></span>
            {challenge.status === 'completed' && challenge.challenged_percentage && (
              <span className="text-[#777777] font-semibold">Result: <b className="text-[#3C3C3C]">{challenge.challenged_percentage}%</b></span>
            )}
          </div>
        </div>
      </div>

      {isChallenged && challenge.status === 'pending' && !isExpired && (
        <div className="flex gap-2 mt-4">
          <Link to={createPageUrl(`GamePlay?gameId=${challenge.game_id}&challengeId=${challenge.id}`)} className="flex-1">
            <button onClick={() => onAccept?.(challenge)} className="btn-3d btn-3d-green w-full py-3 text-sm flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> Accept
            </button>
          </Link>
          <button onClick={() => onDecline?.(challenge)} className="btn-3d btn-3d-ghost py-3 px-4">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {isChallenger && challenge.status === 'pending' && !isExpired && (
        <p className="text-xs text-center text-[#AFAFAF] font-semibold mt-3">Waiting for response...</p>
      )}
    </div>
  );
}