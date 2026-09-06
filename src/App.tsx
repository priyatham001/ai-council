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

export const App: React.FC = () => {
  // Global Language state (English, Hindi, Marathi, Telugu)
  const [language, setLanguage] = useState<Language>('en');

  // Step Navigation: 1 (Location) -> 2 (Crop Details) -> 3 (Market Comparison) -> 4 (Deal Summary)
  const [currentStep, setCurrentStep] = useState<number>(2); // Start directly on Step 2 as requested!

  // Location State (Default: Bhimavaram, West Godavari, AP — dynamically changeable to any location in India)
  const [location, setLocation] = useState<LocationData>({
    latitude: 16.5449,
    longitude: 81.5212,
    country: 'India',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    city: 'Bhimavaram',
    formattedAddress: 'Bhimavaram, West Godavari, Andhra Pradesh, India',
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
    qualityGrade: 'B',
    qualitySource: 'manual',
    qualityConfirmed: true,
    aiAssessment: null,
  });

  // Step 3 Selected Market Result for Step 4 Deal Slip
  const [selectedMarketResult, setSelectedMarketResult] = useState<MarketAnalysisResult | null>(null);

  // Hard Gate validation check
  const isCropValid =
    Boolean(cropState.selectedCrop && cropState.selectedCrop.id !== 'other_custom') ||
    Boolean(cropState.customCropName.trim().length > 0);

  const isQuantityValid =
    typeof cropState.quantityValue === 'number' && cropState.quantityValue > 0;

  const isQualityValid =
    Boolean(cropState.qualityGrade) && cropState.qualityConfirmed;

  const canNavigateToStep3 = isCropValid && isQuantityValid && isQualityValid;

  const handleUpdateCropState = (newState: Partial<CropSelectionState>) => {
    setCropState((prev) => ({
      ...prev,
      ...newState,
    }));
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
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Persistent Header with Language & Location controls */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        location={location}
        onChangeLocationClick={() => setCurrentStep(1)}
        canNavigateToStep3={canNavigateToStep3}
      />

      {/* Main Flow Pages */}
      <main className="flex-1">
        {currentStep === 1 && (
          <LocationSelector
            language={language}
            currentLocation={location}
            onSelectLocation={(newLoc) => {
              setLocation(newLoc);
              setCurrentStep(2);
            }}
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
          />
        )}
      </main>

      {/* Simple Farmer-First Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-stone-300">
            🌾 KrishiSetu • Farmer Crop to Market Intelligence Platform
          </p>
          <p className="text-[11px] text-stone-500 max-w-2xl mx-auto">
            Providing transparent mandi price discovery, deterministic quality grade adjustments, and route optimization across India.
            AI quality assessments are surface estimates and do not replace certified physical laboratory testing.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
