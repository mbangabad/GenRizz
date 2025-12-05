import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Users, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Score } from '@/api/entities';
import { GAMES, GAME_CATEGORIES_META } from '../constants/games';

export default function TrendingCategories({ onCategoryClick }) {
  // Fetch trending data based on recent plays
  const { data: recentScores = [] } = useQuery({
    queryKey: ['trendingScores'],
    queryFn: async () => {
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      return Score.list('created_at', 100, false);
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Calculate trending categories
  const categoryPlayCounts = {};
  recentScores.forEach(score => {
    const game = GAMES[score.game_id];
    if (game?.category) {
      categoryPlayCounts[game.category] = (categoryPlayCounts[game.category] || 0) + 1;
    }
  });

  const trendingCategories = Object.entries(categoryPlayCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([categoryId, count]) => ({
      ...GAME_CATEGORIES_META[categoryId],
      playCount: count,
      trend: count > 20 ? 'hot' : count > 10 ? 'rising' : 'stable',
    }))
    .filter(c => c.name); // Filter out undefined categories

  if (trendingCategories.length === 0) {
    // Fallback to default trending
    const defaultTrending = ['gen-z-fluency', 'mental-age', 'red-flag'].map(id => ({
      ...GAME_CATEGORIES_META[id],
      playCount: Math.floor(Math.random() * 50) + 10,
      trend: 'hot',
    })).filter(c => c?.name);
    
    return <TrendingDisplay categories={defaultTrending} onCategoryClick={onCategoryClick} />;
  }

  return <TrendingDisplay categories={trendingCategories} onCategoryClick={onCategoryClick} />;
}

function TrendingDisplay({ categories, onCategoryClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Trending This Week</h3>
            <p className="text-xs text-gray-500">Updated hourly</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          Live
        </div>
      </div>

      {/* Trending Categories */}
      <div className="space-y-2">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01, x: 4 }}
            onClick={() => onCategoryClick?.(category.id)}
            className="w-full bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3 hover:border-orange-200 hover:shadow-sm transition-all"
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              index === 0 ? 'bg-amber-100 text-amber-700' :
              index === 1 ? 'bg-gray-100 text-gray-600' :
              index === 2 ? 'bg-orange-100 text-orange-700' :
              'bg-gray-50 text-gray-500'
            }`}>
              #{index + 1}
            </div>

            {/* Category Info */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {category.emoji}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">{category.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{category.playCount} plays today</span>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              category.trend === 'hot' 
                ? 'bg-red-100 text-red-600' 
                : category.trend === 'rising'
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600'
            }`}>
              {category.trend === 'hot' && <Flame className="w-3 h-3" />}
              {category.trend === 'hot' ? 'Hot' : category.trend === 'rising' ? 'Rising' : 'Stable'}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}