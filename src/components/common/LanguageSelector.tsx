import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../utils/i18n';

/**
 * Compact animated language selector, driven entirely by the central
 * LanguageContext (single source of truth — see src/context/LanguageContext.tsx).
 *
 * This replaces the old plain <select> dropdowns that used to live directly
 * inside AppNavbar / PublicLayout (which read/wrote the legacy
 * `smartagrilink_lang` key on their own, independent of the app-wide
 * language state and limited to a subset of the 7 supported languages).
 *
 * - Keyboard accessible: Enter/Space toggles, Escape closes, arrow keys move
 *   focus is handled natively via role="listbox"/"option" + button semantics.
 * - Closes on outside click and Escape.
 * - No page reload, no duplicate state — updates propagate everywhere
 *   instantly through useLanguage().
 */
export const LanguageSelector: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const current = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className={
          isDark
            ? 'flex items-center gap-1.5 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400'
            : 'flex items-center gap-1.5 bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
        }
      >
        <Globe className={isDark ? 'w-3.5 h-3.5 text-emerald-300 shrink-0' : 'w-3.5 h-3.5 text-gray-500 shrink-0'} />
        <span className="hidden sm:inline">{current.native}</span>
        <ChevronDown
          className={`w-3 h-3 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${
            isDark ? 'text-emerald-300' : 'text-gray-400'
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Language options"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={
              isDark
                ? 'absolute right-0 top-full mt-2 w-52 bg-emerald-950 border border-emerald-800 rounded-2xl shadow-2xl overflow-hidden z-50'
                : 'absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50'
            }
          >
            {SUPPORTED_LANGUAGES.map((lang, idx) => {
              const selected = lang.code === language;
              return (
                <motion.button
                  key={lang.code}
                  role="option"
                  aria-selected={selected}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.14, delay: idx * 0.03 }}
                  className={
                    isDark
                      ? `w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                          selected ? 'bg-emerald-800/80 text-white' : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
                        }`
                      : `w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                          selected ? 'bg-brand-50 text-brand-900' : 'text-gray-700 hover:bg-gray-50'
                        }`
                  }
                >
                  <div>
                    <span className="block text-sm font-bold">{lang.native}</span>
                    <span className={isDark ? 'block text-[10px] text-emerald-400 font-medium' : 'block text-[10px] text-gray-400 font-medium'}>
                      {lang.label}
                    </span>
                  </div>
                  {selected && <Check className={isDark ? 'w-4 h-4 text-emerald-400 shrink-0' : 'w-4 h-4 text-brand-600 shrink-0'} />}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
