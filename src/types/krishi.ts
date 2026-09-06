export type Language = 'en' | 'hi' | 'mr' | 'te';

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
  };
  category: 'cereals' | 'pulses' | 'vegetables' | 'fruits' | 'commercial' | 'other';
  icon: string;
  defaultUnit: WeightUnit;
  modalPrice: number; // ₹ per quintal (100 kg)
  minPrice: number;
  maxPrice: number;
  qualityProfile: CropQualityProfile;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  district: string;
  city?: string;
  village?: string;
  formattedAddress: string;
  source: 'gps' | 'search' | 'manual' | 'map' | 'demo';
}

export interface AIQualityFactors {
  appearance: 'good' | 'medium' | 'poor';
  uniformity: 'high' | 'medium' | 'low';
  visible_damage: 'none' | 'low' | 'medium' | 'high';
  discoloration: 'none' | 'low' | 'medium' | 'high';
  freshness: 'good' | 'medium' | 'poor';
}

export interface AIQualityAssessment {
  cropDetected: string;
  cropMatch: boolean;
  suggestedGrade: QualityGrade;
  confidenceScore: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  observations: string[];
  qualityFactors: AIQualityFactors;
  limitations: string[];
  needsManualReview: boolean;
  imageUrl?: string;
  isDemo?: boolean;
  analyzedAt: string;
}

export interface CropSelectionState {
  selectedCrop: CropItem | null;
  customCropName: string;
  quantityValue: number | '';
  quantityUnit: WeightUnit;
  normalizedKilograms: number;
  qualityGrade: QualityGrade | null;
  qualitySource: 'manual' | 'ai' | null;
  qualityConfirmed: boolean;
  aiAssessment: AIQualityAssessment | null;
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
