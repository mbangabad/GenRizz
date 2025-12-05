import React from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Sparkles } from 'lucide-react';
import AnimatedParticles from '../ui/AnimatedParticles';
import CountdownTimer from '../ui/CountdownTimer';

export default function HeroCard({ game, onPlay }) {
  return (
    <motion.div 
      onClick={onPlay}
      className="group relative h-[340px] w-full rounded-3xl overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      style={{
        boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.25)',
      }}
    >
      {/* Background Image with Ken Burns effect */}
      <motion.div 
        className="absolute inset-0"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <img 
          src={game.image || "https://images.unsplash.com/photo-1614728263952-84ea2563bc10"} 
          alt="Daily Challenge"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-purple-900/20" />
      
      {/* Animated Particles */}
      <AnimatedParticles count={15} colors={['#CE82FF', '#FF86D0', '#FFD700']} />

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)',
            'linear-gradient(105deg, transparent 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
            'linear-gradient(105deg, transparent 100%, rgba(255,255,255,0.1) 105%, transparent 110%)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 px-3 py-1.5 rounded-full"
          animate={{ 
            boxShadow: ['0 0 15px rgba(234, 179, 8, 0.3)', '0 0 25px rgba(234, 179, 8, 0.5)', '0 0 15px rgba(234, 179, 8, 0.3)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </motion.div>
          <span className="text-xs font-bold text-yellow-100">2x XP ACTIVE</span>
        </motion.div>
        
        <CountdownTimer />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <motion.div 
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 border border-purple-500/30 backdrop-blur-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Daily Challenge
          </span>
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-4xl font-black leading-tight mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            textShadow: '0 0 30px rgba(255,255,255,0.3)',
          }}
        >
          {game.title}
        </motion.h1>
        
        <motion.p 
          className="text-sm text-slate-300 mb-5 max-w-[90%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {game.description}
        </motion.p>
        
        <motion.button 
          className="relative overflow-hidden bg-white text-slate-900 font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 shadow-2xl"
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255,255,255,0.2)' }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Play Now</span>
          
          {/* Button Shine */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}