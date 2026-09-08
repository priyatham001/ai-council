import React from 'react';
import { Language, LocationData } from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';
import { MapPin, Languages, CheckCircle2, Phone } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentStep: number;
  onStepClick: (step: number) => void;
  location: LocationData | null;
  onChangeLocationClick: () => void;
  canNavigateToStep3: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentStep,
  onStepClick,
  location,
  onChangeLocationClick,
  canNavigateToStep3,
}) => {
  const t = TRANSLATIONS[language];

  const steps = [
    { num: 1, label: t.step1Title },
    { num: 2, label: t.step2Title },
    { num: 3, label: t.step3Title },
    { num: 4, label: t.step4Title },
  ];

  return (
    <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar: Brand + Helpline + Language Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-emerald-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-sm font-bold">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight font-outfit text-white">
                  {t.appName}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-amber-300 border border-emerald-700">
                  Kisan First
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Location & Language Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {location && (
              <button
                type="button"
                onClick={onChangeLocationClick}
                className="flex items-center gap-1.5 text-xs bg-emerald-800/90 hover:bg-emerald-700/90 px-2.5 py-1.5 rounded-lg border border-emerald-700 text-emerald-100 transition-colors"
                title={t.changeLocation}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate max-w-[130px] sm:max-w-[180px] font-medium">
                  {location.city || location.village || location.district || location.state}
                </span>
                <span className="text-[10px] text-amber-300 underline underline-offset-2 ml-1">
                  Change
                </span>
              </button>
            )}

            {/* Language dropdown */}
            <div className="flex items-center bg-emerald-800/90 rounded-lg p-0.5 border border-emerald-700">
              <Languages className="w-3.5 h-3.5 text-emerald-300 ml-2 mr-1 shrink-0" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent text-xs font-semibold text-white px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              >
                <option value="en" className="bg-emerald-950 text-white">English</option>
                <option value="hi" className="bg-emerald-950 text-white">हिंदी (Hindi)</option>
                <option value="mr" className="bg-emerald-950 text-white">मराठी (Marathi)</option>
                <option value="te" className="bg-emerald-950 text-white">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* Kisan Helpline Number */}
            <a
              href="tel:9160365486"
              className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-colors"
              title="Kisan Helpline: 9160365486"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Helpline:</span>
              <span>9160365486</span>
            </a>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <nav aria-label="Step progress" className="pt-2.5">
          <ol className="grid grid-cols-4 gap-1 sm:gap-2">
            {steps.map((step) => {
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
                    className={`w-full flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 font-bold shadow'
                        : isPast
                        ? 'bg-emerald-800/70 text-emerald-100 hover:bg-emerald-800'
                        : 'bg-emerald-950/40 text-emerald-400/60 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                        isActive
                          ? 'bg-stone-950 text-amber-400'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-900 text-emerald-400'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                    </span>
                    <span className="text-xs truncate hidden xs:inline sm:inline">
                      {step.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
};
