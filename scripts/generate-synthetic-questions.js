/**
 * Synthetic question generator to bulk seed catalogs (~36k) with family-safe content.
 * Generates MCQ-style questions per game with consistent fields:
 *  - id, game_id, category, type, question, options, correct_index, difficulty, tags, family_safe
 */

import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'src/components/constants/questions/json');

const GAME_TARGETS = [
  { id: 'gen-z-fluency', category: 'generational', target: 3600 },
  { id: 'boomer-era', category: 'generational', target: 3600 },
  { id: 'millennial-nostalgia', category: 'generational', target: 3600 },
  { id: 'gen-x-wisdom', category: 'generational', target: 3600 },
  { id: 'gen-alpha', category: 'generational', target: 3600 },
  { id: 'mental-age', category: 'personality', target: 3000 },
  { id: 'generation-quiz', category: 'personality', target: 3000 },
  { id: 'social-iq', category: 'social', target: 2000 },
  { id: 'family-bridge', category: 'social', target: 2000 },
  { id: 'vibe-check', category: 'social', target: 2000 },
  { id: 'social-awareness', category: 'social', target: 2000 },
  { id: 'boomer-humor', category: 'humor', target: 2000 },
  { id: 'link-up', category: 'daily', target: 1300 },
  { id: 'timeline', category: 'daily', target: 1300 },
];

// Prompt banks by category
const BANKS = {
  generational: {
    themes: [
      ['slang', ['rizz', 'bet', 'cap', 'yeet', 'drip', 'extra', 'bussin']],
      ['tech', ['dial-up', 'VHS', 'floppy disk', 'Walkman', 'mp3', 'streaming']],
      ['culture', ['TikTok', 'MTV', 'Saturday cartoons', 'arcades', 'memes', 'reels']],
      ['emoji', ['💀', '😂', '🙏', '🔥', '🫡', '😅', '🧢']],
    ],
    template: (theme, term) =>
      `Which generation most vibes with "${term}" (${theme})?`,
    options: ['Gen Z', 'Millennials', 'Gen X', 'Boomers'],
  },
  social: {
    themes: [
      ['texting', ['responds in 2 min', 'uses voice notes', 'leaves you on read', 'sends memes daily']],
      ['etiquette', ['double-texting', 'group chat invites', 'RSVP on time', 'ghosting']],
      ['vibes', ['green flag', 'yellow flag', 'mild ick', 'instant ick']],
    ],
    template: (theme, term) =>
      `In a ${theme} scenario, is "${term}" a good move?`,
    options: ['Top tier', 'Pretty good', 'Mid', 'Hard pass'],
  },
  personality: {
    themes: [
      ['energy', ['early bird', 'night owl', 'social butterfly', 'deep thinker']],
      ['decision', ['planner', 'improviser', 'delegator', 'solo problem-solver']],
      ['aura', ['wholesome', 'chaotic good', 'low-key leader', 'comedian']],
    ],
    template: (theme, term) =>
      `Which trait fits you best: ${term} (${theme})?`,
    options: ['Strongly agree', 'Mostly agree', 'Neutral', 'Disagree'],
  },
  humor: {
    themes: [
      ['pun', ['I’m on a seafood diet—I see food and I eat it', 'Time flies like an arrow; fruit flies like a banana', 'Why did the scarecrow win an award? He was outstanding in his field']],
      ['classic', ['Knock-knock jokes', 'Dad jokes at dinner', 'Lighthearted roasts', 'Silly puns']],
    ],
    template: (theme, term) =>
      `How funny is this ${theme}: "${term}"?`,
    options: ['Hilarious', 'Smirk', 'Groan', 'Retire it'],
  },
  daily: {
    themes: [
      ['connection', ['coffee & mornings', 'vinyl & playlists', 'grandma & recipes', 'games & friends']],
      ['order', ['Walkman → iPod → Streaming', 'VHS → DVD → Cloud', 'Pager → Flip Phone → Smartphone']],
    ],
    template: (theme, term) =>
      `Best pairing/order: ${term}`,
    options: ['Great match', 'Works', 'Stretch', 'Mismatch'],
  },
};

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

const makeQuestion = (game, idx) => {
  const bank = BANKS[game.category] || BANKS.generational;
  const [theme, terms] = rand(bank.themes);
  const term = rand(terms);
  const prompt = bank.template(theme, term);
  const options = bank.options.slice();
  const correct_index = Math.floor(Math.random() * options.length);
  const difficulty = Math.max(1, Math.min(20, Math.floor(1 + Math.random() * 20)));
  return {
    id: `${game.id}-${idx}`,
    game_id: game.id,
    category: game.category,
    type: 'mcq',
    question: prompt,
    options,
    correct_index,
    difficulty,
    tags: [theme],
    family_safe: true,
    explanation: `Family-safe ${theme} prompt.`,
  };
};

const generateForGame = (game) => {
  const questions = [];
  for (let i = 0; i < game.target; i++) {
    questions.push(makeQuestion(game, i + 1));
  }
  return questions;
};

const main = () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let total = 0;
  GAME_TARGETS.forEach((game) => {
    const q = generateForGame(game);
    total += q.length;
    const outPath = path.join(OUTPUT_DIR, `${game.id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(q, null, 2), 'utf8');
    console.log(`Generated ${q.length} for ${game.id} -> ${outPath}`);
  });
  console.log(`Total generated: ${total}`);
};

main();
