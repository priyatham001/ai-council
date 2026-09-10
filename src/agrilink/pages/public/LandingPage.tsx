import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Scale,
  DollarSign,
  AlertTriangle,
  Building2,
  Users,
  Award,
  Sparkles,
  Layers,
  Check,
  X,
  FileText,
  BadgeCheck,
  Activity,
  ArrowDown,
  Globe,
  MapPin,
  Compass
} from 'lucide-react';
import { DEMO_CROPS } from '../../data/mockData';
import { NationalMarketMap } from '../../components/common/NationalMarketMap';
import { ALL_INDIA_STATES, PAN_INDIA_CROPS } from '../../data/panIndiaData';

export const LandingPage: React.FC = () => {
  const [selectedStateName, setSelectedStateName] = useState<string>('Maharashtra');

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-brand-50/80 via-[#fbfdfa] to-[#fbfdfa] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-900 border border-brand-200 text-xs font-bold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
              Pan-India Agricultural Market-Linkage Platform • SIH 2026
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.12]">
              India's Markets. <br />
              <span className="text-brand-700 bg-gradient-to-r from-brand-700 to-emerald-600 bg-clip-text text-transparent">
                One Smart Agricultural Network.
              </span>
            </h1>

            <p className="text-xs uppercase tracking-widest font-black text-brand-800">
              Better Prices. Better Buyers. Better Decisions.
            </p>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
              KrishiSetu connects farmers across all 28 states and union territories with live APMC mandi benchmarks, verified institutional buyers, and transparent freight-adjusted net realization.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/markets"
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Compass className="w-4 h-4" />
                <span>Explore National Markets</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/how-it-works"
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-xl font-bold text-sm transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <span>See How It Works</span>
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-100/80 hover:bg-emerald-200 text-emerald-950 font-bold text-sm rounded-xl transition-all border border-emerald-300"
              >
                <span>Demo Sign In</span>
              </Link>
            </div>

            {/* Government-tech trust row */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600" /> APMC & e-NAM Mandi Compatible
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% KYC & GSTIN Vetted Buyers
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" /> True Net Realization Calculation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today's Pan-India Market Snapshot Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight uppercase">
                  National Agricultural Price Snapshot
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Daily modal price benchmarks across key regional commodity hubs in India
              </p>
            </div>

            <span className="self-start sm:self-auto text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
              Demo market data
            </span>
          </div>

          {/* 6 Pan-India Commodity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Onion - Lasalgaon MH */}
            <div className="p-5 rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/40 to-white hover:border-brand-400 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-gray-900">Onion (Nasik Red)</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" /> ↑ 5.1%
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ₹2,780<span className="text-xs font-normal text-gray-500">/q</span>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
                <span>Lasalgaon APMC (Maharashtra)</span>
                <span className="font-semibold text-emerald-700">High Arrivals</span>
              </div>
            </div>

            {/* Wheat - Khanna PB */}
            <div className="p-5 rounded-2xl border border-amber-100 bg-gradient-to-b from-amber-50/40 to-white hover:border-amber-400 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-gray-900">Wheat (Sharbati Gold)</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" /> ↑ 4.2%
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ₹2,450<span className="text-xs font-normal text-gray-500">/q</span>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
                <span>Khanna Mandi (Punjab)</span>
                <span className="font-semibold text-amber-700">Asia's Largest Grain Hub</span>
              </div>
            </div>

            {/* Tomato - Kolar KA */}
            <div className="p-5 rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50/40 to-white hover:border-rose-400 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-gray-900">Tomato (Hybrid)</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" /> ↑ 8.2%
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ₹2,580<span className="text-xs font-normal text-gray-500">/q</span>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
                <span>Kolar APMC (Karnataka)</span>
                <span className="font-semibold text-rose-700">High Demand</span>
              </div>
            </div>

            {/* Groundnut - Gondal GJ */}
            <div className="p-5 rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/40 to-white hover:border-blue-400 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-gray-900">Groundnut (GG-20)</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" /> ↑ 6.1%
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ₹6,500<span className="text-xs font-normal text-gray-500">/q</span>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
                <span>Gondal Mandi (Gujarat)</span>
                <span className="font-semibold text-blue-700">Oil Mill Demand</span>
              </div>
            </div>

            {/* Soybean - Mandsaur MP */}
            <div className="p-5 rounded-2xl border border-teal-100 bg-gradient-to-b from-teal-50/40 to-white hover:border-teal-400 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-gray-900">Soybean (JS-335)</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" /> ↑ 3.9%
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ₹4,680<span className="text-xs font-normal text-gray-500">/q</span>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
                <span>Mandsaur Mandi (Madhya Pradesh)</span>
                <span className="font-semibold text-teal-700">Solvent Extraction</span>
              </div>
            </div>

            {/* Chilli - Warangal / Guntur TS & AP */}
            <div className="p-5 rounded-2xl border border-red-100 bg-gradient-to-b from-red-50/40 to-white hover:border-red-400 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold text-gray-900">Red Chilli (Teja)</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" /> ↑ 5.7%
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900">
                ₹18,500<span className="text-xs font-normal text-gray-500">/q</span>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
                <span>Enumamula Warangal (Telangana)</span>
                <span className="font-semibold text-red-700">Export Pull</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Agricultural Markets Across India — Embedded Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Globe className="w-3.5 h-3.5 text-emerald-600" /> National Agricultural Topology
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Explore Agricultural Markets Across India
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Discover trading intensity, arrival flows, and price movements across all Indian states and agricultural zones.
          </p>
        </div>

        {/* Embedded Interactive Map */}
        <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <NationalMarketMap
            onSelectState={(stateName) => setSelectedStateName(stateName)}
            selectedStateName={selectedStateName}
          />

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-gray-600 font-medium">
              Currently viewing: <b className="text-gray-900">{selectedStateName}</b>
            </span>
            <Link
              to="/markets"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold flex items-center gap-1 shadow-2xs transition-all"
            >
              <span>View Full Directory for {selectedStateName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. The Core Value Connection Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2.5 py-1 rounded-md">
            Integrated Value Highway
          </span>
          <h2 className="text-2xl font-black text-gray-900">
            How Information Converts to Bank Realization
          </h2>
        </div>

        {/* 5-Node Visual Highway */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {[
            {
              step: '1',
              title: 'Farmer',
              sub: 'Harvest registration & digital quality grading',
              icon: Users,
              color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
            },
            {
              step: '2',
              title: 'Market Intelligence',
              sub: 'Live arrivals, modal benchmarks & trends',
              icon: Activity,
              color: 'text-blue-700 bg-blue-50 border-blue-200'
            },
            {
              step: '3',
              title: 'AI Sell Advisor',
              sub: 'Net margin window & transport optimization',
              icon: Sparkles,
              color: 'text-purple-700 bg-purple-50 border-purple-200'
            },
            {
              step: '4',
              title: 'Verified Buyers',
              sub: 'KYC-vetted food processors & wholesale biddings',
              icon: Building2,
              color: 'text-amber-700 bg-amber-50 border-amber-200'
            },
            {
              step: '5',
              title: 'Better Net Realization',
              sub: 'Protected escrow transfer directly to farmer account',
              icon: DollarSign,
              color: 'text-emerald-800 bg-emerald-100 border-emerald-300'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-3 relative group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border font-bold ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">Phase 0{item.step}</span>
                  <h4 className="font-bold text-gray-900 text-sm mt-0.5">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. "FARMER'S DECISION" VISUAL — The Core Differentiator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/15">
              <Scale className="w-3.5 h-3.5" /> The Core Net Realization Proof
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Why Quoted Gross Price is a Deceptive Metric
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              A 50 quintal onion or wheat harvest sold to a distant high bidder often yields less cash than a closer verified processor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Without KrishiSetu */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-rose-500/30 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-950/60 border border-rose-800/60 px-3 py-1 rounded-full">
                    ✕ Without KrishiSetu
                  </span>
                  <span className="text-xs text-gray-400">Distant Wholesale Hub</span>
                </div>

                <div>
                  <div className="text-xs text-gray-300">Farmer sees high mandi quote:</div>
                  <div className="text-3xl font-black text-white mt-1">
                    ₹2,950<span className="text-sm font-normal text-gray-400">/quintal</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                    Looks like the best deal (₹1,47,500 gross)
                  </div>
                </div>

                {/* Hidden Deductions */}
                <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-rose-300">
                    <span>Long-haul freight transport (165 km):</span>
                    <span className="font-mono font-bold">− ₹7,200</span>
                  </div>
                  <div className="flex justify-between text-rose-300">
                    <span>Mandi Hamali & unloading:</span>
                    <span className="font-mono font-bold">− ₹1,100</span>
                  </div>
                  <div className="flex justify-between text-rose-300">
                    <span>Commission agent cess (2%):</span>
                    <span className="font-mono font-bold">− ₹2,950</span>
                  </div>
                </div>
              </div>

              {/* Actual Outcome */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 mt-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-semibold">
                  Actual Net Cash In Bank:
                </span>
                <div className="text-2xl font-black text-rose-400 mt-1">
                  ₹1,36,250
                </div>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  ₹2,725 / quintal net takeaway
                </span>
              </div>
            </div>

            {/* With KrishiSetu */}
            <div className="bg-emerald-950/70 backdrop-blur-md rounded-2xl p-6 border-2 border-brand-400 shadow-xl space-y-5 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 bg-emerald-900/80 border border-emerald-500/50 px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-300" /> With KrishiSetu
                  </span>
                  <span className="text-xs text-emerald-300 font-medium">Nearby Verified Processor</span>
                </div>

                <div>
                  <div className="text-xs text-emerald-200">Alternative verified buyer quote:</div>
                  <div className="text-3xl font-black text-white mt-1">
                    ₹2,840<span className="text-sm font-normal text-emerald-200">/quintal</span>
                  </div>
                  <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                    Quoted ₹110 lower on paper (₹1,42,000 gross)
                  </div>
                </div>

                {/* Minimized Deductions */}
                <div className="space-y-2 pt-3 border-t border-emerald-800/60 text-xs">
                  <div className="flex justify-between text-emerald-200">
                    <span>Farm-gate local freight (18 km):</span>
                    <span className="font-mono font-bold">− ₹1,800</span>
                  </div>
                  <div className="flex justify-between text-emerald-200">
                    <span>Direct factory dock intake:</span>
                    <span className="font-mono font-bold">− ₹700</span>
                  </div>
                  <div className="flex justify-between text-emerald-200">
                    <span>Zero intermediary commission:</span>
                    <span className="font-mono font-bold">− ₹0</span>
                  </div>
                </div>
              </div>

              {/* Actual Outcome with Highlight Badge */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-800/80 to-brand-800/80 border border-brand-400/50 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-200 block font-bold">
                      Actual Net Cash In Bank:
                    </span>
                    <div className="text-2xl font-black text-white mt-0.5">
                      ₹1,39,500
                    </div>
                    <span className="text-[11px] text-emerald-200 block">
                      ₹2,790 / quintal net takeaway
                    </span>
                  </div>

                  <div className="text-right bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-md">
                    +₹3,250 More In Bank
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Demonstration Metrics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-wider text-brand-700 font-bold bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              National Platform Capacity Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">28+8</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">States & UTs Covered</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Pan-India APMC Network</div>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-brand-700 tracking-tight">180+</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Verified Buyers</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% KYC & GSTIN Audited</div>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">30+</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Commodities Tracked</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Cereals, Pulses, Oilseeds, Veg</div>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">18%</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Avg Net Realization Gain</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Over distress middleman sale</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-emerald-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to experience transparent agricultural selling across India?
            </h2>
            <p className="text-brand-100 text-sm leading-relaxed">
              Step into the KrishiSetu platform. Test multi-state personas, compare APMC price trends, run the AI Sell Advisor, generate a digital lot passport, and accept verified bids.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-brand-900 font-black text-sm rounded-xl hover:bg-brand-50 transition-colors shadow-md text-center"
            >
              Launch Interactive Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
