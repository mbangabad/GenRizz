import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RefreshCw, TrendingUp, Users, ShoppingBag, Activity } from 'lucide-react'

const canUseSupabase = () => Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function AnalyticsPanel() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Idle')
  const [metrics, setMetrics] = useState({ dau: 0, events: 0, revenue: 0, purchases: 0 })
  const [topEvents, setTopEvents] = useState([])

  const load = async () => {
    if (!canUseSupabase()) { setStatus('Supabase env missing'); return }
    setLoading(true)
    try {
      const [eventsRes, purchasesRes, usersRes] = await Promise.all([
        supabase.from('events').select('name', { count: 'exact', head: false, limit: 200 }).order('created_at', { ascending: false }),
        supabase.from('purchases').select('price_paid_cents', { count: 'exact', head: false, limit: 200 }).order('created_at', { ascending: false }),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true })
      ])
      const eventRows = eventsRes.data || []
      const purchases = purchasesRes.data || []
      const revenue = purchases.reduce((s, p) => s + (p.price_paid_cents || 0), 0)
      const eventCounts = eventRows.reduce((map, row) => {
        const key = row.name || 'unknown'
        map[key] = (map[key] || 0) + 1
        return map
      }, {})
      const top = Object.entries(eventCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
      setTopEvents(top)
      setMetrics({
        dau: usersRes.count || 0,
        events: eventsRes.count || eventRows.length,
        revenue,
        purchases: purchasesRes.count || purchases.length,
      })
      setStatus('Loaded analytics')
    } catch (e) {
      setStatus(`Analytics failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const cards = [
    { icon: Users, label: 'Users (profiles)', value: metrics.dau },
    { icon: Activity, label: 'Events (last fetch)', value: metrics.events },
    { icon: ShoppingBag, label: 'Purchases', value: metrics.purchases },
    { icon: TrendingUp, label: 'Revenue (est.)', value: `$${(metrics.revenue / 100).toFixed(2)}` },
  ]

  return (
    <div className="card-3d p-5 bg-white border border-[#E5E0DA] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-[#3C3C3C]">Analytics Snapshot</h3>
          <p className="text-xs text-[#777777]">Events, purchases, revenue, top actions.</p>
          <p className="text-[11px] text-[#777777]">Status: {loading ? 'Working…' : status}</p>
        </div>
        <button onClick={load} disabled={loading} className="btn-3d btn-3d-ghost px-3 py-2 text-xs flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="card-3d p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7F4F0] flex items-center justify-center">
              <c.icon className="w-5 h-5 text-[#3C3C3C]" />
            </div>
            <div>
              <p className="text-xs text-[#777777] font-semibold">{c.label}</p>
              <p className="text-lg font-black text-[#3C3C3C]">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-[#3C3C3C]">Top events (sampled)</p>
        {topEvents.length === 0 && <p className="text-xs text-[#AFAFAF]">No events yet.</p>}
        {topEvents.map(([name, count]) => (
          <div key={name} className="flex items-center justify-between text-sm border rounded-lg px-3 py-2">
            <span className="font-bold text-[#3C3C3C]">{name}</span>
            <span className="text-xs text-[#777777]">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
