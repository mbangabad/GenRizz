import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { auth } from '@/api/auth';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Settings as SettingsIcon, Bell, Volume2, Moon, Globe,
  Shield, Crown, LogOut, ChevronRight, User, HelpCircle, Trash2, FileText
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/components/contexts/LanguageContext';

export default function Settings() {
  const { language, changeLanguage, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    pushNotifications: false,
  });

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
    
    // Load settings from localStorage
    const saved = localStorage.getItem('genrizz_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('genrizz_settings', JSON.stringify(newSettings));
    
    // Handle sound effects toggle
    if (key === 'soundEffects') {
      localStorage.setItem('soundEnabled', value.toString());
    }
  };

  const SETTING_GROUPS = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Globe,
          label: t('settings.language'),
          description: t('settings.select_language'),
          type: 'select',
          key: 'language',
          value: language,
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' }
          ]
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Get notified about challenges and friends',
          type: 'toggle',
          key: 'notifications',
        },
        {
          icon: Volume2,
          label: 'Sound Effects',
          description: 'Play sounds on correct/wrong answers',
          type: 'toggle',
          key: 'soundEffects',
        },
      ]
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          description: 'Change your avatar and bio',
          type: 'link',
          to: 'Profile',
        },
        {
          icon: Crown,
          label: 'Premium',
          description: user?.is_premium ? 'Manage subscription' : 'Upgrade to Premium',
          type: 'link',
          to: 'Premium',
          badge: user?.is_premium ? '👑 Active' : null,
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Manage your data',
          type: 'link',
          to: 'Help',
        },
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          description: 'Get answers to common questions',
          type: 'link',
          to: 'Help',
        },
        {
          icon: FileText,
          label: 'Project Blueprint',
          description: 'View architecture & design docs',
          type: 'link',
          to: 'Blueprint',
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-32">
      {/* Header */}
      <header className="glass-light border-b border-[#E5E0DA] sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl bg-white border-2 border-[#E5E0DA] flex items-center justify-center hover:bg-[#F0EDE8] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#777777]" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-[#3C3C3C]">{t('settings.title')}</h1>
            <p className="text-xs text-[#AFAFAF] font-semibold">Customize your experience</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#777777] to-[#555555] flex items-center justify-center" style={{ boxShadow: '0 3px 0 #444444' }}>
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {SETTING_GROUPS.map((group, gIdx) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gIdx * 0.1 }}
          >
            <h2 className="text-sm font-bold text-[#AFAFAF] uppercase tracking-wide mb-3 px-1">
              {group.title}
            </h2>
            <div className="card-3d divide-y divide-[#E5E0DA]">
              {group.items.map((item, iIdx) => (
                item.type === 'toggle' ? (
                  <div key={iIdx} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F4F0] flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#777777]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#3C3C3C]">{item.label}</p>
                      <p className="text-xs text-[#AFAFAF]">{item.description}</p>
                    </div>
                    <Switch
                      checked={settings[item.key]}
                      onCheckedChange={(checked) => updateSetting(item.key, checked)}
                    />
                  </div>
                ) : item.type === 'select' ? (
                  <div key={iIdx} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F4F0] flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#777777]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#3C3C3C]">{item.label}</p>
                      <p className="text-xs text-[#AFAFAF]">{item.description}</p>
                    </div>
                    <select
                      value={item.value}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="bg-[#F7F4F0] border-none rounded-lg font-bold text-sm text-[#3C3C3C] p-2 focus:ring-2 focus:ring-[#58CC02] outline-none"
                    >
                      {item.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Link key={iIdx} to={createPageUrl(item.to)}>
                    <div className="p-4 flex items-center gap-4 hover:bg-[#F7F4F0] transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-[#F7F4F0] flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-[#777777]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#3C3C3C]">{item.label}</p>
                        <p className="text-xs text-[#AFAFAF]">{item.description}</p>
                      </div>
                      {item.badge && (
                        <span className="badge-3d badge-xp text-xs">{item.badge}</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-[#AFAFAF]" />
                    </div>
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout */}
        {user && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => auth.signOut()}
            className="w-full card-3d p-4 flex items-center gap-4 hover:bg-[#FFF5F5] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF4B4B]/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-[#FF4B4B]" />
            </div>
            <span className="font-bold text-[#FF4B4B]">Sign Out</span>
          </motion.button>
        )}

        {/* App Info */}
        <div className="text-center text-sm text-[#AFAFAF] font-semibold pt-4">
          <p>GenRizz v1.0.0</p>
          <p className="mt-1">Made with 🔥 for every generation</p>
        </div>
      </main>
    </div>
  );
}