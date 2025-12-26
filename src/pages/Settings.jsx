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
    <div className="min-h-screen pb-32" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Header */}
      <header className="glass-header">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <button className="w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors"
              style={{
                backgroundColor: 'var(--surface-0)',
                borderColor: 'var(--border-subtle)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--surface-0)'}
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black" style={{ color: 'var(--text-primary)' }}>{t('settings.title')}</h1>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Customize your experience</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(to bottom right, var(--text-secondary), #555555)',
            boxShadow: '0 3px 0 #444444'
          }}>
            <SettingsIcon className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
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
            <h2 className="text-sm font-bold uppercase tracking-wide mb-3 px-1" style={{ color: 'var(--text-muted)' }}>
              {group.title}
            </h2>
            <div className="card-3d divide-y" style={{ '--tw-divide-opacity': 1, borderColor: 'var(--border-subtle)' }}>
              {group.items.map((item, iIdx) => (
                item.type === 'toggle' ? (
                  <div key={iIdx} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface-1)' }}>
                      <item.icon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                    </div>
                    <Switch
                      checked={settings[item.key]}
                      onCheckedChange={(checked) => updateSetting(item.key, checked)}
                    />
                  </div>
                ) : item.type === 'select' ? (
                  <div key={iIdx} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface-1)' }}>
                      <item.icon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                    </div>
                    <select
                      value={item.value}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="border-none rounded-lg font-bold text-sm p-2 focus:ring-2 outline-none"
                      style={{
                        backgroundColor: 'var(--surface-1)',
                        color: 'var(--text-primary)',
                        '--tw-ring-color': 'var(--brand-green)'
                      }}
                    >
                      {item.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Link key={iIdx} to={createPageUrl(item.to)}>
                    <div className="p-4 flex items-center gap-4 transition-colors cursor-pointer"
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-1)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface-1)' }}>
                        <item.icon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                      </div>
                      {item.badge && (
                        <span className="badge-3d badge-xp text-xs">{item.badge}</span>
                      )}
                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
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
            className="w-full card-3d p-4 flex items-center gap-4 transition-colors"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#FFF5F5'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 75, 75, 0.1)' }}>
              <LogOut className="w-5 h-5" style={{ color: 'var(--brand-red)' }} />
            </div>
            <span className="font-bold" style={{ color: 'var(--brand-red)' }}>Sign Out</span>
          </motion.button>
        )}

        {/* App Info */}
        <div className="text-center text-sm font-semibold pt-4" style={{ color: 'var(--text-muted)' }}>
          <p>GenRizz v1.0.0</p>
          <p className="mt-1">Made with 🔥 for every generation</p>
        </div>
      </main>
    </div>
  );
}
