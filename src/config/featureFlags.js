// Centralized feature flags. Default OFF to prevent unintended changes.
// Flags can be overridden via Vite env vars (e.g., VITE_FLAG_BLITZ=true).

const readBool = (key) => {
  const raw = import.meta?.env?.[key];
  if (raw === undefined) return false;
  return String(raw).toLowerCase() === 'true';
};

export const FEATURE_FLAGS = {
  BLITZ: readBool('VITE_FLAG_BLITZ'),
  REMATCH: readBool('VITE_FLAG_REMATCH'),
  SWIPE: readBool('VITE_FLAG_SWIPE'),
  DAILY_DROP: readBool('VITE_FLAG_DAILY_DROP'),
  ADS_RECOVERY_ONLY: readBool('VITE_FLAG_ADS_RECOVERY_ONLY'),
  EVENTS: readBool('VITE_FLAG_EVENTS'),
  ROAST_YOURSELF: readBool('VITE_FLAG_ROAST_YOURSELF'),
};

// Convenience helpers
export const isFlagEnabled = (flag) => Boolean(FEATURE_FLAGS[flag]);

