import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface IntelligenceOrbProps {
  onOrbClick?: () => void;
  activeLabel?: string;
}

export const IntelligenceOrb: React.FC<IntelligenceOrbProps> = ({
  onOrbClick,
  activeLabel = 'Krishi AI Core',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOrbClick}
      title="AgriConnect Intelligence Core - Tap to interact"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOrbClick?.();
        }
      }}
    >
      {/* Outer ambient glow halo */}
      <div
        className={`absolute inset-[-20px] rounded-full transition-opacity duration-700 pointer-events-none blur-2xl ${
          isHovered
            ? 'opacity-80 bg-emerald-500/30'
            : 'opacity-40 bg-emerald-600/20'
        }`}
      />

      {/* Outer rotating pulse ring with dashed border */}
      <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-dashed border-emerald-400/30 animate-ring-spin-slow pointer-events-none" />

      {/* Middle reverse counter-spinning accent ring */}
      <div className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-amber-400/25 animate-ring-spin-reverse pointer-events-none" />

      {/* Main Core Spherical Orb */}
      <motion.div
        animate={{
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-emerald-950 via-emerald-800 to-amber-600 p-[2px] shadow-2xl animate-orb-pulse flex items-center justify-center overflow-hidden"
      >
        {/* Inner holographic glass shimmer */}
        <div className="absolute inset-0 rounded-full bg-radial from-emerald-400/30 via-transparent to-black/60" />

        {/* Diagonal glass light highlight */}
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-white/15 rounded-full blur-md transform rotate-45 pointer-events-none" />

        {/* Center icon & emblem */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center p-2">
          <motion.div
            animate={{
              rotate: isHovered ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-emerald-400/40 flex items-center justify-center shadow-inner"
          >
            <span className="text-xl sm:text-2xl" role="img" aria-label="Sprout">
              🌾
            </span>
          </motion.div>

          <span className="mt-1.5 text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-emerald-200 drop-shadow">
            {activeLabel}
          </span>

          <div className="flex items-center gap-1 mt-0.5 text-[9px] text-amber-300 font-semibold">
            <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            <span>AI Powered</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
