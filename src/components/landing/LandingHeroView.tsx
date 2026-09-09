import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  MapPin,
  Camera,
  TrendingUp,
  ShieldCheck,
  Navigation,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sun,
  Cloud,
  Layers,
  Search,
  Scale,
  Cpu,
  BarChart3,
  Building2,
  Compass,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Language, LocationData } from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';

interface LandingHeroViewProps {
  language: Language;
  onStartJourney: () => void;
  onDetectLocation: () => void;
  isDetectingGps: boolean;
  currentLocation: LocationData;
}

export const LandingHeroView: React.FC<LandingHeroViewProps> = ({
  language,
  onStartJourney,
  onDetectLocation,
  isDetectingGps,
  currentLocation,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'features' | 'howItWorks' | 'trust' | 'team'>('features');

  const capabilities = [
    {
      icon: Cpu,
      title: 'AI Crop Intelligence',
      badge: 'Gemini Vision',
      color: 'emerald',
      desc: 'Instant visual grading of your harvest. Detects surface luster, moisture, and AGMARK maturity benchmarks from a single field photo.',
    },
    {
      icon: MapPin,
      title: 'Smart Location Discovery',
      badge: 'Field GPS',
      color: 'amber',
      desc: 'Identifies your exact village, taluka, and district across India. Pre-calibrates distance and highway freight factors.',
    },
    {
      icon: Compass,
      title: 'Geographic Intelligence',
      badge: 'GIS Routing',
      color: 'sky',
      desc: 'Calculates real road distance and truck transit times to nearby APMC mandis using live road network coordinates.',
    },
    {
      icon: Building2,
      title: 'Mandi Discovery',
      badge: 'APMC Network',
      color: 'emerald',
      desc: 'Compares multiple regional and terminal agricultural markets to find where your produce commands the highest demand.',
    },
    {
      icon: TrendingUp,
      title: 'Market Comparison',
      badge: 'Net Profit',
      color: 'amber',
      desc: 'Transparent price breakdown factoring in gross modal rates, loading/unloading fees, mandi cess, and diesel transport costs.',
    },
    {
      icon: FileText,
      title: 'Verified Dispatch Slip',
      badge: 'Farmer Slip',
      color: 'sky',
      desc: 'Generates a ready-to-present printable dispatch report with locked pricing formulas and GPS navigation links.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Safety & Transparency',
      badge: 'Advisory Guard',
      color: 'emerald',
      desc: 'Flags rot and fungal mold to prevent fraudulent grading. Assayer manual confirmation ensures the farmer always has the final word.',
    },
    {
      icon: Navigation,
      title: 'Smart Journey Guidance',
      badge: 'End-to-End',
      color: 'amber',
      desc: 'Seamless guided flow from farm origin to destination weighbridge, optimized for both smartphones and low-connectivity regions.',
    },
  ];

  const workflowSteps = [
    { step: 1, icon: '🌱', title: 'Farm Origin', desc: 'Identify state, district, taluka & village' },
    { step: 2, icon: '🌾', title: 'Crop & Lot', desc: 'Specify crop variety & standardized weight' },
    { step: 3, icon: '📷', title: 'Field Photo', desc: 'Capture clear camera photo in natural sunlight' },
    { step: 4, icon: '🤖', title: 'AI Inspection', desc: '8-stage neural scan for luster, rot & uniformity' },
    { step: 5, icon: '🏪', title: 'Mandi Discovery', desc: 'Search nearby verified APMC market yards' },
    { step: 6, icon: '💰', title: 'Best Deal', desc: 'Compare take-home profit after freight deductions' },
    { step: 7, icon: '🗺️', title: 'Interactive Map', desc: 'View farm-to-mandi route with live GPS coordinates' },
    { step: 8, icon: '📊', title: 'Dispatch Slip', desc: 'Print verified receipt & travel directions' },
  ];

  const techAreas = [
    { label: 'Artificial Intelligence', icon: '🤖', detail: 'Multimodal Vision Models & Grounded Retrieval' },
    { label: 'Geographic Intelligence', icon: '🗺️', detail: 'Google Maps Routes API & Administrative GIS' },
    { label: 'Agritech Domain', icon: '🌾', detail: 'Agmarknet Standards & MSP Benchmark Indices' },
    { label: 'Data Engineering', icon: '📊', detail: 'Real-time Mandi Price Aggregation & Freight Math' },
    { label: 'Farmer First Design', icon: '👨‍🌾', detail: 'Multilingual UI & High-Contrast Touch Controls' },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: PEACEFUL INDIAN FARM WITH DYNAMIC ANIMATED LANDSCAPE */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/80 shadow-2xl">
        {/* Animated Sky Background & Farm Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Glowing Sun / Dawn Ray */}
          <div className="absolute top-[-10%] right-[10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-400/20 blur-3xl animate-sun-pulse pointer-events-none" />
          
          {/* Subtle Floating Clouds */}
          <div className="absolute top-12 left-10 text-emerald-300/20 animate-cloud-drift hidden md:block">
            <Cloud className="w-28 h-28" />
          </div>
          <div className="absolute top-24 right-1/4 text-emerald-200/15 animate-cloud-drift hidden sm:block" style={{ animationDuration: '22s' }}>
            <Cloud className="w-20 h-20" />
          </div>

          {/* Farm Grid Texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Golden Wheat Field Silhouette at the bottom */}
          <div className="absolute -bottom-6 left-0 right-0 h-32 opacity-30 flex justify-around text-4xl select-none">
            {['🌾', '🌱', '🌾', '🌾', '🌱', '🌾', '🌾', '🌱', '🌾', '🌾', '🌱', '🌾'].map((icon, i) => (
              <span
                key={i}
                className={i % 2 === 0 ? 'animate-crop-sway' : 'animate-crop-sway-delayed'}
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto z-10">
          {/* Brand Tagline Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              <span>Built by IDEA FORGE</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-700 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
              <span>🌾 National Agri-Tech Platform</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Hero Copy & Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit tracking-tight leading-[1.1] text-white">
                Forge a Smarter Future for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300">
                  Every Farmer.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
                AI-powered crop quality assessment, intelligent location discovery and better market opportunities — built specifically for Indian agriculture.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onStartJourney}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="text-lg">🌾</span>
                  <span>Start Farming Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onDetectLocation}
                  disabled={isDetectingGps}
                  className="px-5 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 text-emerald-100 border border-emerald-600 font-bold text-sm sm:text-base flex items-center gap-2 backdrop-blur-sm transition-all hover:border-amber-400/50"
                >
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isDetectingGps ? 'Detecting Farm GPS...' : 'Detect My Location'}</span>
                </button>
              </div>

              {/* Live Location Glimpse */}
              <div className="pt-2 flex items-center gap-3 text-xs text-emerald-200/80">
                <div className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-700/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Current Origin: </span>
                  <strong className="text-white font-semibold">
                    {currentLocation.city || currentLocation.district || currentLocation.state}
                  </strong>
                  <span className="text-emerald-400">({currentLocation.state})</span>
                </div>
                <a
                  href="tel:1234567890"
                  className="hidden sm:flex items-center gap-1 text-amber-300 hover:underline font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Support: 1234567890</span>
                </a>
              </div>
            </div>

            {/* Right Col: Interactive Visual Chamber Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-stone-900/80 backdrop-blur-md rounded-3xl p-6 border-2 border-emerald-500/40 shadow-2xl space-y-4">
                {/* Glowing status header */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚒️</span>
                    <div>
                      <span className="text-xs font-extrabold text-white block">MahaKrishi AI Vision</span>
                      <span className="text-[10px] text-emerald-400 font-mono">NEURAL INSPECTION CHAMBER</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    LIVE SYSTEM
                  </span>
                </div>

                {/* Illustrated Field to Market Journey */}
                <div className="relative rounded-2xl bg-stone-950/90 p-4 border border-stone-800 overflow-hidden space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-300 font-semibold">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="animate-ping w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      FARM ORIGIN
                    </span>
                    <span className="text-stone-500">→</span>
                    <span className="text-amber-300">AI CAMERA</span>
                    <span className="text-stone-500">→</span>
                    <span className="text-sky-400">APMC MANDI</span>
                  </div>

                  {/* Visual Crop Sample Graphic */}
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-tr from-emerald-950 to-amber-950/40 h-32 border border-stone-700 flex items-center justify-center">
                    <span className="text-6xl animate-crop-sway select-none">🌾</span>
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-scan-laser border-t-2 border-emerald-400" />
                    <div className="absolute bottom-2 left-2 bg-stone-900/90 text-white text-[10px] px-2 py-0.5 rounded font-mono border border-stone-700">
                      SCAN: Grade A • Standard FAQ (+5% Prem)
                    </div>
                  </div>

                  {/* Metric Chips */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Freshness</span>
                      <span className="text-emerald-400 font-bold">98% High</span>
                    </div>
                    <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Maturity</span>
                      <span className="text-amber-300 font-bold">Optimal</span>
                    </div>
                    <div className="bg-stone-900 p-2 rounded-lg border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Rot/Mold</span>
                      <span className="text-emerald-400 font-bold">0% None</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={onStartJourney}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider transition-colors shadow"
                  >
                    Launch Crop Valuation →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. "POWERED BY IDEA FORGE" BRAND MOMENT */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-700/50 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest block mb-1">
              BUILT BY IDEA FORGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit">
              Forging Technology for Real-World Indian Agriculture
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Combining cutting-edge multimodal artificial intelligence with hyper-local GIS coordinates to eliminate middlemen exploitation.
            </p>
          </div>

          {/* Interconnected Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[
              { icon: '🌱', label: 'Agriculture', sub: 'Agronomic Logic' },
              { icon: '🤖', label: 'Artificial Intelligence', sub: 'Multimodal Gemini' },
              { icon: '🗺️', label: 'Location Intelligence', sub: 'India-wide GIS' },
              { icon: '🏪', label: 'Market Discovery', sub: 'APMC Network' },
              { icon: '📊', label: 'Data Intelligence', sub: 'Net Profit Math' },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="bg-stone-800/80 hover:bg-stone-800 p-4 rounded-2xl border border-stone-700/70 transition-all hover:border-amber-400/50"
              >
                <div className="text-2xl mb-1.5">{pillar.icon}</div>
                <div className="font-bold text-xs text-white">{pillar.label}</div>
                <div className="text-[10px] text-amber-300/90 font-mono mt-0.5">{pillar.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE SECTION TABS: FEATURES / HOW IT WORKS / TRUST / TEAM */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
          {[
            { id: 'features', label: 'Flagship Features' },
            { id: 'howItWorks', label: 'How It Works (Timeline)' },
            { id: 'trust', label: 'Built for Trust' },
            { id: 'team', label: 'About IDEA FORGE' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Features Showcase */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white font-outfit">
                Empowering the Farmer with Intelligent Tools
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Every tool is grounded in actual APMC market data, deterministic pricing rules, and real road coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        {cap.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white group-hover:text-emerald-700 transition-colors">
                      {cap.title}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: How It Works Timeline */}
        {activeTab === 'howItWorks' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white font-outfit">
                From Seed to Highest Mandi Payout
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                An 8-step transparent journey engineered to eliminate guesswork.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {workflowSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 relative hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">
                      {item.step}
                    </span>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 dark:text-white text-sm">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={onStartJourney}
                className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow"
              >
                <span>Begin Your Journey Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Built for Trust */}
        {activeTab === 'trust' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white font-outfit">
                Built for Trust & Transparency
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Farmer credibility is our highest priority. We never invent fictitious rates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'AI is Advisory & Transparent',
                  icon: HelpCircle,
                  desc: 'Our Gemini Vision AI provides advisory surface grading based on color and defects. It explicitly reminds farmers that it does not replace certified laboratory testing.',
                },
                {
                  title: 'Real Geographic Location Data',
                  icon: MapPin,
                  desc: 'Locations are validated using real administrative databases and Google Maps geocoding across Maharashtra, Andhra Pradesh, and India.',
                },
                {
                  title: 'Zero Fake Market Prices',
                  icon: TrendingUp,
                  desc: 'Market prices and modal values are derived from authentic APMC market records. When real-time data is unavailable, it is clearly noted rather than fabricated.',
                },
                {
                  title: 'Farmer Has Final Say',
                  icon: CheckCircle2,
                  desc: 'Every AI assessment requires farmer or assayer inspection and confirmation before proceeding to market calculation. You control your crop lot.',
                },
              ].map((trustItem, idx) => {
                const Icon = trustItem.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        {trustItem.title}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                        {trustItem.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: About IDEA FORGE */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold uppercase">
                ENGINEERING EXCELLENCE
              </span>
              <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white font-outfit">
                About IDEA FORGE
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Technology forged for real-world agricultural challenges.
              </p>
            </div>

            <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold">
                    <span>⚒️ IDEA FORGE CREED</span>
                  </div>
                  <h4 className="text-xl font-bold font-outfit">
                    Bridging Bharat with Modern Machine Intelligence
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    At IDEA FORGE, we believe that world-class artificial intelligence should not be restricted to financial trading floors or corporate headquarters. Our mission is delivering high-impact, fault-tolerant digital infrastructure into the hands of the Indian farmer.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {techAreas.map((area, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span>{area.icon}</span>
                        <span className="font-bold text-stone-100">{area.label}</span>
                      </div>
                      <span className="text-[11px] text-amber-300/80 font-mono">{area.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
                <span>Direct Farmer Helpline: <a href="tel:1234567890" className="text-amber-400 font-bold hover:underline">1234567890</a></span>
                <span className="font-mono text-[11px]">VERSION 2.4 • PRODUCTION AGRITECH STACK</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
