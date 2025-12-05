// RIZZ Platform - Social Intelligence Gaming
// 12 Consolidated Games across 6 Categories with UNIQUE tier roasts per game

export const GAME_CATEGORIES_META = {
  'generational': { id: 'generational', name: 'Generational IQ', emoji: '🧬', color: '#58CC02', description: 'Test your knowledge across generations' },
  'personality': { id: 'personality', name: 'Personality Tests', emoji: '🧠', color: '#CE82FF', description: 'Discover your true self' },
  'social': { id: 'social', name: 'Social Skills', emoji: '💬', color: '#FF86D0', description: 'Master social intelligence' },
  'humor': { id: 'humor', name: 'Comedy Zone', emoji: '😂', color: '#FFC800', description: 'Test your funny bone' },
};

export const GAMES = {
  // ===== GENERATIONAL IQ CATEGORY =====
  
  // Consolidated: gen-z-fluency + emoji-detective
  'gen-z-fluency': {
    id: 'gen-z-fluency',
    title: 'Gen Z Fluency',
    subtitle: 'Slang, Emojis & Internet Culture',
    description: 'Master Gen Z slang, decode emojis, and prove you\'re chronically online',
    category: 'generational',
    icon: '💀',
    color: '#00E5FF',
    bgColor: 'bg-cyan-500',
    gameMode: 'quiz',
    questionTypes: ['mcq', 'image', 'emoji-decode'],
    tiers: [
      { min: 90, max: 100, name: 'Chronically Online', emoji: '💀', message: "You're terminally online. Touch grass (jk you're certified Gen Z)", roast: "The WiFi password is your life force" },
      { min: 75, max: 89, name: 'Giving Millennial Energy', emoji: '👴', message: "You're trying bestie, but the elder millennial is showing", roast: "Your side part is peeking through" },
      { min: 60, max: 74, name: 'How Do You Do Fellow Kids', emoji: '😬', message: "You know some things but you're giving Steve Buscemi", roast: "Stop saying 'on fleek', it's 2024" },
      { min: 40, max: 59, name: 'OK Boomer Energy', emoji: '👴🏻', message: "Bestie... you might need to spend more time on TikTok", roast: "You still use Facebook, don't you?" },
      { min: 0, max: 39, name: 'Fax Machine Era', emoji: '📠', message: "Either you're not online enough OR you're SO Gen Z you're beyond these basics", roast: "The internet is a series of tubes to you" }
    ]
  },

  // Consolidated: revenge-of-boomers + analog-life
  'boomer-era': {
    id: 'boomer-era',
    title: 'Boomer Era',
    subtitle: 'Pre-Digital Culture & Classic Tech',
    description: 'Test your knowledge of Boomer-era culture, analog life, and vintage tech',
    category: 'generational',
    icon: '📻',
    color: '#FFB347',
    bgColor: 'bg-amber-500',
    gameMode: 'quiz',
    questionTypes: ['mcq', 'image', 'audio'],
    tiers: [
      { min: 90, max: 100, name: 'Honorary Boomer', emoji: '👴', message: "You know your ancient tech! Were you actually there?", roast: "You remember when MTV played music" },
      { min: 75, max: 89, name: 'Antique Roadshow Host', emoji: '🎓', message: "Impressive knowledge of the before times", roast: "You could appraise a rotary phone" },
      { min: 60, max: 74, name: 'Wikipedia Historian', emoji: '🤔', message: "You've seen some stuff, but there's more to learn", roast: "You googled most of these, didn't you?" },
      { min: 40, max: 59, name: 'Born After Dial-Up', emoji: '💀', message: "Your confusion is valid, this tech is ancient", roast: "What's a phone book? Exactly." },
      { min: 0, max: 39, name: 'iPad Baby Detected', emoji: '📱', message: "You've never seen a world without WiFi, have you?", roast: "You think 'rewind' is a Spotify feature" }
    ]
  },

  // Consolidated: millennial-nostalgia + y2k-culture
  'millennial-nostalgia': {
    id: 'millennial-nostalgia',
    title: 'Millennial Nostalgia',
    subtitle: '90s-2000s Pop Culture & Y2K',
    description: 'Quiz on 1990s-2000s pop culture, Y2K vibes, and millennial memories',
    category: 'generational',
    icon: '📼',
    color: '#E8A598',
    bgColor: 'bg-rose-400',
    gameMode: 'quiz',
    questionTypes: ['mcq', 'image', 'audio'],
    tiers: [
      { min: 90, max: 100, name: 'Elder Millennial Deity', emoji: '👴', message: "You're officially old (but cool)", roast: "You still miss your AIM screen name" },
      { min: 75, max: 89, name: '90s Kid Certified', emoji: '📺', message: "You lived through the golden era", roast: "TGIF was your religion" },
      { min: 60, max: 74, name: 'Reruns Watcher', emoji: '🤔', message: "You've heard of these things", roast: "You discovered these on Netflix, didn't you?" },
      { min: 40, max: 59, name: 'Born in Wrong Decade', emoji: '👶', message: "Born too late for this", roast: "You wish you could've seen Blockbuster" },
      { min: 0, max: 39, name: 'TikTok Historian', emoji: '💀', message: "This is ancient history to you", roast: "You learn 90s culture from ironic edits" }
    ]
  },

  // Consolidated: gen-x-wisdom + nineties-music
  'gen-x-wisdom': {
    id: 'gen-x-wisdom',
    title: 'Gen X Wisdom',
    subtitle: 'The Forgotten Generation & 90s Music',
    description: 'Gen X values, music, latchkey energy, and independent spirit',
    category: 'generational',
    icon: '🎸',
    color: '#4DB6AC',
    bgColor: 'bg-teal-500',
    gameMode: 'quiz',
    questionTypes: ['mcq', 'audio', 'ranking'],
    tiers: [
      { min: 90, max: 100, name: 'Latchkey Legend', emoji: '🎸', message: "Finally someone gets us!", roast: "You raised yourself and you're fine (mostly)" },
      { min: 75, max: 89, name: 'MTV Unplugged', emoji: '😎', message: "You understand the vibe", roast: "Nirvana's 'Nevermind' changed your life" },
      { min: 60, max: 74, name: 'Whatever, Dude', emoji: '🤔', message: "Learning about Gen X", roast: "You're trying, which is very un-Gen X of you" },
      { min: 40, max: 59, name: 'Gen X Who?', emoji: '❓', message: "The forgotten generation remains forgotten", roast: "They prefer it this way, honestly" },
      { min: 0, max: 39, name: 'Never Heard of Slackers', emoji: '❌', message: "Gen X? Never heard of them", roast: "That's the most Gen X response possible" }
    ]
  },

  // Consolidated: ipad-kid-culture + tiktok-natives
  'gen-alpha': {
    id: 'gen-alpha',
    title: 'Gen Alpha',
    subtitle: 'iPad Kids & TikTok Culture',
    description: "Understand Gen Alpha's digital-native world and short-form content",
    category: 'generational',
    icon: '🧒',
    color: '#B388FF',
    bgColor: 'bg-violet-400',
    gameMode: 'quiz',
    questionTypes: ['mcq', 'image', 'video-ref'],
    tiers: [
      { min: 90, max: 100, name: 'Alpha Whisperer', emoji: '🧒', message: "You understand the kids!", roast: "You know every Skibidi Toilet reference" },
      { min: 75, max: 89, name: 'Cool Aunt/Uncle', emoji: '👀', message: "Good Gen Alpha knowledge", roast: "You let them have extra screen time" },
      { min: 60, max: 74, name: 'Learning Their Ways', emoji: '📚', message: "Getting to know Gen Alpha", roast: "You've watched Skibidi Toilet... voluntarily" },
      { min: 40, max: 59, name: 'Confused Elder', emoji: '😵', message: "The future is confusing", roast: "You don't know what Roblox is" },
      { min: 0, max: 39, name: 'Get Off My Lawn', emoji: '❓', message: "Ask a 10-year-old for help", roast: "You think Minecraft is new" }
    ]
  },

  // ===== PERSONALITY TESTS CATEGORY =====
  
  'mental-age': {
    id: 'mental-age',
    title: 'Mental Age Test',
    subtitle: "What's Your True Age?",
    description: 'Discover your mental age through preferences, reactions, and vibes',
    category: 'personality',
    icon: '🧠',
    color: '#64FFDA',
    bgColor: 'bg-teal-400',
    gameMode: 'personality',
    resultType: 'mental-age',
    questionTypes: ['would-you-rather', 'slider', 'preference'],
    tiers: [
      { min: 0, max: 25, name: 'Chaos Gremlin Energy', emoji: '🌟', ageRange: '16-25', message: "You have the energy and optimism of youth!", roast: "Sleep is optional, vibes are mandatory" },
      { min: 26, max: 40, name: 'Peak Functioning Adult', emoji: '💪', ageRange: '26-40', message: "You're in your mental prime - balanced wisdom and energy.", roast: "You have a skincare routine and opinions on coffee" },
      { min: 41, max: 55, name: 'Wise But Tired', emoji: '🦉', ageRange: '41-55', message: "You've gained perspective. You know what really matters.", roast: "You're in bed by 9pm and loving it" },
      { min: 56, max: 70, name: 'Early Bird Special', emoji: '🧙', ageRange: '56-70', message: "You have the wisdom of experience and peace of acceptance.", roast: "Dinner at 4:30pm hits different" },
      { min: 71, max: 100, name: 'Ancient Wisdom Mode', emoji: '👴', ageRange: '71+', message: "You've transcended age. Time is just a number to you.", roast: "You've seen things. You have stories." }
    ]
  },

  'generation-quiz': {
    id: 'generation-quiz',
    title: 'Generation Quiz',
    subtitle: 'Which Gen Are You Really?',
    description: 'Which generation do you truly belong to based on your vibe?',
    category: 'personality',
    icon: '🧬',
    color: '#64FFDA',
    bgColor: 'bg-teal-400',
    gameMode: 'personality',
    resultType: 'generation',
    questionTypes: ['would-you-rather', 'slider', 'ranking'],
    tiers: [
      { id: 'boomer', name: 'Boomer Soul', emoji: '📻', message: "You value hard work, tradition, and face-to-face connection.", roast: "You still print emails" },
      { id: 'genx', name: 'Gen X Energy', emoji: '🎸', message: "Independent, skeptical, and self-reliant. You do your own thing.", roast: "You're fine. Everything's fine." },
      { id: 'millennial', name: 'Millennial Core', emoji: '📱', message: "Optimistic, tech-savvy, and experience-focused. Adulting is hard.", roast: "You've killed 47 industries apparently" },
      { id: 'genz', name: 'Gen Z Brain', emoji: '💀', message: "Chronically online, anxiety-aware, and authentically yourself.", roast: "Your humor is unhinged and so are you" },
      { id: 'genalpha', name: 'Gen Alpha Prep', emoji: '🤖', message: "You're already living in the future. iPad kid energy.", roast: "Skibidi toilet is peak comedy to you" }
    ]
  },

  // ===== SOCIAL SKILLS CATEGORY =====

  // Consolidated: dating-decoder + text-interpretation
  'social-iq': {
    id: 'social-iq',
    title: 'Social IQ',
    subtitle: 'Dating, Texting & Communication',
    description: 'Interpret modern dating terms, text messages, and social cues',
    category: 'social',
    icon: '💬',
    color: '#FF4081',
    bgColor: 'bg-pink-500',
    gameMode: 'quiz',
    questionTypes: ['mcq', 'scenario', 'would-you-rather'],
    tiers: [
      { min: 90, max: 100, name: 'Rizz God', emoji: '💘', message: "You understand modern romance", roast: "Your DMs are probably overwhelming" },
      { min: 75, max: 89, name: 'Situationship Survivor', emoji: '💕', message: "Strong social awareness", roast: "You've defined the relationship (finally)" },
      { min: 60, max: 74, name: 'Still Decoding', emoji: '💬', message: "You get the basics", roast: "You've been ghosted and learned from it" },
      { min: 40, max: 59, name: "What's Breadcrumbing?", emoji: '📚', message: "Keep studying human behavior", roast: "Your love language is confusion" },
      { min: 0, max: 39, name: 'Romance is Dead to You', emoji: '❓', message: "Social cues are tricky for you", roast: "You respond to 'wyd' with paragraphs" }
    ]
  },

  // Consolidated: generation-gap + communication-styles
  'family-bridge': {
    id: 'family-bridge',
    title: 'Family Bridge',
    subtitle: 'Bridging Generational Gaps',
    description: 'Questions highlighting generational differences and communication styles',
    category: 'social',
    icon: '👨‍👩‍👧‍👦',
    color: '#00D9FF',
    bgColor: 'bg-cyan-500',
    gameMode: 'quiz',
    questionTypes: ['mcq', 'would-you-rather', 'ranking'],
    tiers: [
      { min: 90, max: 100, name: 'Family Therapist Energy', emoji: '🌉', message: "You understand all generations!", roast: "Thanksgiving dinner MVP" },
      { min: 75, max: 89, name: 'Holiday Mediator', emoji: '🗣️', message: "Great cross-generational awareness", roast: "You translate between grandma and grandkids" },
      { min: 60, max: 74, name: 'Tries at Dinner', emoji: '👀', message: "You see the differences", roast: "You've explained TikTok to your parents" },
      { min: 40, max: 59, name: 'Stuck in Your Gen', emoji: '🤷', message: "Some gaps still confuse you", roast: "Family group chat is chaos for you" },
      { min: 0, max: 39, name: 'Generational Island', emoji: '💔', message: "Maybe talk to your family more?", roast: "You skip the family reunions" }
    ]
  },

  // COMPLETELY REWRITTEN: Lighthearted, fun, roast-y version
  'vibe-check': {
    id: 'vibe-check',
    title: 'Vibe Check',
    subtitle: 'Green Flags, Red Flags & Hot Takes',
    description: 'Rate scenarios, debate hot takes, and see how your vibes compare to others',
    category: 'social',
    icon: '✨',
    color: '#58CC02',
    bgColor: 'bg-green-500',
    gameMode: 'opinion',
    resultType: 'vibe-score',
    questionTypes: ['scenario-swipe', 'would-you-rather', 'slider'],
    tiers: [
      { min: 90, max: 100, name: 'Immaculate Vibes', emoji: '✨', message: "Your taste is chef's kiss. The people agree with you.", roast: "You're the friend everyone asks for advice" },
      { min: 75, max: 89, name: 'Mostly Valid', emoji: '💅', message: "Strong opinions, backed by the crowd!", roast: "Your hot takes are actually reasonable" },
      { min: 60, max: 74, name: 'Chaotic Neutral', emoji: '🎲', message: "You march to your own drum. Respect.", roast: "You're that friend with 'interesting' opinions" },
      { min: 40, max: 59, name: 'Contrarian Energy', emoji: '🤔', message: "You see things differently than most. Bold.", roast: "You'd argue the sky isn't blue" },
      { min: 0, max: 39, name: 'Unhinged King/Queen', emoji: '👑', message: "You're either a genius or completely chaotic. No in-between.", roast: "The crowd fears your takes" }
    ]
  },

  // Consolidated: red-flag-detector + social-intelligence (but FUN version)
  'social-awareness': {
    id: 'social-awareness',
    title: 'Social Awareness',
    subtitle: 'Read the Room & Spot the Vibes',
    description: 'How well do you understand social dynamics and unspoken cues?',
    category: 'social',
    icon: '🧠',
    color: '#00CED1',
    bgColor: 'bg-cyan-500',
    gameMode: 'scenario',
    resultType: 'eq-score',
    questionTypes: ['scenario', 'mcq', 'ranking'],
    tiers: [
      { min: 90, max: 100, name: 'Empath Supreme', emoji: '🧠', message: "You read rooms like open books. People feel understood around you.", roast: "You know when to leave the party" },
      { min: 75, max: 89, name: 'Vibe Reader', emoji: '💡', message: "High EQ alert! You pick up on what others miss.", roast: "You've saved awkward silences many times" },
      { min: 60, max: 74, name: 'Socially Adequate', emoji: '📡', message: "You're generally aware of social dynamics and navigate well.", roast: "You only overshare sometimes" },
      { min: 40, max: 59, name: 'Lovably Awkward', emoji: '📚', message: "You sometimes miss cues, but you're growing in awareness.", roast: "You've definitely told a joke at the wrong time" },
      { min: 0, max: 39, name: 'Beautiful Chaos', emoji: '😅', message: "Social nuance isn't your thing, but at least you're authentic!", roast: "You ARE the awkward silence" }
    ]
  },

  // ===== COMEDY ZONE CATEGORY =====

  // Consolidated: dad-jokes + vintage-comedy
  'boomer-humor': {
    id: 'boomer-humor',
    title: 'Boomer Humor',
    subtitle: 'Dad Jokes & Classic Comedy',
    description: 'Rate, complete, and create dad jokes and classic comedy references',
    category: 'humor',
    icon: '👔',
    color: '#FFC800',
    bgColor: 'bg-yellow-500',
    gameMode: 'quiz',
    questionTypes: ['mcq', 'fill-blank', 'ranking'],
    tiers: [
      { min: 90, max: 100, name: 'Dad Joke Deity', emoji: '👑', message: "Your puns are legendary", roast: "You clear rooms with 'Hi Hungry, I'm Dad'" },
      { min: 75, max: 89, name: 'Father Figure Energy', emoji: '👔', message: "Peak dad humor achieved", roast: "You own multiple pairs of white New Balances" },
      { min: 60, max: 74, name: 'Apprentice Parent', emoji: '🎓', message: "Your joke game is growing", roast: "You're practicing for fatherhood" },
      { min: 40, max: 59, name: 'Pun Padawan', emoji: '📚', message: "Keep practicing those puns", roast: "Your delivery needs work, champ" },
      { min: 0, max: 39, name: 'Too Cool for Dad Jokes', emoji: '😐', message: "Maybe stick to memes?", roast: "You'll understand when you're older" }
    ]
  },

  // ===== NEW HIGH-RETENTION GAMES =====

  'link-up': {
    id: 'link-up',
    title: 'The Link-Up',
    subtitle: 'Daily Associative Puzzle',
    description: 'Group 16 items into 4 themed categories. New puzzle every day!',
    category: 'generational',
    icon: '🔗',
    color: '#CE82FF',
    bgColor: 'bg-purple-500',
    gameMode: 'connection',
    questionTypes: ['connection'],
    tiers: [
      { min: 100, max: 100, name: 'Master Mind', emoji: '🧠', message: "Perfect score! Your brain is massive.", roast: "You probably do the NYT crossword in pen" },
      { min: 75, max: 99, name: 'Pattern Pro', emoji: '🧩', message: "Great eye for connections!", roast: "So close, yet so far" },
      { min: 50, max: 74, name: 'Solid Solver', emoji: '🤔', message: "You got the easy ones at least.", roast: "Average performance. Respectable." },
      { min: 0, max: 49, name: 'Connection Lost', emoji: '📶', message: "Better luck tomorrow!", roast: "404 Brain Not Found" }
    ]
  },

  'timeline': {
    id: 'timeline',
    title: 'Timeline',
    subtitle: 'Chronological Order Challenge',
    description: 'Drag and drop cultural events into the correct order. Test your history knowledge!',
    category: 'generational',
    icon: '⏳',
    color: '#FF9600',
    bgColor: 'bg-orange-500',
    gameMode: 'timeline',
    questionTypes: ['ordering'],
    tiers: [
      { min: 90, max: 100, name: 'Time Lord', emoji: '⌛', message: "You perceive time non-linearly.", roast: "Dr. Who is jealous of you" },
      { min: 70, max: 89, name: 'Historian', emoji: '📚', message: "You know your dates!", roast: "You were definitely teacher's pet" },
      { min: 50, max: 69, name: 'Memory Lane Walker', emoji: '🚶', message: "Decent grasp of the past.", roast: "A bit fuzzy on the details" },
      { min: 0, max: 49, name: 'Time Traveler', emoji: '😵', message: "Are you from the future or past? Who knows.", roast: "History is not your strong suit" }
    ]
  },

  'vibe-check': {
    id: 'vibe-check',
    title: 'Vibe Check',
    subtitle: 'Based or Cringe?',
    description: 'Swipe to vote on controversial takes. See how your opinions match the world.',
    category: 'social',
    icon: '💅',
    color: '#FF4B4B',
    bgColor: 'bg-red-500',
    gameMode: 'vibe-check',
    questionTypes: ['poll'],
    tiers: [
      { min: 90, max: 100, name: 'Trend Setter', emoji: '✨', message: "You ARE the culture.", roast: "Stop being so perfect" },
      { min: 50, max: 89, name: 'Vibe Curator', emoji: '🧐', message: "You have taste.", roast: "A bit basic but we accept it" },
      { min: 0, max: 49, name: 'Chaos Agent', emoji: '😈', message: "Your takes are... interesting.", roast: "You definitely put milk before cereal" }
    ]
  }
  };

export const GAMES_LIST = Object.values(GAMES);

export const GAME_CATEGORIES = {};
Object.values(GAMES).forEach(game => {
  GAME_CATEGORIES[game.id] = game.category;
});

export const getTier = (gameId, percentage) => {
  const game = GAMES[gameId];
  if (!game) return { name: 'Unknown', emoji: '❓', message: 'No tier data', roast: '' };
  return game.tiers.find(t => percentage >= t.min && percentage <= t.max) || game.tiers[game.tiers.length - 1];
};

export const LEVEL_CONFIG = {
  questionsPerPlay: 10,
  maxLevel: 15,
};

export const GAME_LEVELS = [
  { level: 1, xpRequired: 0, title: 'Clueless Noob', emoji: '🐣', roast: "You just hatched. The internet hasn't ruined you yet.", difficulty: 'easy', xpMultiplier: 1.0 },
  { level: 2, xpRequired: 100, title: 'Slightly Less Clueless', emoji: '🤔', roast: "You're trying, and that's... something.", difficulty: 'easy', xpMultiplier: 1.05 },
  { level: 3, xpRequired: 250, title: 'Basic Energy', emoji: '☕', roast: "Pumpkin Spice Latte vibes. Basic but functional.", difficulty: 'easy', xpMultiplier: 1.1 },
  { level: 4, xpRequired: 450, title: 'Almost Has Taste', emoji: '👀', roast: "Developing opinions. Some might be correct.", difficulty: 'medium', xpMultiplier: 1.15 },
  { level: 5, xpRequired: 700, title: 'Certified Mid', emoji: '😐', roast: "Officially average. Not bad, not good. Just... there.", difficulty: 'medium', xpMultiplier: 1.2 },
  { level: 6, xpRequired: 1000, title: 'Kinda Valid', emoji: '💅', roast: "People are starting to respect you. Wild.", difficulty: 'medium', xpMultiplier: 1.25 },
  { level: 7, xpRequired: 1400, title: 'Actually Scary', emoji: '😈', roast: "Becoming dangerous. Opponents fear you.", difficulty: 'hard', xpMultiplier: 1.3 },
  { level: 8, xpRequired: 1900, title: 'No Life Detected', emoji: '💀', roast: "Touch grass? Never heard of it.", difficulty: 'hard', xpMultiplier: 1.35 },
  { level: 9, xpRequired: 2500, title: 'Chronically Online Elite', emoji: '👑', roast: "The internet is where you exist.", difficulty: 'hard', xpMultiplier: 1.4 },
  { level: 10, xpRequired: 3200, title: 'Touched By Algorithm', emoji: '🔥', roast: "You've transcended. The algorithm chose you.", difficulty: 'expert', xpMultiplier: 1.45 },
  { level: 11, xpRequired: 4000, title: 'Sigma Mentality', emoji: '🐺', roast: "Grind in silence. Aura unmatched.", difficulty: 'expert', xpMultiplier: 1.5 },
  { level: 12, xpRequired: 5000, title: 'Based & Redpilled', emoji: '💊', roast: "You see the Matrix.", difficulty: 'expert', xpMultiplier: 1.55 },
  { level: 13, xpRequired: 6500, title: 'No Cap Legend', emoji: '🏆', roast: "Everything you say is facts.", difficulty: 'master', xpMultiplier: 1.6 },
  { level: 14, xpRequired: 8500, title: 'Goated With Sauce', emoji: '🐐', roast: "You're the GOAT. Sauce is dripping.", difficulty: 'master', xpMultiplier: 1.7 },
  { level: 15, xpRequired: 11000, title: 'Meme Lord Supreme', emoji: '👾', roast: "Achieved enlightenment. Platform bows to you.", difficulty: 'master', xpMultiplier: 1.8 },
];

export const getGameLevel = (xp) => {
  let currentLevel = GAME_LEVELS[0];
  for (const level of GAME_LEVELS) {
    if (xp >= level.xpRequired) currentLevel = level;
    else break;
  }
  return currentLevel;
};

export const getXpProgress = (xp) => {
  const currentLevel = getGameLevel(xp);
  const nextLevel = GAME_LEVELS.find(l => l.level === currentLevel.level + 1);
  if (!nextLevel) return { current: xp, needed: 0, progress: 100, nextLevel: null, currentLevel };
  const xpIntoLevel = xp - currentLevel.xpRequired;
  const xpForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
  return { current: xpIntoLevel, needed: xpForNextLevel, progress: Math.round((xpIntoLevel / xpForNextLevel) * 100), nextLevel, currentLevel };
};

export const calculateXpEarned = (percentage, level = 1) => {
  const levelData = GAME_LEVELS[level - 1] || GAME_LEVELS[0];
  let xp = Math.round(percentage / 2);
  xp = Math.round(xp * levelData.xpMultiplier);
  return xp;
};

export const getDifficultyRange = (level) => {
  const levelData = GAME_LEVELS[level - 1] || GAME_LEVELS[0];
  const difficultyMap = {
    'easy': { min: 1, max: 6 },
    'medium': { min: 4, max: 12 },
    'hard': { min: 8, max: 16 },
    'expert': { min: 12, max: 18 },
    'master': { min: 15, max: 20 }
  };
  return difficultyMap[levelData.difficulty] || difficultyMap['easy'];
};

export const TIER_BADGES = [
  { min: 0, max: 999, name: 'Normie', emoji: '🐣', color: '#94a3b8' },
  { min: 1000, max: 2999, name: 'Casual', emoji: '😎', color: '#22c55e' },
  { min: 3000, max: 5999, name: 'Based', emoji: '💪', color: '#3b82f6' },
  { min: 6000, max: 9999, name: 'No Cap', emoji: '🔥', color: '#f97316' },
  { min: 10000, max: 19999, name: 'Goated', emoji: '🐐', color: '#a855f7' },
  { min: 20000, max: Infinity, name: 'Meme Lord', emoji: '👑', color: '#eab308' },
];

export const getTotalXpBadge = (totalXp) => {
  return TIER_BADGES.find(t => totalXp >= t.min && totalXp <= t.max) || TIER_BADGES[0];
};

// Trending games (updated)
export const TRENDING_GAMES = ['gen-z-fluency', 'vibe-check', 'mental-age'];

// Seasonal/Limited Events
export const SEASONAL_EVENTS = {
  'black-friday': { id: 'black-friday', name: 'Black Friday Blitz', emoji: '🛒', multiplier: 3, startDate: '2024-11-29', endDate: '2024-12-02' },
  'christmas': { id: 'christmas', name: 'Holiday Havoc', emoji: '🎄', multiplier: 2, startDate: '2024-12-20', endDate: '2024-12-26' },
  'new-years': { id: 'new-years', name: 'New Year New Me', emoji: '🎆', multiplier: 2, startDate: '2024-12-31', endDate: '2025-01-02' },
  'valentines': { id: 'valentines', name: 'Love Language Test', emoji: '💕', multiplier: 2, startDate: '2025-02-12', endDate: '2025-02-15' },
  'april-fools': { id: 'april-fools', name: 'Chaos Mode', emoji: '🃏', multiplier: 2, startDate: '2025-04-01', endDate: '2025-04-02' },
  'summer': { id: 'summer', name: 'Summer Brain Rot', emoji: '☀️', multiplier: 1.5, startDate: '2025-06-21', endDate: '2025-08-31' },
};

export const getCurrentEvent = () => {
  const today = new Date().toISOString().split('T')[0];
  return Object.values(SEASONAL_EVENTS).find(e => today >= e.startDate && today <= e.endDate) || null;
};