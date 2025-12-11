import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { getFlags, setFlagOverride, clearFlagOverride, clearAllFlagOverrides, getFlagOverrides, fetchRemoteFlags, pushRemoteFlags } from '@/services/flags';
import { supabase } from '@/lib/supabase';
import { logAdminAction } from '@/services/telemetry';

const FLAG_DESCRIPTIONS = {
  BLITZ: 'Enable Blitz timed mode selection.',
  REMATCH: 'Enable rematch deep links/buttons.',
  SWIPE: 'Enable swipe/hot takes mechanics.',
  DAILY_DROP: 'Enable Daily Drop blended playlist.',
  ADS_RECOVERY_ONLY: 'Show rewarded ads in recovery moments (guarded).',
  EVENTS: 'Enable Spotlight/Events surfaces.',
  ROAST_YOURSELF: 'Enable Roast Yourself mode.',
};
const SEED_ROWS = Object.keys(FEATURE_FLAGS).map((key) => ({ key, value: true }));
const REMOTE_TABLE = import.meta.env.VITE_FEATURE_FLAGS_TABLE || 'feature_flags';
const canUseSupabase = () => Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function FlagPreviewPanel() {
  const [flags, setFlags] = useState(getFlags());
  const [overrides, setOverrides] = useState(getFlagOverrides());
  const [status, setStatus] = useState({ source: 'local', message: 'Local overrides only' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFlags(getFlags());
    setOverrides(getFlagOverrides());
  }, []);

  const handleToggle = (key) => {
    const next = !flags[key];
    setFlags(setFlagOverride(key, next));
    setOverrides(getFlagOverrides());
  };

  const handleClear = (key) => {
    setFlags(clearFlagOverride(key));
    setOverrides(getFlagOverrides());
  };

  const handleClearAll = () => {
    setFlags(clearAllFlagOverrides());
    setOverrides(getFlagOverrides());
  };

  const handleSyncFromRemote = async () => {
    setLoading(true);
    const res = await fetchRemoteFlags();
    setFlags(res.flags);
    setOverrides(getFlagOverrides());
    setStatus({ source: res.source, message: res.message || 'Synced from Supabase' });
    logAdminAction('flags_sync_from_remote', { source: res.source });
    setLoading(false);
  };

  const handleSyncToRemote = async () => {
    setLoading(true);
    const res = await pushRemoteFlags();
    setStatus({ source: res.source, message: res.message || 'Pushed to Supabase' });
    logAdminAction('flags_push_remote', { source: res.source });
    setLoading(false);
  };

  const handleSeedDefaults = async () => {
    if (!canUseSupabase()) {
      setStatus({ source: 'local', message: 'Supabase env missing' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from(REMOTE_TABLE).upsert(SEED_ROWS, { onConflict: 'key' });
      if (error) throw error;
      const res = await fetchRemoteFlags();
      setFlags(res.flags);
      setOverrides(getFlagOverrides());
      setStatus({ source: 'supabase', message: 'Seeded defaults' });
      logAdminAction('flags_seed_defaults');
    } catch (e) {
      setStatus({ source: 'supabase', message: `Seed failed: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-3d p-5 bg-white border border-[#E5E0DA] shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-black text-[#3C3C3C]">Feature Flags (Preview)</h3>
          <p className="text-xs text-[#777777]">
            Local overrides + optional Supabase sync. Env defaults remain unchanged.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSyncFromRemote}
            disabled={loading}
            className="btn-3d btn-3d-ghost px-3 py-2 text-xs"
          >
            Sync ↓
          </button>
          <button
            onClick={handleSyncToRemote}
            disabled={loading}
            className="btn-3d btn-3d-green px-3 py-2 text-xs"
          >
            Push ↑
          </button>
          <button
            onClick={handleSeedDefaults}
            disabled={loading}
            className="btn-3d btn-3d-ghost px-3 py-2 text-xs"
          >
            Seed defaults
          </button>
          <button onClick={handleClearAll} className="btn-3d btn-3d-ghost px-3 py-2 text-xs">Clear all</button>
        </div>
      </div>
      <p className="text-[11px] text-[#777777] mb-2">
        Status: {loading ? 'Syncing…' : `${status.source}${status.message ? ` • ${status.message}` : ''}`}
      </p>
      <div className="space-y-3">
        {Object.keys(FEATURE_FLAGS).map((key) => (
          <div key={key} className="flex items-center justify-between border rounded-xl px-3 py-2">
            <div>
              <p className="font-bold text-sm text-[#3C3C3C]">{key}</p>
              <p className="text-[11px] text-[#777777]">{FLAG_DESCRIPTIONS[key] || 'Feature toggle'}</p>
              {overrides[key] !== undefined && (
                <p className="text-[11px] text-[#58CC02]">Override active ({overrides[key] ? 'on' : 'off'})</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {overrides[key] !== undefined && (
                <button onClick={() => handleClear(key)} className="text-xs text-[#AFAFAF] hover:text-[#3C3C3C]">Reset</button>
              )}
              <Switch checked={Boolean(flags[key])} onCheckedChange={() => handleToggle(key)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
