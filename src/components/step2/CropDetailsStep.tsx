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

      {/* Sub-step 2: Farmer Selects Quality Grade & Photo */}
      {currentSubStep === 2 && (
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
