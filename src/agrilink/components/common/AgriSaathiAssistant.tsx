import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  MapPin
} from 'lucide-react';
import { localStorageService } from '../../services/storageService';
import { marketService } from '../../services/marketService';
import { Language, FarmerPersona } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chips?: string[];
  actionLink?: { label: string; url: string };
}

export const AgriSaathiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [lang, setLang] = useState<Language>(localStorageService.getLanguage());
  const [persona, setPersona] = useState<FarmerPersona>(localStorageService.getPersona());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setLang(localStorageService.getLanguage());
      setPersona(localStorageService.getPersona());
    };
    window.addEventListener('smartagrilink_lang_changed', handleUpdate);
    window.addEventListener('smartagrilink_persona_changed', handleUpdate);
    return () => {
      window.removeEventListener('smartagrilink_lang_changed', handleUpdate);
      window.removeEventListener('smartagrilink_persona_changed', handleUpdate);
    };
  }, []);

  const personaCrop = persona.crop || persona.primaryCrop || 'Produce';
  const market = (persona.mandiId ? marketService.getMarketById(persona.mandiId) : undefined) || marketService.getMarketsByState(persona.state)[0] || marketService.getAllMarkets()[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: lang === 'hi'
        ? `नमस्ते ${persona.name.split(' ')[0]} जी! मैं आपका एग्रीसाथी (AgriSaathi) AI सलाहकार हूँ। मैं ${persona.district}, ${persona.state} में ${personaCrop} के आज के मंडी भाव, बेहतर खरीदार और नेट मुनाफे में आपकी मदद कर सकता हूँ।`
        : lang === 'mr'
        ? `नमस्कार ${persona.name.split(' ')[0]}! मी तुमचा ॲग्रीसाथी AI सहाय्यक आहे. ${persona.district}, ${persona.state} मधील ${personaCrop} बाजारभाव, खरेदीदार आणि विक्रीच्या उत्तम वेळेबद्दल विचारा.`
        : `Namaste ${persona.name.split(' ')[0]}! I am AgriSaathi, your AI market assistant for ${persona.district}, ${persona.state}. I can help you evaluate ${personaCrop} prices, compare ${market.name} vs regional markets, calculate true net realization, and match verified buyers. How can I help you today?`,
      timestamp: 'Just now',
      chips: [`Today's ${personaCrop} Price`, `Compare ${market.name}`, `Find Buyers in ${persona.state}`, `AI Sell Window`]
    }
  ]);

  // Update initial message when persona changes if user hasn't chatted yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'assistant') {
      setMessages([
        {
          id: `m-${Date.now()}`,
          sender: 'assistant',
          text: `Namaste ${persona.name.split(' ')[0]}! I am AgriSaathi, your AI market assistant for ${persona.district}, ${persona.state}. I can help you evaluate ${personaCrop} prices, compare ${market.name} vs regional mandis, and maximize your net take-home realization.`,
          timestamp: 'Just now',
          chips: [`Today's ${personaCrop} Price`, `Compare ${market.name}`, `Find Buyers in ${persona.state}`, `AI Sell Window`]
        }
      ]);
    }
  }, [persona.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Contextual AI response adapted to active persona
    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = '';
      let actionLink: { label: string; url: string } | undefined;

      const priceChange = market.priceChangePct ?? 4.2;
      if (lower.includes('price') || lower.includes('भाव') || lower.includes(personaCrop.toLowerCase()) || lower.includes('onion') || lower.includes('wheat') || lower.includes('tomato')) {
        reply = `${personaCrop} modal price at ${market.name} today is ₹${market.modalPrice.toLocaleString('en-IN')}/quintal (${priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`} trend) with daily arrivals of ${market.arrivalsQuintals} quintals. Demand is currently ${market.demandLevel}.`;
        actionLink = { label: 'Open Market Explorer', url: '/farmer/markets' };
      } else if (lower.includes('market') || lower.includes('better') || lower.includes('compare') || lower.includes('मंडी')) {
        const diff = Math.round(market.modalPrice * 0.08);
        reply = `While distant terminal markets may quote up to ₹${(market.modalPrice + diff).toLocaleString('en-IN')}/q, transport and cess deductions often make ${market.name} (${market.distanceKm || 20} km away) yield ₹${(Math.round(diff * 0.6)).toLocaleString('en-IN')}/q HIGHER net realization in bank!`;
        actionLink = { label: 'Compare on Net Calculator', url: '/farmer/markets' };
      } else if (lower.includes('buyer') || lower.includes('खरीदार') || lower.includes('find')) {
        reply = `We found verified institutional processors active in ${persona.state} looking for Grade A ${personaCrop} with 96%+ on-time payment reliability and 24-48 hr digital escrow clearance.`;
        actionLink = { label: 'View Verified Buyers', url: '/farmer/buyers' };
      } else if (lower.includes('transport') || lower.includes('cost') || lower.includes('logistics') || lower.includes('किराया')) {
        reply = `Direct farm-gate logistics from ${persona.district} is available via Mahindra Bolero and 14ft covered trucks starting at ₹24/km with live GPS milestone tracking.`;
        actionLink = { label: 'Book Transport Vehicle', url: '/farmer/logistics' };
      } else if (lower.includes('sell now') || lower.includes('advisor') || lower.includes('window') || lower.includes('बेचें')) {
        reply = `AI Sell Advisor analysis for ${personaCrop} in ${persona.state}: Projected price stability over the next 3–5 days with strong buyer demand. Recommended selling window: Sep 10–14.`;
        actionLink = { label: 'Run AI Sell Advisor', url: '/farmer/ai-advisor' };
      } else if (lower.includes('lot') || lower.includes('create') || lower.includes('लॉट')) {
        reply = `To create a lot for your ${personaCrop} harvest in ${persona.district}: click 'Create Digital Lot', verify quality parameters, and generate an authenticated QR Lot Passport with state origin code.`;
        actionLink = { label: 'Create New Lot', url: '/farmer/lots/new' };
      } else {
        reply = `KrishiSetu connects farmers across ${persona.state} and all of India with verified buyers. You can check live prices, run AI sell predictions, or create a digital lot to receive direct bids.`;
        actionLink = { label: 'Go to Farmer Dashboard', url: '/farmer' };
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
        actionLink
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const toggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSend(`What is today's ${personaCrop} price in ${market.name}?`);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 border border-brand-500/40"
          aria-label="Open AgriSaathi AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wide">AgriSaathi AI</span>
            <span className="text-[10px] text-brand-200">{persona.district} Mandi Advisor</span>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[390px] max-w-[95vw] h-[590px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-brand-800 via-brand-900 to-emerald-950 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  AgriSaathi AI
                  <span className="text-[10px] font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full">
                    {lang.toUpperCase()}
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {persona.district}, {persona.state} ({personaCrop})
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-700 text-white rounded-tr-xs'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-2xs rounded-tl-xs'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.actionLink && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100">
                      <a
                        href={m.actionLink.url}
                        className="inline-flex items-center gap-1 font-bold text-brand-700 hover:text-brand-800 text-[11px]"
                      >
                        <span>{m.actionLink.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {m.chips && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="text-[10px] font-semibold bg-white hover:bg-brand-50 text-brand-800 border border-brand-200 px-2.5 py-1 rounded-full shadow-2xs transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-xl border transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-gray-100 text-gray-600 hover:text-brand-700 border-gray-200'
                }`}
                title="Voice input simulation"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isRecording ? 'Listening...' : `Ask about ${personaCrop} prices, buyers, transport...`}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white rounded-xl transition-colors shadow-2xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
