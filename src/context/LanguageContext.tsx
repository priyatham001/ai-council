/**
 * KrishiSetu — Global Language Context
 *
 * Single source of truth for the selected language.
 * All components that need language should use useLanguage() from this context.
 * localStorage key: 'krishi_language'
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { Language } from '../types/krishi';
import { TRANSLATIONS, SUPPORTED_LANGUAGES, type Translations } from '../utils/i18n';
import { ALL_TRANSLATIONS, getLocalizedText, TranslationDict } from '../agrilink/lib/translations';

// Re-export so consumers have one import
export type { Language, Translations, TranslationDict };
export { SUPPORTED_LANGUAGES, ALL_TRANSLATIONS };

export type UniversalTranslate = {
  (key: string, fallback?: string): string;
} & Translations;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: UniversalTranslate;
  /** Safe lookup shorthand for either dot-notated key or legacy field */
  tr: (key: string, fallback?: string) => string;
  translate: (key: string, fallback?: string) => string;
  dict: TranslationDict;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LS_KEY = 'krishi_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(LS_KEY) as Language | null;
    // Validate: only accept supported codes
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) return saved;
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLangState(lang);
    localStorage.setItem(LS_KEY, lang);
    // Also write to the agrilink storage service key so AppNavbar stays in sync
    localStorage.setItem('smartagrilink_lang', lang);
    // Dispatch event for components listening on storage events
    window.dispatchEvent(new StorageEvent('storage', { key: LS_KEY, newValue: lang }));
    window.dispatchEvent(new CustomEvent('krishi_language_changed', { detail: lang }));
    window.dispatchEvent(new CustomEvent('smartagrilink_lang_changed', { detail: lang }));
  }, []);

  // Listen for changes from legacy components (AppNavbar writes to smartagrilink_lang)
  useEffect(() => {
    const handleLegacyChange = () => {
      const legacy = localStorage.getItem('smartagrilink_lang') as Language | null;
      if (legacy && legacy !== language && SUPPORTED_LANGUAGES.some(l => l.code === legacy)) {
        setLangState(legacy);
        localStorage.setItem(LS_KEY, legacy);
      }
    };
    window.addEventListener('smartagrilink_lang_changed', handleLegacyChange);
    return () => window.removeEventListener('smartagrilink_lang_changed', handleLegacyChange);
  }, [language]);

  const dict = useMemo<TranslationDict>(() => {
    return ALL_TRANSLATIONS[language] || ALL_TRANSLATIONS.en;
  }, [language]);

  const tr = useCallback(
    (key: string, fallback?: string): string => {
      return getLocalizedText(key, language, fallback);
    },
    [language]
  );

  const t = useMemo<UniversalTranslate>(() => {
    const legacyT = TRANSLATIONS[language] || TRANSLATIONS.en;
    const fn = ((key: string, fallback?: string): string => {
      return getLocalizedText(key, language, fallback);
    }) as any;

    // Attach all legacy properties onto fn so both t.appName and t('buyer.marketplace') work
    Object.assign(fn, legacyT);
    return fn;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tr, translate: tr, dict }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
};

// Alias for components using the old name
export const useTranslation = useLanguage;

