import React, { useState } from 'react';
import { 
  FlaskConical, Split, Gauge, Play, Pause, 
  MoreHorizontal, Settings, BarChart3, X, Save, 
  CheckCircle, AlertCircle, Users, Clock, TrendingUp,
  Plus
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar 
} from 'recharts';
import { GAMES_LIST } from '@/components/constants/games';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { logAdminAction } from '@/services/telemetry';
import { supabase } from '@/lib/supabase';

// Mock data for charts
const GAME_STATS_DATA = [
  { day: 'Mon', plays: 120, avgScore: 75 },
  { day: 'Tue', plays: 150, avgScore: 78 },
  { day: 'Wed', plays: 180, avgScore: 72 },
  { day: 'Thu', plays: 220, avgScore: 80 },
  { day: 'Fri', plays: 300, avgScore: 85 },
  { day: 'Sat', plays: 450, avgScore: 82 },
  { day: 'Sun', plays: 380, avgScore: 79 },
];

export default function GameManager() {
  const [experiments, setExperiments] = useState([
    { id: 1, name: 'Harder Onboarding', status: 'running', traffic: 50, variantA: 'Level 1 Difficulty', variantB: 'Level 3 Difficulty', impact: '+5% Retention' },
    { id: 2, name: 'Premium Price Test', status: 'paused', traffic: 10, variantA: '$4.99', variantB: '$6.99', impact: 'Inconclusive' },
    { id: 3, name: 'Viral Loop Trigger', status: 'running', traffic: 100, variantA: 'After 5 Questions', variantB: 'After Result', impact: '+12% Shares' },
  ]);

  // Modal States
  const [editingGame, setEditingGame] = useState(null);
  const [viewingStats, setViewingStats] = useState(null);
  const [creatingExperiment, setCreatingExperiment] = useState(false);

  // Config Form State
  const [gameConfig, setGameConfig] = useState({});
  
  // Experiment Form State
  const [newExperiment, setNewExperiment] = useState({
    name: '',
    traffic: 50,
    variantA: 'Control',
    variantB: 'Variant B'
  });

  const openConfig = (game) => {
    setEditingGame(game);
    setGameConfig({
      ...game,
      enabled: true,
      featured: false,
      difficultyMultiplier: 1.0,
      xpReward: 100
    });
  };

  const handleSaveConfig = () => {
    // In a real app, this would save to backend
    logAdminAction('game_config_save', { gameId: editingGame?.id, config: gameConfig });
    supabase.from('game_configs').upsert({ game_id: editingGame?.id, config: gameConfig, active: true }).catch(() => {});
    alert(`Configuration saved for ${editingGame.title}!`);
    setEditingGame(null);
  };

  const handleCreateExperiment = () => {
    const experiment = {
      id: Date.now(),
      ...newExperiment,
      status: 'running',
      impact: 'Calculating...'
    };
    setExperiments([experiment, ...experiments]);
    setCreatingExperiment(false);
    setNewExperiment({ name: '', traffic: 50, variantA: 'Control', variantB: 'Variant B' });
    logAdminAction('experiment_create', { name: newExperiment.name, traffic: newExperiment.traffic });
  };

  return (
    <div className="space-y-8 relative">
      {/* A/B Testing Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FlaskConical className="w-6 h-6" style={{ color: 'var(--brand-red)' }} /> Live Experiments (A/B)
          </h2>
          <button 
            onClick={() => setCreatingExperiment(true)}
            className="btn-3d btn-3d-ghost px-4 py-2 text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Experiment
          </button>
        </div>

        <div className="grid gap-4">
          {experiments.map(exp => (
            <div key={exp.id} className="card-3d p-5 bg-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  exp.status === 'running' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Split className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{exp.name}</h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      exp.status === 'running' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {exp.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold mt-1" style={{ color: 'var(--text-muted)' }}>
                    {exp.traffic}% Traffic • {exp.variantA} vs {exp.variantB}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Impact</p>
                  <p className="font-black" style={{ color: exp.impact.includes('+') ? 'var(--brand-green)' : 'var(--text-secondary)' }}>
                    {exp.impact}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Game Config Section */}
      <section>
        <h2 className="text-xl font-black flex items-center gap-2 mb-6" style={{ color: 'var(--text-primary)' }}>
          <Settings className="w-6 h-6" style={{ color: 'var(--text-primary)' }} /> Game Configurations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES_LIST.map(game => (
            <div key={game.id} className="card-3d p-4 bg-white group transition-colors" style={{ '--hover-border-color': 'var(--brand-blue)' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-blue)'} onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">{game.icon}</div>
                <div className="flex gap-1">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-500">
                    v1.2
                  </span>
                </div>
              </div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{game.title}</h3>
              <p className="text-xs font-semibold mb-4 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{game.description}</p>
              
              <div className="flex gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button 
                  onClick={() => openConfig(game)}
                  className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  style={{ color: 'var(--text-secondary)', '--hover-color': 'var(--brand-blue)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--brand-blue)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                >
                  <Gauge className="w-3 h-3" /> Config
                </button>
                <button 
                  onClick={() => setViewingStats(game)}
                  className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  style={{ color: 'var(--text-secondary)', '--hover-color': 'var(--brand-green)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--brand-green)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                >
                  <BarChart3 className="w-3 h-3" /> Stats
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODALS --- */}

      {/* Experiment Modal */}
      {creatingExperiment && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-bounce-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>New Experiment</h3>
              <button onClick={() => setCreatingExperiment(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Experiment Name</label>
                <Input 
                  value={newExperiment.name}
                  onChange={e => setNewExperiment({...newExperiment, name: e.target.value})}
                  placeholder="e.g. Button Color Test" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Variant A (Control)</label>
                  <Input 
                    value={newExperiment.variantA}
                    onChange={e => setNewExperiment({...newExperiment, variantA: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Variant B (Test)</label>
                  <Input 
                    value={newExperiment.variantB}
                    onChange={e => setNewExperiment({...newExperiment, variantB: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                  Traffic Allocation: {newExperiment.traffic}%
                </label>
                <Slider 
                  value={[newExperiment.traffic]} 
                  onValueChange={v => setNewExperiment({...newExperiment, traffic: v[0]})} 
                  min={1} max={100} step={1}
                />
              </div>

              <button 
                onClick={handleCreateExperiment}
                disabled={!newExperiment.name}
                className="btn-3d btn-3d-green w-full py-3 mt-4 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Launch Experiment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {editingGame && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl animate-bounce-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{editingGame.icon}</span>
                <div>
                  <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{editingGame.title}</h3>
                  <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Configuration</p>
                </div>
              </div>
              <button onClick={() => setEditingGame(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border-2" style={{ backgroundColor: 'var(--page-bg)', borderColor: 'var(--border-subtle)' }}>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>Game Enabled</h4>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Players can find and play this game</p>
                </div>
                <Switch 
                  checked={gameConfig.enabled} 
                  onCheckedChange={c => setGameConfig({...gameConfig, enabled: c})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border-2" style={{ backgroundColor: 'var(--page-bg)', borderColor: 'var(--border-subtle)' }}>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>Featured Status</h4>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Promote on home screen dashboard</p>
                </div>
                <Switch 
                  checked={gameConfig.featured} 
                  onCheckedChange={c => setGameConfig({...gameConfig, featured: c})}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase mb-2 block" style={{ color: 'var(--text-muted)' }}>
                  Difficulty Multiplier (x{gameConfig.difficultyMultiplier})
                </label>
                <Slider 
                  value={[gameConfig.difficultyMultiplier]} 
                  onValueChange={v => setGameConfig({...gameConfig, difficultyMultiplier: v[0]})} 
                  min={0.5} max={2.0} step={0.1}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase mb-2 block" style={{ color: 'var(--text-muted)' }}>
                  XP Reward Base
                </label>
                <Input 
                  type="number"
                  value={gameConfig.xpReward}
                  onChange={e => setGameConfig({...gameConfig, xpReward: parseInt(e.target.value)})}
                  className="font-bold"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setEditingGame(null)}
                  className="flex-1 btn-3d btn-3d-ghost py-3"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveConfig}
                  className="flex-1 btn-3d btn-3d-blue py-3 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {viewingStats && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl animate-bounce-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{viewingStats.icon}</span>
                <div>
                  <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{viewingStats.title}</h3>
                  <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Live Statistics</p>
                </div>
              </div>
              <button onClick={() => setViewingStats(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="card-3d p-4" style={{ backgroundColor: 'var(--page-bg)' }}>
                <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Total Plays</p>
                <h4 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>14.2k</h4>
                <p className="text-xs font-bold" style={{ color: 'var(--brand-green)' }}>+12% this week</p>
              </div>
              <div className="card-3d p-4" style={{ backgroundColor: 'var(--page-bg)' }}>
                <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Avg Score</p>
                <h4 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>78%</h4>
                <p className="text-xs font-bold" style={{ color: 'var(--brand-yellow)' }}>Medium difficulty</p>
              </div>
              <div className="card-3d p-4" style={{ backgroundColor: 'var(--page-bg)' }}>
                <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Avg Time</p>
                <h4 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>2m 14s</h4>
                <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Per session</p>
              </div>
            </div>

            <div className="card-3d p-4 bg-white mb-6">
              <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Play History (7 Days)</h4>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GAME_STATS_DATA}>
                    <defs>
                      <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1CB0F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1CB0F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#AFAFAF'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#AFAFAF'}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                    <Area type="monotone" dataKey="plays" stroke="#1CB0F6" strokeWidth={3} fillOpacity={1} fill="url(#colorPlays)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 rounded-xl text-white" style={{ backgroundColor: '#1e1e1e' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" style={{ color: 'var(--brand-red)' }} />
                <h4 className="font-bold">Drop-off Points</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Question 5 (Difficulty spike)</span>
                  <span className="font-bold" style={{ color: 'var(--brand-red)' }}>12% Drop</span>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full">
                  <div className="w-[12%] h-full rounded-full" style={{ backgroundColor: 'var(--brand-red)' }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
