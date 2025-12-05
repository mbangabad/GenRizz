import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    try {
      // Check if already installed - wrap in try/catch for unsupported environments
      try {
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
          setIsInstalled(true);
          return;
        }
      } catch (e) {
        // matchMedia not supported
      }

      // Check if iOS
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent || '');
      setIsIOS(iOS);

      // Listen for install prompt (Android/Desktop)
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setTimeout(() => setShowPrompt(true), 5000);
      };

      if (typeof window !== 'undefined' && 'addEventListener' in window) {
        window.addEventListener('beforeinstallprompt', handler);
      }

      // For iOS, show prompt after delay
      if (iOS) {
        try {
          const dismissed = localStorage.getItem('pwa-prompt-dismissed');
          if (!dismissed) {
            setTimeout(() => setShowPrompt(true), 5000);
          }
        } catch (e) {
          // localStorage not available
        }
      }

      return () => {
        try {
          if (typeof window !== 'undefined' && 'removeEventListener' in window) {
            window.removeEventListener('beforeinstallprompt', handler);
          }
        } catch (e) {
          // ignore cleanup errors
        }
      };
    } catch (err) {
      // Silently ignore PWA prompt errors
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50"
      >
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50">
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/40 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-2xl shrink-0">
              🔥
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Install GenRizz</h3>
              <p className="text-sm text-white/50 mb-3">
                Add to your home screen for the best experience!
              </p>

              {isIOS ? (
                <div className="text-xs text-white/40 space-y-1">
                  <p>1. Tap the <span className="text-white">Share</span> button</p>
                  <p>2. Select <span className="text-white">"Add to Home Screen"</span></p>
                </div>
              ) : (
                <button
                  onClick={handleInstall}
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Install App
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}