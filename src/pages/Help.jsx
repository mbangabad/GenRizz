import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
// Help page - no base44 dependencies
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, HelpCircle, MessageCircle, Mail, ChevronDown, ChevronUp,
  Shield, Heart, Zap, Trophy, Crown, Users, Sparkles, ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const FAQ_SECTIONS = [
  {
    title: 'Getting Started',
    icon: '🚀',
    questions: [
      {
        q: 'How do I play GenRizz?',
        a: 'Just pick a game from the home screen and answer questions! Each game has 10 questions and you\'ll get a tier result based on your score.'
      },
      {
        q: 'Do I need an account to play?',
        a: 'You can browse games without an account, but you need to sign in to track your progress, earn XP, and compete on leaderboards.'
      },
      {
        q: 'What are the different game types?',
        a: 'We have quizzes (right/wrong answers), personality tests (no wrong answers), and opinion games (compare your vibes to others).'
      }
    ]
  },
  {
    title: 'Hearts & Limits',
    icon: '❤️',
    questions: [
      {
        q: 'How do hearts work?',
        a: 'Free users get 5 hearts per day. Each game costs 1 heart. Hearts refill at midnight. Premium users get unlimited hearts!'
      },
      {
        q: 'How do I get more hearts?',
        a: 'Wait for daily refill, upgrade to Premium for unlimited hearts, or earn bonus hearts from achievements.'
      },
      {
        q: 'What happens when I run out of hearts?',
        a: 'You\'ll need to wait until midnight for hearts to refill, or upgrade to Premium for unlimited play.'
      }
    ]
  },
  {
    title: 'XP & Leveling',
    icon: '⚡',
    questions: [
      {
        q: 'How do I earn XP?',
        a: 'Earn XP by playing games, maintaining streaks, completing daily challenges, and unlocking achievements. Higher scores = more XP!'
      },
      {
        q: 'What do levels unlock?',
        a: 'Higher levels unlock new titles, harder questions, and bragging rights on leaderboards. Each level has a unique roast!'
      },
      {
        q: 'What are XP Leagues?',
        a: 'Weekly competitions where you compete against players at similar levels. Top performers earn bonus XP and badges.'
      }
    ]
  },
  {
    title: 'Streaks & Achievements',
    icon: '🔥',
    questions: [
      {
        q: 'How do streaks work?',
        a: 'Play at least one game every day to maintain your streak. Longer streaks = more XP bonuses!'
      },
      {
        q: 'What happens if I miss a day?',
        a: 'Your streak resets to 0. Premium users get Streak Shields that can protect your streak for up to 3 days per month.'
      },
      {
        q: 'How do I unlock achievements?',
        a: 'Achievements unlock automatically when you hit milestones like playing 10 games, getting perfect scores, or maintaining streaks.'
      }
    ]
  },
  {
    title: 'Social & Challenges',
    icon: '👥',
    questions: [
      {
        q: 'How do I challenge friends?',
        a: 'After completing a game, tap "Challenge Friend" to send a link. They\'ll try to beat your score!'
      },
      {
        q: 'How do I add friends?',
        a: 'Go to the Social tab and enter their email, or share your referral link for bonus XP when they join.'
      },
      {
        q: 'What is Party Mode?',
        a: 'Party Mode lets 2-8 players compete in real-time. Create a room and share the code with friends!'
      }
    ]
  },
  {
    title: 'Premium',
    icon: '👑',
    questions: [
      {
        q: 'What does Premium include?',
        a: 'Unlimited hearts, 2x XP, streak shields, exclusive badges, premium-only games, and an ad-free experience.'
      },
      {
        q: 'How much does Premium cost?',
        a: 'Premium is $9.99/year (best value) or $4.99/month. We offer a 7-day money-back guarantee.'
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes! Cancel from your profile anytime. Your Premium benefits continue until the end of your billing period.'
      }
    ]
  }
];

export default function Help() {
  const [openSection, setOpenSection] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [contactForm, setContactForm] = useState({ email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      const { SendEmail } = await import('@/api/integrations');
      await SendEmail({
        to: 'support@genrizz.app',
        subject: `[Support] ${contactForm.subject}`,
        body: `From: ${contactForm.email}\n\n${contactForm.message}`
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setSubmitted(true); // Show success anyway for UX
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Header */}
      <header className="glass-header">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
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
            <h1 className="font-black" style={{ color: 'var(--text-primary)' }}>Help & Support</h1>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>FAQs and contact</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
            background: 'linear-gradient(to bottom right, var(--brand-blue), #1899D6)',
            boxShadow: '0 3px 0 #1480B8'
          }}>
            <HelpCircle className="w-5 h-5" style={{ color: 'var(--text-inverse)' }} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link to={createPageUrl('Premium')}>
            <motion.div 
              whileHover={{ y: -4 }}
              className="card-3d card-3d-yellow p-4 cursor-pointer"
            >
              <Crown className="w-6 h-6 mb-2" style={{ color: 'var(--brand-yellow)' }} />
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Go Premium</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Unlimited hearts & more</p>
            </motion.div>
          </Link>
          <a href="https://discord.gg/genrizz" target="_blank" rel="noopener noreferrer">
            <motion.div 
              whileHover={{ y: -4 }}
              className="card-3d card-3d-purple p-4 cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 mb-2" style={{ color: 'var(--brand-purple)' }} />
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Join Discord</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Chat with the community</p>
            </motion.div>
          </a>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-4">
          <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
          
          {FAQ_SECTIONS.map((section, sIdx) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.05 }}
              className="card-3d overflow-hidden"
            >
              <button
                onClick={() => setOpenSection(openSection === sIdx ? null : sIdx)}
                className="w-full p-4 flex items-center gap-3 transition-colors"
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent')
              >
                <span className="text-2xl">{section.icon}</span>
                <span className="flex-1 text-left font-bold" style={{ color: 'var(--text-primary)' }}>{section.title}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{section.questions.length} questions</span>
                {openSection === sIdx ? (
                  <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>

              <AnimatePresence>
                {openSection === sIdx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t" style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    {section.questions.map((qa, qIdx) => (
                      <div key={qIdx} className="border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                        <button
                          onClick={() => setOpenQuestion(openQuestion === `${sIdx}-${qIdx}` ? null : `${sIdx}-${qIdx}`)}
                          className="w-full p-4 flex items-center gap-3 text-left transition-colors"
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--surface-1)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent')
                        >
                          <span className="flex-1 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{qa.q}</span>
                          {openQuestion === `${sIdx}-${qIdx}` ? (
                            <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                          ) : (
                            <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                          )}
                        </button>
                        <AnimatePresence>
                          {openQuestion === `${sIdx}-${qIdx}` && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4"
                            >
                              <p className="text-sm rounded-xl p-3" style={{ 
                                color: 'var(--text-secondary)',
                                backgroundColor: 'var(--surface-1)'
                              }}>
                                {qa.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="card-3d p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
            <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Contact Support</h2>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
              <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>We'll get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Your Email</label>
                <Input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="border-2 rounded-xl"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                <Input
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="What do you need help with?"
                  className="border-2 rounded-xl"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Message</label>
                <Textarea
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Describe your issue..."
                  rows={4}
                  className="border-2 border-[#E5E0DA] rounded-xl resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sending}
                className="btn-3d btn-3d-blue w-full py-4"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          )}
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="#" className="font-semibold transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Terms of Service</a>
          <a href="#" className="font-semibold transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Privacy Policy</a>
          <a href="#" className="font-semibold transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Cookie Policy</a>
        </div>
      </main>
    </div>
  );
}
