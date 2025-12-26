import React, { useState, useEffect } from 'react';
import { auth } from '@/api/auth';
import { Purchase, PowerUp } from '@/api/entities';
import { emitEvent, emitError } from '@/services/telemetry';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Heart, Zap, Crown, Star, Shield, 
  CheckCircle2, Loader2, ArrowLeft, Shirt, Glasses, 
  Palette, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Mascot from '@/components/ui/Mascot';
import { requestRecoveryAd } from '@/services/ads';
import { useToast } from '@/components/ui/use-toast';

const SHOP_ITEMS = [
  {
    id: 'hearts_refill',
    name: 'Heart Refill',
    description: 'Restore 5 hearts instantly',
    icon: Heart,
    color: 'var(--brand-red)',
    price: 1.99,
    type: 'consumable',
    quantity: 5,
    effect: 'hearts',
    category: 'powerups'
  },
  {
    id: 'powerup_pack_s',
    name: 'Starter Pack',
    description: '3 of each power-up',
    icon: Zap,
    color: 'var(--brand-yellow)',
    price: 2.99,
    type: 'consumable',
    quantity: 3,
    effect: 'powerups_all',
    category: 'powerups'
  },
  {
    id: 'powerup_pack_l',
    name: 'Pro Pack',
    description: '10 of each power-up',
    icon: Star,
    color: 'var(--brand-purple)',
    price: 7.99,
    type: 'consumable',
    quantity: 10,
    effect: 'powerups_all',
    category: 'powerups'
  },
  {
    id: 'streak_shield',
    name: 'Streak Shield',
    description: 'Protect your streak for 1 day',
    icon: Shield,
    color: 'var(--brand-blue)',
    price: 0.99,
    type: 'consumable',
    quantity: 1,
    effect: 'shield',
    category: 'powerups'
  }
];

const AVATAR_ITEMS = [
  {
    id: 'skin_blue',
    name: 'Blue Flame',
    description: 'Chill vibes only',
    icon: Palette,
    color: 'var(--brand-blue)',
    price: 500,
    currency: 'coins',
    type: 'skin',
    value: 'blue',
    category: 'avatar'
  },
  {
    id: 'hat_top',
    name: 'Fancy Top Hat',
    description: 'For the distinguished flame',
    icon: Shirt,
    color: 'var(--text-primary)',
    price: 1000,
    currency: 'coins',
    type: 'hat',
    value: 'top_hat',
    category: 'avatar'
  },
  {
    id: 'glasses_cool',
    name: 'Cool Shades',
    description: 'Deal with it',
    icon: Glasses,
    color: 'var(--brand-yellow)',
    price: 750,
    currency: 'coins',
    type: 'glasses',
    value: 'shades',
    category: 'avatar'
  },
  {
    id: 'skin_purple',
    name: 'Mystic Flame',
    description: 'Magical energy',
    icon: Sparkles,
    color: 'var(--brand-purple)',
    price: 1500,
    currency: 'coins',
    type: 'skin',
    value: 'purple',
    category: 'avatar'
  }
];

export default function Shop() {
  const [user, setUser] = useState(null);
  const [purchasing, setPurchasing] = useState(null);
  const [activeTab, setActiveTab] = useState('powerups'); // 'powerups' | 'avatar'
  const { toast } = useToast();

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const handleRecoveryAd = async () => {
    const result = await requestRecoveryAd();
    if (result.shown) {
      if (user?.id) {
        await auth.updateMe({ hearts: Math.min(5, (user.hearts || 0) + 1) });
      }
      toast({ title: 'Bonus heart granted', description: 'Recovery-only ad watched (capped & cooldown enforced).' });
      emitEvent('ad_shown', { placement: 'shop_recovery', reward: 'heart' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Ad unavailable',
        description: 'Ads are off or cooling down (15m, max 3/day).',
      });
      emitEvent('ad_blocked', { placement: 'shop_recovery', reason: result.reason || 'cooldown' });
    }
  };

  const handlePurchase = async (item) => {
    if (!user) {
      auth.redirectToLogin();
      return;
    }

    setPurchasing(item.id);

    try {
      // Handle Coin Purchase (Avatar Items)
      if (item.currency === 'coins') {
        if ((user.coins || 0) < item.price) {
          alert("Not enough coins!");
          setPurchasing(null);
          return;
        }

        // Deduct coins
        await auth.updateMe({ 
          coins: (user.coins || 0) - item.price,
          // Save avatar item ownership logic here (simplified)
          [`owned_${item.id}`]: true 
        });
        
        alert(`Purchased ${item.name}!`);
        emitEvent('purchase_complete', { itemId: item.id, sku: item.id, currency: 'coins', price: item.price, type: item.type, effect: item.effect });
      } else {
        // Real Money Purchase (Mock)
        await Purchase.create({
          user_id: user.id,
          item_id: item.id,
          item_name: item.name,
          type: item.type,
          amount: item.quantity,
          price: item.price,
          status: 'completed'
        });
        emitEvent('purchase_complete', { itemId: item.id, sku: item.id, currency: 'USD', price: item.price, type: item.type, effect: item.effect });

        // Apply Effects
        if (item.effect === 'hearts') {
          await auth.updateMe({ hearts: 5 });
        } else if (item.effect === 'powerups_all') {
          const existing = await PowerUp.filter({ user_id: user.id });
          let powerUp = existing[0];
          if (powerUp) {
            await PowerUp.update(powerUp.id, {
              fifty_fifty: (powerUp.fifty_fifty || 0) + item.quantity,
              skip: (powerUp.skip || 0) + item.quantity,
              extra_time: (powerUp.extra_time || 0) + item.quantity,
              hint: (powerUp.hint || 0) + item.quantity
            });
          } else {
            await PowerUp.create({
              user_id: user.id,
              fifty_fifty: item.quantity,
              skip: item.quantity,
              extra_time: item.quantity,
              hint: item.quantity
            });
          }
        }
        alert(`Purchased ${item.name}!`);
      }

      // Refresh User
      const updatedUser = await auth.me();
      setUser(updatedUser);

    } catch (error) {
      console.error("Purchase failed", error);
      emitError({ message: 'purchase_failed', page: 'Shop', meta: { itemId: item.id, error: error?.message } });
      alert("Purchase failed. Please try again.");
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] pb-24">
      <header className="glass-header">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white border-2 border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--surface-2)] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-[var(--text-primary)] text-lg">Shop</h1>
            <p className="text-xs text-[var(--text-muted)] font-semibold">Store & Customization</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="badge-3d badge-xp">
              <Crown className="w-4 h-4" />
              <span>{user?.coins || 0}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Tabs */}
        <div className="flex p-1 bg-[var(--border-subtle)] rounded-xl">
          <button 
            onClick={() => setActiveTab('powerups')}
            className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${
              activeTab === 'powerups' ? 'bg-white shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            ⚡ Power-ups
          </button>
          <button 
            onClick={() => setActiveTab('avatar')}
            className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${
              activeTab === 'avatar' ? 'bg-white shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            🎨 Avatar
          </button>
        </div>

        {activeTab === 'powerups' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Premium Banner */}
            <div className="card-3d card-3d-yellow p-6 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[var(--text-primary)]">Get GenRizz Premium</h2>
                  <p className="text-[var(--text-secondary)] font-semibold mb-4">Unlimited hearts, no ads, 2x XP!</p>
                  <Link to={createPageUrl('Premium')}>
                    <button className="btn-3d btn-3d-yellow px-6 py-2 text-sm">
                      Upgrade Now
                    </button>
                  </Link>
                </div>
                <Crown className="w-16 h-16 text-[var(--brand-yellow)] rotate-12 opacity-80" />
              </div>
            </div>

            {/* Items Grid */}
            <div>
              <h2 className="text-lg font-black text-[var(--text-primary)] mb-4">Special Offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {SHOP_ITEMS.map((item) => (
                  <div key={item.id} className="card-3d p-4 flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 text-3xl shadow-sm"
                         style={{ backgroundColor: `${item.color}20` }}>
                      <item.icon className="w-8 h-8" style={{ color: item.color }} />
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)] mb-1">{item.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-4 flex-1">{item.description}</p>
                    
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={purchasing === item.id}
                      className="btn-3d btn-3d-green w-full py-2 text-sm flex items-center justify-center gap-2"
                    >
                      {purchasing === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>${item.price}</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Watch Ad */}
            <div className="card-3d p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-blue)]/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[var(--brand-blue)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">Watch Ad</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Get 1 Free Heart</p>
                </div>
              </div>
              <button 
                className="btn-3d btn-3d-blue px-4 py-2 text-sm"
                onClick={handleRecoveryAd}
              >
                Watch
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 border-4 border-[var(--border-subtle)]">
                <span className="text-6xl">🔥</span>
              </div>
              <h2 className="font-black text-[var(--text-primary)] text-xl">Customize Rizzy</h2>
              <p className="text-[var(--text-secondary)] font-semibold">Stand out on the leaderboards!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AVATAR_ITEMS.map((item) => (
                <div key={item.id} className="card-3d p-4 flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3 text-3xl shadow-sm bg-gray-50 relative overflow-hidden"
                       style={{ borderColor: item.color }}>
                    {/* Mock Preview */}
                    <span className="text-4xl relative z-10">🔥</span>
                    {item.type === 'hat' && <span className="absolute top-1 text-2xl z-20">🎩</span>}
                    {item.type === 'glasses' && <span className="absolute top-6 text-2xl z-20">🕶️</span>}
                    {item.type === 'skin' && <div className="absolute inset-0 opacity-20" style={{backgroundColor: item.color}} />}
                  </div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1">{item.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-4 flex-1">{item.description}</p>
                  
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={purchasing === item.id}
                    className="btn-3d btn-3d-yellow w-full py-2 text-sm flex items-center justify-center gap-2"
                  >
                    {purchasing === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span className="font-black text-xs">{item.price}</span>
                        <Crown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
