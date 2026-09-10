import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ChevronRight,
  Hand,
  Volume2,
  VolumeX,
  Check,
  Minimize2,
  Maximize2,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFarmerGuide, GuideStepId } from '../../context/FarmerGuideContext';

interface GuideMessage {
  main: string;
  inactive: string;
  hint?: string;
  targetId?: string;
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

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isInactive, setIsInactive] = useState<boolean>(false);
  const [highlightCoords, setHighlightCoords] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const inactivityTimerRef = useRef<any>(null);

  // Inactivity detection: after 7 seconds on the same step without user interaction, show gentle wait message
  useEffect(() => {
    setIsInactive(false);

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setIsInactive(true);
    }, 7000);

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [guideStepId]);

  // Track target element coordinates on screen for subtle pointing / glow
  useEffect(() => {
    const updateTargetCoords = () => {
      if (!targetSelector) {
        setHighlightCoords(null);
        return;
      }

      const el = document.querySelector(targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Only if element is visible
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
    const interval = setInterval(updateTargetCoords, 1000);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
      clearInterval(interval);
    };
  }, [targetSelector, guideStepId]);

  // Localized contextual messages matching user specifications
  const getStepMessage = (step: GuideStepId): GuideMessage => {
    switch (step) {
      case 'start-language':
        return {
          main:
            language === 'mr'
              ? 'नमस्ते! ॲग्रीकनेक्टमध्ये आपले स्वागत आहे. चला सुरुवात करूया. कृपया आपली भाषा निवडा.'
              : language === 'te'
              ? 'నమస్కారం! అగ్రికనెక్ట్‌కు స్వాగతం. ప్రారంభిద్దాం. దయచేసి మీ భాషను ఎంచుకోండి.'
              : "Namaste! Welcome to AgriConnect. Let's get started. Please choose your language.",
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
          hint: language === 'mr' ? 'भाषा निवडून पुढे जा' : language === 'te' ? 'భాషను ఎంచుకోండి' : 'Select English, Marathi or Telugu',
        };

      case 'start-location':
        return {
          main:
            language === 'mr'
              ? 'आपले स्थान निश्चित करा जेणेकरून आम्ही आपल्यासाठी जवळच्या मंड्या व खरेदीदार शोधू शकू.'
              : language === 'te'
              ? 'మీ సమీపంలోని మార్కెట్లు మరియు కొనుగోలుదారులను కనుగొనడానికి మీ ప్రదేశాన్ని నిర్ధారించండి.'
              : 'Confirm your location so we can find the nearest mandis and buyers for you.',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. जेव्हा तयार असाल, तेव्हा पुढे जा वर क्लिक करा.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. సిద్ధమైనప్పుడు తదుపరి క్లిక్ చేయండి.'
              : "No problem, take your time. When you're ready, click here to continue.",
          hint: language === 'mr' ? 'स्थान तपासा आणि पुष्टी करा' : language === 'te' ? 'లొకేషన్ నిర్ధారించండి' : 'Check location and click OK Next',
        };

      case 'start-role':
        return {
          main:
            language === 'mr'
              ? 'आपण शेतकरी आहात की खरेदीदार हे निवडा.'
              : language === 'te'
              ? 'మీరు రైతు లేదా కొనుగోలుదారు అని ఎంచుకోండి.'
              : 'Choose whether you are a Farmer or a Buyer.',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
          hint: language === 'mr' ? 'शेतकरी किंवा खरेदीदार निवडा' : language === 'te' ? 'రైతు లేదా కొనుగోలుదారు ఎంచుకోండి' : 'Choose Farmer or Buyer',
        };

      case 'farmer-crop':
        return {
          main:
            language === 'mr'
              ? 'कृपया आपले पीक येथे निवडा.'
              : language === 'te'
              ? 'దయచేసి మీ పంటను ఇక్కడ ఎంచుకోండి.'
              : 'Please select your crop here.',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
          hint: language === 'mr' ? 'उदा. भात, कांदा, टोमॅटो' : language === 'te' ? 'ఉదా. వరి, ఉల్లి, టమోటా' : 'e.g. Paddy, Onion, Tomato',
        };

      case 'farmer-details':
        return {
          main:
            language === 'mr'
              ? 'तुम्हाला किती पीक विकायचे आहे ते टाका. तुम्ही किलो किंवा क्विंटल निवडू शकता.'
              : language === 'te'
              ? 'మీరు ఎంత పంటను విక్రయించాలనుకుంటున్నారో నమోదు చేయండి. మీరు కిలో లేదా క్వింటాల్‌ను ఎంచుకోవచ్చు.'
              : 'Enter how much crop you want to sell. You can choose kg or quintal.',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
        };

      case 'farmer-photos':
        return {
          main:
            language === 'mr'
              ? 'आता आपल्या पिकाचा स्वच्छ फोटो येथे अपलोड करा.'
              : language === 'te'
              ? 'ఇప్పుడు మీ పంట యొక్క స్పష్టమైన ఫోటోను ఇక్కడ అప్‌లోడ్ చేయండి.'
              : 'Now click here to upload a clear photo of your crop.',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
        };

      case 'farmer-quality':
        return {
          main:
            language === 'mr'
              ? 'आपल्या पिकाची गुणवत्ता श्रेणी तपासा.'
              : language === 'te'
              ? 'మీ పంట నాణ్యతా గ్రేడ్‌ను పరిశీలించండి.'
              : 'Check and confirm your produce quality grade (Grade A/B/C).',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
        };

      case 'farmer-markets':
        return {
          main:
            language === 'mr'
              ? 'ही जवळची बाजारपेठ आहे. निवडण्यापूर्वी भाव, अंतर आणि वाहतूक खर्च तपासा.'
              : language === 'te'
              ? 'ఇవి సమీపంలోని మార్కెట్లు. ఎంచుకునే ముందు ధర, దూరం మరియు రవాణా ఖర్చును సరిపోల్చండి.'
              : 'These are the nearby markets. Compare the price, distance and transport cost before choosing.',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
        };

      case 'farmer-publish':
        return {
          main:
            language === 'mr'
              ? 'सर्व माहिती योग्य दिसत आहे. आपले पीक बाजारात नोंदवण्यासाठी येथे क्लिक करा.'
              : language === 'te'
              ? 'మీ వివరాలు బాగున్నాయి. మీ పంట జాబితాను ప్రచురించడానికి ఇక్కడ క్లిక్ చేయండి.'
              : 'Your details look good. Click here to publish your crop listing.',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
        };

      case 'buyer-browse':
        return {
          main:
            language === 'mr'
              ? 'तुम्ही शेतकऱ्यांचे लॉट येथे पाहू शकता. तपशील पाहण्यासाठी क्लिक करा.'
              : language === 'te'
              ? 'మీరు ఇక్కడ రైతు జాబితాలను బ్రౌజ్ చేయవచ్చు. వివరాలను చూడటానికి క్లిక్ చేయండి.'
              : 'You can browse farmer listings here. Click a listing to see its details.',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
        };

      case 'buyer-bid':
        return {
          main:
            language === 'mr'
              ? 'तुम्हाला खरेदी करायची असल्यास, बोली लावण्यासाठी येथे क्लिक करा.'
              : language === 'te'
              ? 'మీకు ఆసక్తి ఉంటే, మీ బిడ్ వేయడానికి ఇక్కడ క్లిక్ చేయండి.'
              : 'If you are interested, click here to place your bid.',
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
        };

      default:
        return {
          main:
            language === 'mr'
              ? 'नमस्ते! मी आपला ॲग्रीकनेक्ट मार्गदर्शक आहे.'
              : language === 'te'
              ? 'నమస్కారం! నేను మీ అగ్రికనెక్ట్ మార్గదర్శకుడిని.'
              : "Namaste! I'm your AgriConnect guide. Let's find the best market for your crop.",
          inactive:
            language === 'mr'
              ? 'काही हरकत नाही, सावकाश वेळ घ्या. मी इथेच थांबतो.'
              : language === 'te'
              ? 'పర్వాలేదు, నిదానంగా చేయండి. నేను ఇక్కడే ఉంటాను.'
              : "No problem, take your time. I'll wait here.",
        };
    }
  };

  const currentMsg = getStepMessage(guideStepId);

  if (!isGuideVisible) return null;

  return (
    <>
      {/* Subtle Target Element Spotlight Glow (Never obscures content or blocks clicks) */}
      {highlightCoords && (
        <div
          className="pointer-events-none fixed z-30 transition-all duration-300 rounded-2xl border-2 border-emerald-400/80 shadow-[0_0_25px_rgba(52,211,153,0.35)] animate-pulse"
          style={{
            top: highlightCoords.top - window.scrollY - 4,
            left: highlightCoords.left - window.scrollX - 4,
            width: highlightCoords.width + 8,
            height: highlightCoords.height + 8,
          }}
        />
      )}

      {/* Floating Realistic Indian Farmer Guide Card */}
      <div
        id="agriconnect-farmer-guide-popup"
        className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-88 select-none"
      >
        <AnimatePresence mode="wait">
          {isMinimized ? (
            /* Minimized Pill Avatar button */
            <motion.button
              key="minimized"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              type="button"
              onClick={() => setIsMinimized(false)}
              className="ml-auto bg-stone-900 border border-emerald-500/50 text-white rounded-full p-2 pl-3 pr-4 shadow-2xl flex items-center gap-2.5 cursor-pointer hover:border-emerald-400 transition-all hover:scale-105"
            >
              <img
                src="/farmer-guide.jpg"
                alt="Farmer Guide"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-emerald-400"
              />
              <div className="text-left">
                <span className="block text-xs font-black text-emerald-300 leading-tight">
                  Kisan Guide 👨‍🌾
                </span>
                <span className="block text-[10px] text-stone-400 leading-tight">
                  {language === 'mr' ? 'मदत हवी आहे? टॅप करा' : language === 'te' ? 'సహాయం కావాలా? తాకండి' : 'Need guidance? Tap here'}
                </span>
              </div>
            </motion.button>
          ) : (
            /* Expanded Interactive Guide Card */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-stone-900/95 backdrop-blur-md border border-emerald-500/40 text-stone-100 rounded-3xl p-4 shadow-2xl space-y-3 relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

              {/* Farmer Profile Header */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src="/farmer-guide.jpg"
                      alt="Farmer Guide Avatar"
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400 shadow-md ring-2 ring-emerald-500/20"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-stone-900" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-white leading-tight font-outfit">
                        Kisan Mitra (Agri Guide)
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Live
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-300 font-medium leading-tight">
                      {language === 'mr' ? 'आपला शेतकरी मार्गदर्शक' : language === 'te' ? 'మీ రైతు మార్గదర్శకుడు' : 'Your Platform Guide'}
                    </p>
                  </div>
                </div>

                {/* Control Actions: Minimize & Dismiss */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    title="Minimize Guide"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={dismissGuide}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    title="Close Guide"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contextual Speech Bubble */}
              <div className="bg-stone-950/80 rounded-2xl p-3 border border-stone-800 relative space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-base shrink-0 animate-bounce">
                    👉
                  </span>
                  <p className="text-xs text-stone-100 font-medium leading-relaxed">
                    {isInactive ? currentMsg.inactive : currentMsg.main}
                  </p>
                </div>

                {currentMsg.hint && !isInactive && (
                  <div className="text-[10px] text-amber-300/90 font-semibold pl-6">
                    💡 {currentMsg.hint}
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
                <span className="text-[10px] text-stone-400">
                  {language === 'mr'
                    ? 'मी आपल्या कृतीची वाट पाहत आहे...'
                    : language === 'te'
                    ? 'నేను మీ చర్య కోసం వేచి ఉన్నాను...'
                    : 'Waiting for your action...'}
                </span>

                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="px-3 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold text-[11px] border border-emerald-500/40 transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'समजले 👍' : language === 'te' ? 'అర్థమైంది 👍' : 'Got it 👍'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
