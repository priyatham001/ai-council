export type Language = 'en' | 'te' | 'hi' | 'mr';

export type CropCategory = 'cereal' | 'commercial' | 'horticulture' | 'oilseed' | 'vegetable' | 'fruit' | 'pulse';

export type WeightUnit = 'kg' | 'quintal' | 'tonne';

export type FreshnessStatus = 'fresh' | 'aging' | 'stale';

export type PriceTrendDirection = 'increasing' | 'decreasing' | 'stable';

export type VehicleTypeId = 'mini_truck' | 'tractor' | 'pickup' | 'truck' | 'custom';

export interface VehicleConfig {
  id: VehicleTypeId;
  name: string;
  nameTelugu: string;
  nameHindi: string;
  nameMarathi: string;
  capacityQuintals: number;
  baseRatePerKm: number; // in ₹
  loadingChargePerQuintal: number; // in ₹
  description: string;
}

export interface CropQuality {
  grade: 'Grade A' | 'Grade B' | 'Grade C' | 'Custom';
  variety?: string;
  moisturePct?: number;
  damagePct?: number;
  packagingType?: string;
  photoUrl?: string;
  photoAnalysis?: string;
  priceModifierPct: number; // e.g. +5% for Grade A, -5% for Grade C
}

export interface TransporterProfile {
  id: string;
  name: string;
  vehicleType: VehicleTypeId;
  vehicleName: string;
  capacityQuintals: number;
  ratePerKm: number;
  baseLocation: string;
  district: string;
  state: string;
  contactPhone: string;
  verified: boolean;
  rating: number;
  tripsCompleted: number;
  isAvailable: boolean;
}

export interface FarmerLocation {
  state: string;
  district: string;
  villageOrTown: string;
  lat: number;
  lng: number;
  isGps: boolean;
  isDemo: boolean;
}

export interface CropInfo {
  id: string;
  name: string;
  nameTelugu: string;
  nameHindi: string;
  nameMarathi: string;
  category: CropCategory;
  defaultUnit: WeightUnit;
  standardPriceRange: {
    min: number;
    max: number;
    modal: number;
  };
  mandiChargesPct: number; // e.g. 1% to 1.5% APMC fee
  typicalDensityKgPerQuintal: number;
  description: string;
}

export interface Market {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  marketType: 'APMC Mandi' | 'Private Yard' | 'FPO Collection Center' | 'Processing Mill';
  contactPerson?: string;
  contactPhone?: string;
  operatingHours?: string;
  distanceKm?: number;
  verified: boolean;
  isDemo: boolean;
}

export interface BuyerProfile {
  id: string;
  name: string;
  businessType: 'Wholesale Trader' | 'Food Processor' | 'Export Agent' | 'FPO Aggregator' | 'Government Agency';
  marketName: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  acceptedCrops: string[];
  capacityQuintalsPerDay: number;
  indicativePricePremiumPct: number; // e.g. +2% above mandi
  contactPerson?: string;
  contactPhone?: string;
  verified: boolean;
  isDemo: boolean;
  lastActive: string;
}

export interface MarketPriceObservation {
  id: string;
  marketId: string;
  marketName: string;
  district: string;
  state: string;
  cropId: string;
  cropName: string;
  pricePerQuintal: number;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceUnit: string;
  priceFreshness: FreshnessStatus;
  updatedAt: string;
  trend: PriceTrendDirection;
  trendPct: number;
  source: string;
  sourceUrl?: string;
  dataQuality: 'High' | 'Verified' | 'Sample';
  isVerified: boolean;
  isDemo: boolean;
}

export interface TransportCalculationParams {
  distanceKm: number;
  quantityInQuintals: number;
  vehicleType: VehicleTypeId;
  customRatePerKm?: number;
  isRoundTrip: boolean;
  loadingUnloadingRatePerQuintal?: number;
  mandiCessPct?: number;
}

export interface TransportCalculationResult {
  distanceKm: number;
  vehicleType: VehicleTypeId;
  vehicleName: string;
  ratePerKm: number;
  isRoundTrip: boolean;
  billableDistanceKm: number;
  tripsNeeded: number;
  baseTransportCost: number;
  loadingUnloadingCost: number;
  mandiCharges: number;
  otherCharges: number;
  totalEstimatedCost: number;
  costPerQuintal: number;
}

export interface MarketComparisonItem {
  rank: number;
  marketId: string;
  marketName: string;
  district: string;
  state: string;
  marketType: string;
  distanceKm: number;
  cropPricePerQuintal: number;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  quantityInQuintals: number;
  grossRevenue: number;
  transportCost: number;
  loadingCost: number;
  marketCharges: number;
  totalCost: number;
  estimatedNetReturn: number;
  effectivePricePerQuintal: number;
  priceFreshness: FreshnessStatus;
  trend: PriceTrendDirection;
  trendPct: number;
  isRecommended: boolean;
  recommendationReason: string;
  whyNotHighestGross?: string;
  buyerContactAvailable: boolean;
  buyerName?: string;
  buyerPhone?: string;
  updatedAt: string;
  source: string;
  lat: number;
  lng: number;
}

export interface AIInsightSection {
  recommendedMarket: string;
  estimatedNetReturn: number;
  summary: string;
  whyExplanation: string;
  facts: string[];
  calculations: string[];
  estimates: string[];
  aiInsights: string[];
  tradeoffExplanation: string;
  alternativeOption?: {
    marketName: string;
    distanceKm: number;
    cropPricePerQuintal: number;
    estimatedNetReturn: number;
    reason: string;
  };
  confidenceLevel: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  qualityMatchExplanation?: string;
  riskAndUncertainties: string[];
  providerStatus: {
    gemini: { active: boolean; model: string };
    openai: { active: boolean; model: string };
    claude: { active: boolean; model: string };
    mistral: { active: boolean; model: string };
  };
  generatedAt: string;
}

export interface PriceTrendPoint {
  date: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  volumeQuintals: number;
}

export interface CropPriceTrendSeries {
  cropId: string;
  cropName: string;
  marketId: string;
  marketName: string;
  period: '7d' | '30d' | '90d';
  points: PriceTrendPoint[];
  averagePrice: number;
  highestPrice: number;
  lowestPrice: number;
  volatilityPct: number;
  isSufficientData: boolean;
}

export interface PriceForecastResponse {
  crop: string;
  market: string;
  currentPrice: number;
  predictedRange: {
    min: number;
    max: number;
  };
  expectedPrice: number;
  direction: 'up' | 'down' | 'stable';
  confidence: 'low' | 'medium' | 'high';
  explanation: string;
  disclaimer: string;
  forecastAvailable: boolean;
}

export interface FarmerSearchHistory {
  id: string;
  createdAt: string;
  cropName: string;
  quantity: number;
  unit: WeightUnit;
  quantityInQuintals: number;
  farmerLocation: string;
  marketsComparedCount: number;
  recommendedMarket: string;
  recommendedNetReturn: number;
  grossRevenue: number;
  estimatedTransport: number;
  distanceKm: number;
  isDemo: boolean;
}

export interface DiscoveryRequestPayload {
  farmerLocation: FarmerLocation;
  cropId: string;
  customCropName?: string;
  quantity: number;
  unit: WeightUnit;
  vehicleType: VehicleTypeId;
  customRatePerKm?: number;
  isRoundTrip: boolean;
  enableDemoMode?: boolean;
  quality?: CropQuality;
}

export interface MarketCalculationResult {
  crop: CropInfo;
  quantityInQuintals: number;
  rankedMarkets: MarketComparisonItem[];
  recommendedMarket: MarketComparisonItem;
  aiInsight: AIInsightSection;
}

export type AIInsightResult = AIInsightSection;

export interface DiscoveryResponse {
  success: boolean;
  farmerLocation: FarmerLocation;
  crop: CropInfo;
  quantity: {
    amount: number;
    unit: WeightUnit;
    quintals: number;
  };
  transportConfig: {
    vehicleType: VehicleTypeId;
    ratePerKm: number;
    isRoundTrip: boolean;
  };
  recommendedMarket: MarketComparisonItem;
  rankedMarkets: MarketComparisonItem[];
  aiInsight: AIInsightSection;
  isDemo: boolean;
  searchId: string;
  error?: string;
}
