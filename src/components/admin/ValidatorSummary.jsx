import React, { useEffect, useState } from 'react';
import { FileCheck, RefreshCw } from 'lucide-react';

export default function ValidatorSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('/tmp/content-validation-summary.json')
      .then(res => res.ok ? res.json() : null)
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  const handleRefresh = () => {
    setSummary(null);
    fetch('/tmp/content-validation-summary.json')
      .then(res => res.ok ? res.json() : null)
      .then(setSummary)
      .catch(() => setSummary(null));
  };

  return (
    <div className="card-3d p-4 bg-white border border-[#E5E0DA]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#58CC02]" />
          <p className="font-black text-[#3C3C3C]">Content Validator</p>
        </div>
        <button onClick={handleRefresh} className="text-xs text-[#777777] flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> refresh
        </button>
      </div>
      {summary ? (
        <div className="text-sm text-[#3C3C3C] space-y-1">
          <p><span className="font-bold">{summary.checked}</span> questions checked</p>
          <p><span className="font-bold text-[#FFC800]">{summary.warnings}</span> warnings</p>
          <p><span className="font-bold text-[#FF4B4B]">{summary.errors}</span> errors</p>
          <p className="text-[11px] text-[#AFAFAF]">Last run: {summary.timestamp}</p>
        </div>
      ) : (
        <p className="text-xs text-[#AFAFAF]">No summary found. Run npm run content:check.</p>
      )}
    </div>
  );
}
