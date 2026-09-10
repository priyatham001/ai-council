import { Language } from '../types/krishi';

/**
 * Multi-lingual localization dictionaries for Indian Crops, Varieties,
 * Quality Grades, and Procurement Statuses across all 7 supported languages:
 * en (English), hi (Hindi), mr (Marathi), te (Telugu), ta (Tamil), kn (Kannada), ml (Malayalam).
 */

export interface CropTranslation {
  en: string;
  hi: string;
  mr: string;
  te: string;
  ta: string;
  kn: string;
  ml: string;
}

export const CROP_TRANSLATIONS: Record<string, CropTranslation> = {
  paddy: {
    en: 'Paddy (Rice)',
    hi: 'धान (चावल)',
    mr: 'भात / तांदूळ',
    te: 'వరి (ధాన్యం / బియ్యం)',
    ta: 'நெல் (அரிசி)',
    kn: 'ಭತ್ತ (ಅಕ್ಕಿ)',
    ml: 'നെല്ല് (അരി)',
  },
  rice: {
    en: 'Paddy (Rice)',
    hi: 'धान (चावल)',
    mr: 'भात / तांदूळ',
    te: 'వరి (ధాన్యం / బియ్యం)',
    ta: 'நெல் (அரிசி)',
    kn: 'ಭತ್ತ (ಅಕ್ಕಿ)',
    ml: 'നെല്ല് (അരി)',
  },
  wheat: {
    en: 'Wheat',
    hi: 'गेहूं',
    mr: 'गहू',
    te: 'గోధుమలు',
    ta: 'கோதுமை',
    kn: 'ಗೋಧಿ',
    ml: 'ഗോതമ്പ്',
  },
  onion: {
    en: 'Onion',
    hi: 'प्याज',
    mr: 'कांदा',
    te: 'ఉల్లిపాయ',
    ta: 'வெங்காயம்',
    kn: 'ಈರುಳ್ಳಿ',
    ml: 'സവാള (ഉള്ളി)',
  },
  tomato: {
    en: 'Tomato',
    hi: 'टमाटर',
    mr: 'टोमॅटो',
    te: 'టమోటా',
    ta: 'தக்காளி',
    kn: 'ಟೊಮೆಟೊ',
    ml: 'തക്കാളി',
  },
  chilli: {
    en: 'Chilli',
    hi: 'हरी/लाल मिर्च',
    mr: 'मिरची',
    te: 'మిర్చి (మిరపకాయ)',
    ta: 'மிளகாய்',
    kn: 'ಮೆಣಸಿನಕಾಯಿ',
    ml: 'മുളക്',
  },
  cotton: {
    en: 'Cotton',
    hi: 'कपास / रुई',
    mr: 'कापूस',
    te: 'పత్తి',
    ta: 'பருத்தி',
    kn: 'ಹತ್ತಿ',
    ml: 'പരുത്തി',
  },
  soybean: {
    en: 'Soybean',
    hi: 'सोयाबीन',
    mr: 'सोयाबीन',
    te: 'సోయాబీన్',
    ta: 'சோயாபீன்',
    kn: 'ಸೋಯಾಬೀನ್',
    ml: 'സോയാബീൻ',
  },
  maize: {
    en: 'Maize (Corn)',
    hi: 'मक्का',
    mr: 'मका',
    te: 'మొక్కజొన్న',
    ta: 'மக்காச்சோளம்',
    kn: 'ಮೆಕ್ಕೆಜೋಳ',
    ml: 'മക്കച്ചോളം',
  },
  corn: {
    en: 'Maize (Corn)',
    hi: 'मक्का',
    mr: 'मका',
    te: 'మొక్కజొన్న',
    ta: 'மக்காச்சோளம்',
    kn: 'ಮೆಕ್ಕೆಜೋಳ',
    ml: 'മക്കച്ചോളം',
  },
  potato: {
    en: 'Potato',
    hi: 'आलू',
    mr: 'बटाटा',
    te: 'బంగాళాదుంప (ఆలూ)',
    ta: 'உருளைக்கிழங்கு',
    kn: 'ಆಲೂಗಡ್ಡೆ',
    ml: 'ഉരുളക്കിഴങ്ങ്',
  },
  turmeric: {
    en: 'Turmeric',
    hi: 'हल्दी',
    mr: 'हळद',
    te: 'పసుపు',
    ta: 'மஞ்சள்',
    kn: 'ಅರಿಶಿನ',
    ml: 'മഞ്ഞൾ',
  },
  gram: {
    en: 'Bengal Gram (Chana)',
    hi: 'चना',
    mr: 'हरभरा (चना)',
    te: 'శనగలు',
    ta: 'கொண்டைக்கடலை',
    kn: 'ಕಡಲೆ',
    ml: 'കടല',
  },
  chana: {
    en: 'Bengal Gram (Chana)',
    hi: 'चना',
    mr: 'हरभरा (चना)',
    te: 'శనగలు',
    ta: 'கொண்டைக்கடலை',
    kn: 'ಕಡಲೆ',
    ml: 'കടല',
  },
  grapes: {
    en: 'Grapes',
    hi: 'अंगूर',
    mr: 'द्राक्षे',
    te: 'ద్రాక్ష',
    ta: 'திராட்சை',
    kn: 'ದ್ರಾಕ್ಷಿ',
    ml: 'മുന്തിരി',
  },
  banana: {
    en: 'Banana',
    hi: 'केला',
    mr: 'केळी',
    te: 'అరటిపండు',
    ta: 'வாழைப்பழம்',
    kn: 'ಬಾಳೆಹಣ್ಣು',
    ml: 'വാഴപ്പഴം',
  },
  groundnut: {
    en: 'Groundnut (Peanut)',
    hi: 'मूंगफली',
    mr: 'भुईमूग',
    te: 'వేరుశనగ',
    ta: 'வேர்க்கடலை',
    kn: 'ಕಡಲೆಕಾಯಿ',
    ml: 'നിലക്കടല',
  },
  mustard: {
    en: 'Mustard',
    hi: 'सरसों',
    mr: 'मोहरी',
    te: 'ఆవాలు',
    ta: 'கடுகு',
    kn: 'ಸಾಸಿವೆ',
    ml: 'കടുക്',
  },
};

/**
 * Localizes a crop name or string (e.g. "Paddy (Basmati / Sona Masuri)")
 * into the target language.
 */
export function localizeCropName(cropText: string | undefined | null, lang: Language = 'en'): string {
  if (!cropText) return '';
  if (lang === 'en') return cropText;

  const lower = cropText.toLowerCase();

  for (const [key, trans] of Object.entries(CROP_TRANSLATIONS)) {
    if (lower.includes(key)) {
      const translatedBase = trans[lang] || trans.en;
      // Preserve variety in brackets if present (e.g., "(Basmati / Sona Masuri)")
      const match = cropText.match(/\((.*?)\)/);
      if (match && match[1] && !match[1].toLowerCase().includes('rice') && !match[1].toLowerCase().includes('dhan')) {
        return `${translatedBase} (${match[1]})`;
      }
      return translatedBase;
    }
  }

  return cropText;
}

/**
 * Localizes Quality Grades (e.g., "Grade A (Premium)", "Grade B", etc.)
 */
export function localizeGrade(grade: string | undefined | null, lang: Language = 'en'): string {
  if (!grade) return '';
  if (lang === 'en') return grade;

  const gUpper = grade.toUpperCase();
  const letter = gUpper.includes('GRADE A') || gUpper === 'A'
    ? 'A'
    : gUpper.includes('GRADE B') || gUpper === 'B'
    ? 'B'
    : gUpper.includes('GRADE C') || gUpper === 'C'
    ? 'C'
    : '';

  if (!letter) return grade;

  const gradeNames: Record<string, Record<Language, string>> = {
    A: {
      en: 'Grade A (Premium)',
      hi: 'ग्रेड A (प्रीमियम)',
      mr: 'ग्रेड A (उत्कृष्ट)',
      te: 'గ్రేడ్ A (ప్రీమియం)',
      ta: 'கிரேடு A (உயர்தரம்)',
      kn: 'ಗ್ರೇಡ್ A (ಪ್ರೀಮಿಯಂ)',
      ml: 'ഗ്രേഡ് A (പ്രീമിയം)',
    },
    B: {
      en: 'Grade B (Standard)',
      hi: 'ग्रेड B (मानक)',
      mr: 'ग्रेड B (मध्यम)',
      te: 'గ్రేడ్ B (స్టాండర్డ్)',
      ta: 'கிரேடு B (நிலையானது)',
      kn: 'ಗ್ರೇಡ್ B (ಸಾಮಾನ್ಯ)',
      ml: 'ഗ്രേഡ് B (സ്റ്റാൻഡേർഡ്)',
    },
    C: {
      en: 'Grade C (Lower)',
      hi: 'ग्रेड C (साधारण)',
      mr: 'ग्रेड C (साधारण)',
      te: 'గ్రేడ్ C (సాధారణ)',
      ta: 'கிரேடு C (குறைந்த தரம்)',
      kn: 'ಗ್ರೇಡ್ C (ಕೆಳಮಟ್ಟ)',
      ml: 'ഗ്രേഡ് C (താഴ്ന്ന)',
    },
  };

  return gradeNames[letter]?.[lang] || grade;
}

/**
 * Localizes Procurement Statuses (e.g. "Open", "Fulfilling", "Closed")
 */
export function localizeStatus(status: string | undefined | null, lang: Language = 'en'): string {
  if (!status) return '';
  if (lang === 'en') return status;

  const s = status.toLowerCase();
  if (s.includes('open')) {
    const map: Record<Language, string> = {
      en: 'Open',
      hi: 'खुला (सक्रिय)',
      mr: 'सक्रिय',
      te: 'ఓపెన్ (యాక్టివ్)',
      ta: 'திறந்திருக்கும்',
      kn: 'ತೆರೆದಿದೆ',
      ml: 'തുറന്നിരിക്കുന്നു',
    };
    return map[lang] || status;
  }

  if (s.includes('fulfill')) {
    const map: Record<Language, string> = {
      en: 'Fulfilling',
      hi: 'प्रक्रियाधीन',
      mr: 'प्रक्रियेत',
      te: 'సేకరణలో ఉంది',
      ta: 'செயலில் உள்ளது',
      kn: 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ',
      ml: 'പൂർത്തിയാക്കുന്നു',
    };
    return map[lang] || status;
  }

  if (s.includes('close')) {
    const map: Record<Language, string> = {
      en: 'Closed',
      hi: 'बंद',
      mr: 'बंद',
      te: 'ముగిసింది',
      ta: 'முடிந்தது',
      kn: 'ಮುಕ್ತಾಯಗೊಂಡಿದೆ',
      ml: 'അടച്ചു',
    };
    return map[lang] || status;
  }

  return status;
}

/**
 * Localizes Buyer Types (e.g. "Food Processing", "Exporter", "Retail Chain")
 */
export function localizeBuyerType(type: string | undefined | null, lang: Language = 'en'): string {
  if (!type) return '';
  if (lang === 'en') return type;

  const t = type.toLowerCase();
  if (t.includes('processing')) {
    const map: Record<Language, string> = {
      en: 'Food Processing',
      hi: 'खाद्य प्रसंस्करण उद्योग',
      mr: 'अन्न प्रक्रिया उद्योग',
      te: 'ఫుడ్ ప్రాసెసింగ్ కంపెనీ',
      ta: 'உணவு பதப்படுத்துதல்',
      kn: 'ಆಹಾರ ಸಂಸ್ಕರಣೆ',
      ml: 'ഭക്ഷണ സംസ്കരണം',
    };
    return map[lang] || type;
  }

  if (t.includes('export')) {
    const map: Record<Language, string> = {
      en: 'Exporter',
      hi: 'निर्यातक',
      mr: 'निर्यातदार',
      te: 'ఎగుమతిదారు',
      ta: 'ஏற்றுமதியாளர்',
      kn: 'ರಫ್ತುದಾರ',
      ml: 'കയറ്റുമതിക്കാരൻ',
    };
    return map[lang] || type;
  }

  if (t.includes('retail')) {
    const map: Record<Language, string> = {
      en: 'Retail Chain',
      hi: 'खुदरा सुपरमार्केट श्रृंखला',
      mr: 'किरकोळ विक्री साखळी',
      te: 'రిటైల్ సూపర్ మార్కెట్',
      ta: 'சில்லறை விற்பனை',
      kn: 'ಚಿಲ್ಲರೆ ಮಾರಾಟ',
      ml: 'റീട്ടെയിൽ ശൃംഖല',
    };
    return map[lang] || type;
  }

  if (t.includes('wholesale') || t.includes('trader')) {
    const map: Record<Language, string> = {
      en: 'Wholesale Trader',
      hi: 'थोक व्यापारी',
      mr: 'घाऊक व्यापारी',
      te: 'టోకు వ్యాపారి',
      ta: 'மொத்த வியாபாரி',
      kn: 'ಸಗಟು ವ್ಯಾಪಾರಿ',
      ml: 'മൊത്തക്കച്ചവടക്കാരൻ',
    };
    return map[lang] || type;
  }

  return type;
}

/**
 * Localizes State Names into Indian scripts
 */
export function localizeState(state: string | undefined | null, lang: Language = 'en'): string {
  if (!state) return '';
  if (lang === 'en') return state;

  const stateMap: Record<string, Record<Language, string>> = {
    'Andhra Pradesh': {
      en: 'Andhra Pradesh',
      hi: 'आंध्र प्रदेश',
      mr: 'आंध्र प्रदेश',
      te: 'ఆంధ్రప్రదేశ్',
      ta: 'ஆந்திர பிரதேசம்',
      kn: 'ಆಂಧ್ರಪ್ರದೇಶ',
      ml: 'ആന്ധ്രാപ്രദേശ്',
    },
    'Telangana': {
      en: 'Telangana',
      hi: 'तेलंगाना',
      mr: 'तेलंगणा',
      te: 'తెలంగాణ',
      ta: 'தெலுங்கானா',
      kn: 'ತೆಲಂಗಾಣ',
      ml: 'തെലങ്കാന',
    },
    'Maharashtra': {
      en: 'Maharashtra',
      hi: 'महाराष्ट्र',
      mr: 'महाराष्ट्र',
      te: 'మహారాష్ట్ర',
      ta: 'மகாராஷ்டிரா',
      kn: 'ಮಹಾರಾಷ್ಟ್ರ',
      ml: 'മഹാരാഷ്ട്ര',
    },
    'Punjab': {
      en: 'Punjab',
      hi: 'पंजाब',
      mr: 'पंजाब',
      te: 'పంజాబ్',
      ta: 'பஞ்சாப்',
      kn: 'ಪಂಜಾಬ್',
      ml: 'പഞ്ചാബ്',
    },
    'Karnataka': {
      en: 'Karnataka',
      hi: 'कर्नाटक',
      mr: 'कर्नाटक',
      te: 'కర్ణాటక',
      ta: 'கர்நாடகா',
      kn: 'ಕರ್ನಾಟಕ',
      ml: 'കർണാടക',
    },
    'Madhya Pradesh': {
      en: 'Madhya Pradesh',
      hi: 'मध्य प्रदेश',
      mr: 'मध्य प्रदेश',
      te: 'మధ్యప్రదేశ్',
      ta: 'மத்திய பிரதேசம்',
      kn: 'ಮಧ್ಯಪ್ರದೇಶ',
      ml: 'മധ്യപ്രദേശ്',
    },
    'Gujarat': {
      en: 'Gujarat',
      hi: 'गुजरात',
      mr: 'गुजरात',
      te: 'గుజరాత్',
      ta: 'குஜராத்',
      kn: 'ಗುಜರಾತ್',
      ml: 'ഗുജറാത്ത്',
    },
  };

  for (const [sName, map] of Object.entries(stateMap)) {
    if (state.toLowerCase().includes(sName.toLowerCase())) {
      return map[lang] || state;
    }
  }

  return state;
}

/**
 * Localizes units (q, quintals, MT, kg)
 */
export function localizeUnit(unit: string, lang: Language = 'en'): string {
  if (lang === 'en') return unit;

  const u = unit.toLowerCase().trim();
  if (u === 'q' || u === 'quintal' || u === 'quintals') {
    const map: Record<Language, string> = {
      en: 'q',
      hi: 'क्विंटल',
      mr: 'क्विंटल',
      te: 'క్వింటాల్',
      ta: 'குவிண்டால்',
      kn: 'ಕ್ವಿಂಟಾಲ್',
      ml: 'ക്വിന്റൽ',
    };
    return map[lang] || unit;
  }

  if (u.includes('mt') || u.includes('tonne')) {
    const map: Record<Language, string> = {
      en: 'MT',
      hi: 'टन (MT)',
      mr: 'टन (MT)',
      te: 'టన్నులు (MT)',
      ta: 'டன் (MT)',
      kn: 'ಟನ್ (MT)',
      ml: 'ടൺ (MT)',
    };
    return map[lang] || unit;
  }

  return unit;
}
