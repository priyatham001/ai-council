import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Language, LocationData } from '../../types/krishi';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../../utils/i18n';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  Languages,
  CheckCircle2,
  Phone,
  Sun,
  Moon,
  ArrowRight,
  ChevronDown,
  Check,
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentStep: number;
  onStepClick: (step: number) => void;
  location: LocationData | null;
  onChangeLocationClick: () => void;
  canNavigateToStep3: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeView: 'landing' | 'workflow';
  onSelectView: (view: 'landing' | 'workflow') => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentStep,
  onStepClick,
  location,
  onChangeLocationClick,
  canNavigateToStep3,
  darkMode,
  onToggleDarkMode,
  activeView,
  onSelectView,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const { setLanguage: setGlobalLang } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleLangSelect = (code: Language) => {
    onLanguageChange(code);
    setGlobalLang(code);        // sync global context
    setLangOpen(false);
  };

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const journeySteps = [
    { num: 1, label: t.step1Title, icon: '🌱', sub: 'Farm Origin' },
    { num: 2, label: t.step2Title, icon: '🌾', sub: 'Crop & AI Camera' },
    { num: 3, label: t.step3Title, icon: '🏪', sub: 'Mandi Discovery' },
    { num: 4, label: t.step4Title, icon: '💰', sub: 'Verified Deal' },
  ];

  return (
    <header className="bg-emerald-950 text-white shadow-xl border-b border-emerald-800/90 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-emerald-900">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 text-left group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center text-xl shadow-md font-bold group-hover:scale-105 transition-transform">
                <span>🌾</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white font-outfit">
                    AGRI<span className="text-emerald-400">CONNECT</span>
                  </span>
                  <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                    <span>🌾</span>
                    <span>Direct Linkage</span>
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300 font-medium hidden sm:block">
                  Direct Farm-to-Buyer Marketplace Linkage
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 bg-emerald-900/80 p-1 rounded-xl border border-emerald-800 ml-2">
              <Link to="/" className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-200 hover:text-white transition-colors">Home</Link>
              <Link to="/farmer" className="px-3 py-1 rounded-lg text-xs font-bold text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors flex items-center gap-1.5">
                <span>👨‍🌾</span><span>Farmer</span>
              </Link>
              <Link to="/buyers" className="px-3 py-1 rounded-lg text-xs font-bold text-amber-300 hover:bg-amber-950/60 transition-colors flex items-center gap-1.5">
                <span>🏪</span><span>Buyers</span>
              </Link>
              <Link to="/markets" className="px-2.5 py-1 rounded-lg text-xs font-medium text-stone-300 hover:text-white transition-colors">Markets</Link>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {location && (
              <button
                type="button"
                onClick={() => { onSelectView('workflow'); onChangeLocationClick(); }}
                className="flex items-center gap-1.5 text-xs bg-emerald-900/90 hover:bg-emerald-800 px-2.5 py-1.5 rounded-xl border border-emerald-800 text-emerald-100 transition-colors shadow-sm"
                title={t.changeLocation}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate max-w-[110px] sm:max-w-[150px] font-medium">
                  {location.city || location.village || location.district || location.state}
                </span>
                <span className="text-[10px] text-amber-300 underline ml-0.5">Change</span>
              </button>
            )}

            {/* ── Premium Language Dropdown ── */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Select Language"
                className="flex items-center gap-1.5 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="hidden sm:inline">{currentLang.native}</span>
                <ChevronDown
                  className={`w-3 h-3 text-emerald-300 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    role="listbox"
                    aria-label="Language options"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-52 bg-emerald-950 border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    {SUPPORTED_LANGUAGES.map((lang, idx) => (
                      <motion.button
                        key={lang.code}
                        role="option"
                        aria-selected={lang.code === language}
                        type="button"
                        onClick={() => handleLangSelect(lang.code)}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.14, delay: idx * 0.03 }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                          lang.code === language
                            ? 'bg-emerald-800/80 text-white'
                            : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-bold">{lang.native}</span>
                          <span className="block text-[10px] text-emerald-400 font-medium">{lang.label}</span>
                        </div>
                        {lang.code === language && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-emerald-800 transition-colors"
              title={darkMode ? 'Switch to Daylight' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-200" />}
            </button>

            {/* Helpline */}
            <a
              href="tel:1800180111"
              className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-3 py-1.5 rounded-xl shadow-md transition-all hover:scale-105"
              title="Kisan Call Centre: 1800-180-1551"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">Helpline:</span>
              <span>1800-180-1551</span>
            </a>
          </div>
        </div>

        {/* Step Indicator */}
        {activeView === 'workflow' ? (
          <nav aria-label="Agricultural Step progress" className="pt-2">
            <ol className="grid grid-cols-4 gap-1 sm:gap-2">
              {journeySteps.map((step) => {
                const isActive = currentStep === step.num;
                const isPast = currentStep > step.num;
                const isAccessible =
                  step.num === 1 || step.num === 2 ||
                  (step.num === 3 && canNavigateToStep3) ||
                  (step.num === 4 && canNavigateToStep3 && currentStep >= 3);

                return (
                  <li key={step.num} className="relative">
                    <button
                      type="button"
                      disabled={!isAccessible}
                      onClick={() => onStepClick(step.num)}
                      className={`w-full flex items-center gap-2 p-1.5 sm:p-2 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 font-black shadow-md ring-2 ring-amber-300'
                          : isPast
                          ? 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800'
                          : 'bg-emerald-950/60 text-emerald-400/50 cursor-not-allowed'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isActive ? 'bg-stone-950 text-amber-400 shadow'
                        : isPast ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.icon}
                      </span>
                      <div className="truncate hidden xs:block sm:block">
                        <span className="text-xs block leading-tight font-bold truncate">{step.label}</span>
                        <span className={`text-[10px] hidden md:block leading-none ${isActive ? 'text-stone-800 font-semibold' : 'text-emerald-400'}`}>
                          {step.sub}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : (
          <div className="pt-2 flex items-center justify-between text-xs text-emerald-300">
            <span className="font-semibold text-[11px] text-amber-300 flex items-center gap-1.5">
              <span>🌾</span>
              <span>Intelligent Crop & Market Platform by IDEA FORGE</span>
            </span>
            <button
              type="button"
              onClick={() => onSelectView('workflow')}
              className="text-amber-400 font-bold hover:underline flex items-center gap-1 text-xs"
            >
              <span>Launch Farmer Workflow</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
