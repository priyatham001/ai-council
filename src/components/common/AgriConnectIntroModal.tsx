import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Sparkles, X, ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AgriConnectIntroModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

interface StageInfo {
  icon: string;
  stepName: string;
  title: string;
  subtitle: string;
  accentColor: string;
  bgGlow: string;
}

export const AgriConnectIntroModal: React.FC<AgriConnectIntroModalProps> = ({
  forceOpen = false,
  onClose,
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (forceOpen) return true;
    try {
      return !sessionStorage.getItem('agriconnect_intro_viewed');
    } catch {
      return true;
    }
  });

  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 5-phase animation sequence requested by user:
  // Farmer → Crop → Market → Buyer → Connection
  const stages: StageInfo[] = [
    {
      icon: '👨‍🌾',
      stepName: 'Stage 1',
      title: language === 'mr' ? 'शेतकरी (Farmer)' : language === 'te' ? 'రైతు (Farmer)' : 'Farmer',
      subtitle:
        language === 'mr'
          ? 'स्थानिक शेतातून थेट गुणवत्ता तपासणी आणि शेतीमाल नोंदणी'
          : language === 'te'
          ? 'పొలం నుండి నేరుగా నాణ్యత తనిఖీ మరియు పంట నమోదు'
          : 'Originating at the farm gate with transparent quality grading',
      accentColor: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/15',
    },
    {
      icon: '🌾',
      stepName: 'Stage 2',
      title: language === 'mr' ? 'शेतीमाल व लॉट (Crop Listing)' : language === 'te' ? 'పంట జాబితా (Crop Listing)' : 'Crop Listing',
      subtitle:
        language === 'mr'
          ? 'डिजिटल लॉट आणि प्रमाणित कृषी गुणवत्ता पासपोर्ट'
          : language === 'te'
          ? 'డిజిటల్ లాట్ మరియు ధృవీకరించిన నాణ్యతా వివరాలు'
          : 'Verified digital lots with standard grades (Grade A, B, C)',
      accentColor: 'from-amber-500 to-yellow-600',
      bgGlow: 'bg-amber-500/15',
    },
    {
      icon: '🏪',
      stepName: 'Stage 3',
      title: language === 'mr' ? 'बाजारपेठ शोध (Mandi Discovery)' : language === 'te' ? 'మార్కెట్ కనుగొనడం (Mandi Discovery)' : 'Market Discovery',
      subtitle:
        language === 'mr'
          ? 'अखिल भारतीय मंड्यांमधील थेट दर आणि वाहतूक खर्च मोजणी'
          : language === 'te'
          ? 'అఖిల భారత మార్కెట్ ధరలు మరియు రవాణా ఖర్చు విశ్లేషణ'
          : 'Transparent mandi rates and freight-adjusted net realization',
      accentColor: 'from-sky-500 to-blue-600',
      bgGlow: 'bg-sky-500/15',
    },
    {
      icon: '🤝',
      stepName: 'Stage 4',
      title: language === 'mr' ? 'प्रमाणित खरेदीदार (Verified Buyer)' : language === 'te' ? 'కొనుగోలుదారు (Verified Buyer)' : 'Verified Buyer',
      subtitle:
        language === 'mr'
          ? 'संस्थागत व्यापारी, प्रक्रियादार आणि थेट डिजिटल खरेदी बोली'
          : language === 'te'
          ? 'సంస్థాగత వ్యాపారులు, ప్రాసెసర్లు మరియు ప్రత్యక్ష వాణిజ్య బిడ్లు'
          : 'Audited institutional processors placing direct commercial bids',
      accentColor: 'from-purple-500 to-indigo-600',
      bgGlow: 'bg-purple-500/15',
    },
    {
      icon: '⚡',
      stepName: 'Stage 5',
      title: language === 'mr' ? 'थेट जोडणी (Direct Connection)' : language === 'te' ? 'నేరుగా అనుసంధానం (Direct Connection)' : 'Direct Connection',
      subtitle:
        language === 'mr'
          ? 'शेतकरी आणि खरेदीदार यांच्यात मध्यस्थांशिवाय थेट व्यवहार'
          : language === 'te'
          ? 'రైతులు మరియు కొనుగోలుదారుల మధ్య దళారులు లేని అనుసంధానం'
          : 'Direct farmgate-to-buyer linkage powered by AgriConnect',
      accentColor: 'from-emerald-400 via-teal-400 to-amber-400',
      bgGlow: 'bg-emerald-400/25',
    },
  ];

  // Auto-progress stages every 2.4 seconds unless paused
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const timer = setInterval(() => {
      setActiveStage((prev) => {
        if (prev >= stages.length - 1) {
          // Completed sequence
          return prev;
        }
        return prev + 1;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, stages.length]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('agriconnect_intro_viewed', 'true');
    } catch {}
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="agriconnect-intro-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -16 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-stone-900 border border-emerald-500/30 text-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Brand & Dismiss */}
          <div className="relative z-10 flex items-center justify-between pb-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-stone-950 flex items-center justify-center text-2xl font-black shadow-lg">
                🌾
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-outfit">
                  AGRI<span className="text-emerald-400">CONNECT</span>
                </h2>
                <p className="text-[11px] text-emerald-300 font-medium">
                  {language === 'mr'
                    ? 'थेट शेतकरी-खरेदीदार बाजारपेठ जोडणी'
                    : language === 'te'
                    ? 'నేరుగా రైతు-కొనుగోలుదారు మార్కెట్ అనుసంధానం'
                    : 'Direct Farmgate-to-Buyer Marketplace Linkage'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Skip Intro"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sequential Animated Timeline: Farmer → Crop → Market → Buyer → Connection */}
          <div className="relative z-10 py-6 sm:py-8 space-y-6">
            {/* Step icons row with linking lines */}
            <div className="flex items-center justify-between relative px-2">
              {/* Connecting background track */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-stone-800 rounded-full z-0" />
              {/* Active progress fill */}
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full z-0 transition-all duration-500"
                style={{
                  width: `${(activeStage / (stages.length - 1)) * 88}%`,
                }}
              />

              {stages.map((stg, idx) => {
                const isCurrent = activeStage === idx;
                const isPassed = activeStage > idx;

                return (
                  <button
                    key={stg.stepName}
                    type="button"
                    onClick={() => setActiveStage(idx)}
                    className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.25 }}
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg transition-all duration-300 ${
                        isCurrent
                          ? `bg-gradient-to-tr ${stg.accentColor} text-white ring-4 ring-emerald-400/30 scale-110 shadow-emerald-500/30`
                          : isPassed
                          ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-500/40'
                          : 'bg-stone-800/90 text-stone-400 border border-stone-700'
                      }`}
                    >
                      <span>{stg.icon}</span>
                    </motion.div>
                    <span
                      className={`mt-2 text-[10px] sm:text-xs font-bold transition-colors hidden sm:block ${
                        isCurrent
                          ? 'text-emerald-400 font-extrabold'
                          : isPassed
                          ? 'text-stone-300'
                          : 'text-stone-500'
                      }`}
                    >
                      {stg.title.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Card Highlight */}
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-5 sm:p-6 rounded-2xl border border-stone-800 bg-stone-900/90 ${stages[activeStage].bgGlow} transition-all space-y-2 text-center`}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{stages[activeStage].stepName}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {stages[activeStage].title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
                {stages[activeStage].subtitle}
              </p>
            </motion.div>
          </div>

          {/* Bottom Controls */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-800">
            <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
              <span>Sequence:</span>
              <span className="text-emerald-400 font-bold">
                Farmer → Crop → Market → Buyer → Connection
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {activeStage < stages.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStage((p) => p + 1)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleDismiss}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 text-xs font-black shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105"
              >
                <span>
                  {language === 'mr'
                    ? 'ॲग्रीकनेक्ट मंचावर जा'
                    : language === 'te'
                    ? 'అగ్రికనెక్ట్ వేదికకు వెళ్లండి'
                    : 'Continue to AgriConnect'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
