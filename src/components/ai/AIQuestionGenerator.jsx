import React, { useState } from 'react';
import { InvokeLLM } from '@/api/integrations';
import { Question } from '@/api/entities';
import { motion } from 'framer-motion';
import { Sparkles, Check, X, RefreshCw, Loader2 } from 'lucide-react';
import { GAMES_LIST } from '@/components/constants/games';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function AIQuestionGenerator() {
  const [gameId, setGameId] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState(null);

  const handleGenerate = async () => {
    if (!gameId) return;
    setIsGenerating(true);
    setGeneratedQuestion(null);

    const game = GAMES_LIST.find(g => g.id === gameId);
    
    try {
      const prompt = `
        Generate a single trivia question for the game "${game.title}" (${game.description}).
        ${topic ? `Focus on the topic: "${topic}".` : ''}
        
        Return ONLY a valid JSON object with this schema:
        {
          "question": "The question text",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correct_index": 0, // index of correct option (0-3)
          "explanation": "Short explanation of why it is correct",
          "difficulty": 5 // number 1-10
        }
      `;

      const res = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            question: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correct_index: { type: "number" },
            explanation: { type: "string" },
            difficulty: { type: "number" }
          }
        }
      });

      setGeneratedQuestion(res);
    } catch (error) {
      console.error("AI Generation Failed", error);
      alert("Failed to generate question. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedQuestion) return;
    
    try {
      await Question.create({
        game_id: gameId,
        difficulty: generatedQuestion.difficulty || 5,
        type: 'mcq',
        question: generatedQuestion.question,
        options: generatedQuestion.options,
        correct_index: generatedQuestion.correct_index,
        explanation: generatedQuestion.explanation,
        times_shown: 0,
        times_correct: 0
      });
      
      alert("Question Saved!");
      setGeneratedQuestion(null);
      setTopic('');
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save question.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-3d p-6 bg-gradient-to-br from-[#CE82FF]/10 to-[#A855F7]/10 border-[#CE82FF]/30">
        <h2 className="text-xl font-black text-[#3C3C3C] mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#CE82FF]" /> AI Generator
        </h2>

        <div className="grid gap-4 mb-4">
          <Select value={gameId} onValueChange={setGameId}>
            <SelectTrigger className="bg-white border-2 border-[#E5E0DA]">
              <SelectValue placeholder="Select Game" />
            </SelectTrigger>
            <SelectContent>
              {GAMES_LIST.map(g => (
                <SelectItem key={g.id} value={g.id}>{g.icon} {g.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input 
            placeholder="Specific Topic (Optional, e.g. '90s Cartoons')"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="bg-white border-2 border-[#E5E0DA]"
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !gameId}
          className="btn-3d btn-3d-purple w-full py-3 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Generate Question
            </>
          )}
        </button>
      </div>

      {generatedQuestion && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d p-6 border-2 border-[#CE82FF]"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold bg-[#CE82FF]/10 text-[#CE82FF] px-2 py-1 rounded">Preview</span>
            <button onClick={() => setGeneratedQuestion(null)} className="text-[#AFAFAF] hover:text-[#FF4B4B]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="font-bold text-lg text-[#3C3C3C] mb-4">{generatedQuestion.question}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {generatedQuestion.options?.map((opt, i) => (
              <div 
                key={i}
                className={`p-3 rounded-xl border-2 ${
                  i === generatedQuestion.correct_index 
                    ? 'bg-[#58CC02]/10 border-[#58CC02] text-[#58CC02] font-bold'
                    : 'border-[#E5E0DA] text-[#777777]'
                }`}
              >
                {opt}
              </div>
            ))}
          </div>

          <p className="text-sm text-[#777777] mb-6 italic">
            💡 {generatedQuestion.explanation}
          </p>

          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              className="flex-1 btn-3d btn-3d-green py-3 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Save to Database
            </button>
            <button 
              onClick={handleGenerate}
              className="btn-3d btn-3d-ghost px-4 py-3"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}