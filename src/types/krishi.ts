export type Language = 'te' | 'en' | 'mr';

export type CropCategory = 'all' | 'cereals' | 'pulses' | 'vegetables' | 'fruits' | 'commercial';

export type QualityGrade = 'A' | 'B' | 'C' | 'Custom';

export type WeightUnit = 'kg' | 'quintal' | 'tonne';

export interface CropQualityProfile {
  visualTraits: string[];
  defectIndicators: string[];
  physicalLimits: string[]; // e.g., moisture, internal acidity cannot be measured visually
}

export interface CropItem {
  id: string;
  name: string;
  localNames: {
    en: string;
    hi: string;
    mr: string;
    te: string;
    ta?: string;
    kn?: string;
    ml?: string;
  };
  category: 'cereals' | 'pulses' | 'vegetables' | 'fruits' | 'commercial' | 'other';
  icon: string;
  imageUrl?: string;
  defaultUnit: WeightUnit;
  modalPrice: number; // ₹ per quintal (100 kg)
  minPrice: number;
  maxPrice: number;
  qualityProfile: CropQualityProfile;
}

export type FarmerLocation = {
  id?: string;
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  district: string;
  subDistrict?: string;
  mandal?: string;
  taluka?: string;
  tehsil?: string;
  city?: string;
  town?: string;
  village?: string;
  pincode?: string;
  formattedAddress: string;
  placeId?: string;
  source: 'gps' | 'manual' | 'search' | 'map' | 'demo' | 'csv';
};

// LocationData is an alias for FarmerLocation to ensure single source of truth across all components
export type LocationData = FarmerLocation;

export interface VisualQualityMarker {
  id: string;
  type: 'good' | 'minor' | 'serious'; // 🟢 green, 🟡 yellow, 🔴 red
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string; // e.g. "✓ Uniform size", "⚠ Slight discoloration", "✕ Damaged grain detected"
  observation: string; // e.g. "Dark discoloration and possible surface damage detected."
  impact: string; // e.g. "Contributes to reducing the quality from Grade A to Grade B."
  factor: 'color' | 'uniformity' | 'surface' | 'damage';
}

export interface ExplainableAIReport {
  overallGrade: QualityGrade | 'REJECT';
  farmerGradeClaimed: QualityGrade | null;
  confidenceScore: number;
  whyExplanation: string;
  isAgreed: boolean;
  color: {
    rating: 'Good' | 'Moderate' | 'Poor';
    description: string;
    type: 'good' | 'minor' | 'serious';
  };
  uniformity: {
    rating: 'High' | 'Moderate' | 'Low';
    description: string;
    type: 'good' | 'minor' | 'serious';
  };
  surfaceQuality: {
    rating: 'Clean' | 'Minor Issues' | 'Severe Defects';
    description: string;
    type: 'good' | 'minor' | 'serious';
  };
  damage: {
    rating: 'None' | 'Minor Detected' | 'Significant Detected';
    description: string;
    type: 'good' | 'minor' | 'serious';
  };
  factorsTable: {
    factor: string;
    farmerSelected: string;
    aiAnalysis: string;
    status: 'match' | 'minor_diff' | 'major_diff';
  }[];
  markers: VisualQualityMarker[];
}

export interface AIQualityFactors {
  appearance?: 'good' | 'medium' | 'poor';
  uniformity: 'high' | 'medium' | 'low' | 'good' | 'fair' | 'poor';
  visible_damage?: 'none' | 'low' | 'medium' | 'high';
  physicalDamage?: 'none' | 'low' | 'moderate' | 'high';
  discoloration: 'none' | 'low' | 'medium' | 'moderate' | 'severe';
  freshness: 'good' | 'medium' | 'fair' | 'poor';
  maturity?: 'appropriate' | 'immature' | 'overripe' | 'deteriorating';
  ripeness?: string;
  visibleRot?: boolean;
  visibleMold?: boolean;
  insectDamage?: 'none_visible' | 'low' | 'moderate' | 'severe' | 'unknown';
  cleanliness?: 'good' | 'fair' | 'poor';
}

export interface AIQualityAssessment {
  cropDetected: string;
  detectedCrop?: string;
  selectedCrop?: string;
  cropMatch: boolean;
  imageQuality?: 'good' | 'blurry' | 'dark' | 'insufficient';
  status?:
    | 'ANALYZED'
    | 'ACCEPTABLE'
    | 'REJECT'
    | 'MISMATCH'
    | 'CROP_MISMATCH'
    | 'INSUFFICIENT_IMAGE'
    | 'IMAGE_UNCLEAR'
    | 'NEEDS_CLEARER_IMAGE'
    | 'ERROR'
    | 'AI_UNAVAILABLE';
  suggestedGrade: QualityGrade | 'REJECT' | null;
  verdict?: 'ACCEPT' | 'REJECT' | 'WARNING' | 'INSUFFICIENT_IMAGE' | 'ERROR';
  rotDetected?: boolean;
  pestDamageDetected?: boolean;
  rejectionReasons?: string[];
  referenceStandardMatched?: string;
  standardCriteriaChecked?: string[];
  confidenceScore: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  observations: string[];
  qualityFactors: AIQualityFactors;
  limitations: string[];
  needsManualReview: boolean;
  imageUrl?: string;
  isDemo?: boolean;
  analyzedAt: string;
  error?: string;
  visualMarkers?: VisualQualityMarker[];
  explainableReport?: ExplainableAIReport;
}

export interface CropSelectionState {
  selectedCrop: CropItem | null;
  customCropName: string;
  quantityValue: number | '';
  quantityUnit: WeightUnit;
  normalizedKilograms: number;
  cropPhoto: string | null; // Mandatory crop photograph base64 / blob URL
  qualityGrade: QualityGrade | null; // Initial state MUST be null! Never auto-assign Grade A/B/C
  qualitySource: 'manual' | 'ai' | null;
  qualityConfirmed: boolean;
  aiAssessment: AIQualityAssessment | null;
  authorityVerificationRequested?: boolean;
  disputeNotes?: string;
}

export interface MarketBuyer {
  id: string;
  name: string;
  type: 'APMC Trader' | 'Agri Processor' | 'Export House' | 'FPO Cooperative' | 'Direct Miller';
  rating: number;
  verified: boolean;
  paymentDays: number; // 0 for instant cash/UPI, 1-3 for bank transfer
  minQuantityKg: number;
}

export interface MarketItem {
  id: string;
  name: string;
  marketType: 'APMC Mandi' | 'Private Mandi' | 'Processing Hub' | 'FPO Collection Center';
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  roadDistanceKm?: number;
  travelTimeHours?: number;
  pricePerQuintal: number;
  marketFeePercent: number;
  unloadingChargePerQtl: number;
  buyer: MarketBuyer;
  verificationStatus: 'Verified APMC' | 'Government Monitored' | 'Certified Buyer';
  lastUpdated: string;
}

export interface MarketAnalysisResult {
  market: MarketItem;
  grossAmount: number;
  transportCost: number;
  marketFeeAmount: number;
  unloadingFeeAmount: number;
  netReturn: number;
  netPricePerQuintal: number;
  isBestOption: boolean;
  priceDeltaPerQuintal: number; // compared to modal price
}
