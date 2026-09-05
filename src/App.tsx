import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Tractor,
  TrendingUp,
  MapPin,
  RefreshCw,
  Truck,
  Check
} from 'lucide-react';
import {
  FarmerLocation,
  WeightUnit,
  VehicleTypeId,
  MarketCalculationResult,
  FarmerSearchHistory,
  Language,
  MarketComparisonItem,
  CropQuality,
  BuyerProfile
} from './types';
import { Navbar } from './components/Navbar';
import { LocationCard } from './components/LocationCard';
import { CropQuantityCard } from './components/CropQuantityCard';
import { TransportConfigCard } from './components/TransportConfigCard';
import { RecommendationCard } from './components/RecommendationCard';
import { MarketComparisonTable } from './components/MarketComparisonTable';
import { MarketComparisonCharts } from './components/MarketComparisonCharts';
import { MarketMapVisualizer } from './components/MarketMapVisualizer';
import { AIInsightsCard } from './components/AIInsightsCard';
import { PriceDiscoveryView } from './components/PriceDiscoveryView';
import { PriceTrendsView } from './components/PriceTrendsView';
import { NearbyBuyersView } from './components/NearbyBuyersView';
import { TransportView } from './components/TransportView';
import { HistoryView } from './components/HistoryView';
import { AdminPanelView } from './components/AdminPanelView';
import { HelpView } from './components/HelpView';
import { LanguageScreen } from './components/LanguageScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { BuyerOfferModal } from './components/BuyerOfferModal';
import {
  CROPS_CATALOG,
  convertToQuintals,
  rankMarketsForFarmer,
  generateDeterministicAIInsight
} from './lib/krishi-data-client';
import { getTranslation } from './lib/translations';

export default function App() {
  const [currentTab, setCurrentTab] = useState('find');
  const [language, setLanguage] = useState<Language>('en');
  const [isDemoMode, setIsDemoMode] = useState(true);

  // First-run experience states
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean>(true);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(true);
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);

  // Form State
  const [farmerLocation, setFarmerLocation] = useState<FarmerLocation>({
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    villageOrTown: 'Bhimavaram',
    lat: 16.5449,
    lng: 81.5212,
    isGps: false,
    isDemo: true
  });

  const [selectedCropId, setSelectedCropId] = useState('paddy');
  const [customCropName, setCustomCropName] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState<WeightUnit>('quintal');
  const [vehicleType, setVehicleType] = useState<VehicleTypeId>('mini_truck');
  const [customRatePerKm, setCustomRatePerKm] = useState(22);
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // Quality & Grading State
  const [quality, setQuality] = useState<CropQuality>({
    grade: 'Grade B',
    moisturePct: 12,
    packagingType: 'Gunny Bags (50kg)',
    priceModifierPct: 0
  });

  // Direct offer modal state
  const [offerTarget, setOfferTarget] = useState<{
    buyer?: BuyerProfile;
    market?: MarketComparisonItem;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Results State
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcStage, setCalcStage] = useState(0);
  const [calculationResult, setCalculationResult] = useState<MarketCalculationResult | null>(null);
  const [historyList, setHistoryList] = useState<FarmerSearchHistory[]>([]);

  const t = getTranslation(language);

  // Check initial first-run state from localStorage
  useEffect(() => {
    try {
      const storedLangSelected = localStorage.getItem('krishisetu_language_selected');
      const storedLang = localStorage.getItem('krishisetu_language');
      const storedOnboarded = localStorage.getItem('krishisetu_onboarded');

      if (!storedLangSelected) {
        setHasSelectedLanguage(false);
      } else if (storedLang) {
        setLanguage(storedLang as Language);
      }

      if (storedLangSelected && !storedOnboarded) {
        setHasOnboarded(false);
      }
    } catch (e) {
      // LocalStorage access fallback
    }

    runCalculation(false);
    fetchHistory();
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setHasSelectedLanguage(true);
    try {
      localStorage.setItem('krishisetu_language', lang);
      localStorage.setItem('krishisetu_language_selected', 'true');
    } catch (e) {}

    // If not onboarded yet, show onboarding
    const storedOnboarded = localStorage.getItem('krishisetu_onboarded');
    if (!storedOnboarded) {
      setHasOnboarded(false);
    }
  };

  const handleOnboardingComplete = (location: FarmerLocation, _name?: string) => {
    setFarmerLocation(location);
    setHasOnboarded(true);
    try {
      localStorage.setItem('krishisetu_onboarded', 'true');
    } catch (e) {}
    runCalculation(true);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        if (data.history) setHistoryList(data.history);
      }
    } catch (err) {
      console.warn('Could not fetch server history, using local state:', err);
    }
  };

  const runCalculation = async (showProgress = true) => {
    if (showProgress) {
      setIsCalculating(true);
      setCalcStage(1);
      await new Promise((r) => setTimeout(r, 200));
      setCalcStage(2);
      await new Promise((r) => setTimeout(r, 200));
      setCalcStage(3);
      await new Promise((r) => setTimeout(r, 200));
    }

    try {
      // 1. First attempt to call the server endpoint
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerLocation,
          cropId: selectedCropId,
          quantity,
          unit,
          vehicleType,
          customRatePerKm,
          isRoundTrip,
          quality
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCalculationResult(data);
        fetchHistory();
      } else {
        // Fallback to client-side engine if server route has issue
        runClientFallback();
      }
    } catch (err) {
      console.warn('API error, falling back to local client engine:', err);
      runClientFallback();
    } finally {
      setIsCalculating(false);
      setCalcStage(0);
    }
  };

  const runClientFallback = () => {
    const qtl = convertToQuintals(quantity, unit);
    const crop =
      CROPS_CATALOG.find((c) => c.id === selectedCropId) || CROPS_CATALOG[0];

    const calculation = rankMarketsForFarmer(
      farmerLocation,
      selectedCropId,
      quantity,
      unit,
      vehicleType,
      isRoundTrip,
      customRatePerKm,
      quality
    );

    const aiInsight = generateDeterministicAIInsight(
      crop,
      qtl,
      calculation.rankedMarkets,
      vehicleType,
      isRoundTrip,
      quality
    );

    const result: MarketCalculationResult = {
      crop,
      quantityInQuintals: qtl,
      rankedMarkets: calculation.rankedMarkets,
      recommendedMarket: calculation.recommendedMarket,
      aiInsight
    };

    setCalculationResult(result);
  };

  // Demo Scenario Handler (One-click quick demo for reviewers)
  const handleLoadDemoScenario = () => {
    setFarmerLocation({
      state: 'Andhra Pradesh',
      district: 'West Godavari',
      villageOrTown: 'Bhimavaram',
      lat: 16.5449,
      lng: 81.5212,
      isGps: false,
      isDemo: true
    });
    setSelectedCropId('paddy');
    setQuantity(10);
    setUnit('quintal');
    setVehicleType('mini_truck');
    setCustomRatePerKm(22);
    setIsRoundTrip(false);
    setQuality({
      grade: 'Grade A',
      moisturePct: 11.5,
      packagingType: 'Gunny Bags (50kg)',
      priceModifierPct: 5
    });
    setCurrentTab('find');
    runCalculation(true);
  };

  const handleSelectCropAndMarket = (cropId: string, _marketId: string) => {
    setSelectedCropId(cropId);
    setCurrentTab('find');
    runCalculation(true);
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    setHistoryList((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSelectHistoryItem = (item: FarmerSearchHistory) => {
    const matchedCrop = CROPS_CATALOG.find(
      (c) => c.name.toLowerCase() === item.cropName.toLowerCase()
    );
    if (matchedCrop) setSelectedCropId(matchedCrop.id);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setCurrentTab('find');
    runCalculation(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const stagesText = [
    '',
    'Finding regional APMC mandis within operating radius...',
    'Fetching electronic board rates and calculating road freight...',
    'Ranking markets by estimated net return and synthesizing AI insights...'
  ];

  // 1. First Screen: Language Selection (if not selected)
  if (!hasSelectedLanguage) {
    return (
      <LanguageScreen
        onSelectLanguage={handleLanguageSelect}
        currentLanguage={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Farmer Onboarding Modal if pending */}
      {!hasOnboarded && (
        <OnboardingModal
          language={language}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Language Switcher Modal when requested */}
      {showLanguageModal && (
        <LanguageScreen
          isModal={true}
          currentLanguage={language}
          onSelectLanguage={(lang) => {
            setLanguage(lang);
            try {
              localStorage.setItem('krishisetu_language', lang);
            } catch (e) {}
            setShowLanguageModal(false);
          }}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {/* Direct Buyer / Market Offer Modal */}
      {offerTarget && (
        <BuyerOfferModal
          buyer={offerTarget.buyer}
          market={offerTarget.market}
          cropName={calculationResult?.crop.name || 'Harvest Lot'}
          quantity={quantity}
          unit={unit}
          onClose={() => setOfferTarget(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={(l) => {
          setLanguage(l);
          try {
            localStorage.setItem('krishisetu_language', l);
          } catch (e) {}
        }}
        isDemoMode={isDemoMode}
        onLoadDemoScenario={handleLoadDemoScenario}
        onOpenLanguageModal={() => setShowLanguageModal(true)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-emerald-900 text-white p-4 rounded-2xl shadow-xl border border-emerald-700 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm text-emerald-200">Action Complete</p>
            <p className="mt-0.5 text-emerald-50 leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Primary Discovery Workspace */}
        {currentTab === 'find' && (
          <div className="space-y-8">
            {/* Top Interactive Configuration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Farm Location & Vehicle Logistics (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <LocationCard
                  location={farmerLocation}
                  setLocation={setFarmerLocation}
                  language={language}
                />

                <TransportConfigCard
                  vehicleType={vehicleType}
                  setVehicleType={setVehicleType}
                  customRatePerKm={customRatePerKm}
                  setCustomRatePerKm={setCustomRatePerKm}
                  isRoundTrip={isRoundTrip}
                  setIsRoundTrip={setIsRoundTrip}
                  quantityInQuintals={convertToQuintals(quantity, unit)}
                  language={language}
                />
              </div>

              {/* Right Column: Crop, Quality & Harvest Batch (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <CropQuantityCard
                  selectedCropId={selectedCropId}
                  setSelectedCropId={setSelectedCropId}
                  customCropName={customCropName}
                  setCustomCropName={setCustomCropName}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  unit={unit}
                  setUnit={setUnit}
                  quality={quality}
                  setQuality={setQuality}
                  language={language}
                />

                {/* Primary Action Button */}
                <div className="pt-1">
                  <button
                    onClick={() => runCalculation(true)}
                    disabled={isCalculating}
                    className="w-full py-4 px-6 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-base font-bold shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-75"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{stagesText[calcStage] || 'Calculating...'}</span>
                      </>
                    ) : (
                      <>
                        <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        <span>{t.btnFindBestMarket}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="mt-2 text-center text-[11px] text-gray-500">
                    Calculates road distance, transport freight, quality grade premium, and mandi charges for maximum net pocket return.
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {calculationResult && (
              <div className="space-y-8 pt-4 border-t border-gray-200">
                {/* 1. Star Recommendation Card */}
                <RecommendationCard
                  recommendedMarket={calculationResult.recommendedMarket}
                  cropName={calculationResult.crop.name}
                  quantityInQuintals={calculationResult.quantityInQuintals}
                  language={language}
                  onCompareAgain={() => runCalculation(true)}
                  onContactBuyer={(mkt) => setOfferTarget({ market: mkt })}
                  onGetDirections={(mkt) => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${mkt.lat},${mkt.lng}`;
                    window.open(url, '_blank');
                  }}
                  onViewDetails={(_mkt) => {
                    const el = document.getElementById('comparison-table-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* 2. Visual Comparison Charts */}
                <MarketComparisonCharts
                  markets={calculationResult.rankedMarkets}
                  language={language}
                />

                {/* 3. Ranked Markets Table */}
                <div id="comparison-table-section">
                  <MarketComparisonTable
                    markets={calculationResult.rankedMarkets}
                    quantityInQuintals={calculationResult.quantityInQuintals}
                    language={language}
                    onSelectMarket={(mkt) => setOfferTarget({ market: mkt })}
                  />
                </div>

                {/* 4. Interactive Route & Logistics Map */}
                <MarketMapVisualizer
                  farmerLocation={farmerLocation}
                  markets={calculationResult.rankedMarkets}
                  language={language}
                />

                {/* 5. AI Insights & Multi-Model Synthesis Card */}
                <AIInsightsCard
                  insightResult={calculationResult.aiInsight}
                  language={language}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Market Prices Discovery */}
        {currentTab === 'prices' && (
          <PriceDiscoveryView
            farmerLocation={farmerLocation}
            language={language}
            onSelectCropAndMarket={handleSelectCropAndMarket}
          />
        )}

        {/* Tab 3: Nearby Verified Buyers */}
        {currentTab === 'buyers' && (
          <NearbyBuyersView
            language={language}
            onSelectBuyerCrop={(cropId) => {
              setSelectedCropId(cropId);
              setCurrentTab('find');
              runCalculation(true);
            }}
            onConnectBuyer={(buyer) => {
              setOfferTarget({ buyer });
            }}
          />
        )}

        {/* Tab 4: Farm Logistics & Transporters Linkage */}
        {currentTab === 'transport' && (
          <TransportView language={language} />
        )}

        {/* Tab 5: Historical Price Trends & Forecast */}
        {currentTab === 'trends' && (
          <PriceTrendsView language={language} />
        )}

        {/* Tab 6: AI Insights Full View */}
        {currentTab === 'ai' && calculationResult && (
          <div className="space-y-6">
            <AIInsightsCard
              insightResult={calculationResult.aiInsight}
              language={language}
            />
          </div>
        )}

        {/* Tab 7: Calculation History */}
        {currentTab === 'history' && (
          <HistoryView
            history={historyList}
            language={language}
            onSelectHistoryItem={handleSelectHistoryItem}
            onDeleteHistoryItem={handleDeleteHistory}
          />
        )}

        {/* Tab 8: Admin Panel */}
        {currentTab === 'admin' && (
          <AdminPanelView language={language} />
        )}

        {/* Tab 9: Help & Net Return Transparency Guide */}
        {currentTab === 'help' && (
          <HelpView language={language} />
        )}
      </main>

      {/* Footer with SIH 2026 Problem Statement Attributions */}
      <footer className="bg-white border-t border-gray-200 py-6 text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tractor className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-gray-800">
              Smart Krishi Market (KrishiSetu)
            </span>
            <span>• Smart India Hackathon 2026 (SIH26132)</span>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <button
              onClick={() => setShowLanguageModal(true)}
              className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline underline-offset-2"
            >
              Change Language ({language.toUpperCase()})
            </button>
            <span>•</span>
            <span>Government of Maharashtra Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
