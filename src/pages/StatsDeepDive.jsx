import React, { useState, useEffect } from 'react';
import { auth } from '@/api/auth';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Clock, Target, Brain, 
  Calendar, ArrowLeft, Share2, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

// Mock Data generator
const generateData = () => {
  return {
    categories: [
      { subject: 'Gen Z', A: 90, fullMark: 100 },
      { subject: 'Boomer', A: 65, fullMark: 100 },
      { subject: 'Millennial', A: 80, fullMark: 100 },
      { subject: 'Social IQ', A: 70, fullMark: 100 },
      { subject: 'Humor', A: 85, fullMark: 100 },
      { subject: 'Vibes', A: 95, fullMark: 100 },
    ],
    xpHistory: [
      { day: 'Mon', xp: 400 },
      { day: 'Tue', xp: 300 },
      { day: 'Wed', xp: 550 },
      { day: 'Thu', xp: 450 },
      { day: 'Fri', xp: 800 },
      { day: 'Sat', xp: 1200 },
      { day: 'Sun', xp: 900 },
    ],
    activityByHour: [
      { hour: '6am', value: 10 },
      { hour: '9am', value: 30 },
      { hour: '12pm', value: 80 },
      { hour: '3pm', value: 60 },
      { hour: '6pm', value: 100 },
      { hour: '9pm', value: 120 },
      { hour: '12am', value: 40 },
    ]
  };
};

export default function StatsDeepDive() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    auth.me().then(u => {
      setUser(u);
      setData(generateData());
    }).catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      <header className="glass-light border-b border-[#E5E0DA] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Profile')}>
              <button className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E0DA] flex items-center justify-center hover:bg-[#F0EDE8] transition-colors">
                <ArrowLeft className="w-5 h-5 text-[#777777]" />
              </button>
            </Link>
            <div>
              <h1 className="font-black text-[#3C3C3C] text-lg">Stats Deep Dive</h1>
              <p className="text-xs text-[#AFAFAF] font-semibold">Advanced Analytics</p>
            </div>
          </div>
          <button className="p-2 hover:bg-[#F0EDE8] rounded-xl transition-colors">
            <Share2 className="w-5 h-5 text-[#1CB0F6]" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={Brain} 
            label="Knowledge Base" 
            value="Top 5%" 
            subtext="Vs Global Average"
            color="#CE82FF" 
          />
          <StatCard 
            icon={Target} 
            label="Accuracy" 
            value="78%" 
            subtext="+2% this week"
            color="#58CC02" 
          />
          <StatCard 
            icon={Clock} 
            label="Avg Speed" 
            value="4.2s" 
            subtext="Per question"
            color="#FFC800" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Win Rate" 
            value="64%" 
            subtext="In PvP Battles"
            color="#FF4B4B" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-3d p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-[#3C3C3C] text-lg">Skill Breakdown</h2>
              <span className="text-xs font-bold text-[#AFAFAF] uppercase bg-[#F7F4F0] px-2 py-1 rounded">Lifetime</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.categories}>
                  <PolarGrid stroke="#E5E0DA" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#777777', fontSize: 12, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="User"
                    dataKey="A"
                    stroke="#1CB0F6"
                    strokeWidth={3}
                    fill="#1CB0F6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-[#777777]">
                Your strongest subject is <strong className="text-[#1CB0F6]">Vibe Check</strong>.
              </p>
            </div>
          </motion.div>

          {/* XP Growth */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-3d p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-[#3C3C3C] text-lg">XP Growth</h2>
              <span className="text-xs font-bold text-[#AFAFAF] uppercase bg-[#F7F4F0] px-2 py-1 rounded">Last 7 Days</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.xpHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#AFAFAF', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#AFAFAF', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#3C3C3C', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#58CC02" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#58CC02', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-[#777777]">
                You earned <strong className="text-[#58CC02]">4,600 XP</strong> this week!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Activity Heatmap (Simplified) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-3d p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[#3C3C3C] text-lg">Peak Performance Time</h2>
            <span className="text-xs font-bold text-[#AFAFAF] uppercase bg-[#F7F4F0] px-2 py-1 rounded">24 Hours</span>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.activityByHour}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#AFAFAF', fontSize: 12}} />
                <Tooltip 
                  cursor={{ fill: '#F7F4F0' }}
                  contentStyle={{ borderRadius: '12px', border: 'none' }}
                />
                <Bar dataKey="value" fill="#FFC800" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext, color }) {
  return (
    <div className="card-3d p-4 flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
           style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color: color }} />
      </div>
      <div className="text-2xl font-black text-[#3C3C3C]">{value}</div>
      <div className="text-xs font-bold text-[#777777] uppercase mt-1 mb-1">{label}</div>
      <div className="text-[10px] text-[#AFAFAF] font-semibold">{subtext}</div>
    </div>
  );
}