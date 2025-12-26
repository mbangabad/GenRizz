import React, { useState, useEffect } from 'react';
import { auth } from '@/api/auth';
import { motion } from 'framer-motion';
import { 
  Globe, MapPin, Lock, Star, Trophy, ArrowLeft, 
  ChevronRight, Crown, Plane, Compass 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { GAMES_LIST } from '@/components/constants/games';

const REGIONS = [
  {
    id: 'north_america',
    name: 'North America',
    description: 'Pop Culture Capital',
    icon: '🗽',
    color: 'var(--brand-blue)',
    unlockLevel: 1,
    games: ['gen-z-fluency', 'millennial-nostalgia'],
    coordinates: { top: '25%', left: '20%' }
  },
  {
    id: 'europe',
    name: 'Europe',
    description: 'History & Heritage',
    icon: '🏰',
    color: 'var(--brand-green)',
    unlockLevel: 3,
    games: ['boomer-era', 'generation-quiz'],
    coordinates: { top: '25%', left: '50%' }
  },
  {
    id: 'asia',
    name: 'Asia',
    description: 'Tech & Tradition',
    icon: '⛩️',
    color: 'var(--brand-red)',
    unlockLevel: 5,
    games: ['gen-alpha', 'social-iq'],
    coordinates: { top: '35%', left: '70%' }
  },
  {
    id: 'latin_america',
    name: 'Latin America',
    description: 'Vibrant Vibes',
    icon: '💃',
    color: 'var(--brand-yellow)',
    unlockLevel: 8,
    games: ['vibe-check', 'social-awareness'],
    coordinates: { top: '55%', left: '25%' }
  },
  {
    id: 'africa',
    name: 'Africa',
    description: 'Roots & Rhythm',
    icon: '🌍',
    color: 'var(--brand-purple)',
    unlockLevel: 10,
    games: ['family-bridge', 'boomer-humor'],
    coordinates: { top: '50%', left: '50%' }
  },
  {
    id: 'oceania',
    name: 'Oceania',
    description: 'Adventure Down Under',
    icon: '🦘',
    color: 'var(--brand-orange)',
    unlockLevel: 12,
    games: ['gen-x-wisdom', 'mental-age'],
    coordinates: { top: '70%', left: '80%' }
  }
];

export default function WorldMap() {
  const [user, setUser] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    auth.me().then(u => {
      setUser(u);
      // Mock calculation of user level based on XP (should be from utils)
      // Assuming 1 level per 1000 XP roughly
      if (u) setUserLevel(Math.max(1, Math.floor((u.total_xp || 0) / 1000)));
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0E1B2A] text-white pb-24 overflow-hidden relative">
      {/* Animated Background Stars */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full w-1 h-1"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 3}s infinite`
            }}
          />
        ))}
      </div>

      <header className="absolute top-0 left-0 right-0 z-40 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--brand-blue)]" />
            <span className="font-bold text-sm">World Map</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
            <Crown className="w-4 h-4 text-[var(--brand-yellow)]" />
            <span className="font-bold text-sm">Lvl {userLevel}</span>
          </div>
        </div>
      </header>

      <main className="relative h-screen pt-20 pb-20 flex flex-col items-center justify-center">
        {/* Map Visualization (Abstract) */}
        <div className="relative w-full max-w-4xl aspect-[16/9] bg-[#1B2B3C] rounded-3xl shadow-2xl border border-white/10 overflow-hidden mx-4">
          {/* Map Grid Lines */}
          <div className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} 
          />
          
          {/* Regions */}
          {REGIONS.map((region) => {
            const isLocked = userLevel < region.unlockLevel;
            const isSelected = selectedRegion?.id === region.id;

            return (
              <motion.button
                key={region.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={region.coordinates}
                onClick={() => setSelectedRegion(region)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  {/* Pulse Ring if Unlocked */}
                  {!isLocked && (
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                  )}
                  
                  {/* Marker */}
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-lg transition-all ${
                      isLocked 
                        ? 'bg-gray-600 border-gray-500 grayscale' 
                        : isSelected 
                          ? 'bg-white border-white scale-110'
                          : 'bg-gray-800 border-gray-700'
                    }`}
                    style={{ 
                      borderColor: !isLocked && isSelected ? 'white' : !isLocked ? region.color : undefined 
                    }}
                  >
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <span className="text-2xl">{region.icon}</span>
                    )}
                  </div>

                  {/* Label */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected 
                      ? 'bg-white text-black scale-110' 
                      : 'bg-black/50 text-white backdrop-blur-sm'
                  }`}>
                    {region.name}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Region Detail Sheet */}
      <motion.div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 shadow-2xl transition-transform duration-300 ${
          selectedRegion ? 'translate-y-0' : 'translate-y-full'
        }`}
        initial={false}
      >
        {selectedRegion && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
                  style={{ backgroundColor: `${selectedRegion.color}20` }}>
                  {selectedRegion.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[var(--text-primary)]">{selectedRegion.name}</h2>
                  <p className="text-[var(--text-secondary)] font-semibold">{selectedRegion.description}</p>
                </div>
              </div>
              <div className="text-right">
                <button 
                  onClick={() => setSelectedRegion(null)}
                  className="p-2 hover:bg-gray-100 rounded-full mb-2"
                >
                  <ChevronRight className="w-6 h-6 rotate-90 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>

            {userLevel < selectedRegion.unlockLevel ? (
              <div className="bg-gray-100 rounded-2xl p-6 text-center mb-6">
                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-bold text-gray-600">Region Locked</h3>
                <p className="text-sm text-gray-500 mb-4">Reach Level {selectedRegion.unlockLevel} to explore this region.</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div 
                    className="h-full bg-[var(--brand-blue)]" 
                    style={{ width: `${(userLevel / selectedRegion.unlockLevel) * 100}%` }} 
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{userLevel} / {selectedRegion.unlockLevel} Levels</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <h3 className="font-bold text-[var(--text-primary)] uppercase text-xs tracking-wider">Available Games</h3>
                {selectedRegion.games.map(gameId => {
                  const game = GAMES_LIST.find(g => g.id === gameId);
                  if (!game) return null;
                  return (
                    <Link to={createPageUrl('Gameplay') + `?gameId=${gameId}`} key={gameId}>
                      <div className="card-3d p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="text-2xl">{game.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[var(--text-primary)]">{game.title}</h4>
                          <p className="text-xs text-[var(--text-secondary)]">{game.subtitle}</p>
                        </div>
                        <button className="btn-3d btn-3d-green px-4 py-2 text-sm">
                          Play
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Overlay when sheet is open */}
      {selectedRegion && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setSelectedRegion(null)}
        />
      )}
    </div>
  );
}