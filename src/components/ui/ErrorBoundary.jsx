import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { emitError } from '@/services/telemetry';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    emitError({ message: error?.message || 'boundary_error', stack: error?.stack, page: window.location.pathname, meta: { info: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border-2 border-[#E5E0DA] text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 bg-gradient-to-br from-[#FF4B4B] to-[#FF3333] rounded-2xl flex items-center justify-center text-4xl shadow-lg mx-auto mb-6"
              style={{ boxShadow: '0 4px 0 #CC0000' }}
            >
              <AlertCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-3">Oops! Something went wrong</h2>
            <p className="text-slate-600 font-semibold mb-6">
              We encountered an unexpected error. Don't worry, we're on it!
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={() => window.location.reload()}
                className="flex-1 btn-3d btn-3d-blue py-3 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-4 h-4" />
                Reload
              </motion.button>
              
              <Link to={createPageUrl('Home')} className="flex-1">
                <motion.button
                  className="w-full btn-3d btn-3d-ghost py-3 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </motion.button>
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs font-bold text-[#777777] cursor-pointer mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="text-xs bg-[#F7F4F0] p-3 rounded-lg overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
