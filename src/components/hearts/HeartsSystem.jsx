import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Clock, Crown, X, Play } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auth';
import { Subscription } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { requestRecoveryAd } from '@/services/ads';
import { useToast } from '@/components/ui/use-toast';

const MAX_HEARTS = 5;
const REGEN_TIME_MINUTES = 30;

export default function HeartsSystem({ userId, onHeartChange }) {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get user's hearts data
  const { data: heartsData } = useQuery({
    queryKey: ['hearts', userId],
    queryFn: async () => {
      const user = await auth.me();
      
      // Check if user has premium
      const subs = await Subscription.filter({ user_id: userId });
      const isPremium = subs[0]?.status === 'active' && subs[0]?.plan !== 'free';
      
      let currentHearts = user.hearts !== undefined ? user.hearts : MAX_HEARTS;
      let lastRegen = user.last_heart_regen ? new Date(user.last_heart_regen).getTime() : Date.now();
      
      // Regen logic
      const now = Date.now();
      const timeSinceUpdate = now - lastRegen;
      const heartsToRegen = Math.floor(timeSinceUpdate / (REGEN_TIME_MINUTES * 60 * 1000));
      
      if (heartsToRegen > 0 && currentHearts < MAX_HEARTS) {
        const newHearts = Math.min(MAX_HEARTS, currentHearts + heartsToRegen);
        const newLastRegen = new Date(now).toISOString();
        
        await auth.updateMe({ 
          hearts: newHearts,
          last_heart_regen: newLastRegen
        });
        
        currentHearts = newHearts;
        lastRegen = now;
      }
      
      return { hearts: currentHearts, lastUpdate: lastRegen, isPremium };
    },
    enabled: !!userId,
    refetchInterval: 60000,
  });

  const hearts = heartsData?.hearts ?? MAX_HEARTS;
  const isPremium = heartsData?.isPremium ?? false;
  const lastUpdate = heartsData?.lastUpdate ?? Date.now();

  // Calculate time until next heart
  const getTimeUntilNextHeart = () => {
    if (hearts >= MAX_HEARTS) return null;
    const now = Date.now();
    const timeSinceUpdate = now - lastUpdate;
    const timeUntilNext = (REGEN_TIME_MINUTES * 60 * 1000) - (timeSinceUpdate % (REGEN_TIME_MINUTES * 60 * 1000));
    return Math.ceil(timeUntilNext / 60000);
  };

  // Use a heart
  const useHeart = async () => {
    if (isPremium) return true;
    if (hearts <= 0) {
      setShowModal(true);
      return false;
    }
    
    // This duplicate code is removed - handled below
    // Actually, for regen to work correctly, we should only update timestamp if we were at max hearts.
    // If we were already regenerating, we shouldn't reset the timer.
    // Simplified logic: always update timestamp to now on use? No, that punishes players.
    // Correct: If at MAX, set timestamp to NOW. If below MAX, keep timestamp.
    
    if (hearts === MAX_HEARTS) {
         await auth.updateMe({ 
          hearts: hearts - 1,
          last_heart_regen: new Date().toISOString()
        });
    } else {
        await auth.updateMe({ hearts: hearts - 1 });
    }

    queryClient.invalidateQueries(['hearts', userId]);
    onHeartChange?.(hearts - 1);
    return true;
  };

  // Refill hearts
  const refillHeart = async () => {
    await auth.updateMe({ hearts: Math.min(MAX_HEARTS, hearts + 1) });
    queryClient.invalidateQueries(['hearts', userId]);
    setShowModal(false);
  };

  const handleWatchAd = async () => {
    const result = await requestRecoveryAd();
    if (result.shown) {
      await refillHeart();
      toast({ title: 'Bonus granted', description: 'Recovery-only ad watched. +1 heart added.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Ad unavailable',
        description: 'Recovery ads are disabled or on cooldown (15m, max 3/day).',
      });
    }
  };

  const timeUntilNext = getTimeUntilNextHeart();

  return (
    <>
      {/* Hearts Display */}
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-xl border-2 border-[#FF4B4B]/30"
        aria-label="View hearts status and options"
      >
        <div className="flex">
          {[...Array(MAX_HEARTS)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Heart 
                className={`w-5 h-5 ${i < hearts ? 'text-[#FF4B4B] fill-[#FF4B4B]' : 'text-[#E5E0DA]'}`}
              />
            </motion.div>
          ))}
        </div>
        {isPremium && (
          <Crown className="w-4 h-4 text-[#FFC800] ml-1" />
        )}
      </motion.button>

      {/* Hearts Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="card-3d p-6 max-w-sm w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-[#3C3C3C]">❤️ Hearts</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg bg-[#F7F4F0] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#777777]" />
                </button>
              </div>

              {/* Hearts Display */}
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(MAX_HEARTS)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={i < hearts ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Heart 
                      className={`w-10 h-10 ${i < hearts ? 'text-[#FF4B4B] fill-[#FF4B4B]' : 'text-[#E5E0DA]'}`}
                    />
                  </motion.div>
                ))}
              </div>

              {isPremium ? (
                <div className="text-center p-4 bg-gradient-to-r from-[#FFC800]/10 to-[#FF9600]/10 rounded-xl mb-4">
                  <Crown className="w-8 h-8 text-[#FFC800] mx-auto mb-2" />
                  <p className="font-black text-[#3C3C3C]">Unlimited Hearts!</p>
                  <p className="text-sm text-[#777777]">You have Premium access</p>
                </div>
              ) : hearts === 0 ? (
                <>
                  <div className="text-center p-4 bg-[#FF4B4B]/10 rounded-xl mb-4">
                    <p className="font-black text-[#FF4B4B] mb-1">Out of Hearts!</p>
                    <p className="text-sm text-[#777777]">Wait or get more hearts</p>
                  </div>

                  {timeUntilNext && (
                    <div className="flex items-center justify-center gap-2 text-[#777777] mb-4">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-bold">Next heart in {timeUntilNext} min</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleWatchAd}
                      className="w-full btn-3d btn-3d-blue py-3 flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Watch Ad for 1 Heart
                    </motion.button>

                    <Link to={createPageUrl('Premium')}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-3d btn-3d-yellow py-3 flex items-center justify-center gap-2"
                      >
                        <Crown className="w-5 h-5" />
                        Get Unlimited Hearts
                      </motion.button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="font-bold text-[#3C3C3C]">{hearts} hearts remaining</p>
                    {timeUntilNext && (
                      <p className="text-sm text-[#777777]">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Next heart in {timeUntilNext} min
                      </p>
                    )}
                  </div>

                  <div className="bg-[#F7F4F0] rounded-xl p-4 text-center">
                    <p className="text-sm text-[#777777] font-semibold">
                      You lose a heart for each wrong answer.<br/>
                      Hearts regenerate every 30 minutes.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { MAX_HEARTS, REGEN_TIME_MINUTES };
