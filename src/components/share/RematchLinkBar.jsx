import React, { useEffect, useMemo, useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { createRematchChallenge } from '@/services/rematch';
import { emitEvent } from '@/services/telemetry';

export default function RematchLinkBar({ gameId, score, user }) {
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState(null);

  const percentage = useMemo(() => score, [score]);

  useEffect(() => {
    if (!gameId || !user) return;
    const created = createRematchChallenge({ gameId, percentage, user });
    setLink(created?.link || null);
  }, [gameId, percentage, user]);

  if (!gameId || !user || !link) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      emitEvent('cta_click', { cta: 'rematch_copy', gameId, percentage });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="card-3d p-3 bg-white border border-[#E5E0DA] flex items-center gap-3">
      <div className="flex-1">
        <p className="text-xs font-bold text-[#AFAFAF] uppercase">Rematch Link</p>
        <p className="text-sm text-[#3C3C3C] truncate">{link}</p>
      </div>
      <button onClick={copyLink} className="btn-3d btn-3d-ghost px-3 py-2 text-sm flex items-center gap-1">
        {copied ? <Check className="w-4 h-4 text-[#58CC02]" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      {navigator.share && (
        <button
          onClick={() => { navigator.share({ title: 'Rematch me', url: link }); emitEvent('cta_click', { cta: 'rematch_share', gameId, percentage }); }}
          className="btn-3d btn-3d-blue px-3 py-2 text-sm flex items-center gap-1"
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
      )}
    </div>
  );
}
