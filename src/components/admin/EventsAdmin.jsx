import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Save, Plus, Sparkles } from 'lucide-react';
import { logAdminAction } from '@/services/telemetry';
import mockSpotlight from '@/components/constants/events/mockSpotlight.json';
import mockDailyDrop from '@/components/constants/events/mockDailyDrop.json';

const EVENTS_TABLE = import.meta.env.VITE_EVENTS_TABLE || 'events_playlist';
const DAILY_TABLE = 'daily_drop';

const canUseSupabase = () => Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
const SEED_EVENTS = mockSpotlight;
const SEED_DAILY = { id: 'daily-drop', ...mockDailyDrop, active: true };

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [draft, setDraft] = useState({ title: '', description: '', emoji: '✨', active: true, games: '[]' });

  const load = async () => {
    if (!canUseSupabase()) {
      setStatus('Supabase env missing');
      return;
    }
    setLoading(true);
    try {
      const { data: evts } = await supabase.from(EVENTS_TABLE).select('*').order('created_at', { ascending: false });
      const { data: drop } = await supabase.from(DAILY_TABLE).select('*').order('updated_at', { ascending: false }).limit(1);
      setEvents(evts || []);
      setDaily(drop?.[0] || null);
      setStatus('Loaded from Supabase');
    } catch (e) {
      console.warn('Events load failed', e);
      setStatus(`Load failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upsertEvent = async (evt) => {
    if (!canUseSupabase()) return;
    setLoading(true);
    try {
      const payload = { ...evt, games: Array.isArray(evt.games) ? evt.games : [] };
      const { error } = await supabase.from(EVENTS_TABLE).upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      setStatus('Event saved');
      await load();
    } catch (e) {
      setStatus(`Save failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleEvent = (evt) => upsertEvent({ ...evt, active: !evt.active });

  const saveDraft = async () => {
    let gamesArr = [];
    try {
      gamesArr = JSON.parse(draft.games || '[]');
      if (!Array.isArray(gamesArr)) gamesArr = [];
    } catch {
      gamesArr = [];
    }
    await upsertEvent({
      title: draft.title || 'Untitled Playlist',
      description: draft.description || '',
      emoji: draft.emoji || '✨',
      active: draft.active,
      games: gamesArr,
    });
    setDraft({ title: '', description: '', emoji: '✨', active: true, games: '[]' });
    logAdminAction('events_save_playlist', { title: draft.title, active: draft.active });
  };

  const saveDaily = async (payload) => {
    if (!canUseSupabase()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from(DAILY_TABLE).upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      setStatus('Daily Drop saved');
      logAdminAction('events_save_daily', { id: payload.id || payload.title, active: payload.active });
      await load();
    } catch (e) {
      setStatus(`Daily save failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const seedDemo = async () => {
    if (!canUseSupabase()) {
      setStatus('Supabase env missing');
      return;
    }
    setLoading(true);
    try {
      const { error: evtErr } = await supabase.from(EVENTS_TABLE).upsert(SEED_EVENTS, { onConflict: 'id' });
      if (evtErr) throw evtErr;
      const { error: dailyErr } = await supabase.from(DAILY_TABLE).upsert(SEED_DAILY, { onConflict: 'id' });
      if (dailyErr) throw dailyErr;
      setStatus('Seeded demo playlists and daily drop');
      logAdminAction('events_seed_demo');
      await load();
    } catch (e) {
      setStatus(`Seed failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-3d p-5 bg-white border border-[#E5E0DA] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-[#3C3C3C]">Events & Daily Drop</h3>
          <p className="text-xs text-[#777777]">CRUD against Supabase tables ({EVENTS_TABLE}, {DAILY_TABLE}).</p>
          <p className="text-[11px] text-[#777777]">Status: {loading ? 'Working…' : status}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={seedDemo} disabled={loading} className="btn-3d btn-3d-ghost px-3 py-2 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Seed demo
          </button>
          <button onClick={load} disabled={loading} className="btn-3d btn-3d-ghost px-3 py-2 text-xs flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="p-3 bg-[#F7F4F0] rounded-xl border border-[#E5E0DA]">
            <h4 className="font-bold text-sm text-[#3C3C3C] mb-2">Playlists</h4>
            {events.length === 0 && <p className="text-xs text-[#AFAFAF]">No events yet.</p>}
            <div className="space-y-2">
              {events.map((evt) => (
                <div key={evt.id || evt.title} className="border rounded-lg px-3 py-2 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-[#3C3C3C]">{evt.emoji || '✨'} {evt.title}</p>
                    <p className="text-[11px] text-[#777777]">{evt.description}</p>
                    <p className="text-[11px] text-[#58CC02]">{Array.isArray(evt.games) ? evt.games.join(', ') : ''}</p>
                  </div>
                  <button
                    onClick={() => toggleEvent(evt)}
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      evt.active ? 'bg-[#58CC02]/15 text-[#58CC02]' : 'bg-[#E5E0DA] text-[#777777]'
                    }`}
                  >
                    {evt.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#F7F4F0] rounded-xl border border-[#E5E0DA] space-y-2">
            <h4 className="font-bold text-sm text-[#3C3C3C] mb-1">New Playlist</h4>
            <input
              className="w-full text-sm px-3 py-2 rounded border border-[#E5E0DA]"
              placeholder="Title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <input
              className="w-full text-sm px-3 py-2 rounded border border-[#E5E0DA]"
              placeholder="Emoji"
              value={draft.emoji}
              onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
            />
            <textarea
              className="w-full text-sm px-3 py-2 rounded border border-[#E5E0DA]"
              placeholder="Description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
            <textarea
              className="w-full text-sm px-3 py-2 rounded border border-[#E5E0DA] font-mono"
              placeholder='Games JSON e.g. ["gen-z-fluency"]'
              value={draft.games}
              onChange={(e) => setDraft({ ...draft, games: e.target.value })}
            />
            <label className="flex items-center gap-2 text-xs font-bold text-[#3C3C3C]">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              />
              Active
            </label>
            <button
              onClick={saveDraft}
              disabled={loading}
              className="btn-3d btn-3d-green px-3 py-2 text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Save Playlist
            </button>
          </div>
        </div>

        <div className="p-3 bg-[#F7F4F0] rounded-xl border border-[#E5E0DA] space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#3C3C3C]">Daily Drop</h4>
            <button
              onClick={() => daily && saveDaily({ ...daily, active: !daily.active })}
              disabled={!daily || loading}
              className="text-xs font-bold px-2 py-1 rounded bg-white border border-[#E5E0DA]"
            >
              {daily?.active ? 'Disable' : 'Enable'}
            </button>
          </div>
          <input
            className="w-full text-sm px-3 py-2 rounded border border-[#E5E0DA]"
            placeholder="Title"
            value={daily?.title || ''}
            onChange={(e) => setDaily({ ...(daily || {}), title: e.target.value })}
          />
          <textarea
            className="w-full text-sm px-3 py-2 rounded border border-[#E5E0DA]"
            placeholder="Description"
            value={daily?.description || ''}
            onChange={(e) => setDaily({ ...(daily || {}), description: e.target.value })}
          />
          <label className="flex items-center gap-2 text-xs font-bold text-[#3C3C3C]">
            <input
              type="checkbox"
              checked={Boolean(daily?.active)}
              onChange={(e) => setDaily({ ...(daily || {}), active: e.target.checked })}
            />
            Active
          </label>
          <button
            onClick={() => daily && saveDaily(daily)}
            disabled={!daily || loading}
            className="btn-3d btn-3d-green px-3 py-2 text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Daily Drop
          </button>
        </div>
      </div>
    </div>
  );
}
