import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { auth } from '@/api/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Users, Trophy, Zap } from 'lucide-react';

const GENERATIONS = [
  { id: 'gen-alpha', label: 'Gen Alpha', years: '2013+', emoji: '🧒', desc: 'iPad kids, Roblox, Skibidi' },
  { id: 'gen-z', label: 'Gen Z', years: '1997-2012', emoji: '💀', desc: 'TikTok, memes, no cap' },
  { id: 'millennial', label: 'Millennial', years: '1981-1996', emoji: '📼', desc: 'Y2K, MySpace, dial-up' },
  { id: 'gen-x', label: 'Gen X', years: '1965-1980', emoji: '🎸', desc: 'Latchkey kids, MTV' },
  { id: 'boomer', label: 'Boomer', years: '1946-1964', emoji: '📻', desc: 'Classic rock, newspapers' },
];

const STEPS = [
  {
    title: "Welcome to RIZZ",
    subtitle: "Level Up Your Social IQ",
    content: "welcome",
  },
  {
    title: "What's Your Generation?",
    subtitle: "Help us personalize your experience",
    content: "generation",
  },
  {
    title: "You're All Set!",
    subtitle: "Let's see what you've got",
    content: "ready",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selectedGen, setSelectedGen] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const user = await auth.me();
      if (user && selectedGen) {
        await auth.updateMe({ 
          generation: selectedGen,
          onboarded: true 
        });
      }
    } catch (e) {
      // User might not be logged in
    }
    window.location.href = createPageUrl('Home');
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Progress */}
      <div className="px-4 pt-6">
        <div className="max-w-md mx-auto flex gap-2">
          {STEPS.map((_, i) => (
            <div 
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-[#58CC02]' : 'bg-[#E8E4DF]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              {/* Step 1: Welcome */}
              {STEPS[step].content === 'welcome' && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center shadow-lg"
                    style={{ boxShadow: '0 6px 0 #3D8C02' }}
                  >
                    <span className="text-5xl">🔥</span>
                  </motion.div>
                  
                  <h1 className="text-4xl font-black text-[#3C3C3C] mb-4">{STEPS[step].title}</h1>
                  <p className="text-xl text-[#777777] mb-12">{STEPS[step].subtitle}</p>

                  <div className="grid grid-cols-3 gap-4 mb-12">
                    {[
                      { icon: Sparkles, label: "12 Games", color: '#CE82FF' },
                      { icon: Users, label: "All Ages", color: '#FF86D0' },
                      { icon: Trophy, label: "Compete", color: '#FFC800' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="card-3d p-4"
                      >
                        <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: item.color }} />
                        <p className="text-sm font-bold text-[#3C3C3C]">{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Step 2: Generation */}
              {STEPS[step].content === 'generation' && (
                <>
                  <h1 className="text-3xl font-black text-[#3C3C3C] mb-2">{STEPS[step].title}</h1>
                  <p className="text-[#777777] mb-8">{STEPS[step].subtitle}</p>

                  <div className="space-y-3">
                    {GENERATIONS.map((gen, i) => (
                      <motion.button
                        key={gen.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedGen(gen.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${
                          selectedGen === gen.id
                            ? 'border-[#58CC02] bg-[#58CC02]/10'
                            : 'border-[#E5E0DA] bg-white hover:border-[#D4CFC7]'
                        }`}
                      >
                        <span className="text-3xl">{gen.emoji}</span>
                        <div className="flex-1">
                          <div className="font-bold text-[#3C3C3C]">{gen.label}</div>
                          <div className="text-sm text-[#777777]">{gen.years} • {gen.desc}</div>
                        </div>
                        {selectedGen === gen.id && (
                          <div className="w-6 h-6 rounded-full bg-[#58CC02] flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 3: Ready */}
              {STEPS[step].content === 'ready' && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center shadow-lg"
                    style={{ boxShadow: '0 6px 0 #3D8C02' }}
                  >
                    <span className="text-6xl">✨</span>
                  </motion.div>
                  
                  <h1 className="text-4xl font-black text-[#3C3C3C] mb-4">{STEPS[step].title}</h1>
                  <p className="text-xl text-[#777777] mb-8">{STEPS[step].subtitle}</p>

                  {selectedGen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-3d p-6 mb-8"
                    >
                      <p className="text-[#777777] text-sm mb-2">Your generation</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl">
                          {GENERATIONS.find(g => g.id === selectedGen)?.emoji}
                        </span>
                        <span className="text-2xl font-bold text-[#3C3C3C]">
                          {GENERATIONS.find(g => g.id === selectedGen)?.label}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div className="card-3d card-3d-yellow p-4">
                    <Zap className="w-6 h-6 text-[#FFC800] mx-auto mb-2" />
                    <p className="text-sm text-[#3C3C3C] font-semibold">
                      You'll start with <strong>5 free games per day</strong>. 
                      Upgrade to Premium for unlimited play!
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pb-8">
        <div className="max-w-md mx-auto flex gap-4">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="btn-3d btn-3d-ghost px-6 py-4"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={nextStep}
            disabled={step === 1 && !selectedGen}
            className="flex-1 btn-3d btn-3d-lime py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {step === STEPS.length - 1 ? (
              loading ? 'Loading...' : "Let's Go!"
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}