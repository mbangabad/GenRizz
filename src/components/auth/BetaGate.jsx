import React, { useState } from 'react';
import { auth } from '@/api/auth';
import { InviteCode, BetaAccess } from '@/api/entities';
import { Lock, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Mascot from '@/components/ui/Mascot';

export default function BetaGate({ user, onSuccess }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Check if code exists and is valid
      const codes = await InviteCode.filter({ 
        code: code.trim(),
        status: 'active'
      });

      const validCode = codes.find(c => {
        if (c.max_uses > 0 && c.used_count >= c.max_uses) return false;
        if (c.expires_at && new Date(c.expires_at) < new Date()) return false;
        return true;
      });

      if (!validCode) {
        setError('Invalid or expired invite code');
        setLoading(false);
        return;
      }

      // 2. Create BetaAccess record
      await BetaAccess.create({
        user_id: user.id,
        email: user.email,
        code_used: validCode.code,
        granted_at: new Date().toISOString()
      });

      // 3. Update code usage count
      await InviteCode.update(validCode.id, {
        used_count: (validCode.used_count || 0) + 1
      });

      // 4. Success!
      onSuccess();

    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-float">🔒</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-pulse-slow">🔑</div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-bounce-in">✨</div>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <Mascot mood="cool" size="xl" showSpeech speech="What's the password? 😎" />
          <h1 className="text-3xl font-black text-[#3C3C3C] mt-6 mb-2">Beta Access Only</h1>
          <p className="text-[#777777] font-bold">
            You're logged in as <span className="text-[#58CC02]">{user.email}</span>
          </p>
        </div>

        <div className="card-3d p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">
                Enter Invite Code
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="XYZ-123-ABC"
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-[#F7F4F0] border-2 border-[#E5E0DA] font-black text-lg text-[#3C3C3C] placeholder-[#D4CFC7] focus:border-[#58CC02] focus:bg-white transition-all outline-none uppercase text-center tracking-widest"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-[#FF4B4B]/10 border-2 border-[#FF4B4B]/20 text-[#FF4B4B] text-sm font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading || !code}
              className="w-full h-14 btn-3d btn-3d-green flex items-center justify-center gap-2 text-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Unlock Access <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E5E0DA] text-center">
            <p className="text-xs font-bold text-[#AFAFAF] mb-3 uppercase">Don't have a code?</p>
            <button 
              onClick={() => auth.signOut()}
              className="text-sm font-bold text-[#777777] hover:text-[#3C3C3C] hover:underline"
            >
              Log out and try another account
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E0DA] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#58CC02]" />
            <span className="text-xs font-bold text-[#777777]">Secure Beta Environment</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}