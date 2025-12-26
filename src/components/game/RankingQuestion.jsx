import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

export default function RankingQuestion({ question, questionNumber, totalQuestions, onAnswer }) {
  const [items, setItems] = useState(
    question.items.map((item, i) => ({ ...item, id: i }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    setShowResult(true);
    
    // Calculate score based on how close to crowd ranking
    const userRanking = items.map(item => item.id);
    
    setTimeout(() => {
      const score = calculateMatchScore(userRanking);
      // If it's a quiz (has correct_order), return boolean isCorrect
      if (question.correct_order) {
        onAnswer(score === 100, 0);
      } else {
        // Opinion mode
        onAnswer({ 
          ranking: userRanking,
          weight: score,
          matchesCrowd: score >= 60 // Consider it a "match" if 60% similar
        });
      }
    }, 2500);
  };

  // Use correct order if provided (for quizzes), otherwise crowd ranking (for opinions)
  const targetRanking = question.correct_order || question.items.map((_, i) => i).sort(() => Math.random() - 0.5);

  const calculateMatchScore = (userRank) => {
    let matches = 0;
    userRank.forEach((id, pos) => {
      if (targetRanking[pos] === id) matches++;
    });
    return Math.round((matches / userRank.length) * 100);
  };

  // For quiz mode, we need to signal success/failure
  const isCorrect = calculateMatchScore(items.map(i => i.id)) === 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-[var(--text-secondary)]">{questionNumber} / {totalQuestions}</span>
        <span className="badge-3d badge-purple">
          <span>📊</span>
          <span>Rank It</span>
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
        className="card-3d p-5"
      >
        <h2 className="text-lg font-black text-[var(--text-primary)] text-center leading-relaxed">
          {question.question}
        </h2>
        {!submitted && (
          <p className="text-sm text-[var(--text-muted)] text-center mt-2 font-semibold">
            Drag to reorder • #{1} = {question.rankLabel || 'Most'}
          </p>
        )}
      </motion.div>

      {/* Ranking List */}
      <div className="space-y-2">
        {!submitted ? (
          <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
            {items.map((item, index) => (
              <Reorder.Item
                key={item.id}
                value={item}
                className="cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
                  className="card-3d p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-purple)] to-[var(--brand-purple-dark)] flex items-center justify-center text-white font-black">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-2xl mr-3">{item.emoji}</span>
                    <span className="font-bold text-[var(--text-primary)]">{item.text}</span>
                  </div>
                  <div className="text-[var(--text-muted)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => {
              const crowdPos = crowdRanking.indexOf(item.id);
              const isMatch = crowdPos === index;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card-3d p-4 flex items-center gap-4 ${
                    isMatch ? 'card-3d-green' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                    isMatch 
                      ? 'bg-[var(--brand-green)] text-white' 
                      : 'bg-[var(--surface-3)] text-[var(--text-secondary)]'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-2xl mr-3">{item.emoji}</span>
                    <span className="font-bold text-[var(--text-primary)]">{item.text}</span>
                  </div>
                  <div className="text-right">
                    {isMatch ? (
                      <span className="text-[var(--brand-green)] font-bold">✓ Match!</span>
                    ) : (
                      <span className="text-[var(--text-muted)] text-sm font-semibold">
                        Crowd: #{crowdPos + 1}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit / Result */}
      {!submitted ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="btn-3d btn-3d-lime w-full py-4 text-lg"
        >
          LOCK IN RANKING 🔒
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-3d card-3d-purple p-4 text-center"
          >
            <p className="text-3xl font-black text-[var(--brand-purple)] mb-2">
              {calculateMatchScore(items.map(i => i.id))}% Match
            </p>
            <p className="text-[var(--text-secondary)] font-semibold">
              {calculateMatchScore(items.map(i => i.id)) >= 60 
                ? "You think like the crowd! 🎯" 
                : "Your ranking is unique! 🦄"}
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}