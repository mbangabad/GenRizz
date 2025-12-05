import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-5xl shadow-lg"
          style={{ boxShadow: '0 4px 0 #1e293b' }}
        >
          🔍
        </motion.div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-3">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-600 font-semibold mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={createPageUrl('Home')} className="flex-1">
            <motion.button
              className="w-full btn-3d btn-3d-lime py-3 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </Link>
          
          <motion.button
            onClick={() => window.history.back()}
            className="flex-1 btn-3d btn-3d-ghost py-3 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

