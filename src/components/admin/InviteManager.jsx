import React, { useState, useEffect } from 'react';
import { InviteCode } from '@/api/entities';
import { Ticket, Copy, Trash2, Plus, Check, RefreshCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { logAdminAction } from '@/services/telemetry';

export default function InviteManager() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newCodeSettings, setNewCodeSettings] = useState({
    max_uses: 1,
    note: ''
  });

  const fetchCodes = async () => {
    try {
      const data = await InviteCode.list('created_at', 100, false);
      setCodes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      if (i === 4) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreate = async () => {
    setGenerating(true);
    try {
      const code = generateCode();
      await InviteCode.create({
        code,
        status: 'active',
        max_uses: parseInt(newCodeSettings.max_uses),
        used_count: 0,
        note: newCodeSettings.note,
        created_at: new Date().toISOString()
      });
      setNewCodeSettings({ max_uses: 1, note: '' });
      toast.success('Invite code generated!');
      logAdminAction('invite_create', { code, max_uses: parseInt(newCodeSettings.max_uses), note: newCodeSettings.note });
      fetchCodes();
    } catch (e) {
      toast.error('Failed to generate code');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this code?')) return;
    try {
      await InviteCode.delete(id);
      setCodes(codes.filter(c => c.id !== id));
      logAdminAction('invite_delete', { id });
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    logAdminAction('invite_copy', { code: text });
  };

  const handleBulkGenerate = async () => {
    setGenerating(true);
    const newCodes = [];
    try {
      for (let i = 0; i < bulkCount; i++) {
        const code = generateCode();
        await InviteCode.create({
          code,
          status: 'active',
          max_uses: parseInt(newCodeSettings.max_uses) || 1,
          used_count: 0,
          note: newCodeSettings.note,
          created_at: new Date().toISOString()
        });
        newCodes.push(code);
      }
      fetchCodes();
      logAdminAction('invite_bulk_create', { count: bulkCount, max_uses: newCodeSettings.max_uses, note: newCodeSettings.note });
    } catch (e) {
      console.error('Bulk invite generation failed', e);
    } finally {
      setGenerating(false);
    }
    if (newCodes.length) {
      const blob = new Blob([newCodes.join('\\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invites-${newCodes.length}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Invite Codes</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Generate and manage access codes</p>
        </div>
        <button onClick={fetchCodes} className="p-2 hover:bg-gray-100 rounded-lg">
          <RefreshCw className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Generator */}
      <div className="card-3d p-6 bg-white">
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Ticket className="w-5 h-5" style={{ color: 'var(--brand-green)' }} /> Generate New Code
        </h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Max Uses</label>
            <input 
              type="number"
              min="1"
              value={newCodeSettings.max_uses}
              onChange={e => setNewCodeSettings({...newCodeSettings, max_uses: e.target.value})}
              className="w-full h-10 px-3 rounded-xl border-2 font-bold"
              style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex-[2] space-y-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Note (Optional)</label>
            <input 
              type="text"
              placeholder="e.g. For Marketing Team"
              value={newCodeSettings.note}
              onChange={e => setNewCodeSettings({...newCodeSettings, note: e.target.value})}
              className="w-full h-10 px-3 rounded-xl border-2 font-bold"
              style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>
          <button 
            onClick={handleCreate}
            disabled={generating}
            className="h-10 px-6 btn-3d btn-3d-green flex items-center gap-2"
          >
            {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-3">
        {codes.map(code => {
          const percentUsed = (code.used_count / code.max_uses) * 100;
          const isFull = code.used_count >= code.max_uses;
          
          return (
            <div key={code.id} className={`card-3d p-4 bg-white flex items-center justify-between ${isFull ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black`} style={{ backgroundColor: isFull ? '#f3f4f6' : 'color-mix(in srgb, var(--brand-green) 10%, transparent)', color: isFull ? '#9ca3af' : 'var(--brand-green)' }}>
                  🎫
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-lg font-black tracking-wider" style={{ color: 'var(--text-primary)' }}>{code.code}</code>
                    <button onClick={() => copyToClipboard(code.code)} className="text-gray-400 hover:text-green-600" style={{ '--hover-color': 'var(--brand-green)' }}>
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold mt-1">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Used: {code.used_count}/{code.max_uses}
                    </span>
                    {code.note && (
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                        {code.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-2)' }}>
                  <div 
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(percentUsed, 100)}%`, backgroundColor: isFull ? 'var(--brand-red)' : 'var(--brand-green)' }}
                  />
                </div>
                <button 
                  onClick={() => handleDelete(code.id)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--brand-red)' }}
                  onMouseEnter={e => e.target.style.backgroundColor = 'color-mix(in srgb, var(--brand-red) 5%, transparent)'}
                  onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
        
        {!loading && codes.length === 0 && (
          <div className="text-center py-10 text-gray-400 font-bold">
            No invite codes generated yet.
          </div>
        )}
      </div>
    </div>
  );
}
