import React, { useState } from 'react';
import {
  CropItem,
  CropSelectionState,
  Language,
  QualityGrade,
  WeightUnit,
} from '../../types/krishi';
import { normalizeToKilograms } from '../../utils/pricing';
import { analyzeCropPhoto } from '../../services/cropVisionService';
import { StepProgressIndicator } from './StepProgressIndicator';
import { CropSelectionSubStep } from './CropSelectionSubStep';
import { QualityPhotoSubStep } from './QualityPhotoSubStep';
import { AIVerificationSubStep } from './AIVerificationSubStep';
import { WebcamCaptureModal } from './WebcamCaptureModal';
import { KisanAICropScanner } from '../scanner/KisanAICropScanner';
import { Sparkles, Scan, Layout } from 'lucide-react';

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
  // Determine starting sub-step based on current state
  const [currentSubStep, setCurrentSubStep] = useState<1 | 2 | 3>(() => {
    if (cropState.aiAssessment && cropState.cropPhoto) return 3;
    if (cropState.selectedCrop && typeof cropState.quantityValue === 'number' && cropState.quantityValue > 0) {
      return 2;
    }
    return 1;
  });

  const [isWebcamModalOpen, setIsWebcamModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useKisanScanner, setUseKisanScanner] = useState(true);

  // Sub-step completion checks
  const isStep1Complete = Boolean(
    (cropState.selectedCrop && cropState.selectedCrop.id !== 'other_custom') ||
      cropState.customCropName
  ) && typeof cropState.quantityValue === 'number' && cropState.quantityValue > 0;

  const isStep2Complete = Boolean(cropState.qualityGrade && cropState.cropPhoto);

  // Crop selection handler
  const handleSelectCrop = (crop: CropItem | null, customName?: string) => {
    onUpdateCropState({
      selectedCrop: crop,
      customCropName: customName || '',
    });
  };

  // Quantity updater
  const handleUpdateQuantity = (value: number | '', unit: WeightUnit) => {
    const norm = typeof value === 'number' ? normalizeToKilograms(value, unit) : 0;
    onUpdateCropState({
      quantityValue: value,
      quantityUnit: unit,
      normalizedKilograms: norm,
    });
  };

  // Grade selection handler
  const handleSelectGrade = (grade: QualityGrade | null) => {
    onUpdateCropState({
      qualityGrade: grade,
      // If user manually changes grade after analysis, clear confirmed state
      qualityConfirmed: false,
    });
  };

  // Photo selection handler
  const handlePhotoSelected = (photoBase64: string | null) => {
    onUpdateCropState({
      cropPhoto: photoBase64,
      aiAssessment: null,
      qualityConfirmed: false,
    });
  };

  // Trigger Explainable AI Verification
  const handleStartAIVerification = async () => {
    if (!cropState.cropPhoto || !cropState.selectedCrop) return;

    setIsAnalyzing(true);
    setCurrentSubStep(3);

    try {
      const assessment = await analyzeCropPhoto({
        imageFileOrBase64: cropState.cropPhoto,
        selectedCrop: cropState.selectedCrop,
        farmerGradeClaimed: cropState.qualityGrade,
      });

      onUpdateCropState({
        aiAssessment: assessment,
      });
    } catch (err) {
      console.error('AI verification failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Outcome 1: AI Agrees (or farmer is happy with verified grade)
  const handleConfirmVerifiedGrade = () => {
    const finalGrade =
      (cropState.aiAssessment?.suggestedGrade as QualityGrade) ||
      cropState.qualityGrade ||
      'B';

    onUpdateCropState({
      qualityGrade: finalGrade,
      qualityConfirmed: true,
      qualitySource: 'ai',
      authorityVerificationRequested: false,
    });

    onContinue();
  };

  // Outcome 2: Farmer accepts AI's grade (e.g. AI recommends Grade B)
  const handleAcceptAIGrade = (aiGrade: QualityGrade) => {
    onUpdateCropState({
      qualityGrade: aiGrade,
      qualityConfirmed: true,
      qualitySource: 'ai',
      authorityVerificationRequested: false,
    });

    onContinue();
  };

  // Outcome 3: Retake / Reupload Photo
  const handleRequestReupload = () => {
    onUpdateCropState({
      cropPhoto: null,
      aiAssessment: null,
      qualityConfirmed: false,
    });
    setCurrentSubStep(2);
  };

  // Outcome 4: Farmer disputes AI assessment and requests manual authority review
  const handleSubmitDisputeManualReview = (disputeReason: string) => {
    onUpdateCropState({
      // Keep farmer's claimed grade
      qualityConfirmed: true,
      qualitySource: 'manual',
      authorityVerificationRequested: true,
      disputeNotes: disputeReason,
    });

    onContinue();
  };

  // Outcome 5: Full Kisan AI Crop Scanner Completed
  const handleKisanScannerComplete = (result: any) => {
    onUpdateCropState({
      selectedCrop: result.crop,
      qualityGrade: result.farmerGrade,
      cropPhoto: result.images[0] || null,
      qualityConfirmed: true,
      qualitySource: result.agreed ? 'ai' : 'manual',
      authorityVerificationRequested: !result.agreed,
      aiAssessment: {
        cropDetected: result.crop.name,
        suggestedGrade: result.aiGrade,
        confidenceScore: result.confidence,
        confidenceLevel: result.confidence > 90 ? 'High' : 'Medium',
        cropMatch: true,
        detectedCrop: result.crop.name,
        selectedCrop: result.crop.name,
        observations: result.analysisReport.observations,
        limitations: [
          'Visual analysis is based on outer surface characteristics.',
          'Physical lab tests required for internal moisture & oil content.',
        ],
        analyzedAt: new Date().toISOString(),
        qualityFactors: {
          freshness: result.analysisReport.freshnessLevel === 'High' ? 'good' : 'fair',
          maturity: 'appropriate',
          visibleRot: false,
          visibleMold: false,
          discoloration: 'none',
          physicalDamage: result.analysisReport.defectsLevel === 'High' ? 'moderate' : 'none',
          insectDamage: 'none_visible',
          uniformity: result.analysisReport.sizeUniformityScore >= 4 ? 'good' : 'fair',
          cleanliness: 'good',
        },
        explainableReport: {
          overallGrade: result.aiGrade,
          farmerGradeClaimed: result.farmerGrade,
          confidenceScore: result.confidence,
          whyExplanation: result.analysisReport.observations[0] || 'Produce visual characteristics assessed.',
          isAgreed: result.agreed,
          color: {
            rating: result.analysisReport.colorScore >= 4 ? 'Good' : 'Moderate',
            description: 'Color uniformity and saturation match AGMARK specifications.',
            type: 'good',
          },
          uniformity: {
            rating: result.analysisReport.sizeUniformityScore >= 4 ? 'High' : 'Moderate',
            description: 'Size grading evaluated across produce sample.',
            type: 'good',
          },
          surfaceQuality: {
            rating: result.analysisReport.defectsLevel === 'Low' ? 'Clean' : 'Minor Issues',
            description: 'Surface skin tension and blemish count.',
            type: result.analysisReport.defectsLevel === 'Low' ? 'good' : 'minor',
          },
          damage: {
            rating: result.analysisReport.defectsLevel === 'High' ? 'Significant Detected' : 'None',
            description: 'Absence of visible mechanical or fungal rot damage.',
            type: result.analysisReport.defectsLevel === 'High' ? 'serious' : 'good',
          },
          factorsTable: [],
          markers: [],
        },
        needsManualReview: !result.agreed,
      },
    });

    onContinue();
  };

  return (
    <div id="crop-details-step-container" className="max-w-5xl mx-auto py-4 px-3 sm:px-6">
      {/* 3-Step Progress Indicator */}
      <StepProgressIndicator
        currentSubStep={currentSubStep}
        onJumpToStep={(step) => setCurrentSubStep(step)}
        isStep1Complete={isStep1Complete}
        isStep2Complete={isStep2Complete}
      />

      {/* Sub-step 1: Crop Name & Quantity */}
      {currentSubStep === 1 && (
        <CropSelectionSubStep
          language={language}
          cropState={cropState}
          onSelectCrop={handleSelectCrop}
          onUpdateQuantity={handleUpdateQuantity}
          onContinue={() => setCurrentSubStep(2)}
        />
      )}

      {/* Sub-step 2: Farmer Scans or Selects Quality Grade & Photo */}
      {currentSubStep === 2 && (
        <div className="space-y-4">
          {/* Toggle between Full Kisan AI Scanner HUD and Classic Form */}
          <div className="flex items-center justify-between bg-stone-100 dark:bg-stone-800/80 p-2 rounded-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-2 pl-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                AI Vision Scanning Mode:
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setUseKisanScanner(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  useKisanScanner
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Kisan AI Scanner HUD</span>
              </button>
              <button
                type="button"
                onClick={() => setUseKisanScanner(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !useKisanScanner
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Classic Selector</span>
              </button>
            </div>
          </div>

          {useKisanScanner ? (
            <KisanAICropScanner
              initialCrop={cropState.selectedCrop || undefined}
              onScanComplete={handleKisanScannerComplete}
              onCancel={() => setCurrentSubStep(1)}
            />
          ) : (
            <QualityPhotoSubStep
              language={language}
              cropState={cropState}
              onSelectGrade={handleSelectGrade}
              onPhotoSelected={handlePhotoSelected}
              onOpenWebcamModal={() => setIsWebcamModalOpen(true)}
              onStartAIVerification={handleStartAIVerification}
              onBack={() => setCurrentSubStep(1)}
            />
          )}
        </div>
      )}

      {/* Sub-step 3: AI Verification & Explainable AI */}
      {currentSubStep === 3 && (
        <AIVerificationSubStep
          language={language}
          cropState={cropState}
          isAnalyzing={isAnalyzing}
          onAcceptAIGrade={handleAcceptAIGrade}
          onConfirmVerifiedGrade={handleConfirmVerifiedGrade}
          onRequestReupload={handleRequestReupload}
          onSubmitDisputeManualReview={handleSubmitDisputeManualReview}
          onBack={() => setCurrentSubStep(2)}
        />
      )}

      {/* Webcam Hardware Capture Modal */}
      <WebcamCaptureModal
        isOpen={isWebcamModalOpen}
        onClose={() => setIsWebcamModalOpen(false)}
        onCapture={(base64) => {
          handlePhotoSelected(base64);
          setIsWebcamModalOpen(false);
        }}
        cropName={cropState.selectedCrop?.name || 'Produce'}
      />
    </div>
  );
};
