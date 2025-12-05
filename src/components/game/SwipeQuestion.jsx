import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function SwipeQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  timedMode = true
}) {
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8);
  const [answered, setAnswered] = useState(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [1, 0.5, 1, 0.5, 1]);
  
  const rightIndicator = useTransform(x, [0, 100], [0, 1]);
  const leftIndicator = useTransform(x, [-100, 0], [1, 0]);

  useEffect(() => {
    setShowResult(false);
    setAnswered(null);
    setTimeLeft(8);
    x.set(0);
  }, [question]);

  useEffect(() => {
    if (!timedMode || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timedMode, showResult, question]);

  const handleAnswer = (userAnswer) => {
    if (showResult) return;
    setAnswered(userAnswer);
    setShowResult(true);
    
    // For true/false questions, correct_index 0 = True (swipe right), 1 = False (swipe left)
    const correctAnswer = question.correct_index === 0;
    const isCorrect = userAnswer === correctAnswer;
    
    setTimeout(() => onAnswer(isCorrect, timeLeft), 800);
  };

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > 100) {
      const swipedRight = info.offset.x > 0;
      handleAnswer(swipedRight);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          {questionNumber} / {totalQuestions}
        </span>
        {timedMode && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            timeLeft <= 3 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
        />
      </div>

      {/* Instructions */}
      <div className="flex justify-center gap-8 py-2">
        <div className="flex items-center gap-2 text-red-500">
          <ThumbsDown className="w-5 h-5" />
          <span className="text-sm font-medium">Swipe Left = False</span>
        </div>
        <div className="flex items-center gap-2 text-green-500">
          <ThumbsUp className="w-5 h-5" />
          <span className="text-sm font-medium">Swipe Right = True</span>
        </div>
      </div>

      {/* Swipeable Card */}
      <div className="relative h-72 flex items-center justify-center">
        {/* Left Indicator */}
        <motion.div
          style={{ opacity: leftIndicator }}
          className="absolute left-4 z-10 w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
        >
          <X className="w-8 h-8 text-white" />
        </motion.div>

        {/* Right Indicator */}
        <motion.div
          style={{ opacity: rightIndicator }}
          className="absolute right-4 z-10 w-16 h-16 rounded-full bg-green-500 flex items-center justify-center"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>

        <AnimatePresence>
          {!showResult && (
            <motion.div
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ 
                x: answered === true ? 300 : answered === false ? -300 : 0,
                opacity: 0,
                transition: { duration: 0.3 }
              }}
              className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                {question.image_url && (
                  <img 
                    src={question.image_url} 
                    alt="" 
                    className="w-full h-32 object-cover rounded-xl mb-4"
                  />
                )}
                <h2 className="text-xl font-bold text-gray-800 text-center leading-relaxed">
                  {question.question}
                </h2>
                {question.context && (
                  <p className="text-sm text-gray-500 text-center mt-3 italic">
                    "{question.context}"
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Feedback */}
        {showResult && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-sm rounded-3xl p-8 text-center ${
              answered === (question.correct_index === 0)
                ? 'bg-green-100 border-2 border-green-300'
                : 'bg-red-100 border-2 border-red-300'
            }`}
          >
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              answered === (question.correct_index === 0) ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {answered === (question.correct_index === 0) ? (
                <Check className="w-8 h-8 text-white" />
              ) : (
                <X className="w-8 h-8 text-white" />
              )}
            </div>
            <p className="font-bold text-lg text-gray-800">
              {answered === (question.correct_index === 0) ? 'Correct!' : 'Wrong!'}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              The answer was: <strong>{question.correct_index === 0 ? 'True' : 'False'}</strong>
            </p>
            {question.explanation && (
              <p className="text-sm text-gray-500 mt-2 italic">
                {question.explanation}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Tap Buttons (for accessibility) */}
      {!showResult && (
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(false)}
            className="flex-1 py-4 bg-red-100 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" /> False
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(true)}
            className="flex-1 py-4 bg-green-100 text-green-600 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" /> True
          </motion.button>
        </div>
      )}
    </div>
  );
}