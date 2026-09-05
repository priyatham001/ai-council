import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../lib/translations';

interface FarmToMarketFlowProps {
  language: Language;
  currentStep?: 1 | 2 | 3 | 4 | 5;
}

export const FarmToMarketFlow: React.FC<FarmToMarketFlowProps> = ({
  language,
  currentStep = 1
}) => {
  const t = getTranslation(language);

  const steps = [
    {
      num: 1,
      title: language === 'te' ? 'పంట కోత' : language === 'hi' ? 'खेत व फसल' : language === 'mr' ? 'शेत व पीक' : 'Farm Harvest',
      desc: language === 'te' ? 'పంట & పరిమాణం' : language === 'hi' ? 'फसल व मात्रा' : language === 'mr' ? 'पीक व प्रमाण' : 'Crop & Quantity',
      icon: '🌾',
      activeColor: 'bg-emerald-500 text-white border-emerald-600',
      lineColor: 'border-emerald-500'
    },
    {
      num: 2,
      title: language === 'te' ? 'ప్రాంతం & దూరం' : language === 'hi' ? 'स्थान व दूरी' : language === 'mr' ? 'स्थान व अंतर' : 'Farm Location',
      desc: language === 'te' ? 'GPS లేదా మాన్యువల్' : language === 'hi' ? 'GPS या मैन्युअल' : language === 'mr' ? 'GPS किंवा स्वतः' : 'GPS Coordinates',
      icon: '📍',
      activeColor: 'bg-teal-600 text-white border-teal-700',
      lineColor: 'border-teal-500'
    },
    {
      num: 3,
      title: language === 'te' ? 'రవాణా లెక్కింపు' : language === 'hi' ? 'भाड़ा गणना' : language === 'mr' ? 'वाहतूक खर्च' : 'Transport Freight',
      desc: language === 'te' ? 'వాహనం & కి.మీ' : language === 'hi' ? 'वाहन व ₹/किमी' : language === 'mr' ? 'वाहन व दर' : 'Realistic ₹/Km',
      icon: '🚚',
      activeColor: 'bg-blue-600 text-white border-blue-700',
      lineColor: 'border-blue-500'
    },
    {
      num: 4,
      title: language === 'te' ? 'మండి పోలిక' : language === 'hi' ? 'मंडी तुलना' : language === 'mr' ? 'बाजार तुलना' : 'Mandi Comparison',
      desc: language === 'te' ? 'బోర్డు ధరలు' : language === 'hi' ? 'मंडी भाव' : language === 'mr' ? 'बाजारभाव' : 'Board Auction Rates',
      icon: '🏪',
      activeColor: 'bg-amber-600 text-white border-amber-700',
      lineColor: 'border-amber-500'
    },
    {
      num: 5,
      title: language === 'te' ? 'అధిక నికర ఆదాయం' : language === 'hi' ? 'अधिकतम शुद्ध लाभ' : language === 'mr' ? 'सर्वोच्च निव्वळ नफा' : 'Max Net Return',
      desc: language === 'te' ? 'రైతు చేతికి నఫా' : language === 'hi' ? 'जेब में वास्तविक बचत' : language === 'mr' ? 'हातात येणारा नफा' : 'In Farmer Pocket',
      icon: '💰',
      activeColor: 'bg-emerald-600 text-white border-emerald-700 shadow-md',
      lineColor: 'border-emerald-600'
    }
  ];

  return (
    <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:p-4 my-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <span>🚜</span>
          <span>{language === 'te' ? 'పొలం నుండి మార్కెట్ నికర రాబడి ప్రయాణం' : language === 'hi' ? 'खेत से बाज़ार शुद्ध लाभ प्रक्रिया' : language === 'mr' ? 'शेतातून बाजारात निव्वळ नफा प्रवास' : 'Farm-to-Market Net Return Discovery Journey'}</span>
        </h2>
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          SIH26132 Workflow
        </span>
      </div>

      {/* Steps Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
        {steps.map((step, idx) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;

          return (
            <div
              key={step.num}
              className={`flex flex-col items-center text-center p-2 rounded-lg transition-all border ${
                isCurrent
                  ? 'bg-white border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                  : isCompleted
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-white/80 border-slate-200'
              }`}
            >
              <div className="relative mb-1.5">
                <span className="text-2xl select-none" role="img" aria-label={step.title}>
                  {step.icon}
                </span>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 bg-white rounded-full absolute -top-1 -right-1" />
                )}
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight mb-0.5">
                {step.title}
              </span>
              <span className="text-[11px] text-slate-500 leading-tight">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
