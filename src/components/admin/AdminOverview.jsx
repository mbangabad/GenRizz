import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Activity, DollarSign, TrendingUp, 
  Clock, Globe, Smartphone, AlertCircle, CheckCircle, Shield 
} from 'lucide-react';
import ValidatorSummary from './ValidatorSummary';
import { supabase } from '@/lib/supabase';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { getRecoveryAdStatus } from '@/services/ads';

const data = [
  { name: 'Mon', users: 4000, plays: 2400, rev: 2400 },
  { name: 'Tue', users: 3000, plays: 1398, rev: 2210 },
  { name: 'Wed', users: 2000, plays: 9800, rev: 2290 },
  { name: 'Thu', users: 2780, plays: 3908, rev: 2000 },
  { name: 'Fri', users: 1890, plays: 4800, rev: 2181 },
  { name: 'Sat', users: 2390, plays: 3800, rev: 2500 },
  { name: 'Sun', users: 3490, plays: 4300, rev: 2100 },
];

const demographics = [
  { name: 'Gen Z', value: 45 },
  { name: 'Millennials', value: 30 },
  { name: 'Gen X', value: 15 },
  { name: 'Boomers', value: 10 },
];

const COLORS = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B'];

export default function AdminOverview({ stats }) {
  const adsStatus = getRecoveryAdStatus();
  const adsEnabled = adsStatus.enabled;
  const adsCaption = adsEnabled
    ? `Recovery-only · ${adsStatus.dailyRemaining}/${adsStatus.limit} remaining · ${adsStatus.cooldownMinutesRemaining}m cooldown`
    : 'Ads disabled (FLAG_ADS_RECOVERY_ONLY off)';
  const canUseSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  const [liveStats, setLiveStats] = useState({
    activeUsers: stats?.active_players_now || 3847,
    totalPlays: stats?.total_games_played || 1800000,
    retention: stats?.d1_retention || 42.8,
    revenue: stats?.estimated_revenue || 12450,
  });

  useEffect(() => {
    setLiveStats((prev) => ({
      ...prev,
      activeUsers: stats?.active_players_now || prev.activeUsers,
      totalPlays: stats?.total_games_played || prev.totalPlays,
      retention: stats?.d1_retention || prev.retention,
      revenue: stats?.estimated_revenue || prev.revenue,
    }));
  }, [stats]);

  useEffect(() => {
    const fetchLive = async () => {
      if (!canUseSupabase) return;
      try {
        const [{ count: playsCount }, { count: usersCount }] = await Promise.all([
          supabase.from('scores').select('*', { count: 'exact', head: true }),
          supabase.from('user_progress').select('*', { count: 'exact', head: true }),
        ]);
        setLiveStats((prev) => ({
          ...prev,
          activeUsers: typeof usersCount === 'number' ? usersCount : prev.activeUsers,
          totalPlays: typeof playsCount === 'number' ? playsCount : prev.totalPlays,
        }));
      } catch (e) {
        console.warn('Live stats fetch failed', e.message);
      }
    };
    fetchLive();
  }, [canUseSupabase]);

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-3d p-4 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Active Users</p>
            <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{(liveStats?.activeUsers || 0).toLocaleString()}</h3>
            <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--brand-green)' }}>
              <TrendingUp className="w-3 h-3" /> +12% vs last hour
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-blue) 10%, transparent)', color: 'var(--brand-blue)' }}>
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="card-3d p-4 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Total Plays</p>
            <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{(liveStats?.totalPlays || 0).toLocaleString()}</h3>
            <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--brand-green)' }}>
              <TrendingUp className="w-3 h-3" /> +5% vs yesterday
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-green) 10%, transparent)', color: 'var(--brand-green)' }}>
            <Smartphone className="w-6 h-6" />
          </div>
        </div>

        <div className="card-3d p-4 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Retention D1</p>
            <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{`${liveStats?.retention ?? 42.8}%`}</h3>
            <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--brand-red)' }}>
              <AlertCircle className="w-3 h-3" /> -1.2% vs avg
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-yellow) 10%, transparent)', color: 'var(--brand-yellow)' }}>
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="card-3d p-4 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Est. Revenue</p>
            <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>${(liveStats?.revenue || 0).toLocaleString()}</h3>
            <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--brand-green)' }}>
              <TrendingUp className="w-3 h-3" /> +8% vs target
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-purple) 10%, transparent)', color: 'var(--brand-purple)' }}>
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Ads Guardrail Status */}
      <div className="card-3d p-4 bg-white border flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: adsEnabled ? 'color-mix(in srgb, var(--brand-green) 10%, transparent)' : 'color-mix(in srgb, var(--brand-red) 10%, transparent)', color: adsEnabled ? 'var(--brand-green)' : 'var(--brand-red)' }}>
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Ads Guard</p>
            <h4 className="font-black" style={{ color: 'var(--text-primary)' }}>{adsEnabled ? 'Recovery-only enabled' : 'Ads disabled'}</h4>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{adsCaption}</p>
          </div>
        </div>
        {!adsEnabled && (
          <span className="badge-3d badge-xp text-xs">Flip FLAG_ADS_RECOVERY_ONLY to test placements</span>
        )}
      </div>

      {/* Benchmark Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-3d p-4 bg-white border-l-4" style={{ borderLeftColor: 'var(--brand-green)' }}>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>User Satisfaction (NPS)</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-bold">Top 10%</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>72</span>
            <span className="text-xs font-bold mb-1" style={{ color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <p className="text-xs text-green-600 mt-1 font-bold">Beat industry avg (45)</p>
        </div>
        <div className="card-3d p-4 bg-white border-l-4" style={{ borderLeftColor: 'var(--brand-yellow)' }}>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Load Time (P95)</span>
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded font-bold">Average</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>1.2s</span>
          </div>
          <p className="text-xs text-yellow-600 mt-1 font-bold">Match industry avg (1.1s)</p>
        </div>
        <div className="card-3d p-4 bg-white border-l-4" style={{ borderLeftColor: 'var(--brand-blue)' }}>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Viral Coefficient</span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold">Top 5%</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>1.8</span>
          </div>
          <p className="text-xs text-blue-600 mt-1 font-bold">Exceptional growth</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-3d p-6 bg-white">
          <h3 className="font-black mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Users className="w-5 h-5" style={{ color: 'var(--brand-blue)' }} /> Growth Trends
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1CB0F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1CB0F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#58CC02" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#58CC02" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="users" stroke="#1CB0F6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="plays" stroke="#58CC02" strokeWidth={3} fillOpacity={1} fill="url(#colorPlays)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-3d p-6 bg-white">
          <h3 className="font-black mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Globe className="w-5 h-5" style={{ color: 'var(--brand-purple)' }} /> Demographics
          </h3>
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>127k</span>
              <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Users</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {demographics.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                <div className="w-3 h-3 rounded-full" style={{background: COLORS[i]}} />
                {d.name} ({d.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-2">
        <ValidatorSummary />
      </div>
    </div>
  );
}
