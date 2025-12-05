import React, { useState } from 'react';
import { Check, X, ArrowRight, Lightbulb } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, gameColor }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
  };

  const handleNext = () => {
    onAnswer(selected === question.correct_index);
    setSelected(null);
    setShowResult(false);
  };

  const isCorrect = selected === question.correct_index;

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-[var(--text-secondary)]">
            {questionNumber} / {totalQuestions}
          </span>
          <span className="text-sm text-[var(--text-muted)]">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} />
        </div>
      </div>

      {/* Question Type */}
      <div className="flex justify-center mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
          {question.type}
        </span>
      </div>

      {/* Question */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-white text-center leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrectOption = index === question.correct_index;
          
          let className = 'answer-option';
          if (showResult) {
            if (isCorrectOption) className += ' correct';
            else if (isSelected) className += ' incorrect animate-shake';
            else className += ' dimmed';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={`${className} w-full flex items-center gap-4 text-left`}
            >
              <span className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ 
                      background: showResult && isCorrectOption ? 'var(--accent-green)' : 
                                 showResult && isSelected && !isCorrectOption ? 'var(--accent-red)' : 
                                 'var(--bg-elevated)',
                      color: showResult && (isCorrectOption || isSelected) ? 'white' : 'var(--text-secondary)'
                    }}>
                {LETTERS[index]}
              </span>
              <span className="flex-1 font-medium text-white">{option}</span>
              {showResult && isCorrectOption && <Check className="w-6 h-6" style={{ color: 'var(--accent-green)' }} />}
              {showResult && isSelected && !isCorrectOption && <X className="w-6 h-6" style={{ color: 'var(--accent-red)' }} />}
            </button>
          );
        })}
      </div>

      {/* Result & Next */}
      {showResult && (
        <div className="space-y-4 animate-slide-up">
          <div className="card-elevated p-4" style={{ borderColor: isCorrect ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                   style={{ background: isCorrect ? 'rgba(88, 204, 2, 0.2)' : 'rgba(28, 176, 246, 0.2)' }}>
                <Lightbulb className="w-6 h-6" style={{ color: isCorrect ? 'var(--accent-green)' : 'var(--accent-blue)' }} />
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {isCorrect ? '🎉 Correct!' : '😅 Not quite!'}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">{question.explanation}</p>
              </div>
            </div>
          </div>

          <button onClick={handleNext} className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
            {questionNumber < totalQuestions ? 'Continue' : 'See Results'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}