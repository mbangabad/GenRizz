// Generation Quiz - PERSONALITY GAME
// No wrong answers - determines which generation you truly belong to
// Each option maps to: boomer, genx, millennial, genz, genalpha

export const GENERATION_QUIZ_QUESTIONS = [
  // TECHNOLOGY & COMMUNICATION
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "How do you prefer to communicate important news?",
    options: [
      "Face-to-face or phone call",
      "Email - I like having things in writing",
      "Text message or DM",
      "Voice message or video call",
      "Just post it and let people find out"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Communication preferences define generations."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your relationship with social media?",
    options: [
      "I don't really use it / have an account I never check",
      "I lurk but rarely post",
      "I post occasionally and follow friends",
      "It's how I stay connected and express myself",
      "I basically live online"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Social media engagement is generationally distinct."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "You need to look up information. First instinct?",
    options: [
      "Ask someone who might know",
      "Search engine on my computer",
      "Google it on my phone",
      "TikTok or YouTube search",
      "Ask AI or voice assistant"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Information seeking reflects generational habits."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "How do you feel about video calls?",
    options: [
      "Prefer in-person, video feels unnatural",
      "Fine for work, weird for personal",
      "Convenient but I prefer texting",
      "Normal way to communicate",
      "Why not just call without video?"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Video call comfort varies by generation."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your typing style in texts?",
    options: [
      "Proper sentences with punctuation.",
      "Normal but efficient, some abbreviations",
      "lowercase with occasional emoji 😊",
      "no caps, tone indicators, lots of emoji/reaction",
      "mostly voice messages or reactions tbh"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Text style is a generational fingerprint."
  },

  // WORK & CAREER
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your ideal work situation?",
    options: [
      "Stable job with pension and benefits",
      "Good work-life balance, flexible hours",
      "Remote work with meaningful projects",
      "Side hustles and passion projects",
      "Creator economy / work shouldn't feel like work"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Career values differ across generations."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "How do you feel about your job?",
    options: [
      "Work is work - you do it to provide",
      "It's fine, I save my energy for personal life",
      "I want it to be fulfilling AND pay well",
      "If it's not aligned with my values, I'm out",
      "I'll create my own opportunities"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Work philosophy is generationally shaped."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your boss gives criticism. Your reaction?",
    options: [
      "Accept it respectfully - they're in charge",
      "Take it professionally, maybe push back privately",
      "Need it to be constructive with context",
      "Expect regular feedback and open dialogue",
      "If it's not delivered right, it's toxic"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Feedback expectations vary by generation."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Company loyalty - your take?",
    options: [
      "Stay with a good company for your career",
      "Loyalty goes both ways - I'm pragmatic",
      "I'll stay if I'm growing and valued",
      "Companies aren't loyal so why should I be?",
      "What's a career? I'll do my own thing"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Job loyalty attitudes define generations."
  },

  // ENTERTAINMENT & MEDIA
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your preferred content length?",
    options: [
      "Full-length movies, documentaries, books",
      "Hour-long TV episodes, podcasts",
      "20-40 min videos, YouTube essays",
      "Short videos under 3 minutes",
      "Under 60 seconds or I'm scrolling past"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Attention span preferences are generational."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "How do you discover new music?",
    options: [
      "Radio or recommendations from friends",
      "Curated playlists or specific searches",
      "Algorithm recommendations (Spotify, etc.)",
      "TikTok, Instagram Reels, viral sounds",
      "Whatever's trending on my FYP"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Music discovery methods define generations."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your relationship with TV?",
    options: [
      "Scheduled programming, watch what's on",
      "DVR/record shows, binge on weekends",
      "Streaming services, watch on my schedule",
      "Clips on YouTube/TikTok, rarely full episodes",
      "What's TV? I watch creators online"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "TV consumption is generationally distinct."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Gaming - what's your style?",
    options: [
      "Not really into video games",
      "Classic games, maybe some mobile puzzles",
      "Console or PC gaming, story-driven games",
      "Online multiplayer, competitive games",
      "Roblox, mobile games, gaming is life"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Gaming preferences mark generations."
  },

  // SOCIAL & RELATIONSHIPS
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "How did you meet your closest friends?",
    options: [
      "Neighborhood, church, community",
      "School, work, through other friends",
      "College, early career, apps",
      "Internet, gaming, fandoms, social media",
      "Discord servers, online communities"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Friend-making methods differ by generation."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your approach to dating?",
    options: [
      "Met through family, work, or setup",
      "Natural meeting, maybe personal ads",
      "Dating apps are fine, prefer real connection",
      "Apps, DMs, but also confused about labels",
      "What's the point of dating rn"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Dating approaches are generationally shaped."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "How do you feel about oversharing online?",
    options: [
      "Keep private matters private",
      "Some boundaries are important",
      "I share selectively and curate my image",
      "Vulnerability is connection, I'm open",
      "My life is content, I share everything"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Privacy expectations vary by generation."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Group projects - your vibe?",
    options: [
      "Clear leadership and defined roles",
      "Let me do my part independently",
      "Collaborative, lots of communication",
      "Virtual collab, async work is fine",
      "Why can't I just do it myself?"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Collaboration style is generational."
  },

  // VALUES & WORLDVIEW
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "The world is...",
    options: [
      "Better now than when I was young",
      "Whatever, I focus on myself",
      "Challenging but I'm optimistic",
      "Kind of falling apart but we cope",
      "Doomed but make it aesthetic ✨"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Worldview reflects generational experience."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your relationship with institutions (gov, banks, etc.)?",
    options: [
      "Trust them to do their job",
      "Skeptical but work within the system",
      "They need reform but can work",
      "Deep distrust, looking for alternatives",
      "I literally don't think about them"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Institutional trust varies by generation."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Climate change - your feelings?",
    options: [
      "It's overblown by the media",
      "Concerned but we'll adapt",
      "We need action but I'm still hopeful",
      "Climate anxiety is real, we're not okay",
      "The planet is literally on fire, whatever"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Climate attitudes differ across generations."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "What's your sense of humor?",
    options: [
      "Classic jokes, puns, situational comedy",
      "Sarcasm, dry wit, irony",
      "Self-deprecating, meme references",
      "Absurdist, ironic, 'that's so random'",
      "Chaos humor - if you get it, you get it"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Humor styles are generationally distinct."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Money and success means...",
    options: [
      "Owning a home, stable retirement",
      "Financial independence, not needing anyone",
      "Experiences and flexibility over things",
      "Not being exploited by late capitalism",
      "Passive income so I can do whatever"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Success definitions vary by generation."
  },

  // LIFESTYLE
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your dream housing situation?",
    options: [
      "Own a nice house in a good neighborhood",
      "Own property, maybe rural or quiet",
      "Rent in a city, flexibility is key",
      "Honestly just want to be able to afford rent",
      "I'll live wherever, maybe convert a van"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Housing dreams reflect generational realities."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Kids - what's your take?",
    options: [
      "Family is everything, have kids if you can",
      "Fine either way, personal choice",
      "Maybe, but when I can afford it",
      "Too expensive and the world is scary",
      "I'm literally still a kid mentally"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Attitudes toward parenthood are generational."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Physical mail - how often do you check it?",
    options: [
      "Daily, of course",
      "Every few days, mostly bills",
      "When I remember, maybe weekly",
      "Only for packages",
      "What's mail? Like email?"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Mail habits reveal generational norms."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "How do you handle disagreements online?",
    options: [
      "I don't argue on the internet",
      "State my view once and disengage",
      "Try to have reasonable discussions",
      "Clap back with facts or humor",
      "Block and move on, no time for that"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Online conflict style is generational."
  },

  // CULTURE & IDENTITY
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your thoughts on labels (political, identity, etc.)?",
    options: [
      "They're useful and define who we are",
      "I don't like labels, I'm an individual",
      "Helpful for community but don't box me in",
      "Labels help find my people, I embrace them",
      "Labels are fluid, I contain multitudes"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Label attitudes vary by generation."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Celebrity culture - your take?",
    options: [
      "Follow a few favorites, respect their privacy",
      "Don't really care about celebrities",
      "Interested but aware it's all PR",
      "They're just people, parasocial is weird",
      "Influencers > celebrities now anyway"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Celebrity perception differs by generation."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Mental health - how open are you about it?",
    options: [
      "Keep it private, handle it yourself",
      "Only discuss with close people",
      "Working on being more open about it",
      "Openly discuss, therapy is normal",
      "My therapist is basically a podcast"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Mental health openness is generational."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "How do you express yourself?",
    options: [
      "Actions speak louder than words",
      "Keep it low-key, let my work speak",
      "Social media, creative projects, journaling",
      "Aesthetics, playlists, curated online presence",
      "Constant content creation and sharing"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Self-expression methods define generations."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Your reaction to being 'canceled'?",
    options: [
      "What does canceled even mean?",
      "Ridiculous - people are too sensitive",
      "There should be accountability, but within reason",
      "Depends on what they did, context matters",
      "Everyone gets canceled eventually lol"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Cancel culture views are generational."
  },

  // NOSTALGIA & TIME
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "The 'good old days' were...",
    options: [
      "When I was raising my family",
      "The 80s/90s, before things got complicated",
      "The 2000s/early 2010s, simpler internet",
      "Like, 2019? Before the pandemic?",
      "Right now is fine, I don't look back"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Nostalgia peaks reveal generational identity."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Technology makes life...",
    options: [
      "More complicated than it needs to be",
      "Easier but I miss simpler times",
      "So much better in many ways",
      "Normal - I can't imagine without it",
      "Essential - it IS life"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Tech attitude defines generations."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Best era for music?",
    options: [
      "60s-70s classic rock, soul, disco",
      "80s-90s rock, hip-hop, grunge",
      "2000s pop, indie, emo",
      "2010s EDM, rap, alternative",
      "Current music, it's always evolving"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Musical golden era reveals generation."
  },

  // QUICK PREFERENCES
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Emoji usage in texts?",
    options: [
      "Rarely, words are enough 😊",
      "Some emojis, mostly the basics",
      "Regular emoji use 🎉👍😂",
      "Heavy emoji + reaction spam",
      "💀💀💀 no cap fr fr"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Emoji density is generational."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "How do you end a conversation?",
    options: [
      "Proper goodbye, nice talking to you",
      "See ya, take care",
      "Talk soon! 👋",
      "Just... stop replying eventually",
      "k bye or just react to their message"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Conversation endings are generational markers."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Period at the end of a text?",
    options: [
      "Obviously. Proper punctuation.",
      "Usually. Depends on context.",
      "Sometimes, but not always necessary",
      "Never - it feels aggressive",
      "What's punctuation lol"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Text punctuation norms define generations."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Skinny jeans - thoughts?",
    options: [
      "I wear what I've always worn",
      "Comfortable, sure",
      "Classic, still wear them",
      "Dead. Absolutely not anymore.",
      "Vintage but only ironically"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Fashion opinions reveal generational identity."
  },
  {
    game_id: 'generation-quiz',
    type: 'preference',
    question: "Side parts vs middle parts?",
    options: [
      "I don't pay attention to hair trends",
      "Whatever suits my face",
      "Side part always",
      "Middle part or bust",
      "Changes weekly, who cares"
    ],
    traits: ['boomer', 'genx', 'millennial', 'genz', 'genalpha'],
    explanation: "Hair part discourse is generational."
  },
];

export default GENERATION_QUIZ_QUESTIONS;