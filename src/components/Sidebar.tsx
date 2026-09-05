import React from 'react';
import {
  Compass,
  History,
  Settings,
  Sparkles,
  Database,
  Moon,
  Sun,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import { HealthResponse } from '../../types/ai';

interface SidebarProps {
  activeTab: 'council' | 'history' | 'settings';
  setActiveTab: (tab: 'council' | 'history' | 'settings') => void;
  historyCount: number;
  health: HealthResponse | null;
  demoMode: boolean;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  health,
  demoMode,
  darkMode,
  setDarkMode,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const configuredCount = health?.totalConfigured ?? 1;
  const isMongoLive = health?.mongodb ?? false;

  const navItems = [
    {
      id: 'council' as const,
      label: 'AI Council Chat',
      icon: Compass,
      badge: null,
    },
    {
      id: 'history' as const,
      label: 'History',
      icon: History,
      badge: historyCount > 0 ? historyCount : null,
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col justify-between border-r transition-transform duration-200 ease-in-out shrink-0
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          bg-[#09090b] text-[#fafafa] border-[#27272a]`}
      >
        {/* Top Header & Navigation */}
        <div className="p-6 flex flex-col">
          {/* Brand Logo & Name */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-xs">
                <div className="w-4 h-4 border-2 border-[#09090b] rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase text-white">
                AI Council
              </span>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsOpenMobile(false)}
              className="p-1.5 rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#18181b] md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#27272a] text-white font-medium'
                      : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#18181b] text-[#a1a1aa] font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status & Info */}
        <div className="mt-auto p-6 border-t border-[#27272a] flex flex-col gap-4 text-xs">
          {/* Models Status List */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#71717a] font-medium uppercase mb-3 tracking-wider">
              <span>Status</span>
              {demoMode && (
                <span className="text-[10px] text-purple-400 font-mono">Demo</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa]">Gemini 2.5</span>
                <span className={health?.providers.gemini ? 'text-emerald-400 font-medium' : demoMode ? 'text-purple-400' : 'text-[#71717a]'}>
                  {health?.providers.gemini ? 'Active' : demoMode ? 'Simulated' : 'Standby'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa]">GPT-4o</span>
                <span className={health?.providers.openai ? 'text-emerald-400 font-medium' : demoMode ? 'text-purple-400' : 'text-[#71717a]'}>
                  {health?.providers.openai ? 'Active' : demoMode ? 'Simulated' : 'Standby'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa]">Claude 3.5</span>
                <span className={health?.providers.anthropic ? 'text-emerald-400 font-medium' : demoMode ? 'text-purple-400' : 'text-[#71717a]'}>
                  {health?.providers.anthropic ? 'Active' : demoMode ? 'Simulated' : 'Standby'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a1a1aa]">Mistral Large</span>
                <span className={health?.providers.mistral ? 'text-emerald-400 font-medium' : demoMode ? 'text-purple-400' : 'text-[#71717a]'}>
                  {health?.providers.mistral ? 'Active' : demoMode ? 'Simulated' : 'Standby'}
                </span>
              </div>
            </div>
          </div>

          {/* Database & Theme */}
          <div className="pt-3 border-t border-[#27272a]/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#71717a]" />
                <span className="text-[11px]">Database</span>
              </div>
              <span className="text-[11px] text-[#a1a1aa]">
                {isMongoLive ? (
                  <span className="text-green-500">MongoDB</span>
                ) : (
                  'In-Memory'
                )}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#71717a]">Appearance</span>
              <button
                id="theme-toggle-btn"
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-white text-[11px] transition-colors cursor-pointer"
              >
                {darkMode ? (
                  <>
                    <Moon className="w-3 h-3 text-blue-400" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Light</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
