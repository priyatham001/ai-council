import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  MapPin,
  ExternalLink,
  Minimize2,
  Maximize2,
  RefreshCw,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Zap,
  BrainCircuit,
  RadioTower,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// Language type is re-exported from the central 7-language registry (see
// src/types/krishi.ts), so values from either side of the app (agrilink or
// KrishiWorkflow) satisfy this component's props without a cast.
import { Language } from '../../agrilink/types';
import { localStorageService } from '../../agrilink/services/storageService';
import { useLanguage } from '../../context/LanguageContext';

/**
 * KrishiSetu AI — THE canonical assistant for the entire application.
 *
 * This replaces three previously-duplicated implementations:
 *  - src/components/KisanAIWidget.tsx        (dead wrapper, removed)
 *  - src/components/chat/KisanAIChatbot.tsx  (real Gemini backend — logic merged here)
 *  - src/agrilink/components/common/AgriSaathiAssistant.tsx (canned/simulated replies — retired;
 *    its persona-aware welcome message + quick deep-links are preserved here, but every
 *    response now comes from the real /api/chat backend, never fabricated text)
 *
 * Exactly one of these should be mounted per route tree. Because react-router only ever
 * renders one route at a time, using this single component everywhere guarantees exactly
 * one floating AI entry point is ever visible on screen.
 */

export type AIModelMode = 'general' | 'fast' | 'complex' | 'live';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  mapLinks?: Array<{ title: string; uri: string }>;
}

interface KrishiSetuAIProps {
  /** Optional explicit overrides — pages with live state (e.g. KrishiWorkflow) pass these. */
  language?: Language;
  cropName?: string;
  userLocation?: { latitude: number; longitude: number; name?: string };
}

const DEFAULT_QUICK_PROMPTS = [
  'आज का मंडी भाव क्या है?',
  'How to get Grade A quality?',
  'Nearest APMC mandi with highest rate',
  'APMC mandi fees explained',
];

// Contextual quick prompts based on the current route — ported from AgriSaathiAssistant's
// deep-link chips, but now just seed a real AI question rather than a canned reply.
function getRouteQuickPrompts(pathname: string, cropName: string): string[] {
  if (pathname.includes('/farmer/markets') || pathname.includes('/crop-analysis')) {
    return [`Today's ${cropName} price`, 'Compare nearby markets', 'What is net realization?', DEFAULT_QUICK_PROMPTS[2]];
  }
  if (pathname.includes('/farmer/buyers') || pathname.includes('/buyers')) {
    return ['Find verified buyers near me', `Best ${cropName} buyers this week`, 'How does buyer verification work?'];
  }
  if (pathname.includes('/farmer/logistics') || pathname.includes('/transport')) {
    return ['Estimate transport cost', 'Nearest pickup options', 'How is freight calculated?'];
  }
  if (pathname.includes('/farmer/lots')) {
    return ['How do I create a digital lot?', 'What makes a lot attractive to buyers?', DEFAULT_QUICK_PROMPTS[1]];
  }
  if (pathname.includes('/farmer/ai-advisor')) {
    return ['When is the best time to sell?', 'Should I wait or sell now?', `${cropName} price outlook`];
  }
  return DEFAULT_QUICK_PROMPTS;
}

export const KrishiSetuAI: React.FC<KrishiSetuAIProps> = (props) => {
  const routerLocation = useLocation();

  // Fall back to persisted persona when a page doesn't pass explicit live context
  // (this is how the agrilink public/app routes get context, matching the old AgriSaathiAssistant).
  const [persona, setPersona] = useState(() => localStorageService.getPersona());

  useEffect(() => {
    const handleUpdate = () => setPersona(localStorageService.getPersona());
    window.addEventListener('smartagrilink_persona_changed', handleUpdate);
    return () => window.removeEventListener('smartagrilink_persona_changed', handleUpdate);
  }, []);

  // Language always comes from the global LanguageContext (single source of truth) unless a
  // page passes an explicit override. Previously this read a local mirror of the
  // 'smartagrilink_lang' localStorage key that only refreshed on a 'smartagrilink_lang_changed'
  // event — an event LanguageContext's setLanguage() never fires — so the AI widget kept showing
  // the old language after switching via the Navbar/onboarding selector until a full page reload.
  const { language: globalLanguage } = useLanguage();
  const language = props.language ?? globalLanguage;
  const cropName = props.cropName ?? persona.crop ?? persona.primaryCrop ?? 'your crop';
  // MandiMarket has no lat/lng in this data model, so we only pass an explicit userLocation
  // through (e.g. from KrishiWorkflow's real GPS-detected location). Without one, the backend
  // simply skips the Google Maps grounding tool for this request — never a fabricated coordinate.
  const userLocation = props.userLocation;

  const quickPrompts = useMemo(
    () => getRouteQuickPrompts(routerLocation.pathname, cropName),
    [routerLocation.pathname, cropName]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelMode, setModelMode] = useState<AIModelMode>('general');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Namaste! 🙏 I am **KrishiSetu AI (कृषिसेतु AI)**, your crop quality assayer and mandi market advisor.\n\nI can help with **${cropName}** prices, AGMARK grading, comparing markets, verified buyers, logistics, and more — ask me anything or tap a suggestion below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Global listener so any button elsewhere in the app can open the assistant.
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open_kisan_ai', handleOpen);
    return () => window.removeEventListener('open_kisan_ai', handleOpen);
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'te' ? 'te-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    } else {
      setVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        recognitionRef.current.lang =
          language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'te' ? 'te-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Could not start recognition:', e);
      }
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[*#_`~\[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .slice(0, 400);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang =
      language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

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
      const payloadMessages = newHistory.map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          userLocation,
          language,
          cropName,
          complexity: modelMode === 'complex' ? 'complex' : modelMode === 'fast' ? 'fast' : 'general',
          taskType: modelMode,
        }),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      const modelReply = data.reply || 'Here is the agricultural information you requested.';

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: modelReply,
        modelUsed: data.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mapLinks: data.mapLinks || [],
      };

      setMessages((prev) => [...prev, modelMsg]);

      if (autoSpeak || modelMode === 'live') speakText(modelReply);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: 'KrishiSetu AI: Could not complete request right now. Please check connectivity or ask again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversation restarted in **${modelMode.toUpperCase()}** mode. How can I assist you with your ${cropName} harvest and mandi sales today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-full p-3.5 sm:px-5 sm:py-3.5 shadow-2xl flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 border-2 border-amber-400/80 cursor-pointer group"
          aria-label="Open KrishiSetu AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-wide flex items-center gap-1 text-amber-300">
              KrishiSetu AI <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </span>
            <span className="text-[10px] text-emerald-200">Mandi &amp; Crop Advisor</span>
          </div>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 shadow-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 flex flex-col overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[610px] max-h-[88vh] rounded-3xl'
          }`}
        >
          <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-3.5 sm:p-4 flex flex-col gap-2.5 border-b border-emerald-800/40 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-800/80 border border-amber-400/50 flex items-center justify-center relative shadow-inner">
                  <Bot className="w-5 h-5 text-amber-300" />
                  {isSpeaking && (
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">KrishiSetu AI</h3>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20">
                      Live AI
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-200/80">Mandi &amp; Agronomy Advisor</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setAutoSpeak(!autoSpeak);
                  }}
                  title={autoSpeak ? 'Disable Voice Readout' : 'Enable Voice Readout'}
                  className={`p-1.5 rounded-lg transition-colors ${
                    autoSpeak ? 'text-amber-300 bg-amber-400/20' : 'text-stone-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

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
                  onClick={() => {
                    stopSpeaking();
                    setIsOpen(false);
                  }}
                  title="Close"
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <button
                type="button"
                onClick={() => setModelMode('general')}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                  modelMode === 'general' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Sparkles className="w-3 h-3" /> General
              </button>

              <button
                type="button"
                onClick={() => setModelMode('fast')}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                  modelMode === 'fast' ? 'bg-amber-500 text-stone-900 shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Zap className="w-3 h-3" /> Fast
              </button>

              <button
                type="button"
                onClick={() => setModelMode('complex')}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                  modelMode === 'complex' ? 'bg-purple-600 text-white shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <BrainCircuit className="w-3 h-3" /> Deep
              </button>

              <button
                type="button"
                onClick={() => {
                  setModelMode('live');
                  setAutoSpeak(true);
                }}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                  modelMode === 'live' ? 'bg-rose-600 text-white shadow-xs' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <RadioTower className="w-3 h-3" /> Live Voice
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/60">
            {messages.map((msg) => {
              const isModel = msg.role === 'model';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}>
                  {isModel && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className="max-w-[84%] space-y-1.5">
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

                      {isModel && msg.id !== 'welcome' && (
                        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                          <span className="font-mono text-emerald-800 font-semibold">{msg.modelUsed || 'gemini-model'}</span>
                          <button
                            type="button"
                            onClick={() => speakText(msg.text)}
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" /> Read Aloud
                          </button>
                        </div>
                      )}

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

                    <span className="text-[10px] text-stone-400 px-1 block text-right">{msg.timestamp}</span>
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
                  <span>Consulting agricultural data...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {isListening && (
            <div className="bg-rose-50 border-t border-rose-200 px-4 py-2 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
                <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping" />
                Listening in {language.toUpperCase()}...
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="text-rose-600 hover:text-rose-800 text-xs font-black underline cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          <div className="px-3 py-2 bg-white border-t border-stone-200 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((prompt, idx) => (
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
          >
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Stop Recording' : 'Speak to KrishiSetu AI'}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                  isListening ? 'bg-rose-600 text-white border-rose-700 animate-bounce' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-700" />}
              </button>
            )}

            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? 'Listening to voice...' : 'Ask or speak about crop quality, mandi prices...'}
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

          <div className="bg-stone-100 dark:bg-stone-950 px-3 py-1.5 text-center text-[10px] text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800 shrink-0">
            ⚠️ AI guidance based on verified APMC market trends &amp; AGMARK standards.
          </div>
        </div>
      )}
    </>
  );
};
