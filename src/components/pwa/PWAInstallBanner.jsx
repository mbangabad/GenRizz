import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap, Bell, Wifi } from 'lucide-react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const isDismissed = localStorage.getItem('pwa-banner-dismissed');
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isDismissed || isInstalled) return;

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after a delay
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const features = [
    { icon: Zap, text: 'Faster loading' },
    { icon: Bell, text: 'Streak reminders' },
    { icon: Wifi, text: 'Works offline' },
  ];

  return (
    <AnimatePresence>
      {showBanner && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 md:bottom-6 left-2 right-2 md:left-auto md:right-6 md:w-96 z-50"
        >
          <div className="card-3d card-3d-blue p-5 relative">
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-[#777777] hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#58CC02] to-[#46A302] flex items-center justify-center shadow-lg flex-shrink-0"
                   style={{ boxShadow: '0 4px 0 #3D8C02' }}>
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <h3 className="font-black text-[#3C3C3C] text-lg">Add to Home Screen</h3>
                <p className="text-sm text-[#777777] font-semibold">Get the full app experience!</p>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-[#777777] font-semibold">
                  <f.icon className="w-3.5 h-3.5 text-[#1CB0F6]" />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstall}
              className="w-full btn-3d btn-3d-green py-3 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Install App
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
