import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  DollarSign,
  MapPin,
  Truck,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  CheckCircle2,
  Phone,
  RotateCcw,
} from 'lucide-react';
import {
  CropSelectionState,
  Language,
  LocationData,
  MarketAnalysisResult,
} from './types/krishi';
import { CROP_DATABASE } from './data/cropsData';
import { Header } from './components/common/Header';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { GoogleMapsProvider } from './components/map/GoogleMapsProvider';
import { KrishiSetuAI } from './components/ai/KrishiSetuAI';
import { PlatformOverview } from './components/public/PlatformOverview';
import { LotsPage } from './agrilink/pages/farmer/LotsPage';
import { OffersPage } from './agrilink/pages/farmer/OffersPage';
import { LogisticsPage } from './agrilink/pages/farmer/LogisticsPage';
import { NationalMarketMap } from './agrilink/components/common/NationalMarketMap';
import { FarmerGuidedFlow } from './components/farmer/FarmerGuidedFlow';

export const KrishiWorkflow: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Global Language state — synced with LanguageContext (single source of truth)
  const { language, setLanguage } = useLanguage();

  // Dark / Earth Mode state — synced with ThemeContext (single source of truth)
  const { isDark: darkMode, toggleTheme } = useTheme();

  // View state: 'landing' (Platform Overview) vs 'workflow' (Farm Steps 1-4)
  const [activeView, setActiveView] = useState<'landing' | 'workflow'>('workflow');

  // Farmer Portal Tabs: 'journey' (Guided Village->Crop->Markets) | 'lots' | 'offers' | 'map' | 'logistics'
  const initialTab = (searchParams.get('tab') as any) || 'journey';
  const [farmerTab, setFarmerTab] = useState<'journey' | 'lots' | 'offers' | 'map' | 'logistics'>(
    ['journey', 'lots', 'offers', 'map', 'logistics'].includes(initialTab) ? initialTab : 'journey'
  );

  const handleToggleDarkMode = toggleTheme;

  // Step Navigation: 1 (Location) -> 2 (Crop Details) -> 3 (Market Comparison) -> 4 (Deal Summary)
  // If location was already confirmed in onboarding, default to step 2 (Crop Details)
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedLoc = localStorage.getItem('krishi_location');
    return savedLoc ? 2 : 1;
  });

  // Location State (Default: Kadapa, Andhra Pradesh, with fallback from localStorage)
  const [location, setLocation] = useState<LocationData>(() => {
    const saved = localStorage.getItem('krishi_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      latitude: 14.4673,
      longitude: 78.8242,
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      city: 'Kadapa',
      town: 'Kadapa',
      formattedAddress: 'Kadapa, YSR Kadapa District, Andhra Pradesh, India',
      source: 'search',
    };
  });

  // Step 2 Crop Selection State
  const defaultPaddyCrop = CROP_DATABASE.find((c) => c.id === 'paddy') || CROP_DATABASE[0];
  const [cropState, setCropState] = useState<CropSelectionState>({
    selectedCrop: defaultPaddyCrop,
    customCropName: '',
    quantityValue: 10,
    quantityUnit: 'quintal',
    normalizedKilograms: 1000, // 10 quintals = 1,000 kg
    cropPhoto: null,
    qualityGrade: null, // Farmer must inspect & confirm grade
    qualitySource: null,
    qualityConfirmed: false,
    aiAssessment: null,
  });

  // Step 3 Selected Market Result for Step 4 Deal Slip
  const [selectedMarketResult, setSelectedMarketResult] = useState<MarketAnalysisResult | null>(null);

  // Check URL crop parameter if present
  useEffect(() => {
    const urlCrop = searchParams.get('crop');
    if (urlCrop) {
      const match = CROP_DATABASE.find(
        (c) => c.name.toLowerCase().includes(urlCrop.toLowerCase()) || urlCrop.toLowerCase().includes(c.id)
      );
      if (match) {
        setCropState((prev) => ({
          ...prev,
          selectedCrop: match,
        }));
      }
    }
  }, [searchParams]);

  // Hard Gate validation check (Crop + Quantity + Mandatory Photo + Confirmed Quality)
  const isCropValid =
    Boolean(cropState.selectedCrop && cropState.selectedCrop.id !== 'other_custom') ||
    Boolean(cropState.customCropName.trim().length > 0);

  const isQuantityValid =
    typeof cropState.quantityValue === 'number' && cropState.quantityValue > 0;

  const isPhotoValid = Boolean(cropState.cropPhoto || cropState.aiAssessment?.imageUrl);

  const isQualityValid =
    Boolean(cropState.qualityGrade) && cropState.qualityConfirmed;

  const canNavigateToStep3 = isCropValid && isQuantityValid && isPhotoValid && isQualityValid;

  const handleUpdateCropState = (newState: Partial<CropSelectionState>) => {
    setCropState((prev) => ({
      ...prev,
      ...newState,
    }));
  };

  const handleSelectLocation = (newLoc: LocationData) => {
    setLocation(newLoc);
    setSelectedMarketResult(null); // Reset stale market deal selection
    setCurrentStep(2);
  };

  const handleStepClick = (targetStep: number) => {
    setFarmerTab('journey');
    if (targetStep === 3 && !canNavigateToStep3) {
      // Hard gate prevents reaching Step 3 if incomplete
      setCurrentStep(2);
      return;
    }
    if (targetStep === 4 && !selectedMarketResult) {
      setCurrentStep(3);
      return;
    }
    setCurrentStep(targetStep);
  };

  const handleTabChange = (newTab: 'journey' | 'lots' | 'offers' | 'map' | 'logistics') => {
    setFarmerTab(newTab);
    setActiveView('workflow');
    setSearchParams({ tab: newTab });
  };

  return (
    <GoogleMapsProvider>
      <div
        className={`min-h-screen ${
          darkMode ? 'dark bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'
        } flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans transition-colors duration-200`}
      >
        {/* 1. Persistent Header with Brand, Language & Location controls */}
        <Header
          language={language}
          onLanguageChange={setLanguage}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          location={location}
          onChangeLocationClick={() => {
            setActiveView('workflow');
            setFarmerTab('journey');
            setCurrentStep(1);
          }}
          canNavigateToStep3={canNavigateToStep3}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          activeView={activeView}
          onSelectView={setActiveView}
        />

        {/* 2. Farmer Portal Navigation Tabs (Unified Marketplace + Crop Analysis) */}
        {activeView === 'workflow' && (
          <div className="bg-emerald-900/90 border-b border-emerald-800 px-4 sm:px-6 shadow-md sticky top-[68px] z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold">
              <div className="flex items-center gap-2">
                {/* TAB 1: GUIDED SELL JOURNEY */}
                <button
                  type="button"
                  onClick={() => handleTabChange('journey')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    farmerTab === 'journey'
                      ? 'bg-emerald-500 text-stone-950 shadow-sm font-black'
                      : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <span>🌾</span>
                  <span>Guided Sell Journey</span>
                  <span className="text-[10px] bg-stone-950/30 px-2 py-0.5 rounded-full font-mono">
                    Step {currentStep}/4
                  </span>
                </button>

                {/* TAB 2: MY DIGITAL LOTS */}
                <button
                  type="button"
                  onClick={() => handleTabChange('lots')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    farmerTab === 'lots'
                      ? 'bg-emerald-500 text-stone-950 shadow-sm font-black'
                      : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>My Crop Lots</span>
                </button>

                {/* TAB 3: BUYER OFFERS & BIDS */}
                <button
                  type="button"
                  onClick={() => handleTabChange('offers')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    farmerTab === 'offers'
                      ? 'bg-emerald-500 text-stone-950 shadow-sm font-black'
                      : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Buyer Offers & Bids</span>
                </button>

                {/* TAB 4: NATIONAL MARKET MAP */}
                <button
                  type="button"
                  onClick={() => handleTabChange('map')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    farmerTab === 'map'
                      ? 'bg-emerald-500 text-stone-950 shadow-sm font-black'
                      : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Pan-India Mandi Map</span>
                </button>

                {/* TAB 5: LOGISTICS & STORAGE */}
                <button
                  type="button"
                  onClick={() => handleTabChange('logistics')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    farmerTab === 'logistics'
                      ? 'bg-emerald-500 text-stone-950 shadow-sm font-black'
                      : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Logistics & Freight</span>
                </button>
              </div>

              {/* Quick switch to Buyer portal */}
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/buyers"
                  className="text-[11px] font-bold text-amber-300 hover:text-white px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center gap-1.5 transition-colors"
                >
                  <span>🏪</span>
                  <span>Buyer Procurement Portal →</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 3. Main Content Views */}
        <main className="flex-1">
          {activeView === 'landing' ? (
            <PlatformOverview
              language={language}
              onStartWorkflow={(step = 2) => {
                setActiveView('workflow');
                setFarmerTab('journey');
                setCurrentStep(step);
              }}
            />
          ) : farmerTab === 'lots' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <LotsPage />
            </div>
          ) : farmerTab === 'offers' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <OffersPage />
            </div>
          ) : farmerTab === 'map' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <NationalMarketMap
                farmerState={location.state}
                farmerDistrict={location.district}
              />
            </div>
          ) : farmerTab === 'logistics' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <LogisticsPage />
            </div>
          ) : (
            /* COMPREHENSIVE 7-STEP FARMER GUIDED EXPERIENCE */
            <FarmerGuidedFlow
              location={location}
              language={language}
              onChangeLocationClick={() => {
                const saved = localStorage.getItem('krishi_location');
                if (saved) {
                  localStorage.removeItem('krishi_location');
                }
                navigate('/onboarding');
              }}
              onLanguageChange={setLanguage}
            />
          )}
        </main>

        {/* 4. Farmer-First Footer: AgriConnect Marketplace */}
        <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">🌾</span>
              <span className="font-extrabold text-stone-200 text-sm font-outfit">
                AgriConnect
              </span>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-bold">
                Marketplace Linkage
              </span>
            </div>
            <p className="text-emerald-400 font-medium text-xs">
              Direct Farm-to-Buyer Marketplace Linkage Platform
            </p>
            <p className="text-[11px] text-stone-500 max-w-2xl mx-auto leading-relaxed">
              Transparent mandi price discovery, AGMARK quality grading, net realization calculation, and digital marketplace listings connecting Indian farmers directly with buyers.
            </p>
            <p className="text-[10px] text-stone-600">
              © {new Date().getFullYear()} AgriConnect • Direct Farmgate Linkage Platform
            </p>
          </div>
        </footer>

        {/* 5. Floating KrishiSetu AI Voice & Chat Assistant */}
        <KrishiSetuAI
          language={language}
          cropName={cropState.selectedCrop?.name}
          userLocation={{
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.district || location.city || location.state,
          }}
        />
      </div>
    </GoogleMapsProvider>
  );
};

export default KrishiWorkflow;
