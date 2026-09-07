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
import { analyzeCropPhoto, preValidateImage } from '../../services/cropVisionService';
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
  Eye,
  Sliders,
} from 'lucide-react';

interface CropDetailsStepProps {
  language: Language;
  cropState: CropSelectionState;
  onUpdateCropState: (newState: Partial<CropSelectionState>) => void;
  onContinue: () => void;
  onBack: () => void;
}

// Multi-stage analysis animation steps
const ANALYSIS_STEPS = [
  { step: 1, title: 'Reading crop image pixels & clarity...', durationMs: 700 },
  { step: 2, title: 'Verifying crop species & identity...', durationMs: 800 },
  { step: 3, title: 'Inspecting surface (rot, mold, pest, freshness)...', durationMs: 900 },
  { step: 4, title: 'Benchmarking against Agmark Mandi visual criteria...', durationMs: 800 },
  { step: 5, title: 'Finalizing visual quality assessment...', durationMs: 500 },
];

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

  // Modals & inputs
  const [isWebcamModalOpen, setIsWebcamModalOpen] = useState(false);
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(cropState.cropPhoto || cropState.aiAssessment?.imageUrl || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCurrentStep, setAnalysisCurrentStep] = useState(1);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Validation / Hard Gate tracking & scroll anchors
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const cropSectionRef = useRef<HTMLDivElement>(null);
  const quantitySectionRef = useRef<HTMLDivElement>(null);
  const photoSectionRef = useRef<HTMLDivElement>(null);
  const qualitySectionRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Filter crops
  const filteredCrops = filterCrops(CROP_DATABASE, selectedCategory, searchQuery);

  // Validation rules: Photo is MANDATORY!
  const isCropValid =
    Boolean(cropState.selectedCrop && cropState.selectedCrop.id !== 'other_custom') ||
    (isOtherCropSelected && cropState.customCropName.trim().length > 0);

  const isQuantityValid =
    typeof cropState.quantityValue === 'number' && cropState.quantityValue > 0;

  const isPhotoValid = Boolean(capturedImage || cropState.cropPhoto);

  const isQualityValid =
    Boolean(cropState.qualityGrade) && cropState.qualityConfirmed;

  const isCompleteAndReady = isCropValid && isQuantityValid && isPhotoValid && isQualityValid;

  // Handle Crop Selection (invalidates previous quality if crop changed)
  const handleSelectCrop = (crop: CropItem) => {
    setIsOtherCropSelected(false);
    onUpdateCropState({
      selectedCrop: crop,
      customCropName: '',
      cropPhoto: null,
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
      cropPhoto: null,
      qualityGrade: null,
      qualitySource: null,
      qualityConfirmed: false,
      aiAssessment: null,
    });
    setCapturedImage(null);
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

  // Manual Quality selection (Farmer Confirmation)
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

    setShowValidationAlert(true);

    if (!isCropValid) {
      cropSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!isQuantityValid) {
      quantitySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!isPhotoValid) {
      photoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    const isMobile =
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
      (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1);

    if (isMobile) {
      cameraInputRef.current?.click();
    } else {
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
      onUpdateCropState({ cropPhoto: base64Data });
      await triggerAIAnalysis(base64Data);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleWebcamCapture = async (base64Data: string) => {
    setCapturedImage(base64Data);
    onUpdateCropState({ cropPhoto: base64Data });
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
        onUpdateCropState({ cropPhoto: base64Data });
        await triggerAIAnalysis(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  // Multi-step Animation and AI trigger
  const triggerAIAnalysis = async (imageData: string) => {
    if (!cropState.selectedCrop) {
      setCameraError(t.pleaseSelectCrop);
      return;
    }

    setCameraError(null);
    setIsAnalyzing(true);
    setAnalysisCurrentStep(1);

    // Client-side quick brightness check
    const preCheck = await preValidateImage(imageData);
    if (!preCheck.valid) {
      setIsAnalyzing(false);
      setCameraError(preCheck.message || 'Image clarity is insufficient. Please provide a clear photo.');
      return;
    }

    // Step animation interval
    let step = 1;
    const stepInterval = setInterval(() => {
      step += 1;
      if (step <= 4) {
        setAnalysisCurrentStep(step);
      } else {
        clearInterval(stepInterval);
      }
    }, 750);

    try {
      const assessment = await analyzeCropPhoto({
        imageFileOrBase64: imageData,
        selectedCrop: cropState.selectedCrop,
      });

      assessment.imageUrl = imageData;
      clearInterval(stepInterval);
      setAnalysisCurrentStep(5);

      // We NEVER auto-assign the final grade!
      // The farmer must confirm or select their grade.
      onUpdateCropState({
        aiAssessment: assessment,
        cropPhoto: imageData,
      });
    } catch (err: any) {
      console.warn('AI analysis error:', err);
      clearInterval(stepInterval);
      setCameraError('AI service could not process image. Please verify connection or select your grade manually.');
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 500);
    }
  };

  // Accept AI suggested grade (Farmer Confirmation)
  const handleAcceptAIGrade = (grade: QualityGrade) => {
    onUpdateCropState({
      qualityGrade: grade,
      qualitySource: 'ai',
      qualityConfirmed: true,
    });
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
          className="text-xs text-stone-500 hover:text-stone-800 font-semibold self-start sm:self-auto cursor-pointer"
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
                {!isPhotoValid && <li>Mandatory: Please capture or upload a clear crop photo.</li>}
                {!isQualityValid && <li>Mandatory: Please inspect and confirm the quality grade (Grade A, B, or C).</li>}
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-emerald-900/80 text-emerald-200' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchCropPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredCrops.map((crop) => {
            const isSelected = cropState.selectedCrop?.id === crop.id && !isOtherCropSelected;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => handleSelectCrop(crop)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-2 ring-emerald-500/30 font-bold'
                    : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="text-2xl mb-1">{crop.icon}</div>
                  <div className="text-xs font-bold text-stone-900 line-clamp-1">
                    {crop.localNames[language] || crop.name}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {crop.name}
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded w-fit">
                  ₹{crop.modalPrice}/qtl
                </div>
              </button>
            );
          })}

          {/* Other / Unlisted Crop Button */}
          <button
            type="button"
            onClick={handleSelectOtherCrop}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              isOtherCropSelected
                ? 'bg-amber-50 border-amber-600 shadow-sm ring-2 ring-amber-500/30 font-bold'
                : 'bg-stone-50 border-stone-200 hover:border-amber-300'
            }`}
          >
            <div>
              <div className="text-2xl mb-1">🌱</div>
              <div className="text-xs font-bold text-stone-900">
                {t.otherCrop}
              </div>
              <div className="text-[10px] text-stone-500">
                Custom Crop
              </div>
            </div>
            <div className="mt-2 text-[10px] font-bold text-amber-900 bg-amber-200/60 px-1.5 py-0.5 rounded w-fit">
              Manual
            </div>
          </button>
        </div>

        {/* Custom Crop Name Input if Other is Selected */}
        {isOtherCropSelected && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-xl">
            <label className="block text-xs font-bold text-amber-950 mb-1">
              Enter Custom Crop Name:
            </label>
            <input
              type="text"
              value={cropState.customCropName}
              onChange={(e) => handleCustomCropNameChange(e.target.value)}
              placeholder="e.g. Turmeric, Cashew, Jaggery, Chia Seeds..."
              className="w-full bg-white border border-amber-400 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: QUANTITY & UNIT */}
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
              Quantity value (must be greater than 0) *
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
      {/* SECTION 3: MANDATORY CROP PHOTO & AI QUALITY INSPECTION */}
      {/* ========================================================================= */}
      <section
        ref={photoSectionRef}
        className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
          showValidationAlert && !isPhotoValid
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
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  Crop Photograph & Quality Inspection
                </h3>
                <span className="bg-red-100 text-red-700 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Mandatory *
                </span>
              </div>
              <p className="text-xs text-stone-500">
                A photograph is required to verify harvest condition, rot/mold status, and assign accurate mandi pricing.
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
            <span>Agmark Mandi Standards</span>
          </button>
        </div>

        {/* Hidden File Inputs */}
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

        {/* PROMINENT CARD: 📷 Mandatory Crop Photo */}
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
              : capturedImage
              ? 'border-emerald-400 bg-emerald-50/20'
              : 'border-dashed border-amber-300 bg-gradient-to-br from-amber-50/60 via-stone-50 to-emerald-50/30'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">📷</span>
                <h4 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">
                  {capturedImage ? 'Crop Photo Captured' : 'Take or Upload Crop Photo *'}
                </h4>
                <span className="bg-amber-500 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gemini Vision
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                {capturedImage
                  ? 'Photo captured. Our AI has evaluated the visual texture, grain fullness, rot/mold status, and defect limits.'
                  : 'Take a photo or upload a clear picture of your harvest. Real AI vision checks grain maturity, moisture appearance, and inspects for fungal rot or mold.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-stone-500 font-medium">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Benchmarked to AGMARK Standards
                </span>
                <span className="flex items-center gap-1 text-red-700 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" /> Fungal Rot / Mold Disqualification Check
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
                <span>{capturedImage ? '🔄 Retake Photo' : '📷 Take Photo'}</span>
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

          {capturedImage && (
            <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-stone-100">
                <img
                  src={capturedImage}
                  alt="Farmer crop sample"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs space-y-1">
                <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Photo Uploaded Successfully
                </div>
                <p className="text-stone-600">
                  Ready for inspection. Click retake above if you wish to provide a different angle or lighting.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ANIMATION 1: MULTI-STAGE PHOTO ANALYSIS ANIMATION */}
        {isAnalyzing && (
          <div className="mb-6 bg-emerald-50/90 border-2 border-emerald-500 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h5 className="font-extrabold text-base text-emerald-950">
                  Multistage AI Harvest Inspection in Progress...
                </h5>
                <p className="text-xs text-emerald-800">
                  Evaluating {cropState.selectedCrop?.name || 'crop'} pixels against Agmark benchmarks
                </p>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-emerald-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${(analysisCurrentStep / 5) * 100}%` }}
              />
            </div>

            {/* Visual Step Checklist */}
            <div className="space-y-2 text-xs">
              {ANALYSIS_STEPS.map((s) => {
                const isDone = s.step < analysisCurrentStep;
                const isCurrent = s.step === analysisCurrentStep;

                return (
                  <div
                    key={s.step}
                    className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-white border border-emerald-400 font-bold text-emerald-950 shadow-xs'
                        : isDone
                        ? 'text-emerald-800 font-medium'
                        : 'text-stone-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center text-[9px] shrink-0">
                        {s.step}
                      </div>
                    )}
                    <span>{s.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ERROR BANNER */}
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
          <div
            className={`mb-6 rounded-2xl p-4 sm:p-5 border-2 transition-all ${
              cropState.aiAssessment.rotDetected || cropState.aiAssessment.suggestedGrade === 'REJECT'
                ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-400/30'
                : !cropState.aiAssessment.cropMatch
                ? 'bg-amber-50 border-amber-500'
                : 'bg-stone-50 border-emerald-600/90 shadow-sm'
            }`}
          >
            {/* Header with Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm flex items-center gap-1.5 text-stone-900">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Visual AI Quality Inspection Result
                </span>
                {cropState.aiAssessment.isDemo && (
                  <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
                    Demo Assessment
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-semibold">Confidence:</span>
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

            {/* CASE 1: ROT / MOLD / SEVERE SPOILAGE DETECTED */}
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
                    </div>

                    <h5 className="font-extrabold text-sm sm:text-base text-red-950">
                      Severe Rot, Mold, or Spoilage Detected in Sample
                    </h5>

                    <p className="text-xs text-red-900">
                      Under Indian Agmark & Mandi bylaws, lots showing active fungal mold mycelium, bacterial soft rot, or decomposition are barred from standard food-grade sale and <strong>cannot receive Grade A or Grade B</strong>.
                    </p>

                    {cropState.aiAssessment.rejectionReasons && cropState.aiAssessment.rejectionReasons.length > 0 && (
                      <div className="bg-white/90 rounded-lg p-2.5 border border-red-300 mt-2">
                        <span className="font-bold text-xs text-red-950 block mb-1">
                          Disqualification Reasons:
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
                        className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retake Photo with Fresh Sample
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsStandardsModalOpen(true)}
                        className="bg-white border border-red-400 hover:bg-red-50 text-red-900 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-red-700" />
                        View Rejection Criteria & Standards
                      </button>
                    </div>

                    <p className="text-[11px] text-red-800 italic pt-1">
                      💡 Farmer Note: If this lot is being liquidated for animal feed, biomass, or processing salvage, you may manually confirm <strong>Grade C (-5% Price)</strong> or <strong>Custom</strong> below. The AI will never silently force a grade.
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
                      className="bg-amber-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                    >
                      {t.retakePhoto}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        cropSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-white border border-amber-400 text-amber-900 font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                    >
                      {t.changeCrop}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Assessment Details */}
            <div className="space-y-3">
              {cropState.aiAssessment.suggestedGrade !== 'REJECT' && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">{t.suggestedGrade}:</span>
                  <span
                    className={`font-extrabold text-sm px-3 py-0.5 rounded-lg ${
                      cropState.aiAssessment.suggestedGrade === 'A'
                        ? 'bg-emerald-800 text-amber-300'
                        : cropState.aiAssessment.suggestedGrade === 'B'
                        ? 'bg-blue-800 text-white'
                        : 'bg-orange-800 text-white'
                    }`}
                  >
                    Grade {cropState.aiAssessment.suggestedGrade}
                  </span>
                  <span className="text-xs text-stone-500">
                    ({cropState.aiAssessment.suggestedGrade === 'A'
                      ? '+5% Price Premium'
                      : cropState.aiAssessment.suggestedGrade === 'B'
                      ? 'Standard Modal Rate'
                      : '-5% Price Discount'})
                  </span>
                </div>
              )}

              {/* Observations list */}
              <div className="text-xs text-stone-700">
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
              <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{t.aiVisualEstimate}</span> • Physical testing for exact moisture % and aflatoxin requires mandi lab meters.
                </div>
              </div>

              {/* Confirmation Button for AI grade */}
              {cropState.aiAssessment.suggestedGrade !== 'REJECT' && (
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAcceptAIGrade(cropState.aiAssessment!.suggestedGrade as QualityGrade)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Confirm Grade {cropState.aiAssessment.suggestedGrade} ({cropState.aiAssessment.suggestedGrade === 'A' ? '+5%' : 'Modal'})
                  </button>
                  <span className="text-xs text-stone-500">
                    or choose a different grade manually below
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 4: MANUAL GRADE SELECTION CARDS (FARMER HAS FINAL SAY) */}
        <div ref={qualitySectionRef} className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Confirm Quality Grade (Farmer Final Decision) *
              </label>
              <p className="text-[11px] text-stone-500">
                The AI suggestion is advisory. You have the final say on the grade to proceed.
              </p>
            </div>
            {cropState.qualityConfirmed && cropState.qualityGrade && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Grade {cropState.qualityGrade} Confirmed
              </span>
            )}
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
                badge: 'Standard Modal',
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
                        <Check className="w-3 h-3 stroke-[3]" /> Selected
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
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 font-bold text-stone-800">
            <span>Mandatory Requirements:</span>
            <span className={isCropValid ? 'text-emerald-700' : 'text-stone-400'}>
              {isCropValid ? '✓' : '○'} Crop
            </span>
            <span className={isQuantityValid ? 'text-emerald-700' : 'text-stone-400'}>
              {isQuantityValid ? '✓' : '○'} Quantity
            </span>
            <span className={isPhotoValid ? 'text-emerald-700' : 'text-stone-400'}>
              {isPhotoValid ? '✓' : '○'} Crop Photo *
            </span>
            <span className={isQualityValid ? 'text-emerald-700' : 'text-stone-400'}>
              {isQualityValid ? '✓' : '○'} Quality Confirmed *
            </span>
          </div>
          <p className="text-stone-500 text-[11px]">
            {isCompleteAndReady
              ? 'All required crop parameters verified. Ready to compare nearby mandis.'
              : 'Mandatory: All 4 requirements must be satisfied before discovering market returns.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            className="w-1/2 sm:w-auto px-4 py-3 border border-stone-300 text-stone-700 font-bold rounded-xl text-xs hover:bg-stone-200 transition-colors cursor-pointer"
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

      {/* AGMARK REFERENCE STANDARDS MODAL */}
      {cropState.selectedCrop && (
        <ReferenceStandardsModal
          crop={cropState.selectedCrop}
          isOpen={isStandardsModalOpen}
          onClose={() => setIsStandardsModalOpen(false)}
        />
      )}

      {/* WEBCAM CAPTURE MODAL FOR DESKTOP */}
      <WebcamCaptureModal
        isOpen={isWebcamModalOpen}
        onClose={() => setIsWebcamModalOpen(false)}
        onCapture={handleWebcamCapture}
        cropName={cropState.selectedCrop?.name || 'Crop Sample'}
      />
    </div>
  );
};
