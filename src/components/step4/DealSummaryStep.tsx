import React from 'react';
import {
  CropSelectionState,
  Language,
  LocationData,
  MarketAnalysisResult,
} from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';
import {
  CheckCircle2,
  MapPin,
  FileText,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Printer,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface DealSummaryStepProps {
  language: Language;
  location: LocationData;
  cropState: CropSelectionState;
  marketResult: MarketAnalysisResult;
  onRestart: () => void;
  onBack: () => void;
}

export const DealSummaryStep: React.FC<DealSummaryStepProps> = ({
  language,
  location,
  cropState,
  marketResult,
  onRestart,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const { market } = marketResult;

  const cropName =
    cropState.selectedCrop?.localNames[language] ||
    cropState.selectedCrop?.name ||
    cropState.customCropName ||
    'Crop';

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Success Badge Banner */}
      <div className="bg-emerald-800 text-white rounded-2xl p-5 text-center shadow-md">
        <div className="w-12 h-12 rounded-full bg-emerald-700 mx-auto flex items-center justify-center text-white mb-2 shadow-inner">
          <CheckCircle2 className="w-6 h-6 text-amber-300" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black font-outfit">
          Mandi Dispatch Slip & Net Payout Summary
        </h2>
        <p className="text-xs text-emerald-200 mt-1">
          Lock in your preferred market route with transparent price assurance
        </p>
      </div>

      {/* Official printable slip card */}
      <div className="bg-white rounded-3xl border-2 border-stone-300 p-6 sm:p-8 shadow-sm space-y-6 print:border-black">
        {/* Slip Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <span className="text-xl font-extrabold text-stone-950 font-outfit">
                {t.appName}
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-mono">
              Slip ID: KS-{Date.now().toString().slice(-8)}
            </span>
          </div>

          <div className="text-right">
            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
              Verified Farmer Dispatch
            </span>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Issued: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* 2-Column Details: Farm & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Farm Origin */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
              1. Farm Origin
            </span>
            <h4 className="font-bold text-stone-900 text-sm">
              {location.formattedAddress}
            </h4>
            <p className="text-stone-500 mt-1 font-mono text-[11px]">
              GPS: {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
            </p>
          </div>

          {/* Mandi Destination */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800">
                2. Market Destination
              </span>
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {market.verificationStatus}
              </span>
            </div>
            <h4 className="font-bold text-stone-900 text-sm">
              {market.name}
            </h4>
            <p className="text-stone-600 mt-0.5">
              {market.city}, {market.state} • ~{market.roadDistanceKm || Math.round(market.distanceKm * 1.2)} km road
            </p>
            <p className="text-[11px] text-emerald-800 font-semibold mt-1">
              Authorized Buyer: {market.buyer.name} ({market.buyer.type})
            </p>
          </div>
        </div>

        {/* Crop Specification & Grade Table */}
        <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
          <div className="bg-stone-100 px-4 py-2 font-bold text-stone-700 flex justify-between">
            <span>Crop Lot Specifications</span>
            <span>Quality Verification</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white">
            <div>
              <span className="text-[10px] text-stone-400 block">Commodity</span>
              <span className="font-bold text-stone-900 text-sm">{cropName}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block">Harvest Weight</span>
              <span className="font-bold text-stone-900 text-sm">
                {cropState.quantityValue} {cropState.quantityUnit} ({cropState.normalizedKilograms.toLocaleString()} kg)
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block">Verified Grade</span>
              <span className="font-bold text-emerald-700 text-sm">
                Grade {cropState.qualityGrade || 'B'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 block">Quality Rule</span>
              <span className="font-bold text-stone-900 text-sm">
                {cropState.qualityGrade === 'A' ? '+5% Premium' : cropState.qualityGrade === 'C' ? '-5% Discount' : 'Standard FAQ'}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Settlement Ledger */}
        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
            Financial Ledger & Net Payout
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-600">
                Gross Mandi Value ({ (cropState.normalizedKilograms / 100).toFixed(1) } qtl @ ₹{market.pricePerQuintal + marketResult.priceDeltaPerQuintal}/qtl):
              </span>
              <span className="font-bold text-stone-900">
                ₹{marketResult.grossAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-1 text-red-700 border-b border-stone-200">
              <span>
                Estimated Freight Deduction ({market.roadDistanceKm || Math.round(market.distanceKm * 1.2)} km road):
              </span>
              <span className="font-semibold">
                -₹{marketResult.transportCost.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-1 text-red-700 border-b border-stone-200">
              <span>
                Mandi Cess ({market.marketFeePercent}%) & Hamali Handling:
              </span>
              <span className="font-semibold">
                -₹{(marketResult.marketFeeAmount + marketResult.unloadingFeeAmount).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between pt-3 text-base font-black text-emerald-800">
              <span>{t.netReturn} (Direct Bank/UPI Transfer):</span>
              <span className="text-lg">₹{marketResult.netReturn.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${market.latitude},${market.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow"
          >
            <Navigation className="w-4 h-4 text-amber-300" />
            <span>Open Google Maps Highway Route</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print Slip
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="bg-stone-900 hover:bg-black text-amber-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              New Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
