import React, { useEffect, useState } from 'react';
import { AllowedUser, BetaAccess } from '@/api/entities';
import { RefreshCw, Plus, ShieldCheck, Sparkles } from 'lucide-react';

export default function UserAccessPanel() {
  const [allowed, setAllowed] = useState([]);
  const [beta, setBeta] = useState([]);
  const [email, setEmail] = useState('');
  const [betaEmail, setBetaEmail] = useState('');
  const [status, setStatus] = useState('Idle');
  const [loading, setLoading] = useState(false);
  const defaultAdmin = import.meta.env.VITE_DEV_ADMIN_EMAIL || 'admin@genrizz.local';
  const SEED_ALLOW = [defaultAdmin];
  const SEED_BETA = [defaultAdmin];

  const load = async () => {
    setLoading(true);
    try {
      const [allowList, betaList] = await Promise.all([
        AllowedUser.filter({}),
        BetaAccess.filter({}),
      ]);
      setAllowed(allowList || []);
      setBeta(betaList || []);
      setStatus('Loaded from Supabase');
    } catch (e) {
      setStatus(`Load failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addAllowed = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await AllowedUser.upsert({ email });
      setEmail('');
      await load();
      setStatus('Allowlist updated');
    } catch (e) {
      setStatus(`Allowlist failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addBetaAccess = async () => {
    if (!betaEmail) return;
    setLoading(true);
    try {
      await BetaAccess.upsert({ email: betaEmail, granted_at: new Date().toISOString() });
      setBetaEmail('');
      await load();
      setStatus('Beta access granted');
    } catch (e) {
      setStatus(`Beta grant failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const seedAccess = async () => {
    setLoading(true);
    try {
      await Promise.all(SEED_ALLOW.map((addr) => AllowedUser.upsert({ email: addr })));
      await Promise.all(SEED_BETA.map((addr) => BetaAccess.upsert({ email: addr, granted_at: new Date().toISOString() })));
      await load();
      setStatus('Seeded default allowlist/beta');
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
          <h3 className="font-black text-[#3C3C3C]">User Access</h3>
          <p className="text-xs text-[#777777]">Manage allowlist and beta access.</p>
          <p className="text-[11px] text-[#777777]">Status: {loading ? 'Working…' : status}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={seedAccess} disabled={loading} className="btn-3d btn-3d-ghost px-3 py-2 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Seed demo
          </button>
          <button onClick={load} disabled={loading} className="btn-3d btn-3d-ghost px-3 py-2 text-xs flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-3 bg-[#F7F4F0] rounded-xl border border-[#E5E0DA] space-y-2">
          <h4 className="font-bold text-sm text-[#3C3C3C]">Allowlist</h4>
          <div className="flex gap-2">
            <input
              className="flex-1 text-sm px-3 py-2 rounded border border-[#E5E0DA]"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={addAllowed} disabled={loading} className="btn-3d btn-3d-green px-3 py-2 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {allowed.map((row) => (
              <div key={row.id || row.email} className="flex items-center gap-2 text-xs font-bold text-[#3C3C3C]">
                <ShieldCheck className="w-4 h-4 text-[#58CC02]" /> {row.email}
              </div>
            ))}
            {allowed.length === 0 && <p className="text-xs text-[#AFAFAF]">No allowlist entries yet.</p>}
          </div>
        </div>

        <div className="p-3 bg-[#F7F4F0] rounded-xl border border-[#E5E0DA] space-y-2">
          <h4 className="font-bold text-sm text-[#3C3C3C]">Beta Access</h4>
          <div className="flex gap-2">
            <input
              className="flex-1 text-sm px-3 py-2 rounded border border-[#E5E0DA]"
              placeholder="email@example.com"
              value={betaEmail}
              onChange={(e) => setBetaEmail(e.target.value)}
            />
            <button onClick={addBetaAccess} disabled={loading} className="btn-3d btn-3d-green px-3 py-2 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Grant
            </button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {beta.map((row) => (
              <div key={row.id || row.email} className="flex items-center gap-2 text-xs font-bold text-[#3C3C3C]">
                <ShieldCheck className="w-4 h-4 text-[#1CB0F6]" /> {row.email || row.user_id}
              </div>
            ))}
            {beta.length === 0 && <p className="text-xs text-[#AFAFAF]">No beta entries yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
