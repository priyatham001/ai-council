import React, { useState, useEffect } from 'react';
import { Menu, Sparkles, AlertCircle } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { CouncilView } from './components/CouncilView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import {
  CouncilMode,
  AIProviderMeta,
  HealthResponse,
  CouncilAnalysisDocument,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'council' | 'history' | 'settings'>('council');
  const [darkMode, setDarkMode] = useState(true);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [providers, setProviders] = useState<AIProviderMeta[]>([]);
  const [historyCount, setHistoryCount] = useState(0);
  const [demoMode, setDemoMode] = useState(false);
  const [defaultMode, setDefaultMode] = useState<CouncilMode>('BALANCED');

  // Sync dark mode with HTML root class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch health and model status
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [healthRes, modelsRes, historyRes] = await Promise.all([
          fetch('/api/health').catch(() => null),
          fetch('/api/models').catch(() => null),
          fetch('/api/history').catch(() => null),
        ]);

        if (healthRes && healthRes.ok) {
          const hData = await healthRes.json();
          setHealth(hData);
        }

        if (modelsRes && modelsRes.ok) {
          const mData = await modelsRes.json();
          if (mData.providers) {
            setProviders(mData.providers);
          }
        }

        if (historyRes && historyRes.ok) {
          const histData = await historyRes.json();
          if (Array.isArray(histData.history)) {
            setHistoryCount(histData.history.length);
          }
        }
      } catch (err) {
        console.warn('Initial metadata load warning:', err);
      }
    };

    fetchMetadata();
  }, []);

  const handleAnalysisComplete = (analysis: CouncilAnalysisDocument) => {
    setHistoryCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col md:flex-row antialiased selection:bg-blue-600 selection:text-white font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={historyCount}
        health={health}
        demoMode={demoMode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-[#09090b]/95 backdrop-blur-md border-b border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsOpenMobile(true)}
              className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-[#09090b] rotate-45" />
              </div>
              <span className="font-bold uppercase tracking-tight text-white text-base">AI Council</span>
            </div>
          </div>
          {demoMode && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
              Demo Active
            </span>
          )}
        </header>

        {/* Main View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'council' && (
            <CouncilView
              providers={providers}
              demoMode={demoMode}
              setDemoMode={setDemoMode}
              defaultMode={defaultMode}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}

          {activeTab === 'history' && <HistoryView />}

          {activeTab === 'settings' && (
            <SettingsView
              providers={providers}
              defaultMode={defaultMode}
              setDefaultMode={setDefaultMode}
              demoMode={demoMode}
              setDemoMode={setDemoMode}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              health={health}
            />
          )}
        </main>
      </div>
    </div>
  );
}
