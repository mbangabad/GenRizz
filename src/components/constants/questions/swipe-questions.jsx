// True/False swipe questions - fast-paced gameplay
// Perfect for red flag detection, fact checking, and quick judgments

export const SWIPE_QUESTIONS = {
  'red-flag-detector': [
    {
      type: 'swipe',
      question: "They say 'I'm not like other guys/girls' on the first date",
      context: "First date conversation",
      correct_index: 1, // 0 = True (good), 1 = False (red flag)
      explanation: "Classic red flag - they're likely very much like 'other' people",
      difficulty: 2,
    },
    {
      type: 'swipe',
      question: "They remember small details you mentioned weeks ago",
      correct_index: 0, // Green flag
      explanation: "Active listening and genuine interest - great sign!",
      difficulty: 2,
    },
    {
      type: 'swipe',
      question: "They're rude to waiters but sweet to you",
      correct_index: 1, // Red flag
      explanation: "How they treat service workers shows their true character",
      difficulty: 1,
    },
    {
      type: 'swipe',
      question: "All their exes are 'crazy'",
      correct_index: 1, // Red flag
      explanation: "If everyone else is the problem... they might be the problem",
      difficulty: 2,
    },
    {
      type: 'swipe',
      question: "They introduce you to their friends early on",
      correct_index: 0, // Green flag
      explanation: "They're proud to be with you and want to include you in their life",
      difficulty: 3,
    },
    {
      type: 'swipe',
      question: "They get angry when you spend time with your friends",
      correct_index: 1, // Red flag
      explanation: "Isolation is a major warning sign in relationships",
      difficulty: 1,
    },
    {
      type: 'swipe',
      question: "They apologize sincerely when they make a mistake",
      correct_index: 0, // Green flag
      explanation: "Accountability and genuine apologies show emotional maturity",
      difficulty: 2,
    },
    {
      type: 'swipe',
      question: "They lovebomb you in the first week",
      context: "Excessive gifts, declarations of love, constant texting",
      correct_index: 1, // Red flag
      explanation: "Lovebombing is often a manipulation tactic",
      difficulty: 3,
    },
  ],

  'gen-z-fluency': [
    {
      type: 'swipe',
      question: "'Slay' means to do something really well",
      correct_index: 0, // True
      explanation: "Slay = excellence, killing it, doing amazing",
      difficulty: 1,
    },
    {
      type: 'swipe',
      question: "'Mid' is a compliment",
      correct_index: 1, // False
      explanation: "Mid means mediocre, average, nothing special",
      difficulty: 2,
    },
    {
      type: 'swipe',
      question: "'No cap' means you're lying",
      correct_index: 1, // False
      explanation: "No cap means no lie, being honest/serious",
      difficulty: 2,
    },
    {
      type: 'swipe',
      question: "'Ate' can mean someone did something well",
      correct_index: 0, // True
      explanation: "'She ate that' = she did amazing",
      difficulty: 3,
    },
    {
      type: 'swipe',
      question: "'Cheugy' is a compliment for being trendy",
      correct_index: 1, // False
      explanation: "Cheugy means outdated, trying too hard, not cool anymore",
      difficulty: 4,
    },
  ],

  'social-intelligence': [
    {
      type: 'swipe',
      question: "Someone crossing their arms always means they're defensive",
      correct_index: 1, // False
      explanation: "They might just be cold or comfortable that way",
      difficulty: 3,
    },
    {
      type: 'swipe',
      question: "Mirroring someone's body language builds rapport",
      correct_index: 0, // True
      explanation: "Subtle mirroring creates subconscious connection",
      difficulty: 4,
    },
    {
      type: 'swipe',
      question: "Taking a long time to reply always means disinterest",
      correct_index: 1, // False
      explanation: "People have busy lives - don't read too much into response times",
      difficulty: 3,
    },
    {
      type: 'swipe',
      question: "Maintaining eye contact shows confidence and interest",
      correct_index: 0, // True
      explanation: "Appropriate eye contact is a key social skill",
      difficulty: 2,
    },
  ],

  'dating-decoder': [
    {
      type: 'swipe',
      question: "'Let's keep things casual' usually leads to a relationship",
      correct_index: 1, // False
      explanation: "Usually means they're not looking for commitment",
      difficulty: 2,
    },
    {
      type: 'swipe',
      question: "'I'm really busy right now' is often a soft rejection",
      correct_index: 0, // True
      explanation: "If they wanted to, they'd make time",
      difficulty: 3,
    },
    {
      type: 'swipe',
      question: "Double texting is always desperate",
      correct_index: 1, // False
      explanation: "Context matters - sometimes it's fine and normal",
      difficulty: 4,
    },
  ],
};

export const getSwipeQuestionsForGame = (gameId) => {
  return SWIPE_QUESTIONS[gameId] || [];
};