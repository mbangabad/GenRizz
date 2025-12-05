import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WouldYouRather({ question, questionNumber, totalQuestions, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    
    // After showing results, continue
    setTimeout(() => {
      if (question.correct_index !== undefined) {
        onAnswer(index === question.correct_index, 0);
      } else {
        // Opinion mode: check if majority
        const crowdPct = getCrowdPercentage(index);
        onAnswer({ 
          selected: index, 
          weight: question.options[index].weight || 0,
          matchesCrowd: crowdPct >= 50 
        });
      }
    }, 2000);
  };

  // Simulated crowd data (would come from real aggregated data)
  const getCrowdPercentage = (index) => {
    if (!showResult) return 0;
    // Simulate: option with higher weight gets slightly more votes
    const baseA = 45 + Math.random() * 10;
    const baseB = 100 - baseA;
    return index === 0 ? Math.round(baseA) : Math.round(baseB);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-[#777777]">{questionNumber} / {totalQuestions}</span>
        <span className="badge-3d badge-pink">
          <span>🤔</span>
          <span>Would You Rather</span>
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
        className="card-3d p-6 text-center"
      >
        <span className="text-4xl mb-4 block">🤔</span>
        <h2 className="text-xl font-black text-[#3C3C3C]">Would You Rather...</h2>
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const percentage = getCrowdPercentage(index);
          
          return (
            <motion.button
              key={index}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={`relative overflow-hidden card-3d p-5 text-left transition-all ${
                isSelected ? 'border-[#58CC02] ring-2 ring-[#58CC02]/30' : ''
              } ${showResult && !isSelected ? 'opacity-60' : ''}`}
            >
              {/* Background fill for percentage */}
              {showResult && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`absolute inset-y-0 left-0 ${
                    isSelected ? 'bg-[#58CC02]/20' : 'bg-[#E5E0DA]/50'
                  }`}
                />
              )}
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{index === 0 ? '🅰️' : '🅱️'}</span>
                  <span className="font-bold text-[#3C3C3C]">{option.text}</span>
                </div>
                
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-lg font-black text-[#3C3C3C]">{percentage}%</span>
                    {isSelected && <span className="text-xl">✓</span>}
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Result message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card-3d card-3d-green p-4 text-center"
          >
            <p className="font-bold text-[#3C3C3C]">
              {getCrowdPercentage(selected) > 50 
                ? "You're with the majority! 🎉" 
                : "Bold choice! You're in the minority 💪"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}