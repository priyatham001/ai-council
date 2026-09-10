import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FarmerBuyerLinkageAnimationProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean; // Can be rendered embedded in a card or as a modal
}

export const FarmerBuyerLinkageAnimation: React.FC<FarmerBuyerLinkageAnimationProps> = ({
  isOpen = true,
  onClose,
  isEmbedded = false,
}) => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Steps for cinematic animation sequence:
  // 0: Farmer creates harvest listing
  // 1: Crop listing travels to AgriConnect Marketplace
  // 2: AgriConnect indexes & displays to verified buyers
  // 3: Buyer views lot & submits commercial bid
  // 4: Farmer receives & selects highest net bid
  // 5: Direct Connection established (Farmer ↔ AgriConnect ↔ Buyer)
  const steps = [
    {
      id: 0,
      badge: 'Step 1: Farmer Harvest',
      title:
        language === 'mr'
          ? 'शेतकरी पीक नोंदणी'
          : language === 'te'
          ? 'రైతు పంట నమోదు'
          : 'Farmer Harvest & Lot Creation',
      desc:
        language === 'mr'
          ? 'शेतकरी आपल्या पिकाचा दर्जा (Grade A) आणि प्रमाण (५० क्विंटल) नोंदवतो.'
          : language === 'te'
          ? 'రైతు తన పంట నాణ్యత (Grade A) మరియు పరిమాణం (50 క్వింటాళ్లు) నమోదు చేస్తారు.'
          : 'Farmer inspects produce quality and registers lot at farm gate.',
      cropPos: 'left',
      bidPos: 'hidden',
      connectionActive: false,
    },
    {
      id: 1,
      badge: 'Step 2: Digital Listing',
      title:
        language === 'mr'
          ? 'शेतीमाल ॲग्रीकनेक्टवर प्रसारित'
          : language === 'te'
          ? 'పంట అగ్రికనెక్ట్‌కు చేరుతుంది'
          : 'Crop Listing Syncs to Marketplace',
      desc:
        language === 'mr'
          ? 'डिजिटल लॉट पारदर्शकतेने ॲग्रीकनेक्ट मंचावर उपलब्ध होतो.'
          : language === 'te'
          ? 'డిజిటల్ లాట్ పారదర్శకంగా అగ్రికనెక్ట్ వేదికపై ప్రసారం అవుతుంది.'
          : 'Verified produce lot with digital passport is published in real time.',
      cropPos: 'center',
      bidPos: 'hidden',
      connectionActive: false,
    },
    {
      id: 2,
      badge: 'Step 3: Buyer Discovers',
      title:
        language === 'mr'
          ? 'खरेदीदाराकडून पाहणी'
          : language === 'te'
          ? 'కొనుగోలుదారు పరిశీలన'
          : 'Buyer Evaluates Produce',
      desc:
        language === 'mr'
          ? 'प्रमाणित व्यापारी व अन्न प्रक्रिया उद्योग शेतीमालाची पाहणी करतात.'
          : language === 'te'
          ? 'ధృవీకరించిన కొనుగోలుదారులు మరియు ప్రాసెసర్లు పంటను పరిశీలిస్తారు.'
          : 'Institutional buyer reviews moisture, grade, and farmgate location.',
      cropPos: 'right',
      bidPos: 'hidden',
      connectionActive: false,
    },
    {
      id: 3,
      badge: 'Step 4: Commercial Bid',
      title:
        language === 'mr'
          ? 'खरेदीदाराकडून थेट बोली'
          : language === 'te'
          ? 'కొనుగోలుదారు బిడ్ దాఖలు'
          : 'Buyer Submits Competitive Bid',
      desc:
        language === 'mr'
          ? 'खरेदीदार ₹२,९५०/क्विंटल दराने थेट खरेदी बोली सादर करतो.'
          : language === 'te'
          ? 'కొనుగోలుదారు ₹2,950/క్వింటాల్ చొప్పున బిడ్ సమర్పిస్తారు.'
          : 'Buyer places direct verified bid above mandi benchmark rate.',
      cropPos: 'right',
      bidPos: 'center',
      connectionActive: false,
    },
    {
      id: 4,
      badge: 'Step 5: Farmer Selects',
      title:
        language === 'mr'
          ? 'शेतकऱ्याकडून सर्वोत्तम बोलीची निवड'
          : language === 'te'
          ? 'రైతు ఉత్తమ బిడ్‌ను ఎంచుకుంటారు'
          : 'Farmer Chooses Best Bid',
      desc:
        language === 'mr'
          ? 'शेतकरी नफा व वाहतूक खर्च तपासून सर्वाधिक फायदेशीर बोली स्वीकारतो.'
          : language === 'te'
          ? 'రైతు లాభం మరియు రవాణా ఖర్చులను సరిపోల్చి ఉత్తమ బిడ్‌ను ఆమోదిస్తారు.'
          : 'Farmer accepts highest net realization bid with guaranteed payment.',
      cropPos: 'center',
      bidPos: 'left',
      connectionActive: false,
    },
    {
      id: 5,
      badge: 'Step 6: Direct Linkage',
      title:
        language === 'mr'
          ? 'थेट जोडणी: शेतकरी ↔ ॲग्रीकनेक्ट ↔ खरेदीदार'
          : language === 'te'
          ? 'ప్రత్యక్ష అనుసంధానం: రైతు ↔ అగ్రికనెక్ట్ ↔ కొనుగోలుదారు'
          : 'Direct Linkage: Farmer ↔ AgriConnect ↔ Buyer',
      desc:
        language === 'mr'
          ? 'कोणत्याही मध्यस्थांशिवाय थेट शेतीतून खरेदीदारापर्यंत पारदर्शक व्यापार!'
          : language === 'te'
          ? 'దళారులు లేకుండా నేరుగా పొలం నుండి కొనుగోలుదారు వరకు పారదర్శక వ్యాపారం!'
          : 'Fair, transparent farmgate transaction established without middlemen.',
      cropPos: 'center',
      bidPos: 'center',
      connectionActive: true,
    },
  ];

  // Animation cycle
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  if (!isOpen && !isEmbedded) return null;

  const content = (
    <div
      id="farmer-buyer-linkage-panel"
      className="bg-stone-900 border border-emerald-500/30 text-white rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden relative"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-500 text-stone-950 flex items-center justify-center text-xl font-bold shadow-md">
            🌾
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-outfit">
              Farmer ↔ AgriConnect ↔ Buyer Live Linkage
            </h3>
            <p className="text-[11px] text-emerald-300 font-medium">
              {language === 'mr'
                ? 'थेट शेतकरी-खरेदीदार व्यवहार कसा होतो ते पहा'
                : language === 'te'
                ? 'రైతు మరియు కొనుగోలుదారు మధ్య ప్రత్యక్ష అనుసంధానం ఎలా పనిచేస్తుందో చూడండి'
                : 'Interactive Agricultural Value Chain Visualization'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
            title={isPlaying ? 'Pause Animation' : 'Play Animation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(0)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
            title="Restart Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {!isEmbedded && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Cinematic Visual Stage */}
      <div className="relative z-10 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* LEFT: Realistic Indian Farmer */}
          <div
            className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center space-y-3 ${
              activeStep === 0 || activeStep === 4 || activeStep === 5
                ? 'bg-emerald-950/70 border-emerald-500 shadow-lg shadow-emerald-900/30'
                : 'bg-stone-800/60 border-stone-700'
            }`}
          >
            <div className="relative">
              <img
                src="/farmer-guide.jpg"
                alt="Indian Farmer"
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-emerald-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950 font-black text-[9px] uppercase tracking-wider">
                Farmer
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Ramesh Reddy</h4>
              <p className="text-[11px] text-emerald-300">Kadapa, Andhra Pradesh</p>
              <p className="text-[10px] text-stone-400 mt-1">Produce: 50 Qntl Paddy (Grade A)</p>
            </div>
          </div>

          {/* CENTER: AgriConnect Marketplace Core */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col items-center text-center space-y-3 relative ${
              steps[activeStep].connectionActive
                ? 'bg-gradient-to-b from-emerald-900/90 to-stone-900 border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-stone-800/80 border-stone-700'
            }`}
          >
            {/* Pulsing Connector Lines */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-stone-950 flex items-center justify-center text-2xl font-black shadow-lg">
              🌾
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Direct Linkage Engine
              </span>
              <h4 className="text-base font-black text-white mt-1">AgriConnect Marketplace</h4>
              <p className="text-[10px] text-stone-300 mt-0.5">
                Transparent APMC Mandi Rates • Zero Middlemen
              </p>
            </div>

            {/* Visual animated pulse indicators */}
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-stone-400 pt-2 border-t border-stone-700/60">
              <span className={activeStep <= 2 ? 'text-emerald-400 font-extrabold' : ''}>
                ← Crop Listing
              </span>
              <span className="text-amber-400">⚡ Direct</span>
              <span className={activeStep >= 3 ? 'text-amber-300 font-extrabold' : ''}>
                Buyer Bid →
              </span>
            </div>
          </div>

          {/* RIGHT: Realistic Indian Wholesale Buyer */}
          <div
            className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center space-y-3 ${
              activeStep === 2 || activeStep === 3 || activeStep === 5
                ? 'bg-amber-950/70 border-amber-500 shadow-lg shadow-amber-900/30'
                : 'bg-stone-800/60 border-stone-700'
            }`}
          >
            <div className="relative">
              <img
                src="/buyer-guide.jpg"
                alt="Institutional Commodity Buyer"
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-amber-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[9px] uppercase tracking-wider">
                Buyer
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Deccan Agro Exports</h4>
              <p className="text-[11px] text-amber-300">Hyderabad Hub • Institutional</p>
              <p className="text-[10px] text-stone-400 mt-1">Direct Procurement & Escrow</p>
            </div>
          </div>
        </div>

        {/* Narrative Flow Bar */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 rounded-2xl bg-stone-950/80 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
              {steps[activeStep].badge}
            </span>
            <h5 className="text-sm sm:text-base font-black text-white">
              {steps[activeStep].title}
            </h5>
            <p className="text-xs text-stone-300">{steps[activeStep].desc}</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeStep === idx ? 'w-7 bg-emerald-400' : 'bg-stone-700 hover:bg-stone-500'
                }`}
                title={`Go to ${s.badge}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl">{content}</div>
    </div>
  );
};
