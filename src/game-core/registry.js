// Renderer registry placeholder. Games can map to a renderer by gameMode.
// This sets up the structure without changing existing render flow.

import { GAME_MODES } from './types';

/**
 * @typedef {Object} RendererRegistry
 * @property {function} quiz
 * @property {function} opinion
 * @property {function} timeline
 * @property {function} connection
 */

// Consumers can register renderers; keep defaults undefined to avoid side effects.
// The shape allows multiple registrants; last write wins.
const registry = {
  [GAME_MODES.QUIZ]: undefined,
  [GAME_MODES.OPINION]: undefined,
  [GAME_MODES.TIMELINE]: undefined,
  [GAME_MODES.CONNECTION]: undefined,
};

export const registerRenderer = (mode, rendererFn) => {
  registry[mode] = rendererFn;
};

export const getRenderer = (mode) => registry[mode];

export const getRegistry = () => ({ ...registry });

/**
 * Safely render by mode if a renderer is registered; otherwise return null.
 * @param {string} mode
 * @param {any} props
 * @returns {JSX.Element|null}
 */
export const renderByMode = (mode, props) => {
  const renderer = getRenderer(mode);
  if (!renderer) return null;
  return renderer(props);
};
