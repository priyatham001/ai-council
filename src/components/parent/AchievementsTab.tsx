import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { AchievementBadge, Student } from '../../types';
import { Award, Sparkles, Star, Trophy, Calendar, CheckCircle2, Download } from 'lucide-react';

interface AchievementsTabProps {
  child: Student;
  badges: AchievementBadge[];
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ child, badges }) => {
  const triggerConfetti = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { x, y },
      colors: ['#fbbf24', '#f472b6', '#38bdf8', '#34d399', '#a78bfa']
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            Wall of Fame 🏆
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            {child.name}’s Star Badges & Certificates
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-lg">
            Celebrating early achievements in kindness, curiosity, creativity, reading, and healthy habits! Tap any badge to celebrate! 🎉
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/95 text-slate-800 p-4 rounded-2xl shadow-xl border-2 border-amber-200">
          <div className="text-3xl">⭐</div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Badges Earned</span>
            <span className="text-2xl font-black text-amber-900">{badges.length} Honors</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ scale: 1.03, rotate: 0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={triggerConfetti}
            className="group bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top decorative badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-sm group-hover:animate-bounce">
                {badge.badgeEmoji}
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${badge.color}`}>
                {badge.category}
              </span>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-slate-800 group-hover:text-amber-600 transition-colors mb-1.5">
                {badge.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {badge.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-500" />
                {badge.awardedDate}
              </span>
              <span className="text-amber-700 font-bold">
                By {badge.awardedBy.split(' ')[1] || 'Teacher'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Download Certificate Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
            📜
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-slate-800">
              Preschool Term Honor Certificate
            </h4>
            <p className="text-xs text-slate-500">
              Official certificate signed by Principal & Class Lead Ms. Priya
            </p>
          </div>
        </div>

        <button
          onClick={triggerConfetti}
          className="py-2.5 px-5 rounded-2xl bg-white hover:bg-amber-100 text-amber-900 border-2 border-amber-300 font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
        >
          <Download className="w-4 h-4 text-amber-600" />
          <span>Save Printable Certificate</span>
        </button>
      </div>
    </div>
  );
};
