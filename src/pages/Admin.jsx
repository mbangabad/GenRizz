import React, { useState, useEffect } from 'react';
import { auth } from '@/api/auth';
import { Report, UserSubmittedQuestion, Question, PlatformStats } from '@/api/entities';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Gamepad2, Sparkles, ShieldAlert, 
  Users, Bell, Settings, ArrowLeft, Menu, PieChart, 
  TrendingUp, DollarSign, Activity, AlertTriangle,
  Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import AdminOverview from '@/components/admin/AdminOverview';
import ContentEngine from '@/components/admin/ContentEngine';
import GameManager from '@/components/admin/GameManager';
import AnalyticsDeepDive from '@/components/admin/AnalyticsDeepDive';
import RiskCenter from '@/components/admin/RiskCenter';
import BetaAccess from '@/components/admin/BetaAccess';
import InviteManager from '@/components/admin/InviteManager';
import FlagPreviewPanel from '@/components/admin/FlagPreviewPanel';
import ValidatorSummary from '@/components/admin/ValidatorSummary';
import EventsAdmin from '@/components/admin/EventsAdmin';
import UserAccessPanel from '@/components/admin/UserAccessPanel';
import PricingPanel from '@/components/admin/PricingPanel';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import { getFlagOverrides, getFlags } from '@/services/flags';
import ContentSafetyPanel from '@/components/admin/ContentSafetyPanel';

// Simple Moderation Component
function ModerationPanel() {
  const [reports, setReports] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [tab, setTab] = useState('ugc');

  useEffect(() => {
    Report.filter({ status: 'pending' }).then(setReports);
    UserSubmittedQuestion.filter({ status: 'pending' }).then(setPendingQuestions);
  }, []);

  const handleModeration = async (item, status, type) => {
    if (type === 'ugc') {
      await UserSubmittedQuestion.update(item.id, { status });
      if (status === 'approved') {
        await Question.create({
          game_id: item.game_id,
          difficulty: item.difficulty || 5,
          type: 'mcq',
          question: item.question,
          options: item.options,
          correct_index: item.correct_index,
          explanation: item.explanation || "Community Submission"
        });
      }
      setPendingQuestions(prev => prev.filter(q => q.id !== item.id));
    } else {
      await Report.update(item.id, { status });
      setReports(prev => prev.filter(r => r.id !== item.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-[#E5E0DA]">
        <button onClick={() => setTab('ugc')} className={`pb-3 font-bold px-4 ${tab === 'ugc' ? 'text-[#58CC02] border-b-2 border-[#58CC02]' : 'text-[#AFAFAF]'}`}>
          UGC Queue ({pendingQuestions.length})
        </button>
        <button onClick={() => setTab('reports')} className={`pb-3 font-bold px-4 ${tab === 'reports' ? 'text-[#FF4B4B] border-b-2 border-[#FF4B4B]' : 'text-[#AFAFAF]'}`}>
          Reports ({reports.length})
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tab === 'ugc' && pendingQuestions.map(q => (
          <div key={q.id} className="card-3d p-4 bg-white flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-[#AFAFAF] uppercase">{q.game_id}</span>
              <h3 className="font-bold text-[#3C3C3C]">{q.question}</h3>
              <p className="text-xs text-[#777777] mt-1">{q.options.join(', ')}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleModeration(q, 'approved', 'ugc')} className="btn-3d btn-3d-green px-4 py-2 text-xs">Approve</button>
              <button onClick={() => handleModeration(q, 'rejected', 'ugc')} className="btn-3d btn-3d-ghost px-4 py-2 text-xs text-red-500">Reject</button>
            </div>
          </div>
        ))}
        {tab === 'reports' && reports.map(r => (
          <div key={r.id} className="card-3d p-4 bg-white border-l-4 border-l-red-500">
            <h3 className="font-bold text-red-500 uppercase text-xs">{r.type}</h3>
            <p className="font-bold text-[#3C3C3C]">{r.reason}</p>
            <p className="text-xs text-[#777777] mb-2">Target: {r.target_id}</p>
            <button onClick={() => handleModeration(r, 'resolved', 'report')} className="btn-3d btn-3d-ghost px-3 py-1 text-xs">Resolve</button>
          </div>
        ))}
        {pendingQuestions.length === 0 && tab === 'ugc' && <p className="text-[#AFAFAF] text-center py-8">All caught up!</p>}
        {reports.length === 0 && tab === 'reports' && <p className="text-[#AFAFAF] text-center py-8">No reports.</p>}
      </div>
    </div>
  );
}

const MENU_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-[#1CB0F6]' },
  { id: 'analytics', label: 'Analytics & Trends', icon: TrendingUp, color: 'text-[#CE82FF]' },
  { id: 'risks', label: 'Risk & Health', icon: Activity, color: 'text-[#FF4B4B]' },
  { id: 'games', label: 'Game Manager', icon: Gamepad2, color: 'text-[#FFC800]' },
  { id: 'content', label: 'Content Engine', icon: Sparkles, color: 'text-[#58CC02]' },
  { id: 'events', label: 'Events & Daily', icon: Bell, color: 'text-[#1CB0F6]' },
  { id: 'pricing', label: 'Pricing & Offers', icon: DollarSign, color: 'text-[#58CC02]' },
  { id: 'safety', label: 'Content Safety', icon: ShieldAlert, color: 'text-[#FF9600]' },
  { id: 'invites', label: 'Invites', icon: Ticket, color: 'text-[#FFC800]' },
  { id: 'moderation', label: 'Moderation', icon: ShieldAlert, color: 'text-[#FF9600]' },
  { id: 'beta', label: 'Beta Access', icon: Users, color: 'text-[#3C3C3C]' },
  { id: 'access', label: 'User Access', icon: Bell, color: 'text-[#1CB0F6]' },
];

export default function Admin() {
  // Admin already rendered within app Router; no need to wrap again
  return <AdminShell />;
}

function AdminShell() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overrideCount, setOverrideCount] = useState(0);
  const adsEnabled = Boolean(getFlags().ADS_RECOVERY_ONLY);
  const devAdminBypass = String(import.meta.env.VITE_DEV_ADMIN_BYPASS || '').toLowerCase() === 'true';
  const devAdminEmail = import.meta.env.VITE_DEV_ADMIN_EMAIL || 'dev@genrizz.local';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (devAdminBypass) {
          setUser({ id: 'dev-admin', email: devAdminEmail, role: 'admin' });
        } else {
          const currentUser = await auth.me();
          if (!currentUser || currentUser.role !== 'admin') {
            window.location.href = createPageUrl('Home'); // Redirect non-admins
            return;
          }
          setUser(currentUser);
          
          // Fetch platform stats
          const res = await PlatformStats.list('created_at', 1, false);
          if (res && res.length > 0) setStats(res[0]);
        }
      } catch (error) {
        window.location.href = createPageUrl('Home');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    setOverrideCount(Object.keys(getFlagOverrides()).length);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3C3C3C]" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#E5E0DA] flex flex-col transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-[#E5E0DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3C3C3C] flex items-center justify-center text-white shadow-lg">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-[#3C3C3C] text-xl tracking-tight">Admin</h1>
              <p className="text-[10px] font-bold text-[#AFAFAF] uppercase tracking-widest">Command Center</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden" aria-label="Close admin sidebar">
            <ArrowLeft className="w-6 h-6 text-[#3C3C3C]" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-[#3C3C3C] text-white shadow-lg transform scale-105' 
                  : 'text-[#777777] hover:bg-[#F0EDE8]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : item.color}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E5E0DA]">
          <div className="mb-4 px-2">
            <div className="flex justify-between text-[10px] font-bold text-[#AFAFAF] uppercase mb-1">
              <span>System Status</span>
              <span className="text-[#58CC02]">Operational</span>
            </div>
            <div className="h-1 bg-[#F0EDE8] rounded-full overflow-hidden">
              <div className="h-full w-full bg-[#58CC02] animate-pulse" />
            </div>
          </div>
          <Link to={createPageUrl('Home')}>
            <button className="w-full btn-3d btn-3d-ghost py-3 flex items-center justify-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to App
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#E5E0DA] sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6 text-[#3C3C3C]" />
            </button>
            <span className="font-black text-[#3C3C3C] text-lg">Admin Panel</span>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-black text-[#3C3C3C] tracking-tight">
                {MENU_ITEMS.find(i => i.id === activeTab)?.label}
              </h2>
              {overrideCount > 0 && (
                <p className="text-xs font-bold text-[#58CC02] mt-1">
                  Local flag overrides active: {overrideCount}
                </p>
              )}
              <p className="text-\[#AFAFAF\] font-semibold mt-1">
                {activeTab === 'overview' && "Real-time platform performance overview."}
                {activeTab === 'analytics' && "Deep dive into retention, cohorts, and user behavior."}
                {activeTab === 'risks' && "System health monitoring and active alerts."}
                {activeTab === 'content' && "AI-powered content generation studio."}
                {activeTab === 'events' && "Control Spotlight playlists and Daily Drop via Supabase."}
                {activeTab === 'pricing' && "Manage SKUs, test prices, and offers."}
                {activeTab === 'safety' && "Manage banned terms and admin whitelist (family-friendly defaults)."}
                {activeTab === 'games' && "Manage configurations and A/B tests."}
                {activeTab === 'access' && "Manage allowlist and beta access for users."}
                {activeTab === 'invites' && "Manage invite codes and early access cohorts."}
                {activeTab === 'moderation' && "Resolve reports and community content."}
                {activeTab === 'beta' && "Manage beta users and roles."}
              </p>
            </div>

            {activeTab === 'overview' && <AdminOverview stats={stats} />}
            {activeTab === 'analytics' && <AnalyticsDeepDive />}
            {activeTab === 'risks' && <RiskCenter />}
            {activeTab === 'games' && (
              <div className="space-y-6">
                <FlagPreviewPanel />
                <GameManager />
              </div>
            )}
            {activeTab === 'pricing' && <PricingPanel />}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <ValidatorSummary />
                <ContentEngine />
              </div>
            )}
            {activeTab === 'events' && <EventsAdmin />}
            {activeTab === 'analytics' && <AnalyticsPanel />}
            {activeTab === 'safety' && <ContentSafetyPanel />}
            {activeTab === 'invites' && <InviteManager />}
            {activeTab === 'moderation' && <ModerationPanel />}
            {activeTab === 'beta' && <BetaAccess />}
            {activeTab === 'access' && <UserAccessPanel />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
