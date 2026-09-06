import React, { useState } from 'react';
import {
  Globe,
  Menu,
  X,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
  Truck,
  Settings,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { Language, FarmerLocation } from '../../types';

interface FarmerHeaderProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  farmerName?: string;
  location?: FarmerLocation;
  currentStep: number;
  onNavigateToTab?: (tab: string) => void;
  onRestartFlow: () => void;
}

export const FarmerHeader: React.FC<FarmerHeaderProps> = ({
  language,
  onSelectLanguage,
  farmerName,
  location,
  currentStep,
  onNavigateToTab,
  onRestartFlow
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { id: Language; label: string }[] = [
    { id: 'te', label: 'తెలుగు' },
    { id: 'hi', label: 'हिन्दी' },
    { id: 'mr', label: 'मराठी' },
    { id: 'en', label: 'English' }
  ];

  const currentLangLabel =
    languages.find((l) => l.id === language)?.label || 'English';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo & Quick Restart */}
        <button
          onClick={onRestartFlow}
          className="flex items-center gap-2 cursor-pointer text-left"
          title="Return to start"
        >
          <span className="text-xl" role="img" aria-label="wheat">
            🌾
          </span>
          <div>
            <span className="text-base font-extrabold text-emerald-950 tracking-tight block leading-none">
              KrishiSetu
            </span>
            {location && location.villageOrTown && (
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                <span>{farmerName ? `${farmerName} • ` : ''}{location.villageOrTown}</span>
              </span>
            )}
          </div>
        </button>

        {/* Right Controls: Language Switcher & Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-emerald-50 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLangLabel}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 divide-y divide-slate-50">
                {languages.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onSelectLanguage(l.id);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      language === l.id
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Menu Toggle (for Advanced Tools / Dashboard) */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            aria-label="Toggle menu"
          >
            {showMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide-down Menu for Advanced Features (Kept secondary to avoid cluttering primary flow) */}
      {showMenu && (
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs divide-y divide-slate-100">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                setShowMenu(false);
                onNavigateToTab && onNavigateToTab('prices');
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-left hover:border-emerald-300 font-semibold text-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Price Trends</span>
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                onNavigateToTab && onNavigateToTab('buyers');
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-left hover:border-emerald-300 font-semibold text-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Buyers Directory</span>
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                onNavigateToTab && onNavigateToTab('transport');
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-left hover:border-emerald-300 font-semibold text-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Transport Calc</span>
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                onNavigateToTab && onNavigateToTab('admin');
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-left hover:border-emerald-300 font-semibold text-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Settings</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-slate-500 text-[11px]">
            <span>SIH26132 • Smart Krishi Market</span>
            <button
              onClick={() => {
                setShowMenu(false);
                onRestartFlow();
              }}
              className="font-bold text-emerald-800 underline cursor-pointer"
            >
              Start From Page 1
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
