import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Activity, DollarSign, TrendingUp, 
  Clock, Globe, Smartphone, AlertCircle, CheckCircle, Shield 
} from 'lucide-react';
import ValidatorSummary from './ValidatorSummary';
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

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-3d p-4 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs font-bold text-[#AFAFAF] uppercase">Active Users</p>
            <h3 className="text-2xl font-black text-[#3C3C3C]">{stats?.active_players_now?.toLocaleString() || '3,847'}</h3>
            <span className="text-xs font-bold text-[#58CC02] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% vs last hour
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1CB0F6]/10 flex items-center justify-center text-[#1CB0F6]">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="card-3d p-4 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs font-bold text-[#AFAFAF] uppercase">Total Plays</p>
            <h3 className="text-2xl font-black text-[#3C3C3C]">{stats?.total_games_played?.toLocaleString() || '1.8M'}</h3>
            <span className="text-xs font-bold text-[#58CC02] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +5% vs yesterday
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#58CC02]/10 flex items-center justify-center text-[#58CC02]">
            <Smartphone className="w-6 h-6" />
          </div>
        </div>

        <div className="card-3d p-4 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs font-bold text-[#AFAFAF] uppercase">Retention D1</p>
            <h3 className="text-2xl font-black text-[#3C3C3C]">42.8%</h3>
            <span className="text-xs font-bold text-[#FF4B4B] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> -1.2% vs avg
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FFC800]/10 flex items-center justify-center text-[#FFC800]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="card-3d p-4 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs font-bold text-[#AFAFAF] uppercase">Est. Revenue</p>
            <h3 className="text-2xl font-black text-[#3C3C3C]">$12,450</h3>
            <span className="text-xs font-bold text-[#58CC02] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8% vs target
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#CE82FF]/10 flex items-center justify-center text-[#CE82FF]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Ads Guardrail Status */}
      <div className="card-3d p-4 bg-white border border-[#E5E0DA] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${adsEnabled ? 'bg-[#58CC02]/10 text-[#58CC02]' : 'bg-[#FF4B4B]/10 text-[#FF4B4B]'}`}>
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#AFAFAF] uppercase">Ads Guard</p>
            <h4 className="font-black text-[#3C3C3C]">{adsEnabled ? 'Recovery-only enabled' : 'Ads disabled'}</h4>
            <p className="text-xs text-[#777777] font-semibold">{adsCaption}</p>
          </div>
        </div>
        {!adsEnabled && (
          <span className="badge-3d badge-xp text-xs">Flip FLAG_ADS_RECOVERY_ONLY to test placements</span>
        )}
      </div>

      {/* Benchmark Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-3d p-4 bg-white border-l-4 border-l-[#58CC02]">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-[#AFAFAF] uppercase">User Satisfaction (NPS)</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-bold">Top 10%</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-[#3C3C3C]">72</span>
            <span className="text-xs font-bold text-[#AFAFAF] mb-1">/ 100</span>
          </div>
          <p className="text-xs text-green-600 mt-1 font-bold">Beat industry avg (45)</p>
        </div>
        <div className="card-3d p-4 bg-white border-l-4 border-l-[#FFC800]">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-[#AFAFAF] uppercase">Load Time (P95)</span>
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded font-bold">Average</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-[#3C3C3C]">1.2s</span>
          </div>
          <p className="text-xs text-yellow-600 mt-1 font-bold">Match industry avg (1.1s)</p>
        </div>
        <div className="card-3d p-4 bg-white border-l-4 border-l-[#1CB0F6]">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-[#AFAFAF] uppercase">Viral Coefficient</span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold">Top 5%</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-[#3C3C3C]">1.8</span>
          </div>
          <p className="text-xs text-blue-600 mt-1 font-bold">Exceptional growth</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-3d p-6 bg-white">
          <h3 className="font-black text-[#3C3C3C] mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1CB0F6]" /> Growth Trends
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#AFAFAF'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#AFAFAF'}} />
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
          <h3 className="font-black text-[#3C3C3C] mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#CE82FF]" /> Demographics
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
              <span className="text-3xl font-black text-[#3C3C3C]">127k</span>
              <span className="text-xs text-[#AFAFAF] font-bold uppercase">Users</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {demographics.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#777777]">
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
