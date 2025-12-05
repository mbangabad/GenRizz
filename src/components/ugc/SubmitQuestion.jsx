import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, X, Lightbulb, Check } from 'lucide-react';
import { UserSubmittedQuestion } from '@/api/entities';
import { GAMES } from '../constants/games';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SubmitQuestion({ userId, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    game_id: '',
    question: '',
    options: ['', '', '', ''],
    correct_index: 0,
    explanation: '',
    difficulty: 5,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await UserSubmittedQuestion.create({
        submitted_by: userId,
        game_id: form.game_id,
        question: form.question,
        options: form.options.filter(o => o.trim()),
        correct_index: form.correct_index,
        explanation: form.explanation,
        difficulty: form.difficulty,
        status: 'pending',
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setForm({
          game_id: '',
          question: '',
          options: ['', '', '', ''],
          correct_index: 0,
          explanation: '',
          difficulty: 5,
        });
        onSuccess?.();
      }, 2000);
    } catch (e) {
      console.error(e);
    }
    
    setLoading(false);
  };

  const updateOption = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
      >
        <Plus className="w-4 h-4" />
        Submit Question
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl my-8"
            >
              {submitted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Question Submitted!</h2>
                  <p className="text-gray-500 mt-2">We'll review it and add it if approved.</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900">Submit a Question</h2>
                        <p className="text-xs text-gray-500">Help grow our question bank!</p>
                      </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Game Selection */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Game Category</label>
                      <Select value={form.game_id} onValueChange={v => setForm({...form, game_id: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a game" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(GAMES).map(game => (
                            <SelectItem key={game.id} value={game.id}>
                              {game.icon} {game.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Question */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Question</label>
                      <Textarea
                        value={form.question}
                        onChange={e => setForm({...form, question: e.target.value})}
                        placeholder="What does 'slay' mean?"
                        className="min-h-20"
                        required
                      />
                    </div>

                    {/* Options */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Answer Options</label>
                      <div className="space-y-2">
                        {form.options.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setForm({...form, correct_index: idx})}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                form.correct_index === idx 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </button>
                            <Input
                              value={option}
                              onChange={e => updateOption(idx, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                              required={idx < 2}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Click letter to mark as correct answer</p>
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Explanation (optional)</label>
                      <Input
                        value={form.explanation}
                        onChange={e => setForm({...form, explanation: e.target.value})}
                        placeholder="Why is this the correct answer?"
                      />
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Difficulty (1-10)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={form.difficulty}
                          onChange={e => setForm({...form, difficulty: parseInt(e.target.value)})}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-bold text-gray-700">{form.difficulty}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !form.game_id || !form.question || form.options.filter(o => o).length < 2}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {loading ? 'Submitting...' : 'Submit Question'}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}