import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Lightbulb, Clock, Zap } from 'lucide-react';
import Confetti from '@/components/ui/Confetti';
import ScreenShake from '@/components/ui/ScreenShake';
import FloatingXP from '@/components/ui/FloatingXP';
import StreakCounter from './StreakCounter';

const LETTERS = ['A', 'B', 'C', 'D'];
const TIME_PER_QUESTION = 15; // seconds
const AUTO_ADVANCE_DELAY = 1500; // ms after answer shown

export default function QuestionCardEnhanced({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  gameColor,
  timedMode = true,
  autoAdvance = true,
  streak = 0,
  onTimeBonus
}) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Reset state when question changes
  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setTimeLeft(TIME_PER_QUESTION);
    setShowConfetti(false);
    setShowXP(false);
  }, [question]);

  // Timer countdown
  useEffect(() => {
    if (!timedMode || showResult || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSelect(-1); // Time's up - wrong answer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timedMode, showResult, timeLeft]);

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);

    const isCorrect = index === question.correct_index;
    
    if (isCorrect) {
      setShowConfetti(true);
      // Calculate time bonus
      const timeBonus = Math.round((timeLeft / TIME_PER_QUESTION) * 10);
      const baseXP = 10;
      const streakMultiplier = streak >= 10 ? 2 : streak >= 7 ? 1.75 : streak >= 5 ? 1.5 : streak >= 3 ? 1.25 : 1;
      const totalXP = Math.round((baseXP + timeBonus) * streakMultiplier);
      setEarnedXP(totalXP);
      setShowXP(true);
      if (onTimeBonus) onTimeBonus(timeBonus);
    } else {
      setShakeKey(prev => prev + 1);
    }

    // Auto advance after delay
    if (autoAdvance) {
      setTimeout(() => {
        handleNext(isCorrect);
      }, AUTO_ADVANCE_DELAY);
    }
  };

  const handleNext = useCallback((wasCorrect) => {
    const isCorrect = wasCorrect !== undefined ? wasCorrect : selected === question.correct_index;
    onAnswer(isCorrect, timeLeft);
    setSelected(null);
    setShowResult(false);
  }, [selected, question, onAnswer, timeLeft]);

  const isCorrect = selected === question.correct_index;
  const timerColor = timeLeft <= 5 ? 'var(--brand-red)' : timeLeft <= 10 ? 'var(--brand-orange)' : 'var(--brand-green)';
  const timerPercentage = (timeLeft / TIME_PER_QUESTION) * 100;

  return (
    <>
      <Confetti trigger={showConfetti} />
      <FloatingXP show={showXP} amount={earnedXP} />
      
      <ScreenShake trigger={shakeKey} intensity={15}>
        <div className="max-w-lg mx-auto px-4">
          {/* Streak Counter */}
          <StreakCounter streak={streak} show={!showResult} />

          {/* Timer & Progress Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-white/50">
                {questionNumber} / {totalQuestions}
              </span>
              
              {timedMode && (
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-white/10"
                  animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
                >
                  <Clock className="w-4 h-4" style={{ color: timerColor }} />
                  <span className="font-bold" style={{ color: timerColor }}>{timeLeft}s</span>
                </motion.div>
              )}

              <span className="text-sm text-white/40">
                {Math.round((questionNumber / totalQuestions) * 100)}%
              </span>
            </div>

            {/* Progress bar with timer overlay */}
            <div className="relative h-3 bg-[var(--surface-2)] rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-orange-hover)] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
              {timedMode && (
                <motion.div 
                  className="absolute inset-y-0 right-0 rounded-full opacity-30"
                  style={{ 
                    background: timerColor,
                    width: `${timerPercentage}%`,
                  }}
                  animate={{ width: `${timerPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          </div>

          {/* Question Type Badge */}
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[var(--surface-2)] text-white/50 border border-white/10">
              {question.type}
            </span>
          </div>

          {/* Question Card */}
          <motion.div 
            className="card p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={question.id}
          >
            <h2 className="text-xl font-bold text-white text-center leading-relaxed">
              {question.question}
            </h2>
          </motion.div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            <AnimatePresence>
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrectOption = index === question.correct_index;
                
                let bgColor = 'var(--bg-card)';
                let borderColor = 'var(--border-color)';
                let shadow = '';
                
                if (showResult) {
                  if (isCorrectOption) {
                    bgColor = 'rgba(74, 222, 128, 0.15)';
                    borderColor = 'var(--brand-green)';
                    shadow = '0 0 20px rgba(74, 222, 128, 0.3)';
                  } else if (isSelected) {
                    bgColor = 'rgba(248, 113, 113, 0.15)';
                    borderColor = 'var(--brand-red)';
                    shadow = '0 0 20px rgba(248, 113, 113, 0.3)';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: showResult && !isCorrectOption && !isSelected ? 0.4 : 1, 
                      x: 0,
                      scale: showResult && isCorrectOption ? [1, 1.02, 1] : 1
                    }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(index)}
                    disabled={showResult}
                    className="w-full flex items-center gap-4 text-left p-4 rounded-2xl border-2 transition-all"
                    style={{ 
                      background: bgColor,
                      borderColor,
                      boxShadow: shadow,
                    }}
                    whileHover={!showResult ? { scale: 1.02, borderColor: gameColor } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                  >
                    <span 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all"
                      style={{ 
                        background: showResult && isCorrectOption ? 'var(--brand-green)' : 
                                   showResult && isSelected && !isCorrectOption ? 'var(--brand-red)' : 
                                   'var(--bg-elevated)',
                        color: showResult && (isCorrectOption || isSelected) ? 'white' : 'var(--text-secondary)'
                      }}
                    >
                      {LETTERS[index]}
                    </span>
                    <span className="flex-1 font-medium text-white">{option}</span>
                    {showResult && isCorrectOption && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <Check className="w-6 h-6 text-green-400" />
                      </motion.div>
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <X className="w-6 h-6 text-red-400" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Result & Next */}
          <AnimatePresence>
            {showResult && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div 
                  className="p-4 rounded-2xl border-2"
                  style={{ 
                    background: isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'rgba(0, 206, 209, 0.1)',
                    borderColor: isCorrect ? 'var(--brand-green)' : 'var(--brand-blue)'
                  }}
                >
                  <div className="flex gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: isCorrect ? 'rgba(74, 222, 128, 0.2)' : 'rgba(0, 206, 209, 0.2)' }}
                    >
                      <Lightbulb className="w-6 h-6" style={{ color: isCorrect ? 'var(--brand-green)' : 'var(--brand-blue)' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold" style={{ color: isCorrect ? 'var(--brand-green)' : 'var(--brand-red)' }}>
                          {isCorrect ? '🎉 Correct!' : '😅 Not quite!'}
                        </p>
                        {isCorrect && timeLeft > 10 && (
                          <span className="text-xs bg-[var(--brand-blue)]/20 text-[var(--brand-blue)] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Speed Bonus!
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50">{question.explanation}</p>
                    </div>
                  </div>
                </div>

                {!autoAdvance && (
                  <motion.button 
                    onClick={() => handleNext()}
                    className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {questionNumber < totalQuestions ? 'Continue' : 'See Results'}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}

                {autoAdvance && (
                  <div className="text-center text-sm text-white/40">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: AUTO_ADVANCE_DELAY / 1000, ease: 'linear' }}
                      className="h-1 bg-[var(--brand-orange)] rounded-full mx-auto mb-2"
                    />
                    Auto-advancing...
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScreenShake>
    </>
  );
}