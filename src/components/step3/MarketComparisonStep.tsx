import React, { useState, useMemo } from 'react';
import {
  CropSelectionState,
  Language,
  LocationData,
  MarketAnalysisResult,
  MarketItem,
} from '../../types/krishi';
import { discoverMarketsForLocation } from '../../data/marketsData';
import { evaluateMarkets } from '../../utils/pricing';
import { TRANSLATIONS } from '../../utils/i18n';
import { GoogleMapView } from '../map/GoogleMapView';
import {
  Star,
  Navigation,
  ExternalLink,
  ShieldCheck,
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  Layers,
  Map as MapIcon,
  Check,
  TrendingUp,
} from 'lucide-react';

interface MarketComparisonStepProps {
  language: Language;
  location: LocationData;
  cropState: CropSelectionState;
  onSelectMarketForDeal: (marketResult: MarketAnalysisResult) => void;
  onBack: () => void;
}

export const MarketComparisonStep: React.FC<MarketComparisonStepProps> = ({
  language,
  location,
  cropState,
  onSelectMarketForDeal,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  // Discover markets based on farmer's location & base modal price of selected crop
  const basePrice = cropState.selectedCrop?.modalPrice || 2320;
  const rawMarkets = useMemo(() => {
    return discoverMarketsForLocation(
      location.latitude,
      location.longitude,
      location.state,
      location.district,
      basePrice
    );
  }, [location, basePrice]);

  // Evaluate net returns deterministically
  const marketResults = useMemo(() => {
    return evaluateMarkets(
      rawMarkets,
      cropState.normalizedKilograms,
      cropState.qualityGrade
    );
  }, [rawMarkets, cropState.normalizedKilograms, cropState.qualityGrade]);

  const activeResult =
    marketResults.find((r) => r.market.id === selectedMarketId) || marketResults[0];

  const cropName =
    cropState.selectedCrop?.localNames[language] ||
    cropState.selectedCrop?.name ||
    cropState.customCropName ||
    'Crop';

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Step Header & Crop Summary Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            {t.stepIndicator} 3 • {t.step3Title}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-outfit">
            Mandi Price & Net Profit Comparison
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Discovering highest net take-home for {cropName} around {location.city || location.district || location.state}
          </p>
        </div>

        {/* Selected Lot Summary Pill */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-2 text-xs flex items-center gap-3">
          <div>
            <span className="text-amber-900 font-bold block">{cropName}</span>
            <span className="text-stone-600">
              {cropState.quantityValue} {cropState.quantityUnit} ({cropState.normalizedKilograms.toLocaleString()} kg)
            </span>
          </div>
          <div className="border-l border-amber-300 pl-3">
            <span className="text-amber-950 font-extrabold block">
              Grade {cropState.qualityGrade || 'B'}
            </span>
            <span className="text-[10px] text-stone-500">
              {cropState.qualityGrade === 'A' ? '+5% Premium' : cropState.qualityGrade === 'C' ? '-5% Discount' : 'Standard Rate'}
            </span>
          </div>
        </div>
      </div>

      {/* View Toggle Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-stone-200/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.listView}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{t.mapView}</span>
          </button>
        </div>

        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          Ranked by highest estimated take-home profit after all transport deductions
        </span>
      </div>

      {/* Main View: List or Map */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-[480px]">
            <GoogleMapView
              farmerLocation={location}
              markets={marketResults.map((r) => r.market)}
              selectedMarket={activeResult.market}
              onSelectMarket={(m) => setSelectedMarketId(m.id)}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Selected Mandi Destination
              </span>
              <h3 className="text-base font-bold text-stone-900">
                {activeResult.market.name}
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                {activeResult.market.city}, {activeResult.market.state}
              </p>

              <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-stone-500">Mandi Rate:</span>
                  <span className="font-bold text-stone-900">
                    ₹{activeResult.market.pricePerQuintal + activeResult.priceDeltaPerQuintal} / qtl
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Gross Return:</span>
                  <span className="font-bold text-stone-900">
                    ₹{activeResult.grossAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>- Transport Cost:</span>
                  <span className="font-semibold">
                    -₹{activeResult.transportCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>- Mandi Fee & Cess:</span>
                  <span className="font-semibold">
                    -₹{activeResult.marketFeeAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-extrabold text-emerald-800">
                  <span>{t.netReturn}:</span>
                  <span>₹{activeResult.netReturn.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${activeResult.market.latitude},${activeResult.market.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  Directions
                </a>
                <button
                  type="button"
                  onClick={() => onSelectMarketForDeal(activeResult)}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold py-2 rounded-xl flex items-center justify-center gap-1 shadow"
                >
                  Confirm Deal →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-4">
          {marketResults.map((result, index) => {
            const isBest = result.isBestOption || index === 0;

            return (
              <div
                key={result.market.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all relative ${
                  isBest
                    ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md bg-gradient-to-r from-amber-50/20 via-white to-white'
                    : 'border-stone-200 hover:border-stone-300 shadow-sm'
                }`}
              >
                {/* Best option banner */}
                {isBest && (
                  <div className="inline-flex items-center gap-1 bg-amber-500 text-stone-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-stone-950" />
                    {t.bestOptionBadge}
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Market Information */}
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {result.market.marketType}
                      </span>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {result.market.verificationStatus}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-stone-900 mt-1">
                      {result.market.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {result.market.district}, {result.market.state}
                    </p>

                    <div className="mt-2 text-xs text-stone-600 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold">
                        <Navigation className="w-3 h-3 text-emerald-700" />
                        {result.market.roadDistanceKm || Math.round(result.market.distanceKm * 1.2)} km road
                      </span>
                      <span>•</span>
                      <span>~{result.market.travelTimeHours || 1.5} hrs travel</span>
                    </div>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="lg:col-span-5 bg-stone-50 rounded-xl p-3 border border-stone-200 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Mandi Rate
                      </span>
                      <span className="text-sm font-extrabold text-stone-900">
                        ₹{result.market.pricePerQuintal + result.priceDeltaPerQuintal}
                      </span>
                      <span className="text-[10px] text-stone-500 block">per quintal</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Transport
                      </span>
                      <span className="text-sm font-extrabold text-red-700">
                        -₹{result.transportCost.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-500 block">deduction</span>
                    </div>

                    <div className="border-l border-stone-200 pl-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                        Net Take-Home
                      </span>
                      <span className="text-base font-black text-emerald-800">
                        ₹{result.netReturn.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        ₹{result.netPricePerQuintal}/qtl net
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:col-span-3 flex sm:flex-col gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => onSelectMarketForDeal(result)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                        isBest
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-stone-900 hover:bg-black text-white'
                      }`}
                    >
                      <span>Choose Mandi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${result.market.latitude},${result.market.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center py-2 px-3 border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3 h-3 text-emerald-600" />
                      <span>{t.getDirections}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 border border-stone-300 text-stone-700 font-bold rounded-xl text-xs hover:bg-stone-100 transition-colors"
        >
          {t.backToCrops}
        </button>

        <button
          type="button"
          onClick={() => onSelectMarketForDeal(marketResults[0])}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
        >
          <span>Continue with Top Option (₹{marketResults[0]?.netReturn.toLocaleString()}) →</span>
        </button>
      </div>
    </div>
  );
};
