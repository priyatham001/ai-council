import React, { useState, useEffect } from 'react';
import { Menu, Sparkles, AlertCircle, MapPin } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { CouncilView } from './components/CouncilView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { GoogleMapView } from './components/GoogleMapView';
import {
  CouncilMode,
  AIProviderMeta,
  HealthResponse,
  CouncilAnalysisDocument,
  ChatConversation,
} from './types';
import { parseJsonResponse } from './lib/apiClient';

const LOCAL_STORAGE_KEY = 'ai_council_recent_chats';

export default function App() {
  const [activeTab, setActiveTab] = useState<'council' | 'history' | 'maps' | 'settings'>('council');
  const [darkMode, setDarkMode] = useState(true);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [providers, setProviders] = useState<AIProviderMeta[]>([]);
  const [historyCount, setHistoryCount] = useState(0);
  const [demoMode, setDemoMode] = useState(false);
  const [defaultMode, setDefaultMode] = useState<CouncilMode>('BALANCED');
  const [recentConversations, setRecentConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);

  // Load saved local conversations on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentConversations(parsed);
        }
      }
    } catch {
      // Ignore local storage error
    }
  }, []);

  // Sync dark mode with HTML root class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch health, model status, and history
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [healthRes, modelsRes, historyRes] = await Promise.all([
          fetch('/api/health').catch(() => null),
          fetch('/api/models').catch(() => null),
          fetch('/api/history').catch(() => null),
        ]);

        if (healthRes) {
          const hResult = await parseJsonResponse<HealthResponse>(healthRes);
          if (hResult.ok && hResult.data) {
            setHealth(hResult.data);
          }
        }

        if (modelsRes) {
          const mResult = await parseJsonResponse<{ providers?: AIProviderMeta[] }>(modelsRes);
          if (mResult.ok && mResult.data?.providers) {
            setProviders(mResult.data.providers);
          }
        }

        if (historyRes) {
          const histResult = await parseJsonResponse<{ history?: CouncilAnalysisDocument[] }>(historyRes);
          if (histResult.ok && Array.isArray(histResult.data?.history)) {
            const histList = histResult.data.history;
            setHistoryCount(histList.length);

            // Populate recent chats from server if local list is empty
            setRecentConversations((prev) => {
              if (prev.length > 0) return prev;
              return histList.slice(0, 10).map((item) => ({
                id: item.id || item._id || 'chat_' + Math.random(),
                title: item.question.slice(0, 48),
                createdAt: item.createdAt || new Date().toISOString(),
                mode: item.mode,
                messages: [
                  {
                    id: 'u_' + (item.id || item._id),
                    role: 'user',
                    content: item.question,
                    timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    files: item.files,
                  },
                  {
                    id: 'c_' + (item.id || item._id),
                    role: 'council',
                    content: item.finalAnswer,
                    timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    analysis: item,
                  },
                ],
                providersCount: item.responses?.length || 4,
              }));
            });
          }
        }
      } catch (err) {
        console.warn('Initial metadata load warning:', err);
      }
    };

    fetchMetadata();
  }, []);

  const handleSaveConversation = (conversation: ChatConversation) => {
    setRecentConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== conversation.id);
      const updated = [conversation, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage write error
      }
      return updated;
    });
  };

  const handleSelectChat = (chatId: string) => {
    const found = recentConversations.find((c) => c.id === chatId);
    if (found) {
      setActiveConversation(found);
      setActiveTab('council');
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setRecentConversations((prev) => {
      const updated = prev.filter((c) => c.id !== chatId);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    if (activeConversation?.id === chatId) {
      setActiveConversation(null);
    }
  };

  const handleAnalysisComplete = (analysis: CouncilAnalysisDocument) => {
    setHistoryCount((prev) => prev + 1);
  };

  const handleAskAboutLocation = (prompt: string) => {
    setActiveTab('council');
    // Set active conversation with prompt or trigger in CouncilView
    setActiveConversation({
      id: 'chat_' + Date.now(),
      title: prompt.slice(0, 48),
      createdAt: new Date().toISOString(),
      mode: 'BALANCED',
      messages: [
        {
          id: 'u_' + Date.now(),
          role: 'user',
          content: prompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      providersCount: 4,
    });
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
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onNewChat={() => {
          setActiveConversation(null);
          setActiveTab('council');
        }}
        recentChats={recentConversations}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
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
        <main className="flex-1 p-2 sm:p-4 lg:p-6 max-w-7xl w-full mx-auto flex flex-col">
          {activeTab === 'council' && (
            <CouncilView
              providers={providers}
              demoMode={demoMode}
              setDemoMode={setDemoMode}
              defaultMode={defaultMode}
              onAnalysisComplete={handleAnalysisComplete}
              onOpenMap={(prompt) => setActiveTab('maps')}
              activeConversation={activeConversation}
              onNewChat={() => setActiveConversation(null)}
              onSaveConversation={handleSaveConversation}
            />
          )}

          {activeTab === 'maps' && (
            <div className="py-2">
              <GoogleMapView
                onAskCouncilAboutLocation={handleAskAboutLocation}
                onClose={() => setActiveTab('council')}
              />
            </div>
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
