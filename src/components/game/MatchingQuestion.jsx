import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, X, ArrowRight } from 'lucide-react';

export default function MatchingQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  timedMode = true
}) {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [shuffledRight, setShuffledRight] = useState([]);

  useEffect(() => {
    setSelectedLeft(null);
    setMatches({});
    setShowResult(false);
    setTimeLeft(30);
    // Shuffle right side items
    const rightItems = [...question.pairs.map(p => p.right)].sort(() => Math.random() - 0.5);
    setShuffledRight(rightItems);
  }, [question]);

  useEffect(() => {
    if (!timedMode || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timedMode, showResult, question]);

  const handleLeftClick = (index) => {
    if (showResult) return;
    setSelectedLeft(selectedLeft === index ? null : index);
  };

  const handleRightClick = (rightItem) => {
    if (showResult || selectedLeft === null) return;
    
    // Check if this right item is already matched
    const existingMatch = Object.entries(matches).find(([_, v]) => v === rightItem);
    if (existingMatch) {
      // Remove existing match
      const newMatches = { ...matches };
      delete newMatches[existingMatch[0]];
      setMatches(newMatches);
    }
    
    setMatches({ ...matches, [selectedLeft]: rightItem });
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    setShowResult(true);
    
    // Calculate correct matches
    let correct = 0;
    question.pairs.forEach((pair, index) => {
      if (matches[index] === pair.right) {
        correct++;
      }
    });
    
    const percentage = (correct / question.pairs.length) * 100;
    const isCorrect = percentage >= 50; // At least half correct
    
    setTimeout(() => onAnswer(isCorrect, timeLeft, { correct, total: question.pairs.length }), 1500);
  };

  const isAllMatched = Object.keys(matches).length === question.pairs.length;
  const matchedRightItems = Object.values(matches);

  const getMatchResult = (leftIndex) => {
    if (!showResult) return null;
    const userMatch = matches[leftIndex];
    const correctMatch = question.pairs[leftIndex].right;
    return userMatch === correctMatch;
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
            timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
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
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
        />
      </div>

      {/* Question */}
      <h2 className="text-lg font-bold text-gray-800 text-center">
        {question.question || "Match the items"}
      </h2>

      {/* Matching Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2">
          {question.pairs.map((pair, index) => {
            const isMatched = matches[index] !== undefined;
            const isSelected = selectedLeft === index;
            const result = getMatchResult(index);
            
            return (
              <motion.button
                key={`left-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleLeftClick(index)}
                disabled={showResult}
                className={`w-full p-3 rounded-xl border-2 text-left font-medium transition-all ${
                  showResult
                    ? result === true
                      ? 'border-green-500 bg-green-50'
                      : result === false
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                    : isSelected
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                      : isMatched
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {showResult && (
                    result === true 
                      ? <Check className="w-4 h-4 text-green-500" />
                      : result === false 
                        ? <X className="w-4 h-4 text-red-500" />
                        : null
                  )}
                  <span className="text-sm">{pair.left}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          {shuffledRight.map((item, index) => {
            const isMatched = matchedRightItems.includes(item);
            const matchedLeftIndex = Object.entries(matches).find(([_, v]) => v === item)?.[0];
            
            return (
              <motion.button
                key={`right-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleRightClick(item)}
                disabled={showResult || selectedLeft === null}
                className={`w-full p-3 rounded-xl border-2 text-left font-medium transition-all ${
                  showResult
                    ? 'border-gray-200'
                    : isMatched
                      ? 'border-indigo-300 bg-indigo-50'
                      : selectedLeft !== null
                        ? 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer'
                        : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isMatched && !showResult && (
                    <div className="w-5 h-5 rounded bg-indigo-500 text-white text-xs flex items-center justify-center font-bold">
                      {parseInt(matchedLeftIndex) + 1}
                    </div>
                  )}
                  <span className="text-sm">{item}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Matched pairs display */}
      {Object.keys(matches).length > 0 && !showResult && (
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Your matches:</p>
          <div className="space-y-1">
            {Object.entries(matches).map(([leftIdx, rightItem]) => (
              <div key={leftIdx} className="flex items-center gap-2 text-sm">
                <span className="text-gray-700">{question.pairs[leftIdx].left}</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <span className="text-indigo-600 font-medium">{rightItem}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      {!showResult && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!isAllMatched}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isAllMatched
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {isAllMatched ? 'Submit Matches' : `Match ${question.pairs.length - Object.keys(matches).length} more`}
        </motion.button>
      )}

      {/* Results */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 border-2 border-gray-100"
        >
          <p className="text-center font-bold text-gray-800">
            Correct answers:
          </p>
          <div className="space-y-1 mt-2">
            {question.pairs.map((pair, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-gray-700">{pair.left}</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <span className="text-green-600 font-medium">{pair.right}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}