import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Camera,
  ShieldCheck,
  Truck,
  Building2,
  Cpu,
  BarChart3,
  CheckCircle2,
  Users,
  Package,
  FileCheck,
  ChevronRight,
  Phone,
  HelpCircle,
  Clock,
  Layers,
  Award,
  DollarSign,
  Compass,
  Store,
  Info,
  ExternalLink,
} from 'lucide-react';
import { KrishiSetuAI } from '../../components/ai/KrishiSetuAI';

interface OrbitalModule {
  id: string;
  name: string;
  badge: string;
  icon: any;
  angle: number; // degrees
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  stat: string;
  statLabel: string;
}

const ORBITAL_MODULES: OrbitalModule[] = [
  {
    id: 'crop',
    name: '🌱 Crop Intelligence',
    badge: 'Gemini Vision',
    icon: Camera,
    angle: 0,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/80',
    borderColor: 'border-emerald-500/40',
    description: 'Instant visual grading from a harvest photo. Scans surface luster, grain uniformity, and AGMARK maturity benchmarks.',
    stat: '98.4%',
    statLabel: 'AI Assayer Accuracy',
  },
  {
    id: 'ai',
    name: '🤖 Kisan AI',
    badge: 'Farming Companion',
    icon: Cpu,
    angle: 72,
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/80',
    borderColor: 'border-amber-500/40',
    description: 'Multilingual conversational intelligence for advisory, pest symptoms, mandi bargaining, and seasonal sowing advice.',
    stat: '7 Languages',
    statLabel: 'Pan-India Dialects',
  },
  {
    id: 'market',
    name: '📊 Market Intelligence',
    badge: 'APMC Arbitrage',
    icon: Building2,
    angle: 144,
    color: 'text-sky-400',
    bgColor: 'bg-sky-950/80',
    borderColor: 'border-sky-500/40',
    description: 'Live modal price tracking across 2,400+ APMC mandis. Dynamically compares terminal markets with local yards.',
    stat: '2,400+',
    statLabel: 'Connected Mandis',
  },
  {
    id: 'transport',
    name: '🚚 Transport Intelligence',
    badge: 'Freight Optimization',
    icon: Truck,
    angle: 216,
    color: 'text-orange-400',
    bgColor: 'bg-orange-950/80',
    borderColor: 'border-orange-500/40',
    description: 'Calculates real-world highway transit costs, diesel consumption, loading fees, and travel duration by vehicle tonnage.',
    stat: '₹14-22/km',
    statLabel: 'Standardized Freight',
  },
  {
    id: 'return',
    name: '💰 Net Realization',
    badge: 'Profit Maximizer',
    icon: TrendingUp,
    angle: 288,
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-900/90',
    borderColor: 'border-emerald-400/50',
    description: 'Formula-locked math: Gross Mandi Value minus Diesel Freight, Mandi Cess, and Hamali unloads to uncover true take-home pay.',
    stat: '+18-28%',
    statLabel: 'Higher Net Income',
  },
];

const LIVE_TICKER_ITEMS = [
  { crop: 'Paddy (Sona Masuri)', mandi: 'Kadapa APMC', state: 'Andhra Pradesh', price: '₹2,480/q', change: '+3.2%', trend: 'up' },
  { crop: 'Tomato (Hybrid)', mandi: 'Madanapalle APMC', state: 'Andhra Pradesh', price: '₹1,850/q', change: '+5.7%', trend: 'up' },
  { crop: 'Wheat (Sharbati)', mandi: 'Indore APMC', state: 'Madhya Pradesh', price: '₹2,720/q', change: '+1.4%', trend: 'up' },
  { crop: 'Red Onion (Nashik)', mandi: 'Lasalgaon APMC', state: 'Maharashtra', price: '₹2,150/q', change: '-2.1%', trend: 'down' },
  { crop: 'Cotton (Medium Staple)', mandi: 'Guntur APMC', state: 'Andhra Pradesh', price: '₹7,420/q', change: '+4.1%', trend: 'up' },
  { crop: 'Soybean (Yellow)', mandi: 'Latur APMC', state: 'Maharashtra', price: '₹4,680/q', change: '+0.8%', trend: 'up' },
  { crop: 'Chilli (Teja Variety)', mandi: 'Warangal APMC', state: 'Telangana', price: '₹16,800/q', change: '+6.2%', trend: 'up' },
  { crop: 'Maize (Yellow Feed)', mandi: 'Kurnool APMC', state: 'Andhra Pradesh', price: '₹2,180/q', change: '+1.9%', trend: 'up' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<OrbitalModule>(ORBITAL_MODULES[0]);
  const [isOrbHovered, setIsOrbHovered] = useState(false);
  const [rotationOffset, setRotationOffset] = useState(0);

  // Auto slow orbital movement
  useEffect(() => {
    if (isOrbHovered) return;
    const interval = setInterval(() => {
      setRotationOffset((prev) => (prev + 0.25) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isOrbHovered]);

  return (
    <div className="min-h-screen bg-[#07130c] text-stone-100 flex flex-col selection:bg-emerald-500 selection:text-stone-950">
      {/* 1. TOP UNIFIED NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#07130c]/90 backdrop-blur-md border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#07130c] rounded-[14px] flex items-center justify-center text-xl">
                    <span>🌾</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-outfit">
                      KRISHI<span className="text-emerald-400">SETU</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 hidden sm:inline-block">
                      Idea Forge
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 font-medium hidden md:block">
                    Farmer Intelligence & Agricultural Marketplace Platform
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                to="/"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-900/40 border border-emerald-700/50"
              >
                Home
              </Link>
              <Link
                to="/farmer"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-200 hover:text-white hover:bg-emerald-900/30 transition-colors flex items-center gap-1.5"
              >
                <span>👨‍🌾</span>
                <span>Farmer Portal</span>
              </Link>
              <Link
                to="/buyers"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:text-white hover:bg-amber-900/30 transition-colors flex items-center gap-1.5"
              >
                <span>🏪</span>
                <span>Buyer Marketplace</span>
              </Link>
              <Link
                to="/markets"
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/40 transition-colors"
              >
                Mandi Benchmark
              </Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open_kisan_ai'))}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/60 border border-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>🤖</span>
                <span>Kisan AI</span>
              </button>
              <Link
                to="/about"
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/40 transition-colors"
              >
                About
              </Link>
              <Link
                to="/how-it-works"
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/40 transition-colors"
              >
                Help
              </Link>
            </nav>

            {/* Quick CTAs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/crop-analysis')}
                className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
              >
                <span>🌱</span>
                <span className="hidden sm:inline">Start Analysis</span>
                <span className="sm:hidden">Analysis</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
              >
                <span>🚜</span>
                <span className="hidden sm:inline">Marketplace</span>
                <span className="sm:hidden">Market</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. LIVE APMC MANDI TICKER */}
      <div className="bg-[#0b1d12] border-b border-emerald-900/60 overflow-hidden py-2 text-xs">
        <div className="flex items-center gap-6 whitespace-nowrap animate-[marquee_28s_linear_infinite]">
          <div className="flex items-center gap-2 text-amber-400 font-bold px-3 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-[11px]">
            <span>🔴 LIVE APMC MANDI RATES</span>
          </div>
          {LIVE_TICKER_ITEMS.concat(LIVE_TICKER_ITEMS).map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 text-stone-300">
              <span className="font-semibold text-white">{item.crop}</span>
              <span className="text-emerald-400 font-mono font-bold">{item.price}</span>
              <span className="text-[10px] text-stone-400">({item.mandi})</span>
              <span className={`text-[10px] font-bold ${item.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.change}
              </span>
              <span className="text-emerald-800">•</span>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1">
        {/* 3. HERO: ORGANIC INTELLIGENCE ENVIRONMENT */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-emerald-900/40">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-600/15 via-emerald-800/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Core Header Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>ORGANIC INTELLIGENCE PLATFORM</span>
                <span className="text-emerald-700">•</span>
                <span className="text-stone-400">Gemini Vision + Mandi GIS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-outfit leading-tight">
                From Your Farm to the{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
                  Best Market
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-stone-300 font-normal leading-relaxed">
                KrishiSetu brings crop intelligence, AI-powered quality analysis, market insights, transportation intelligence, and farmer marketplace services together in one powerful platform.
              </p>
            </div>

            {/* 4. THE TWO MAJOR EXPERIENCE CARDS (STEP 3 MANDATORY) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-10 max-w-5xl mx-auto">
              {/* CARD 1: FARM INTELLIGENCE */}
              <div className="group relative rounded-3xl bg-gradient-to-b from-emerald-900/60 to-[#0a1f13] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl hover:shadow-emerald-900/40 hover:border-emerald-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner">
                      <span>🌾</span>
                    </div>
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
                      Farmer Flow
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
                      Farmer: Sell Crop & Compare Mandis
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-300/80 font-medium mt-1">
                      Village → Crop → Kisan AI Quality Check → Mandi Comparison → Marketplace Listing
                    </p>
                  </div>

                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    Simplified 3-step crop declaration, transparent visual AI quality check (Grade A/B/C), real-time APMC mandi net realization calculation, and direct marketplace lot publishing.
                  </p>

                  {/* Flow Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Village GPS', 'Kisan AI Quality', 'APMC Mandi Net Profit', 'Deal Slip', 'Publish Digital Lot'].map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-200 border border-emerald-800/80"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    onClick={() => navigate('/farmer')}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-stone-950 font-black text-base shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group-hover:translate-x-0.5 active:scale-98 cursor-pointer"
                  >
                    <span>Start Farmer Sell Flow</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* CARD 2: BUYER MARKETPLACE */}
              <div className="group relative rounded-3xl bg-gradient-to-b from-amber-950/60 to-[#19150b] border border-amber-500/40 p-6 sm:p-8 shadow-2xl hover:shadow-amber-900/40 hover:border-amber-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner">
                      <span>🏪</span>
                    </div>
                    <span className="text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                      Institutional Buyers
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-outfit">
                      Buyers: Sourcing & Bidding Portal
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-300/80 font-medium mt-1">
                      Explore Lots → Place Bids → Request Demand → Direct Farmgate Contracts
                    </p>
                  </div>

                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    Browse AI-verified farmer crop lots across India, submit competitive bids with escrow security, or publish institutional procurement demand directly to farmer clusters.
                  </p>

                  {/* Flow Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Verified Lots', 'Direct Bidding', 'Demand Broadcasts', 'Transport Logistics', 'Smart Settlement'].map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-950/80 text-amber-200 border border-amber-800/80"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    onClick={() => navigate('/buyers')}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-base shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group-hover:translate-x-0.5 active:scale-98 cursor-pointer"
                  >
                    <span>Explore Buyer Marketplace</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 5. INTERACTIVE AGRICULTURAL INTELLIGENCE ORB & ORBITAL SYSTEM */}
            <div className="mt-16 lg:mt-24 max-w-6xl mx-auto">
              <div className="text-center space-y-2 mb-8">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                  KRISHISETU CORE ARCHITECTURE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
                  Interactive Intelligence Orb
                </h2>
                <p className="text-sm text-stone-300 max-w-xl mx-auto">
                  Hover or select any satellite capability to examine how KrishiSetu connects on-field harvest data to guaranteed maximum profits.
                </p>
              </div>

              <div
                className="relative bg-gradient-to-b from-[#0a1d12]/90 via-[#07130c] to-[#0a1d12]/90 rounded-3xl border border-emerald-800/50 p-6 sm:p-10 shadow-2xl overflow-hidden"
                onMouseEnter={() => setIsOrbHovered(true)}
                onMouseLeave={() => setIsOrbHovered(false)}
              >
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  {/* Left Column: Interactive Orb Visualization */}
                  <div className="lg:col-span-7 flex items-center justify-center py-6">
                    <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
                      {/* Outer Orbit Rings */}
                      <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/25 animate-[spin_60s_linear_infinite]" />
                      <div className="absolute inset-6 rounded-full border border-emerald-500/15" />
                      <div className="absolute inset-16 rounded-full border border-emerald-500/20" />

                      {/* Central Intelligence Core Sphere */}
                      <motion.div
                        className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-emerald-900 via-emerald-600 to-amber-500 shadow-[0_0_60px_rgba(16,185,129,0.5)] border-2 border-emerald-300/60 flex flex-col items-center justify-center p-3 text-center cursor-pointer"
                        animate={{
                          scale: [1, 1.04, 1],
                          boxShadow: [
                            '0 0 40px rgba(16,185,129,0.3)',
                            '0 0 65px rgba(16,185,129,0.6)',
                            '0 0 40px rgba(16,185,129,0.3)',
                          ],
                        }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      >
                        <span className="text-3xl sm:text-4xl">🌾</span>
                        <span className="text-xs sm:text-sm font-black text-white font-outfit tracking-tight mt-1">
                          KRISHISETU
                        </span>
                        <span className="text-[9px] font-mono text-emerald-200 font-bold uppercase tracking-wider">
                          Core Engine
                        </span>
                      </motion.div>

                      {/* 5 Orbiting Modules */}
                      {ORBITAL_MODULES.map((mod, index) => {
                        const currentAngle = (mod.angle + rotationOffset) * (Math.PI / 180);
                        const radius = 135; // px from center
                        const x = Math.cos(currentAngle) * radius;
                        const y = Math.sin(currentAngle) * radius;
                        const isSelected = activeModule.id === mod.id;

                        const IconComp = mod.icon;

                        return (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() => setActiveModule(mod)}
                            style={{
                              transform: `translate(${x}px, ${y}px)`,
                            }}
                            className={`absolute z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-lg cursor-pointer ${
                              isSelected
                                ? `${mod.bgColor} ${mod.borderColor} ring-2 ring-emerald-400 scale-110 shadow-emerald-500/30`
                                : 'bg-[#0a1e12]/90 border-emerald-800/80 hover:border-emerald-400 hover:scale-105'
                            }`}
                            title={mod.name}
                          >
                            <IconComp className={`w-5 h-5 sm:w-6 sm:h-6 ${mod.color}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Selected Module Details Card */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-[#0b2114] border border-emerald-600/40 rounded-2xl p-6 shadow-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {activeModule.badge}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-stone-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active Module</span>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white font-outfit">
                        {activeModule.name}
                      </h3>

                      <p className="text-sm text-stone-300 leading-relaxed">
                        {activeModule.description}
                      </p>

                      <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-900/80 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-stone-400 font-medium">
                            {activeModule.statLabel}
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-black text-emerald-400">
                            {activeModule.stat}
                          </div>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigate('/crop-analysis')}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Explore in Analysis</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/marketplace')}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Go to Marketplace</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. AUTHENTIC INDIAN FARMER PHOTOGRAPHY & REAL AGRICULTURAL VISUALS */}
        <section className="py-16 lg:py-24 bg-[#09170e] border-b border-emerald-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                REAL FARMERS • REAL CROPS • REAL DECISIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit">
                Empowering India&apos;s Agricultural Heartland
              </h2>
              <p className="text-sm sm:text-base text-stone-300">
                KrishiSetu connects actual farmers in Andhra Pradesh, Maharashtra, Karnataka, Telangana, Madhya Pradesh and beyond with verified Assayer intelligence and terminal mandis.
              </p>
            </div>

            {/* Visual Photo Grid with Real Context */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo 1: Indian Farmer Inspecting Crops in Field */}
              <div className="group relative rounded-3xl overflow-hidden border border-emerald-800/60 shadow-xl bg-black/40 flex flex-col justify-end min-h-[360px]">
                <img
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"
                  alt="Indian farmer inspecting crop quality in agricultural field"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07130c] via-[#07130c]/50 to-transparent" />

                <div className="relative z-10 p-6 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Field-Level Discovery
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Ramesh Varma • YSR Kadapa, AP
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    &ldquo;Scanning our Paddy crop with the AI camera instantly confirmed AGMARK Grade A. Transport costs were pre-calculated to Kurnool APMC for maximum profit.&rdquo;
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-emerald-400">
                    <span>Crop: Sona Masuri</span>
                    <span className="font-bold">+₹14,500 Extra Return</span>
                  </div>
                </div>
              </div>

              {/* Photo 2: Fresh Vegetable Harvest Quality Checking */}
              <div className="group relative rounded-3xl overflow-hidden border border-emerald-800/60 shadow-xl bg-black/40 flex flex-col justify-end min-h-[360px]">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80"
                  alt="Farmer inspecting fresh produce and crops"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07130c] via-[#07130c]/50 to-transparent" />

                <div className="relative z-10 p-6 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Transparent Quality Grading
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Suresh Patil • Nashik, Maharashtra
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    &ldquo;No more middlemen cutting prices under the guise of poor quality. KrishiSetu gives farmers a printable Verified Dispatch Slip.&rdquo;
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-amber-400">
                    <span>Crop: Red Onion</span>
                    <span className="font-bold">Zero Fraudulent Rejection</span>
                  </div>
                </div>
              </div>

              {/* Photo 3: Agricultural Commerce & Market Trading */}
              <div className="group relative rounded-3xl overflow-hidden border border-emerald-800/60 shadow-xl bg-black/40 flex flex-col justify-end min-h-[360px]">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80"
                  alt="Agricultural market with fresh farm harvest and produce trading"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07130c] via-[#07130c]/50 to-transparent" />

                <div className="relative z-10 p-6 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    Direct Buyer Connections
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Lakshmi Devi • Warangal, Telangana
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    &ldquo;Listed our 40-quintal Chilli lot on KrishiSetu Marketplace. We received 3 competitive buyer offers within 48 hours with guaranteed escrow.&rdquo;
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-sky-400">
                    <span>Crop: Teja Chilli</span>
                    <span className="font-bold">Same-Day Direct Settlement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. STEP-BY-STEP VISUAL SPIRAL / PROGRESSION FLOW */}
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              6-STAGE SMART JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit">
              How KrishiSetu Protects Farmer Profits
            </h2>
            <p className="text-sm sm:text-base text-stone-300">
              Every step is engineered to give farmers full control, mathematical transparency, and verified buyer security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Pinpoint Farm Location',
                desc: 'Detect GPS coordinates or search your village and taluka across all 28 states of India.',
                icon: MapPin,
                color: 'text-amber-400',
              },
              {
                step: '02',
                title: 'Capture Crop Photo',
                desc: 'Use your phone camera or upload a field sample under good lighting with zero complex setup.',
                icon: Camera,
                color: 'text-emerald-400',
              },
              {
                step: '03',
                title: 'AI Quality Assessment',
                desc: 'Gemini Vision checks grain luster, moisture, and AGMARK standards to assign Grade A, B, or C.',
                icon: Cpu,
                color: 'text-sky-400',
              },
              {
                step: '04',
                title: 'Farmer Confirmation',
                desc: 'Review the assessment yourself. Confirm the grade, adjust information, or capture a new sample.',
                icon: ShieldCheck,
                color: 'text-emerald-300',
              },
              {
                step: '05',
                title: 'Net Return Arbitrage',
                desc: 'Formula math computes: Modal Rate × Qty minus Diesel Freight & Mandi Fees to pick the winner.',
                icon: TrendingUp,
                color: 'text-amber-400',
              },
              {
                step: '06',
                title: 'Verified Deal & Dispatch',
                desc: 'Generate printable QR dispatch slips or list directly on the Farmer Marketplace for verified buyers.',
                icon: FileCheck,
                color: 'text-emerald-400',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#091b10] border border-emerald-800/40 p-6 space-y-3 hover:border-emerald-500/60 transition-colors shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-emerald-500/40">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white font-outfit">{item.title}</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. QUICK ACCESS CALLOUT / KISAN AI BANNER */}
        <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-stone-900 to-amber-950 border border-emerald-500/50 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/40">
                <span>🤖 MEET KISAN AI</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
                Have questions about crop diseases, mandi prices, or selling advice?
              </h3>
              <p className="text-sm text-stone-300 max-w-2xl">
                Chat with Kisan AI in your native language (English, Hindi, Marathi, Telugu, Tamil, Kannada, or Malayalam). Available 24/7 with zero technical jargon.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open_kisan_ai'))}
                className="py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm shadow-lg shadow-amber-400/30 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Chat with Kisan AI</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 9. UNIFIED FOOTER (WITH SUBTLE IDEA FORGE INITIATIVE BRANDING) */}
      <footer className="bg-[#040c07] text-stone-400 text-xs border-t border-emerald-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-emerald-900/40">
            {/* Brand & Purpose */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                <span className="text-xl font-black text-white font-outfit">
                  KRISHI<span className="text-emerald-400">SETU</span>
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Farmer Intelligence & Agricultural Marketplace Platform. Bridging farm-level harvest quality with live APMC mandi discovery and verified agricultural commerce.
              </p>
              <div className="pt-1">
                <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/80">
                  An Idea Forge Initiative
                </span>
              </div>
            </div>

            {/* Experience 1: Farm Intelligence Links */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">
                Farm Intelligence
              </h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>
                  <Link to="/crop-analysis" className="hover:text-emerald-400 transition-colors">
                    Start Crop Analysis
                  </Link>
                </li>
                <li>
                  <Link to="/crop-analysis" className="hover:text-emerald-400 transition-colors">
                    AI Quality Grading (A/B/C)
                  </Link>
                </li>
                <li>
                  <Link to="/crop-analysis" className="hover:text-emerald-400 transition-colors">
                    Mandi Price Comparison
                  </Link>
                </li>
                <li>
                  <Link to="/crop-analysis" className="hover:text-emerald-400 transition-colors">
                    Net Return Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/crop-analysis" className="hover:text-emerald-400 transition-colors">
                    Verified Deal Slip
                  </Link>
                </li>
              </ul>
            </div>

            {/* Experience 2: Marketplace Links */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">
                Farmer Marketplace
              </h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>
                  <Link to="/marketplace" className="hover:text-amber-400 transition-colors">
                    Farmer Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace/lots" className="hover:text-amber-400 transition-colors">
                    My Harvest Lots
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace/buyers" className="hover:text-amber-400 transition-colors">
                    Verified Institutional Buyers
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace/offers" className="hover:text-amber-400 transition-colors">
                    Trade Offers & Contracts
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace/logistics" className="hover:text-amber-400 transition-colors">
                    Agri Logistics Booking
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace/storage" className="hover:text-amber-400 transition-colors">
                    Warehouse & Cold Storage
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform & Support */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">
                Resources & Legal
              </h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About KrishiSetu
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/markets" className="hover:text-white transition-colors">
                    National Market Directory
                  </Link>
                </li>
                <li>
                  <a
                    href="/KrishiSetu-Final.zip"
                    download="KrishiSetu-Final.zip"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-700/50 text-xs font-bold transition-colors"
                  >
                    <span>📦</span>
                    <span>Download KrishiSetu-Final.zip</span>
                  </a>
                </li>
                <li className="pt-1">
                  <span className="text-emerald-400 font-mono">Toll-Free Kisan Helpline:</span>
                  <div className="text-white font-bold font-mono">1800-180-1551</div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} KrishiSetu Platform. All rights reserved. Built for Indian Farmers.
            </div>
            <div className="flex items-center gap-4">
              <span>Security: End-to-End Assayer Encrypted</span>
              <span>•</span>
              <span className="text-amber-400">An Idea Forge Initiative</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating KrishiSetu AI Chatbot.
          No hardcoded language/crop/location here: those were fabricated demo values.
          The component falls back to the farmer's actual saved persona/language instead. */}
      <KrishiSetuAI />
    </div>
  );
};
