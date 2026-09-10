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
  en: EN_TRANSLATIONS,
  te: TE_TRANSLATIONS,
  hi: HI_TRANSLATIONS,
  ta: TA_TRANSLATIONS,
  kn: KN_TRANSLATIONS,
  ml: ML_TRANSLATIONS,
  mr: MR_TRANSLATIONS,
};

/** All 7 languages supported by AgriConnect — English, Marathi, Telugu front and center */
export const SUPPORTED_LANGUAGES: {
  code: Language;
  label: string;
  native: string;
  flag: string;
  greeting: string;
}[] = [
  { code: 'en', label: 'English',   native: 'English',   flag: '🇮🇳', greeting: 'Welcome to AgriConnect' },
  { code: 'mr', label: 'Marathi',   native: 'मराठी',     flag: '🌻',  greeting: 'AgriConnect मध्ये आपले स्वागत आहे' },
  { code: 'te', label: 'Telugu',    native: 'తెలుగు',    flag: '🌾',  greeting: 'AgriConnect కు స్వాగతం' },
  { code: 'hi', label: 'Hindi',     native: 'हिन्दी',    flag: '🇮🇳', greeting: 'AgriConnect में आपका स्वागत है' },
  { code: 'kn', label: 'Kannada',   native: 'ಕನ್ನಡ',     flag: '🌿',  greeting: 'AgriConnect ಗೆ ಸ್ವಾಗತ' },
  { code: 'ta', label: 'Tamil',     native: 'தமிழ்',     flag: '🌱',  greeting: 'AgriConnect-க்கு நல்வரவு' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം',    flag: '🌴',  greeting: 'AgriConnect-ലേക്ക് സ്വാగతం' },
];

export function getTranslation(lang: Language): Translations {
  return TRANSLATIONS[lang] || EN_TRANSLATIONS;
}
