import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Camera,
  ShieldCheck,
  Building2,
  Users,
  Truck,
  DollarSign,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Zap,
  Layers,
  Compass,
  Play,
  Pause,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PipelineStage {
  id: string;
  stepNumber: number;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
  icon: React.ElementType;
  badge: string;
  color: 'emerald' | 'teal' | 'amber' | 'sky' | 'indigo' | 'violet' | 'green';
  metric: string;
  metricLabel: string;
}

const STAGES: PipelineStage[] = [
  {
    id: 'farm',
    stepNumber: 1,
    titleKey: 'pipeline.farm',
    defaultTitle: 'Farm Harvest',
    descKey: 'pipeline.farmDesc',
    defaultDesc: 'Geo-tagged harvest origin with verified soil, moisture and lot registry.',
    icon: Sparkles,
    badge: 'STAGE 1',
    color: 'emerald',
    metric: '100% Traceable',
    metricLabel: 'Origin GPS'
  },
  {
    id: 'vision',
    stepNumber: 2,
    titleKey: 'pipeline.aiVision',
    defaultTitle: 'AI Vision Assayer',
    descKey: 'pipeline.aiVisionDesc',
    defaultDesc: 'Multi-spectral visual inspection of crop surface luster, grain size & defects.',
    icon: Camera,
    badge: 'GEMINI AI',
    color: 'teal',
    metric: '98.4%',
    metricLabel: 'Confidence'
  },
  {
    id: 'grade',
    stepNumber: 3,
    titleKey: 'pipeline.qualityGrade',
    defaultTitle: 'Quality Grade',
    descKey: 'pipeline.qualityGradeDesc',
    defaultDesc: 'Tamper-proof Digital Quality Passport certifying Grade A/B/C with QR verification.',
    icon: ShieldCheck,
    badge: 'AGMARK',
    color: 'green',
    metric: 'Grade A',
    metricLabel: 'Premium Tier'
  },
  {
    id: 'mandi',
    stepNumber: 4,
    titleKey: 'pipeline.mandi',
    defaultTitle: 'Mandi Discovery',
    descKey: 'pipeline.mandiDesc',
    defaultDesc: 'Pan-India APMC price intelligence with live diesel freight optimization.',
    icon: Building2,
    badge: 'APMC LIVE',
    color: 'sky',
    metric: '₹2,450',
    metricLabel: 'Best Mandi Net'
  },
  {
    id: 'buyer',
    stepNumber: 5,
    titleKey: 'pipeline.buyer',
    defaultTitle: 'Verified Buyer',
    descKey: 'pipeline.buyerDesc',
    defaultDesc: 'Direct institutional procurement bids from FMCG, exporters & flour millers.',
    icon: Users,
    badge: 'DIRECT DEAL',
    color: 'indigo',
    metric: '12+ Active',
    metricLabel: 'Bids Waiting'
  },
  {
    id: 'logistics',
    stepNumber: 6,
    titleKey: 'pipeline.logistics',
    defaultTitle: 'Smart Logistics',
    descKey: 'pipeline.logisticsDesc',
    defaultDesc: 'GPS-tracked farm-gate truck pickup and nearby cold storage hub dispatch.',
    icon: Truck,
    badge: 'DISPATCH',
    color: 'amber',
    metric: '45 Km',
    metricLabel: 'Transit Radius'
  },
  {
    id: 'transaction',
    stepNumber: 7,
    titleKey: 'pipeline.transaction',
    defaultTitle: 'Instant Settlement',
    descKey: 'pipeline.transactionDesc',
    defaultDesc: 'Direct weighbridge settlement and transparent digital payment to farmer bank.',
    icon: DollarSign,
    badge: 'ESCROW PAID',
    color: 'violet',
    metric: 'T+0 Days',
    metricLabel: 'Settlement'
  }
];

export const FarmToMarket3DHero: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeStage, setActiveStage] = useState<number>(2); // Default to AI Vision
  const [isFloating, setIsFloating] = useState<boolean>(true); // 3D Floating Motion control

  const current = STAGES[activeStage] || STAGES[0];
  const CurrentIcon = current.icon;

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-2 sm:px-4">
      {/* Container with 3D perspective */}
      <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-950 text-white p-6 sm:p-8 md:p-10 border border-emerald-500/30 shadow-2xl overflow-hidden perspective-1000">
        {/* Subtle holographic glow elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Title */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>3D Farm-to-Market Intelligence Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-outfit tracking-tight text-white">
              The Transparent Agricultural Highway
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Follow your harvest from field geo-tagging through AI assaying, quality grading, verified buyer bidding, to same-day bank settlement.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300/80 bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SIH 2026 Live Protocol</span>
          </div>
        </div>

        {/* 7-Stage Horizontal Interactive Step Indicator (Mobile Scrollable) */}
        <div className="relative z-10 mb-8 overflow-x-auto pb-3 pt-1 no-scrollbar">
          <div className="flex items-center min-w-[760px] md:min-w-full justify-between relative px-2">
            {/* Connecting progress rail */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-stone-800 rounded-full -z-0">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${(activeStage / (STAGES.length - 1)) * 100}%` }}
              />
            </div>

            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isPassed = idx <= activeStage;
              const isSelected = idx === activeStage;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className="group relative z-10 flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 card-3d ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-stone-950 shadow-lg shadow-emerald-500/50 scale-110 ring-4 ring-emerald-400/30'
                        : isPassed
                        ? 'bg-emerald-800 text-emerald-100 border border-emerald-500/50'
                        : 'bg-stone-800 text-stone-400 border border-stone-700 hover:border-stone-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] sm:text-xs font-bold whitespace-nowrap transition-colors ${
                      isSelected ? 'text-amber-300 font-black' : isPassed ? 'text-stone-200' : 'text-stone-500'
                    }`}
                  >
                    {t(stage.titleKey) || stage.defaultTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Dynamic Stage Spotlight Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-stone-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-emerald-500/30 preserve-3d card-3d shadow-xl"
          >
            {/* Left Stage Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-400 text-stone-950">
                  {current.badge}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Stage {current.stepNumber} of 7
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-outfit text-white">
                {t(current.titleKey) || current.defaultTitle}
              </h3>

              <p className="text-sm text-stone-300 leading-relaxed">
                {t(current.descKey) || current.defaultDesc}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                  <span className="block text-[11px] font-medium text-stone-400">{current.metricLabel}</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">{current.metric}</span>
                </div>

                <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                  <span className="block text-[11px] font-medium text-stone-400">Platform Status</span>
                  <span className="text-lg font-black text-amber-300 font-mono">Live & Verified</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStage((prev) => (prev + 1) % STAGES.length)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Pipeline Stage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-stone-400">
                  Tap any node above to inspect
                </span>
              </div>
            </div>

            {/* Right 3D Visual Hologram Element */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center gap-3">
              <div
                onClick={() => setIsFloating(!isFloating)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsFloating(!isFloating);
                  }
                }}
                title={isFloating ? 'Click box to pause floating motion' : 'Click box to resume floating motion'}
                className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-black p-6 border-2 border-emerald-500/50 shadow-2xl flex flex-col items-center justify-center text-center preserve-3d overflow-hidden hologram-passport cursor-pointer select-none transition-all duration-300 hover:border-emerald-400 ${
                  isFloating ? 'animate-float3d' : 'transform-none shadow-emerald-900/30'
                }`}
              >
                {/* 3D Scanning Laser Beam */}
                <div
                  className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] pointer-events-none ${
                    isFloating ? 'animate-laserSweep' : 'opacity-30'
                  }`}
                  style={{ top: isFloating ? undefined : '50%' }}
                />

                {/* Rotating Orbital Rings */}
                <div
                  className={`absolute inset-4 rounded-full border border-dashed border-emerald-400/30 pointer-events-none ${
                    isFloating ? 'animate-orbital' : 'opacity-40'
                  }`}
                />
                <div className="absolute inset-10 rounded-full border border-emerald-500/20 pointer-events-none" />

                {/* Main Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-2xl mb-4 relative z-10">
                  <CurrentIcon className="w-10 h-10 text-white" />
                </div>

                <span className="text-sm font-black font-outfit text-white tracking-wide relative z-10">
                  {current.defaultTitle}
                </span>

                <span className="text-xs font-mono text-emerald-300 mt-1 relative z-10">
                  {current.metric}
                </span>

                <div className="mt-3 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-200 relative z-10">
                  SIH 2026 Verified
                </div>
              </div>

              {/* Floating Motion Control Toggle */}
              <button
                type="button"
                onClick={() => setIsFloating(!isFloating)}
                className="px-3 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 hover:text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title={isFloating ? 'Pause 3D floating movement' : 'Start 3D floating movement'}
              >
                {isFloating ? (
                  <>
                    <Pause className="w-3 h-3 text-emerald-400" />
                    <span>3D Motion: Floating (Click to Pause)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-amber-400" />
                    <span>3D Motion: Paused (Click to Float)</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
