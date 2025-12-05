// Mental Age Test - PERSONALITY GAME
// No wrong answers - each option adds points to calculate mental age
// Options weighted: A=young, B=young-mid, C=mid-old, D=old

export const MENTAL_AGE_QUESTIONS = [
  // LIFESTYLE & DAILY HABITS
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "It's Friday night. What sounds like the perfect evening?",
    options: [
      "Going out with friends to a party or club",
      "Dinner and drinks at a trendy restaurant",
      "Movie night at home with takeout",
      "Early dinner, read a book, in bed by 9pm"
    ],
    weights: [18, 28, 42, 65],
    explanation: "Your ideal Friday reveals your energy levels and social preferences."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about trying new foods?",
    options: [
      "I'll try ANYTHING once - the weirder the better!",
      "I'm pretty adventurous with food",
      "I like what I like, but I'll try new things occasionally",
      "I prefer sticking to foods I know and trust"
    ],
    weights: [20, 30, 45, 62],
    explanation: "Openness to new experiences often correlates with mental age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your phone battery is at 5%. How do you feel?",
    options: [
      "PANIC MODE - this is an emergency!",
      "Stressed - I need to find a charger ASAP",
      "Mildly annoyed but I'll survive",
      "Whatever, I don't need my phone that much anyway"
    ],
    weights: [19, 27, 45, 68],
    explanation: "Phone dependency often reflects generational digital attachment."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you prefer to get your news?",
    options: [
      "TikTok, Twitter/X, social media feeds",
      "News apps and online articles",
      "TV news or news websites",
      "Newspapers, radio, or I just ask people"
    ],
    weights: [17, 28, 48, 70],
    explanation: "News consumption habits reveal generational media preferences."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Someone cuts you off in traffic. Your reaction?",
    options: [
      "Honk aggressively and maybe some hand gestures",
      "Mutter some choice words under my breath",
      "Sigh and let it go - not worth the stress",
      "Barely notice, I'm focused on my own driving"
    ],
    weights: [22, 32, 52, 68],
    explanation: "Emotional reactivity tends to mellow with mental maturity."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "What time do you naturally wake up on weekends?",
    options: [
      "Noon or later - sleep is sacred",
      "9-11am - catch up on rest",
      "7-9am - similar to weekdays",
      "Before 7am - body clock doesn't know weekends"
    ],
    weights: [18, 28, 50, 72],
    explanation: "Sleep patterns shift significantly with age and lifestyle."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about making phone calls?",
    options: [
      "Absolutely dread it - text me instead!",
      "I'll do it if I have to, but prefer texting",
      "Don't mind either way",
      "I actually prefer calling - it's more efficient"
    ],
    weights: [19, 30, 48, 65],
    explanation: "Phone call anxiety is a generational marker."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your approach to saving money?",
    options: [
      "YOLO - I'll worry about money later",
      "I try to save but life happens",
      "I have a budget and mostly stick to it",
      "I save consistently and track every expense"
    ],
    weights: [18, 30, 50, 68],
    explanation: "Financial habits often mature over time."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about silence in social situations?",
    options: [
      "SO awkward - someone fill the void!",
      "A bit uncomfortable, I usually talk to fill it",
      "It's fine, not everything needs words",
      "I appreciate comfortable silences"
    ],
    weights: [20, 32, 52, 70],
    explanation: "Comfort with silence grows with emotional maturity."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Someone gives you unsolicited advice. Your reaction?",
    options: [
      "Internally roll my eyes and ignore it",
      "Nod politely but probably won't follow it",
      "Consider it - they might have a point",
      "Appreciate it - wisdom from experience is valuable"
    ],
    weights: [19, 30, 50, 68],
    explanation: "Receptiveness to advice often increases with maturity."
  },

  // TECHNOLOGY & MEDIA
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How many streaming services do you actively use?",
    options: [
      "4+ and I need more content!",
      "2-3 services that I rotate",
      "1-2 that I use regularly",
      "None, or I just borrow someone else's"
    ],
    weights: [22, 32, 50, 65],
    explanation: "Streaming habits reflect digital consumption patterns."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "You need to learn something new. First step?",
    options: [
      "YouTube tutorial or TikTok",
      "Google it and read articles",
      "Find a book or comprehensive guide",
      "Ask someone who knows or take a class"
    ],
    weights: [18, 30, 52, 68],
    explanation: "Learning preferences reveal generational habits."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about AI and new technology?",
    options: [
      "Love it! Can't wait for what's next",
      "Interested but a bit cautious",
      "Skeptical - prefer the old ways sometimes",
      "Overwhelmed - technology moves too fast"
    ],
    weights: [20, 32, 52, 70],
    explanation: "Tech enthusiasm often correlates with mental age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your social media posting frequency?",
    options: [
      "Multiple times a day - living my life online",
      "A few times a week",
      "Occasionally - major events only",
      "Rarely or never - I'm a lurker/not on social media"
    ],
    weights: [18, 28, 50, 72],
    explanation: "Social media activity varies by generation."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you prefer to watch movies?",
    options: [
      "On my phone wherever I am",
      "Laptop or tablet in my room",
      "On a TV in the living room",
      "At an actual movie theater"
    ],
    weights: [17, 28, 48, 68],
    explanation: "Viewing preferences reflect generational habits."
  },

  // RELATIONSHIPS & SOCIAL
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How many close friends do you need to feel fulfilled?",
    options: [
      "A big squad - the more the merrier!",
      "A solid group of 5-10 good friends",
      "A handful of really close friends (2-4)",
      "One or two true friends is enough"
    ],
    weights: [20, 30, 50, 68],
    explanation: "Social circle preferences often evolve with age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you handle disagreements with friends?",
    options: [
      "Vent about it online or to other friends",
      "Address it directly but it's uncomfortable",
      "Talk it out calmly when emotions settle",
      "Often just let it go - not worth the conflict"
    ],
    weights: [18, 30, 50, 65],
    explanation: "Conflict resolution style matures over time."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your thoughts on getting married?",
    options: [
      "Not for me / way too young to think about it",
      "Maybe someday, no rush",
      "It's an important goal for me",
      "Already married / been there, know its value"
    ],
    weights: [18, 32, 50, 70],
    explanation: "Marriage attitudes shift with life stage."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you keep in touch with old friends?",
    options: [
      "Social media likes/comments - it counts!",
      "Group chats and occasional meetups",
      "Regular calls and planned visits",
      "Annual holiday cards and life milestone check-ins"
    ],
    weights: [18, 30, 50, 70],
    explanation: "Friendship maintenance evolves with maturity."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How important is alone time to you?",
    options: [
      "FOMO is real - I'd rather be with people",
      "I need some, but not too much",
      "Very important - I recharge alone",
      "Essential - solitude is peaceful"
    ],
    weights: [20, 32, 52, 68],
    explanation: "Appreciation for solitude often increases with age."
  },

  // VALUES & PHILOSOPHY
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "What matters most to you right now?",
    options: [
      "Having fun and new experiences",
      "Building my career and relationships",
      "Stability and taking care of responsibilities",
      "Peace, health, and meaningful connections"
    ],
    weights: [18, 32, 52, 70],
    explanation: "Life priorities shift with mental maturity."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about 'hustle culture'?",
    options: [
      "Grind now, rest later - success requires sacrifice",
      "Working hard is important but so is balance",
      "Work to live, don't live to work",
      "I've learned that time is more valuable than money"
    ],
    weights: [22, 35, 52, 68],
    explanation: "Work philosophy evolves with experience."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your reaction to someone younger giving you advice?",
    options: [
      "Happy to hear fresh perspectives!",
      "Open to it if they know what they're talking about",
      "A bit skeptical but I'll listen",
      "Respectfully disagree - experience trumps all"
    ],
    weights: [20, 35, 55, 72],
    explanation: "Receptiveness to younger perspectives varies with mental age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about your past mistakes?",
    options: [
      "Try not to think about them - cringe!",
      "Still processing some of them",
      "I've learned from most of them",
      "They made me who I am - no regrets"
    ],
    weights: [19, 32, 50, 68],
    explanation: "Relationship with past failures reflects emotional maturity."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your approach to health and wellness?",
    options: [
      "I'm young, I'll worry about it later",
      "I try to be healthy but life happens",
      "Health is a priority - I work at it",
      "Prevention is key - regular checkups and routines"
    ],
    weights: [17, 30, 52, 70],
    explanation: "Health consciousness often increases with age."
  },

  // ENTERTAINMENT & CULTURE
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your music volume preference?",
    options: [
      "LOUD - I want to feel it in my chest",
      "Pretty loud - I like to immerse myself",
      "Moderate - I want to hear but also think",
      "Low background music - less is more"
    ],
    weights: [18, 28, 50, 70],
    explanation: "Volume preferences often correlate with age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about current music trends?",
    options: [
      "I love it - I'm always finding new artists",
      "Some good stuff, some not my taste",
      "Music peaked in my younger years",
      "I mostly listen to classics from decades past"
    ],
    weights: [18, 32, 55, 72],
    explanation: "Music taste evolution reflects mental age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your ideal vacation?",
    options: [
      "Backpacking adventure with friends",
      "City exploration with nightlife",
      "Resort relaxation with comfort",
      "Quiet cabin or nature retreat"
    ],
    weights: [20, 30, 50, 68],
    explanation: "Travel style preferences shift with age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about viral trends?",
    options: [
      "First to try them - gotta stay relevant!",
      "I'll participate if they seem fun",
      "I watch but rarely participate",
      "Don't understand most of them anymore"
    ],
    weights: [18, 30, 52, 72],
    explanation: "Trend participation reflects cultural age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your reaction to 'kids these days'?",
    options: [
      "That's literally me or my friends!",
      "I relate to them mostly",
      "Some things confuse me but I try",
      "I genuinely don't understand them"
    ],
    weights: [16, 28, 52, 72],
    explanation: "Generational gap perception reveals mental age."
  },

  // PRACTICAL LIFE
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How far in advance do you make plans?",
    options: [
      "Same day or spontaneous - planning kills vibes",
      "A few days to a week ahead",
      "Weeks to months in advance",
      "I have a calendar for the whole year"
    ],
    weights: [18, 30, 52, 70],
    explanation: "Planning horizon often extends with maturity."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your approach to home decor?",
    options: [
      "Whatever's cheap or free works",
      "Making it look nice on a budget",
      "Investing in quality pieces that last",
      "Comfort and function over style"
    ],
    weights: [18, 32, 52, 68],
    explanation: "Home priorities evolve with life stage."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you handle being wrong?",
    options: [
      "Double down and defend my position",
      "Reluctantly admit it after proof",
      "Acknowledge it and learn from it",
      "Easily admit it - being right isn't that important"
    ],
    weights: [20, 35, 52, 68],
    explanation: "Ego flexibility increases with wisdom."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your relationship with your parents/family?",
    options: [
      "They're annoying - I need space",
      "It's complicated but improving",
      "We're close and I value their input",
      "They're some of my favorite people"
    ],
    weights: [18, 32, 52, 68],
    explanation: "Family appreciation often grows with maturity."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about routine?",
    options: [
      "Routine is boring - variety is life!",
      "Some routine is fine but flexibility is key",
      "I thrive with a consistent schedule",
      "My routine is sacred - don't mess with it"
    ],
    weights: [18, 32, 55, 72],
    explanation: "Routine appreciation typically increases with age."
  },

  // EMOTIONAL & MENTAL
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you process difficult emotions?",
    options: [
      "Distract myself until they pass",
      "Talk it out with friends",
      "Journal, meditate, or self-reflect",
      "Accept them as part of life's journey"
    ],
    weights: [20, 32, 52, 68],
    explanation: "Emotional processing matures over time."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your biggest fear?",
    options: [
      "Missing out on experiences",
      "Failing or not achieving my goals",
      "Losing loved ones",
      "Running out of time"
    ],
    weights: [18, 32, 52, 72],
    explanation: "Core fears shift with life perspective."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "What makes you feel successful?",
    options: [
      "Social validation and popularity",
      "Career achievements and money",
      "Strong relationships and stability",
      "Inner peace and contentment"
    ],
    weights: [18, 32, 52, 70],
    explanation: "Success metrics evolve with maturity."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about aging?",
    options: [
      "Don't want to think about it",
      "Dreading it a little honestly",
      "Accepting it as natural",
      "Looking forward to the wisdom it brings"
    ],
    weights: [18, 30, 52, 70],
    explanation: "Relationship with aging reflects mental maturity."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your attitude toward life's challenges?",
    options: [
      "Why does everything have to be so hard?!",
      "I handle them but they stress me out",
      "They're opportunities for growth",
      "This too shall pass - I've seen it all"
    ],
    weights: [20, 32, 52, 70],
    explanation: "Resilience and perspective develop with experience."
  },

  // More questions for variety...
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How long can you go without checking your phone?",
    options: [
      "Maybe 10 minutes max",
      "An hour or two",
      "Half a day easily",
      "All day - I forget it exists sometimes"
    ],
    weights: [17, 28, 50, 72],
    explanation: "Phone attachment varies significantly by mental age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your opinion on small talk?",
    options: [
      "Hate it - get to the point",
      "It's fine, part of social life",
      "I've come to appreciate it",
      "It's how real connections start"
    ],
    weights: [22, 35, 52, 65],
    explanation: "Small talk appreciation often grows with age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you spend a Sunday?",
    options: [
      "Recovering from Saturday night",
      "Catching up on chores and errands",
      "Family time and relaxation",
      "Quiet morning routine, early to bed"
    ],
    weights: [18, 32, 52, 70],
    explanation: "Sunday rituals reflect life stage."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your thoughts on current fashion trends?",
    options: [
      "I'm always on trend",
      "I follow what looks good on me",
      "Comfort over fashion these days",
      "I wear what I've always worn"
    ],
    weights: [18, 32, 55, 72],
    explanation: "Fashion priority often decreases with age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you feel about nostalgia?",
    options: [
      "The past? I'm focused on now",
      "Sometimes I miss simpler times",
      "I treasure good memories",
      "The best years are behind us"
    ],
    weights: [18, 35, 55, 75],
    explanation: "Nostalgia intensity can indicate mental age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your reaction to a surprise party?",
    options: [
      "LOVE surprises! The best!",
      "Fun but slightly stressful",
      "Nice gesture but I'd prefer a heads up",
      "Please no - I don't like surprises anymore"
    ],
    weights: [18, 32, 52, 70],
    explanation: "Surprise tolerance often decreases with age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "How do you handle waiting in line?",
    options: [
      "Extremely frustrating - time is wasting!",
      "Annoying but I manage with my phone",
      "It is what it is",
      "A chance to people-watch and think"
    ],
    weights: [22, 32, 50, 68],
    explanation: "Patience typically increases with age."
  },
  {
    game_id: 'mental-age',
    type: 'preference',
    question: "Your thoughts on taking naps?",
    options: [
      "Naps are for old people or babies",
      "Sometimes needed after a rough night",
      "A wonderful luxury when I can",
      "Essential - I nap daily"
    ],
    weights: [18, 32, 52, 72],
    explanation: "Nap appreciation is a classic age indicator."
  },
];

export default MENTAL_AGE_QUESTIONS;