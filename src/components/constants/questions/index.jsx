// Question Database Index
// Consolidates JSON catalogs (normalized) with legacy fallbacks for non-JSON sets.

import GEN_Z_FLUENCY_JSON from './json/gen-z-fluency.json' with { type: 'json' };
import REVENGE_OF_BOOMERS_JSON from './json/revenge-of-boomers.json' with { type: 'json' };
import DAD_JOKES_JSON from './json/dad-jokes.json' with { type: 'json' };
import Y2K_CULTURE_JSON from './json/y2k-culture.json' with { type: 'json' };
import MILLENNIAL_NOSTALGIA_JSON from './json/millennial-nostalgia.json' with { type: 'json' };
import EMOJI_DETECTIVE_JSON from './json/emoji-detective.json' with { type: 'json' };
import MENTAL_AGE_JSON from './json/mental-age.json' with { type: 'json' };
import GENERATION_QUIZ_JSON from './json/generation-quiz.json' with { type: 'json' };
import SOCIAL_INTELLIGENCE_JSON from './json/social-intelligence.json' with { type: 'json' };
import ANALOG_LIFE_JSON from './json/analog-life.json' with { type: 'json' };
import GEN_X_WISDOM_JSON from './json/gen-x-wisdom.json' with { type: 'json' };
import NINETIES_MUSIC_JSON from './json/nineties-music.json' with { type: 'json' };
import DATING_DECODER_JSON from './json/dating-decoder.json' with { type: 'json' };
import TEXT_INTERPRETATION_JSON from './json/text-interpretation.json' with { type: 'json' };
import GENERATION_GAP_JSON from './json/generation-gap.json' with { type: 'json' };
import COMMUNICATION_STYLES_JSON from './json/communication-styles.json' with { type: 'json' };
import VINTAGE_COMEDY_JSON from './json/vintage-comedy.json' with { type: 'json' };
import IPAD_KID_CULTURE_JSON from './json/ipad-kid-culture.json' with { type: 'json' };
import TIKTOK_NATIVES_JSON from './json/tiktok-natives.json' with { type: 'json' };
import RED_FLAG_DETECTOR_JSON from './json/red-flag-detector.json' with { type: 'json' };
import BOOMER_ERA_JSON from './json/boomer-era.json' with { type: 'json' };
import GEN_ALPHA_JSON from './json/gen-alpha.json' with { type: 'json' };
import SOCIAL_IQ_JSON from './json/social-iq.json' with { type: 'json' };
import FAMILY_BRIDGE_JSON from './json/family-bridge.json' with { type: 'json' };
import VIBE_CHECK_JSON from './json/vibe-check.json' with { type: 'json' };
import SOCIAL_AWARENESS_JSON from './json/social-awareness.json' with { type: 'json' };
import BOOMER_HUMOR_JSON from './json/boomer-humor.json' with { type: 'json' };
import LINK_UP_JSON from './json/link-up.json' with { type: 'json' };
import TIMELINE_JSON from './json/timeline.json' with { type: 'json' };
import VIBE_CHECK_QUESTIONS from './vibe-check';
import { getImageQuestionsForGame } from './image-questions';
import { getAudioQuestionsForGame } from './audio-questions';
import { getSwipeQuestionsForGame } from './swipe-questions';
import { getMatchingQuestionsForGame } from './matching-questions';

const RAW_JSON_CATALOGS = {
  'gen-z-fluency': GEN_Z_FLUENCY_JSON,
  'emoji-detective': EMOJI_DETECTIVE_JSON,
  'revenge-of-boomers': REVENGE_OF_BOOMERS_JSON,
  'analog-life': ANALOG_LIFE_JSON,
  'millennial-nostalgia': MILLENNIAL_NOSTALGIA_JSON,
  'y2k-culture': Y2K_CULTURE_JSON,
  'gen-x-wisdom': GEN_X_WISDOM_JSON,
  'nineties-music': NINETIES_MUSIC_JSON,
  'ipad-kid-culture': IPAD_KID_CULTURE_JSON,
  'tiktok-natives': TIKTOK_NATIVES_JSON,
  'mental-age': MENTAL_AGE_JSON,
  'generation-quiz': GENERATION_QUIZ_JSON,
  'dating-decoder': DATING_DECODER_JSON,
  'text-interpretation': TEXT_INTERPRETATION_JSON,
  'generation-gap': GENERATION_GAP_JSON,
  'communication-styles': COMMUNICATION_STYLES_JSON,
  'social-intelligence': SOCIAL_INTELLIGENCE_JSON,
  'red-flag-detector': RED_FLAG_DETECTOR_JSON,
  'dad-jokes': DAD_JOKES_JSON,
  'vintage-comedy': VINTAGE_COMEDY_JSON,
  'boomer-era': BOOMER_ERA_JSON,
  'gen-alpha': GEN_ALPHA_JSON,
  'social-iq': SOCIAL_IQ_JSON,
  'family-bridge': FAMILY_BRIDGE_JSON,
  'vibe-check': VIBE_CHECK_JSON,
  'social-awareness': SOCIAL_AWARENESS_JSON,
  'boomer-humor': BOOMER_HUMOR_JSON,
  'link-up': LINK_UP_JSON,
  'timeline': TIMELINE_JSON,
};

const mergeQuestions = (...ids) => ids.flatMap(id => RAW_JSON_CATALOGS[id] || []);

// Consolidated games mapping - combine related games (JSON-first, legacy fallback)
const TEXT_QUESTIONS_BY_GAME = {
  'gen-z-fluency': mergeQuestions('gen-z-fluency', 'emoji-detective'),
  'boomer-era': mergeQuestions('boomer-era', 'revenge-of-boomers', 'analog-life'),
  'millennial-nostalgia': mergeQuestions('millennial-nostalgia', 'y2k-culture'),
  'gen-x-wisdom': mergeQuestions('gen-x-wisdom', 'nineties-music'),
  'gen-alpha': mergeQuestions('gen-alpha', 'ipad-kid-culture', 'tiktok-natives'),
  'mental-age': mergeQuestions('mental-age'),
  'generation-quiz': mergeQuestions('generation-quiz'),
  'social-iq': mergeQuestions('social-iq', 'dating-decoder', 'text-interpretation'),
  'family-bridge': mergeQuestions('family-bridge', 'generation-gap', 'communication-styles'),
  'vibe-check': mergeQuestions('vibe-check', 'red-flag-detector'),
  'social-awareness': mergeQuestions('social-awareness', 'social-intelligence'),
  'boomer-humor': mergeQuestions('boomer-humor', 'dad-jokes', 'vintage-comedy'),
  'link-up': mergeQuestions('link-up'),
  'timeline': mergeQuestions('timeline'),
};

const LEGACY_TEXT_QUESTIONS = {
  'vibe-check': VIBE_CHECK_QUESTIONS,
};

export const QUESTIONS_BY_GAME = TEXT_QUESTIONS_BY_GAME;

// Legacy mappings for backward compatibility
const LEGACY_GAME_MAPPING = {
  'revenge-of-boomers': 'boomer-era',
  'analog-life': 'boomer-era',
  'emoji-detective': 'gen-z-fluency',
  'y2k-culture': 'millennial-nostalgia',
  'nineties-music': 'gen-x-wisdom',
  'dating-decoder': 'social-iq',
  'text-interpretation': 'social-iq',
  'generation-gap': 'family-bridge',
  'communication-styles': 'family-bridge',
  'dad-jokes': 'boomer-humor',
  'vintage-comedy': 'boomer-humor',
  'ipad-kid-culture': 'gen-alpha',
  'tiktok-natives': 'gen-alpha',
  'red-flag-detector': 'vibe-check',
  'social-intelligence': 'social-awareness',
};

const resolveGameId = (gameId) => LEGACY_GAME_MAPPING[gameId] || gameId;

const getTextQuestions = (gameId) => {
  const mappedId = resolveGameId(gameId);
  const textQuestions = TEXT_QUESTIONS_BY_GAME[mappedId];
  if (textQuestions && textQuestions.length) return textQuestions;
  return LEGACY_TEXT_QUESTIONS[mappedId] || [];
};

// Helper to get questions for a game (with legacy support)
export const getQuestionsForGame = (gameId) => {
  const mappedId = resolveGameId(gameId);
  const textQuestions = getTextQuestions(mappedId);
  const imageQuestions = getImageQuestionsForGame(mappedId);
  const audioQuestions = getAudioQuestionsForGame(mappedId);
  const swipeQuestions = getSwipeQuestionsForGame(mappedId);
  const matchingQuestions = getMatchingQuestionsForGame(mappedId);
  
  // Combine all question types
  return [
    ...textQuestions,
    ...imageQuestions,
    ...audioQuestions,
    ...swipeQuestions,
    ...matchingQuestions,
  ];
};

// Get questions by specific type
export const getQuestionsByType = (gameId, type) => {
  const allQuestions = getQuestionsForGame(gameId);
  if (!type) return allQuestions;
  return allQuestions.filter(q => q.type === type || (!q.type && type === 'text'));
};

// Helper to get questions by difficulty range (for quiz games)
export const getQuestionsByDifficulty = (gameId, minDiff, maxDiff) => {
  const mappedId = resolveGameId(gameId);
  const questions = getTextQuestions(mappedId);
  return questions.filter(q => q.difficulty >= minDiff && q.difficulty <= maxDiff);
};

// Question count stats
export const getQuestionStats = () => {
  const stats = {};
  const allGameIds = new Set([...Object.keys(TEXT_QUESTIONS_BY_GAME), ...Object.keys(LEGACY_TEXT_QUESTIONS)]);
  allGameIds.forEach((gameId) => {
    const questions = getTextQuestions(gameId);
    stats[gameId] = questions.length;
  });
  return stats;
};

// Get game mode from question type
export const getGameModeFromQuestions = (gameId) => {
  const mappedId = resolveGameId(gameId);
  const questions = getTextQuestions(mappedId);
  if (questions.length === 0) return 'quiz';
  
  const firstQuestion = questions[0];
  if (firstQuestion.weights && firstQuestion.type === 'preference') return 'personality';
  if (firstQuestion.type === 'scenario-swipe' || firstQuestion.type === 'would-you-rather' || firstQuestion.type === 'slider') return 'opinion';
  if (firstQuestion.type === 'scenario' && firstQuestion.weights) return 'scenario';
  return 'quiz';
};
