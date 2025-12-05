import React from 'react';
import { Globe, Users } from 'lucide-react';

export default function LeaderboardTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
      <button
        onClick={() => onTabChange('global')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
          activeTab === 'global'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Globe className="w-4 h-4" />
        Global
      </button>
      <button
        onClick={() => onTabChange('friends')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
          activeTab === 'friends'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Users className="w-4 h-4" />
        Friends
      </button>
    </div>
  );
}