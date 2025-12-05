import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, Volume2, RotateCcw } from 'lucide-react';

export default function AudioQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  timedMode = true
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    setSelectedIndex(null);
    setShowResult(false);
    setTimeLeft(20);
    setIsPlaying(false);
    setPlayCount(0);
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

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        if (!isPlaying) setPlayCount(prev => prev + 1);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setPlayCount(prev => prev + 1);
    }
  };

  const handleSelect = (index) => {
    if (showResult) return;
    setSelectedIndex(index);
    setShowResult(true);
    if (audioRef.current) audioRef.current.pause();
    const isCorrect = index === question.correct_index;
    setTimeout(() => onAnswer(isCorrect, timeLeft), 1200);
  };

  const maxPlays = 3;
  const canPlay = playCount < maxPlays;

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
          className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
        />
      </div>

      {/* Audio Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white"
      >
        <audio ref={audioRef} src={question.audio_url} onEnded={handleAudioEnd} />
        
        <div className="flex items-center justify-center gap-4">
          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            disabled={!canPlay && !isPlaying}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              canPlay || isPlaying ? 'bg-white text-green-600' : 'bg-white/30 text-white/50'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </motion.button>

          {/* Restart Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={restartAudio}
            disabled={!canPlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              canPlay ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Play Counter */}
        <div className="text-center mt-4">
          <p className="text-white/80 text-sm">
            {canPlay ? `${maxPlays - playCount} plays remaining` : 'No plays left!'}
          </p>
        </div>

        {/* Visualizer Fake */}
        <div className="flex items-end justify-center gap-1 mt-4 h-8">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? {
                height: [8, 20 + Math.random() * 12, 8],
              } : { height: 8 }}
              transition={{
                duration: 0.4,
                repeat: isPlaying ? Infinity : 0,
                delay: i * 0.05,
              }}
              className="w-1 bg-white/60 rounded-full"
            />
          ))}
        </div>
      </motion.div>

      {/* Question Text */}
      <h2 className="text-xl font-bold text-gray-800 text-center">
        {question.question}
      </h2>

      {/* Options */}
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
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-teal-300'
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
    </div>
  );
}