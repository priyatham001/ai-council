import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { OrbitSystem } from './OrbitSystem';
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, Cpu } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#06150b] via-[#091b10] to-[#040e07] text-white">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Initiative Badge */}
        <div className="flex flex-col items-center justify-center text-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-medium text-emerald-300 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400/80 uppercase tracking-widest text-[10px]">Initiative:</span>
            <span className="text-white font-semibold">An Idea Forge Initiative</span>
          </motion.div>
        </div>

        {/* Main Branding & Headlines */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-2.5 mb-2"
          >
            <span className="text-4xl sm:text-5xl" role="img" aria-label="Sprout">
              🌾
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md">
              KRISHI<span className="text-emerald-400">SETU</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl font-bold text-amber-300/95 tracking-wide"
          >
            Farmer Intelligence & Smart Agriculture Platform
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-stone-300 mt-2 font-medium"
          >
            From Your Farm to the Best Market — Bridging visual AI crop quality assaying with transparent buyer contracts, APMC mandi realization & smart cold storage.
          </motion.p>
        </div>

        {/* Central Showcase Grid: Real Farmer Imagery + Interactive AI Orbit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-8">
          {/* Left Column: Real Farmer in Crop Field with Smartphone */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-4 relative group"
          >
            <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-emerald-950/40">
              <img
                src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=1000&q=80"
                alt="Indian farmer inspecting crop quality in vibrant agricultural field with mobile phone"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06150b] via-black/30 to-transparent" />

              {/* Floating Real-Time AI Tag */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-emerald-400/40 text-xs font-bold text-emerald-300">
                <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>AI Vision Active</span>
              </div>

              {/* Overlay Quality Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Assaying Standard</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 font-bold border border-emerald-500/40">
                    Grade A Confirmed
                  </span>
                </div>
                <p className="text-xs text-stone-200 mt-1 font-medium">
                  Real Indian field conditions calibrated with Agmark specifications.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Center Column: The Animated Interactive Intelligence Orb System */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-4 flex flex-col items-center justify-center"
          >
            <div className="text-center mb-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Central Intelligence Sphere
              </span>
              <p className="text-[11px] text-stone-400">
                Explore the connected orbital nodes below
              </p>
            </div>

            <OrbitSystem />
          </motion.div>

          {/* Right Column: Real Produce Inspection & Market Connection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-4 relative group"
          >
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-emerald-950/40">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80"
                alt="Farmer checking smart agricultural data and crops"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06150b] via-black/30 to-transparent" />

              {/* Floating Market Tag */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-amber-400/40 text-xs font-bold text-amber-300">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct Market Link</span>
              </div>

              {/* Overlay Statistics Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Net Realization</span>
                  <span className="text-xs font-black text-white">+18.4% Return</span>
                </div>
                <p className="text-xs text-stone-200 mt-1 font-medium">
                  Verified buyers, freight optimization, and storage arbitrage in one workflow.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Call-to-Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-6"
        >
          <Link
            to="/crop-analysis"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
          >
            <span>🌱 Start Crop Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/marketplace"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm transition-all shadow-xl shadow-amber-400/25 active:scale-95"
          >
            <span>🚜 Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open_kisan_ai'))}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-white font-bold text-sm border border-emerald-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>🤖 Talk to Kisan AI</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>
        </motion.div>

        {/* Live Trust Badges Strip */}
        <div className="mt-12 pt-6 border-t border-emerald-950/80 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Government Agmark Rules Standard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>40+ Verified Produce Standards</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>200+ Indian APMC Mandis Monitored</span>
          </div>
        </div>
      </div>
    </section>
  );
};
