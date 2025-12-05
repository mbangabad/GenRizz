import React, { useRef, useEffect } from 'react';

// Sound effect URLs (using free sounds from public CDNs)
const SOUNDS = {
  correct: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1hZ2pvaW1sbm1tbWxsa2tqamlpaGhoZ2dnZmZmZWVlZGRkY2NjYmJiYWFhYGBgX19fXl5eXV1dXFxcW1tbWlpaWVlZWFhYV1dXVlZWVVVVVFRUU1NTUlJSUVFRUFBQT09PTk5OTU1NTExMS0tLSkpKSUlJSEhIR0dHRkZGRUVFREREQ0NDQkJCQUFBQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDw',
  incorrect: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1hZ2pvaW1sbm1tbWxsa2tqamlpaGhoZ2dnZmZmZWVlZGRkY2NjYmJiYWFhYGBgX19fXl5eXV1dXFxcW1tbWlpaWVlZWFhYV1dXVlZWVVVVVFRUU1NTUlJSUVFRUFBQT09PTk5OTU1NTExMS0tLSkpKSUlJSEhIR0dHRkZGRUVFREREQ0NDQkJCQUFBQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDw',
  levelUp: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1hZ2pvaW1sbm1tbWxsa2tqamlpaGhoZ2dnZmZmZWVlZGRkY2NjYmJiYWFhYGBgX19fXl5eXV1dXFxcW1tbWlpaWVlZWFhYV1dXVlZWVVVVVFRUU1NTUlJSUVFRUFBQT09PTk5OTU1NTExMS0tLSkpKSUlJSEhIR0dHRkZGRUVFREREQ0NDQkJCQUFBQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDw',
  click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1hZ2pvaW1sbm1tbWxsa2tqamlpaGhoZ2dnZmZmZWVlZGRkY2NjYmJiYWFhYGBgX19fXl5eXV1dXFxcW1tbWlpaWVlZWFhYV1dXVlZWVVVVVFRUU1NTUlJSUVFRUFBQT09PTk5OTU1NTExMS0tLSkpKSUlJSEhIR0dHRkZGRUVFREREQ0NDQkJCQUFBQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDw',
  streak: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1hZ2pvaW1sbm1tbWxsa2tqamlpaGhoZ2dnZmZmZWVlZGRkY2NjYmJiYWFhYGBgX19fXl5eXV1dXFxcW1tbWlpaWVlZWFhYV1dXVlZWVVVVVFRUU1NTUlJSUVFRUFBQT09PTk5OTU1NTExMS0tLSkpKSUlJSEhIR0dHRkZGRUVFREREQ0NDQkJCQUFBQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDw',
};

// Global sound enabled state
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

export const playSound = (soundName) => {
  if (!soundEnabled) return;
  
  try {
    const audio = new Audio();
    audio.volume = 0.3;
    
    // Use Web Audio API for better control
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Different frequencies for different sounds
      switch (soundName) {
        case 'correct':
          oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2); // G5
          gainNode.gain.setValueAtTime(0.3, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.3);
          break;
        case 'incorrect':
          oscillator.frequency.setValueAtTime(200, context.currentTime);
          oscillator.frequency.setValueAtTime(150, context.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.3, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.2);
          break;
        case 'levelUp':
          oscillator.frequency.setValueAtTime(440, context.currentTime);
          oscillator.frequency.setValueAtTime(554.37, context.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(880, context.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.3, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.5);
          break;
        case 'click':
          oscillator.frequency.setValueAtTime(800, context.currentTime);
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.05);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.05);
          break;
        case 'streak':
          oscillator.frequency.setValueAtTime(880, context.currentTime);
          oscillator.frequency.setValueAtTime(1046.50, context.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.2, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
          oscillator.start(context.currentTime);
          oscillator.stop(context.currentTime + 0.15);
          break;
        default:
          break;
      }
    }
  } catch (e) {
    // Audio not supported
    console.log('Audio not supported');
  }
};

// React hook for sound
export const useSound = () => {
  return {
    playCorrect: () => playSound('correct'),
    playIncorrect: () => playSound('incorrect'),
    playLevelUp: () => playSound('levelUp'),
    playClick: () => playSound('click'),
    playStreak: () => playSound('streak'),
    toggleSound,
    isSoundEnabled,
  };
};

// Sound toggle button component
export default function SoundToggle() {
  const [enabled, setEnabled] = React.useState(soundEnabled);

  const handleToggle = () => {
    const newState = toggleSound();
    setEnabled(newState);
    if (newState) playSound('click');
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-colors ${
        enabled ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-500'
      }`}
      title={enabled ? 'Sound On' : 'Sound Off'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}