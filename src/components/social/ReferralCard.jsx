import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Users, Zap } from 'lucide-react';
import { Referral } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';

export default function ReferralCard({ userId }) {
  const [copied, setCopied] = useState(false);
  const referralCode = userId ? `RIZZ${userId.slice(-6).toUpperCase()}` : '';
  const referralUrl = `${window.location.origin}/#/Landing?ref=${referralCode}`;

  const { data: referrals = [] } = useQuery({
    queryKey: ['referrals', userId],
    queryFn: () => Referral.filter({ referrer_id: userId }),
    enabled: !!userId,
  });

  const completedReferrals = referrals.filter(r => r.status === 'completed').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const totalXpEarned = completedReferrals * 100;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Invite Friends, Get XP</h3>
          <p className="text-sm text-gray-500">Earn 100 XP per friend who joins</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900">{completedReferrals}</p>
          <p className="text-xs text-gray-500">Joined</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-amber-600">{pendingReferrals}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center">
          <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-amber-600">+{totalXpEarned}</p>
          <p className="text-xs text-gray-500">XP Earned</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-xl p-3 flex items-center gap-2">
        <input 
          type="text" 
          value={referralUrl} 
          readOnly 
          className="flex-1 bg-transparent text-sm text-gray-600 outline-none truncate"
        />
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </motion.button>
      </div>

      {/* Rewards Preview */}
      <div className="mt-4 p-3 bg-white/50 rounded-xl">
        <p className="text-xs font-medium text-gray-600 mb-2">Referral Milestones</p>
        <div className="flex items-center gap-2 text-sm">
          <span className={`px-2 py-1 rounded-full ${completedReferrals >= 5 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            5 friends = 🔥 Badge
          </span>
          <span className={`px-2 py-1 rounded-full ${completedReferrals >= 10 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            10 friends = 💎 Premium Week
          </span>
        </div>
      </div>
    </motion.div>
  );
}