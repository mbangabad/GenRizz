import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, CheckCircle2, Circle, AlertCircle, Clock,
  Zap, Share2, Heart, Trophy, Users, Rocket, Crown,
  Target, TrendingUp, Sparkles, Gift, CreditCard, Globe
} from 'lucide-react';

// Phase data with progress tracking
const PHASES = [
  {
    id: -1,
    title: "Beta Launch Ready",
    subtitle: "Completed ✅",
    priority: "DONE",
    icon: Rocket,
    color: "#58CC02",
    tasks: [
      { id: "B.1", title: "Help & Support Page", description: "FAQ accordion, contact form, quick links", status: "done", critical: true },
      { id: "B.2", title: "Settings Page", description: "Preferences, account links, notifications toggle", status: "done", critical: true },
      { id: "B.3", title: "Auth Flow", description: "Sign up, sign in buttons on landing, profile links", status: "done", critical: true },
      { id: "B.4", title: "Premium Billing", description: "Subscription creation and user premium status", status: "done", critical: true },
      { id: "B.5", title: "Landing Page Refresh", description: "Sign up/in buttons, footer links, help link", status: "done", critical: true },
      { id: "B.6", title: "All Components Wired", description: "PartyMode, WeeklyRecap, RematchButton, FriendBeatNotification", status: "done", critical: true },
    ]
  },
  {
    id: 0,
    title: "Immediate Fixes",
    subtitle: "Completed ✅",
    priority: "DONE",
    icon: CheckCircle2,
    color: "#58CC02",
    tasks: [
      { id: "0.1", title: "Personality Game Mode", description: "Assessment mode for Mental Age & Generation Quiz (no right/wrong)", status: "done", critical: true },
      { id: "0.2", title: "Restore PowerUps", description: "Integrated PowerUps component into Gameplay.js", status: "done", critical: true },
      { id: "0.3", title: "Landing Page Light Theme", description: "Converted landing from dark to eggshell theme", status: "done", critical: true },
      { id: "0.4", title: "Gameplay Mechanics", description: "Added streak counter, time bonus, screen shake, animations", status: "done" },
    ]
  },
  {
    id: 1,
    title: "Virality Engine",
    subtitle: "Completed ✅",
    priority: "DONE",
    icon: Share2,
    color: "#58CC02",
    tasks: [
      { id: "1.1", title: "Share-First Result Cards", description: "Instagram Story-sized shareable result images", status: "done", critical: true },
      { id: "1.2", title: "Emoji Result Grid", description: "Wordle-style 🟢🔴 grid for spoiler-free sharing", status: "done" },
      { id: "1.3", title: "Challenge System 2.0", description: "Beat my score, side-by-side comparison, notifications", status: "done" },
      { id: "1.4", title: "Social Proof Elements", description: "Live counters, activity ticker, friend notifications", status: "done" },
    ]
  },
  {
    id: 2,
    title: "Retention Systems",
    subtitle: "Completed ✅",
    priority: "DONE",
    icon: Heart,
    color: "#58CC02",
    tasks: [
      { id: "2.1", title: "Daily Challenge (Wordle Model)", description: "One shared challenge per day for everyone", status: "done" },
      { id: "2.2", title: "Streak System 2.0", description: "Calendar, milestones, freeze, repair, notifications", status: "done" },
      { id: "2.3", title: "Hearts/Lives System", description: "5 hearts/day, regenerate, ads, premium unlimited", status: "done" },
      { id: "2.4", title: "XP Leagues", description: "Bronze→Diamond leagues, weekly competition", status: "done" },
      { id: "2.5", title: "Daily Quests", description: "Multiple engagement triggers with XP rewards", status: "done" },
    ]
  },
  {
    id: 3,
    title: "Content & Variety",
    subtitle: "Completed ✅",
    priority: "DONE",
    icon: Sparkles,
    color: "#58CC02",
    tasks: [
      { id: "3.1", title: "New Question Types", description: "Would You Rather, Slider, Scenario Swipe, Ranking", status: "done" },
      { id: "3.2", title: "Game Consolidation", description: "20 games → 12 games for better focus & depth", status: "done" },
      { id: "3.3", title: "Opinion-Based Gameplay", description: "New OpinionGameplay with crowd comparison (no right/wrong)", status: "done" },
      { id: "3.4", title: "Vibe Check Game", description: "Replaced dark Red Flag with fun, lighthearted scenarios", status: "done" },
    ]
  },
  {
    id: 4,
    title: "Monetization",
    subtitle: "Completed ✅",
    priority: "DONE",
    icon: Crown,
    color: "#58CC02",
    tasks: [
      { id: "4.1", title: "Premium Subscription Page", description: "$9.99/year - unlimited hearts, no ads, streak shields", status: "done", critical: true },
      { id: "4.2", title: "Subscription Flow", description: "Create subscription record and update user premium status", status: "done" },
      { id: "4.3", title: "Premium Badge", description: "Show premium status in profiles & leaderboards", status: "done" },
    ]
  },
  {
    id: 5,
    title: "Social Expansion",
    subtitle: "Completed ✅",
    priority: "DONE",
    icon: Users,
    color: "#58CC02",
    tasks: [
      { id: "5.1", title: "Friend System 2.0", description: "Add friends, see their activity, challenge directly", status: "done" },
      { id: "5.2", title: "Group/Party Mode", description: "Room codes, 8 players, live leaderboard", status: "done" },
      { id: "5.3", title: "Activity Feed", description: "See friends' scores, achievements, challenges", status: "done" },
      { id: "5.4", title: "User Profiles", description: "Customizable profiles with badges & stats", status: "done" },
    ]
  },
  {
  id: 6,
  title: "Robust Features (v1.0)",
  subtitle: "Completed 🚀",
  priority: "DONE",
  icon: Rocket,
  color: "#CE82FF",
  tasks: [
    { id: "6.1", title: "Shop & IAP", description: "Purchase power-up packs and heart refills", status: "done" },
    { id: "6.2", title: "Squads System", description: "Create/Join squads, view squad details", status: "done" },
    { id: "6.3", title: "Creator Studio", description: "User Generated Content pipeline", status: "done" },
    { id: "6.4", title: "Admin Dashboard", description: "Moderation for UGC and Reports", status: "done" },
    { id: "6.5", title: "User Currency", description: "Coins and persistent heart system", status: "done" },
  ]
  },
  {
  id: 7,
  title: "Worldly Expansion",
  subtitle: "In Progress 🚧",
  priority: "HIGH",
  icon: Globe,
  color: "#1CB0F6",
  tasks: [
    { id: "7.1", title: "World Map Mode", description: "Global conquest meta-game with regional mastery", status: "done", critical: true },
    { id: "7.2", title: "Avatar Shop", description: "Customize Rizzy with hats, glasses, and skins", status: "done" },
    { id: "7.3", title: "Real-time PvP", description: "Live Battle Arena with matchmaking", status: "done" },
    { id: "7.4", title: "Localization", description: "Multi-language support structure", status: "todo" },
    { id: "7.5", title: "Advanced Analytics", description: "Deep dive stats for users", status: "done" },
    { id: "7.6", title: "Notifications Center", description: "Dedicated history page for alerts", status: "done" },
    { id: "7.7", title: "Sound System 2.0", description: "Global audio manager & music", status: "todo" },
    { id: "7.8", title: "Referral Rewards 2.0", description: "Tiered invite system", status: "todo" },
    { id: "7.9", title: "Admin User Mgmt", description: "Ban/Edit user tools", status: "todo" },
    { id: "7.10", title: "Onboarding V2", description: "Interactive tutorial flow", status: "todo" },
  ]
  },
  ];

const RESEARCH_INSIGHTS = [
  { source: "BuzzFeed", insight: "Identity affirmation + social comparison = shares", emoji: "📰" },
  { source: "Wordle", insight: "Daily scarcity + emoji grids = viral loops", emoji: "🟩" },
  { source: "Duolingo", insight: "Streaks + hearts + leagues = retention", emoji: "🦉" },
  { source: "Rice Purity", insight: "Numeric scores + ranges = easy comparison", emoji: "📊" },
  { source: "Kahoot", insight: "Real-time competition = engagement", emoji: "🎮" },
];

const KPIS = [
  { label: "DAU Target", value: "10K", timeframe: "90 days" },
  { label: "D1 Retention", value: "40%", timeframe: "target" },
  { label: "Share Rate", value: "25%", timeframe: "of completions" },
  { label: "Premium Conv.", value: "5%", timeframe: "of active" },
];

const RECENT_UPDATES = [
  {
    date: "2025-11-29",
    title: "🚀 Beta Launch Ready!",
    items: [
      "✅ Help & Support page with FAQ and contact form",
      "✅ Settings page with preferences",
      "✅ Sign up / Sign in flow on landing page",
      "✅ Premium subscription billing flow",
      "✅ All components wired (PartyMode, WeeklyRecap, etc.)",
      "✅ Landing page refreshed with proper auth buttons"
    ],
    highlight: true
  },
  {
    date: "2025-11-29",
    title: "Major Content Update",
    items: [
      "✅ Consolidated 20 games → 12 focused games",
      "✅ Added 4 new question types: Would You Rather, Slider, Scenario Swipe, Ranking",
      "✅ Created OpinionGameplay for crowd-comparison games",
      "✅ Replaced dark Red Flag with fun Vibe Check game",
      "✅ All opinion games show % who agree (no right/wrong)"
    ],
    highlight: false
  },
  {
    date: "2025-11-28",
    title: "Engagement Systems Complete",
    items: [
      "✅ Daily Challenge (Wordle-style)",
      "✅ Streak System with calendar & milestones",
      "✅ Hearts/Lives system (5/day, regeneration)",
      "✅ XP Leagues (Bronze→Obsidian)",
      "✅ Daily Quests with XP rewards"
    ],
    highlight: true
  },
  {
    date: "2025-11-28",
    title: "Core Fixes & Virality",
    items: [
      "✅ Personality game mode (Mental Age, Generation Quiz)",
      "✅ PowerUps restored in gameplay",
      "✅ Landing page light theme",
      "✅ Viral share cards with emoji grids"
    ],
    highlight: false
  },
];

export default function Roadmap() {
  const [expandedPhase, setExpandedPhase] = useState(4); // Show current phase

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="w-5 h-5 text-[#58CC02]" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-[#FFC800]" />;
      default: return <Circle className="w-5 h-5 text-[#AFAFAF]" />;
    }
  };

  const getPhaseProgress = (phase) => {
    const done = phase.tasks.filter(t => t.status === 'done').length;
    return Math.round((done / phase.tasks.length) * 100);
  };

  const totalTasks = PHASES.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = PHASES.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'done').length, 0);
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Header */}
      <header className="glass-header">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')} className="p-2 rounded-xl transition-colors"
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </Link>
            <div>
              <h1 className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>🗺️ Development Roadmap</h1>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Progress tracker</p>
            </div>
          </div>
          <div className="badge-3d badge-xp">
            <Target className="w-4 h-4" />
            <span>{overallProgress}% Complete</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Overall Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-xl" style={{ color: 'var(--text-primary)' }}>Overall Progress</h2>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{completedTasks}/{totalTasks} tasks</span>
          </div>
          <div className="progress-bar-3d h-4 mb-6">
            <motion.div 
              className="progress-fill-green"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {KPIS.map((kpi, i) => (
              <div key={i} className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--surface-1)' }}>
                <div className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{kpi.value}</div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{kpi.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{kpi.timeframe}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Updates */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d p-6"
        >
          <h2 className="font-black text-lg mb-4" style={{ color: 'var(--text-primary)' }}>🎉 Recent Updates</h2>
          <div className="space-y-4">
            {RECENT_UPDATES.map((update, i) => (
              <div 
                key={i} 
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: update.highlight ? 'rgba(88, 204, 2, 0.1)' : 'var(--surface-1)',
                  border: update.highlight ? '1px solid rgba(88, 204, 2, 0.3)' : 'none'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{update.date}</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>—</span>
                  <span className="font-bold" style={{ color: 'var(--brand-green)' }}>{update.title}</span>
                </div>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  {update.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Research Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-3d p-6"
        >
          <h2 className="font-black text-lg mb-4" style={{ color: 'var(--text-primary)' }}>🔬 Research Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {RESEARCH_INSIGHTS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--surface-1)' }}>
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.source}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.insight}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phases */}
        <div className="space-y-4">
          <h2 className="font-black text-xl" style={{ color: 'var(--text-primary)' }}>📋 Development Phases</h2>
          
          {PHASES.map((phase, index) => {
            const PhaseIcon = phase.icon;
            const progress = getPhaseProgress(phase);
            const isExpanded = expandedPhase === phase.id;
            const isDone = phase.priority === 'DONE';
            
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`card-3d overflow-hidden ${isDone ? 'opacity-80' : ''}`}
              >
                {/* Phase Header */}
                <button
                  onClick={() => setExpandedPhase(isExpanded ? -1 : phase.id)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-[#F7F4F0] transition-colors"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${phase.color}20` }}
                  >
                    <PhaseIcon className="w-6 h-6" style={{ color: phase.color }} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-black" style={{ color: 'var(--text-primary)' }}>Phase {phase.id}: {phase.title}</span>
                      <span 
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: phase.priority === 'DONE' ? '#58CC0220' : phase.priority === 'HIGH' ? '#FFC80020' : phase.priority === 'MEDIUM' ? '#1CB0F620' : '#CE82FF20',
                          color: phase.priority === 'DONE' ? '#58CC02' : phase.priority === 'HIGH' ? '#E5B400' : phase.priority === 'MEDIUM' ? '#1CB0F6' : '#CE82FF'
                        }}
                      >
                        {phase.priority}
                      </span>
                    </div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{phase.subtitle}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{progress}%</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{phase.tasks.filter(t => t.status === 'done').length}/{phase.tasks.length}</div>
                    </div>
                    <div className="w-24 hidden md:block">
                      <div className="progress-bar-3d h-2">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${progress}%`, backgroundColor: phase.color }}
                        />
                      </div>
                    </div>
                    <ChevronLeft className={`w-5 h-5 transition-transform ${isExpanded ? '-rotate-90' : ''}`} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </button>

                {/* Tasks */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t" style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="p-4 space-y-2">
                      {phase.tasks.map((task) => (
                        <div 
                          key={task.id}
                          className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                          style={{
                            backgroundColor: task.status === 'done' ? 'rgba(88, 204, 2, 0.1)' :
                                           task.status === 'in-progress' ? 'rgba(255, 200, 0, 0.1)' :
                                           'var(--surface-1)'
                          }}
                        >
                          {getStatusIcon(task.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{task.id} {task.title}</span>
                              {task.critical && (
                                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ 
                                  backgroundColor: 'rgba(255, 75, 75, 0.2)',
                                  color: 'var(--brand-red)'
                                }}>
                                  ⭐ CRITICAL
                                </span>
                              )}
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Beta Launch Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-3d card-3d-green p-6"
        >
          <h2 className="font-black text-lg mb-4" style={{ color: 'var(--text-primary)' }}>🎉 Ready for Beta Launch!</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <span className="text-3xl block mb-2">✅</span>
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>12 Games</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>All categories</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <span className="text-3xl block mb-2">✅</span>
              <p className="font-bold text-[#3C3C3C]">Auth & Billing</p>
              <p className="text-xs text-[#777777]">Premium ready</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <span className="text-3xl block mb-2">✅</span>
              <p className="font-bold text-[#3C3C3C]">Social</p>
              <p className="text-xs text-[#777777]">Friends & challenges</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <span className="text-3xl block mb-2">✅</span>
              <p className="font-bold text-[#3C3C3C]">Viral Sharing</p>
              <p className="text-xs text-[#777777]">All platforms</p>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <div className="flex justify-center pb-8">
          <Link to={createPageUrl('Home')}>
            <button className="btn-3d btn-3d-green px-8 py-3 text-lg">
              🚀 Back to App
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
