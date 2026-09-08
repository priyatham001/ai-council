import React from 'react';
import {
  MessageSquare,
  Plus,
  History,
  Settings,
  Sparkles,
  Database,
  Moon,
  Sun,
  ShieldCheck,
  AlertCircle,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Cpu,
  Bot,
  Compass,
} from 'lucide-react';
import { HealthResponse } from '../types';

interface SidebarProps {
  activeTab: 'council' | 'history' | 'maps' | 'settings';
  setActiveTab: (tab: 'council' | 'history' | 'maps' | 'settings') => void;
  historyCount: number;
  health: HealthResponse | null;
  demoMode: boolean;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (val: boolean) => void;
  onNewChat?: () => void;
  recentChats?: { id: string; title: string; createdAt: string; providersCount?: number }[];
  onSelectChat?: (id: string) => void;
  onDeleteChat?: (id: string) => void;
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
  isCollapsed = false,
  setIsCollapsed,
  onNewChat,
  recentChats = [],
  onSelectChat,
  onDeleteChat,
}) => {
  const isMongoLive = health?.mongodb ?? false;

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
        className={`fixed md:sticky top-0 left-0 z-50 h-screen flex flex-col justify-between border-r transition-all duration-200 ease-in-out shrink-0 bg-[#09090b] text-[#fafafa] border-[#27272a] ${
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        {/* Top Header: Logo, New Chat & Navigation */}
        <div className="p-4 flex flex-col flex-1 overflow-hidden">
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-4">
            <div
              onClick={() => {
                setActiveTab('council');
                setIsOpenMobile(false);
              }}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-xs shrink-0">
                <div className="w-4 h-4 border-2 border-[#09090b] rotate-45" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight uppercase text-white leading-tight">
                    AI Council
                  </span>
                  <span className="text-[10px] text-[#71717a]">4 Frontier Models</span>
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop) & Close (mobile) */}
            <div className="flex items-center gap-1">
              {setIsCollapsed && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden md:flex p-1 rounded-md text-[#71717a] hover:text-white hover:bg-[#18181b] transition-colors"
                  title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => setIsOpenMobile(false)}
                className="p-1.5 rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#18181b] md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* New Chat Button (Prominent ChatGPT style) */}
          <button
            onClick={() => {
              setActiveTab('council');
              onNewChat?.();
              setIsOpenMobile(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all mb-4 cursor-pointer ${
              isCollapsed
                ? 'justify-center bg-blue-600 text-white'
                : 'bg-white text-black hover:bg-zinc-200 shadow-sm'
            }`}
            title="Start fresh conversation"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>New Chat</span>}
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1 mb-4">
            <button
              onClick={() => {
                setActiveTab('council');
                setIsOpenMobile(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'council'
                  ? 'bg-[#18181b] text-white border border-[#27272a]'
                  : 'text-[#a1a1aa] hover:bg-[#121214] hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="Chat"
            >
              <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" />
              {!isCollapsed && <span>Council Chat</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('maps');
                setIsOpenMobile(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'maps'
                  ? 'bg-[#18181b] text-white border border-[#27272a]'
                  : 'text-[#a1a1aa] hover:bg-[#121214] hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="Google Maps Platform"
            >
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>Google Maps</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    New
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                setIsOpenMobile(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#18181b] text-white border border-[#27272a]'
                  : 'text-[#a1a1aa] hover:bg-[#121214] hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="History"
            >
              <History className="w-4 h-4 text-purple-400 shrink-0" />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>History Logs</span>
                  {historyCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#18181b] text-[#a1a1aa] font-mono border border-[#27272a]">
                      {historyCount}
                    </span>
                  )}
                </div>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setIsOpenMobile(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#18181b] text-white border border-[#27272a]'
                  : 'text-[#a1a1aa] hover:bg-[#121214] hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="Settings"
            >
              <Settings className="w-4 h-4 text-[#71717a] shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </nav>

          {/* Past Chats Section in Sidebar */}
          {!isCollapsed && (
            <div className="flex-1 flex flex-col min-h-0 border-t border-[#27272a]/60 pt-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#71717a] uppercase tracking-wider px-1 mb-2">
                <span>Recent Chats</span>
                <span>{recentChats.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {recentChats.length === 0 ? (
                  <p className="text-xs text-[#52525b] px-2 py-3 italic text-center">
                    No past conversations yet
                  </p>
                ) : (
                  recentChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        onSelectChat?.(chat.id);
                        setActiveTab('council');
                        setIsOpenMobile(false);
                      }}
                      className="group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-[#a1a1aa] hover:text-white hover:bg-[#141417] transition-colors cursor-pointer border border-transparent hover:border-[#27272a]"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MessageSquare className="w-3 h-3 text-[#71717a] shrink-0 group-hover:text-blue-400" />
                        <span className="truncate max-w-[140px] text-xs">
                          {chat.title || 'Conversation'}
                        </span>
                      </div>

                      {onDeleteChat && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#71717a] hover:text-red-400 transition-opacity"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status & Info */}
        <div className="p-4 border-t border-[#27272a] flex flex-col gap-3 text-xs bg-[#0c0c0e]">
          {!isCollapsed && (
            <>
              {/* Models Status Grid */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#71717a] font-semibold uppercase tracking-wider mb-2">
                  <span>AI Providers</span>
                  {demoMode && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800 font-mono">
                      Simulation
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="flex items-center justify-between px-2 py-1 rounded bg-[#141417] border border-[#27272a]">
                    <span className="text-[#a1a1aa]">Gemini</span>
                    <span className="text-green-400 font-medium">✓</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 rounded bg-[#141417] border border-[#27272a]">
                    <span className="text-[#a1a1aa]">GPT-4o</span>
                    <span className="text-green-400 font-medium">✓</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 rounded bg-[#141417] border border-[#27272a]">
                    <span className="text-[#a1a1aa]">Claude</span>
                    <span className="text-green-400 font-medium">✓</span>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1 rounded bg-[#141417] border border-[#27272a]">
                    <span className="text-[#a1a1aa]">Mistral</span>
                    <span className="text-green-400 font-medium">✓</span>
                  </div>
                </div>
              </div>

              {/* Persistence Status */}
              <div className="flex items-center justify-between text-[11px] text-[#71717a] pt-1">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-[#71717a]" />
                  <span>Storage</span>
                </div>
                <span className={isMongoLive ? 'text-green-400' : 'text-yellow-400'}>
                  {isMongoLive ? 'MongoDB' : 'Local Fallback'}
                </span>
              </div>
            </>
          )}

          {/* Theme & Collapse Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-[#27272a]/60">
            {!isCollapsed && (
              <span className="text-[11px] text-[#71717a]">Theme</span>
            )}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141417] border border-[#27272a] text-[#a1a1aa] hover:text-white text-[11px] transition-colors cursor-pointer ${
                isCollapsed ? 'w-full justify-center' : ''
              }`}
              title="Toggle theme"
            >
              {darkMode ? (
                <>
                  <Moon className="w-3 h-3 text-blue-400" />
                  {!isCollapsed && <span>Dark</span>}
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-amber-400" />
                  {!isCollapsed && <span>Light</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
