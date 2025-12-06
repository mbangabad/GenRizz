import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
// Temporarily disabled to fix React hooks error
// import { toast } from 'sonner';
const toast = { error: () => {}, success: () => {}, info: () => {} };

export default function TimelineDraggable({ question, onAnswer }) {
  const [items, setItems] = useState(() => {
    return question.options.map((text, index) => ({
      id: `item-${index}`,
      text,
      originalIndex: index
    }));
  });
  
  const [submitted, setSubmitted] = useState(false);

  const moveItem = (index, direction) => {
    if (submitted) return;
    const newItems = [...items];
    const targetIndex = index + direction;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    
    setItems(newItems);
  };

  const handleSubmit = () => {
    const currentOrder = items.map(i => i.text);
    const correctOrder = question.correct_order;
    
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    setSubmitted(true);

    if (correct) {
      toast.success("Correct Sequence!");
      setTimeout(() => onAnswer(true), 1500);
    } else {
      toast.error("Incorrect Order!");
      setTimeout(() => onAnswer(false), 1500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">{question.question}</h2>
        <p className="text-slate-500 text-sm font-medium">Use arrows to order chronologically</p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          let statusClass = "border-slate-200";
          if (submitted) {
              const correctText = question.correct_order[index];
              statusClass = item.text === correctText 
                ? "border-emerald-500 bg-emerald-50 text-emerald-900" 
                : "border-red-500 bg-red-50 text-red-900";
          }

          return (
            <motion.div
              layout
              key={item.id}
              className={cn(
                "flex items-center gap-3 p-4 bg-white rounded-xl border shadow-sm",
                statusClass
              )}
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-400 shrink-0 border border-slate-200">
                {index + 1}
              </div>
              <div className="flex-1 font-medium text-slate-900 text-sm">
                {item.text}
              </div>
              
              {!submitted && (
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full mt-8 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-md hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          Check Order
        </button>
      )}
    </div>
  );
}