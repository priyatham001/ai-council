import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SCHOOL_PROGRAMS } from '../../data/mockData';
import { Clock, Users, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface ProgramsSectionProps {
  onOpenAdmissionModal: () => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onOpenAdmissionModal }) => {
  const [activeTab, setActiveTab] = useState(SCHOOL_PROGRAMS[0].id);

  const currentProgram = SCHOOL_PROGRAMS.find(p => p.id === activeTab) || SCHOOL_PROGRAMS[0];

  return (
    <section id="programs" className="py-16 md:py-24 bg-amber-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span>🎒</span>
            <span>Age-Appropriate Learning Paths</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-800 tracking-tight mb-4">
            Curated Programs for Every Stage of Wonder 🌟
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From first steps in our Toddler Playgroup to confident Grade 1 readiness in Senior KG, our curriculum aligns with each developmental milestone.
          </p>
        </div>

        {/* Program Selection Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {SCHOOL_PROGRAMS.map((prog) => {
            const isActive = prog.id === activeTab;
            return (
              <button
                key={prog.id}
                onClick={() => setActiveTab(prog.id)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                    : 'bg-white text-slate-700 hover:bg-amber-100/60 border border-slate-200'
                }`}
              >
                <span>{prog.emoji}</span>
                <span>{prog.title.split('(')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Program Featured Card */}
        <motion.div
          key={currentProgram.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-gradient-to-br ${currentProgram.bgGradient} rounded-[36px] p-6 sm:p-10 border-2 shadow-sm`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentProgram.badgeColor}`}>
                  {currentProgram.ageGroup}
                </span>
                <span className="bg-white/80 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {currentProgram.timings}
                </span>
                <span className="bg-white/80 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  {currentProgram.ratio}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-800 flex items-center gap-2">
                <span>{currentProgram.emoji}</span>
                <span>{currentProgram.title}</span>
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {currentProgram.description}
              </p>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
                  Key Focus Areas & Activities:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentProgram.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-100 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  id={`btn-enroll-${currentProgram.id}`}
                  onClick={onOpenAdmissionModal}
                  className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enquire for {currentProgram.title.split('(')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Program Image with soft frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3]">
                <img
                  src={currentProgram.image}
                  alt={currentProgram.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                  {currentProgram.ageGroup}
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
