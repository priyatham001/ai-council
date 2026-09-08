import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Award, 
  Smile, 
  Calendar, 
  Play, 
  CheckCircle2 
} from 'lucide-react';

interface HeroSectionProps {
  onOpenParentLogin: () => void;
  onOpenAdmissionModal: () => void;
  onExploreSchool: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenParentLogin,
  onOpenAdmissionModal,
  onExploreSchool
}) => {
  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Highlighted Background Typography Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none -z-10 whitespace-nowrap text-center w-full overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.03, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-heading font-black text-6xl sm:text-8xl md:text-9xl lg:text-[130px] uppercase tracking-widest text-amber-600 block leading-none filter drop-shadow-sm">
            KAVITHA FOR KIDZ
          </span>
          <span className="font-heading font-extrabold text-xl sm:text-3xl md:text-5xl text-rose-600 tracking-[0.25em] block mt-2">
            ★ K FOR KIDZ PLAY SCHOOL ★
          </span>
        </motion.div>
      </div>

      {/* Background soft pastel colorful gradient clouds & radiant glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100/60 via-orange-50/40 to-transparent -z-10" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-r from-pink-200/50 via-amber-200/60 to-sky-200/50 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-amber-300/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Badges, CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Top pill badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              {/* Highlighted Kavitha for Kidz Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-200 via-rose-100 to-amber-200 border-2 border-amber-300/90 text-amber-950 text-xs font-black shadow-sm ring-2 ring-amber-300/30"
              >
                <span className="text-base">✨</span>
                <span>K for Kidz • <strong className="text-rose-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md font-black underline decoration-amber-400 decoration-2">Kavitha for Kidz</strong></span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
                <span>Admissions 2026 - 2027</span>
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-extrabold">
                  Ages 1.5 - 5.5
                </span>
              </motion.div>
            </div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight leading-[1.15]"
            >
              Where Little Minds <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Grow, Learn & Shine!
              </span> 🌈
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Welcome to <strong className="text-slate-900 bg-amber-100/80 px-1.5 py-0.5 rounded-md">K for Kidz (Kavitha for Kidz) Play School</strong> — a joyful, safe, and nurturing wonderland designed to spark early curiosity, emotional confidence, and creative genius through play-based discovery.
            </motion.p>

            {/* Feature Checkpoints */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0 text-xs sm:text-sm font-bold text-slate-700"
            >
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-amber-100 shadow-xs">
                <span className="text-lg">🧸</span>
                <span>1:8 Child Ratio</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-amber-100 shadow-xs">
                <span className="text-lg">🛡️</span>
                <span>CCTV & RFID Safe</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-amber-100 shadow-xs col-span-2 sm:col-span-1">
                <span className="text-lg">📱</span>
                <span>Live Parent App</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3"
            >
              <button
                id="btn-hero-explore"
                onClick={onExploreSchool}
                className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Explore Our School</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-parent-login"
                onClick={onOpenParentLogin}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-amber-50/80 text-amber-800 border-2 border-amber-300 font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <span>👨‍👩‍👦 Parent Login</span>
              </button>

              <button
                id="btn-hero-book-tour"
                onClick={onOpenAdmissionModal}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>Book Campus Tour</span>
              </button>
            </motion.div>

            {/* Parent Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-3 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium"
            >
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Parent" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Parent" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100" alt="Parent" />
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-white ring-2 ring-white">
                  500+
                </div>
              </div>
              <div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
                <p>Loved by 500+ preschool parents across city</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Cheerful Visual Card with Cute Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-300 via-pink-300 to-sky-300 rounded-[40px] opacity-60 blur-xl -z-10 animate-pulse-gentle" />

              {/* Main Photo Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-3 sm:p-4 rounded-[36px] shadow-2xl border-4 border-amber-200 overflow-hidden relative"
              >
                <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] bg-amber-50">
                  <img
                    src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80"
                    alt="Happy children learning with wooden blocks at K for Kidz Play School"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4 sm:p-6">
                    <div className="text-white">
                      <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Play & Learn
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold font-heading mt-1">
                        Active Hands, Joyful Minds 🎨
                      </h3>
                      <p className="text-xs text-amber-100">Montessori & Experiential STEM Curriculum</p>
                    </div>
                  </div>
                </div>

                {/* Floating Micro Card 1: Attendance Today */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 -right-3 bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border-2 border-emerald-200 flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
                    🌟
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Today's Sunshine</p>
                    <p className="text-xs font-bold text-slate-800">96.8% Happy Attendance</p>
                  </div>
                </motion.div>

                {/* Floating Micro Card 2: Parent Portal Preview */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-3 bg-white p-3 rounded-2xl shadow-xl border-2 border-amber-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center text-xl shadow-md">
                    🧸
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[11px] font-bold text-amber-800">Parent Live Feed</p>
                    </div>
                    <p className="text-xs font-extrabold text-slate-800">Aarav finished Art Class! 🎨</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative side badge */}
              <div className="absolute -bottom-6 -right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-1.5 rotate-3">
                <span>⭐ Top Rated Preschool</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
