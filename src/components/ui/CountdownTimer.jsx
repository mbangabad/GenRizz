import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      
      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }) => (
    <div className="text-center">
      <motion.div 
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-lg font-black text-white"
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <div className="text-[8px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );

  return (
    <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg px-2 py-1.5 border border-slate-700/50">
      <Clock className="w-3 h-3 text-slate-400 mr-1" />
      <TimeBlock value={timeLeft.hours} label="hr" />
      <span className="text-slate-600 font-bold">:</span>
      <TimeBlock value={timeLeft.minutes} label="min" />
      <span className="text-slate-600 font-bold">:</span>
      <TimeBlock value={timeLeft.seconds} label="sec" />
    </div>
  );
}