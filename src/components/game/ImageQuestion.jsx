import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, X, ZoomIn } from 'lucide-react';

export default function ImageQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  timedMode = true
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setSelectedIndex(null);
    setShowResult(false);
    setTimeLeft(15);
  }, [question]);

  useEffect(() => {
    if (!timedMode || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSelect(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timedMode, showResult, question]);

  const handleSelect = (index) => {
    if (showResult) return;
    setSelectedIndex(index);
    setShowResult(true);
    const isCorrect = index === question.correct_index;
    setTimeout(() => onAnswer(isCorrect, timeLeft), 1200);
  };

  const getOptionStyle = (index) => {
    if (!showResult) {
      return selectedIndex === index
        ? 'ring-4 ring-purple-500 scale-105'
        : 'hover:scale-105 hover:ring-2 hover:ring-purple-300';
    }
    if (index === question.correct_index) return 'ring-4 ring-green-500 bg-green-50';
    if (selectedIndex === index) return 'ring-4 ring-red-500 bg-red-50';
    return 'opacity-50';
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
            timeLeft <= 5 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
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
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        />
      </div>

      {/* Main Media (Image or Video) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl overflow-hidden shadow-lg"
      >
        {question.media_type === 'video' || question.image_url?.endsWith('.mp4') ? (
          <video
            src={question.image_url}
            className="w-full h-48 md:h-64 object-cover"
            controls
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <>
            <img
              src={question.image_url}
              alt="Question"
              className="w-full h-48 md:h-64 object-cover cursor-pointer"
              onClick={() => setZoomed(true)}
            />
            <button
              onClick={() => setZoomed(true)}
              className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </>
        )}
      </motion.div>

      {/* Question Text */}
      <h2 className="text-xl font-bold text-gray-800 text-center">
        {question.question}
      </h2>

      {/* Image Options (2x2 grid) */}
      {question.option_images ? (
        <div className="grid grid-cols-2 gap-3">
          {question.option_images.map((imgUrl, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={`relative rounded-xl overflow-hidden transition-all ${getOptionStyle(index)}`}
            >
              <img src={imgUrl} alt={`Option ${index + 1}`} className="w-full h-24 object-cover" />
              {showResult && index === question.correct_index && (
                <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              )}
              {showResult && selectedIndex === index && index !== question.correct_index && (
                <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                  <X className="w-8 h-8 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      ) : (
        /* Text Options */
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${
                !showResult
                  ? selectedIndex === index
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                  : index === question.correct_index
                    ? 'border-green-500 bg-green-50'
                    : selectedIndex === index
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  showResult && index === question.correct_index ? 'bg-green-500 text-white' :
                  showResult && selectedIndex === index ? 'bg-red-500 text-white' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-gray-800">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Zoomed Image Modal */}
      {zoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <img src={question.image_url} alt="Zoomed" className="max-w-full max-h-full object-contain" />
        </motion.div>
      )}
    </div>
  );
}