import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Shuffle, RotateCcw, HelpCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Helper to check if 4 items match a group
const checkGroup = (selectedItems, groups) => {
  for (const group of groups) {
    const groupItems = new Set(group.items);
    if (selectedItems.every(item => groupItems.has(item))) {
      return group;
    }
  }
  return null;
};

export default function ConnectionBoard({ puzzle, onComplete }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [solvedGroups, setSolvedGroups] = useState([]);
  const [mistakes, setMistakes] = useState(4);
  const [shaking, setShaking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (puzzle && puzzle.groups) {
      // Flatten and shuffle items without lodash
      const allItems = puzzle.groups.flatMap(g => g.items);
      setItems(allItems.sort(() => Math.random() - 0.5));
    }
  }, [puzzle]);

  const handleSelect = (item) => {
    if (isComplete || mistakes === 0) return;
    
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else if (selected.length < 4) {
      setSelected([...selected, item]);
    }
  };

  const handleSubmit = () => {
    if (selected.length !== 4) return;

    const group = checkGroup(selected, puzzle.groups);

    if (group) {
      // Success!
      const newSolved = [...solvedGroups, group];
      setSolvedGroups(newSolved);
      setItems(items.filter(item => !selected.includes(item)));
      setSelected([]);
      
      if (newSolved.length === 4) {
        setIsComplete(true);
        onComplete({ success: true, mistakesUsed: 4 - mistakes });
      }
    } else {
      // Failure
      setMistakes(prev => prev - 1);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error(mistakes === 1 ? "Game Over!" : "Not a group!");
      
      if (mistakes === 1) {
        // Show solution
        setIsComplete(true);
        setSolvedGroups(puzzle.groups);
        setItems([]);
        setSelected([]);
        onComplete({ success: false });
      }
    }
  };

  const handleShuffle = () => {
    setItems([...items].sort(() => Math.random() - 0.5));
  };

  const handleDeselect = () => {
    setSelected([]);
  };

  const difficultyColors = {
    0: 'bg-amber-100 border-amber-200 text-amber-900', // Yellow
    1: 'bg-emerald-100 border-emerald-200 text-emerald-900', // Green
    2: 'bg-indigo-100 border-indigo-200 text-indigo-900', // Blue
    3: 'bg-purple-100 border-purple-200 text-purple-900', // Purple
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">The Link-Up</h2>
        <p className="text-slate-500 font-medium">Group 4 items that share a vibe</p>
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i < mistakes ? 'bg-slate-800' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Solved Groups */}
        <div className="space-y-2">
          {solvedGroups.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "p-4 rounded-xl border text-center",
                difficultyColors[puzzle.groups.indexOf(group)] || 'bg-slate-100'
              )}
            >
              <h3 className="font-bold uppercase tracking-wide text-sm mb-1">{group.theme}</h3>
              <p className="text-sm font-medium opacity-80">{group.items.join(', ')}</p>
            </motion.div>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div 
              className={cn("grid grid-cols-4 gap-2", shaking && "animate-shake")}
              layout
            >
              {items.map((item) => {
                const isSelected = selected.includes(item);
                return (
                  <motion.button
                    layout
                    key={item}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "aspect-square rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center p-1 transition-all border",
                      isSelected 
                        ? "bg-slate-800 text-white border-slate-800 transform scale-95" 
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    {item}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {!isComplete && (
          <div className="flex gap-3 justify-center mt-8">
            <button 
              onClick={handleShuffle}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDeselect}
              disabled={selected.length === 0}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSubmit}
              disabled={selected.length !== 4}
              className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold shadow-sm hover:bg-black hover:shadow-md disabled:opacity-50 disabled:shadow-none transition-all"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}