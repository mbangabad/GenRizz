import React, { useState } from 'react';
import { 
  TrendingUp, Users, Clock, Calendar, 
  ArrowUpRight, ArrowDownRight, Filter, Download 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';

const retentionData = [
  { day: 'D1', rate: 45, benchmark: 35 },
  { day: 'D7', rate: 22, benchmark: 15 },
  { day: 'D30', rate: 12, benchmark: 6 },
];

const sessionData = [
  { hour: '00:00', users: 120 }, { hour: '04:00', users: 80 },
  { hour: '08:00', users: 450 }, { hour: '12:00', users: 980 },
  { hour: '16:00', users: 1100 }, { hour: '20:00', users: 850 },
  { hour: '23:59', users: 340 },
];

const cohortData = [
  { date: 'Nov 1', users: 100, w1: 45, w2: 30, w3: 25, w4: 20 },
  { date: 'Nov 8', users: 120, w1: 48, w2: 32, w3: 28, w4: null },
  { date: 'Nov 15', users: 150, w1: 50, w2: 35, w3: null, w4: null },
  { date: 'Nov 22', users: 180, w1: 52, w2: null, w3: null, w4: null },
];

export default function AnalyticsDeepDive() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-[#E5E0DA] shadow-sm">
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d', 'All'].map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                timeRange === r 
                  ? 'bg-[#3C3C3C] text-white' 
                  : 'bg-[#FAF8F5] text-[#777777] hover:bg-[#E5E0DA]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn-3d btn-3d-ghost px-4 py-2 text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="btn-3d btn-3d-ghost px-4 py-2 text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-3d p-5 bg-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-[#AFAFAF] uppercase">Avg Session Length</p>
              <h3 className="text-3xl font-black text-[#3C3C3C]">14m 22s</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600">
            <ArrowUpRight className="w-4 h-4" /> +8.4% vs prev period
          </div>
        </div>

        <div className="card-3d p-5 bg-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-[#AFAFAF] uppercase">Stickiness (DAU/MAU)</p>
              <h3 className="text-3xl font-black text-[#3C3C3C]">28.5%</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600">
            <ArrowUpRight className="w-4 h-4" /> +2.1% vs benchmark
          </div>
        </div>

        <div className="card-3d p-5 bg-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-[#AFAFAF] uppercase">Churn Rate</p>
              <h3 className="text-3xl font-black text-[#3C3C3C]">4.2%</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600">
            <ArrowDownRight className="w-4 h-4" /> -0.5% improvement
          </div>
        </div>
      </div>

      {/* Retention Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-3d p-6 bg-white">
          <h3 className="font-black text-[#3C3C3C] mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#58CC02]" /> Retention vs Benchmark
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#AFAFAF'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#AFAFAF'}} />
                <Tooltip cursor={{fill: '#F0EDE8'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Legend />
                <Bar dataKey="rate" name="Your App" fill="#58CC02" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" name="Industry Avg" fill="#E5E0DA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-3d p-6 bg-white">
          <h3 className="font-black text-[#3C3C3C] mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#1CB0F6]" /> Session Activity (24h)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionData}>
                <defs>
                  <linearGradient id="colorSession" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1CB0F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1CB0F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#AFAFAF'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#AFAFAF'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Area type="monotone" dataKey="users" stroke="#1CB0F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSession)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cohort Analysis Table */}
      <div className="card-3d p-6 bg-white">
        <h3 className="font-black text-[#3C3C3C] mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#CE82FF]" /> Cohort Retention
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#AFAFAF] text-xs uppercase text-left border-b border-[#E5E0DA]">
                <th className="pb-3 pl-4">Cohort</th>
                <th className="pb-3">Users</th>
                <th className="pb-3 text-center">Week 1</th>
                <th className="pb-3 text-center">Week 2</th>
                <th className="pb-3 text-center">Week 3</th>
                <th className="pb-3 text-center">Week 4</th>
              </tr>
            </thead>
            <tbody className="font-bold text-[#3C3C3C]">
              {cohortData.map((row, i) => (
                <tr key={i} className="border-b border-[#F0EDE8] hover:bg-[#FAF8F5]">
                  <td className="py-4 pl-4">{row.date}</td>
                  <td className="py-4">{row.users}</td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-1 rounded ${row.w1 > 40 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {row.w1}%
                    </span>
                  </td>
                  <td className="py-4 text-center text-[#777777]">{row.w2 ? `${row.w2}%` : '-'}</td>
                  <td className="py-4 text-center text-[#777777]">{row.w3 ? `${row.w3}%` : '-'}</td>
                  <td className="py-4 text-center text-[#777777]">{row.w4 ? `${row.w4}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}