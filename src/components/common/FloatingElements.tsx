import React from 'react';
import { motion } from 'motion/react';

export const FloatingBackgroundElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Background Highlighted "Kavitha for Kidz" Ambient Glow Ribbons */}
      <div className="absolute -top-10 left-1/4 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-rose-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Highlighted "Kavitha for Kidz" Watermarks in Background */}
      <motion.div
        animate={{ y: [0, -18, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 right-6 md:right-24 rotate-[-6deg] pointer-events-none"
      >
        <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-amber-400/20 via-pink-400/20 to-indigo-400/20 backdrop-blur-[2px] border border-amber-300/40 text-amber-900/60 font-heading font-black text-sm md:text-lg tracking-wider shadow-sm">
          ✨ Kavitha for Kidz ✨
        </span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/2 left-2 md:left-12 rotate-[8deg] pointer-events-none"
      >
        <span className="inline-block px-4 py-1.5 rounded-2xl bg-gradient-to-r from-rose-300/20 to-orange-300/20 border border-rose-300/30 text-rose-800/50 font-heading font-extrabold text-xs md:text-base tracking-wide">
          🌟 Kavitha for Kidz
        </span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute bottom-28 right-8 md:right-36 rotate-[-4deg] pointer-events-none"
      >
        <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-indigo-300/20 via-purple-300/20 to-pink-300/20 border border-indigo-300/30 text-indigo-800/50 font-heading font-black text-xs md:text-sm tracking-wider">
          💖 Kavitha for Kidz 🎈
        </span>
      </motion.div>

      {/* Soft floating pastel clouds and stars */}
      <div className="opacity-40">
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-6 text-3xl md:text-4xl filter drop-shadow-sm"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -10, 0], rotate: [0, 10, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 right-12 text-2xl md:text-3xl"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [-4, 6, -4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 left-10 text-3xl md:text-4xl"
        >
          🎈
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], x: [0, 6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-16 text-3xl"
        >
          🌈
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-4 text-2xl opacity-60"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-2/3 right-8 text-2xl opacity-60"
        >
          🧸
        </motion.div>
      </div>
    </div>
  );
};

export const FloatingElements = FloatingBackgroundElements;

