// Image-based questions for visual quizzes
// These use Unsplash images and meme references

export const IMAGE_QUESTIONS = {
  'emoji-detective': [
    {
      type: 'image',
      question: "What meme is this emoji combination representing?",
      image_url: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=300&fit=crop",
      options: ["Distracted Boyfriend", "Woman Yelling at Cat", "Drake Hotline Bling", "This is Fine"],
      correct_index: 0,
      explanation: "The classic distracted boyfriend meme format",
      difficulty: 5,
    },
    {
      type: 'image',
      question: "Identify this viral moment:",
      image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      options: ["Zoom Call Fail", "WFH Life", "Cat on Keyboard", "Monday Mood"],
      correct_index: 1,
      explanation: "The work-from-home aesthetic became a meme during 2020",
      difficulty: 4,
    },
  ],

  'millennial-nostalgia': [
    {
      type: 'image',
      question: "What 90s tech is this?",
      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      options: ["Walkman", "Discman", "MP3 Player", "Gameboy"],
      correct_index: 1,
      explanation: "The Discman was THE way to listen to music in the late 90s",
      difficulty: 6,
    },
    {
      type: 'image_options',
      question: "Which album cover is from the 90s?",
      image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      option_images: [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&h=150&fit=crop",
      ],
      correct_index: 1,
      explanation: "Classic 90s album art aesthetic",
      difficulty: 7,
    },
  ],

  'ipad-kid-culture': [
    {
      type: 'image',
      question: "What popular kids' game is this from?",
      image_url: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=400&h=300&fit=crop",
      options: ["Roblox", "Minecraft", "Fortnite", "Among Us"],
      correct_index: 1,
      explanation: "Minecraft's blocky aesthetic is instantly recognizable",
      difficulty: 3,
    },
    {
      type: 'image',
      question: "What platform is this content from?",
      image_url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop",
      options: ["YouTube", "TikTok", "Instagram", "Snapchat"],
      correct_index: 1,
      explanation: "TikTok's vertical video format is distinctive",
      difficulty: 2,
    },
  ],

  'gen-z-fluency': [
    {
      type: 'image',
      question: "What does this hand gesture mean in Gen Z speak?",
      image_url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop",
      options: ["Periodt", "No Cap", "Sheesh", "It's Giving"],
      correct_index: 2,
      explanation: "The 'sheesh' pose became viral on TikTok",
      difficulty: 4,
    },
  ],
};

export const getImageQuestionsForGame = (gameId) => {
  return IMAGE_QUESTIONS[gameId] || [];
};