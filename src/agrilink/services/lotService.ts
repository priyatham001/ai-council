import { DigitalLot, QualityMetrics, LotStatus } from '../types';
import { localStorageService } from './storageService';

export const lotService = {
  getAllLots(): DigitalLot[] {
    return localStorageService.getLots();
  },

  getLotById(id: string): DigitalLot | undefined {
    return this.getAllLots().find(lot => lot.id === id);
  },

  getLotsByFarmer(farmerId: string): DigitalLot[] {
    return this.getAllLots().filter(lot => lot.farmerId === farmerId);
  },

  createLot(data: {
    crop: string;
    variety: string;
    quantityQuintals: number;
    harvestDate: string;
    location?: string;
    district?: string;
    state?: string;
    stateCode?: string;
    expectedPricePerQ: number;
    qualityGrade: 'Grade A' | 'Grade B' | 'Grade C';
    qualityMetrics: QualityMetrics;
    description?: string;
    imageUrl?: string;
    farmerName?: string;
    farmerPhone?: string;
    isAggregated?: boolean;
    fpoId?: string;
    harvestStatus?: 'Ready to Sell' | 'Harvesting Soon' | 'Future Harvest';
    contactMethod?: 'Phone Call' | 'WhatsApp';
    aiEstimatedGrade?: 'Grade A' | 'Grade B' | 'Grade C';
    farmerConfirmedGrade?: 'Grade A' | 'Grade B' | 'Grade C';
    farmerNotes?: string;
    aiConfidencePct?: number;
    aiObservations?: string[];
    latitude?: number;
    longitude?: number;
  }): DigitalLot {
    const persona = localStorageService.getPersona();
    const state = data.state || persona.state || 'Maharashtra';
    const stateCode = data.stateCode || persona.stateCode || state.substring(0, 2).toUpperCase();
    const district = data.district || persona.district || 'Nashik';
    const location = data.location || `${district}, ${state}`;
    const farmerName = data.farmerName || persona.name || 'Suresh Patil';
    const farmerPhone = data.farmerPhone || persona.phone || '+91 98220 44551';
    const farmerId = persona.id || 'farmer-suresh-mh';

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const cropCode = data.crop.substring(0, 3).toUpperCase();
    const lotNumber = `SAL-2026-${stateCode}-${cropCode}-00${randomSuffix}`;
    const lotId = `lot-${Date.now()}`;

    const newLot: DigitalLot = {
      id: lotId,
      lotNumber,
      farmerId,
      farmerName,
      farmerPhone,
      location,
      district,
      state,
      crop: data.crop,
      variety: data.variety,
      quantityQuintals: Number(data.quantityQuintals),
      harvestDate: data.harvestDate,
      expectedPricePerQ: Number(data.expectedPricePerQ),
      qualityGrade: data.qualityGrade,
      qualityMetrics: data.qualityMetrics,
      description: data.description || `Fresh harvest lot of ${data.crop} (${data.variety}), inspected and certified.`,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      status: 'Published',
      createdAt: new Date().toISOString(),
      isAggregated: data.isAggregated,
      fpoId: data.fpoId,
      harvestStatus: data.harvestStatus || 'Ready to Sell',
      contactMethod: data.contactMethod || 'Phone Call',
      aiEstimatedGrade: data.aiEstimatedGrade || data.qualityGrade,
      farmerConfirmedGrade: data.farmerConfirmedGrade || data.qualityGrade,
      farmerNotes: data.farmerNotes,
      aiConfidencePct: data.aiConfidencePct || 89,
      aiObservations: data.aiObservations || ['Visual check conforms to Agmark grading parameters'],
      latitude: data.latitude,
      longitude: data.longitude,
      interestedBuyers: [],
    };

    const currentLots = this.getAllLots();
    const updated = [newLot, ...currentLots];
    localStorageService.saveLots(updated);

    return newLot;
  },

  addInterestedBuyer(
    lotId: string,
    buyer: {
      buyerName: string;
      buyerPhone: string;
      quantityQuintals: number;
      notes?: string;
    }
  ): DigitalLot | null {
    const lots = this.getAllLots();
    let updatedLot: DigitalLot | null = null;

    const newLots = lots.map((lot) => {
      if (lot.id === lotId) {
        const existingInquiries = lot.interestedBuyers || [];
        const newInquiry = {
          id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          buyerName: buyer.buyerName,
          buyerPhone: buyer.buyerPhone,
          quantityQuintals: buyer.quantityQuintals,
          notes: buyer.notes,
          createdAt: new Date().toISOString(),
        };

        updatedLot = {
          ...lot,
          status: 'Offers Received',
          interestedBuyers: [newInquiry, ...existingInquiries],
        };
        return updatedLot;
      }
      return lot;
    });

    localStorageService.saveLots(newLots);
    return updatedLot;
  },

  updateLotStatus(lotId: string, status: LotStatus, extraProps?: Partial<DigitalLot>) {
    const lots = this.getAllLots().map(lot => {
      if (lot.id === lotId) {
        return {
          ...lot,
          status,
          ...extraProps
        };
      }
      return lot;
    });
    localStorageService.saveLots(lots);
  },

  // Simulated AI Quality Analysis
  simulateAiQualityGrading(cropName: string): QualityMetrics {
    // Generate realistic high-grade metrics with subtle variation
    const baseScore = Math.floor(88 + Math.random() * 8); // 88 - 95
    const size = Math.floor(86 + Math.random() * 10);
    const color = Math.floor(89 + Math.random() * 8);
    const freshness = Math.floor(88 + Math.random() * 10);
    const damage = Math.floor(85 + Math.random() * 10);
    const moisture = Math.floor(89 + Math.random() * 8);

    const overallScore = Math.round((size + color + freshness + damage + moisture) / 5);
    const grade: 'Grade A' | 'Grade B' | 'Grade C' = overallScore >= 88 ? 'Grade A' : overallScore >= 75 ? 'Grade B' : 'Grade C';

    return {
      size,
      color,
      freshness,
      damage,
      moisture,
      overallScore,
      grade,
      aiAssessed: true
    };
  }
};
