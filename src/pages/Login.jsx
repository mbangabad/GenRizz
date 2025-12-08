import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '@/api/auth';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Mascot from '@/components/ui/Mascot';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Form submitted, isSignUp:', isSignUp, 'email:', email);
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        console.log('Attempting sign up...');
        const result = await auth.signUp(email, password);
        console.log('Sign up result:', result);
        if (result && result.user) {
          setError('✅ Account created! Check your email to confirm your account.');
          setTimeout(() => {
            setIsSignUp(false);
            setEmail('');
            setPassword('');
          }, 3000);
        } else {
          setError('Sign up completed. Please check your email to confirm your account.');
        }
      } else {
        console.log('Attempting sign in...');
        const result = await auth.signIn(email, password);
        console.log('Sign in result:', result);
        if (result && result.user) {
          window.location.href = returnUrl;
        } else {
          setError('Sign in failed. Please check your credentials.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || err.error?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Mascot mood="cool" size="xl" showSpeech speech={isSignUp ? "Join the fun! 🎮" : "Welcome back! 👋"} />
          <h1 className="text-3xl font-black text-[#3C3C3C] mt-6 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-[#777777] font-semibold">
            {isSignUp ? 'Start your GenRizz journey' : 'Sign in to continue playing'}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-3d p-8 bg-white"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#3C3C3C] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#E5E0DA] focus:border-[#58CC02] focus:outline-none transition-colors font-semibold"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#3C3C3C] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-[#E5E0DA] focus:border-[#58CC02] focus:outline-none transition-colors font-semibold"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AFAFAF] hover:text-[#3C3C3C] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm font-semibold"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 bg-gradient-to-br from-[#58CC02] to-[#46A302] hover:from-[#46A302] hover:to-[#3D8C02] text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ boxShadow: '0 4px 0 #3D8C02' }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? 'Creating...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-1">
            <p className="text-sm text-[#777777] font-semibold">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔵 Toggle button clicked! Current state:', isSignUp);
                  const newState = !isSignUp;
                  console.log('🔵 Setting isSignUp to:', newState);
                  setIsSignUp(newState);
                  setError(null);
                  setEmail('');
                  setPassword('');
                  console.log('🔵 State updated, form should now show:', newState ? 'Sign Up' : 'Sign In');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-base text-[#58CC02] font-bold hover:text-[#46A302] transition-colors cursor-pointer bg-transparent border-none p-0 underline decoration-2 underline-offset-2 hover:decoration-[#46A302] inline-block"
                style={{ textDecoration: 'underline', textDecorationThickness: '2px', textUnderlineOffset: '3px' }}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </motion.button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

