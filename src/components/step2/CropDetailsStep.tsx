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
import { ReferenceStandardsModal } from './ReferenceStandardsModal';
import { WebcamCaptureModal } from './WebcamCaptureModal';
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
  BookOpen,
  FileCheck,
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
  const [isWebcamModalOpen, setIsWebcamModalOpen] = useState(false);
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(cropState.aiAssessment?.imageUrl || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showWhyExpander, setShowWhyExpander] = useState(true);

  // Validation / Hard Gate tracking & scroll anchors
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const cropSectionRef = useRef<HTMLDivElement>(null);
  const quantitySectionRef = useRef<HTMLDivElement>(null);
  const qualitySectionRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

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

  // Photo Capture & Upload Handlers
  const handleTakePhotoClick = () => {
    if (!cropState.selectedCrop) {
      setShowValidationAlert(true);
      cropSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Check if touch / mobile device
    const isMobile =
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
      (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1);

    if (isMobile) {
      cameraInputRef.current?.click();
    } else {
      // On desktop, open live webcam modal if supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        setIsWebcamModalOpen(true);
      } else {
        cameraInputRef.current?.click();
      }
    }
  };

  const handleUploadPhotoClick = () => {
    if (!cropState.selectedCrop) {
      setShowValidationAlert(true);
      cropSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    uploadInputRef.current?.click();
  };

  const handleFileCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result as string;
      setCapturedImage(base64Data);
      await triggerAIAnalysis(base64Data);
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const handleWebcamCapture = async (base64Data: string) => {
    setCapturedImage(base64Data);
    await triggerAIAnalysis(base64Data);
  };

  const handleDropPhoto = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!cropState.selectedCrop) {
      setShowValidationAlert(true);
      cropSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        setCapturedImage(base64Data);
        await triggerAIAnalysis(base64Data);
      };
      reader.readAsDataURL(file);
    }
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

      // Note: We DO NOT automatically finalize the quality grade!
      // The farmer's manual confirmation or active choice is strictly required.
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

  // Accept AI suggested grade (only allowed if grade is not REJECT)
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              {t.chooseCategory}
            </label>
            <span className="text-[11px] text-stone-500 font-medium">
              Showing {filteredCrops.length} {selectedCategory === 'all' ? 'total' : selectedCategory} crops
            </span>
          </div>
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
              const count = cat.id === 'all'
                ? CROP_DATABASE.length
                : CROP_DATABASE.filter((c) => c.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id as CropCategory);
                    setIsOtherCropSelected(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-700/40'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-emerald-950/60 text-emerald-200' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {count}
                  </span>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                {t.whatQuality}
              </h3>
              <p className="text-xs text-stone-500">
                Inspect physical grain/produce quality with photo or select standard mandi grade
              </p>
            </div>
          </div>

          {/* Reference Standards Button */}
          <button
            type="button"
            onClick={() => setIsStandardsModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mandi / Agmark Standards</span>
          </button>
        </div>

        {/* Hidden File Inputs: Mobile Camera & Gallery/File Picker */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleFileCapture}
          className="hidden"
          aria-label="Take crop photo"
        />
        <input
          type="file"
          ref={uploadInputRef}
          accept="image/*"
          onChange={handleFileCapture}
          className="hidden"
          aria-label="Upload crop photo"
        />

        {/* PROMINENT CARD: 📷 Check Crop Quality with Photo */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDropPhoto}
          className={`mb-6 rounded-2xl border-2 transition-all p-5 sm:p-6 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/70 scale-[1.005]'
              : 'border-dashed border-amber-300 bg-gradient-to-br from-amber-50/60 via-stone-50 to-emerald-50/30'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">📷</span>
                <h4 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">
                  Check Crop Quality with Photo
                </h4>
                <span className="bg-amber-500 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Gemini Vision
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                Take a photo or upload a clear crop image. Our AI checks grain size, color, moisture texture, fungal rot, and foreign matter against official Agmark mandi standards.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-stone-500 font-medium">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Benchmarked to Agmark library
                </span>
                <span className="flex items-center gap-1 text-amber-800">
                  <ShieldAlert className="w-3.5 h-3.5" /> Strict rot & mold detection
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={handleTakePhotoClick}
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-5 py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                <Camera className="w-4 h-4 text-emerald-200" />
                <span>📷 Take Photo</span>
              </button>

              <button
                type="button"
                onClick={handleUploadPhotoClick}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-800 border-2 border-stone-300 font-bold px-4 py-3 rounded-xl shadow-xs transition-all text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                <Upload className="w-4 h-4 text-stone-600" />
                <span>🖼️ Upload Photo</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Prompt on Desktop */}
          <div className="mt-3 pt-3 border-t border-amber-200/50 flex flex-wrap items-center justify-between text-[11px] text-stone-500">
            <span>Or drag and drop a harvest image file directly here (JPG, PNG, WebP)</span>
            <button
              type="button"
              onClick={() => setIsStandardsModalOpen(true)}
              className="text-emerald-700 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <FileCheck className="w-3 h-3" /> View Grade A / B / C Tolerances
            </button>
          </div>
        </div>

        {/* LOADING STATE FOR AI SCANNING */}
        {isAnalyzing && (
          <div className="mb-6 bg-emerald-50/70 border-2 border-emerald-400 rounded-2xl p-6 text-center space-y-3 animate-pulse">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h5 className="font-extrabold text-base text-emerald-950">
                Inspecting Crop Sample with Vision AI...
              </h5>
              <p className="text-xs text-emerald-800 max-w-md mx-auto mt-1">
                Analyzing visual parameters, grain soundness, color discoloration, mold mycelium, and defect tolerances against Agmark mandi benchmarks.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/80 border border-emerald-300 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Model: Gemini Vision • APMC Reference Library
            </div>
          </div>
        )}

        {/* CAMERA/ANALYSIS ERROR BANNER */}
        {cameraError && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-2xl p-4 flex items-start gap-3 text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold block text-sm">Inspection Alert</span>
              <p className="mt-0.5">{cameraError}</p>
            </div>
          </div>
        )}

        {/* ACTIVE AI ASSESSMENT DISPLAY CARD (IF COMPLETED) */}
        {cropState.aiAssessment && !isAnalyzing && (
          <div className={`mb-6 rounded-2xl p-4 sm:p-5 border-2 transition-all ${
            cropState.aiAssessment.rotDetected || cropState.aiAssessment.suggestedGrade === 'REJECT'
              ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-400/30'
              : !cropState.aiAssessment.cropMatch
              ? 'bg-amber-50 border-amber-500'
              : 'bg-stone-50 border-emerald-600/90 shadow-sm'
          }`}>
            {/* Header with Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm flex items-center gap-1.5 text-stone-900">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Visual AI Quality Inspection
                </span>
                {cropState.aiAssessment.isDemo && (
                  <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
                    Demo Assessment
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-semibold">
                  Confidence:
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

            {/* ========================================================================= */}
            {/* CASE 1: ROT / MOLD / SEVERE SPOILAGE DETECTED (STRICT REJECTION GATE) */}
            {/* ========================================================================= */}
            {(cropState.aiAssessment.rotDetected || cropState.aiAssessment.suggestedGrade === 'REJECT') && (
              <div className="mb-4 bg-red-100/90 border-2 border-red-500 rounded-xl p-4 text-red-950">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wide shadow-xs">
                        🚨 LOT REJECTED / DISQUALIFIED FOR STANDARD APMC SALE
                      </span>
                      <span className="text-xs font-bold text-red-800">
                        Zero Tolerance Failure (Agmark / Mandi Rules)
                      </span>
                    </div>

                    <h5 className="font-extrabold text-sm sm:text-base text-red-950">
                      Severe Rot, Mold, or Spoilage Detected in Sample
                    </h5>

                    <p className="text-xs text-red-900">
                      Under Indian Agmark & Mandi bylaws, lots showing active fungal mold mycelium, bacterial soft rot, or sour fermented odor are strictly barred from standard food-grade sale and <strong>cannot receive Grade A or Grade B</strong>.
                    </p>

                    {cropState.aiAssessment.rejectionReasons && cropState.aiAssessment.rejectionReasons.length > 0 && (
                      <div className="bg-white/90 rounded-lg p-2.5 border border-red-300 mt-2">
                        <span className="font-bold text-xs text-red-950 block mb-1">
                          Disqualification Defects Found:
                        </span>
                        <ul className="list-disc list-inside text-xs text-red-800 space-y-0.5">
                          {cropState.aiAssessment.rejectionReasons.map((reason, idx) => (
                            <li key={idx} className="font-semibold">{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleTakePhotoClick}
                        className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retake Photo with Fresh Sample
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsStandardsModalOpen(true)}
                        className="bg-white border border-red-400 hover:bg-red-50 text-red-900 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-red-700" />
                        View Rejection Criteria & Standards
                      </button>
                    </div>

                    <p className="text-[11px] text-red-800 italic pt-1">
                      💡 Farmer Note: If this batch is being liquidated for animal feed, bio-fuel, or processing salvage, you may manually select <strong>Grade C (-5% Price)</strong> or <strong>Custom</strong> from the cards below. The AI will not force this choice.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: CROP MISMATCH */}
            {!cropState.aiAssessment.cropMatch && !cropState.aiAssessment.rotDetected && cropState.aiAssessment.suggestedGrade !== 'REJECT' && (
              <div className="mb-4 bg-amber-100/90 border border-amber-400 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold">{t.cropDoesNotMatch}</h5>
                  <p className="mt-0.5 text-amber-900">{t.cropMismatchDesc}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleTakePhotoClick}
                      className="bg-amber-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      {t.retakePhoto}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        cropSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-white border border-amber-400 text-amber-900 font-semibold px-3 py-1.5 rounded-lg text-xs"
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
                      onClick={handleTakePhotoClick}
                      className="absolute bottom-1.5 right-1.5 bg-black/75 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> {t.retakePhoto}
                    </button>
                  </div>
                </div>
              )}

              {/* Assessment Breakdown */}
              <div className={capturedImage ? 'md:col-span-9' : 'md:col-span-12'}>
                {cropState.aiAssessment.suggestedGrade !== 'REJECT' && (
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-stone-500 font-medium">
                      {t.suggestedGrade}:
                    </span>
                    <span className={`font-extrabold text-sm px-3 py-0.5 rounded-lg ${
                      cropState.aiAssessment.suggestedGrade === 'A'
                        ? 'bg-emerald-800 text-amber-300'
                        : cropState.aiAssessment.suggestedGrade === 'B'
                        ? 'bg-blue-800 text-white'
                        : 'bg-orange-800 text-white'
                    }`}>
                      Grade {cropState.aiAssessment.suggestedGrade}
                    </span>
                    <span className="text-xs text-stone-500">
                      ({cropState.aiAssessment.suggestedGrade === 'A' ? '+5% Price Premium' : cropState.aiAssessment.suggestedGrade === 'B' ? 'Standard Modal Rate' : '-5% Price Discount'})
                    </span>
                  </div>
                )}

                {/* Observations list */}
                <div className="text-xs text-stone-700 mb-3">
                  <span className="font-bold text-stone-900 block mb-1">
                    Visual Observations & Agmark Parameters:
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-stone-600 pl-1">
                    {cropState.aiAssessment.observations.map((obs, idx) => (
                      <li key={idx}>{obs}</li>
                    ))}
                  </ul>
                </div>

                {/* Limitations and Disclaimer */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start gap-2 mb-3">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.aiVisualEstimate}</span> • Physical testing for exact moisture % and aflatoxin requires mandi lab meters.
                  </div>
                </div>

                {/* Grade acceptance buttons (only for non-rejected grades) */}
                {cropState.aiAssessment.suggestedGrade !== 'REJECT' && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAcceptAIGrade(cropState.aiAssessment!.suggestedGrade)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept Suggested Grade {cropState.aiAssessment.suggestedGrade}
                    </button>
                    <button
                      type="button"
                      onClick={handleTakePhotoClick}
                      className="bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {t.retakePhoto}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MANUAL GRADE SELECTION CARDS (FARMER HAS FINAL SAY) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
              {t.qualityOptionManual} (Farmer Final Choice)
            </label>
            <span className="text-[11px] text-stone-500">
              Select grade to finalize lot pricing
            </span>
          </div>
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
      {/* AGMARK REFERENCE STANDARDS MODAL */}
      {/* ========================================================================= */}
      {cropState.selectedCrop && (
        <ReferenceStandardsModal
          crop={cropState.selectedCrop}
          isOpen={isStandardsModalOpen}
          onClose={() => setIsStandardsModalOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* WEBCAM CAPTURE MODAL FOR DESKTOP */}
      {/* ========================================================================= */}
      <WebcamCaptureModal
        isOpen={isWebcamModalOpen}
        onClose={() => setIsWebcamModalOpen(false)}
        onCapture={handleWebcamCapture}
        cropName={cropState.selectedCrop?.name || 'Crop Sample'}
      />
    </div>
  );
};
