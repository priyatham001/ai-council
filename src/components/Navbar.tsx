import React from 'react';
import {
  Tractor,
  Compass,
  TrendingUp,
  Store,
  Users,
  Truck,
  Brain,
  History,
  Settings,
  HelpCircle,
  Globe,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../lib/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDemoMode: boolean;
  onLoadDemoScenario: () => void;
  onOpenLanguageModal?: () => void;
  onSwitchToSimpleMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  isDemoMode,
  onLoadDemoScenario,
  onOpenLanguageModal,
  onSwitchToSimpleMode
}) => {
  const t = getTranslation(language);

  const navItems = [
    { id: 'find', label: t.navFindMarket, icon: Compass },
    { id: 'prices', label: t.navPrices, icon: Store },
    { id: 'buyers', label: t.navBuyers, icon: Users },
    { id: 'transport', label: t.navTransport, icon: Truck },
    { id: 'trends', label: t.navTrends, icon: TrendingUp },
    { id: 'ai', label: t.navAIInsights, icon: Brain },
    { id: 'history', label: t.navHistory, icon: History },
    { id: 'admin', label: t.navAdmin, icon: Settings },
    { id: 'help', label: t.navHelp, icon: HelpCircle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-xs">
      {/* Top Banner: SIH 2026 Problem Statement & Demo Notice */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded font-mono text-[11px]">
              SIH26132
            </span>
            <span>{t.sihBadge}</span>
          </div>

          {isDemoMode && (
            <div className="flex items-center gap-1.5 text-amber-200 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.demoModeNotice}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onLoadDemoScenario}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Instantly test with Bhimavaram Paddy 10 Quintals"
            >
              <Sparkles className="w-3 h-3" />
              <span>{t.btnDemoScenario}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentTab('find')}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  {t.appTitle}
                </span>
                <span className="text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Krishi Link
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs border border-emerald-200'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

            {/* Right Controls: Simple Mode & Language Selector */}
            <div className="flex items-center gap-2 sm:gap-3">
              {onSwitchToSimpleMode && (
                <button
                  onClick={onSwitchToSimpleMode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                  title="Switch to 5-Step Guided Farmer Assistant"
                >
                  <span>🌾</span>
                  <span className="hidden sm:inline">Farmer Assistant</span>
                  <span className="sm:hidden">Assistant</span>
                </button>
              )}

              <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={onOpenLanguageModal}
                  title="Select language"
                  className="p-1 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                >
                  <Globe className="w-4 h-4 text-emerald-700" />
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                    language === 'en'
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('mr')}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                    language === 'mr'
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                    language === 'hi'
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                    language === 'te'
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>
        </div>

        {/* Sub Navigation Bar for Tablets and Smaller Laptops */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto pb-2 pt-1 border-t border-gray-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
