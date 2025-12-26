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
    <div className="min-h-screen bg-gradient-to-b" style={{ backgroundImage: 'linear-gradient(to bottom, var(--page-bg), var(--surface-2))' }}>
      {/* Header */}
      <header className="glass-header">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white border-2 flex items-center justify-center transition-colors" style={{ borderColor: 'var(--border-subtle)' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}>
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black" style={{ color: 'var(--text-primary)' }}>GenRizz Premium</h1>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Unlock the full experience</p>
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
            className="w-24 h-24 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(to bottom right, var(--brand-yellow), var(--brand-yellow-hover))', boxShadow: '0 6px 0 var(--brand-yellow-dark)' }}
          >
            <Crown className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Go Premium</h2>
          <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Unlimited hearts, bonus XP, and exclusive perks</p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Yearly */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPlan('yearly')}
            className="card-3d p-5 text-left relative overflow-hidden"
            style={selectedPlan === 'yearly' ? { borderColor: 'var(--brand-yellow)', boxShadow: '0 0 0 2px var(--brand-yellow)/30' } : {}}
          >
            {selectedPlan === 'yearly' && (
              <div className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-xl" style={{ backgroundColor: 'var(--brand-yellow)' }}>
                BEST VALUE
              </div>
            )}
            <div className="mb-3">
              <span className="text-sm font-bold" style={{ color: 'var(--brand-green)' }}>YEARLY</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>${PRICING.yearly.price}</span>
              <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>/year</span>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
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
            className="card-3d p-5 text-left"
            style={selectedPlan === 'monthly' ? { borderColor: 'var(--brand-blue)', boxShadow: '0 0 0 2px var(--brand-blue)/30' } : {}}
          >
            <div className="mb-3">
              <span className="text-sm font-bold" style={{ color: 'var(--brand-blue)' }}>MONTHLY</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>${PRICING.monthly.price}</span>
              <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>/month</span>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
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
            <Sparkles className="w-5 h-5" style={{ color: 'var(--brand-yellow)' }} />
            <h3 className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>Premium-Only Games</h3>
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
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md" style={{ background: 'linear-gradient(to bottom right, var(--brand-yellow), var(--brand-yellow-hover))' }}>
                  {game.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{game.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{game.description}</p>
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
          <h3 className="font-black text-lg mb-4" style={{ color: 'var(--text-primary)' }}>All Premium Perks</h3>
          <div className="space-y-4">
            {PREMIUM_FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-4"
                style={feature.highlight ? { backgroundColor: 'var(--brand-yellow)/10', margin: '0 -0.5rem', padding: '0.5rem', borderRadius: '0.75rem' } : {}}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: feature.highlight ? 'var(--brand-yellow)/30' : 'var(--brand-yellow)/20' }}>
                  <feature.icon className="w-6 h-6" style={{ color: 'var(--brand-yellow)' }} />
                </div>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{feature.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>{feature.free}</p>
                  <p className="font-bold" style={{ color: 'var(--brand-green)' }}>{feature.premium}</p>
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
              <Star key={i} className="w-5 h-5" style={{ color: 'var(--brand-yellow)', fill: 'var(--brand-yellow)' }} />
            ))}
          </div>
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>"Best quiz app ever! Premium is totally worth it."</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>— @genzcreator on TikTok</p>
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

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          Cancel anytime • 7-day money-back guarantee
        </p>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 space-y-4"
        >
          <h3 className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>FAQ</h3>
          
          <div className="card-3d p-4">
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Can I cancel anytime?</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Yes! Cancel anytime from your profile. No questions asked.</p>
          </div>
          
          <div className="card-3d p-4">
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>What happens to my progress?</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Your XP, badges, and stats are always saved, premium or not.</p>
          </div>
          
          <div className="card-3d p-4">
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Do hearts regenerate with Premium?</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>You get unlimited hearts! No waiting, no limits.</p>
          </div>
        </motion.div>

        <div className="h-20" />
      </main>
    </div>
  );
}
