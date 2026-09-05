import React from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Language } from '../../types';

interface MarketJourneyAnimationProps {
  language: Language;
}

export const MarketJourneyAnimation: React.FC<MarketJourneyAnimationProps> = ({ language }) => {
  const steps = [
    {
      title: language === 'te' ? 'ప్రాంతీయ APMC మండిల గుర్తింపు' : 'Discovering Regional APMC Mandis',
      icon: '📍',
      status: 'complete'
    },
    {
      title: language === 'te' ? 'ఎలక్ట్రానిక్ వేలం ధరల పరిశీలన' : 'Fetching Electronic Auction Quotes',
      icon: '📊',
      status: 'complete'
    },
    {
      title: language === 'te' ? 'రోడ్డు దూరం & రవాణా ఖర్చు లెక్కింపు' : 'Haversine Road Distance & Freight',
      icon: '🚚',
      status: 'complete'
    },
    {
      title: language === 'te' ? 'నికర లాభం లెక్కించడం' : 'Computing Net In-Hand Returns',
      icon: '💰',
      status: 'active'
    },
    {
      title: language === 'te' ? 'ఉత్తమ మార్కెట్ సిఫార్సు తయారీ' : 'Evaluating Optimal Farmer Recommendation',
      icon: '⭐',
      status: 'active'
    }
  ];

  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm my-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
        <h3 className="text-sm font-bold text-slate-800">
          {language === 'te' ? 'మార్కెట్ విశ్లేషణ మరియు నికర రాబడి లెక్కింపు...' : 'Analyzing Mandis & Optimizing Net Returns...'}
        </h3>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <span>{step.icon}</span>
              <span className="font-medium text-slate-700">{step.title}</span>
            </div>
            {step.status === 'complete' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
