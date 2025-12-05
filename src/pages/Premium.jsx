import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { auth } from '@/api/auth';
import { Subscription } from '@/api/entities';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Crown, Heart, Zap, Shield, Star, 
  Check, X, Sparkles, Gift, TrendingUp, Award
} from 'lucide-react';

const PREMIUM_FEATURES = [
  { icon: Heart, title: 'Unlimited Hearts', description: 'Play as much as you want, no waiting', free: '5/day', premium: 'Unlimited', highlight: true },
  { icon: Shield, title: 'Streak Shields', description: 'Protect your streak when life gets busy', free: '0', premium: '3/month' },
  { icon: Zap, title: 'Bonus XP', description: 'Earn 2x XP on every game', free: '1x', premium: '2x' },
  { icon: Sparkles, title: 'Exclusive Games', description: 'Access 3 premium-only games', free: '❌', premium: '3 games', highlight: true },
  { icon: Award, title: 'Premium Badge', description: 'Gold crown on leaderboards & profile', free: '❌', premium: '👑' },
  { icon: Gift, title: 'Early Access', description: 'Play new games 1 week before everyone', free: '❌', premium: '✅' },
  { icon: TrendingUp, title: 'Detailed Analytics', description: 'See your strengths, weaknesses & trends', free: 'Basic', premium: 'Full' },
  { icon: Crown, title: 'Custom Badges', description: 'Unlock exclusive profile badges', free: '5', premium: '25+' },
];

const EXCLUSIVE_GAMES = [
  { id: 'celebrity-trivia', name: 'Celebrity Deep Dive', emoji: '🌟', description: 'Exclusive pop culture questions' },
  { id: 'expert-mode', name: 'Expert Mode', emoji: '🧠', description: 'Hardest questions, biggest XP' },
  { id: 'speed-demon', name: 'Speed Demon', emoji: '⚡', description: '5 seconds per question challenge' },
];

const PRICING = {
  yearly: { price: 9.99, monthly: 0.83, savings: '83%' },
  monthly: { price: 4.99 },
};

export default function Premium() {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      auth.redirectToLogin(window.location.href);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create subscription record
      const price = selectedPlan === 'yearly' ? PRICING.yearly.price : PRICING.monthly.price;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + (selectedPlan === 'yearly' ? 12 : 1));
      
      await Subscription.create({
        user_id: user.id,
        plan_type: selectedPlan === 'yearly' ? 'yearly' : 'monthly',
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      });
      
      // Update user premium status
      await auth.updateMe({ is_premium: true });
      
      // Show success
      alert('🎉 Welcome to Premium! Enjoy unlimited hearts and exclusive perks!');
      window.location.href = createPageUrl('Home');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Payment processing. You\'ll be upgraded shortly! 🚀');
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-[#F0EDE8]">
      {/* Header */}
      <header className="glass-light border-b border-[#E5E0DA] sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E0DA] flex items-center justify-center hover:bg-[#F0EDE8] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#777777]" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-[#3C3C3C]">GenRizz Premium</h1>
            <p className="text-xs text-[#AFAFAF] font-semibold">Unlock the full experience</p>
          </div>
          <div className="badge-3d badge-xp">
            <Crown className="w-4 h-4" />
            <span>Premium</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[#FFC800] to-[#FFB347] flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 6px 0 #E5B400' }}
          >
            <Crown className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-[#3C3C3C] mb-2">Go Premium</h2>
          <p className="text-[#777777] font-semibold">Unlimited hearts, bonus XP, and exclusive perks</p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Yearly */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPlan('yearly')}
            className={`card-3d p-5 text-left relative overflow-hidden ${
              selectedPlan === 'yearly' ? 'border-[#FFC800] ring-2 ring-[#FFC800]/30' : ''
            }`}
          >
            {selectedPlan === 'yearly' && (
              <div className="absolute top-0 right-0 bg-[#FFC800] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                BEST VALUE
              </div>
            )}
            <div className="mb-3">
              <span className="text-sm font-bold text-[#58CC02]">YEARLY</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-[#3C3C3C]">${PRICING.yearly.price}</span>
              <span className="text-[#AFAFAF] font-semibold">/year</span>
            </div>
            <p className="text-sm text-[#777777] font-semibold">
              Just ${PRICING.yearly.monthly}/month
            </p>
            <div className="mt-3 badge-3d badge-green text-xs">
              Save {PRICING.yearly.savings}
            </div>
          </motion.button>

          {/* Monthly */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPlan('monthly')}
            className={`card-3d p-5 text-left ${
              selectedPlan === 'monthly' ? 'border-[#1CB0F6] ring-2 ring-[#1CB0F6]/30' : ''
            }`}
          >
            <div className="mb-3">
              <span className="text-sm font-bold text-[#1CB0F6]">MONTHLY</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-[#3C3C3C]">${PRICING.monthly.price}</span>
              <span className="text-[#AFAFAF] font-semibold">/month</span>
            </div>
            <p className="text-sm text-[#777777] font-semibold">
              Cancel anytime
            </p>
          </motion.button>
        </div>

        {/* Exclusive Games Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d card-3d-yellow p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#FFC800]" />
            <h3 className="font-black text-lg text-[#3C3C3C]">Premium-Only Games</h3>
          </div>
          <div className="space-y-3">
            {EXCLUSIVE_GAMES.map((game, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-3 bg-white/60 rounded-xl p-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFC800] to-[#FFB347] flex items-center justify-center text-2xl shadow-md">
                  {game.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#3C3C3C]">{game.name}</p>
                  <p className="text-xs text-[#777777]">{game.description}</p>
                </div>
                <div className="badge-3d badge-xp text-xs">
                  <Crown className="w-3 h-3" />
                  <span>VIP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-3d p-6 mb-8"
        >
          <h3 className="font-black text-lg text-[#3C3C3C] mb-4">All Premium Perks</h3>
          <div className="space-y-4">
            {PREMIUM_FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={`flex items-center gap-4 ${feature.highlight ? 'bg-[#FFC800]/10 -mx-2 px-2 py-2 rounded-xl' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.highlight ? 'bg-[#FFC800]/30' : 'bg-[#FFC800]/20'}`}>
                  <feature.icon className="w-6 h-6 text-[#FFC800]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#3C3C3C]">{feature.title}</p>
                  <p className="text-xs text-[#AFAFAF]">{feature.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#AFAFAF] line-through">{feature.free}</p>
                  <p className="font-bold text-[#58CC02]">{feature.premium}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-3d card-3d-green p-5 mb-8 text-center"
        >
          <div className="flex justify-center gap-1 mb-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-5 h-5 text-[#FFC800] fill-[#FFC800]" />
            ))}
          </div>
          <p className="font-bold text-[#3C3C3C]">"Best quiz app ever! Premium is totally worth it."</p>
          <p className="text-sm text-[#777777] mt-1">— @genzcreator on TikTok</p>
        </motion.div>

        {/* Subscribe Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="btn-3d btn-3d-yellow w-full py-5 text-xl flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
              />
              Processing...
            </>
          ) : (
            <>
              <Crown className="w-6 h-6" />
              {selectedPlan === 'yearly' 
                ? `GET PREMIUM — $${PRICING.yearly.price}/year`
                : `GET PREMIUM — $${PRICING.monthly.price}/month`
              }
            </>
          )}
        </motion.button>

        <p className="text-center text-sm text-[#AFAFAF] mt-4">
          Cancel anytime • 7-day money-back guarantee
        </p>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 space-y-4"
        >
          <h3 className="font-black text-lg text-[#3C3C3C]">FAQ</h3>
          
          <div className="card-3d p-4">
            <p className="font-bold text-[#3C3C3C]">Can I cancel anytime?</p>
            <p className="text-sm text-[#777777] mt-1">Yes! Cancel anytime from your profile. No questions asked.</p>
          </div>
          
          <div className="card-3d p-4">
            <p className="font-bold text-[#3C3C3C]">What happens to my progress?</p>
            <p className="text-sm text-[#777777] mt-1">Your XP, badges, and stats are always saved, premium or not.</p>
          </div>
          
          <div className="card-3d p-4">
            <p className="font-bold text-[#3C3C3C]">Do hearts regenerate with Premium?</p>
            <p className="text-sm text-[#777777] mt-1">You get unlimited hearts! No waiting, no limits.</p>
          </div>
        </motion.div>

        <div className="h-20" />
      </main>
    </div>
  );
}