import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  MapPin,
  Scale
} from 'lucide-react';
import { CropInfo, FarmerLocation, Language } from '../../types';

interface Page4MarketAnalysisProps {
  location: FarmerLocation;
  crop: CropInfo;
  customCropName?: string;
  quantityInQuintals: number;
  grade: string;
  language: Language;
  onStartAnalysis: () => Promise<void>;
  onComplete: () => void;
  onBack: () => void;
}

export const Page4MarketAnalysis: React.FC<Page4MarketAnalysisProps> = ({
  location,
  crop,
  customCropName,
  quantityInQuintals,
  grade,
  language,
  onStartAnalysis,
  onComplete,
  onBack
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const decisionStages = [
    {
      id: 'crop',
      icon: '🌾',
      title: language === 'te' ? 'మీ పంట' : language === 'hi' ? 'आपकी फसल' : 'Your Crop',
      detail: `${customCropName || (language === 'te' && crop.nameTelugu ? crop.nameTelugu : crop.name)} (${grade})`
    },
    {
      id: 'loc',
      icon: '📍',
      title: language === 'te' ? 'పొలం ప్రాంతం' : language === 'hi' ? 'खेत का स्थान' : 'Your Location',
      detail: `${location.villageOrTown}, ${location.district}`
    },
    {
      id: 'mandis',
      icon: '🏪',
      title: language === 'te' ? 'సమీప మార్కెట్లు' : language === 'hi' ? 'निकटतम मंडियाँ' : 'Nearby Markets',
      detail: language === 'te' ? 'ప్రాంతీయ APMC మార్కెట్ల గుర్తింపు' : 'Identifying regulated APMC yards'
    },
    {
      id: 'prices',
      icon: '💰',
      title: language === 'te' ? 'వేలం ధరలు' : language === 'hi' ? 'नीलामी भाव' : 'Mandi Prices',
      detail: language === 'te' ? 'రోజువారీ బోర్డు రేట్ల తనిఖీ' : 'Checking electronic auction rates'
    },
    {
      id: 'transport',
      icon: '🚚',
      title: language === 'te' ? 'రవాణా ఖర్చు' : language === 'hi' ? 'परिवहन भाड़ा' : 'Transport Logistics',
      detail: language === 'te' ? 'రోడ్డు దూరం ఆధారంగా కి.మీ లెక్క' : 'Haversine distance & vehicle freight'
    },
    {
      id: 'buyers',
      icon: '👤',
      title: language === 'te' ? 'ధృవీకరించిన కొనుగోలుదారులు' : language === 'hi' ? 'सत्यापित खरीदार' : 'Buyer Matches',
      detail: language === 'te' ? 'వ్యాపారులు & మిల్లుల డిమాండ్' : 'Matching active traders & millers'
    },
    {
      id: 'net',
      icon: '💵',
      title: language === 'te' ? 'నికర లాభం' : language === 'hi' ? 'शुद्ध लाभ' : 'Net Return',
      detail: language === 'te' ? 'రవాణా & మండి చార్జీలు తీసివేసి' : 'Revenue minus freight & cess'
    },
    {
      id: 'best',
      icon: '⭐',
      title: language === 'te' ? 'ఉత్తమ ఎంపిక' : language === 'hi' ? 'सर्वोत्तम विकल्प' : 'Best Selling Option',
      detail: language === 'te' ? 'అత్యధిక రాబడినిచ్చే మార్కెట్ సిద్ధం' : 'Highest net return option ready!'
    }
  ];

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStepIndex(0);

    // Call background calculation immediately
    const calcPromise = onStartAnalysis();

    // Step through the decision journey smoothly (approx 200ms per step = 1.6s total)
    for (let i = 1; i <= decisionStages.length; i++) {
      await new Promise((r) => setTimeout(r, 220));
      setCurrentStepIndex(i);
    }

    await calcPromise;
    setIsAnalyzing(false);
    onComplete();
  };

  const cropDisplayName =
    customCropName ||
    (language === 'te' && crop.nameTelugu ? crop.nameTelugu : crop.name);

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          disabled={isAnalyzing}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 p-1 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {language === 'te'
              ? 'పంట మార్పు'
              : language === 'hi'
              ? 'फसल बदलें'
              : language === 'mr'
              ? 'पीक बदला'
              : 'Back'}
          </span>
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {language === 'te'
            ? 'దశ 3 / 4 • మార్కెట్ విశ్లేషణ'
            : language === 'hi'
            ? 'चरण 3 / 4 • मंडी विश्लेषण'
            : language === 'mr'
            ? 'टप्पा 3 / 4 • बाजार विश्लेषण'
            : 'Step 3 of 4 • Market Analysis'}
        </span>
      </div>

      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {language === 'te'
            ? 'ఉత్తమ మార్కెట్‌ను కనుగొందాం'
            : language === 'hi'
            ? 'आइए आपके लिए सबसे अच्छा विकल्प खोजें'
            : language === 'mr'
            ? 'आपल्यासाठी सर्वोत्तम बाजार शोधूया'
            : "Let's Find the Best Option"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'te'
            ? 'మీ వివరాల ఆధారంగా అత్యధిక నికర రాబడినిచ్చే మార్కెట్ విశ్లేషణ'
            : language === 'hi'
            ? 'अधिकतम शुद्ध लाभ के लिए वास्तविक मालभाड़ा व भाव की तुलना'
            : language === 'mr'
            ? 'सर्वोच्च निव्वळ नफ्यासाठी वाहतूक व भावाची तुलना'
            : 'Comparing freight, distances, and auction rates for maximum in-pocket net return'}
        </p>
      </div>

      {/* Compact Summary Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          {language === 'te' ? 'మీరు నమోదు చేసిన సమాచారం:' : 'Your Farm Details Summary:'}
        </span>
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
          <div className="px-1">
            <span className="text-xl block mb-1">📍</span>
            <span className="text-[11px] text-slate-500 block">Location</span>
            <span className="text-xs font-bold text-slate-900 block truncate">
              {location.villageOrTown}
            </span>
          </div>

          <div className="px-1">
            <span className="text-xl block mb-1">{crop.icon || '🌾'}</span>
            <span className="text-[11px] text-slate-500 block">Crop</span>
            <span className="text-xs font-bold text-slate-900 block truncate">
              {cropDisplayName}
            </span>
          </div>

          <div className="px-1">
            <span className="text-xl block mb-1">⚖️</span>
            <span className="text-[11px] text-slate-500 block">Quantity</span>
            <span className="text-xs font-bold text-emerald-800 block truncate">
              {quantityInQuintals} Qtl
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      {!isAnalyzing ? (
        <div className="space-y-4">
          <button
            onClick={handleRunAnalysis}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-lg shadow-emerald-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Compass className="w-5 h-5 animate-spin-slow" />
            <span>
              {language === 'te'
                ? 'ఉత్తమ మార్కెట్ కనుగొనండి'
                : language === 'hi'
                ? 'सबसे अच्छी मंडी खोजें'
                : language === 'mr'
                ? 'सर्वोत्तम बाजार शोधा'
                : 'Find Best Market'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-center text-xs text-slate-500 leading-relaxed">
            {language === 'te'
              ? 'రవాణా దూరం, వాహన ఖర్చు మరియు మండి వేలం ధరలను పోల్చి మీ చేతికి అందే నికర లాభాన్ని లెక్కిస్తుంది.'
              : 'Accurately calculates road distance, transport freight, and auction prices for true net in-hand earnings.'}
          </p>
        </div>
      ) : (
        /* The Actual Decision Process Animation */
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span className="text-xs font-bold text-slate-800">
              {language === 'te'
                ? 'మీ కొరకు అన్ని అంశాలను లెక్కిస్తున్నాము...'
                : 'Comparing every option for your harvest...'}
            </span>
          </div>

          <div className="space-y-2">
            {decisionStages.map((stage, idx) => {
              const isPassed = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                    isPassed
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-100'
                      : isCurrent
                      ? 'bg-amber-50 text-amber-950 border border-amber-200 shadow-2xs'
                      : 'bg-slate-50 text-slate-400 border border-transparent opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base select-none">{stage.icon}</span>
                    <div>
                      <span className="font-bold block leading-tight">
                        {stage.title}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {stage.detail}
                      </span>
                    </div>
                  </div>

                  <div>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
