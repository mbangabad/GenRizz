import React, { useState, useEffect } from 'react';
import { auth } from '@/api/auth';
import { UserSubmittedQuestion } from '@/api/entities';
import { motion } from 'framer-motion';
import { 
  PenTool, CheckCircle, Clock, XCircle, ArrowLeft, Plus, 
  Image as ImageIcon, Trophy, Sparkles, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GAMES_LIST, GAMES } from '@/components/constants/games';
import Mascot from '@/components/ui/Mascot';

export default function CreatorStudio() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    game_id: '',
    question: '',
    options: ['', '', '', ''],
    correct_index: 0,
    explanation: '',
    difficulty: 5,
    image_url: ''
  });

  // Calculate Creator Stats
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const potentialXP = submissions.filter(s => s.status === 'pending').length * 50;
  const earnedXP = approvedCount * 100;
  const creatorLevel = Math.floor(earnedXP / 500) + 1;

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      UserSubmittedQuestion.filter({ submitted_by: user.id }).then(setSubmissions);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newSubmission = await UserSubmittedQuestion.create({
        submitted_by: user.id,
        game_id: formData.game_id,
        question: formData.question,
        options: formData.options,
        correct_index: parseInt(formData.correct_index),
        explanation: formData.explanation,
        difficulty: parseInt(formData.difficulty),
        status: 'pending'
      });

      setSubmissions([newSubmission, ...submissions]);
      setFormData({
        game_id: '',
        question: '',
        options: ['', '', '', ''],
        correct_index: 0,
        explanation: '',
        difficulty: 5
      });
      alert("Question submitted for review!");
    } catch (error) {
      console.error(error);
      alert("Failed to submit. Please check all fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateOption = (idx, val) => {
    const newOptions = [...formData.options];
    newOptions[idx] = val;
    setFormData({ ...formData, options: newOptions });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-[#58CC02]';
      case 'rejected': return 'text-[#FF4B4B]';
      default: return 'text-[#FFC800]';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      <header className="glass-light border-b border-[#E5E0DA] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E0DA] flex items-center justify-center hover:bg-[#F0EDE8] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#777777]" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-[#3C3C3C] text-lg">Creator Studio</h1>
            <p className="text-xs text-[#AFAFAF] font-semibold">Submit your own questions</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Creator Stats & Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Creator Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card-3d p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#AFAFAF] uppercase">Level</p>
                <p className="text-xl font-black text-[#3C3C3C]">{creatorLevel}</p>
              </div>
            </div>
            <div className="card-3d p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#AFAFAF] uppercase">Approved</p>
                <p className="text-xl font-black text-[#3C3C3C]">{approvedCount}</p>
              </div>
            </div>
            <div className="card-3d p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#AFAFAF] uppercase">Earned XP</p>
                <p className="text-xl font-black text-[#3C3C3C]">{earnedXP}</p>
              </div>
            </div>
          </div>

          {/* Incentive Banner */}
          <div className="bg-gradient-to-r from-[#58CC02] to-[#46A302] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black mb-1">Become a Certified Creator!</h3>
                <p className="font-medium opacity-90">Get <span className="font-black text-yellow-300">+100 XP</span> for every approved question.</p>
              </div>
              <Mascot mood="excited" size="sm" />
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* Editor Form */}
          <div className="card-3d p-6">
            <h2 className="text-xl font-black text-[#3C3C3C] mb-6 flex items-center gap-2">
              <PenTool className="w-5 h-5" /> Question Editor
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-[#777777] mb-2 block">Target Game</label>
                  <Select 
                    value={formData.game_id} 
                    onValueChange={(val) => setFormData({...formData, game_id: val})}
                  >
                    <SelectTrigger className="bg-white border-2 border-[#E5E0DA] h-12 font-bold">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {GAMES_LIST.map(g => (
                        <SelectItem key={g.id} value={g.id}>
                          <span className="flex items-center gap-2">
                            <span className="text-xl">{g.icon}</span> {g.title}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-bold text-[#777777] mb-2 block">Image URL (Optional)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input 
                      value={formData.image_url}
                      onChange={e => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://..."
                      className="pl-10 bg-white border-2 border-[#E5E0DA] h-12"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-[#777777] mb-2 block">Question</label>
                <Textarea 
                  required
                  value={formData.question}
                  onChange={e => setFormData({...formData, question: e.target.value})}
                  placeholder="Type your question here..."
                  className="bg-white border-2 border-[#E5E0DA] min-h-[100px] text-lg font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#777777] mb-3 block flex justify-between">
                  <span>Answer Options</span>
                  <span className="text-xs text-[#58CC02] bg-[#58CC02]/10 px-2 py-1 rounded-full">Select the correct answer</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      className={`relative p-1 rounded-xl transition-all ${
                        formData.correct_index === idx 
                          ? 'bg-[#58CC02] shadow-[0_4px_0_#46A302]' 
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="relative">
                        <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center z-10 cursor-pointer ${
                           formData.correct_index === idx ? 'text-[#58CC02]' : 'text-gray-400 hover:text-[#58CC02]'
                        }`}
                        onClick={() => setFormData({...formData, correct_index: idx})}
                        >
                          {formData.correct_index === idx ? (
                            <CheckCircle className="w-6 h-6 fill-current" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-current" />
                          )}
                        </div>
                        <Input 
                          required
                          value={formData.options[idx]}
                          onChange={e => updateOption(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          className={`pl-12 h-14 border-2 font-bold ${
                            formData.correct_index === idx 
                              ? 'border-[#58CC02] bg-green-50' 
                              : 'border-[#E5E0DA] bg-white focus:border-[#1CB0F6]'
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-[#777777] mb-2 block">Did you know? (Explanation)</label>
                <Input 
                  value={formData.explanation}
                  onChange={e => setFormData({...formData, explanation: e.target.value})}
                  placeholder="Add a fun fact or explanation..."
                  className="bg-white border-2 border-[#E5E0DA] h-12"
                />
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Preview & History */}
        <div className="space-y-6">
          
          {/* Live Preview */}
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-[#3C3C3C]" />
              <h3 className="font-black text-[#3C3C3C]">Live Preview</h3>
            </div>

            <div className="card-3d p-5 bg-[#FAF8F5] border-4 border-[#E5E0DA]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-[#AFAFAF]">1 / 10</span>
                <span className="badge-3d badge-blue text-xs">Preview</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                <div className="h-full w-1/3 bg-[#58CC02]" />
              </div>

              <div className="card-3d bg-white p-4 mb-4 min-h-[100px] flex items-center justify-center">
                {formData.image_url ? (
                  <img src={formData.image_url} className="w-full h-32 object-cover rounded-lg" alt="Question" />
                ) : (
                  <h3 className="text-lg font-black text-[#3C3C3C] text-center">
                    {formData.question || "Your question will appear here..."}
                  </h3>
                )}
              </div>

              <div className="space-y-2">
                {formData.options.map((opt, i) => (
                  <div key={i} className={`p-3 rounded-xl border-2 font-bold text-sm flex items-center gap-3 ${
                    formData.correct_index === i 
                      ? 'bg-green-100 border-green-500 text-green-700' 
                      : 'bg-white border-[#E5E0DA] text-[#777777]'
                  }`}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs border-2 ${
                      formData.correct_index === i ? 'border-green-500 bg-green-500 text-white' : 'border-[#E5E0DA]'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    {opt || `Option ${i + 1}`}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.question || !formData.game_id}
              className="btn-3d btn-3d-lime w-full py-4 text-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'PUBLISHING...' : 'PUBLISH QUESTION'}
            </button>
          </div>

          {/* Submission History */}
        <div className="mt-8">
          <h3 className="font-black text-[#3C3C3C] mb-4 flex items-center justify-between">
            <span>Recent Activity</span>
            <span className="text-xs text-[#AFAFAF] bg-white px-2 py-1 rounded-lg border border-[#E5E0DA]">{submissions.length} total</span>
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {submissions.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-[#E5E0DA]">
                <p className="text-[#AFAFAF] font-bold">No submissions yet.</p>
                <p className="text-sm text-[#D4CFC7]">Start creating to earn XP!</p>
              </div>
            ) : (
              submissions.map(sub => (
                <div key={sub.id} className="bg-white rounded-xl p-3 border-2 border-[#E5E0DA] hover:border-[#1CB0F6] transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      sub.status === 'approved' ? 'bg-green-100 text-green-600' :
                      sub.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="text-[10px] text-[#AFAFAF] font-bold">{sub.game_id}</span>
                  </div>
                  <p className="font-bold text-[#3C3C3C] text-sm line-clamp-2 mb-2">{sub.question}</p>
                  <div className="flex items-center gap-2 text-xs text-[#777777]">
                     <Clock className="w-3 h-3" />
                     <span>{new Date(sub.created_date || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        </div>
      </main>
    </div>
  );
}