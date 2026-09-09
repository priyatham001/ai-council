import React from 'react';
import { Link } from 'react-router-dom';
import { Language, LocationData } from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';
import {
  MapPin,
  Languages,
  CheckCircle2,
  Phone,
  Sun,
  Moon,
  Home,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
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
  const t = TRANSLATIONS[language];

  // 4 Core Farm Workflow Steps with agricultural evolution icons
  const journeySteps = [
    { num: 1, label: t.step1Title, icon: '🌱', sub: 'Farm Origin' },
    { num: 2, label: t.step2Title, icon: '🌾', sub: 'Crop & AI Camera' },
    { num: 3, label: t.step3Title, icon: '🏪', sub: 'Mandi Discovery' },
    { num: 4, label: t.step4Title, icon: '💰', sub: 'Verified Deal' },
  ];

  return (
    <header className="bg-emerald-950 text-white shadow-xl border-b border-emerald-800/90 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        {/* Top bar: Brand + Helpline + View Tabs + Language + Dark Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-emerald-900">
          {/* Brand treatment: IDEA FORGE + KrishiSetu */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-left group"
            >
              {/* Forge + Sprout visual icon */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center text-xl shadow-md font-bold group-hover:scale-105 transition-transform">
                <span>🌾</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    IDEA FORGE
                  </span>
                  <span className="text-lg sm:text-xl font-black tracking-tight font-outfit text-white">
                    {t.appName}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300 font-medium hidden sm:block">
                  Farmer Intelligence & Smart Agriculture
                </p>
              </div>
            </Link>

            {/* Quick Navigation Tabs: Home, Farm Intelligence, Marketplace */}
            <div className="hidden lg:flex items-center gap-1 bg-emerald-900/80 p-1 rounded-xl border border-emerald-800 ml-2">
              <Link
                to="/"
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-200 hover:text-white transition-colors"
              >
                Home
              </Link>
              <button
                type="button"
                onClick={() => onSelectView('workflow')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeView === 'workflow'
                    ? 'bg-emerald-500 text-stone-950 shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                🌱 Farm Intelligence
              </button>
              <Link
                to="/marketplace"
                className="px-3 py-1 rounded-lg text-xs font-bold text-amber-300 hover:bg-amber-950/60 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>🚜</span>
                <span>Marketplace</span>
              </Link>
            </div>
          </div>

          {/* Right controls: Location + Helpline + Language + Dark Mode */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {location && (
              <button
                type="button"
                onClick={() => {
                  onSelectView('workflow');
                  onChangeLocationClick();
                }}
                className="flex items-center gap-1.5 text-xs bg-emerald-900/90 hover:bg-emerald-800 px-2.5 py-1.5 rounded-xl border border-emerald-800 text-emerald-100 transition-colors shadow-sm"
                title={t.changeLocation}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate max-w-[110px] sm:max-w-[150px] font-medium">
                  {location.city || location.village || location.district || location.state}
                </span>
                <span className="text-[10px] text-amber-300 underline ml-0.5">
                  Change
                </span>
              </button>
            )}

            {/* Language dropdown */}
            <div className="flex items-center bg-emerald-900/90 rounded-xl p-0.5 border border-emerald-800">
              <Languages className="w-3.5 h-3.5 text-emerald-300 ml-2 mr-0.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent text-xs font-bold text-white px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                <option value="en" className="bg-emerald-950 text-white">English</option>
                <option value="hi" className="bg-emerald-950 text-white">हिंदी (Hindi)</option>
                <option value="mr" className="bg-emerald-950 text-white">मराठी (Marathi)</option>
                <option value="te" className="bg-emerald-950 text-white">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-emerald-800 transition-colors"
              title={darkMode ? 'Switch to Agricultural Daylight' : 'Switch to Earth Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-200" />}
            </button>

            {/* Kisan Helpline Number */}
            <a
              href="tel:1234567890"
              className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-3 py-1.5 rounded-xl shadow-md transition-all hover:scale-105"
              title="Kisan Mitra Support: 1234567890"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">Helpline:</span>
              <span>1234567890</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Animated Agricultural Step Indicator (Shown when in Workflow Mode) */}
        {/* ========================================================================= */}
        {activeView === 'workflow' ? (
          <nav aria-label="Agricultural Step progress" className="pt-2">
            <ol className="grid grid-cols-4 gap-1 sm:gap-2">
              {journeySteps.map((step) => {
                const isActive = currentStep === step.num;
                const isPast = currentStep > step.num;
                const isAccessible =
                  step.num === 1 ||
                  step.num === 2 ||
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
                      {/* Step icon / number */}
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          isActive
                            ? 'bg-stone-950 text-amber-400 shadow'
                            : isPast
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.icon}
                      </span>
                      <div className="truncate hidden xs:block sm:block">
                        <span className="text-xs block leading-tight font-bold truncate">
                          {step.label}
                        </span>
                        <span
                          className={`text-[10px] hidden md:block leading-none ${
                            isActive ? 'text-stone-800 font-semibold' : 'text-emerald-400'
                          }`}
                        >
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
          /* Mobile Tab Navigation when in landing view */
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
