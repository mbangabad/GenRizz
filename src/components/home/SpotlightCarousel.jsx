import React, { useEffect, useState } from 'react';
import { Sparkles, Play } from 'lucide-react';
import { fetchSpotlightPlaylists } from '@/services/events';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { emitEvent } from '@/services/telemetry';

export default function SpotlightCarousel() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpotlightPlaylists().then((data) => {
      setEvents(data);
      if (data && data.length) {
        emitEvent('spotlight_impression', { events: data.map((e) => e.id || e.title) });
      }
    }).catch(() => setEvents([]));
  }, []);

  if (!events || events.length === 0) return null;

  const handlePlay = (event) => {
    const first = event.games?.[0];
    if (!first) return;
    const gameId = typeof first === 'string' ? first : first.game_id || first.id;
    emitEvent('cta_click', { cta: 'spotlight_play', eventId: event.id || event.title, gameId });
    if (gameId) navigate(createPageUrl('Gameplay') + `?gameId=${gameId}`);
  };

  useEffect(() => {
    if (events && events.length) {
      events.forEach((evt) => {
        emitEvent('spotlight_card_impression', { eventId: evt.id || evt.title, games: evt.games?.map((g) => (typeof g === 'string' ? g : g.game_id || g.id)) });
      });
    }
  }, [events]);

  return (
    <div className="card-3d p-5 bg-white border border-[#E5E0DA] space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#9b87f5]" />
        <h3 className="font-black text-[#3C3C3C] text-lg">Spotlight</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {events.map((evt) => (
          <div key={evt.id || evt.title} className="min-w-[220px] card-3d card-3d-interactive p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{evt.emoji || '✨'}</span>
              <div>
                <p className="font-black text-[#3C3C3C]">{evt.title}</p>
                <p className="text-xs text-[#777777]">{evt.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-[#3C3C3C] font-semibold mb-3">
              {evt.games?.map((g, idx) => {
                const id = typeof g === 'string' ? g : g.game_id || g.id || `item-${idx}`;
                return (
                  <span key={`${id}-${idx}`} className="px-2 py-1 rounded-full bg-[#F0EDE8] border border-[#E5E0DA]">
                    {id}
                  </span>
                );
              })}
            </div>
            <button
              onClick={() => handlePlay(evt)}
              className="btn-3d btn-3d-lime w-full py-2 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Play spotlight
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
