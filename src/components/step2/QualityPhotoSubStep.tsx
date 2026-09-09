import React, { useRef, useState } from 'react';
import { CropSelectionState, Language, QualityGrade } from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';
import { generateCropSampleImage } from '../../data/cropSampleImages';
import {
  Camera,
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  HelpCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface QualityPhotoSubStepProps {
  language: Language;
  cropState: CropSelectionState;
  onSelectGrade: (grade: QualityGrade | null) => void;
  onPhotoSelected: (photoBase64: string | null) => void;
  onOpenWebcamModal: () => void;
  onStartAIVerification: () => void;
  onBack: () => void;
}

const QUALITY_GRADE_OPTIONS: {
  id: QualityGrade;
  title: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  bgColor: string;
  description: string;
  criteria: string[];
}[] = [
  {
    id: 'A',
    title: 'Grade A — Premium Quality',
    badge: '🟢 Top Tier (+5% Premium)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-50/60',
    description: 'Uniform size, brilliant natural color, zero rot, free from blemishes or damage.',
    criteria: ['High kernel/produce fullness', 'Clean produce surface', 'Top market demand'],
  },
  {
    id: 'B',
    title: 'Grade B — Standard Quality',
    badge: '🔵 Standard Mandi FAQ',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50/60',
    description: 'Standard Fair Average Quality (FAQ), minor natural cosmetic variations, sound harvest.',
    criteria: ['Standard mandi baseline rate', 'Minor natural surface variations', 'Sound commercial quality'],
  },
  {
    id: 'C',
    title: 'Grade C — Lower Quality',
    badge: '🟡 Lower Quality (-5% Discount)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-50/60',
    description: 'Mixed sizes, noticeable surface marks, discoloration, or lower market price.',
    criteria: ['Irregular sizing or weathering', 'Higher dockage deductions', 'Discounted mandi realizations'],
  },
  {
    id: 'Custom',
    title: 'Custom / Not Sure',
    badge: '⚪ Let AI Decide',
    badgeColor: 'bg-stone-200 text-stone-800 border-stone-300',
    borderColor: 'border-stone-400',
    bgColor: 'bg-stone-50',
    description: 'Unsure of AGMARK grade? Let KrishiSetu Explainable AI assess your produce photo.',
    criteria: ['AI visual feature extraction', 'Automatic benchmark alignment', 'Explainable verification'],
  },
];

export const QualityPhotoSubStep: React.FC<QualityPhotoSubStepProps> = ({
  language,
  cropState,
  onSelectGrade,
  onPhotoSelected,
  onOpenWebcamModal,
  onStartAIVerification,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSampleGrade, setActiveSampleGrade] = useState<string | null>(null);

  const cropName = cropState.selectedCrop?.name || 'Crop Produce';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onPhotoSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value to allow selecting same file again
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onPhotoSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSamplePhoto = (sampleType: 'A' | 'B' | 'C') => {
    setActiveSampleGrade(sampleType);
    const sampleImage = generateCropSampleImage(cropName, sampleType);
    if (sampleImage) {
      onPhotoSelected(sampleImage);
    }
  };

  const canProceedToAI = Boolean(cropState.qualityGrade && cropState.cropPhoto);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Question */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700/60 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Step 2 of 3 • Quality & Photo
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            What quality grade is your crop?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base mt-2">
            Select the grade you believe your {cropName} belongs to, then upload or capture a photo for explainable AI verification.
          </p>
        </div>
      </div>

      {/* Grade Selection Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-stone-900">
            Select Your Estimated Quality Grade:
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            (Required before verification)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {QUALITY_GRADE_OPTIONS.map((opt) => {
            const isSelected = cropState.qualityGrade === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`grade-option-${opt.id}`}
                onClick={() => onSelectGrade(opt.id)}
                className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? `${opt.borderColor} ${opt.bgColor} ring-2 ring-emerald-600 shadow-sm`
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base font-black text-stone-900">
                      {opt.title}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    )}
                  </div>

                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${opt.badgeColor}`}
                  >
                    {opt.badge}
                  </span>

                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex flex-wrap gap-1.5">
                  {opt.criteria.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold text-stone-500 bg-white/80 px-2 py-0.5 rounded-md border border-stone-200/60"
                    >
                      • {c}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo Capture & Upload Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-5">
        <div>
          <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-700" />
            Upload or Capture a Photo of Your Crop
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            KrishiSetu AI uses this photograph to visually verify your crop's color, uniformity, and surface quality.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Photo State: Not Yet Uploaded */}
        {!cropState.cropPhoto ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all ${
              isDragging
                ? 'border-emerald-600 bg-emerald-50/70'
                : 'border-stone-300 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-400'
            }`}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                <ImageIcon className="w-7 h-7 text-emerald-700" />
              </div>

              <div>
                <div className="text-sm font-bold text-stone-900">
                  Take a photo or drag & drop harvest image here
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Supports JPG, PNG, WEBP (Clear daylight photo recommended)
                </div>
              </div>

              {/* Two Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  id="btn-take-photo"
                  onClick={onOpenWebcamModal}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo with Camera
                </button>

                <button
                  type="button"
                  id="btn-upload-photo"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 shadow-2xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-stone-600" />
                  Upload Photo File
                </button>
              </div>

              {/* Quick Sample Photos for Instant Testing */}
              <div className="pt-4 border-t border-stone-200/80">
                <div className="text-[11px] font-bold text-stone-600 mb-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Don't have a photo right now? Try a test sample:
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadSamplePhoto('A')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer transition-colors"
                  >
                    ✨ Sample Grade A Harvest
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSamplePhoto('B')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                  >
                    ✨ Sample Grade B (FAQ) Harvest
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSamplePhoto('C')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 cursor-pointer transition-colors"
                  >
                    ✨ Sample Grade C Harvest
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Photo Preview State */
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-sm shrink-0 bg-stone-900">
                <img
                  src={cropState.cropPhoto}
                  alt="Harvest preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200 mb-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  Photo Ready for Inspection
                </span>
                <div className="text-sm sm:text-base font-black text-stone-900">
                  {cropName} Harvest Sample Photo
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  High-resolution photo captured. KrishiSetu AI will scan this for color, uniformity, and surface defects.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-stone-700 border border-stone-300 hover:bg-stone-100 transition-colors shadow-2xs cursor-pointer"
              >
                Change Photo
              </button>

              <button
                type="button"
                onClick={() => onPhotoSelected(null)}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl font-bold text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Crop Selection
        </button>

        <button
          type="button"
          id="btn-verify-crop-ai"
          disabled={!canProceedToAI}
          onClick={onStartAIVerification}
          className={`px-7 py-3.5 rounded-2xl font-black text-sm inline-flex items-center gap-2 transition-all cursor-pointer shadow-md ${
            canProceedToAI
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-98'
              : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Verify Crop with KrishiSetu AI
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
