import React from 'react';
import {
  Award,
  TrendingUp,
  MapPin,
  Phone,
  Navigation,
  CheckCircle,
  AlertCircle,
  Clock,
  Building2,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { MarketComparisonItem, Language } from '../types';
import { getTranslation } from '../lib/translations';

interface RecommendationCardProps {
  recommendedMarket: MarketComparisonItem;
  cropName: string;
  quantityInQuintals: number;
  language: Language;
  onViewDetails?: (mkt: MarketComparisonItem) => void;
  onContactBuyer?: (mkt: MarketComparisonItem) => void;
  onGetDirections?: (mkt: MarketComparisonItem) => void;
  onCompareAgain?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendedMarket,
  cropName,
  quantityInQuintals,
  language,
  onViewDetails,
  onContactBuyer,
  onGetDirections,
  onCompareAgain
}) => {
  const t = getTranslation(language);

  return (
    <div className="bg-linear-to-b from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-700/50">
      {/* Decorative subtle background pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          <Award className="w-4 h-4" />
          <span>{t.recommendedBadge}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-200">
          <Clock className="w-3.5 h-3.5" />
          <span>Verified: {recommendedMarket.updatedAt}</span>
        </div>
      </div>

      {/* Main Title & Key Stat Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Column: Market Name & Identity */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {recommendedMarket.marketName}
            </h1>
            <span className="text-sm text-emerald-300 font-medium">
              ({recommendedMarket.district}, {recommendedMarket.state})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-100">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{recommendedMarket.distanceKm} km away</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1 rounded-lg">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{recommendedMarket.marketType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1 rounded-lg">
              <span className="text-amber-300 font-semibold">{cropName}</span>
              <span>• {quantityInQuintals} Quintals</span>
            </div>
          </div>

          {/* Why Recommended Notice */}
          <div className="bg-emerald-800/60 border border-emerald-600/40 rounded-xl p-3.5 text-xs text-emerald-100 space-y-1">
            <div className="font-semibold text-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-amber-300" />
              <span>{t.whyThisMarket}</span>
            </div>
            <p className="leading-relaxed pl-5">
              {recommendedMarket.recommendationReason}
            </p>
          </div>
        </div>

        {/* Right Column: High-Impact Net Return Display */}
        <div className="lg:col-span-5 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 sm:p-6 text-center lg:text-right space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
            {t.bestNetReturn}
          </div>
          <div className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight">
            ₹{recommendedMarket.estimatedNetReturn.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-100 flex items-center justify-center lg:justify-end gap-1.5">
            <span>Effective Take-Home:</span>
            <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">
              ₹{recommendedMarket.effectivePricePerQuintal} / quintal
            </span>
          </div>
        </div>
      </div>

      {/* Transparent Financial Math Breakdown (Rule 7 Mandate) */}
      <div className="mt-8 pt-6 border-t border-emerald-800/80 relative z-10">
        <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3">
          Transparent Financial Breakdown (Exact Deductions)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-emerald-200">{t.marketPrice}</div>
            <div className="text-lg font-bold text-white mt-1">
              ₹{recommendedMarket.cropPricePerQuintal.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-300">per quintal</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-emerald-200">{t.grossRevenue}</div>
            <div className="text-lg font-bold text-white mt-1">
              ₹{recommendedMarket.grossRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-300">Price × {quantityInQuintals} qtl</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-amber-200">− {t.transportCost}</div>
            <div className="text-lg font-bold text-amber-300 mt-1">
              ₹{recommendedMarket.transportCost.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-300">{recommendedMarket.distanceKm} km freight</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-amber-200">− {t.otherCharges}</div>
            <div className="text-lg font-bold text-amber-300 mt-1">
              ₹{(recommendedMarket.loadingCost + recommendedMarket.marketCharges).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-300">Loading + Mandi fee</div>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-6 pt-5 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          {recommendedMarket.buyerContactAvailable && (
            <button
              onClick={() => onContactBuyer && onContactBuyer(recommendedMarket)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t.contactBuyer}</span>
            </button>
          )}

          <button
            onClick={() => onGetDirections && onGetDirections(recommendedMarket)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-white/20"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.getDirections}</span>
          </button>

          <button
            onClick={() => onViewDetails && onViewDetails(recommendedMarket)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-white/20"
          >
            <span>{t.viewDetails}</span>
          </button>
        </div>

        {onCompareAgain && (
          <button
            onClick={onCompareAgain}
            className="text-xs text-emerald-200 hover:text-white underline underline-offset-4 cursor-pointer"
          >
            {t.compareAgain}
          </button>
        )}
      </div>

      {/* Honest Disclaimer */}
      <div className="mt-4 text-[11px] text-emerald-300/80 italic text-center sm:text-left">
        * {t.disclaimerFooter}
      </div>
    </div>
  );
};
