import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { getFlags, setFlagOverride, clearFlagOverride, clearAllFlagOverrides, getFlagOverrides } from '@/services/flags';

const FLAG_DESCRIPTIONS = {
  BLITZ: 'Enable Blitz timed mode selection.',
  REMATCH: 'Enable rematch deep links/buttons.',
  SWIPE: 'Enable swipe/hot takes mechanics.',
  DAILY_DROP: 'Enable Daily Drop blended playlist.',
  ADS_RECOVERY_ONLY: 'Show rewarded ads in recovery moments (guarded).',
  EVENTS: 'Enable Spotlight/Events surfaces.',
  ROAST_YOURSELF: 'Enable Roast Yourself mode.',
};

export default function FlagPreviewPanel() {
  const [flags, setFlags] = useState(getFlags());
  const [overrides, setOverrides] = useState(getFlagOverrides());

  useEffect(() => {
    setFlags(getFlags());
    setOverrides(getFlagOverrides());
  }, []);

  const handleToggle = (key) => {
    const next = !flags[key];
    setFlags(setFlagOverride(key, next));
    setOverrides(getFlagOverrides());
  };

  const handleClear = (key) => {
    setFlags(clearFlagOverride(key));
    setOverrides(getFlagOverrides());
  };

  const handleClearAll = () => {
    setFlags(clearAllFlagOverrides());
    setOverrides(getFlagOverrides());
  };

  return (
    <div className="card-3d p-5 bg-white border border-[#E5E0DA] shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-black text-[#3C3C3C]">Feature Flags (Preview)</h3>
          <p className="text-xs text-[#777777]">Local overrides only. Env defaults remain unchanged.</p>
        </div>
        <button onClick={handleClearAll} className="btn-3d btn-3d-ghost px-3 py-2 text-xs">Clear all</button>
      </div>
      <div className="space-y-3">
        {Object.keys(FEATURE_FLAGS).map((key) => (
          <div key={key} className="flex items-center justify-between border rounded-xl px-3 py-2">
            <div>
              <p className="font-bold text-sm text-[#3C3C3C]">{key}</p>
              <p className="text-[11px] text-[#777777]">{FLAG_DESCRIPTIONS[key] || 'Feature toggle'}</p>
              {overrides[key] !== undefined && (
                <p className="text-[11px] text-[#58CC02]">Override active ({overrides[key] ? 'on' : 'off'})</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {overrides[key] !== undefined && (
                <button onClick={() => handleClear(key)} className="text-xs text-[#AFAFAF] hover:text-[#3C3C3C]">Reset</button>
              )}
              <Switch checked={Boolean(flags[key])} onCheckedChange={() => handleToggle(key)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
