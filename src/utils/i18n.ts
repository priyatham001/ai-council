import { Language } from '../types/krishi';
import {
  Translations,
  EN_TRANSLATIONS,
  TE_TRANSLATIONS,
  HI_TRANSLATIONS,
  TA_TRANSLATIONS,
  KN_TRANSLATIONS,
  ML_TRANSLATIONS,
  MR_TRANSLATIONS,
} from './i18nData';

export type { Translations };

export const TRANSLATIONS: Record<Language, Translations> = {
  te: TE_TRANSLATIONS,
  en: EN_TRANSLATIONS,
  mr: MR_TRANSLATIONS,
};

export const SUPPORTED_LANGUAGES: {
  code: Language;
  label: string;
  native: string;
  flag: string;
  greeting: string;
}[] = [
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', greeting: 'కిసాన్ సేతుకి స్వాగతం' },
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧', greeting: 'Welcome to KrishiSetu' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳', greeting: 'कृषीसेतू मध्ये आपले स्वागत आहे' },
];

export function getTranslation(lang: Language): Translations {
  return TRANSLATIONS[lang] || EN_TRANSLATIONS;
}
