import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Language } from '../../types/krishi';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  mapLinks?: Array<{ title: string; uri: string }>;
}

interface KisanAIChatbotProps {
  language: Language;
  cropName?: string;
  userLocation?: { latitude: number; longitude: number; name?: string };
}

const QUICK_PROMPTS = [
  'How does Grade A or FAQ Grade B affect my mandi rate?',
  'Find nearest APMC mandis and wholesale yards',
  'What are the signs of fungal rot and crop rejection?',
  'How to prevent transit spoilage for vegetables?',
];

export const KisanAIChatbot: React.FC<KisanAIChatbotProps> = ({
  language,
  cropName,
  userLocation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Namaste! 🙏 I am **KrishiSetu AgriSaathi (कृषि सेतु सहायक)**, your Gemini-powered crop quality assayer and APMC mandi advisor.\n\nAsk me about:\n- **AI Crop Scanning & Agmark Grades** (Grade A, B, C, Rejection)\n- **Nearby Mandi Locations & APMC yards** (grounded with Google Maps)\n- **Real-time mandi price trends & fair negotiations**\n- **Post-harvest curing, moisture control & rot prevention**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Map for server
      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          userLocation,
          language,
          cropName,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Here is the agricultural information you requested.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mapLinks: data.mapLinks || [],
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: 'I apologize, I could not complete the request right now. Please check your connection or try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversation restarted. How can I assist you with your ${cropName || 'crop'} harvest and mandi sales today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-full p-3.5 sm:px-5 sm:py-3.5 shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 border-2 border-emerald-400/40 cursor-pointer group"
          aria-label="Open KrishiSetu AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-wide flex items-center gap-1">
              Ask Kisan AI <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
            <span className="text-[10px] text-emerald-200">Mandi & Crop Advisor</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 shadow-2xl border border-stone-300 bg-white flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-4 flex items-center justify-between border-b border-emerald-800/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700/50 border border-emerald-400/30 flex items-center justify-center text-amber-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">
                    KrishiSetu AgriSaathi AI
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200/80">
                  Maps-Grounded Mandi & Crop Quality Expert
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Clear Chat History"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/60">
            {messages.map((msg) => {
              const isModel = msg.role === 'model';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}
                >
                  {isModel && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className="max-w-[82%] space-y-2">
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isModel
                          ? 'bg-white text-stone-900 border border-stone-200 shadow-xs'
                          : 'bg-emerald-700 text-white rounded-tr-xs shadow-xs font-medium'
                      }`}
                    >
                      {isModel ? (
                        <div className="prose prose-sm max-w-none text-stone-800 leading-relaxed break-words">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Google Maps Grounding Links */}
                      {msg.mapLinks && msg.mapLinks.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-stone-200 space-y-1.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                            <MapPin className="w-3.5 h-3.5 text-red-600" />
                            <span>Grounded APMC Mandi Locations:</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            {msg.mapLinks.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-between text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                              >
                                <span className="font-semibold truncate pr-2">{link.title}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-stone-400 px-1 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isModel && (
                    <div className="w-7 h-7 rounded-lg bg-stone-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white text-stone-600 border border-stone-200 p-3 rounded-2xl text-xs flex items-center gap-2 shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Consulting agricultural databases & Gemini models...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-stone-200 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 rounded-full px-3 py-1 whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about crop quality, mandi prices, or rot..."
              disabled={isLoading}
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600 disabled:opacity-50 font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl p-2.5 sm:px-4 sm:py-2.5 transition-all shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold">Send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
