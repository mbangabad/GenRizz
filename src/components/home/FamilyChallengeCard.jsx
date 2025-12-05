import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FamilyChallengeCard() {
  return (
    <Link to={createPageUrl('FamilyChallenge')}>
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#64FFDA]/15 via-[#00CED1]/15 to-[#B388FF]/15 border border-[#64FFDA]/30 p-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#64FFDA]/10 via-[#00CED1]/15 to-[#B388FF]/10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className="relative">
            <motion.div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#64FFDA] to-[#00CED1] flex items-center justify-center"
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FFE066] flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-3 h-3 text-black" />
            </motion.div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#64FFDA] to-[#00CED1] text-black">
                NEW
              </span>
            </div>
            <h3 className="font-bold text-white">Parent vs Kid Challenge</h3>
            <p className="text-xs text-white/50">Who understands the other generation better?</p>
          </div>

          {/* Arrow */}
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-5 h-5 text-[#64FFDA]" />
          </motion.div>
        </div>

        {/* VS Badge */}
        <div className="absolute -bottom-2 -right-2 opacity-20">
          <span className="text-6xl font-black">VS</span>
        </div>
      </motion.div>
    </Link>
  );
}