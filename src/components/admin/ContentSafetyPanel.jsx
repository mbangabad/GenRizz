import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Plus, Trash2, Copy, DownloadCloud, UploadCloud } from 'lucide-react';
import { getEffectiveSafetyLists, addWhitelistTerm, removeWhitelistTerm, syncWhitelistFromRemote, syncWhitelistToRemote } from '@/services/contentSafety';

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
    setLoading(false);
  };

  const handleSyncToRemote = async () => {
    setLoading(true);
    const res = await syncWhitelistToRemote();
    setStatus({ source: res.source, message: res.message || 'Pushed whitelist to Supabase' });
    setToast(res.ok ? 'Pushed whitelist to Supabase' : `Push failed: ${res.message || 'error'}`);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card-3d p-5 bg-white border border-[#E5E0DA] shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-[#FF4B4B]" />
          </div>
          <div>
            <h3 className="font-black text-[#3C3C3C]">Banned Terms</h3>
            <p className="text-xs text-[#777777]">Hard block (fail validation) and soft (warn) lists.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-bold text-[#AFAFAF] uppercase mb-2">Hard Banned</p>
            <div className="flex flex-wrap gap-2">
              {lists.hard.map((term) => (
                <span key={term} className="px-3 py-1 rounded-full bg-[#FF4B4B]/10 text-[#FF4B4B] text-xs font-bold">
                  {term}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#AFAFAF] uppercase mb-2">Warn-Only</p>
            {lists.soft.length === 0 ? (
              <p className="text-xs text-[#AFAFAF]">No warn-only terms configured.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {lists.soft.map((term) => (
                  <span key={term} className="px-3 py-1 rounded-full bg-[#FFC800]/15 text-[#C27B00] text-xs font-bold">
                    {term}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-[#AFAFAF] mt-4">
          Validator reads these lists plus any whitelist (see right). To persist pipeline changes, update <code>src/config/contentSafety.js</code> or <code>src/config/bannedWhitelist.json</code>.
        </p>
      </div>

      <div className="card-3d p-5 bg-white border border-[#E5E0DA] shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#58CC02]/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#58CC02]" />
          </div>
          <div>
            <h3 className="font-black text-[#3C3C3C]">Whitelist (admin)</h3>
            <p className="text-xs text-[#777777]">Terms you approve even if they match banned lists.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add term to whitelist"
            className="flex-1 px-3 py-2 rounded-lg border border-[#E5E0DA] text-sm"
          />
          <button onClick={handleAdd} className="btn-3d btn-3d-green px-3 py-2 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {lists.whitelist.length === 0 && (
            <p className="text-xs text-[#AFAFAF]">No whitelist terms yet.</p>
          )}
          {lists.whitelist.map((term) => (
            <span key={term} className="px-3 py-1 rounded-full bg-[#58CC02]/10 text-[#58CC02] text-xs font-bold flex items-center gap-2">
              {term}
              <button onClick={() => handleRemove(term)} className="text-[#58CC02] hover:text-[#3A9901]">
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={handleCopy} className="btn-3d btn-3d-ghost px-3 py-2 text-sm flex items-center gap-2">
            <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy whitelist JSON'}
          </button>
          <p className="text-[11px] text-[#AFAFAF] flex items-center">
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
          <span className="text-[11px] text-[#777777]">
            Status: {loading ? 'Syncing...' : `${status.source} ${status.message ? `• ${status.message}` : ''}`}
          </span>
        </div>

        {toast && (
          <div className="mt-3 text-[11px] font-bold text-[#3C3C3C] bg-[#F0EDE8] px-3 py-2 rounded-lg">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
