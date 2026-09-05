import React from 'react';
import { Language } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface LanguageScreenProps {
  onSelectLanguage: (lang: Language) => void;
  currentLanguage?: Language;
  onClose?: () => void;
  isModal?: boolean;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  onSelectLanguage,
  currentLanguage = 'en',
  onClose,
  isModal = false
}) => {
  const languages: {
    id: Language;
    name: string;
    nativeName: string;
    region: string;
    greeting: string;
    badge: string;
  }[] = [
    {
      id: 'en',
      name: 'English',
      nativeName: 'English',
      region: 'National / All States',
      greeting: 'Welcome Farmer',
      badge: 'EN'
    },
    {
      id: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      region: 'उत्तर व मध्य भारत',
      greeting: 'नमस्ते किसान भाई',
      badge: 'HI'
    },
    {
      id: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      region: 'महाराष्ट्र शासन (SIH26132)',
      greeting: 'नमस्कार शेतकरी मित्र',
      badge: 'MR'
    },
    {
      id: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      region: 'ఆంధ్రప్రదేశ్ & తెలంగాణ',
      greeting: 'నమస్కారం రైతు సోదరులారా',
      badge: 'TE'
    }
  ];

  const handleSelect = (lang: Language) => {
    onSelectLanguage(lang);
    if (onClose) onClose();
  };

  return (
    <div
      className={
        isModal
          ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs'
          : 'min-h-screen bg-linear-to-b from-emerald-950 via-emerald-900 to-teal-950 flex items-center justify-center p-4 sm:p-6'
      }
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Header Visual Banner */}
        <div className="bg-linear-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 bg-emerald-900/50 backdrop-blur px-3 py-1 rounded-full text-emerald-200 text-xs font-semibold mb-3 border border-emerald-500/30">
            <span>🌾 Smart India Hackathon 2026 • SIH26132</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            🌾 Welcome to KrishiSetu
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-lg">
            Know Your Market. Compare Your Options. Sell Smarter.
          </p>
          <p className="text-emerald-200/80 text-xs mt-1">
            Technology prototype for SIH26132 • Govt of Maharashtra
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Choose Your Preferred Language
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              आपली भाषा निवडा • अपनी भाषा चुनें • మీ భాషను ఎంచుకోండి
            </p>
          </div>

          {/* 4 Large Language Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {languages.map((lang) => {
              const isSelected = currentLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => handleSelect(lang.id)}
                  className={`group relative text-left p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between min-h-[96px] ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600/20'
                      : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200'
                      }`}
                    >
                      {lang.badge}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {lang.nativeName}
                        </span>
                        {lang.name !== lang.nativeName && (
                          <span className="text-xs text-gray-500">
                            ({lang.name})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-700 font-medium">
                        {lang.greeting}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {lang.region}
                      </p>
                    </div>
                  </div>

                  <div className="ml-2">
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>
              ℹ️ You can change language anytime from the top bar or settings.
            </span>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
