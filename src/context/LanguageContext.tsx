import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Language } from '../types/krishi';
import { TRANSLATIONS, Translations, getTranslation, SUPPORTED_LANGUAGES } from '../utils/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'krishisetu_language';
const LEGACY_LANG_KEY = 'krishi_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = (localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANG_KEY)) as Language;
      if (saved === 'te' || saved === 'en' || saved === 'mr') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en'; // default English, easily changed to Telugu or Marathi
  });

  const setLanguage = (newLang: Language) => {
    if (newLang !== 'te' && newLang !== 'en' && newLang !== 'mr') {
      newLang = 'en';
    }
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      localStorage.setItem(LEGACY_LANG_KEY, newLang);
    } catch (e) {
      console.warn('Could not persist language', e);
    }
    setLanguageState(newLang);
  };

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      localStorage.setItem(LEGACY_LANG_KEY, language);
    } catch {}
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: getTranslation(language),
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
