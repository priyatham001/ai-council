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

export const SUPPORTED_LANGUAGES: {
  code: Language;
  label: string;
  native: string;
  flag: string;
  greeting: string;
}[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇮🇳', greeting: 'Welcome to Kisan Setu' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🌾', greeting: 'కిసాన్ సేతుకి స్వాగతం' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', greeting: 'किसान सेतु में आपका स्वागत है' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🌱', greeting: 'கிசான் சேதுவிற்கு நல்வரவு' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🌿', greeting: 'ಕಿಸಾನ್ ಸೇತುಗೆ ಸುಸ್ವಾಗತ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🌴', greeting: 'കിസാൻ സേതുവിലേക്ക് സ്വാഗതം' },
];

export function getTranslation(lang: Language): Translations {
  return TRANSLATIONS[lang] || EN_TRANSLATIONS;
}
