import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { te } from './te';
import { ta } from './ta';
import { kn } from './kn';
import { ml } from './ml';
import { TranslationDict } from './types';

export { en, hi, mr, te, ta, kn, ml };
export * from './types';

export const ALL_TRANSLATIONS: Record<string, TranslationDict> = {
  en,
  hi,
  mr,
  te,
  ta,
  kn,
  ml,
};

export function getLocalizedText(
  key: string,
  lang: string = 'en',
  fallback?: string
): string {
  const dict = ALL_TRANSLATIONS[lang] || ALL_TRANSLATIONS.en;
  if (dict && dict[key]) {
    return dict[key];
  }
  if (ALL_TRANSLATIONS.en && ALL_TRANSLATIONS.en[key]) {
    return ALL_TRANSLATIONS.en[key];
  }
  return fallback ?? key;
}
