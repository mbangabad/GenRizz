import React, { useState, useEffect } from 'react';
import { InviteCode } from '@/api/entities';
import { Ticket, Copy, Trash2, Plus, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
      toast.success('Code deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#3C3C3C]">Invite Codes</h2>
          <p className="text-sm text-[#777777]">Generate and manage access codes</p>
        </div>
        <button onClick={fetchCodes} className="p-2 hover:bg-gray-100 rounded-lg">
          <RefreshCw className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Generator */}
      <div className="card-3d p-6 bg-white">
        <h3 className="font-bold text-[#3C3C3C] mb-4 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-[#58CC02]" /> Generate New Code
        </h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-[#AFAFAF] uppercase">Max Uses</label>
            <input 
              type="number"
              min="1"
              value={newCodeSettings.max_uses}
              onChange={e => setNewCodeSettings({...newCodeSettings, max_uses: e.target.value})}
              className="w-full h-10 px-3 rounded-xl bg-[#F7F4F0] border-2 border-[#E5E0DA] font-bold text-[#3C3C3C]"
            />
          </div>
          <div className="flex-[2] space-y-1">
            <label className="text-xs font-bold text-[#AFAFAF] uppercase">Note (Optional)</label>
            <input 
              type="text"
              placeholder="e.g. For Marketing Team"
              value={newCodeSettings.note}
              onChange={e => setNewCodeSettings({...newCodeSettings, note: e.target.value})}
              className="w-full h-10 px-3 rounded-xl bg-[#F7F4F0] border-2 border-[#E5E0DA] font-bold text-[#3C3C3C]"
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
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${isFull ? 'bg-gray-100 text-gray-400' : 'bg-[#58CC02]/10 text-[#58CC02]'}`}>
                  🎫
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-lg font-black text-[#3C3C3C] tracking-wider">{code.code}</code>
                    <button onClick={() => copyToClipboard(code.code)} className="text-gray-400 hover:text-[#58CC02]">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold mt-1">
                    <span className="text-[#777777]">
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
                <div className="w-24 h-2 bg-[#F0EDE8] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isFull ? 'bg-red-400' : 'bg-[#58CC02]'}`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>
                <button 
                  onClick={() => handleDelete(code.id)}
                  className="p-2 hover:bg-[#FFF5F5] rounded-lg text-[#FF4B4B] transition-colors"
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