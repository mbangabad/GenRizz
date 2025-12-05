import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Share2, Copy, Check } from 'lucide-react';
// AIRoast - already migrated to use InvokeLLM
import { GAMES, getTier } from '@/components/constants/games';

// Pre-generated roasts for instant display (fallback)
const FALLBACK_ROASTS = {
  high: [
    "You're suspiciously good at this. Do you have a burner account to practice?",
    "Main character energy detected. The algorithm fears you.",
    "Touch grass? You ARE the grass now.",
    "You understood the assignment. In fact, you wrote it.",
  ],
  medium: [
    "Not bad, not great. Like a 7/10 TikTok with no follow-up.",
    "You're giving 'I know some things' energy. Mid is the new main.",
    "The vibe is... adequate. Very 'participation trophy' of you.",
    "You're in the lukewarm zone. Not hot, not cold. Room temperature IQ.",
  ],
  low: [
    "Did you close your eyes? Honestly respect the confidence.",
    "The algorithm has removed you from recommendations.",
    "Your Gen Z card has been revoked. Please return your Air Forces.",
    "Even the 'I don't know' button would've done better.",
  ],
};

export default function AIRoast({ 
  gameId, 
  percentage, 
  wrongAnswers = [], 
  onShare 
}) {
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const game = GAMES[gameId];
  const tier = getTier(gameId, percentage);

  useEffect(() => {
    generateRoast();
  }, [gameId, percentage]);

  const generateRoast = async () => {
    setLoading(true);
    
    // Get fallback category
    const category = percentage >= 75 ? 'high' : percentage >= 40 ? 'medium' : 'low';
    const fallbackRoast = FALLBACK_ROASTS[category][Math.floor(Math.random() * FALLBACK_ROASTS[category].length)];
    
    // Try AI generation
    try {
      const prompt = `Generate a SHORT, funny, Gen-Z style roast (1-2 sentences max) for someone who scored ${percentage}% on a "${game?.title}" quiz. Their tier is "${tier.name}" (${tier.emoji}). Be playful and use internet slang. Don't be mean, be funny. ${wrongAnswers.length > 0 ? `They got these wrong: ${wrongAnswers.slice(0, 2).join(', ')}` : ''}`;
      
      const { InvokeLLM } = await import('@/api/integrations');
      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            roast: { type: "string" }
          }
        }
      });
      
      setRoast(result.roast || fallbackRoast);
    } catch (e) {
      setRoast(fallbackRoast);
    }
    
    setLoading(false);
  };

  const copyRoast = async () => {
    const text = `${tier.emoji} ${tier.name} (${percentage}%)\n\n"${roast}"\n\n- GenRizz AI`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoast = () => {
    const text = `Got roasted by GenRizz AI:\n\n${tier.emoji} ${tier.name} (${percentage}%)\n"${roast}"\n\nTry it yourself 👇`;
    
    if (navigator.share) {
      navigator.share({ title: 'GenRizz AI Roast', text });
    } else {
      copyRoast();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-3d card-3d-purple p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-[#CE82FF]" />
        <span className="font-black text-[#3C3C3C]">AI Roast</span>
        <span className="badge-3d badge-purple text-xs py-0.5 px-2">✨ NEW</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-4">
          <RefreshCw className="w-4 h-4 animate-spin text-[#CE82FF]" />
          <span className="text-[#777777] font-semibold">Generating roast...</span>
        </div>
      ) : (
        <>
          <p className="text-[#3C3C3C] font-semibold text-lg mb-4 leading-relaxed">
            "{roast}"
          </p>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateRoast}
              className="flex-1 btn-3d btn-3d-ghost py-2 flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              New Roast
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={copyRoast}
              className="flex-1 btn-3d btn-3d-ghost py-2 flex items-center justify-center gap-2 text-sm"
            >
              {copied ? <Check className="w-4 h-4 text-[#58CC02]" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareRoast}
              className="flex-1 btn-3d btn-3d-pink py-2 flex items-center justify-center gap-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
}