import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Plus, Trash2, Copy, DownloadCloud, UploadCloud } from 'lucide-react';
import { getEffectiveSafetyLists, addWhitelistTerm, removeWhitelistTerm, syncWhitelistFromRemote, syncWhitelistToRemote, seedWhitelistDefaults } from '@/services/contentSafety';
import { Sparkles } from 'lucide-react';
import { logAdminAction } from '@/services/telemetry';

export default function ContentSafetyPanel() {
  const [lists, setLists] = useState(getEffectiveSafetyLists());
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState({ source: 'local', message: 'Local overrides active' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLists(getEffectiveSafetyLists());
  }, []);

  const handleAdd = () => {
    setLists(addWhitelistTerm(input));
    setInput('');
  };

  const handleRemove = (term) => {
    setLists(removeWhitelistTerm(term));
  };

  const handleSyncFromRemote = async () => {
    setLoading(true);
    const res = await syncWhitelistFromRemote();
    setLists(getEffectiveSafetyLists());
    setStatus({ source: res.source, message: res.message || 'Synced from Supabase' });
    setToast(res.ok ? 'Synced from Supabase' : `Sync failed: ${res.message || 'error'}`);
    logAdminAction('safety_sync_from_remote', { source: res.source });
    setLoading(false);
  };

  const handleSyncToRemote = async () => {
    setLoading(true);
    const res = await syncWhitelistToRemote();
    setStatus({ source: res.source, message: res.message || 'Pushed whitelist to Supabase' });
    setToast(res.ok ? 'Pushed whitelist to Supabase' : `Push failed: ${res.message || 'error'}`);
    logAdminAction('safety_push_remote', { source: res.source });
    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(lists.whitelist, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSeedDefaults = async () => {
    setLoading(true);
    const res = await seedWhitelistDefaults();
    setLists(getEffectiveSafetyLists());
    setStatus({ source: res.source, message: res.message || 'Seeded defaults' });
    setToast(res.ok ? 'Seeded defaults' : `Seed failed: ${res.message || 'error'}`);
    logAdminAction('safety_seed_defaults', { source: res.source });
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card-3d p-5 bg-white border shadow-sm" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-red) 10%, transparent)' }}>
            <ShieldAlert className="w-5 h-5" style={{ color: 'var(--brand-red)' }} />
          </div>
          <div>
            <h3 className="font-black" style={{ color: 'var(--text-primary)' }}>Banned Terms</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Hard block (fail validation) and soft (warn) lists.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Hard Banned</p>
            <div className="flex flex-wrap gap-2">
              {lists.hard.map((term) => (
                <span key={term} className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-red) 10%, transparent)', color: 'var(--brand-red)' }}>
                  {term}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Warn-Only</p>
            {lists.soft.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No warn-only terms configured.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {lists.soft.map((term) => (
                  <span key={term} className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-yellow) 15%, transparent)', color: '#C27B00' }}>
                    {term}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
          Validator reads these lists plus any whitelist (see right). To persist pipeline changes, update <code>src/config/contentSafety.js</code> or <code>src/config/bannedWhitelist.json</code>.
        </p>
      </div>

      <div className="card-3d p-5 bg-white border shadow-sm" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-green) 10%, transparent)' }}>
            <ShieldCheck className="w-5 h-5" style={{ color: 'var(--brand-green)' }} />
          </div>
          <div>
            <h3 className="font-black" style={{ color: 'var(--text-primary)' }}>Whitelist (admin)</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Terms you approve even if they match banned lists.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add term to whitelist"
            className="flex-1 px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: 'var(--border-subtle)' }}
          />
          <button onClick={handleAdd} className="btn-3d btn-3d-green px-3 py-2 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {lists.whitelist.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No whitelist terms yet.</p>
          )}
          {lists.whitelist.map((term) => (
            <span key={term} className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-green) 10%, transparent)', color: 'var(--brand-green)' }}>
              {term}
              <button onClick={() => handleRemove(term)} className="hover:opacity-75" style={{ color: 'var(--brand-green)' }}>
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={handleCopy} className="btn-3d btn-3d-ghost px-3 py-2 text-sm flex items-center gap-2">
            <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy whitelist JSON'}
          </button>
          <p className="text-[11px] flex items-center" style={{ color: 'var(--text-muted)' }}>
            Paste into <code>src/config/bannedWhitelist.json</code> to sync with validator/CI.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <button
            onClick={handleSyncFromRemote}
            disabled={loading}
            className="btn-3d btn-3d-ghost px-3 py-2 text-sm flex items-center gap-2"
          >
            <DownloadCloud className="w-4 h-4" /> Sync from Supabase
          </button>
          <button
            onClick={handleSyncToRemote}
            disabled={loading}
            className="btn-3d btn-3d-green px-3 py-2 text-sm flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" /> Push to Supabase
          </button>
          <button
            onClick={handleSeedDefaults}
            disabled={loading}
            className="btn-3d btn-3d-ghost px-3 py-2 text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Seed defaults
          </button>
          <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            Status: {loading ? 'Syncing...' : `${status.source} ${status.message ? `• ${status.message}` : ''}`}
          </span>
        </div>

        {toast && (
          <div className="mt-3 text-[11px] font-bold px-3 py-2 rounded-lg" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--surface-2)' }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
