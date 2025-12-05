import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Swords } from 'lucide-react';

export default function RematchButton({ 
  challengerId, 
  challengerName,
  challengerScore,
  gameId,
  onRematch 
}) {
  if (!challengerId) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onRematch}
      className="w-full btn-3d btn-3d-orange py-4 flex items-center justify-center gap-3"
    >
      <Swords className="w-5 h-5" />
      <span>Rematch {challengerName?.split(' ')[0] || 'Opponent'}</span>
      <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
        Beat {challengerScore}%
      </span>
    </motion.button>
  );
}