import React, { useState } from 'react';
import {
  CropSelectionState,
  Language,
  LocationData,
  MarketAnalysisResult,
} from './types/krishi';
import { CROP_DATABASE } from './data/cropsData';
import { Header } from './components/common/Header';
import { LocationSelector } from './components/step1/LocationSelector';
import { CropDetailsStep } from './components/step2/CropDetailsStep';
import { MarketComparisonStep } from './components/step3/MarketComparisonStep';
import { DealSummaryStep } from './components/step4/DealSummaryStep';
import { GoogleMapsProvider } from './components/map/GoogleMapsProvider';
import { KisanAIChatbot } from './components/chat/KisanAIChatbot';
import { PlatformOverview } from './components/public/PlatformOverview';

export const App: React.FC = () => {
  // Global Language state (English, Hindi, Marathi, Telugu)
  const [language, setLanguage] = useState<Language>('en');

  // Dark / Earth Mode state
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // View state: 'landing' (Platform Overview) vs 'workflow' (Farm Steps 1-4)
  const [activeView, setActiveView] = useState<'landing' | 'workflow'>('workflow');

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Step Navigation: 1 (Location) -> 2 (Crop Details) -> 3 (Market Comparison) -> 4 (Deal Summary)
  const [currentStep, setCurrentStep] = useState<number>(2); // Start directly on Step 2 as requested!

  // Location State (Default: Kadapa, YSR District, Andhra Pradesh — dynamically discovered across India)
  const [location, setLocation] = useState<LocationData>({
    latitude: 14.4673,
    longitude: 78.8242,
    country: 'India',
    state: 'Andhra Pradesh',
    district: 'YSR Kadapa',
    city: 'Kadapa',
    town: 'Kadapa',
    formattedAddress: 'Kadapa (YSR District), Andhra Pradesh, India',
    source: 'search',
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

  return (
    <GoogleMapsProvider>
      <div className={`min-h-screen ${darkMode ? 'dark bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'} flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans transition-colors duration-200`}>
        {/* Persistent Header with Language & Location controls */}
        <Header
          language={language}
          onLanguageChange={setLanguage}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          location={location}
          onChangeLocationClick={() => {
            setActiveView('workflow');
            setCurrentStep(1);
          }}
          canNavigateToStep3={canNavigateToStep3}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          activeView={activeView}
          onSelectView={setActiveView}
        />

        {/* Main Flow Pages */}
        <main className="flex-1">
          {activeView === 'landing' ? (
            <PlatformOverview
              language={language}
              onStartWorkflow={(step = 2) => {
                setActiveView('workflow');
                setCurrentStep(step);
              }}
            />
          ) : (
            <>
              {currentStep === 1 && (
                <LocationSelector
                  language={language}
                  currentLocation={location}
                  onSelectLocation={handleSelectLocation}
                  onContinue={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <CropDetailsStep
                  language={language}
                  cropState={cropState}
                  onUpdateCropState={handleUpdateCropState}
                  onContinue={() => {
                    if (canNavigateToStep3) {
                      setCurrentStep(3);
                    }
                  }}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <MarketComparisonStep
                  language={language}
                  location={location}
                  cropState={cropState}
                  onSelectMarketForDeal={(mktResult) => {
                    setSelectedMarketResult(mktResult);
                    setCurrentStep(4);
                  }}
                  onBack={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && selectedMarketResult && (
                <DealSummaryStep
                  language={language}
                  location={location}
                  cropState={cropState}
                  marketResult={selectedMarketResult}
                  onRestart={() => {
                    setCurrentStep(2);
                  }}
                  onBack={() => setCurrentStep(3)}
                  onChangeLocation={() => setCurrentStep(1)}
                  onRecheckCrop={() => setCurrentStep(2)}
                  onSelectMarket={(mktResult) => setSelectedMarketResult(mktResult)}
                />
              )}
            </>
          )}
        </main>

        {/* Farmer-First Footer: MahaKrishi AI by IDEA FORGE */}
        <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">🌾</span>
              <span className="font-extrabold text-stone-200 text-sm font-outfit">
                MahaKrishi AI
              </span>
              <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                BY IDEA FORGE
              </span>
            </div>
            <p className="text-amber-400 font-medium text-xs">
              Forge a Smarter Future for Every Farmer.
            </p>
            <p className="text-[11px] text-stone-500 max-w-2xl mx-auto leading-relaxed">
              Providing transparent mandi price discovery, deterministic AGMARK quality grade adjustments, road freight estimation, and digital gate passes across Indian agricultural markets.
            </p>
            <p className="text-[10px] text-stone-600">
              © {new Date().getFullYear()} MahaKrishi AI • IDEA FORGE. All Rights Reserved.
            </p>
          </div>
        </footer>
        {/* Floating Kisan AI Chatbot */}
        <KisanAIChatbot
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

export default App;
