import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Hand,
  Check,
  Minimize2,
  Maximize2,
  ThumbsUp,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarmerGuide, GuideStepId } from '../../context/FarmerGuideContext';

interface LocalizedGuide {
  main: string;
  inactive: string;
  hint?: string;
  audioText?: string;
}

export const FarmerGuidePopup: React.FC = () => {
  const { language } = useLanguage();
  const {
    guideStepId,
    setGuideStepId,
    targetSelector,
    isGuideVisible,
    setIsGuideVisible,
    dismissGuide,
  } = useFarmerGuide();

  const [isDucked, setIsDucked] = useState<boolean>(false);
  const [isInactive, setIsInactive] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showThumbsUp, setShowThumbsUp] = useState<boolean>(false);
  const [highlightCoords, setHighlightCoords] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const inactivityTimerRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Inactivity detection: after 6.5 seconds on the same step without user interaction, switch to gentle reassuring wait
  useEffect(() => {
    setIsInactive(false);

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setIsInactive(true);
    }, 6500);

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [guideStepId]);

  // Track target element coordinates on screen for pointing arrow & spotlight
  useEffect(() => {
    const updateTargetCoords = () => {
      if (!targetSelector) {
        setHighlightCoords(null);
        return;
      }

      const el = document.querySelector(targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setHighlightCoords({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          });
          return;
        }
      }
      setHighlightCoords(null);
    };

    updateTargetCoords();
    const handleResizeOrScroll = () => updateTargetCoords();
    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll);
    const interval = setInterval(updateTargetCoords, 900);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
      clearInterval(interval);
    };
  }, [targetSelector, guideStepId]);

  // Stop audio on unmount or step change
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [guideStepId]);

  // Comprehensive localized farmer messages for all steps and regional languages
  const getStepGuide = (step: GuideStepId): LocalizedGuide => {
    switch (step) {
      case 'start-language':
        if (language === 'hi') {
          return {
            main: 'राम-राम भैया! अपनी पसंदीदा भाषा चुनें ताकि आगे की सारी जानकारी आपको समझ आए।',
            inactive: 'कोई जल्दबाजी नहीं, आराम से समय लीजिए। मैं यहीं खड़ा हूँ!',
            hint: 'नीचे दिए गए भाषा कार्ड पर क्लिक करें।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'राम-राम भाऊ! ॲग्रीकनेक्टमध्ये स्वागत आहे. कृपया आपली सोयीची भाषा निवडा.',
            inactive: 'काही हरकत नाही भाऊ, सावकाश वेळ घ्या. मी इथेच उभा आहे!',
            hint: 'खालील भाषा पर्यायांवर टॅप करा.',
          };
        }
        if (language === 'te') {
          return {
            main: 'నమస్కారం అండి! అగ్రికనెక్ట్‌కు స్వాగతం. దయచేసి మీ భాషను ఎంచుకోండి.',
            inactive: 'ఏం పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను!',
            hint: 'క్రింది భాష కార్డులలో ఒకదాన్ని ఎంచుకోండి.',
          };
        }
        if (language === 'ta') {
          return {
            main: 'வணக்கம்! அக்ரிகனெக்டிற்கு வரவேற்கிறோம். தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்.',
            inactive: 'பரவாயில்லை, பொறுமையாகத் தொடரவும். நான் இங்கே காத்திருக்கிறேன்!',
            hint: 'கீழே உள்ள மொழிகளில் ஒன்றைத் தட்டவும்.',
          };
        }
        if (language === 'kn') {
          return {
            main: 'ನಮಸ್ಕಾರ! ಅಗ್ರಿಕನೆಕ್ಟ್‌ಗೆ ಸ್ವಾಗತ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
            inactive: 'ಪರವಾಗಿಲ್ಲ, ಸಮಾಧಾನವಾಗಿ ಸಮಯ ತಗೊಳ್ಳಿ. ನಾನು ಇಲ್ಲೇ ಇದ್ದೇನೆ!',
            hint: 'ಕೆಳಗಿನ ಭಾಷೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ.',
          };
        }
        if (language === 'ml') {
          return {
            main: 'നമസ്കാരം! അഗ്രികണക്റ്റിലേക്ക് സ്വാഗതം. ദയവായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക.',
            inactive: 'ഒരു പ്രശ്നവുമില്ല, സാവധാനം ചെയ്യൂ. ഞാൻ ഇവിടെത്തന്നെയുണ്ട്!',
            hint: 'താഴെയുള്ള ഭാഷ കാർഡിൽ ക്ലിക്ക് ചെയ്യുക.',
          };
        }
        return {
          main: "Namaste brother! Welcome to AgriConnect. Choose your preferred language to begin.",
          inactive: "No hurry, take your time! I'm waiting right here beside you.",
          hint: 'Select English, Hindi, Telugu, or Marathi below.',
        };

      case 'start-location':
        if (language === 'hi') {
          return {
            main: 'अब अपना गाँव या जिला चुनें, ताकि हम आपके सबसे पास की मंडियाँ और खरीदार दिखा सकें!',
            inactive: 'आराम से देखिए। जीपीएस या खोज बटन पर क्लिक करके आगे बढ़ें।',
            hint: 'जीपीएस पहचानें या अपने जिले का नाम खोजें।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'आपले गाव किंवा जिल्हा निश्चित करा, जेणेकरून जवळच्या मंड्या व भाव मिळतील!',
            inactive: 'सावकाश तपासा. तयार असाल तेव्हा पुढे जा वर क्लिक करा.',
            hint: 'जीपीएस किंवा शोध बॉक्स वापरा.',
          };
        }
        if (language === 'te') {
          return {
            main: 'మీ సమీప మార్కెట్లు మరియు ఉత్తమ ధరలను కనుగొనడానికి మీ లొకేషన్ నిర్ధారించండి!',
            inactive: 'నిదానంగా చూసుకోండి. సిద్ధంగా ఉన్నప్పుడు తదుపరి క్లిక్ చేయండి.',
            hint: 'జీపీఎస్ లేదా సెర్చ్ ఆప్షన్ ఉపయోగించండి.',
          };
        }
        return {
          main: "Confirm your farm location so we can connect you with the closest mandis and direct buyers!",
          inactive: "Take your time! Click GPS auto-detect or search your district whenever ready.",
          hint: 'Click GPS Detect or search your village.',
        };

      case 'start-role':
        if (language === 'hi') {
          return {
            main: 'आप फसल बेचना चाहते हैं (किसान) या थोक में खरीदना चाहते हैं (व्यापारी)? चुनें!',
            inactive: 'आराम से चुनिए, दोनों के लिए अलग-अलग सीधी सुविधाएँ हैं।',
            hint: 'किसान या व्यापारी कार्ड पर टैप करें।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'तुम्ही शेतकरी आहात की व्यापारी? आपली भूमिका निवडा.',
            inactive: 'सावकाश विचार करा. मी इथेच आहे.',
            hint: 'शेतकरी किंवा खरेदीदार निवडा.',
          };
        }
        if (language === 'te') {
          return {
            main: 'మీరు రైతుగా పంట విక్రయించాలనుకుంటున్నారా లేదా కొనుగోలుదారునా? ఎంచుకోండి.',
            inactive: 'నిదానంగా ఎంచుకోండి. నేను వేచి చూస్తున్నాను.',
            hint: 'రైతు లేదా కొనుగోలుదారు కార్డ్ తాకండి.',
          };
        }
        return {
          main: "Choose your role: Are you selling harvest as a Farmer, or procuring in bulk as a Buyer?",
          inactive: "Take your time to pick the right workspace for you.",
          hint: 'Select Farmer or Buyer / Trader.',
        };

      case 'farmer-crop':
        if (language === 'hi') {
          return {
            main: 'अपनी फसल यहाँ चुनें — जैसे धान, प्याज़, गेहूँ, कपास या मक्का।',
            inactive: 'फसल की सूची में अपनी फसल पर क्लिक करें भैया!',
          };
        }
        if (language === 'mr') {
          return {
            main: 'कृपया आपली पीक निवडा — जसे भात, कांदा, सोयाबीन, गहू.',
            inactive: 'सावकाश वेळ घ्या, मी इथेच वाट पाहतोय.',
          };
        }
        if (language === 'te') {
          return {
            main: 'మీ పంటను ఇక్కడ ఎంచుకోండి — వరి, ఉల్లి, పత్తి లేదా మొక్కజొన్న.',
            inactive: 'నిదానంగా చేయండి, నేను ఇక్కడే ఉంటాను.',
          };
        }
        return {
          main: "Select the crop you want to sell today — like Paddy, Onion, Cotton, or Maize.",
          inactive: "No hurry, browse through your crop options right here.",
        };

      case 'farmer-details':
        if (language === 'hi') {
          return {
            main: 'आपके पास कितना क्विंटल माल है और क्या भाव चाहते हैं, यहाँ दर्ज करें।',
            inactive: 'अंदाज़न मात्रा और भाव भरिए, फिर आगे बढ़िए।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'आपल्याकडे किती क्विंटल माल आहे आणि अपेक्षित भाव येथे भरा.',
            inactive: 'काही हरकत नाही, आरामात वजन आणि किंमत भरा.',
          };
        }
        if (language === 'te') {
          return {
            main: 'మీ వద్ద ఎన్ని క్వింటాళ్ల పంట ఉంది మరియు ఆశించే ధరను ఇక్కడ నమోదు చేయండి.',
            inactive: 'పర్వాలేదు, నిదానంగా వివరాలు నమోదు చేయండి.',
          };
        }
        return {
          main: "Enter how much harvest you want to sell (in quintals) and your expected mandi rate.",
          inactive: "Take your time to enter the estimated quantity and price.",
        };

      case 'farmer-photos':
        if (language === 'hi') {
          return {
            main: 'फसल की साफ़ फोटो अपलोड करें। हमारा एआई तुरंत ग्रेडिंग और चमक की रिपोर्ट देगा!',
            inactive: 'अच्छी फोटो से व्यापारियों का भरोसा बढ़ता है और बेहतर भाव मिलता है।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'पिकाचा स्पष्ट फोटो अपलोड करा. एआय लगेच गुणवत्ता ग्रेड निश्चित करेल!',
            inactive: 'चांगल्या फोटोमुळे खरेदीदारांचा विश्वास वाढतो.',
          };
        }
        if (language === 'te') {
          return {
            main: 'మీ పంట ఫోటోను అప్‌లోడ్ చేయండి. మా ఏఐ వెంటనే నాణ్యత గ్రేడ్‌ను లెక్కిస్తుంది!',
            inactive: 'మంచి ఫోటో ఉంటే వ్యాపారులు ఎక్కువ ధర చెల్లిస్తారు.',
          };
        }
        return {
          main: "Upload a clean photo of your produce. Our AI will analyze color, size, and quality grade!",
          inactive: "A clear photo builds instant buyer trust and fetches higher bids.",
        };

      case 'farmer-quality':
        if (language === 'hi') {
          return {
            main: 'अपनी फसल का एआई ग्रेड और एग्मार्क रिपोर्ट देखिए। सब सही लगे तो पुष्टि करें!',
            inactive: 'ग्रेड A/B देखकर आगे बढ़ें भैया।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'आपल्या पिकाचा गुणवत्ता रिपोर्ट तपासा आणि पुष्टी करा.',
            inactive: 'ग्रेड पाहून पुढील पायरीवर जा.',
          };
        }
        if (language === 'te') {
          return {
            main: 'మీ పంట నాణ్యత గ్రేడ్ మరియు నివేదికను పరిశీలించి నిర్ధారించండి.',
            inactive: 'గ్రేడ్ వివరాలు సరిచూసుకుని ముందుకు సాగండి.',
          };
        }
        return {
          main: "Review your verified produce quality grade (Grade A/B/C) and visual purity score.",
          inactive: "Check the AI analysis summary and confirm when ready.",
        };

      case 'farmer-markets':
        if (language === 'hi') {
          return {
            main: 'यहाँ पास की मंडियों के ताज़ा भाव और गाड़ी भाड़ा देखकर सबसे फ़ायदेमंद मंडी चुनें!',
            inactive: 'दूरी और कुल मुनाफ़ा देख लीजिए, फिर क्लिक कीजिए।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'जवळच्या मंड्यांचे भाव आणि वाहतूक खर्च तपासून जास्त नफ्याची बाजारपेठ निवडा!',
            inactive: 'नफा आणि अंतर तपासा, मी इथेच आहे.',
          };
        }
        if (language === 'te') {
          return {
            main: 'సమీప మార్కెట్లలో ధర మరియు రవాణా ఖర్చు సరిపోల్చి ఎక్కువ లాభం ఇచ్చే మండిని ఎంచుకోండి!',
            inactive: 'లాభం మరియు దూరం చూసి ఉత్తమ మార్కెట్‌ను ఎంపిక చేసుకోండి.',
          };
        }
        return {
          main: "Compare nearby mandis! Check real-time modal prices minus transport cost to maximize profit.",
          inactive: "Compare net returns across mandis and select your preferred destination.",
        };

      case 'farmer-publish':
        if (language === 'hi') {
          return {
            main: 'बहुत बढ़िया! अपनी फसल का डिजिटल पासपोर्ट पूरे देश के सत्यापित खरीदारों के लिए लाइव करें!',
            inactive: 'यहाँ क्लिक करते ही व्यापारियों को सूचना चली जाएगी।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'उत्तम! आपला लॉट बाजारात प्रकाशित करा आणि खरेदीदारांकडून थेट ऑर्डर्स मिळवा!',
            inactive: 'प्रकाशित करा वर क्लिक करा भाऊ.',
          };
        }
        if (language === 'te') {
          return {
            main: 'అద్భుతం! మీ పంటను నేరుగా మార్కెట్‌లో ప్రచురించి ధృవీకరించిన కొనుగోలుదారులను పొందండి!',
            inactive: 'ప్రచురించడానికి ఇక్కడ క్లిక్ చేయండి.',
          };
        }
        return {
          main: "Everything looks pristine! Click here to publish your digital lot to verified buyers nationwide.",
          inactive: "Hit Publish to broadcast your produce passport to active merchants.",
        };

      case 'buyer-browse':
        if (language === 'hi') {
          return {
            main: 'यहाँ किसानों के ताज़ा लॉट उपलब्ध हैं। किसी भी लॉट पर क्लिक करके पूरी गुणवत्ता रिपोर्ट देखें!',
            inactive: 'फसल के कार्ड पर क्लिक करके किसान से सीधे बात करें।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'शेतकऱ्यांचे लॉट्स येथे उपलब्ध आहेत. गुणवत्ता रिपोर्ट पाहण्यासाठी लॉटवर क्लिक करा!',
            inactive: 'सावकाश तपासा, मी इथेच थांबतो.',
          };
        }
        if (language === 'te') {
          return {
            main: 'ఇక్కడ రైతుల పంట లాట్‌లు ఉన్నాయి. పూర్తి వివరాలు మరియు ఏఐ గ్రేడ్ చూడటానికి క్లిక్ చేయండి!',
            inactive: 'లాట్ వివరాలు చూసి నేరుగా ఆర్డర్ చేయండి.',
          };
        }
        return {
          main: "Browse farmgate produce with AI quality passports. Click any lot to inspect metrics and contact the farmer.",
          inactive: "Select any crop lot card to view volume, location, and verified Agmark grades.",
        };

      case 'buyer-bid':
        if (language === 'hi') {
          return {
            main: 'माल पसंद आया? अपनी खरीद मात्रा और बोली लगाकर किसान को तुरंत ऑर्डर भेजें!',
            inactive: 'किसान का फ़ोन नंबर भी उपलब्ध है, आप सीधे बात भी कर सकते हैं।',
          };
        }
        if (language === 'mr') {
          return {
            main: 'माल आवडला का? थेट खरेदीसाठी इच्छुकता नोंदवा किंवा कॉल करा!',
            inactive: 'शेतकऱ्याला थेट संदेश किंवा मागणी पाठवा.',
          };
        }
        if (language === 'te') {
          return {
            main: 'పంట నచ్చిందా? మీ కొనుగోలు పరిమాణాన్ని నమోదు చేసి నేరుగా ఆర్డర్ ఆసక్తిని పంపండి!',
            inactive: 'రైతుకు కాల్ లేదా వాట్సాప్ ద్వారా కూడా మాట్లాడవచ్చు.',
          };
        }
        return {
          main: "Interested in this lot? Submit your quantity demand or call the farmer directly on mobile!",
          inactive: "Enter your quintal requirement and submit instant purchase interest.",
        };

      default:
        if (language === 'hi') {
          return {
            main: 'राम-राम भैया! मैं आपका किसान मित्र हूँ। जहाँ भी मदद चाहिए, मुझे बताइए।',
            inactive: 'मैं आपके साथ यहीं हूँ, आराम से काम कीजिए!',
          };
        }
        if (language === 'mr') {
          return {
            main: 'राम-राम भाऊ! मी आपला किसान मित्र आहे. काही मदत लागल्यास मी इथेच आहे.',
            inactive: 'सावकाश वेळ घ्या, मी इथेच उभा आहे!',
          };
        }
        if (language === 'te') {
          return {
            main: 'నమస్కారం! నేను మీ రైతు మిత్రుడిని. మీకు ఎక్కడ సహాయం కావాలన్నా నేను ఇక్కడే ఉంటాను.',
            inactive: 'నిదానంగా పని చేసుకోండి, నేను సహాయం చేయడానికి సిద్ధంగా ఉన్నాను!',
          };
        }
        return {
          main: "Namaste brother! I'm your Kisan guide. Whenever you need guidance, I am right here by your side.",
          inactive: "Take your time! Whenever you need guidance, tap my corner tab.",
        };
    }
  };

  const currentGuide = useMemo(() => getStepGuide(guideStepId), [guideStepId, language]);

  // Read-aloud TTS Voice Function
  const handleToggleVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = isInactive ? currentGuide.inactive : currentGuide.main;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Map platform language to speech voice locale
    const langMap: Record<string, string> = {
      hi: 'hi-IN',
      mr: 'mr-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      bn: 'bn-IN',
      en: 'en-IN',
    };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.95; // Friendly, natural conversational pacing for farmers

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Farmer positive encouragement reaction
  const handleAcknowledge = () => {
    setShowThumbsUp(true);
    setTimeout(() => {
      setShowThumbsUp(false);
      setIsDucked(true);
    }, 1200);
  };

  if (!isGuideVisible) return null;

  return (
    <>
      {/* 1. Subtle, Non-Intrusive Target Element Spotlight Ring (Never blocks pointer events) */}
      {highlightCoords && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed z-30 transition-all duration-300 rounded-2xl ring-2 ring-emerald-400 ring-offset-2 ring-offset-stone-900/60 shadow-[0_0_28px_rgba(52,211,153,0.45)]"
          style={{
            top: highlightCoords.top - window.scrollY - 5,
            left: highlightCoords.left - window.scrollX - 5,
            width: highlightCoords.width + 10,
            height: highlightCoords.height + 10,
          }}
        >
          {/* Pulsing focal corner dot */}
          <span className="absolute -top-1.5 -left-1.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white" />
          </span>
        </motion.div>
      )}

      {/* 2. PEEKING FARMER EXPERIENCE (Corner Leaning & Animated Speech Balloon) */}
      <div
        id="kisan-peeking-guide-container"
        className="fixed bottom-0 right-0 sm:right-4 z-50 pointer-events-none select-none flex flex-col items-end justify-end max-w-[calc(100vw-1rem)] sm:max-w-md pb-2 pr-2 sm:pr-0"
      >
        <AnimatePresence mode="wait">
          {isDucked ? (
            /* DUCKED STATE: Discrete, Charming Peeking Tab at the Screen Corner */
            <motion.button
              key="ducked-tab"
              initial={{ y: 60, opacity: 0, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.85 }}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setIsDucked(false);
                setIsInactive(false);
              }}
              className="pointer-events-auto cursor-pointer bg-stone-900/95 text-white border-2 border-emerald-500/70 rounded-full py-2 px-3.5 shadow-2xl flex items-center gap-2.5 backdrop-blur-md group hover:border-emerald-400 transition-all ring-2 ring-emerald-500/20"
              title="Click to summon Kisan Guide"
            >
              <div className="relative">
                <img
                  src="/farmer-guide.jpg"
                  alt="Kisan Mitra Avatar"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-emerald-400 shadow-xs"
                />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              </div>
              <div className="text-left pr-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-emerald-300 font-outfit tracking-tight">
                    Kisan Mitra
                  </span>
                  <span className="text-[11px] animate-bounce">👋</span>
                </div>
                <span className="block text-[10px] text-stone-300 font-medium">
                  {language === 'hi'
                    ? 'मदद चाहिए? टैप करें'
                    : language === 'mr'
                    ? 'मदत हवी आहे? टॅप करा'
                    : language === 'te'
                    ? 'సహాయం కావాలా? తాకండి'
                    : 'Need guidance? Peek in'}
                </span>
              </div>
            </motion.button>
          ) : (
            /* ACTIVE STATE: Corner Peeking Character + Natural Speech Balloon */
            <div key="peeking-active" className="flex flex-col items-end gap-2 pointer-events-auto">
              {/* Natural Speech Balloon (NOT a chatbot box) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                className="relative bg-stone-900/95 dark:bg-stone-900/95 text-stone-100 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.55)] border border-emerald-500/50 backdrop-blur-md max-w-[320px] sm:max-w-[350px] mr-4 sm:mr-10 mb-1 ring-1 ring-emerald-500/20"
              >
                {/* Speech Balloon Triangle Tail pointing down-right toward Farmer's mouth */}
                <div className="absolute -bottom-2.5 right-10 sm:right-14 w-0 h-0 border-x-8 border-x-transparent border-t-10 border-t-stone-900/95 filter drop-shadow-[0_2px_2px_rgba(16,185,129,0.3)]" />

                {/* Speech Balloon Top Bar */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black text-emerald-300 font-outfit uppercase tracking-wider">
                      Kisan Mitra
                    </span>
                    <span className="text-[10px] text-amber-300/90 font-mono bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                      Live Guide
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Read Aloud TTS Audio Button */}
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-emerald-500 text-stone-950 animate-pulse'
                          : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 hover:text-white'
                      }`}
                      title={isSpeaking ? 'Stop speaking' : 'Read aloud in your language'}
                    >
                      {isSpeaking ? (
                        <div className="flex items-center gap-1 px-1">
                          <VolumeX className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono">Listening</span>
                        </div>
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Duck / Hide Button */}
                    <button
                      type="button"
                      onClick={() => setIsDucked(true)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Duck behind corner"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Dismiss Button */}
                    <button
                      type="button"
                      onClick={dismissGuide}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Dismiss Guide"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Balloon Dialogue Text */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    {/* Interactive pointing finger / thumbs up */}
                    <span className="text-lg shrink-0 mt-0.5">
                      {showThumbsUp ? '👍' : isInactive ? '⏳' : '👉'}
                    </span>
                    <p className="text-xs sm:text-[13px] text-stone-100 font-medium leading-relaxed">
                      {showThumbsUp
                        ? language === 'hi'
                          ? 'शाबाश भैया! बहुत बढ़िया!'
                          : language === 'mr'
                          ? 'छान भाऊ! उत्तम!'
                          : language === 'te'
                          ? 'చాలా బాగుంది అండి!'
                          : 'Wonderful brother! Got it!'
                        : isInactive
                        ? currentGuide.inactive
                        : currentGuide.main}
                    </p>
                  </div>

                  {/* Context Hint */}
                  {currentGuide.hint && !isInactive && !showThumbsUp && (
                    <div className="text-[11px] text-amber-300/90 font-semibold pl-6 flex items-center gap-1">
                      <span>💡</span>
                      <span>{currentGuide.hint}</span>
                    </div>
                  )}

                  {/* Inactivity Reassurance Note */}
                  {isInactive && (
                    <div className="text-[11px] text-emerald-300/90 pl-6 flex items-center gap-1">
                      <span>🌱</span>
                      <span>
                        {language === 'hi'
                          ? 'जब भी आप तैयार हों, स्क्रीन पर आगे बढ़ें।'
                          : language === 'mr'
                          ? 'आपण तयार असाल तेव्हा पुढील कृती करा.'
                          : language === 'te'
                          ? 'మీరు సిద్ధమైనప్పుడు స్క్రీన్‌పై కొనసాగండి.'
                          : "Whenever you're ready, proceed right on the screen."}
                      </span>
                    </div>
                  )}
                </div>

                {/* Balloon Action Footer */}
                <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-stone-400">
                    {language === 'hi'
                      ? 'मैं यहीं इंतज़ार कर रहा हूँ...'
                      : language === 'mr'
                      ? 'मी इथेच वाट पाहतोय...'
                      : language === 'te'
                      ? 'నేను ఇక్కడే వేచి ఉంటాను...'
                      : 'Waiting for your action...'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleAcknowledge}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{language === 'hi' ? 'समझ गया' : language === 'mr' ? 'समजले' : language === 'te' ? 'అర్థమైంది' : 'Got it'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* REALISTIC PEEKING FARMER (Body leaning from the screen edge) */}
              <motion.div
                initial={{ x: 120, y: 70, rotate: 14, opacity: 0 }}
                animate={{
                  x: 0,
                  y: [0, -5, 0],
                  rotate: [-5, -3, -5],
                  opacity: 1,
                }}
                exit={{ x: 120, y: 80, rotate: 14, opacity: 0 }}
                transition={{
                  x: { type: 'spring', damping: 18, stiffness: 140 },
                  opacity: { duration: 0.25 },
                  y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
                  rotate: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
                }}
                className="relative cursor-pointer group select-none pr-1 sm:pr-3"
                onClick={() => setIsDucked(true)}
                title="Click to duck"
              >
                {/* Visual Peeking Character Bust */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-emerald-400/90 shadow-[-8px_8px_30px_rgba(0,0,0,0.6)] ring-4 ring-emerald-500/30 bg-stone-900">
                  <img
                    src="/farmer-guide.jpg"
                    alt="Indian Farmer Peeking In"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Corner Edge Vignette (looks like he is standing outside behind the screen frame) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                </div>

                {/* Animated Pointing Arm / Hand Gesture leaning towards screen center */}
                <motion.div
                  animate={{
                    x: [0, -8, 0],
                    y: [0, -6, 0],
                    rotate: [-10, -18, -10],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-emerald-600 text-white rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shadow-xl border-2 border-white ring-2 ring-emerald-400 font-black text-base sm:text-lg"
                >
                  👉
                </motion.div>

                {/* Name & Status Pill Badge */}
                <div className="absolute -bottom-1 right-2 sm:right-4 bg-stone-950/90 border border-emerald-400/80 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold font-outfit shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Kisan Mitra</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
