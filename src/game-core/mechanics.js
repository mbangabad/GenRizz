// Shared mechanics placeholder stubs. These can be expanded without touching game UIs.

export const calculateScore = ({ percentage = 0, levelMultiplier = 1 }) => {
  return Math.round((percentage / 100) * 1000 * levelMultiplier);
};

export const buildShareCard = ({ gameId, percentage, title, emoji }) => {
  return {
    title: title || 'GenRizz',
    emoji: emoji || '⚡',
    summary: `${percentage}% on ${gameId}`,
    // placeholder; extend with OG image builder later
  };
};

export const buildDeepLink = ({ path = '/', params = {} }) => {
  const usp = new URLSearchParams(params);
  return `${path}${usp.toString() ? `?${usp.toString()}` : ''}`;
};

export const defaultCapabilities = () => ({
  supportsBlitz: false,
  supportsRematch: false,
  supportsSwipe: false,
  supportsDailyDrop: false,
  needsAudio: false,
});

