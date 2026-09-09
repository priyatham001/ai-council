import React from 'react';
import { Language } from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Scale,
  Camera,
  Truck,
  CheckCircle2,
  FileCheck,
  Phone,
} from 'lucide-react';

interface PlatformOverviewProps {
  language: Language;
  onStartWorkflow: (step?: number) => void;
}

export const PlatformOverview: React.FC<PlatformOverviewProps> = ({
  language,
  onStartWorkflow,
}) => {
  const t = TRANSLATIONS[language];

  const steps = [
    {
      num: '01',
      title: 'Farm Origin',
      marathi: 'शेत व स्थान',
      desc: 'GPS pin-point or automated district/taluka selection across 28 Indian states.',
      icon: '🌱',
      badge: 'Location Pin',
    },
    {
      num: '02',
      title: 'Crop & Weight',
      marathi: 'पीक व वजन',
      desc: 'Select from 40+ Indian crops with animated balance scale in Quintal, Kg, or Ton.',
      icon: '🌾',
      badge: 'Agmark Standards',
    },
    {
      num: '03',
      title: 'AI Crop Inspection',
      marathi: 'एआय पीक तपासणी',
      desc: 'Multimodal Gemini vision analysis detecting luster, moisture, defect rate & Grade (A/B/C).',
      icon: '🔬',
      badge: 'Gemini 3.5 AI',
    },
    {
      num: '04',
      title: 'Mandi Comparison',
      marathi: 'बाजार भाव तुलना',
      desc: 'Real-time road freight, mandi cess, and net payout calculation for verified buyers.',
      icon: '🏪',
      badge: 'Net Profit Engine',
    },
    {
      num: '05',
      title: 'Digital Gate Pass',
      marathi: 'डिजिटल मंडी पास',
      desc: 'APMC weighbridge QR code, verified deal stamp, haulage request, and WhatsApp slip.',
      icon: '💰',
      badge: 'Price Lock',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-950 text-white p-8 sm:p-14 border border-emerald-500/30 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IDEA FORGE • AGRICULTURAL INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit tracking-tight leading-tight">
            Forge a Smarter Future for Every Farmer.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl font-medium">
            MahaKrishi AI transforms farm harvest into guaranteed market realization with automated crop quality grading, live APMC price discovery, road haulage deduction, and digital mandi gate passes.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={() => onStartWorkflow(2)}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Inspect Crop & Check Mandi Prices</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onStartWorkflow(1)}
              className="bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3.5 rounded-2xl border border-emerald-600 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Change Farm Location</span>
            </button>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-emerald-800/60">
            <div>
              <span className="text-2xl sm:text-3xl font-black font-outfit text-amber-300 block">40+</span>
              <span className="text-xs text-emerald-200">Standardized Crops</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-outfit text-emerald-300 block">100%</span>
              <span className="text-xs text-emerald-200">APMC Verified Rates</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-outfit text-amber-300 block">3-Tier</span>
              <span className="text-xs text-emerald-200">AGMARK A/B/C Grading</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black font-outfit text-emerald-300 block">₹ Net</span>
              <span className="text-xs text-emerald-200">Freight & Cess Ledger</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Journey Architecture */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full inline-block">
            End-to-End Visual Agricultural Journey
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-outfit text-stone-900 dark:text-white">
            Farm → Crop → AI Inspection → Mandi → Price → Deal
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Every step is designed with farmer accessibility, high-contrast clarity, and deterministic mathematical accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-stone-900 rounded-2xl p-5 border-2 border-stone-200 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                    {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-stone-900 dark:text-white text-base font-outfit">
                    {step.title}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    {step.marathi}
                  </span>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] font-bold text-stone-500 dark:text-stone-400">
                <span>{step.badge}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kisan Call Center & APMC Connectivity */}
      <div className="bg-amber-50 dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 dark:border-amber-600/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-200 dark:bg-amber-950 text-stone-950 dark:text-amber-300 px-3 py-0.5 rounded-full text-xs font-extrabold">
            <span>📞</span> KISAN MITRA DESK
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-outfit text-stone-900 dark:text-white">
            Have questions about mandi rates or transport?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl">
            Our agricultural coordinators assist with gate entry, live rate disputes, and truck arrangement across all major Indian agricultural corridors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="tel:1234567890"
            className="bg-stone-950 dark:bg-amber-400 hover:bg-stone-900 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 font-black px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow transition-all hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            <span>Call 1234567890</span>
          </a>
          <button
            type="button"
            onClick={() => onStartWorkflow(2)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3.5 rounded-2xl text-sm transition-all"
          >
            Start Assessment Now
          </button>
        </div>
      </div>
    </div>
  );
};
