export type UserRole = 'farmer' | 'fpo' | 'buyer' | 'admin';
export type Language = 'en' | 'hi' | 'mr' | 'te' | 'ta' | 'kn' | 'ml' | 'bn' | 'gu' | 'pa' | 'or';

export interface FarmerPersona {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  district: string;
  village: string;
  primaryCrop: string;
  crop?: string;
  variety?: string;
  secondaryCrops: string[];
  fpoName: string;
  farmSizeAcres: number;
  acres?: number;
  lotSizeQuintals?: number;
  mandiId?: string;
  mandiName?: string;
  storageAvailable: boolean;
  preferredLanguage: Language;
  phone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  location: string;
  district: string;
  state: string;
  verified: boolean;
  avatarUrl?: string;
  fpoName?: string;
  buyerCompany?: string;
}


export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  category: 'Vegetable' | 'Grain' | 'Cash Crop' | 'Fruit' | 'Pulse';
  unit: string; // 'quintal'
  benchmarkPrice: number;
  currentModalPrice: number;
  priceChangePct: number;
  majorVarieties?: string[];
  gradeStandards: {
    gradeA: string;
    gradeB: string;
    gradeC: string;
  };
}

export interface MarketPricePoint {
  date: string;
  price: number;
  arrivals: number;
}

export interface MandiMarket {
  id: string;
  name: string;
  district: string;
  state: string;
  distanceKm: number;
  cropId: string;
  cropName: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceChangePct?: number;
  arrivalsQuintals: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  weeklyTrend: MarketPricePoint[];
  monthlyTrend: MarketPricePoint[];
}

export interface BuyerProfile {
  id: string;
  name: string;
  companyName: string;
  businessType: 'Food Processing' | 'Retail Chain' | 'Wholesale Trader' | 'Exporter' | 'Agri Aggregator';
  location: string;
  district: string;
  state: string;
  distanceKm: number;
  requiredCrops: string[];
  requiredQuantityMin: number;
  requiredQuantityMax: number;
  qualityRequirement: 'Grade A' | 'Grade B' | 'Grade A or B';
  expectedPriceMin: number;
  expectedPriceMax: number;
  paymentWindowHours: number;
  paymentReliabilityPct: number; // e.g. 96
  rating: number; // 4.8
  reviewCount: number;
  kycVerified: boolean;
  gstVerified: boolean;
  paymentHistoryVerified: boolean;
  businessVerified: boolean;
  tradeVolumeTotalQuintals: number;
  phone: string;
  email: string;
}

export interface QualityMetrics {
  size: number;      // 0-100
  color: number;     // 0-100
  freshness: number; // 0-100
  damage: number;    // 0-100 (higher means less damage / better quality)
  moisture: number;  // 0-100 optimal
  overallScore: number;
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  aiAssessed?: boolean;
}

export type LotStatus =
  | 'Draft'
  | 'Published'
  | 'Offers Received'
  | 'Offer Accepted'
  | 'In Transit'
  | 'Delivered'
  | 'Payment Processing'
  | 'Completed';

export interface DigitalLot {
  id: string;
  lotNumber: string; // e.g. SAL-2026-BVR-TOM-00421
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  location: string;
  district: string;
  state: string;
  crop: string;
  variety: string;
  quantityQuintals: number;
  harvestDate: string;
  expectedPricePerQ: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C';
  qualityMetrics: QualityMetrics;
  description: string;
  imageUrl?: string;
  status: LotStatus;
  createdAt: string;
  qrCodeSvgData?: string;
  isAggregated?: boolean;
  fpoId?: string;
  acceptedOfferId?: string;
  buyerId?: string;
  buyerName?: string;
  harvestStatus?: 'Ready to Sell' | 'Harvesting Soon' | 'Future Harvest';
  contactMethod?: 'Phone Call' | 'WhatsApp';
  aiEstimatedGrade?: 'Grade A' | 'Grade B' | 'Grade C';
  farmerConfirmedGrade?: 'Grade A' | 'Grade B' | 'Grade C';
  farmerNotes?: string;
  aiConfidencePct?: number;
  aiObservations?: string[];
  latitude?: number;
  longitude?: number;
  interestedBuyers?: Array<{
    id: string;
    buyerName: string;
    buyerPhone: string;
    quantityQuintals: number;
    notes?: string;
    createdAt: string;
  }>;
}

export interface BuyerOffer {
  id: string;
  offerNumber: string;
  lotId: string;
  buyerId: string;
  buyerName: string;
  buyerRating: number;
  buyerLocation: string;
  buyerDistanceKm: number;
  buyerReliabilityPct: number;
  offeredPricePerQ: number;
  quantityQuintals: number;
  transportAllowance: number;
  handlingCost: number;
  estimatedNetRealizationPerQ: number;
  totalNetRealization: number;
  grossSaleValue: number;
  paymentTerms: string; // 'Within 24 hours' | 'Within 48 hours' | '7 days'
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
  notes?: string;
}

export interface LogisticsVehicle {
  id: string;
  name: string;
  type: 'Tata Ace (1.5T)' | 'Pickup 407 (3T)' | 'Eicher 14ft (7T)' | 'Multi-Axle (16T)';
  capacityQuintals: number;
  baseFare: number;
  perKmRate: number;
  driverName: string;
  driverPhone: string;
  rating: number;
  available: boolean;
  district: string;
}

export interface LogisticsBooking {
  id: string;
  bookingNumber: string;
  lotId: string;
  farmerId: string;
  vehicleId: string;
  vehicleName: string;
  pickupLocation: string;
  dropLocation: string;
  distanceKm: number;
  totalEstimatedCost: number;
  scheduledDate: string;
  status: 'Scheduled' | 'Vehicle Dispatched' | 'In Transit' | 'Delivered';
  driverName: string;
  driverPhone: string;
}

export interface StorageWarehouse {
  id: string;
  name: string;
  operator: string;
  location: string;
  district: string;
  distanceKm: number;
  totalCapacityQuintals: number;
  availableCapacityQuintals: number;
  pricePerDayPerQuintal: number;
  temperatureControlled: boolean;
  humidityControlled: boolean;
  rating: number;
  phone: string;
  address: string;
}

export interface StorageBooking {
  id: string;
  bookingNumber: string;
  warehouseId: string;
  warehouseName: string;
  farmerId: string;
  crop: string;
  quantityQuintals: number;
  startDate: string;
  estimatedDays: number;
  totalEstimatedCost: number;
  status: 'Confirmed' | 'Active' | 'Discharged';
}

export type TransactionStatus =
  | 'Initiated'
  | 'Offer Accepted'
  | 'Pickup Scheduled'
  | 'In Transit'
  | 'Delivered'
  | 'Weighment Verified'
  | 'Payment Processing'
  | 'Payment Completed';

export interface TimelineStep {
  stepIndex: number;
  title: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  details: string;
}

export interface Transaction {
  id: string;
  transactionNumber: string; // SAL-TXN-00421
  lotId: string;
  lotNumber: string;
  crop: string;
  quantityQuintals: number;
  agreedPricePerQ: number;
  grossAmount: number;
  transportCost: number;
  handlingCost: number;
  storageCost: number;
  otherCharges: number;
  netRealizationAmount: number;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  status: TransactionStatus;
  paymentStatus: 'Escrow Held' | 'Payment Processing' | 'Payment Completed';
  paymentDate?: string;
  paymentUtr?: string;
  createdAt: string;
  timeline: TimelineStep[];
}

export type GrievanceCategory =
  | 'Payment Delay'
  | 'Quality Dispute'
  | 'Quantity Dispute'
  | 'Transport Issue'
  | 'Buyer Issue'
  | 'Other';

export interface Grievance {
  id: string;
  ticketNumber: string; // GRV-2026-00182
  transactionId: string;
  transactionNumber: string;
  filedByName: string;
  filedByRole: UserRole;
  category: GrievanceCategory;
  description: string;
  status: 'Under Review' | 'Investigation' | 'Resolution Proposed' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  evidenceFile?: string;
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'offer' | 'price' | 'verification' | 'logistics' | 'payment' | 'grievance';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AIRecommendation {
  crop: string;
  quantityQuintals: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C';
  recommendedMarket: string;
  marketDistanceKm: number;
  recommendedBuyer: string;
  recommendedSellingWindow: string;
  expectedPriceMin: number;
  expectedPriceMax: number;
  estimatedGross: number;
  estimatedTransportCost: number;
  estimatedHandlingCost: number;
  estimatedStorageCost: number;
  estimatedNetRealization: number;
  estimatedRealizationPerQ: number;
  confidencePct: number;
  reasoning: string[];
  disclaimer: string;
  alternativeMarket?: string;
  alternativeNetRealization?: number;
  potentialAdditionalIncome?: number;
}


export interface BuyerDemandRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  crop: string;
  quantityRange: string;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C' | 'Grade A or B';
  targetPriceMin: number;
  targetPriceMax: number;
  deliveryLocation: string;
  targetDeliveryDate: string;
  paymentTerms: string;
  matchedLotsCount: number;
}
