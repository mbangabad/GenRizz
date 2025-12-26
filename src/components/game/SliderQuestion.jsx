import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SliderQuestion({ question, questionNumber, totalQuestions, onAnswer }) {
  const [value, setValue] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    setShowResult(true);
    
    setTimeout(() => {
      // Check if close to crowd average (within 15)
      const isClose = Math.abs(value - crowdAverage) <= 15;
      onAnswer({ 
        value, 
        weight: question.getWeight ? question.getWeight(value) : value,
        matchesCrowd: isClose
      });
    }, 2000);
  };

  // Simulated average (would come from real data)
  const crowdAverage = 45 + Math.random() * 20;
  
  // Get label for current position
  const getPositionLabel = () => {
    if (value <= 20) return question.labels?.low || 'Strongly Disagree';
    if (value <= 40) return question.labels?.lowMid || 'Disagree';
    if (value <= 60) return question.labels?.mid || 'Neutral';
    if (value <= 80) return question.labels?.highMid || 'Agree';
    return question.labels?.high || 'Strongly Agree';
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-[var(--text-secondary)]">{questionNumber} / {totalQuestions}</span>
        <span className="badge-3d badge-blue">
          <span>📊</span>
          <span>Rate It</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-3d">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          className="progress-fill-green"
        />
      </div>

      {/* Question */}
      <motion.div
        key={question.question}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-3d p-6"
      >
        <h2 className="text-xl font-black text-[var(--text-primary)] text-center leading-relaxed">
          {question.question}
        </h2>
      </motion.div>

      {/* Slider Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-3d p-6 space-y-6"
      >
        {/* Current Value Display */}
        <div className="text-center">
          <motion.div
            key={value}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-5xl font-black text-gradient-green"
          >
            {value}
          </motion.div>
          <p className="text-[var(--text-secondary)] font-bold mt-2">{getPositionLabel()}</p>
        </div>

        {/* Slider */}
        <div className="relative px-2">
          {/* Track */}
          <div className="h-4 bg-[var(--surface-3)] rounded-full relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green-hover)] rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          
          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            disabled={submitted}
            className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {/* Thumb */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-4 border-[var(--brand-green)] shadow-lg pointer-events-none"
            style={{ left: `calc(${value}% - 16px)` }}
            whileHover={{ scale: 1.1 }}
          />

          {/* Crowd average marker (shown after submit) */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 flex flex-col items-center pointer-events-none"
              style={{ left: `calc(${crowdAverage}% - 20px)` }}
            >
              <div className="w-0.5 h-4 bg-[var(--brand-pink)]" />
              <span className="text-xs font-bold text-[var(--brand-pink)] whitespace-nowrap">Avg: {Math.round(crowdAverage)}</span>
            </motion.div>
          )}
        </div>

        {/* Labels */}
        <div className="flex justify-between text-sm font-bold text-[var(--text-muted)]">
          <span>{question.minLabel || '0'}</span>
          <span>{question.maxLabel || '100'}</span>
        </div>
      </motion.div>

      {/* Submit Button / Result */}
      {!submitted ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="btn-3d btn-3d-lime w-full py-4 text-lg"
        >
          LOCK IT IN 🔒
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-3d card-3d-pink p-4 text-center"
          >
            <p className="font-bold text-[var(--text-primary)]">
              {Math.abs(value - crowdAverage) < 15
                ? "You're close to the crowd average! 🎯"
                : value > crowdAverage
                  ? "You rated higher than most! 📈"
                  : "You rated lower than most! 📉"}
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}