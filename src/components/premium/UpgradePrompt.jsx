import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Crown, Heart, Zap, X } from 'lucide-react';
import { requestRecoveryAd } from '@/services/ads';
import { useToast } from '@/components/ui/use-toast';

export default function UpgradePrompt({ 
  reason = 'hearts', // 'hearts', 'streak', 'powerups'
  onClose,
  onWatchAd,
}) {
  const { toast } = useToast();
  const reasons = {
    hearts: {
      icon: Heart,
      title: 'Out of Hearts!',
      message: 'Get unlimited hearts with Premium',
      color: '#FF4B4B',
    },
    streak: {
      icon: Zap,
      title: 'Protect Your Streak!',
      message: 'Get 3 streak shields per month with Premium',
      color: '#FF9600',
    },
    powerups: {
      icon: Zap,
      title: 'Need More Power-Ups?',
      message: 'Get exclusive power-ups with Premium',
      color: '#CE82FF',
    },
  };

  const content = reasons[reason] || reasons.hearts;
  const Icon = content.icon;

  const handleWatchAd = async () => {
    const result = await requestRecoveryAd();
    if (result.shown) {
      toast({ title: 'Recovery-only ad watched', description: 'Bonus applied where eligible.' });
      onClose?.();
    } else {
      toast({
        variant: 'destructive',
        title: 'Ad unavailable',
        description: 'Ads are disabled or cooling down (15m, max 3/day).',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="card-3d p-6 max-w-sm w-full text-center relative"
      >
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#E8E4DF] flex items-center justify-center hover:bg-[#D4CFC7] transition-colors"
          >
            <X className="w-4 h-4 text-[#777777]" />
          </button>
        )}

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${content.color}20` }}
        >
          <Icon className="w-10 h-10" style={{ color: content.color }} />
        </motion.div>

        <h3 className="text-xl font-black text-[#3C3C3C] mb-2">{content.title}</h3>
        <p className="text-[#777777] font-semibold mb-6">{content.message}</p>

        <div className="space-y-3">
          <Link to={createPageUrl('Premium')} className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-3d btn-3d-yellow w-full py-4 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Go Premium
            </motion.button>
          </Link>

          {reason === 'hearts' && (
            <button 
              onClick={handleWatchAd}
              className="btn-3d btn-3d-ghost w-full py-3 text-sm"
            >
              Watch Ad for 1 Heart
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
