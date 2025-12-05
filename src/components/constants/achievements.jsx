// RIZZ Platform Achievements - 50+ badges to collect

export const ACHIEVEMENTS = [
  // === GAMES PLAYED ===
  { id: 'first_game', name: 'First Steps', description: 'Complete your first game', icon: '🐣', category: 'games', requirement_type: 'games_played', requirement_value: 1, xp_reward: 10, rarity: 'common' },
  { id: 'games_10', name: 'Getting Started', description: 'Complete 10 games', icon: '🎮', category: 'games', requirement_type: 'games_played', requirement_value: 10, xp_reward: 25, rarity: 'common' },
  { id: 'games_50', name: 'Regular Player', description: 'Complete 50 games', icon: '🕹️', category: 'games', requirement_type: 'games_played', requirement_value: 50, xp_reward: 50, rarity: 'rare' },
  { id: 'games_100', name: 'Dedicated Gamer', description: 'Complete 100 games', icon: '🏅', category: 'games', requirement_type: 'games_played', requirement_value: 100, xp_reward: 100, rarity: 'rare' },
  { id: 'games_500', name: 'RIZZ Addict', description: 'Complete 500 games', icon: '💎', category: 'games', requirement_type: 'games_played', requirement_value: 500, xp_reward: 250, rarity: 'epic' },
  { id: 'games_1000', name: 'Legendary Player', description: 'Complete 1000 games', icon: '👑', category: 'games', requirement_type: 'games_played', requirement_value: 1000, xp_reward: 500, rarity: 'legendary' },

  // === PERFECT SCORES ===
  { id: 'first_perfect', name: 'Perfection', description: 'Get your first 100% score', icon: '💯', category: 'mastery', requirement_type: 'perfect_scores', requirement_value: 1, xp_reward: 50, rarity: 'rare' },
  { id: 'perfect_5', name: 'Perfectionist', description: 'Get 5 perfect scores', icon: '🌟', category: 'mastery', requirement_type: 'perfect_scores', requirement_value: 5, xp_reward: 100, rarity: 'epic' },
  { id: 'perfect_25', name: 'Flawless', description: 'Get 25 perfect scores', icon: '✨', category: 'mastery', requirement_type: 'perfect_scores', requirement_value: 25, xp_reward: 250, rarity: 'legendary' },

  // === STREAKS ===
  { id: 'streak_3', name: 'Hot Start', description: 'Reach a 3-day streak', icon: '🔥', category: 'streaks', requirement_type: 'streak_days', requirement_value: 3, xp_reward: 15, rarity: 'common' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Reach a 7-day streak', icon: '📅', category: 'streaks', requirement_type: 'streak_days', requirement_value: 7, xp_reward: 50, rarity: 'rare' },
  { id: 'streak_30', name: 'Monthly Master', description: 'Reach a 30-day streak', icon: '🗓️', category: 'streaks', requirement_type: 'streak_days', requirement_value: 30, xp_reward: 200, rarity: 'epic' },
  { id: 'streak_100', name: 'Century Streak', description: 'Reach a 100-day streak', icon: '💪', category: 'streaks', requirement_type: 'streak_days', requirement_value: 100, xp_reward: 500, rarity: 'legendary' },
  { id: 'streak_365', name: 'Year of RIZZ', description: 'Reach a 365-day streak', icon: '🏆', category: 'streaks', requirement_type: 'streak_days', requirement_value: 365, xp_reward: 1000, rarity: 'legendary' },

  // === SOCIAL ===
  { id: 'first_challenge', name: 'Challenger', description: 'Send your first challenge', icon: '⚔️', category: 'social', requirement_type: 'friends_challenged', requirement_value: 1, xp_reward: 20, rarity: 'common' },
  { id: 'challenges_10', name: 'Competitive Spirit', description: 'Challenge 10 friends', icon: '🥊', category: 'social', requirement_type: 'friends_challenged', requirement_value: 10, xp_reward: 50, rarity: 'rare' },
  { id: 'challenges_50', name: 'Social Butterfly', description: 'Challenge 50 friends', icon: '🦋', category: 'social', requirement_type: 'friends_challenged', requirement_value: 50, xp_reward: 150, rarity: 'epic' },
  { id: 'win_streak_5', name: 'Undefeated', description: 'Win 5 challenges in a row', icon: '🏅', category: 'social', requirement_type: 'special', requirement_value: 5, xp_reward: 100, rarity: 'epic' },

  // === XP MILESTONES ===
  { id: 'xp_1000', name: 'XP Hunter', description: 'Earn 1,000 total XP', icon: '⚡', category: 'mastery', requirement_type: 'total_xp', requirement_value: 1000, xp_reward: 50, rarity: 'common' },
  { id: 'xp_5000', name: 'XP Collector', description: 'Earn 5,000 total XP', icon: '💫', category: 'mastery', requirement_type: 'total_xp', requirement_value: 5000, xp_reward: 100, rarity: 'rare' },
  { id: 'xp_25000', name: 'XP Master', description: 'Earn 25,000 total XP', icon: '🌠', category: 'mastery', requirement_type: 'total_xp', requirement_value: 25000, xp_reward: 300, rarity: 'epic' },
  { id: 'xp_100000', name: 'XP Legend', description: 'Earn 100,000 total XP', icon: '☄️', category: 'mastery', requirement_type: 'total_xp', requirement_value: 100000, xp_reward: 1000, rarity: 'legendary' },

  // === GAME MASTERY (per category) ===
  { id: 'master_genz', name: 'Gen Z Expert', description: 'Master all Gen Z games', icon: '💀', category: 'mastery', requirement_type: 'game_mastery', requirement_value: 3, xp_reward: 200, rarity: 'epic' },
  { id: 'master_boomer', name: 'Boomer Whisperer', description: 'Master all Boomer games', icon: '📻', category: 'mastery', requirement_type: 'game_mastery', requirement_value: 3, xp_reward: 200, rarity: 'epic' },
  { id: 'master_millennial', name: 'Millennial Nostalgia King', description: 'Master all Millennial games', icon: '📼', category: 'mastery', requirement_type: 'game_mastery', requirement_value: 3, xp_reward: 200, rarity: 'epic' },
  { id: 'master_genx', name: 'Gen X Sage', description: 'Master all Gen X games', icon: '🎸', category: 'mastery', requirement_type: 'game_mastery', requirement_value: 3, xp_reward: 200, rarity: 'epic' },
  { id: 'master_all', name: 'RIZZ GOD', description: 'Master all 30 games', icon: '👑', category: 'mastery', requirement_type: 'game_mastery', requirement_value: 30, xp_reward: 2000, rarity: 'legendary' },

  // === SPECIAL ===
  { id: 'daily_first', name: 'Daily Warrior', description: 'Complete your first daily challenge', icon: '☀️', category: 'special', requirement_type: 'special', requirement_value: 1, xp_reward: 25, rarity: 'common' },
  { id: 'daily_7', name: 'Daily Devotee', description: 'Complete 7 daily challenges', icon: '📆', category: 'special', requirement_type: 'special', requirement_value: 7, xp_reward: 75, rarity: 'rare' },
  { id: 'daily_30', name: 'Daily Champion', description: 'Complete 30 daily challenges', icon: '🏆', category: 'special', requirement_type: 'special', requirement_value: 30, xp_reward: 200, rarity: 'epic' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Finish a game in under 60 seconds', icon: '⏱️', category: 'special', requirement_type: 'special', requirement_value: 60, xp_reward: 75, rarity: 'rare' },
  { id: 'night_owl', name: 'Night Owl', description: 'Play a game after midnight', icon: '🦉', category: 'special', requirement_type: 'special', requirement_value: 1, xp_reward: 25, rarity: 'common' },
  { id: 'early_bird', name: 'Early Bird', description: 'Play a game before 6 AM', icon: '🐦', category: 'special', requirement_type: 'special', requirement_value: 1, xp_reward: 25, rarity: 'common' },
  { id: 'comeback_kid', name: 'Comeback Kid', description: 'Win after being behind mid-game', icon: '🔄', category: 'special', requirement_type: 'special', requirement_value: 1, xp_reward: 50, rarity: 'rare' },
  { id: 'no_hints', name: 'No Help Needed', description: 'Complete a game without using power-ups', icon: '💪', category: 'special', requirement_type: 'special', requirement_value: 1, xp_reward: 30, rarity: 'common' },
  { id: 'share_first', name: 'Sharing is Caring', description: 'Share your first result', icon: '📤', category: 'social', requirement_type: 'special', requirement_value: 1, xp_reward: 15, rarity: 'common' },
  { id: 'viral', name: 'Going Viral', description: 'Have 10 people play from your share', icon: '🚀', category: 'social', requirement_type: 'special', requirement_value: 10, xp_reward: 200, rarity: 'epic' },

  // === TIERS ===
  { id: 'tier_normie', name: 'Normie No More', description: 'Reach Casual tier', icon: '😎', category: 'mastery', requirement_type: 'total_xp', requirement_value: 1000, xp_reward: 25, rarity: 'common' },
  { id: 'tier_based', name: 'Based Achievement', description: 'Reach Based tier', icon: '💪', category: 'mastery', requirement_type: 'total_xp', requirement_value: 3000, xp_reward: 75, rarity: 'rare' },
  { id: 'tier_nocap', name: 'No Cap Certified', description: 'Reach No Cap tier', icon: '🔥', category: 'mastery', requirement_type: 'total_xp', requirement_value: 6000, xp_reward: 150, rarity: 'epic' },
  { id: 'tier_goated', name: 'GOATED Status', description: 'Reach Goated tier', icon: '🐐', category: 'mastery', requirement_type: 'total_xp', requirement_value: 10000, xp_reward: 300, rarity: 'epic' },
  { id: 'tier_memelord', name: 'Meme Lord Ascension', description: 'Reach Meme Lord tier', icon: '👑', category: 'mastery', requirement_type: 'total_xp', requirement_value: 20000, xp_reward: 500, rarity: 'legendary' },

  // === PREMIUM EXCLUSIVE ===
  { id: 'premium_member', name: 'Premium Player', description: 'Subscribe to Premium', icon: '💎', category: 'special', requirement_type: 'special', requirement_value: 1, xp_reward: 100, rarity: 'rare' },
  { id: 'black_friday', name: 'Black Friday Legend', description: 'Subscribe during Black Friday sale', icon: '🖤', category: 'special', requirement_type: 'special', requirement_value: 1, xp_reward: 150, rarity: 'epic' },
  { id: 'streak_saved', name: 'Streak Saved!', description: 'Use your first streak freeze', icon: '🧊', category: 'special', requirement_type: 'special', requirement_value: 1, xp_reward: 25, rarity: 'rare' },
];

export const getAchievementById = (id) => ACHIEVEMENTS.find(a => a.id === id);

export const getAchievementsByCategory = (category) => 
  ACHIEVEMENTS.filter(a => a.category === category);

export const getAchievementsByRarity = (rarity) => 
  ACHIEVEMENTS.filter(a => a.rarity === rarity);

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'games', name: 'Games Played', icon: '🎮' },
  { id: 'mastery', name: 'Mastery', icon: '🏆' },
  { id: 'streaks', name: 'Streaks', icon: '🔥' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'special', name: 'Special', icon: '✨' },
];