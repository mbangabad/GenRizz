// Shared types and helpers for games. JSDoc used for editor support in JS projects.

/**
 * @typedef {Object} GameDefinition
 * @property {string} id
 * @property {string} category
 * @property {string} title
 * @property {string} [subtitle]
 * @property {('quiz'|'opinion'|'timeline'|'connection')} gameMode
 * @property {Record<string, boolean>} capabilities
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} game_id
 * @property {string} category
 * @property {('mcq'|'scenario'|'opinion'|'ordering'|'connection'|'image'|'audio'|'slider'|'ranking'|'emoji-decode'|'video-ref')} type
 * @property {string} prompt
 * @property {string[]} [options]
 * @property {number} [correct_index]
 * @property {number} difficulty
 * @property {string[]} [tags]
 * @property {string} [explanation]
 * @property {string} [source]
 * @property {boolean} [family_safe]
 */

export const GAME_MODES = {
  QUIZ: 'quiz',
  OPINION: 'opinion',
  TIMELINE: 'timeline',
  CONNECTION: 'connection',
};

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  SCENARIO: 'scenario',
  OPINION: 'opinion',
  ORDERING: 'ordering',
  CONNECTION: 'connection',
  IMAGE: 'image',
  AUDIO: 'audio',
  SLIDER: 'slider',
  RANKING: 'ranking',
  EMOJI_DECODE: 'emoji-decode',
  VIDEO_REF: 'video-ref',
};

