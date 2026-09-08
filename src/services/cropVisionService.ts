import { AIQualityAssessment, CropItem, QualityGrade } from '../types/krishi';

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
            message: 'Image resolution is too low. Please capture a clear photo of your produce.',
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
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            totalBrightness += brightness;
          }

          const avgBrightness = totalBrightness / pixelCount;

          if (avgBrightness < 12) {
            return resolve({
              valid: false,
              issue: 'too_dark',
              message: 'Photo is completely pitch-black or lens was covered. Please capture in bright daylight.',
            });
          }

          if (avgBrightness > 252) {
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
        resolve({ valid: false, issue: 'corrupt', message: 'Could not load image file. Please provide a standard JPG or PNG.' });
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

  const rawGrade = data.grade !== undefined ? data.grade : data.suggestedGrade;
  const isRotOrMold = Boolean(
    data.qualityFactors?.visibleRot === true ||
    data.qualityFactors?.visibleMold === true ||
    rawGrade === 'REJECT' ||
    data.status === 'REJECT'
  );

  const isMismatch = Boolean(data.cropMatch === false || data.status === 'CROP_MISMATCH');
  const isUnclear = Boolean(
    data.status === 'IMAGE_UNCLEAR' ||
    data.status === 'INSUFFICIENT_IMAGE' ||
    data.imageQuality === 'insufficient'
  );

  // CRITICAL: NO DEFAULT GRADE!
  // If unclear, mismatch, or server error -> grade MUST BE NULL!
  let suggestedGrade: QualityGrade | 'REJECT' | null = null;
  if (isRotOrMold) {
    suggestedGrade = 'REJECT';
  } else if (isMismatch || isUnclear) {
    suggestedGrade = null;
  } else if (rawGrade === 'A' || rawGrade === 'B' || rawGrade === 'C') {
    suggestedGrade = rawGrade;
  } else if (rawGrade === 'REJECT') {
    suggestedGrade = 'REJECT';
  } else {
    suggestedGrade = null; // NEVER default to 'B'
  }

  const status = isRotOrMold
    ? 'REJECT'
    : isMismatch
    ? 'CROP_MISMATCH'
    : isUnclear
    ? 'IMAGE_UNCLEAR'
    : data.status || 'ANALYZED';

  const verdict = isRotOrMold
    ? 'REJECT'
    : isMismatch
    ? 'WARNING'
    : isUnclear
    ? 'INSUFFICIENT_IMAGE'
    : 'ACCEPT';

  const confidenceScore =
    typeof data.confidenceScore === 'number'
      ? data.confidenceScore
      : data.confidence === 'high'
      ? 0.92
      : data.confidence === 'low'
      ? 0.45
      : 0.75;

  const confidenceLevel =
    data.confidence === 'high'
      ? 'High'
      : data.confidence === 'low'
      ? 'Low'
      : 'Medium';

  const observations = Array.isArray(data.observations) && data.observations.length > 0
    ? data.observations.map(String)
    : [
        `Harvest sample inspected against certified standards`,
        `Assessed visible freshness and surface characteristics`,
      ];

  const limitations = Array.isArray(data.limitations) && data.limitations.length > 0
    ? data.limitations.map(String)
    : [
        'Assessment is based only on visible characteristics in the photograph.',
        'AI visual quality assessment is an estimate based on visible characteristics and does not replace certified physical or laboratory inspection.',
      ];

  const qualityFactors = {
    appearance: data.qualityFactors?.appearance || (isRotOrMold ? 'poor' : 'good'),
    uniformity: (data.qualityFactors?.uniformity || (isRotOrMold ? 'poor' : 'good')) as any,
    visible_damage: (isRotOrMold ? 'high' : data.qualityFactors?.physicalDamage || 'none') as any,
    physicalDamage: (isRotOrMold ? 'high' : data.qualityFactors?.physicalDamage || 'none') as any,
    discoloration: (isRotOrMold ? 'severe' : data.qualityFactors?.discoloration || 'none') as any,
    freshness: (isRotOrMold ? 'poor' : data.qualityFactors?.freshness || 'good') as any,
    maturity: data.qualityFactors?.maturity || (isRotOrMold ? 'deteriorating' : 'appropriate'),
    visibleRot: isRotOrMold,
    visibleMold: Boolean(data.qualityFactors?.visibleMold || isRotOrMold),
    insectDamage: data.qualityFactors?.insectDamage || 'none_visible',
    cleanliness: data.qualityFactors?.cleanliness || 'good',
  };

  return {
    cropDetected: data.detectedCrop || data.cropDetected || expectedCropName,
    detectedCrop: data.detectedCrop || data.cropDetected || expectedCropName,
    selectedCrop: data.selectedCrop || expectedCropName,
    cropMatch: !isMismatch,
    imageQuality: data.imageQuality || (isUnclear ? 'insufficient' : 'good'),
    status,
    suggestedGrade,
    verdict,
    rotDetected: isRotOrMold,
    pestDamageDetected: Boolean(
      qualityFactors.insectDamage === 'moderate' || qualityFactors.insectDamage === 'severe'
    ),
    rejectionReasons: isRotOrMold
      ? observations.filter((o) =>
          o.toLowerCase().includes('rot') ||
          o.toLowerCase().includes('mold') ||
          o.toLowerCase().includes('deteriorat') ||
          o.toLowerCase().includes('decay') ||
          o.toLowerCase().includes('damage')
        )
      : [],
    confidenceScore,
    confidenceLevel,
    observations,
    qualityFactors,
    limitations,
    needsManualReview: Boolean(
      data.needsManualReview || isRotOrMold || isMismatch || isUnclear || suggestedGrade === null
    ),
    analyzedAt: new Date().toISOString(),
    error: data.error,
  };
}

// Calls server-side Gemini Vision API (/api/crop/analyze)
export async function analyzeCropPhoto(
  request: AnalyzeCropRequest
): Promise<AIQualityAssessment> {
  const { imageFileOrBase64, selectedCrop } = request;

  // 1. Client-side pre-validation
  const preCheck = await preValidateImage(imageFileOrBase64);
  if (!preCheck.valid) {
    return {
      cropDetected: selectedCrop.name,
      detectedCrop: selectedCrop.name,
      selectedCrop: selectedCrop.name,
      cropMatch: true,
      imageQuality: preCheck.issue === 'too_dark' ? 'dark' : 'insufficient',
      status: 'IMAGE_UNCLEAR',
      verdict: 'INSUFFICIENT_IMAGE',
      suggestedGrade: null, // CRITICAL: null when unclear
      rotDetected: false,
      pestDamageDetected: false,
      rejectionReasons: [preCheck.message || 'Image clarity is insufficient for visual analysis.'],
      confidenceScore: 0.2,
      confidenceLevel: 'Low',
      observations: [preCheck.message || 'Image cannot be analyzed.'],
      qualityFactors: {
        freshness: 'poor',
        uniformity: 'poor',
        discoloration: 'none',
        visibleRot: false,
        visibleMold: false,
      },
      limitations: ['Please take a clear photo in good daylight.'],
      needsManualReview: true,
      analyzedAt: new Date().toISOString(),
      error: preCheck.message,
    };
  }

  // 2. Call server-side Gemini endpoint (POST /api/crop/analyze)
  try {
    const response = await fetch('/api/crop/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageFileOrBase64,
        crop: selectedCrop.name,
        cropName: selectedCrop.name,
        cropId: selectedCrop.id,
        category: selectedCrop.category,
        qualityProfile: selectedCrop.qualityProfile,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      return {
        cropDetected: selectedCrop.name,
        detectedCrop: selectedCrop.name,
        selectedCrop: selectedCrop.name,
        cropMatch: true,
        imageQuality: 'insufficient',
        status: 'ERROR',
        verdict: 'ERROR',
        suggestedGrade: null, // CRITICAL: NEVER default to Grade B!
        rotDetected: false,
        pestDamageDetected: false,
        confidenceScore: 0,
        confidenceLevel: 'Low',
        observations: [
          errJson.error || 'AI Vision service is temporarily unavailable.',
          'Please select your produce quality grade manually or capture another photo.',
        ],
        qualityFactors: {
          freshness: 'fair',
          uniformity: 'fair',
          discoloration: 'none',
          visibleRot: false,
          visibleMold: false,
        },
        limitations: [
          'AI visual quality assessment is an estimate and does not replace certified physical inspection.',
        ],
        needsManualReview: true,
        analyzedAt: new Date().toISOString(),
        error: errJson.error || `Server error: ${response.status}`,
      };
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
      detectedCrop: selectedCrop.name,
      selectedCrop: selectedCrop.name,
      cropMatch: true,
      status: 'ERROR',
      verdict: 'ERROR',
      suggestedGrade: null, // CRITICAL: null on failure
      rotDetected: false,
      pestDamageDetected: false,
      confidenceScore: 0,
      confidenceLevel: 'Low',
      observations: [
        'Could not complete AI vision analysis: ' + (err.message || 'Network error'),
        'Farmer can confirm quality grade manually to continue.',
      ],
      qualityFactors: {
        freshness: 'fair',
        uniformity: 'fair',
        discoloration: 'none',
        visibleRot: false,
        visibleMold: false,
      },
      limitations: ['Farmer can confirm quality grade manually to continue.'],
      needsManualReview: true,
      analyzedAt: new Date().toISOString(),
      error: err.message || 'Analysis failed',
    };
  }
}
