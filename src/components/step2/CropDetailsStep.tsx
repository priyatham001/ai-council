import React, { useState, useRef, useEffect } from 'react';
import {
  CropCategory,
  CropItem,
  CropSelectionState,
  Language,
  QualityGrade,
  WeightUnit,
} from '../../types/krishi';
import { CROP_DATABASE, filterCrops } from '../../data/cropsData';
import { TRANSLATIONS } from '../../utils/i18n';
import { normalizeToKilograms } from '../../utils/pricing';
import { analyzeCropPhoto, generateCropSpecificSampleAnalysis } from '../../services/cropVisionService';
import {
  Search,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Upload,
  Check,
  Info,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ChevronDown,
  X,
} from 'lucide-react';

interface CropDetailsStepProps {
  language: Language;
  cropState: CropSelectionState;
  onUpdateCropState: (newState: Partial<CropSelectionState>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const CropDetailsStep: React.FC<CropDetailsStepProps> = ({
  language,
  cropState,
  onUpdateCropState,
  onContinue,
  onBack,
}) => {
  const t = TRANSLATIONS[language];

  // Category & search state
  const [selectedCategory, setSelectedCategory] = useState<CropCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOtherCropSelected, setIsOtherCropSelected] = useState(
    cropState.selectedCrop?.id === 'other_custom' || Boolean(cropState.customCropName)
  );

  // AI Camera & Modal state
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(cropState.aiAssessment?.imageUrl || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showWhyExpander, setShowWhyExpander] = useState(true);

  // Validation / Hard Gate tracking & scroll anchors
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const cropSectionRef = useRef<HTMLDivElement>(null);
  const quantitySectionRef = useRef<HTMLDivElement>(null);
  const qualitySectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter crops using single reusable function
  const filteredCrops = filterCrops(CROP_DATABASE, selectedCategory, searchQuery);

  // Validation rules
  const isCropValid =
    Boolean(cropState.selectedCrop && cropState.selectedCrop.id !== 'other_custom') ||
    (isOtherCropSelected && cropState.customCropName.trim().length > 0);

  const isQuantityValid =
    typeof cropState.quantityValue === 'number' && cropState.quantityValue > 0;

  const isQualityValid =
    Boolean(cropState.qualityGrade) && cropState.qualityConfirmed;

  const isCompleteAndReady = isCropValid && isQuantityValid && isQualityValid;

  // Handle Crop Selection (invalidates previous quality if crop changed)
  const handleSelectCrop = (crop: CropItem) => {
    setIsOtherCropSelected(false);
    onUpdateCropState({
      selectedCrop: crop,
      customCropName: '',
      // Invalidate previous quality verification if crop changes
      qualityGrade: null,
      qualitySource: null,
      qualityConfirmed: false,
      aiAssessment: null,
    });
    setCapturedImage(null);
  };

  const handleSelectOtherCrop = () => {
    setIsOtherCropSelected(true);
    const customCropItem: CropItem = {
      id: 'other_custom',
      name: cropState.customCropName || 'Other Crop',
      localNames: {
        en: cropState.customCropName || 'Other Crop',
        hi: cropState.customCropName || 'अन्य फसल',
        mr: cropState.customCropName || 'इतर पीक',
        te: cropState.customCropName || 'ఇతర పంట',
      },
      category: 'other',
      icon: '🌱',
      defaultUnit: 'quintal',
      modalPrice: 2500,
      minPrice: 2000,
      maxPrice: 3200,
      qualityProfile: {
        visualTraits: ['Color brightness', 'Uniform size', 'Intact surface', 'Freedom from foreign matter'],
        defectIndicators: ['Discoloration', 'Insect holes', 'Fungal mold', 'Physical damage'],
        physicalLimits: ['Exact moisture % requires moisture meter'],
      },
    };

    onUpdateCropState({
      selectedCrop: customCropItem,
      qualityGrade: null,
      qualitySource: null,
      qualityConfirmed: false,
      aiAssessment: null,
    });
  };

  const handleCustomCropNameChange = (name: string) => {
    onUpdateCropState({
      customCropName: name,
      selectedCrop: {
        id: 'other_custom',
        name: name || 'Other Crop',
        localNames: {
          en: name || 'Other Crop',
          hi: name || 'अन्य फसल',
          mr: name || 'इतर पीक',
          te: name || 'ఇతర పంట',
        },
        category: 'other',
        icon: '🌱',
        defaultUnit: 'quintal',
        modalPrice: 2500,
        minPrice: 2000,
        maxPrice: 3200,
        qualityProfile: {
          visualTraits: ['Color brightness', 'Uniform size', 'Intact surface', 'Clean harvest'],
          defectIndicators: ['Discoloration', 'Insect holes', 'Fungal mold'],
          physicalLimits: ['Exact moisture % requires moisture meter'],
        },
      },
    });
  };

  // Quantity handlers
  const handleQuantityChange = (valStr: string) => {
    const val = parseFloat(valStr);
    if (valStr === '' || isNaN(val)) {
      onUpdateCropState({
        quantityValue: '',
        normalizedKilograms: 0,
      });
    } else {
      const normalized = normalizeToKilograms(val, cropState.quantityUnit);
      onUpdateCropState({
        quantityValue: val,
        normalizedKilograms: normalized,
      });
    }
  };

  const handleUnitChange = (unit: WeightUnit) => {
    const val = typeof cropState.quantityValue === 'number' ? cropState.quantityValue : 0;
    const normalized = normalizeToKilograms(val, unit);
    onUpdateCropState({
      quantityUnit: unit,
      normalizedKilograms: normalized,
    });
  };

  // Manual Quality selection
  const handleSelectManualGrade = (grade: QualityGrade) => {
    onUpdateCropState({
      qualityGrade: grade,
      qualitySource: 'manual',
      qualityConfirmed: true,
    });
  };

  // Hard Gate validation trigger
  const handleAttemptContinue = () => {
    if (isCompleteAndReady) {
      setShowValidationAlert(false);
      onContinue();
      return;
    }

    // Incomplete — trigger hard gate warning & scroll to first missing section
    setShowValidationAlert(true);

    if (!isCropValid) {
      cropSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!isQuantityValid) {
      quantitySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!isQualityValid) {
      qualitySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  };

  // AI Camera Photo Processing
  const handleFileCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result as string;
      setCapturedImage(base64Data);
      setIsCameraModalOpen(true);
      await triggerAIAnalysis(base64Data);
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const triggerAIAnalysis = async (imageData: string) => {
    if (!cropState.selectedCrop) {
      setCameraError(t.pleaseSelectCrop);
      return;
    }

    setCameraError(null);
    setIsAnalyzing(true);

    try {
      const assessment = await analyzeCropPhoto({
        imageFileOrBase64: imageData,
        selectedCrop: cropState.selectedCrop,
      });

      assessment.imageUrl = imageData;

      onUpdateCropState({
        aiAssessment: assessment,
      });
    } catch (err: any) {
      console.warn('AI analysis error, using fallback:', err);
      const fallback = generateCropSpecificSampleAnalysis(cropState.selectedCrop);
      fallback.imageUrl = imageData;
      onUpdateCropState({
        aiAssessment: fallback,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Accept AI suggested grade
  const handleAcceptAIGrade = (grade: QualityGrade) => {
    onUpdateCropState({
      qualityGrade: grade,
      qualitySource: 'ai',
      qualityConfirmed: true,
    });
    setIsCameraModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Title Header */}
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            {t.stepIndicator} 2 • {t.step2Title}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-outfit">
            {t.whatSelling}
          </h2>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs text-stone-500 hover:text-stone-800 font-semibold self-start sm:self-auto"
        >
          {t.backToLocation}
        </button>
      </div>

      {/* HARD GATE VALIDATION ALERT BANNER */}
      {showValidationAlert && !isCompleteAndReady && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 shadow-sm animate-shake">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-900">
                {t.missingFieldsAlert}
              </h4>
              <ul className="text-xs text-red-800 mt-1.5 space-y-1 list-disc list-inside">
                {!isCropValid && <li>{t.pleaseSelectCrop}</li>}
                {!isQuantityValid && <li>{t.pleaseEnterQuantity}</li>}
                {!isQualityValid && <li>{t.pleaseSelectQuality}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: CROP CATEGORY FILTERING & SELECTION */}
      {/* ========================================================================= */}
      <section
        ref={cropSectionRef}
        className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
          showValidationAlert && !isCropValid
            ? 'border-red-500 ring-2 ring-red-400/30'
            : 'border-stone-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                {t.whatSelling}
              </h3>
            </div>
            <p className="text-xs text-stone-500 ml-8">
              Select category or search to instantly filter crops
            </p>
          </div>

          {/* Active selection badge */}
          {cropState.selectedCrop && (
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Selected: {cropState.selectedCrop.localNames[language] || cropState.selectedCrop.name}
              </span>
            </div>
          )}
        </div>

        {/* Category Tabs Bar */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            {t.chooseCategory}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: t.allCrops, icon: '🌾' },
              { id: 'cereals', label: t.cereals, icon: '🌾' },
              { id: 'pulses', label: t.pulses, icon: '🍲' },
              { id: 'vegetables', label: t.vegetables, icon: '🥬' },
              { id: 'fruits', label: t.fruits, icon: '🍎' },
              { id: 'commercial', label: t.commercial, icon: '🌻' },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id && !isOtherCropSelected;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id as CropCategory);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-700/40'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {/* Other Crop button (always available regardless of active category) */}
            <button
              type="button"
              onClick={handleSelectOtherCrop}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isOtherCropSelected
                  ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <span>🌱</span>
              <span>{t.otherCrop}</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar (works synchronously with Category Filter) */}
        {!isOtherCropSelected && (
          <div className="relative mb-5">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchCropsPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Custom Crop Name Input when "Other Crop" is selected */}
        {isOtherCropSelected ? (
          <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 my-2">
            <label className="block text-xs font-bold text-amber-950 mb-1.5">
              {t.enterCustomCropName}
            </label>
            <input
              type="text"
              value={cropState.customCropName}
              onChange={(e) => handleCustomCropNameChange(e.target.value)}
              placeholder={t.customCropPlaceholder}
              autoFocus
              className="w-full max-w-md bg-white border border-amber-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-amber-800 mt-1">
              Your custom crop will be analyzed and compared against modal market benchmarks.
            </p>
          </div>
        ) : (
          /* Structured Crop Grid */
          <div>
            {filteredCrops.length === 0 ? (
              <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <p className="text-stone-700 font-bold text-sm">{t.noCropsFound}</p>
                <p className="text-stone-500 text-xs mt-1">{t.tryAnotherName}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 text-xs text-emerald-700 font-bold underline"
                >
                  Reset filters to All Crops
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredCrops.map((crop) => {
                  const isSelected = cropState.selectedCrop?.id === crop.id && !isOtherCropSelected;

                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => handleSelectCrop(crop)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-2 ring-emerald-500/40'
                          : 'bg-stone-50/50 border-stone-200 hover:border-emerald-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl mb-1">{crop.icon}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                          {crop.localNames[language] || crop.name}
                        </h4>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {crop.category} • ₹{crop.modalPrice}/qtl
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: QUANTITY AND UNIT SELECTION */}
      {/* ========================================================================= */}
      <section
        ref={quantitySectionRef}
        className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
          showValidationAlert && !isQuantityValid
            ? 'border-red-500 ring-2 ring-red-400/30'
            : 'border-stone-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          <h3 className="text-base sm:text-lg font-bold text-stone-900">
            {t.howMuchSelling}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Numeric Input */}
          <div className="sm:col-span-7">
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Quantity value (must be greater than 0)
            </label>
            <input
              type="number"
              min="0.1"
              step="any"
              value={cropState.quantityValue}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder={t.quantityPlaceholder}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-base font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Unit Toggle Buttons */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Weight Unit
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
              {(['quintal', 'tonne', 'kg'] as WeightUnit[]).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => handleUnitChange(unit)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    cropState.quantityUnit === unit
                      ? 'bg-emerald-800 text-white shadow'
                      : 'text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Standardized conversion display */}
        {typeof cropState.quantityValue === 'number' && cropState.quantityValue > 0 && (
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">
              {t.standardizedKg}:
            </span>
            <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {cropState.normalizedKilograms.toLocaleString()} kg ({ (cropState.normalizedKilograms / 100).toFixed(1) } Quintals)
            </span>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: QUALITY ASSESSMENT (MANUAL OR AI CAMERA) */}
      {/* ========================================================================= */}
      <section
        ref={qualitySectionRef}
        className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
          showValidationAlert && !isQualityValid
            ? 'border-red-500 ring-2 ring-red-400/30'
            : 'border-stone-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                {t.whatQuality}
              </h3>
              <p className="text-xs text-stone-500">
                Choose manual grade or use the AI Camera to inspect grain/produce traits
              </p>
            </div>
          </div>

          {/* AI CAMERA TRIGGER BUTTON */}
          <div className="self-start sm:self-auto">
            {/* Hidden file input for native camera capture */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileCapture}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => {
                if (!cropState.selectedCrop) {
                  setShowValidationAlert(true);
                  cropSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  return;
                }
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-extrabold px-4 py-2.5 rounded-xl shadow transition-all text-xs cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{t.checkCropQuality}</span>
              <span className="bg-stone-950 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                AI
              </span>
            </button>
          </div>
        </div>

        {/* ACTIVE AI ASSESSMENT DISPLAY CARD (IF COMPLETED) */}
        {cropState.aiAssessment && (
          <div className="mb-6 bg-stone-50 border-2 border-emerald-600/80 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-extrabold text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {t.qualityAssessment}
                </span>
                {cropState.aiAssessment.isDemo && (
                  <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
                    {t.demoAiResult}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-semibold">
                  {t.confidence}:
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    cropState.aiAssessment.confidenceLevel === 'High'
                      ? 'bg-emerald-100 text-emerald-800'
                      : cropState.aiAssessment.confidenceLevel === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {cropState.aiAssessment.confidenceLevel} Confidence
                </span>
              </div>
            </div>

            {/* Check for Crop Mismatch Warning */}
            {!cropState.aiAssessment.cropMatch && (
              <div className="mb-4 bg-red-50 border border-red-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold">{t.cropDoesNotMatch}</h5>
                  <p className="mt-0.5 text-red-800">{t.cropMismatchDesc}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                    >
                      {t.retakePhoto}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        cropSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-white border border-red-300 text-red-800 font-semibold px-3 py-1 rounded-lg text-xs"
                    >
                      {t.changeCrop}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Assessment Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Photo Thumbnail if available */}
              {capturedImage && (
                <div className="md:col-span-3">
                  <div className="relative rounded-xl overflow-hidden border border-stone-300 aspect-square bg-stone-200">
                    <img
                      src={capturedImage}
                      alt="Crop harvest photo"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1.5 right-1.5 bg-black/75 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> {t.retakePhoto}
                    </button>
                  </div>
                </div>
              )}

              {/* Assessment Breakdown */}
              <div className={capturedImage ? 'md:col-span-9' : 'md:col-span-12'}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs text-stone-500 font-medium">
                    {t.suggestedGrade}:
                  </span>
                  <span className="bg-emerald-800 text-amber-300 font-extrabold text-sm px-3 py-0.5 rounded-lg">
                    Grade {cropState.aiAssessment.suggestedGrade}
                  </span>
                  <span className="text-xs text-stone-500">
                    ({cropState.aiAssessment.suggestedGrade === 'A' ? '+5% Price Premium' : cropState.aiAssessment.suggestedGrade === 'B' ? 'Standard Modal Rate' : '-5% Price Discount'})
                  </span>
                </div>

                {/* What we observed list */}
                <div className="text-xs text-stone-700 mb-3">
                  <span className="font-bold text-stone-900 block mb-1">
                    {t.whatWeObserved}
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-stone-600 pl-1">
                    {cropState.aiAssessment.observations.map((obs, idx) => (
                      <li key={idx}>{obs}</li>
                    ))}
                  </ul>
                </div>

                {/* Limitations and Disclaimer */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.aiVisualEstimate}</span> • {t.notLaboratoryTest}
                  </div>
                </div>

                {/* Grade acceptance buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAcceptAIGrade(cropState.aiAssessment!.suggestedGrade)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept Grade {cropState.aiAssessment.suggestedGrade}
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {t.retakePhoto}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MANUAL GRADE SELECTION CARDS */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            {t.qualityOptionManual}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                grade: 'A' as QualityGrade,
                title: t.gradeA,
                desc: t.gradeADesc,
                badge: '+5% Price',
                color: 'emerald',
              },
              {
                grade: 'B' as QualityGrade,
                title: t.gradeB,
                desc: t.gradeBDesc,
                badge: 'Standard Price',
                color: 'blue',
              },
              {
                grade: 'C' as QualityGrade,
                title: t.gradeC,
                desc: t.gradeCDesc,
                badge: '-5% Price',
                color: 'orange',
              },
              {
                grade: 'Custom' as QualityGrade,
                title: t.customGrade,
                desc: t.customGradeDesc,
                badge: 'Spot Negotiated',
                color: 'stone',
              },
            ].map((opt) => {
              const isSelected = cropState.qualityGrade === opt.grade;

              return (
                <button
                  key={opt.grade}
                  type="button"
                  onClick={() => handleSelectManualGrade(opt.grade)}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-2 ring-emerald-500/40'
                      : 'bg-stone-50/50 border-stone-200 hover:border-stone-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-sm text-stone-900">
                        {opt.grade === 'Custom' ? 'Custom' : `Grade ${opt.grade}`}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          opt.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : opt.grade === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : opt.grade === 'C'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {opt.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-stone-400 font-medium">Deterministic Rule</span>
                    {isSelected ? (
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Active
                      </span>
                    ) : (
                      <span className="text-stone-400">Select</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: HARD GATE CONTINUATION FOOTER */}
      {/* ========================================================================= */}
      <div className="bg-stone-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-stone-200">
        <div className="text-xs text-stone-600 space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-stone-800">
            <span>Progress Checklist:</span>
            <span className={isCropValid ? 'text-emerald-700' : 'text-stone-400'}>
              {isCropValid ? '✓' : '○'} Crop
            </span>
            <span className={isQuantityValid ? 'text-emerald-700' : 'text-stone-400'}>
              {isQuantityValid ? '✓' : '○'} Quantity
            </span>
            <span className={isQualityValid ? 'text-emerald-700' : 'text-stone-400'}>
              {isQualityValid ? '✓' : '○'} Quality
            </span>
          </div>
          <p className="text-stone-500 text-[11px]">
            {isCompleteAndReady
              ? 'All required crop parameters completed. Ready for Market Comparison.'
              : 'Mandatory: Crop, Quantity, and Quality must all be set before market comparison.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 sm:w-auto px-4 py-3 border border-stone-300 text-stone-700 font-bold rounded-xl text-xs hover:bg-stone-200 transition-colors"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={handleAttemptContinue}
            className={`w-1/2 sm:w-auto px-6 py-3 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow ${
              isCompleteAndReady
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-stone-300 hover:bg-stone-400 text-stone-600'
            }`}
          >
            <span>{t.continueToMarket}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CAMERA ANALYSIS MODAL / OVERLAY */}
      {/* ========================================================================= */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm">{t.checkCropQuality}</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCameraModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {isAnalyzing ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-spin">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="font-bold text-base text-stone-900">
                      {t.analyzingCrop}
                    </h5>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                      {t.analyzingSubtext}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {capturedImage && (
                    <div className="relative rounded-2xl overflow-hidden border border-stone-300 max-h-60 bg-black flex items-center justify-center">
                      <img
                        src={capturedImage}
                        alt="Crop harvest"
                        className="max-h-60 object-contain w-full"
                      />
                      {/* Framing Overlay Tip */}
                      <div className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur-xs text-white text-[11px] py-1 px-2 rounded-lg text-center font-medium">
                        {t.cameraOverlayTip}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-stone-600 text-center">
                    {t.cameraGuidance}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {t.retakePhoto}
                    </button>
                    {cropState.aiAssessment && (
                      <button
                        type="button"
                        onClick={() => handleAcceptAIGrade(cropState.aiAssessment!.suggestedGrade)}
                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Use Grade {cropState.aiAssessment.suggestedGrade}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
