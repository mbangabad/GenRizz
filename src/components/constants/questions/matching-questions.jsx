// Matching/sorting questions for deeper engagement
// Players match items from two columns

export const MATCHING_QUESTIONS = {
  'gen-z-fluency': [
    {
      type: 'matching',
      question: "Match the slang to its meaning:",
      pairs: [
        { left: "Slay", right: "Do something excellently" },
        { left: "Mid", right: "Average/mediocre" },
        { left: "Bussin", right: "Really good (usually food)" },
        { left: "Cap", right: "Lie" },
      ],
      difficulty: 4,
    },
    {
      type: 'matching',
      question: "Match the emoji to its hidden meaning:",
      pairs: [
        { left: "💀", right: "Dead from laughing" },
        { left: "🧢", right: "Cap/lying" },
        { left: "👀", right: "Tea/drama" },
        { left: "✨", right: "Emphasis/sarcasm" },
      ],
      difficulty: 5,
    },
  ],

  'millennial-nostalgia': [
    {
      type: 'matching',
      question: "Match the 90s show to its catchphrase:",
      pairs: [
        { left: "Friends", right: "We were on a break!" },
        { left: "Fresh Prince", right: "How come he don't want me?" },
        { left: "Full House", right: "How rude!" },
        { left: "Saved by the Bell", right: "I'm so excited!" },
      ],
      difficulty: 5,
    },
    {
      type: 'matching',
      question: "Match the 90s tech to its purpose:",
      pairs: [
        { left: "AIM", right: "Instant messaging" },
        { left: "Napster", right: "Music piracy... uh, sharing" },
        { left: "MapQuest", right: "Printing directions" },
        { left: "Encarta", right: "Digital encyclopedia" },
      ],
      difficulty: 6,
    },
  ],

  'revenge-of-boomers': [
    {
      type: 'matching',
      question: "Match the decade to its defining moment:",
      pairs: [
        { left: "1960s", right: "Moon landing" },
        { left: "1970s", right: "Disco era" },
        { left: "1980s", right: "MTV launch" },
        { left: "1950s", right: "Rock and roll birth" },
      ],
      difficulty: 5,
    },
    {
      type: 'matching',
      question: "Match the old tech to its modern equivalent:",
      pairs: [
        { left: "Rolodex", right: "Contacts app" },
        { left: "Encyclopedia set", right: "Wikipedia" },
        { left: "Yellow Pages", right: "Google Search" },
        { left: "Answering machine", right: "Voicemail" },
      ],
      difficulty: 4,
    },
  ],

  'generation-gap': [
    {
      type: 'matching',
      question: "Match the generation to their defining trait:",
      pairs: [
        { left: "Boomers", right: "Work ethic & loyalty" },
        { left: "Gen X", right: "Independence & skepticism" },
        { left: "Millennials", right: "Tech-savvy & values-driven" },
        { left: "Gen Z", right: "Digital native & authentic" },
      ],
      difficulty: 4,
    },
    {
      type: 'matching',
      question: "Match the platform to the generation that uses it most:",
      pairs: [
        { left: "Facebook", right: "Boomers" },
        { left: "TikTok", right: "Gen Z" },
        { left: "Instagram", right: "Millennials" },
        { left: "LinkedIn", right: "Gen X" },
      ],
      difficulty: 3,
    },
  ],

  'communication-styles': [
    {
      type: 'matching',
      question: "Match the communication style to its generation:",
      pairs: [
        { left: "Phone calls", right: "Boomers" },
        { left: "Email", right: "Gen X" },
        { left: "Text/DM", right: "Millennials" },
        { left: "Voice notes", right: "Gen Z" },
      ],
      difficulty: 3,
    },
  ],

  'dating-decoder': [
    {
      type: 'matching',
      question: "Match the dating term to its meaning:",
      pairs: [
        { left: "Ghosting", right: "Disappearing without explanation" },
        { left: "Breadcrumbing", right: "Giving just enough attention" },
        { left: "Benching", right: "Keeping as backup option" },
        { left: "Zombieing", right: "Coming back after ghosting" },
      ],
      difficulty: 5,
    },
    {
      type: 'matching',
      question: "Match the text to what it really means:",
      pairs: [
        { left: "I'm fine", right: "I'm not fine" },
        { left: "K", right: "I'm upset" },
        { left: "We should hang sometime", right: "Probably won't happen" },
        { left: "Haha", right: "Not actually laughing" },
      ],
      difficulty: 4,
    },
  ],
};

export const getMatchingQuestionsForGame = (gameId) => {
  return MATCHING_QUESTIONS[gameId] || [];
};