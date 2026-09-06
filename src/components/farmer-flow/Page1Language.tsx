import React from 'react';
import { Language } from '../../types';
import { ArrowRight, Check } from 'lucide-react';

interface Page1LanguageProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onContinue: () => void;
}

export const Page1Language: React.FC<Page1LanguageProps> = ({
  currentLanguage,
  onSelectLanguage,
  onContinue
}) => {
  const languages: {
    id: Language;
    label: string;
    englishLabel: string;
    tagline: string;
    flag: string;
  }[] = [
    {
      id: 'te',
      label: 'తెలుగు',
      englishLabel: 'Telugu',
      tagline: 'ఆంధ్రప్రదేశ్ & తెలంగాణ రైతుల కొరకు',
      flag: '🌾'
    },
    {
      id: 'hi',
      label: 'हिन्दी',
      englishLabel: 'Hindi',
      tagline: 'उत्तर व मध्य भारत के किसानों के लिए',
      flag: '🇮🇳'
    },
    {
      id: 'mr',
      label: 'मराठी',
      englishLabel: 'Marathi',
      tagline: 'महाराष्ट्र शासन शेतकरी विशेष',
      flag: '🚜'
    },
    {
      id: 'en',
      label: 'English',
      englishLabel: 'English',
      tagline: 'All India Farmer Marketplace',
      flag: '🌐'
    }
  ];

  return (
    <div className="min-h-[88vh] flex flex-col justify-between max-w-xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Brand Header */}
      <div className="text-center pt-2 sm:pt-4">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl sm:text-4xl" role="img" aria-label="wheat">
            🌾
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-900">
            KrishiSetu
          </h1>
        </div>
        <p className="text-sm sm:text-base font-medium text-emerald-800/80">
          Know Your Market. Sell Smarter.
        </p>
      </div>

      {/* Subtle Supporting Agricultural Panorama Visual (Non-competing, calm) */}
      <div className="my-6 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-50 to-emerald-50 border border-emerald-100 shadow-xs">
        <svg
          viewBox="0 0 600 160"
          className="w-full h-28 sm:h-36 object-cover select-none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="p1Sky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#d1fae5" />
            </linearGradient>
            <linearGradient id="p1Field" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <linearGradient id="p1Soil" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>

          {/* Sky and gentle sun */}
          <rect width="600" height="160" fill="url(#p1Sky)" />
          <circle cx="500" cy="45" r="28" fill="#fde047" opacity="0.6" />
          <circle cx="500" cy="45" r="16" fill="#fef08a" />

          {/* Distant gentle hill contour */}
          <path
            d="M 0,95 Q 150,65 300,85 T 600,75 L 600,160 L 0,160 Z"
            fill="url(#p1Field)"
            opacity="0.85"
          />

          {/* Foreground ploughed furrow soil */}
          <path
            d="M 0,118 Q 200,110 400,122 T 600,115 L 600,160 L 0,160 Z"
            fill="url(#p1Soil)"
          />
          <line x1="0" y1="134" x2="600" y2="134" stroke="#291002" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
          <line x1="0" y1="146" x2="600" y2="146" stroke="#291002" strokeWidth="2.5" strokeDasharray="8 5" opacity="0.6" />

          {/* Farmer tending crop stalks */}
          <g transform="translate(110, 88)">
            <ellipse cx="6" cy="30" rx="8" ry="3" fill="#291002" opacity="0.3" />
            <line x1="4" y1="20" x2="2" y2="30" stroke="#1e293b" strokeWidth="2" />
            <line x1="8" y1="20" x2="10" y2="30" stroke="#1e293b" strokeWidth="2" />
            <path d="M 2,10 L 10,10 L 9,21 L 3,21 Z" fill="#ffffff" />
            <circle cx="6" cy="6" r="4" fill="#f59e0b" />
            <ellipse cx="6" cy="4" rx="5" ry="2.5" fill="#ea580c" />
          </g>

          {/* Animated gentle tractor moving across the field */}
          <g className="p1-moving-tractor">
            <g transform="translate(280, 84)">
              {/* Plough tool behind */}
              <line x1="-12" y1="36" x2="-2" y2="30" stroke="#475569" strokeWidth="2.5" />
              {/* Big rear wheel */}
              <circle cx="6" cy="28" r="12" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <circle cx="6" cy="28" r="5" fill="#e2e8f0" />
              {/* Front small wheel */}
              <circle cx="38" cy="31" r="8" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <circle cx="38" cy="31" r="3" fill="#e2e8f0" />
              {/* Red chassis */}
              <path d="M 8,16 L 24,16 L 44,22 L 44,30 L 12,30 Z" fill="#dc2626" />
              {/* Farmer driver with green turban */}
              <circle cx="6" cy="8" r="4.5" fill="#f59e0b" />
              <ellipse cx="6" cy="6" rx="5" ry="2.5" fill="#16a34a" />
              {/* Exhaust pipe */}
              <line x1="38" y1="16" x2="38" y2="7" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        </svg>

        <style>{`
          @keyframes p1TractorDrift {
            0% { transform: translateX(-30px); }
            50% { transform: translateX(50px); }
            100% { transform: translateX(-30px); }
          }
          .p1-moving-tractor {
            animation: p1TractorDrift 20s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .p1-moving-tractor {
              animation: none !important;
            }
          }
        `}</style>
      </div>

      {/* Main Choice Section: Choose Your Language */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-center text-lg sm:text-xl font-bold text-slate-900 mb-4">
          Choose Your Language
        </h2>

        {/* 4 Big, Clean, Tactile Language Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  onSelectLanguage(lang.id);
                }}
                className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer text-left active:scale-[0.98] ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/90 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl select-none" role="img" aria-label={lang.englishLabel}>
                    {lang.flag}
                  </span>
                  <div>
                    <span className="block text-lg font-bold text-slate-900 leading-tight">
                      {lang.label}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {lang.englishLabel} • {lang.tagline}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="mt-6">
          <button
            onClick={onContinue}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-md shadow-emerald-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {currentLanguage === 'te'
                ? 'ముందుకు సాగండి'
                : currentLanguage === 'hi'
                ? 'आगे बढ़ें'
                : currentLanguage === 'mr'
                ? 'पुढे जा'
                : 'Continue'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Reassurance Note */}
      <div className="text-center pt-6 pb-2 text-xs text-slate-500">
        <p>Your language can be changed later in Settings.</p>
        <p className="text-[11px] text-slate-400 mt-1">
          Smart India Hackathon 2026 • SIH26132
        </p>
      </div>
    </div>
  );
};
