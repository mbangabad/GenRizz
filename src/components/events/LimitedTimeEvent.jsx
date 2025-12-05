import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Gift, Star, ChevronRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getCurrentEvent, GAMES } from '../constants/games';

export default function LimitedTimeEvent({ userId, onPlay }) {
  const [event, setEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const currentEvent = getCurrentEvent();
    setEvent(currentEvent);

    if (currentEvent) {
      const updateTimer = () => {
        const now = new Date();
        const endDate = new Date(currentEvent.endDate + 'T23:59:59');
        const diff = endDate - now;
        
        if (diff > 0) {
          setTimeLeft({
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          });
        }
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  if (!event) return null;

  const eventGradients = {
    'black-friday': 'from-gray-900 via-gray-800 to-black',
    'christmas': 'from-red-600 via-green-600 to-red-700',
    'new-years': 'from-purple-600 via-pink-500 to-amber-500',
    'valentines': 'from-pink-500 via-red-500 to-rose-600',
    'april-fools': 'from-yellow-400 via-orange-500 to-red-500',
    'summer': 'from-cyan-400 via-blue-500 to-purple-500',
  };

  const gradient = eventGradients[event.id] || 'from-purple-500 to-pink-500';

  // Featured games for the event
  const featuredGames = Object.values(GAMES).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${gradient} rounded-3xl p-6 text-white overflow-hidden relative`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20],
              x: [-10, 10],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute w-16 h-16 bg-white/10 rounded-full blur-xl"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Event Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">{event.emoji}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                LIMITED TIME
              </span>
            </div>
            <h2 className="text-2xl font-black">{event.name}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
            <p className="text-xs opacity-80">XP Multiplier</p>
            <p className="text-2xl font-black">{event.multiplier}x</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-black/20 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Event ends in:</span>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[60px]">
              <p className="text-2xl font-black">{String(timeLeft.hours).padStart(2, '0')}</p>
              <p className="text-xs opacity-80">hours</p>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[60px]">
              <p className="text-2xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</p>
              <p className="text-xs opacity-80">mins</p>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[60px]">
              <p className="text-2xl font-black">{String(timeLeft.seconds).padStart(2, '0')}</p>
              <p className="text-xs opacity-80">secs</p>
            </div>
          </div>
        </div>

        {/* Event Rewards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs">{event.multiplier}x XP</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Gift className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs">Bonus Rewards</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs">Special Badge</p>
          </div>
        </div>

        {/* Featured Games */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 opacity-80">Featured Quizzes:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {featuredGames.map(game => (
              <motion.button
                key={game.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPlay?.(game.id)}
                className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2"
              >
                <span className="text-lg">{game.icon}</span>
                <span className="text-sm font-medium whitespace-nowrap">{game.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPlay?.(featuredGames[0]?.id)}
          className="w-full py-4 bg-white text-gray-900 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
        >
          <Star className="w-5 h-5" />
          Play Now & Earn {event.multiplier}x XP
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}