import React, { useState } from 'react';
import { Question } from '@/api/entities';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Loader2, Plus, Trash2, Save, RefreshCw, 
  Sliders, Zap, Copy, CheckCircle, Edit3, Wand2, 
  Layers, Hash, Command
} from 'lucide-react';
import { GAMES_LIST } from '@/components/constants/games';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const RECIPES = [
  { id: 'viral', name: 'Viral Trivia', tone: 'funny', difficulty: 'medium', description: 'Engaging, shareable questions with a humorous twist.' },
  { id: 'deep', name: 'Deep Dive', tone: 'educational', difficulty: 'hard', description: 'Complex questions for serious players.' },
  { id: 'genz', name: 'Gen Z Slang', tone: 'genz', difficulty: 'mixed', description: 'Content tailored for the younger demographic.' },
];

export default function ContentEngine() {
  const [config, setConfig] = useState({
    gameId: '',
    topic: '',
    count: 3,
    difficulty: 'mixed', 
    tone: 'standard', 
    includeImagePrompt: false
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeRecipe, setActiveRecipe] = useState(null);

  const applyRecipe = (recipe) => {
    setActiveRecipe(recipe.id);
    setConfig(prev => ({
      ...prev,
      tone: recipe.tone,
      difficulty: recipe.difficulty
    }));
  };

  const handleGenerate = async () => {
    if (!config.gameId) return;
    setIsGenerating(true);

    const game = GAMES_LIST.find(g => g.id === config.gameId);
    const count = Math.min(config.count, 5); 

    try {
      const prompt = `
        ACT AS A PROFESSIONAL GAME DESIGNER.
        Generate ${count} high-quality, engaging trivia questions for the game "${game.title}" (${game.description}).
        
        PARAMETERS:
        - Topic Focus: "${config.topic || 'General knowledge within category'}"
        - Tone: ${config.tone} (e.g. if 'genz', use slang/internet culture; if 'funny', make it roast-y/humorous; if 'educational', focus on facts)
        - Difficulty: ${config.difficulty}

        REQUIREMENTS:
        - Options must be plausible distractors.
        - Explanation must be interesting and "snackable" (under 140 chars).
        - Return valid JSON only.

        SCHEMA:
        {
          "questions": [
            {
              "question": "string",
              "options": ["string", "string", "string", "string"],
              "correct_index": number (0-3),
              "explanation": "string",
              "difficulty": number (1-10),
              "tags": ["string"]
            }
          ]
        }
      `;

      const { InvokeLLM } = await import('@/api/integrations');
      const res = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct_index: { type: "number" },
                  explanation: { type: "string" },
                  difficulty: { type: "number" },
                  tags: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      const newQuestions = (res.questions || []).map(q => ({
        ...q,
        id: Math.random().toString(36).substr(2, 9),
        selected: true
      }));

      setGeneratedContent([...newQuestions, ...generatedContent]);
    } catch (error) {
      console.error("Gen Failed", error);
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSelected = async () => {
    const toSave = generatedContent.filter(q => q.selected);
    if (toSave.length === 0) return;

    try {
      await Promise.all(toSave.map(q => 
        Question.create({
          game_id: config.gameId,
          difficulty: q.difficulty,
          type: 'mcq',
          question: q.question,
          options: q.options,
          correct_index: q.correct_index,
          explanation: q.explanation,
          times_shown: 0,
          times_correct: 0
        })
      ));
      
      setGeneratedContent(generatedContent.filter(q => !q.selected));
      alert(`Deployed ${toSave.length} assets to live environment.`);
    } catch (err) {
      console.error(err);
      alert("Deployment error");
    }
  };

  const updateQuestion = (id, field, value) => {
    setGeneratedContent(prev => prev.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (qId, optIdx, value) => {
    setGeneratedContent(prev => prev.map(q => {
      if (q.id !== qId) return q;
      const newOptions = [...q.options];
      newOptions[optIdx] = value;
      return { ...q, options: newOptions };
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Left Config Panel */}
      <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 h-full overflow-y-auto pr-2">
        
        {/* Engine Status */}
        <div className="bg-[#1E1E1E] p-4 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#CE82FF] to-[#A855F7] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Command className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg">Prompt Studio</h2>
              <p className="text-[10px] text-gray-400 font-mono">v2.4.0 • LLM CONNECTED</p>
            </div>
          </div>
          
          <div className="flex gap-2 mb-2">
            <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-full animate-pulse" />
            </div>
            <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
               <div className={`h-full bg-purple-500 transition-all duration-500 ${isGenerating ? 'w-full' : 'w-0'}`} />
            </div>
          </div>
          <p className="text-[10px] text-gray-500 font-mono text-right">{isGenerating ? 'GENERATING TOKENS...' : 'SYSTEM READY'}</p>
        </div>

        {/* Recipes */}
        <div className="card-3d p-4 bg-white">
          <h3 className="text-xs font-bold text-[#AFAFAF] uppercase mb-3 flex items-center gap-2">
            <Wand2 className="w-3 h-3" /> Quick Recipes
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {RECIPES.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => applyRecipe(recipe)}
                className={`p-3 rounded-xl text-left border-2 transition-all ${
                  activeRecipe === recipe.id 
                    ? 'border-[#CE82FF] bg-[#CE82FF]/5' 
                    : 'border-[#E5E0DA] hover:border-[#CE82FF]/50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold text-sm ${activeRecipe === recipe.id ? 'text-[#CE82FF]' : 'text-[#3C3C3C]'}`}>
                    {recipe.name}
                  </span>
                  {activeRecipe === recipe.id && <CheckCircle className="w-3 h-3 text-[#CE82FF]" />}
                </div>
                <p className="text-[10px] text-[#777777] leading-tight">{recipe.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Controls */}
        <div className="card-3d p-5 bg-white flex-1">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#AFAFAF] uppercase mb-1.5 block">Target Game</label>
              <Select value={config.gameId} onValueChange={v => setConfig({...config, gameId: v})}>
                <SelectTrigger className="bg-[#FAF8F5] border-2 border-[#E5E0DA] h-12 font-bold">
                  <SelectValue placeholder="Select Game..." />
                </SelectTrigger>
                <SelectContent>
                  {GAMES_LIST.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.icon} {g.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#AFAFAF] uppercase mb-1.5 block">Topic Focus</label>
              <Input 
                placeholder="e.g. '90s Hip Hop', 'Space'" 
                value={config.topic}
                onChange={e => setConfig({...config, topic: e.target.value})}
                className="bg-[#FAF8F5] border-2 border-[#E5E0DA] h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#AFAFAF] uppercase mb-1.5 block">Tone</label>
                <Select value={config.tone} onValueChange={v => setConfig({...config, tone: v})}>
                  <SelectTrigger className="bg-[#FAF8F5] border-2 border-[#E5E0DA] h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="funny">Funny / Roast</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="genz">Gen Z Slang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#AFAFAF] uppercase mb-1.5 block">Difficulty</label>
                <Select value={config.difficulty} onValueChange={v => setConfig({...config, difficulty: v})}>
                  <SelectTrigger className="bg-[#FAF8F5] border-2 border-[#E5E0DA] h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#AFAFAF] uppercase">Batch Size</label>
                <span className="text-xs font-black text-[#3C3C3C] bg-[#F0EDE8] px-2 py-0.5 rounded">{config.count}</span>
              </div>
              <Slider 
                value={[config.count]} 
                onValueChange={(v) => setConfig({...config, count: v[0]})} 
                min={1} max={5} step={1}
                className="py-2"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !config.gameId}
              className="btn-3d btn-3d-purple w-full py-3 text-sm font-black flex items-center justify-center gap-2 mt-4"
            >
              {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
              {isGenerating ? 'PROCESSING...' : 'RUN GENERATOR'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Output Panel */}
      <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-2xl border-2 border-[#E5E0DA] shadow-sm">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#CE82FF]" />
            <div>
              <h3 className="font-black text-[#3C3C3C]">Generated Assets</h3>
              <p className="text-xs text-[#AFAFAF] font-semibold">{generatedContent.length} items ready for review</p>
            </div>
          </div>
          {generatedContent.length > 0 && (
            <div className="flex gap-3">
              <button 
                onClick={() => setGeneratedContent([])}
                className="px-4 py-2 text-xs font-bold text-[#FF4B4B] hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear Workspace
              </button>
              <button 
                onClick={handleSaveSelected}
                className="btn-3d btn-3d-green px-5 py-2 text-xs flex items-center gap-2"
              >
                <Save className="w-3 h-3" /> 
                Deploy Selected ({generatedContent.filter(q => q.selected).length})
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-20 space-y-4">
          <AnimatePresence>
            {generatedContent.length === 0 && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center border-4 border-dashed border-[#E5E0DA] rounded-3xl bg-[#FAF8F5]"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Sparkles className="w-10 h-10 text-[#E5E0DA]" />
                </div>
                <h3 className="text-xl font-black text-[#AFAFAF] mb-2">Workspace Empty</h3>
                <p className="text-[#D4CFC7] max-w-xs">Configure generation parameters on the left to start creating content.</p>
              </motion.div>
            )}

            {generatedContent.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className={`card-3d p-5 bg-white group ${q.selected ? 'border-l-4 border-l-[#58CC02]' : 'opacity-60 border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={q.selected} 
                      onChange={e => updateQuestion(q.id, 'selected', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#58CC02] focus:ring-[#58CC02] cursor-pointer"
                    />
                    <span className="text-[10px] font-black bg-[#F0EDE8] px-2 py-1 rounded text-[#777777] uppercase tracking-wider">
                      Lvl {q.difficulty}
                    </span>
                    {q.tags?.map(tag => (
                      <span key={tag} className="text-[10px] font-bold bg-blue-50 text-blue-500 px-2 py-1 rounded">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingId(editingId === q.id ? null : q.id)}
                      className={`p-2 rounded-lg hover:bg-gray-100 ${editingId === q.id ? 'text-[#1CB0F6] bg-[#1CB0F6]/10' : 'text-[#AFAFAF]'}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setGeneratedContent(generatedContent.filter(item => item.id !== q.id))}
                      className="p-2 rounded-lg hover:bg-red-50 text-[#AFAFAF] hover:text-[#FF4B4B]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editingId === q.id ? (
                  <div className="space-y-4 pl-8">
                    <Input 
                      value={q.question} 
                      onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                      className="font-bold text-lg border-2 border-[#1CB0F6] bg-blue-50/30"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div 
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors ${idx === q.correct_index ? 'bg-[#58CC02] border-[#58CC02] text-white' : 'border-gray-300 text-gray-400'}`}
                            onClick={() => updateQuestion(q.id, 'correct_index', idx)}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <Input 
                            value={opt} 
                            onChange={e => updateOption(q.id, idx, e.target.value)}
                            className="h-10 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <Textarea 
                      value={q.explanation}
                      onChange={e => updateQuestion(q.id, 'explanation', e.target.value)}
                      className="text-sm min-h-[80px]"
                      placeholder="Explanation..."
                    />
                  </div>
                ) : (
                  <div className="pl-8">
                    <h3 className="font-bold text-[#3C3C3C] text-lg mb-3 leading-tight">{q.question}</h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className={`text-sm px-3 py-2.5 rounded-xl border-2 flex items-center gap-3 ${
                          idx === q.correct_index 
                            ? 'bg-[#58CC02]/10 border-[#58CC02] text-[#2B6601] font-bold' 
                            : 'border-[#E5E0DA] text-[#777777] bg-[#FAF8F5]'
                        }`}>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] border ${
                            idx === q.correct_index ? 'bg-[#58CC02] border-[#58CC02] text-white' : 'border-[#D4CFC7]'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#777777] bg-[#F7F4F0] p-2 rounded-lg inline-flex">
                      <Sparkles className="w-3 h-3 text-[#FFC800]" /> 
                      <span className="italic">{q.explanation}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}