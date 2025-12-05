// Question Database Index
// 12 Consolidated Games across 4 Categories
// Game modes: quiz (right/wrong), personality (no wrong answers), opinion (crowd comparison)

import GEN_Z_FLUENCY_QUESTIONS from './gen-z-fluency';
import REVENGE_OF_BOOMERS_QUESTIONS from './revenge-of-boomers';
import DAD_JOKES_QUESTIONS from './dad-jokes';
import Y2K_CULTURE_QUESTIONS from './y2k-culture';
import MILLENNIAL_NOSTALGIA_QUESTIONS from './millennial-nostalgia';
import EMOJI_DETECTIVE_QUESTIONS from './emoji-detective';
import MENTAL_AGE_QUESTIONS from './mental-age';
import GENERATION_QUIZ_QUESTIONS from './generation-quiz';
import SOCIAL_INTELLIGENCE_QUESTIONS from './social-intelligence';
import ANALOG_LIFE_QUESTIONS from './analog-life';
import GEN_X_WISDOM_QUESTIONS from './gen-x-wisdom';
import NINETIES_MUSIC_QUESTIONS from './nineties-music';
import DATING_DECODER_QUESTIONS from './dating-decoder';
import TEXT_INTERPRETATION_QUESTIONS from './text-interpretation';
import GENERATION_GAP_QUESTIONS from './generation-gap';
import COMMUNICATION_STYLES_QUESTIONS from './communication-styles';
import VINTAGE_COMEDY_QUESTIONS from './vintage-comedy';
import IPAD_KID_CULTURE_QUESTIONS from './ipad-kid-culture';
import TIKTOK_NATIVES_QUESTIONS from './tiktok-natives';
import VIBE_CHECK_QUESTIONS from './vibe-check';
import { getImageQuestionsForGame } from './image-questions';
import { getAudioQuestionsForGame } from './audio-questions';
import { getSwipeQuestionsForGame } from './swipe-questions';
import { getMatchingQuestionsForGame } from './matching-questions';

// Consolidated games mapping - combine related games
export const QUESTIONS_BY_GAME = {
  // Gen Z Fluency (consolidated: gen-z-fluency + emoji-detective)
  'gen-z-fluency': [...GEN_Z_FLUENCY_QUESTIONS, ...EMOJI_DETECTIVE_QUESTIONS],
  
  // Boomer Era (consolidated: revenge-of-boomers + analog-life)
  'boomer-era': [...REVENGE_OF_BOOMERS_QUESTIONS, ...ANALOG_LIFE_QUESTIONS],
  
  // Millennial Nostalgia (consolidated: millennial-nostalgia + y2k-culture)
  'millennial-nostalgia': [...MILLENNIAL_NOSTALGIA_QUESTIONS, ...Y2K_CULTURE_QUESTIONS],
  
  // Gen X Wisdom (consolidated: gen-x-wisdom + nineties-music)
  'gen-x-wisdom': [...GEN_X_WISDOM_QUESTIONS, ...NINETIES_MUSIC_QUESTIONS],
  
  // Gen Alpha (consolidated: ipad-kid-culture + tiktok-natives)
  'gen-alpha': [...IPAD_KID_CULTURE_QUESTIONS, ...TIKTOK_NATIVES_QUESTIONS],
  
  // Personality Tests (unchanged)
  'mental-age': MENTAL_AGE_QUESTIONS,
  'generation-quiz': GENERATION_QUIZ_QUESTIONS,
  
  // Social IQ (consolidated: dating-decoder + text-interpretation)
  'social-iq': [...DATING_DECODER_QUESTIONS, ...TEXT_INTERPRETATION_QUESTIONS],
  
  // Family Bridge (consolidated: generation-gap + communication-styles)
  'family-bridge': [...GENERATION_GAP_QUESTIONS, ...COMMUNICATION_STYLES_QUESTIONS],
  
  // Vibe Check (NEW - replaces red-flag-detector with fun content)
  'vibe-check': VIBE_CHECK_QUESTIONS,
  
  // Social Awareness (from social-intelligence - keep existing)
  'social-awareness': SOCIAL_INTELLIGENCE_QUESTIONS,
  
  // Boomer Humor (consolidated: dad-jokes + vintage-comedy)
  'boomer-humor': [...DAD_JOKES_QUESTIONS, ...VINTAGE_COMEDY_QUESTIONS],
};

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

// Helper to get questions for a game (with legacy support)
export const getQuestionsForGame = (gameId) => {
  const mappedId = LEGACY_GAME_MAPPING[gameId] || gameId;
  const textQuestions = QUESTIONS_BY_GAME[mappedId] || [];
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
  const mappedId = LEGACY_GAME_MAPPING[gameId] || gameId;
  const questions = QUESTIONS_BY_GAME[mappedId] || [];
  return questions.filter(q => q.difficulty >= minDiff && q.difficulty <= maxDiff);
};

// Question count stats
export const getQuestionStats = () => {
  const stats = {};
  Object.entries(QUESTIONS_BY_GAME).forEach(([gameId, questions]) => {
    stats[gameId] = questions.length;
  });
  return stats;
};

// Get game mode from question type
export const getGameModeFromQuestions = (gameId) => {
  const mappedId = LEGACY_GAME_MAPPING[gameId] || gameId;
  const questions = QUESTIONS_BY_GAME[mappedId] || [];
  if (questions.length === 0) return 'quiz';
  
  const firstQuestion = questions[0];
  if (firstQuestion.weights && firstQuestion.type === 'preference') return 'personality';
  if (firstQuestion.type === 'scenario-swipe' || firstQuestion.type === 'would-you-rather' || firstQuestion.type === 'slider') return 'opinion';
  if (firstQuestion.type === 'scenario' && firstQuestion.weights) return 'scenario';
  return 'quiz';
};