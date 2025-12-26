import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// Lighthearted, fun scenarios for Vibe Check
export default function ScenarioSwipe({ question, questionNumber, totalQuestions, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const greenOpacity = useTransform(x, [0, 100], [0, 1]);
  const redOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleSwipe = (direction) => {
    if (showResult) return;
    
    const choice = direction === 'right' ? 'green' : 'red';
    setSelected(choice);
    setShowResult(true);
    
    setTimeout(() => {
      // If quiz mode (has correct_choice), return boolean
      if (question.correct_choice) {
        onAnswer(choice === question.correct_choice, 0);
      } else {
        // Opinion mode
        onAnswer({ 
          choice, 
          matchesCrowd: choice === targetChoice, 
          weight: choice === 'green' ? 1 : 0 
        });
      }
    }, 1800);
  };

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  // Use correct choice if provided (for quiz/EQ), otherwise crowd consensus
  const targetChoice = question.correct_choice || (Math.random() > 0.5 ? 'green' : 'red');
  const crowdPercentage = 50 + Math.floor(Math.random() * 40);

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>{questionNumber} / {totalQuestions}</span>
        <span className="badge-3d badge-green">
          <span>✨</span>
          <span>Vibe Check</span>
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

      {/* Swipe Instructions */}
      {!showResult && (
        <div className="flex justify-between text-sm font-bold px-4">
          <span style={{ color: 'var(--brand-red)' }}>← 🚩 Red Flag</span>
          <span style={{ color: 'var(--brand-green)' }}>Green Flag 🟢 →</span>
        </div>
      )}

      {/* Scenario Card */}
      <div className="relative h-80 flex items-center justify-center">
        {/* Background indicators */}
        <motion.div 
          className="absolute inset-0 rounded-2xl flex items-center justify-start pl-8"
          style={{ backgroundColor: 'var(--brand-red)/20' }}
          style={{ opacity: redOpacity }}
        >
          <span className="text-6xl">🚩</span>
        </motion.div>
        <motion.div 
          className="absolute inset-0 rounded-2xl flex items-center justify-end pr-8"
          style={{ backgroundColor: 'var(--brand-green)/20' }}
          style={{ opacity: greenOpacity }}
        >
          <span className="text-6xl">🟢</span>
        </motion.div>

        {/* Main Card */}
        <motion.div
          drag={!showResult ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          style={{ x, rotate }}
          animate={showResult ? { 
            x: selected === 'green' ? 300 : -300,
            opacity: 0,
            transition: { duration: 0.3 }
          } : {}}
          className="absolute card-3d p-6 w-full max-w-sm cursor-grab active:cursor-grabbing"
        >
          <div className="text-center space-y-4">
            <span className="text-5xl block">{question.emoji || '🤔'}</span>
            <h3 className="text-lg font-black leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {question.scenario}
            </h3>
            {question.context && (
              <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{question.context}</p>
            )}
          </div>
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute card-3d p-6 w-full max-w-sm text-center"
            >
              <span className="text-5xl block mb-4">
                {question.correct_choice 
                  ? (selected === targetChoice ? '✅' : '❌')
                  : (selected === targetChoice ? '🎯' : '🤷')
                }
              </span>
              <p className="font-black text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                You said: {selected === 'green' ? '🟢 Green Flag' : '🚩 Red Flag'}
              </p>
              <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {question.correct_choice 
                  ? (selected === targetChoice ? 'Correct! High EQ 🧠' : 'Oops! Low EQ 📉')
                  : `${crowdPercentage}% said ${targetChoice === 'green' ? '🟢 Green' : '🚩 Red'}`
                }
              </p>
              {question.roast && (
                <p className="text-sm mt-3 italic" style={{ color: 'var(--text-muted)' }}>"{question.roast}"</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button alternatives for accessibility */}
      {!showResult && (
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSwipe('left')}
            className="btn-3d btn-3d-red py-4"
          >
            🚩 Red Flag
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSwipe('right')}
            className="btn-3d btn-3d-lime py-4"
          >
            🟢 Green Flag
          </motion.button>
        </div>
      )}
    </div>
  );
}
