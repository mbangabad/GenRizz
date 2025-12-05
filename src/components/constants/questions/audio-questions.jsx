// Audio-based questions for music and sound quizzes
// Note: Audio URLs would need to be replaced with actual hosted audio files

export const AUDIO_QUESTIONS = {
  'nineties-music': [
    {
      type: 'audio',
      question: "Name this 90s hit song:",
      audio_url: "/audio/90s-sample-1.mp3", // Placeholder - needs real audio
      options: ["Smells Like Teen Spirit", "Wonderwall", "Creep", "Bitter Sweet Symphony"],
      correct_index: 0,
      explanation: "Nirvana's iconic 1991 grunge anthem",
      difficulty: 5,
    },
    {
      type: 'audio',
      question: "Which artist is performing?",
      audio_url: "/audio/90s-sample-2.mp3",
      options: ["Backstreet Boys", "NSYNC", "Spice Girls", "Destiny's Child"],
      correct_index: 2,
      explanation: "The Spice Girls dominated the late 90s pop scene",
      difficulty: 4,
    },
    {
      type: 'audio',
      question: "Complete the lyric from this song:",
      audio_url: "/audio/90s-sample-3.mp3",
      options: ["...baby one more time", "...genie in a bottle", "...livin' la vida loca", "...no scrubs"],
      correct_index: 0,
      explanation: "Britney's debut single was a massive hit in 1998",
      difficulty: 3,
    },
  ],

  'gen-z-fluency': [
    {
      type: 'audio',
      question: "What TikTok sound is this?",
      audio_url: "/audio/tiktok-sound-1.mp3",
      options: ["Oh No", "Savage Love", "Lottery (Renegade)", "Say So"],
      correct_index: 0,
      explanation: "The 'Oh No' sound became one of TikTok's most used audios",
      difficulty: 3,
    },
    {
      type: 'audio',
      question: "Name this viral TikTok song:",
      audio_url: "/audio/tiktok-sound-2.mp3",
      options: ["drivers license", "good 4 u", "positions", "Levitating"],
      correct_index: 0,
      explanation: "Olivia Rodrigo's debut single broke streaming records",
      difficulty: 4,
    },
  ],

  'revenge-of-boomers': [
    {
      type: 'audio',
      question: "Name this classic rock anthem:",
      audio_url: "/audio/classic-rock-1.mp3",
      options: ["Stairway to Heaven", "Hotel California", "Bohemian Rhapsody", "Free Bird"],
      correct_index: 2,
      explanation: "Queen's 1975 masterpiece defied all conventions",
      difficulty: 6,
    },
    {
      type: 'audio',
      question: "Who performed this song?",
      audio_url: "/audio/classic-rock-2.mp3",
      options: ["The Beatles", "The Rolling Stones", "Led Zeppelin", "Pink Floyd"],
      correct_index: 0,
      explanation: "The Fab Four defined a generation of music",
      difficulty: 5,
    },
  ],

  'vintage-comedy': [
    {
      type: 'audio',
      question: "Which sitcom is this theme from?",
      audio_url: "/audio/sitcom-theme-1.mp3",
      options: ["Friends", "Seinfeld", "The Office", "How I Met Your Mother"],
      correct_index: 0,
      explanation: "I'll Be There For You by The Rembrandts",
      difficulty: 2,
    },
    {
      type: 'audio',
      question: "Name the show from this iconic bass line:",
      audio_url: "/audio/sitcom-theme-2.mp3",
      options: ["Friends", "Seinfeld", "Cheers", "Frasier"],
      correct_index: 1,
      explanation: "Seinfeld's slap bass is instantly recognizable",
      difficulty: 3,
    },
  ],
};

export const getAudioQuestionsForGame = (gameId) => {
  return AUDIO_QUESTIONS[gameId] || [];
};

// Note: For production, you would:
// 1. Host audio files on a CDN or in the app's public folder
// 2. Use royalty-free music samples or licensed content
// 3. Consider using Web Audio API for more control
// 4. Add proper audio preloading for smooth playback