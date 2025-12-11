import React from 'react';
import { Sparkles, Play } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { emitEvent } from '@/services/telemetry';

export default function DailyDropCard({ drop }) {
  const navigate = useNavigate();
  if (!drop) return null;
  const handlePlay = () => {
    if (drop.items && drop.items.length > 0) {
      emitEvent('cta_click', { cta: 'daily_drop_play', gameId: drop.items[0].game_id });
      navigate(createPageUrl('Gameplay') + `?gameId=${drop.items[0].game_id}`);
    }
  };
  return (
    <div className="card-3d card-3d-blue p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#1CB0F6]/20 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-[#1CB0F6]" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#1CB0F6] uppercase">Daily Drop</p>
          <h3 className="font-black text-[#3C3C3C] text-lg">{drop.title || 'Daily Drop'}</h3>
          <p className="text-sm text-[#777777] font-semibold">{drop.description || 'Blended 90s-120s pack'}</p>
          {drop.last_rotation && (
            <p className="text-[11px] text-[#AFAFAF]">Last updated: {new Date(drop.last_rotation).toLocaleString()}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap text-xs text-[#3C3C3C] font-semibold">
        {drop.items?.map((item, idx) => (
          <span key={`${item.game_id}-${idx}`} className="px-3 py-1 rounded-full bg-white border border-[#E5E0DA]">
            {item.game_id}
          </span>
        ))}
      </div>
      <button
        onClick={handlePlay}
        className="btn-3d btn-3d-lime w-full py-3 flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4" /> Play first game
      </button>
    </div>
  );
}
