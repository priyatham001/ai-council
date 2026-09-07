import { AIQualityAssessment, CropItem, QualityGrade } from '../types/krishi';
import { getCropQualityStandard } from '../data/cropQualityStandards';

interface AnalyzeCropRequest {
  imageFileOrBase64: string;
  selectedCrop: CropItem;
}

// Client-side quick image pre-validation (checks dimensions, blackness, extreme darkness)
export async function preValidateImage(base64Data: string): Promise<{
  valid: boolean;
  issue?: 'too_dark' | 'too_bright' | 'too_small' | 'corrupt';
  message?: string;
}> {
  return new Promise((resolve) => {
    try {
      if (!base64Data || base64Data.length < 200) {
        return resolve({ valid: false, issue: 'corrupt', message: 'Image data is incomplete or corrupted.' });
      }

      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          return resolve({
            valid: false,
            issue: 'too_small',
            message: 'Image resolution is too low. Please upload a clear photo of at least 300x300 pixels.',
          });
        }

        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(img.width, 100);
          canvas.height = Math.min(img.height, 100);
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve({ valid: true });

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          let totalBrightness = 0;
          const pixelCount = data.length / 4;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Standard luminance formula
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            totalBrightness += brightness;
          }

          const avgBrightness = totalBrightness / pixelCount;

          if (avgBrightness < 15) {
            return resolve({
              valid: false,
              issue: 'too_dark',
              message: 'Photo is completely pitch-black or lens was covered. Please capture in bright daylight.',
            });
          }

          if (avgBrightness > 250) {
            return resolve({
              valid: false,
              issue: 'too_bright',
              message: 'Photo is completely overexposed or blank white. Please point camera at the crop.',
            });
          }

          resolve({ valid: true });
        } catch {
          resolve({ valid: true });
        }
      };

      img.onerror = () => {
        resolve({ valid: false, issue: 'corrupt', message: 'Could not load image. Please provide a standard JPG or PNG.' });
      };

      img.src = base64Data;
    } catch {
      resolve({ valid: true });
    }
  });
}

// Validates the parsed structure from Gemini server response
export function validateAIResponse(data: any, expectedCropName: string): AIQualityAssessment | null {
  if (!data || typeof data !== 'object') return null;

  const validGrades = ['A', 'B', 'C', 'REJECT', 'Custom'];
  let suggestedGrade: QualityGrade | 'REJECT' = validGrades.includes(data.suggestedGrade)
    ? data.suggestedGrade
    : 'B';

  const rotDetected = Boolean(
    data.rotDetected ||
    data.qualityFactors?.visibleRot === true ||
    data.suggestedGrade === 'REJECT' ||
    data.status === 'REJECT' ||
    data.verdict === 'REJECT'
  );
  const pestDamageDetected = Boolean(data.pestDamageDetected || data.qualityFactors?.visible_damage === 'high');

  let status: 'ACCEPTABLE' | 'REJECT' | 'MISMATCH' | 'INSUFFICIENT_IMAGE' | 'ERROR' | 'AI_UNAVAILABLE' =
    data.status || 'ACCEPTABLE';

  let verdict: 'ACCEPT' | 'REJECT' | 'WARNING' | 'INSUFFICIENT_IMAGE' | 'ERROR' = 'ACCEPT';

  if (data.status === 'AI_UNAVAILABLE' || data.verdict === 'ERROR') {
    status = 'AI_UNAVAILABLE';
    verdict = 'ERROR';
  } else if (rotDetected || suggestedGrade === 'REJECT' || data.verdict === 'REJECT' || data.status === 'REJECT') {
    status = 'REJECT';
    verdict = 'REJECT';
    suggestedGrade = 'REJECT';
  } else if (data.cropMatch === false || data.status === 'MISMATCH' || data.verdict === 'WARNING') {
    status = 'MISMATCH';
    verdict = 'WARNING';
    suggestedGrade = 'REJECT';
  } else if (data.status === 'INSUFFICIENT_IMAGE' || data.verdict === 'INSUFFICIENT_IMAGE') {
    status = 'INSUFFICIENT_IMAGE';
    verdict = 'INSUFFICIENT_IMAGE';
  }

  const confidenceScore =
    typeof data.confidenceScore === 'number'
      ? Math.max(0, Math.min(1, data.confidenceScore))
      : 0.85;

  let confidenceLevel: 'High' | 'Medium' | 'Low' = 'Medium';
  const confStr = String(data.confidenceLevel || data.confidence || '').toLowerCase();
  if (confStr.includes('high') || confidenceScore >= 0.85) {
    confidenceLevel = 'High';
  } else if (confStr.includes('low') || confidenceScore < 0.65) {
    confidenceLevel = 'Low';
  }

  const rejectionReasons: string[] = Array.isArray(data.rejectionReasons) && data.rejectionReasons.length > 0
    ? data.rejectionReasons.map(String)
    : rotDetected
    ? ['Visible fungal rot, mold spores, or decomposing necrotic tissue observed in harvest sample']
    : [];

  const observations: string[] = Array.isArray(data.observations) && data.observations.length > 0
    ? data.observations.map(String)
    : [
        'Visible grain / fruit texture inspected from surface lighting',
        'Overall color uniformity consistent with harvest sample',
        'Evaluated against Agmark / Mandi FAQ visual standards',
      ];

  const limitations: string[] = Array.isArray(data.limitations) && data.limitations.length > 0
    ? data.limitations.map(String)
    : [
        'AI visual estimate — not an accredited laboratory chemical certification',
        'Exact moisture % requires a physical moisture meter',
        'Internal oil %, protein %, and pesticide residues require laboratory assay',
      ];

  const qualityFactors = {
    appearance: (data.qualityFactors?.appearance || (rotDetected ? 'poor' : 'good')) as 'good' | 'medium' | 'poor',
    uniformity: (data.qualityFactors?.uniformity === 'poor' ? 'low' : data.qualityFactors?.uniformity === 'high' ? 'high' : 'medium') as 'high' | 'medium' | 'low',
    visible_damage: (rotDetected ? 'high' : (data.qualityFactors?.visible_damage || data.qualityFactors?.physicalDamage === 'none' ? 'none' : 'low')) as 'none' | 'low' | 'medium' | 'high',
    discoloration: (rotDetected ? 'high' : (data.qualityFactors?.discoloration || 'none')) as 'none' | 'low' | 'medium' | 'high',
    freshness: (rotDetected ? 'poor' : (data.qualityFactors?.freshness || 'good')) as 'good' | 'medium' | 'poor',
    ripeness: data.qualityFactors?.ripeness || (rotDetected ? 'Overripe / Decayed' : 'Optimal harvest maturity'),
    visibleRot: rotDetected,
    visibleMold: Boolean(data.qualityFactors?.visibleMold || rotDetected),
  };

  return {
    cropDetected: String(data.cropDetected || expectedCropName),
    cropMatch: Boolean(data.cropMatch !== false && status !== 'MISMATCH'),
    imageQuality: data.imageQuality || 'good',
    status,
    suggestedGrade,
    verdict,
    rotDetected,
    pestDamageDetected,
    rejectionReasons,
    referenceStandardMatched: data.referenceStandardMatched || expectedCropName,
    standardCriteriaChecked: Array.isArray(data.standardCriteriaChecked)
      ? data.standardCriteriaChecked.map(String)
      : ['Evaluated against AGMARK Mandi Standards'],
    confidenceScore,
    confidenceLevel,
    observations,
    qualityFactors,
    limitations,
    needsManualReview: Boolean(data.needsManualReview || rotDetected || verdict === 'INSUFFICIENT_IMAGE' || status === 'MISMATCH'),
    analyzedAt: new Date().toISOString(),
    error: data.error,
  };
}

// Calls server-side Gemini Vision API (/api/analyze-crop)
export async function analyzeCropPhoto(
  request: AnalyzeCropRequest
): Promise<AIQualityAssessment> {
  const { imageFileOrBase64, selectedCrop } = request;

  // 1. Client-side pre-validation
  const preCheck = await preValidateImage(imageFileOrBase64);
  if (!preCheck.valid) {
    return {
      cropDetected: selectedCrop.name,
      cropMatch: true,
      imageQuality: preCheck.issue === 'too_dark' ? 'dark' : 'insufficient',
      status: 'INSUFFICIENT_IMAGE',
      verdict: 'INSUFFICIENT_IMAGE',
      suggestedGrade: 'REJECT',
      rotDetected: false,
      pestDamageDetected: false,
      rejectionReasons: [preCheck.message || 'Image clarity is insufficient for visual analysis.'],
      confidenceScore: 0.2,
      confidenceLevel: 'Low',
      observations: [preCheck.message || 'Image cannot be analyzed.'],
      qualityFactors: {
        appearance: 'poor',
        uniformity: 'low',
        visible_damage: 'none',
        discoloration: 'none',
        freshness: 'poor',
      },
      limitations: ['Please take a clear photo in good daylight.'],
      needsManualReview: true,
      analyzedAt: new Date().toISOString(),
      error: preCheck.message,
    };
  }

  // 2. Call server-side Gemini endpoint
  try {
    const response = await fetch('/api/analyze-crop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageFileOrBase64,
        cropId: selectedCrop.id,
        cropName: selectedCrop.name,
        category: selectedCrop.category,
        qualityProfile: selectedCrop.qualityProfile,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      if (errJson?.status === 'AI_UNAVAILABLE') {
        return {
          cropDetected: selectedCrop.name,
          cropMatch: true,
          status: 'AI_UNAVAILABLE',
          verdict: 'ERROR',
          suggestedGrade: 'REJECT',
          rotDetected: false,
          pestDamageDetected: false,
          confidenceScore: 0,
          confidenceLevel: 'Low',
          observations: [errJson.error || 'AI Vision service is temporarily unavailable.'],
          qualityFactors: {
            appearance: 'medium',
            uniformity: 'medium',
            visible_damage: 'low',
            discoloration: 'low',
            freshness: 'good',
          },
          limitations: ['Manual inspection required at Mandi gate.'],
          needsManualReview: true,
          analyzedAt: new Date().toISOString(),
          error: errJson.error || 'AI vision service unavailable',
        };
      }

      throw new Error(errJson.error || `Server error: ${response.status}`);
    }

    const json = await response.json();
    const validated = validateAIResponse(json, selectedCrop.name);
    if (validated) {
      return validated;
    }

    throw new Error('Malformed AI response');
  } catch (err: any) {
    console.error('Error in analyzeCropPhoto:', err);
    return {
      cropDetected: selectedCrop.name,
      cropMatch: true,
      status: 'ERROR',
      verdict: 'ERROR',
      suggestedGrade: 'REJECT',
      rotDetected: false,
      pestDamageDetected: false,
      confidenceScore: 0,
      confidenceLevel: 'Low',
      observations: ['Could not complete AI vision analysis: ' + (err.message || 'Network error')],
      qualityFactors: {
        appearance: 'medium',
        uniformity: 'medium',
        visible_damage: 'low',
        discoloration: 'low',
        freshness: 'good',
      },
      limitations: ['Farmer can confirm quality grade manually to continue.'],
      needsManualReview: true,
      analyzedAt: new Date().toISOString(),
      error: err.message || 'Analysis failed',
    };
  }
}
