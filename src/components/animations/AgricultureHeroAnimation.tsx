import React from 'react';
import { Sparkles, ArrowRight, Play, MapPin, TrendingUp, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../lib/translations';

interface AgricultureHeroAnimationProps {
  language: Language;
  onStartDiscovery: () => void;
  onStartDemo: () => void;
  onExplorePrices: () => void;
}

export const AgricultureHeroAnimation: React.FC<AgricultureHeroAnimationProps> = ({
  language,
  onStartDiscovery,
  onStartDemo,
  onExplorePrices
}) => {
  const t = getTranslation(language);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50/80 via-emerald-50/50 to-emerald-100/60 border border-emerald-200/80 shadow-sm">
      {/* Decorative Agriculture SVG Panorama */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 select-none overflow-hidden" aria-hidden="true">
        <svg
          viewBox="0 0 1000 360"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sky gradient with soft sunrise warmth */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" /> {/* Warm amber morning */}
              <stop offset="45%" stopColor="#fde68a" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#d1fae5" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>

            {/* Distant hill gradient */}
            <linearGradient id="distantHills" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>

            {/* Midground agricultural fields */}
            <linearGradient id="fieldGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>

            {/* Foreground ploughed soil */}
            <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="30%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#572304" />
            </linearGradient>

            {/* Sun glow */}
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="40%" stopColor="#fde047" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
            </radialGradient>

            {/* Ploughed furrow texture pattern */}
            <pattern id="soilFurrows" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 0,12 Q 6,6 12,12 T 24,12" fill="none" stroke="#451a03" strokeWidth="2.2" opacity="0.4" />
            </pattern>
          </defs>

          {/* Sky background */}
          <rect width="1000" height="360" fill="url(#skyGrad)" />

          {/* Rising Sun */}
          <circle cx="820" cy="110" r="85" fill="url(#sunGlow)" />
          <circle cx="820" cy="110" r="32" fill="#fef08a" />

          {/* Distant flying birds animation */}
          <g className="subtle-birds" opacity="0.65">
            <path
              d="M 280,50 Q 288,42 296,50 Q 304,42 312,50"
              fill="none"
              stroke="#047857"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 320,65 Q 326,59 332,65 Q 338,59 344,65"
              fill="none"
              stroke="#047857"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 355,45 Q 361,39 367,45 Q 373,39 379,45"
              fill="none"
              stroke="#047857"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>

          {/* Distant Mountain Silhouettes */}
          <path
            d="M 0,210 Q 140,140 280,185 T 620,165 T 900,195 T 1000,190 L 1000,360 L 0,360 Z"
            fill="url(#distantHills)"
            opacity="0.5"
          />

          {/* Midground agricultural farm terraces */}
          <path
            d="M 0,230 Q 180,190 420,225 T 820,205 T 1000,220 L 1000,360 L 0,360 Z"
            fill="url(#fieldGrad1)"
            opacity="0.75"
          />

          {/* Distant Trees on Horizon */}
          <g fill="#15803d" opacity="0.8">
            <circle cx="120" cy="205" r="14" />
            <circle cx="138" cy="202" r="18" />
            <circle cx="155" cy="207" r="12" />
            <circle cx="480" cy="215" r="16" />
            <circle cx="500" cy="210" r="22" />
            <circle cx="522" cy="216" r="15" />
            <circle cx="780" cy="195" r="15" />
            <circle cx="800" cy="190" r="20" />
          </g>

          {/* Foreground fertile ploughed soil layer */}
          <path
            d="M 0,270 Q 250,250 520,275 T 1000,265 L 1000,360 L 0,360 Z"
            fill="url(#soilGrad)"
          />
          {/* Furrow lines */}
          <rect y="260" width="1000" height="100" fill="url(#soilFurrows)" />

          {/* Ploughed furrows cut into the soil */}
          <path
            d="M 0,285 Q 260,268 540,290 T 1000,280"
            fill="none"
            stroke="#381702"
            strokeWidth="3.5"
            opacity="0.7"
          />
          <path
            d="M 0,310 Q 270,292 560,315 T 1000,305"
            fill="none"
            stroke="#2e1302"
            strokeWidth="4"
            opacity="0.8"
          />
          <path
            d="M 0,335 Q 280,318 580,340 T 1000,330"
            fill="none"
            stroke="#271002"
            strokeWidth="4.5"
            opacity="0.85"
          />

          {/* Gently moving crop stalks along the field verge */}
          <g className="waving-crops" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round">
            {/* Clump 1 */}
            <path d="M 60,265 Q 55,245 45,235" />
            <path d="M 66,265 Q 68,242 75,232" />
            <path d="M 72,265 Q 80,246 88,238" />
            <circle cx="45" cy="235" r="3" fill="#eab308" />
            <circle cx="75" cy="232" r="3" fill="#eab308" />
            <circle cx="88" cy="238" r="3" fill="#eab308" />

            {/* Clump 2 */}
            <path d="M 920,260 Q 912,240 905,230" />
            <path d="M 928,260 Q 930,238 938,228" />
            <path d="M 936,260 Q 945,242 952,234" />
            <circle cx="905" cy="230" r="3" fill="#eab308" />
            <circle cx="938" cy="228" r="3" fill="#eab308" />
            <circle cx="952" cy="234" r="3" fill="#eab308" />
          </g>

          {/* Animated Tractor Ploughing the Field */}
          <g className="moving-tractor">
            {/* Ploughed furrow trail behind tractor */}
            <path
              d="M 0,296 L 240,296"
              fill="none"
              stroke="#2e1302"
              strokeWidth="5"
              strokeDasharray="6 3"
              opacity="0.8"
            />

            {/* Tractor Body & Engine */}
            <g transform="translate(240, 240)">
              {/* Plough tool behind */}
              <path d="M -18,48 L -2,42 L -6,52" stroke="#475569" strokeWidth="3" fill="none" />
              <path d="M -12,50 L -24,56" stroke="#334155" strokeWidth="3.5" fill="none" />

              {/* Big Rear Wheel */}
              <circle cx="10" cy="42" r="18" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
              <circle cx="10" cy="42" r="8" fill="#e2e8f0" />
              {/* Wheel treads */}
              <circle cx="10" cy="42" r="14" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="3 4" />

              {/* Front Wheel */}
              <circle cx="62" cy="46" r="11" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="62" cy="46" r="4" fill="#e2e8f0" />

              {/* Tractor Hood / Chassis (Agricultural Crimson Red) */}
              <path
                d="M 12,24 L 38,24 L 68,32 L 68,44 L 20,44 Z"
                fill="#dc2626"
                stroke="#991b1b"
                strokeWidth="1.5"
              />

              {/* Driver Seat & Protective Roll Cage */}
              <path d="M 0,22 L 14,22 L 14,32 L 2,32 Z" fill="#334155" />
              <path d="M -2,4 L 16,4 L 16,24 L 0,24 Z" fill="none" stroke="#1e293b" strokeWidth="2.5" />

              {/* Farmer in Tractor */}
              <circle cx="8" cy="12" r="6" fill="#f59e0b" />
              {/* Turban / Hat */}
              <ellipse cx="8" cy="9" rx="8" ry="4" fill="#16a34a" />
              {/* Shirt */}
              <path d="M 2,18 L 14,18 L 16,30 L 2,30 Z" fill="#ffffff" />

              {/* Steering & Exhaust */}
              <line x1="22" y1="20" x2="16" y2="16" stroke="#0f172a" strokeWidth="2" />
              <line x1="58" y1="24" x2="58" y2="10" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              {/* Subtle Exhaust Puff */}
              <circle cx="60" cy="6" r="2.5" fill="#94a3b8" opacity="0.5" />
              <circle cx="63" cy="2" r="3.5" fill="#94a3b8" opacity="0.3" />

              {/* Headlight */}
              <circle cx="68" cy="36" r="3" fill="#fef08a" />
              <polygon points="70,33 95,25 95,45 70,39" fill="#fef08a" opacity="0.3" />
            </g>
          </g>

          {/* Farmer on Foot in the Field Tending Crops */}
          <g transform="translate(680, 246)">
            {/* Farmer shadow */}
            <ellipse cx="14" cy="48" rx="12" ry="4" fill="#331502" opacity="0.4" />
            {/* Legs */}
            <line x1="10" y1="36" x2="8" y2="47" stroke="#1e293b" strokeWidth="3" />
            <line x1="18" y1="36" x2="20" y2="47" stroke="#1e293b" strokeWidth="3" />
            {/* Traditional Kurta */}
            <path d="M 6,18 L 22,18 L 20,36 L 8,36 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            {/* Arm with harvesting basket */}
            <line x1="7" y1="20" x2="0" y2="28" stroke="#f59e0b" strokeWidth="2" />
            <ellipse cx="-2" cy="29" rx="6" ry="4" fill="#b45309" />
            {/* Head & Farmer Pagri/Turban */}
            <circle cx="14" cy="11" r="5.5" fill="#f59e0b" />
            <ellipse cx="14" cy="8" rx="7" ry="4" fill="#ea580c" />
          </g>
        </svg>

        {/* Floating Agricultural Value Propositions Banner */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-2 items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/90 text-white backdrop-blur-sm shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {t.sihBadge}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-white backdrop-blur-sm shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.demoModeNotice}
          </span>
        </div>

        {/* Invariant badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/90 text-slate-800 border border-slate-200/80 shadow-xs backdrop-blur-sm">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.highestPriceNotHighestReturnNotice}</span>
        </div>
      </div>

      {/* Hero Headline & Interactive Action Hub */}
      <div className="p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-sm border-t border-emerald-100">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌾</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {t.heroTitle}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mb-6">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Primary CTA: Find Best Market */}
            <button
              onClick={onStartDiscovery}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-700/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
            >
              <span>{t.btnFindBestMarket}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* One-Click Demo Mode Button */}
            <button
              onClick={onStartDemo}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-base font-semibold bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98] transition-all shadow-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t.startDemoBtn}</span>
              <span className="text-xs font-normal opacity-90">(Paddy 10 Qtl)</span>
            </button>

            {/* Explore Prices */}
            <button
              onClick={onExplorePrices}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98] transition-colors focus:outline-hidden cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{t.btnExplorePrices}</span>
            </button>
          </div>

          {/* Quick Context Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>100% Free:</strong> No login or password required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Haversine & Terrain:</strong> Real road freight calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Net Earnings:</strong> Board price minus actual logistics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightweight CSS animations scoped for the agricultural scene */}
      <style>{`
        @keyframes tractorPlow {
          0% {
            transform: translateX(-40px);
          }
          50% {
            transform: translateX(120px);
          }
          100% {
            transform: translateX(-40px);
          }
        }

        @keyframes waveCrop {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(4deg);
          }
        }

        @keyframes birdsFlight {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(60px, -12px);
          }
          100% {
            transform: translate(120px, -6px);
          }
        }

        .moving-tractor {
          animation: tractorPlow 22s ease-in-out infinite;
          transform-origin: center bottom;
        }

        .waving-crops {
          animation: waveCrop 3.5s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .subtle-birds {
          animation: birdsFlight 18s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .moving-tractor,
          .waving-crops,
          .subtle-birds {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
