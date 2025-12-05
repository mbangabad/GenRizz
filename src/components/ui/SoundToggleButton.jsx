import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

// Sound state persisted in localStorage
const getSoundEnabled = () => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('genrizz-sound');
  return stored === null ? true : stored === 'true';
};

let soundEnabled = getSoundEnabled();

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('genrizz-sound', String(soundEnabled));
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

export const playSound = (type) => {
  if (!soundEnabled) return;
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    switch (type) {
      case 'correct':
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.08);
        osc.frequency.setValueAtTime(784, now + 0.16);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
        
      case 'incorrect':
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
        
      case 'streak':
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1047, now + 0.08);
        osc.frequency.setValueAtTime(1319, now + 0.16);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
        
      case 'levelUp':
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554, now + 0.1);
        osc.frequency.setValueAtTime(659, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
        
      case 'click':
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
        
      case 'celebration':
        // Fanfare
        [523, 659, 784, 1047].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.setValueAtTime(freq, now + i * 0.12);
          g.gain.setValueAtTime(0.15, now + i * 0.12);
          g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.15);
          o.start(now + i * 0.12);
          o.stop(now + i * 0.12 + 0.15);
        });
        break;
    }
  } catch (e) {
    // Audio not supported
  }
};

export default function SoundToggleButton({ className = '' }) {
  const [enabled, setEnabled] = useState(soundEnabled);

  const handleToggle = () => {
    const newState = toggleSound();
    setEnabled(newState);
    if (newState) playSound('click');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        enabled 
          ? 'bg-[#58CC02]/20 text-[#58CC02]' 
          : 'bg-[#E8E4DF] text-[#AFAFAF]'
      } ${className}`}
      title={enabled ? 'Sound On' : 'Sound Off'}
    >
      {enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </motion.button>
  );
}