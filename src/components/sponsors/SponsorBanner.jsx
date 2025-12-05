import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Sparkles } from 'lucide-react';

// Sponsor/Influencer framework - can be configured via database
const SPONSORS = [
  {
    id: 'demo-sponsor',
    name: 'Brand Partner',
    tagline: 'Presented by',
    logo: '🏢',
    color: '#6366F1',
    link: '#',
    type: 'brand',
  },
];

const INFLUENCER_COLLABS = [
  {
    id: 'influencer-1',
    name: '@GenZKing',
    followers: '2.4M',
    avatar: '👑',
    customQuiz: 'gen-z-fluency',
    tagline: 'Take my custom quiz!',
  },
];

export default function SponsorBanner({ type = 'brand', sponsorId }) {
  const sponsor = SPONSORS.find(s => s.id === sponsorId) || SPONSORS[0];

  if (type === 'influencer') {
    const influencer = INFLUENCER_COLLABS[0];
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-4 text-white"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            {influencer.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold">{influencer.name}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {influencer.followers} followers
              </span>
            </div>
            <p className="text-sm text-white/80">{influencer.tagline}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            Play
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.a
      href={sponsor.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="block bg-white rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition-all"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ backgroundColor: `${sponsor.color}15` }}
        >
          {sponsor.logo}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400">{sponsor.tagline}</p>
          <p className="font-medium text-gray-900">{sponsor.name}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Star className="w-3 h-3" />
          Sponsored
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>
    </motion.a>
  );
}

// Mini sponsor badge for game cards
export function SponsorBadge({ sponsorName }) {
  return (
    <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
      <Star className="w-3 h-3" />
      {sponsorName || 'Featured'}
    </div>
  );
}