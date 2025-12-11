import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RefreshCw } from 'lucide-react'

const canUseSupabase = () => Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function AdminAuditLog() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Idle')

  const load = async () => {
    if (!canUseSupabase()) { setStatus('Supabase env missing'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase.from('admin_audit_log').select('*').order('created_at', { ascending: false }).limit(50)
      if (error) throw error
      setRows(data || [])
      setStatus('Loaded')
    } catch (e) {
      setStatus(`Load failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="card-3d p-5 bg-white border border-[#E5E0DA] shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-[#3C3C3C]">Admin Audit Log</h3>
          <p className="text-xs text-[#777777]">Recent admin actions (last 50).</p>
          <p className="text-[11px] text-[#777777]">Status: {loading ? 'Working…' : status}</p>
        </div>
        <button onClick={load} disabled={loading} className="btn-3d btn-3d-ghost px-3 py-2 text-xs flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {rows.length === 0 && <p className="text-xs text-[#AFAFAF]">No audit entries yet.</p>}
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm">
            <div>
              <p className="font-bold text-[#3C3C3C]">{row.action}</p>
              <p className="text-[11px] text-[#777777]">{row.created_at}</p>
            </div>
            <div className="text-[11px] text-[#777777] max-w-xs truncate">{JSON.stringify(row.meta || {})}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
