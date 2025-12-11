import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, RefreshCw } from 'lucide-react'

const canUseSupabase = () => Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function PricingPanel() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Idle')
  const [form, setForm] = useState({ sku: '', currency: 'USD', amount_cents: 499, region: 'global', test_group: '' })

  const load = async () => {
    if (!canUseSupabase()) { setStatus('Supabase env missing'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase.from('prices').select('*').order('updated_at', { ascending: false })
      if (error) throw error
      setPrices(data || [])
      setStatus('Loaded pricing')
    } catch (e) {
      setStatus(`Load failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.sku) return
    setLoading(true)
    try {
      const payload = { ...form, amount_cents: Number(form.amount_cents) || 0 }
      const { error } = await supabase.from('prices').upsert(payload)
      if (error) throw error
      setForm({ sku: '', currency: 'USD', amount_cents: 499, region: 'global', test_group: '' })
      await load()
      setStatus('Saved price')
    } catch (e) {
      setStatus(`Save failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-3d p-5 bg-white border border-[#E5E0DA] shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-[#3C3C3C]">Pricing & Offers</h3>
          <p className="text-xs text-[#777777]">SKUs, test prices, regional overrides.</p>
          <p className="text-[11px] text-[#777777]">Status: {loading ? 'Working…' : status}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="btn-3d btn-3d-ghost px-3 py-2 text-xs flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={save} disabled={loading || !form.sku} className="btn-3d btn-3d-green px-3 py-2 text-xs flex items-center gap-2">
            <Plus className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <input className="px-3 py-2 rounded border border-[#E5E0DA] text-sm" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <input className="px-3 py-2 rounded border border-[#E5E0DA] text-sm" placeholder="Amount (cents)" type="number" value={form.amount_cents} onChange={(e) => setForm({ ...form, amount_cents: e.target.value })} />
        <input className="px-3 py-2 rounded border border-[#E5E0DA] text-sm" placeholder="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
        <input className="px-3 py-2 rounded border border-[#E5E0DA] text-sm" placeholder="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
        <input className="px-3 py-2 rounded border border-[#E5E0DA] text-sm" placeholder="Test Group" value={form.test_group} onChange={(e) => setForm({ ...form, test_group: e.target.value })} />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {prices.map((p) => (
          <div key={p.id} className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm">
            <div>
              <p className="font-bold text-[#3C3C3C]">{p.sku} · {(p.amount_cents / 100).toFixed(2)} {p.currency}</p>
              <p className="text-[11px] text-[#777777]">{p.region} {p.test_group ? `• test:${p.test_group}` : ''}</p>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${p.active ? 'bg-[#58CC02]/10 text-[#58CC02]' : 'bg-[#E5E0DA] text-[#777777]'}`}>
              {p.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
        {prices.length === 0 && <p className="text-xs text-[#AFAFAF]">No pricing entries yet.</p>}
      </div>
    </div>
  )
}
