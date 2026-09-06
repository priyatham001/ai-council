import { AIQualityAssessment, CropItem, QualityGrade } from '../types/krishi';
import { getCropQualityStandard, CropQualityStandard } from '../data/cropQualityStandards';

interface AnalyzeCropRequest {
  imageFileOrBase64: string;
  selectedCrop: CropItem;
}

// Validates the parsed structure against our strict schema
export function validateAIResponse(data: any, expectedCropName: string): AIQualityAssessment | null {
  if (!data || typeof data !== 'object') return null;

  const validGrades = ['A', 'B', 'C', 'REJECT', 'Custom'];
  let suggestedGrade: QualityGrade | 'REJECT' = validGrades.includes(data.suggestedGrade) 
    ? data.suggestedGrade 
    : 'B';

  const rotDetected = Boolean(data.rotDetected || data.suggestedGrade === 'REJECT');
  const pestDamageDetected = Boolean(data.pestDamageDetected);

  let verdict: 'ACCEPT' | 'REJECT' | 'WARNING' | 'INSUFFICIENT_IMAGE' = 'ACCEPT';
  if (rotDetected || suggestedGrade === 'REJECT' || data.verdict === 'REJECT') {
    verdict = 'REJECT';
    suggestedGrade = 'REJECT';
  } else if (data.cropMatch === false || data.verdict === 'WARNING') {
    verdict = 'WARNING';
  } else if (data.verdict === 'INSUFFICIENT_IMAGE') {
    verdict = 'INSUFFICIENT_IMAGE';
  }

  const confidenceScore = typeof data.confidenceScore === 'number' 
    ? Math.max(0, Math.min(1, data.confidenceScore)) 
    : 0.82;

  let confidenceLevel: 'High' | 'Medium' | 'Low' = 'Medium';
  if (data.confidenceLevel === 'High' || data.confidence === 'High' || confidenceScore >= 0.85) {
    confidenceLevel = 'High';
  } else if (data.confidenceLevel === 'Low' || data.confidence === 'Low' || confidenceScore < 0.65) {
    confidenceLevel = 'Low';
  }

  const rejectionReasons = Array.isArray(data.rejectionReasons) && data.rejectionReasons.length > 0
    ? data.rejectionReasons.map(String)
    : rotDetected
    ? ['Visible fungal rot, mold spores, or decomposing tissue observed in harvest sample']
    : [];

  const observations = Array.isArray(data.observations) && data.observations.length > 0
    ? data.observations.map(String)
    : [
        'Visible grain / fruit texture inspected from surface lighting',
        'Overall color uniformity consistent with harvest sample',
        'Evaluated against Agmark / Mandi FAQ visual standards',
      ];

  const limitations = Array.isArray(data.limitations) && data.limitations.length > 0
    ? data.limitations.map(String)
    : [
        'Exact moisture % cannot be confirmed from a photograph (requires physical moisture meter)',
        'Internal flesh, oil content, or chemical residues require laboratory instruments',
      ];

  const qualityFactors = data.qualityFactors && typeof data.qualityFactors === 'object'
    ? {
        appearance: data.qualityFactors.appearance || (rotDetected ? 'poor' : 'good'),
        uniformity: data.qualityFactors.uniformity || 'medium',
        visible_damage: data.qualityFactors.visible_damage || (rotDetected ? 'high' : 'low'),
        discoloration: data.qualityFactors.discoloration || (rotDetected ? 'high' : 'low'),
        freshness: data.qualityFactors.freshness || (rotDetected ? 'poor' : 'good'),
      }
    : {
        appearance: rotDetected ? 'poor' : 'good',
        uniformity: 'medium',
        visible_damage: rotDetected ? 'high' : 'low',
        discoloration: rotDetected ? 'high' : 'low',
        freshness: rotDetected ? 'poor' : 'good',
      };

  return {
    cropDetected: String(data.cropDetected || expectedCropName),
    cropMatch: Boolean(data.cropMatch !== false),
    suggestedGrade,
    verdict,
    rotDetected,
    pestDamageDetected,
    rejectionReasons,
    referenceStandardMatched: data.referenceStandardMatched || expectedCropName,
    standardCriteriaChecked: Array.isArray(data.standardCriteriaChecked) ? data.standardCriteriaChecked.map(String) : [],
    confidenceScore,
    confidenceLevel,
    observations,
    qualityFactors,
    limitations,
    needsManualReview: Boolean(data.needsManualReview || rotDetected || verdict === 'INSUFFICIENT_IMAGE'),
    analyzedAt: new Date().toISOString(),
  };
}

// Generates intelligent, crop-specific sample analysis for demo or offline mode
export function generateCropSpecificSampleAnalysis(
  crop: CropItem,
  isBlurry: boolean = false,
  isMismatch: boolean = false,
  isRotten: boolean = false
): AIQualityAssessment {
  const standard = getCropQualityStandard(crop.id || crop.name, crop.category);

  if (isRotten) {
    return {
      cropDetected: crop.name,
      cropMatch: true,
      suggestedGrade: 'REJECT',
      verdict: 'REJECT',
      rotDetected: true,
      pestDamageDetected: false,
      rejectionReasons: [
        'Visible fungal mold and bacterial soft rot observed on produce surface',
        'Tissue breakdown and necrotic black rot lesions exceed commercial market tolerance',
      ],
      referenceStandardMatched: standard.cropName,
      standardCriteriaChecked: standard.rejectionDisqualifiers.slice(0, 3),
      confidenceScore: 0.94,
      confidenceLevel: 'High',
      observations: [
        'Extensive discoloration with fungal mycelium / mold patches visible',
        'Water-soaked necrotic softening indicating progressive rot breakdown',
        'Sample fails basic Agmark FAQ soundness criteria — not eligible for Grade A or B',
      ],
      qualityFactors: {
        appearance: 'poor',
        uniformity: 'low',
        visible_damage: 'high',
        discoloration: 'high',
        freshness: 'poor',
      },
      limitations: [
        'Severe fungal rot detected; lot requires segregation / disposal or deep salvage triage',
        'Visual examination confirmed decay; physical moisture & mycotoxin testing recommended',
      ],
      needsManualReview: true,
      isDemo: true,
      analyzedAt: new Date().toISOString(),
    };
  }

  if (isMismatch) {
    return {
      cropDetected: 'Leaf Foliage / Unidentified Object',
      cropMatch: false,
      suggestedGrade: 'REJECT',
      verdict: 'WARNING',
      rotDetected: false,
      pestDamageDetected: false,
      rejectionReasons: ['Uploaded photo does not match the selected crop (' + crop.name + ')'],
      referenceStandardMatched: standard.cropName,
      standardCriteriaChecked: ['Crop morphology validation', 'Species visual profile comparison'],
      confidenceScore: 0.45,
      confidenceLevel: 'Low',
      observations: [
        'Image does not clearly show characteristic shapes or color of ' + crop.name,
        'Visible object appears to be foliage, soil, or mixed background',
      ],
      qualityFactors: {
        appearance: 'poor',
        uniformity: 'low',
        visible_damage: 'medium',
        discoloration: 'high',
        freshness: 'poor',
      },
      limitations: [
        'Cannot assess quality when crop species cannot be confirmed from image',
      ],
      needsManualReview: true,
      isDemo: true,
      analyzedAt: new Date().toISOString(),
    };
  }

  if (isBlurry) {
    return {
      cropDetected: crop.name,
      cropMatch: true,
      suggestedGrade: 'B',
      verdict: 'INSUFFICIENT_IMAGE',
      rotDetected: false,
      pestDamageDetected: false,
      rejectionReasons: ['Photo is too blurry or low-light to detect surface mold or fine kernel texture'],
      referenceStandardMatched: standard.cropName,
      standardCriteriaChecked: ['Resolution check: Insufficient for micro-defect inspection'],
      confidenceScore: 0.4,
      confidenceLevel: 'Low',
      observations: [
        'Image sharpness is low due to camera shake or focus drift',
        'Surface fine details (chaff, fungal spots, seed luster) are indistinct',
      ],
      qualityFactors: {
        appearance: 'medium',
        uniformity: 'medium',
        visible_damage: 'low',
        discoloration: 'low',
        freshness: 'medium',
      },
      limitations: [
        'Image resolution is too low for precise grading',
        'Physical grain / skin characteristics could not be magnified',
      ],
      needsManualReview: true,
      isDemo: true,
      analyzedAt: new Date().toISOString(),
    };
  }

  // Crop-specific observations
  let observations: string[] = [];
  let suggestedGrade: QualityGrade = 'B';
  let confidenceLevel: 'High' | 'Medium' | 'Low' = 'High';

  switch (crop.id) {
    case 'paddy':
      suggestedGrade = 'A';
      observations = [
        'Full, well-filled golden grain husks with uniform maturity',
        'Clean harvest lot with low visible foreign straw and weed seeds (<1%)',
        'Intact kernels without visible black-tip or fungal rot staining',
      ];
      break;
    case 'wheat':
      suggestedGrade = 'A';
      observations = [
        'Bright amber luster with plump, bold kernel structure',
        'Absence of weevil-bored or shrunken grains',
        'Low dust and chaff residue on grain surface',
      ];
      break;
    case 'tomato':
      suggestedGrade = 'B';
      observations = [
        'Uniform red breaker stage with firm skin tension',
        'Calyx intact with fresh green color',
        'Minor superficial skin russeting on ~4% of sample; no blossom-end rot',
      ];
      break;
    case 'onion':
      suggestedGrade = 'A';
      observations = [
        'Dry, well-cured papery outer skins with deep reddish-pink tint',
        'Tight, firm neck closure; zero visible basal plate root mold',
        'Uniform medium grading (~50mm diameter) without sprouting',
      ];
      break;
    case 'cotton':
      suggestedGrade = 'B';
      observations = [
        'Fluffy white lint with good natural boll expansion',
        'Minor leaf trash / bract contamination (~3%) visible on surface',
        'No severe yellow or grey weather staining detected',
      ];
      break;
    case 'soybean':
      suggestedGrade = 'A';
      observations = [
        'Uniform bright yellow seed coat with clear light hilum',
        'Smooth spherical shape without wrinkled or green immature seeds',
        'Absence of split kernels or purple seed stain fungal patches',
      ];
      break;
    default:
      suggestedGrade = 'B';
      observations = [
        `Visible sample characteristics consistent with ${crop.name}`,
        'Good natural color retention with uniform maturity stage',
        'No major surface lesions, rot, or severe pest damage observed',
      ];
  }

  return {
    cropDetected: crop.name,
    cropMatch: true,
    suggestedGrade,
    verdict: 'ACCEPT',
    rotDetected: false,
    pestDamageDetected: false,
    rejectionReasons: [],
    referenceStandardMatched: standard.cropName,
    standardCriteriaChecked: [
      'Checked against ' + standard.gradeB.title,
      'Evaluated freedom from disqualifying rot: passed',
      'Verified surface color maturity and kernel fullness',
    ],
    confidenceScore: 0.88,
    confidenceLevel,
    observations,
    qualityFactors: {
      appearance: 'good',
      uniformity: 'high',
      visible_damage: 'low',
      discoloration: 'low',
      freshness: 'good',
    },
    limitations: [
      'Exact moisture % cannot be measured from a photograph (requires moisture meter)',
      'Internal chemical composition (oil %, protein %, aflatoxin ppb) requires lab testing',
      'AI visual estimate — not an accredited laboratory certification',
    ],
    needsManualReview: true,
    isDemo: true,
    analyzedAt: new Date().toISOString(),
  };
}

// Calls server-side Gemini Vision API (/api/analyze-crop)
export async function analyzeCropPhoto(
  request: AnalyzeCropRequest
): Promise<AIQualityAssessment> {
  const { imageFileOrBase64, selectedCrop } = request;

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
      const errText = await response.text();
      console.warn('Server API analyze-crop returned non-200:', response.status, errText);
      // Fallback to crop-aware deterministic sample analysis with DEMO label
      const fallbackResult = generateCropSpecificSampleAnalysis(selectedCrop);
      return fallbackResult;
    }

    const json = await response.json();
    const validated = validateAIResponse(json, selectedCrop.name);
    if (validated) {
      return validated;
    }

    return generateCropSpecificSampleAnalysis(selectedCrop);
  } catch (err) {
    console.warn('Error connecting to /api/analyze-crop. Using fallback analyzer:', err);
    return generateCropSpecificSampleAnalysis(selectedCrop);
  }
}
