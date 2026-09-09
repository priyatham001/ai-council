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

  // Clear selectedMarketId and old rankings immediately on location change (ZERO stale markets)
  React.useEffect(() => {
    setSelectedMarketId(null);
  }, [location.latitude, location.longitude, location.district, location.state]);

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
  }, [location.latitude, location.longitude, location.state, location.district, basePrice]);

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
      {/* Visual Agricultural Discovery Journey Ribbon */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-amber-950 text-white rounded-2xl p-4 shadow-md border border-emerald-500/30">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-stone-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
              LIVE MANDI ARBITRAGE
            </span>
            <span className="text-stone-300">Agricultural Route Intelligence</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300">
            <span className="text-amber-400">🚜 YOUR FARM ({location.city || location.district || 'Origin'})</span>
            <span>→</span>
            <span className="text-white">🌾 Regional Mandis</span>
            <span>→</span>
            <span className="text-sky-300">📊 Net Realization</span>
            <span>→</span>
            <span className="text-emerald-400 font-black">💰 Best Deal Lock</span>
          </div>
        </div>
      </div>

      {/* Step Header & Crop Summary Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1">
            {t.stepIndicator} 3 • {t.step3Title}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-outfit">
            Mandi Price & Net Profit Comparison
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Discovering highest net take-home for {cropName} around {location.city || location.district || location.state}
          </p>
        </div>

        {/* Selected Lot Summary Pill */}
        <div className="bg-amber-50 dark:bg-stone-900 border border-amber-300 dark:border-amber-600/60 rounded-xl px-4 py-2.5 text-xs flex items-center gap-3 shadow-xs">
          <div>
            <span className="text-amber-900 dark:text-amber-300 font-extrabold block text-sm">{cropName}</span>
            <span className="text-stone-600 dark:text-stone-400">
              {cropState.quantityValue} {cropState.quantityUnit} ({cropState.normalizedKilograms.toLocaleString()} kg)
            </span>
          </div>
          <div className="border-l border-amber-300 dark:border-stone-700 pl-3">
            <span className="text-amber-950 dark:text-amber-400 font-extrabold block">
              Grade {cropState.qualityGrade || 'B'}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
              {cropState.qualityGrade === 'A' ? '+5% Premium' : cropState.qualityGrade === 'C' ? '-5% Discount' : 'Standard Rate'}
            </span>
          </div>
        </div>
      </div>

      {/* View Toggle Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-stone-200/80 dark:bg-stone-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
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
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{t.mapView}</span>
          </button>
        </div>

        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:inline">
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
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm transition-colors">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Selected Mandi Destination
              </span>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                {activeResult.market.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                {activeResult.market.city}, {activeResult.market.state}
              </p>

              <div className="space-y-2 text-xs border-t border-stone-100 dark:border-stone-800 pt-3">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Mandi Rate:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    ₹{activeResult.market.pricePerQuintal + activeResult.priceDeltaPerQuintal} / qtl
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Gross Return:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    ₹{activeResult.grossAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-red-700 dark:text-red-400">
                  <span>- Transport Cost:</span>
                  <span className="font-semibold">
                    -₹{activeResult.transportCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-red-700 dark:text-red-400">
                  <span>- Mandi Fee & Cess:</span>
                  <span className="font-semibold">
                    -₹{activeResult.marketFeeAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-200 dark:border-stone-800 pt-2 text-sm font-extrabold text-emerald-800 dark:text-emerald-400">
                  <span>{t.netReturn}:</span>
                  <span>₹{activeResult.netReturn.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${activeResult.market.latitude},${activeResult.market.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  Directions
                </a>
                <button
                  type="button"
                  onClick={() => onSelectMarketForDeal(activeResult)}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold py-2 rounded-xl flex items-center justify-center gap-1 shadow cursor-pointer"
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
                className={`bg-white dark:bg-stone-900 rounded-2xl border p-4 sm:p-5 transition-all relative ${
                  isBest
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg bg-gradient-to-r from-amber-50/40 via-white to-emerald-50/20 dark:from-stone-900 dark:via-stone-900 dark:to-emerald-950/30'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm'
                }`}
              >
                {/* Best option banner */}
                {isBest && (
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-sm animate-pulse">
                    <Star className="w-3.5 h-3.5 fill-stone-950" />
                    <span>HIGHEST NET PAYOUT MANDI</span>
                    <span className="text-[10px] bg-stone-950 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Market Information */}
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {result.market.marketType}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {result.market.verificationStatus}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white mt-1">
                      {result.market.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {result.market.district}, {result.market.state}
                    </p>

                    <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                        <Navigation className="w-3 h-3" />
                        {result.market.roadDistanceKm || Math.round(result.market.distanceKm * 1.2)} km road
                      </span>
                      <span>•</span>
                      <span>~{result.market.travelTimeHours || 1.5} hrs travel</span>
                    </div>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="lg:col-span-5 bg-stone-50 dark:bg-stone-800/80 rounded-xl p-3 border border-stone-200 dark:border-stone-700 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-400 block">
                        Mandi Rate
                      </span>
                      <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                        ₹{result.market.pricePerQuintal + result.priceDeltaPerQuintal}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">per quintal</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-red-500 block">
                        Transport & Cess
                      </span>
                      <span className="text-sm font-extrabold text-red-700 dark:text-red-400">
                        -₹{(result.transportCost + result.marketFeeAmount).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">deductions</span>
                    </div>

                    <div className="border-l border-stone-200 dark:border-stone-700 pl-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                        Net Take-Home
                      </span>
                      <span className="text-base font-black text-emerald-800 dark:text-emerald-400">
                        ₹{result.netReturn.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-mono">
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
                          : 'bg-stone-900 hover:bg-black dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <span>Lock In Deal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${result.market.latitude},${result.market.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center py-2 px-3 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Navigation className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>🗺️ Open in Google Maps</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          {t.backToCrops}
        </button>

        <button
          type="button"
          onClick={() => onSelectMarketForDeal(marketResults[0])}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow cursor-pointer hover:scale-105 transition-all"
        >
          <span>Continue with Top Option (₹{marketResults[0]?.netReturn.toLocaleString()}) →</span>
        </button>
      </div>
    </div>
  );
};
