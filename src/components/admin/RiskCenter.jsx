import React from 'react';
import { 
  AlertTriangle, ShieldCheck, Server, CloudLightning, 
  Database, Lock, Activity, CheckCircle 
} from 'lucide-react';

const RISKS = [
  { id: 1, level: 'high', area: 'Infrastructure', issue: 'Database CPU Load > 85%', status: 'Critical', impact: 'High Latency' },
  { id: 2, level: 'medium', area: 'Content', issue: 'Report spike in "Gen Z" quiz', status: 'Investigating', impact: 'User Trust' },
  { id: 3, level: 'low', area: 'Security', issue: '3 Failed Admin Login Attempts', status: 'Blocked', impact: 'None' },
];

const SYSTEM_HEALTH = [
  { name: 'API Latency', value: '45ms', status: 'healthy', icon: CloudLightning },
  { name: 'Database', value: '99.9% Uptime', status: 'healthy', icon: Database },
  { name: 'Auth Service', value: 'Operational', status: 'healthy', icon: Lock },
  { name: 'AI Engine', value: 'Processing', status: 'warning', icon: Activity },
];

export default function RiskCenter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* System Health Grid */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {SYSTEM_HEALTH.map((item, i) => (
          <div key={i} className="card-3d p-4 bg-white border-l-4 border-l-[#58CC02]">
            <div className="flex justify-between items-start mb-2">
              <item.icon className={`w-5 h-5 ${item.status === 'healthy' ? 'text-[#58CC02]' : 'text-[#FFC800]'}`} />
              {item.status === 'healthy' ? (
                <CheckCircle className="w-4 h-4 text-[#58CC02]" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#FFC800]" />
              )}
            </div>
            <p className="text-xs font-bold text-[#AFAFAF] uppercase">{item.name}</p>
            <p className="text-lg font-black text-[#3C3C3C]">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Active Risks */}
      <div className="lg:col-span-2 space-y-6">
        <div className="card-3d p-6 bg-white border-t-4 border-t-[#FF4B4B]">
          <h3 className="font-black text-[#3C3C3C] mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#FF4B4B]" /> Active Risks & Alerts
          </h3>
          
          <div className="space-y-4">
            {RISKS.map(risk => (
              <div key={risk.id} className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-xl border border-[#E5E0DA]">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    risk.level === 'high' ? 'bg-red-100 text-red-600' :
                    risk.level === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#3C3C3C]">{risk.issue}</h4>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        risk.level === 'high' ? 'bg-red-100 text-red-600' :
                        risk.level === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {risk.level}
                      </span>
                    </div>
                    <p className="text-xs text-[#777777] font-semibold mt-1">
                      Area: {risk.area} • Impact: {risk.impact}
                    </p>
                  </div>
                </div>
                <button className="btn-3d btn-3d-ghost px-3 py-1 text-xs">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance / Estimates */}
        <div className="card-3d p-6 bg-white">
          <h3 className="font-black text-[#3C3C3C] mb-4">Compliance Estimates</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span>GDPR Data Retention</span>
                <span className="text-[#58CC02]">98% Compliant</span>
              </div>
              <div className="h-2 bg-[#E5E0DA] rounded-full overflow-hidden">
                <div className="h-full w-[98%] bg-[#58CC02]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span>Accessibility Score (WCAG)</span>
                <span className="text-[#FFC800]">85% Compliant</span>
              </div>
              <div className="h-2 bg-[#E5E0DA] rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-[#FFC800]" />
              </div>
              <p className="text-xs text-[#AFAFAF] mt-1">Suggestion: Improve contrast on admin dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="card-3d p-6 bg-[#1E1E1E] text-white">
        <h3 className="font-black mb-6 flex items-center gap-2">
          <Server className="w-6 h-6 text-[#58CC02]" /> Server Metrics
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">CPU Usage</p>
              <p className="text-2xl font-mono font-bold text-green-400">42%</p>
            </div>
            <div className="w-24 h-8 bg-gray-800 rounded overflow-hidden relative">
              <div className="absolute bottom-0 left-0 w-full bg-green-500/20 h-full animate-pulse" />
              <div className="absolute bottom-0 left-0 w-[42%] bg-green-500 h-full" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Memory</p>
              <p className="text-2xl font-mono font-bold text-yellow-400">68%</p>
            </div>
            <div className="w-24 h-8 bg-gray-800 rounded overflow-hidden relative">
              <div className="absolute bottom-0 left-0 w-[68%] bg-yellow-500 h-full" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Storage</p>
              <p className="text-2xl font-mono font-bold text-blue-400">23%</p>
            </div>
            <div className="w-24 h-8 bg-gray-800 rounded overflow-hidden relative">
              <div className="absolute bottom-0 left-0 w-[23%] bg-blue-500 h-full" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 font-mono">
              &gt; Last backup: 2h ago<br/>
              &gt; Region: us-east-1<br/>
              &gt; Status: ONLINE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}