import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Mic, Bot, ArrowRight, Loader2, Volume2 } from 'lucide-react';
import { KisanAIChatbot } from './chat/KisanAIChatbot';

const SAMPLE_QUESTIONS = [
  'What is the modal price of Onion in Nashik today?',
  'What are the moisture limits for Agmark Grade A Paddy?',
  'How much freight does a 10-tonne truck cost for 120km?',
  'Which cold storage preserves potatoes best in UP?',
];

export const KisanAIWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);

  const handleAskQuick = async (textToAsk: string) => {
    const question = textToAsk || query;
    if (!question.trim()) return;

    setIsAnswering(true);
    setQuickAnswer(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: question }],
          language: 'en',
          complexity: 'normal',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuickAnswer(data.reply || 'No response received.');
      } else {
        setQuickAnswer(
          'कृषि सेतु AI is ready. You can also open the full Voice Chat Assistant to speak directly in Hindi, Marathi, Telugu, or English.'
        );
      }
    } catch (err) {
      setQuickAnswer(
        'Kisan AI Assistant is standing by. Click "Launch Live Assistant" below to begin a conversational session.'
      );
    } finally {
      setIsAnswering(false);
    }
  };

  const handleOpenFullAssistant = () => {
    window.dispatchEvent(new CustomEvent('open_kisan_ai'));
  };

  return (
    <section className="py-16 bg-[#040e06] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-[#081f11] via-[#091b10] to-[#040e07] p-6 sm:p-10 shadow-2xl relative">
          {/* Subtle background gradient glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-xl font-black shadow-md">
                  🤖
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                    <span>Kisan AI</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                      Live
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-300">
                    Your Intelligent Farming Companion
                  </p>
                </div>
              </div>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mt-4">
                Powered by Gemini multi-model intelligence with real-time agronomic guidance, mandi price lookups, and Live Voice conversations. Speaks English, हिन्दी, मराठी, and తెలుగు.
              </p>

              {/* Sample Prompts */}
              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Common Kisan Inquiries:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setQuery(q);
                        handleAskQuick(q);
                      }}
                      className="text-left text-xs px-3 py-1.5 rounded-xl bg-black/40 hover:bg-emerald-900/60 border border-emerald-700/40 text-stone-200 hover:text-white transition-all cursor-pointer"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Voice CTA button */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenFullAssistant}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-extrabold shadow-md transition-all cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Launch Live Voice Assistant</span>
                </button>
                <span className="text-[11px] text-stone-400">
                  Tap to speak naturally
                </span>
              </div>
            </div>

            {/* Right Interactive Quick-Ask Column */}
            <div className="lg:col-span-6 bg-black/40 rounded-2xl p-5 sm:p-6 border border-emerald-500/20 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  <span>Ask Instant Agronomy Question</span>
                </span>
                <span className="text-[10px] text-stone-400">Fast Mode</span>
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAskQuick(query);
                    }
                  }}
                  placeholder="Ask about crop quality, APMC prices, storage..."
                  className="flex-1 px-4 py-3 rounded-xl bg-stone-900/90 border border-emerald-600/40 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  disabled={isAnswering || !query.trim()}
                  onClick={() => handleAskQuick(query)}
                  className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-stone-950 transition-colors cursor-pointer shrink-0"
                  title="Send Question"
                >
                  {isAnswering ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Quick Answer Display */}
              <AnimatePresence>
                {quickAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-stone-200 leading-relaxed max-h-48 overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-1 text-emerald-400 font-bold text-[11px]">
                      <span>Kisan AI Advice</span>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </div>
                    <p className="whitespace-pre-wrap">{quickAnswer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Floating Chatbot Instance for Full Dialogue & Live Voice */}
      <KisanAIChatbot language="en" />
    </section>
  );
};
