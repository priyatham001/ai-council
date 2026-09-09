import { BuyerProfile, DigitalLot, BuyerDemandRequirement } from '../types';
import { DEMO_BUYERS } from '../data/mockData';
import { localStorageService } from './storageService';
import { lotService } from './lotService';

export interface BuyerMatchBreakdown {
  buyer: BuyerProfile;
  overallMatchScore: number;
  cropMatch: number;
  qualityMatch: number;
  quantityMatch: number;
  distanceScore: number;
  paymentReliability: number;
  isRecommended: boolean;
}

export const buyerService = {
  getAllBuyers(): BuyerProfile[] {
    return DEMO_BUYERS;
  },

  getBuyerById(id: string): BuyerProfile | undefined {
    return DEMO_BUYERS.find(b => b.id === id);
  },

  // Calculate matching score between a lot and a buyer
  calculateMatchScore(lot: DigitalLot, buyer: BuyerProfile): BuyerMatchBreakdown {
    const cropMatch = buyer.requiredCrops.some(c => c.toLowerCase().includes(lot.crop.toLowerCase()) || lot.crop.toLowerCase().includes(c.toLowerCase())) ? 100 : 40;
    
    // Quality match
    let qualityMatch = 90;
    if (buyer.qualityRequirement === 'Grade A') {
      qualityMatch = lot.qualityGrade === 'Grade A' ? 100 : lot.qualityGrade === 'Grade B' ? 70 : 40;
    } else {
      qualityMatch = lot.qualityGrade === 'Grade A' || lot.qualityGrade === 'Grade B' ? 95 : 60;
    }

    // Quantity match
    let quantityMatch = 85;
    if (lot.quantityQuintals >= buyer.requiredQuantityMin && lot.quantityQuintals <= buyer.requiredQuantityMax) {
      quantityMatch = 100;
    } else if (lot.quantityQuintals < buyer.requiredQuantityMin) {
      quantityMatch = Math.max(50, Math.round((lot.quantityQuintals / buyer.requiredQuantityMin) * 100));
    } else {
      quantityMatch = 90;
    }

    // Distance score: closer is better
    const distanceScore = Math.max(50, Math.round(100 - (buyer.distanceKm * 0.4)));
    const paymentReliability = buyer.paymentReliabilityPct;

    // Weighted overall score
    const overallMatchScore = Math.round(
      (cropMatch * 0.35) +
      (qualityMatch * 0.25) +
      (quantityMatch * 0.15) +
      (distanceScore * 0.10) +
      (paymentReliability * 0.15)
    );

    return {
      buyer,
      overallMatchScore,
      cropMatch,
      qualityMatch,
      quantityMatch,
      distanceScore,
      paymentReliability,
      isRecommended: overallMatchScore >= 88
    };
  },

  getMatchedBuyersForLot(lot: DigitalLot): BuyerMatchBreakdown[] {
    const all = this.getAllBuyers();
    const scored = all.map(buyer => this.calculateMatchScore(lot, buyer));
    return scored.sort((a, b) => b.overallMatchScore - a.overallMatchScore);
  },

  getRequirements(): BuyerDemandRequirement[] {
    return localStorageService.getRequirements();
  },

  createRequirement(req: Omit<BuyerDemandRequirement, 'id' | 'matchedLotsCount'>): BuyerDemandRequirement {
    const matchedCount = lotService.getAllLots().filter(l => l.crop.toLowerCase().includes(req.crop.toLowerCase())).length;
    const newReq: BuyerDemandRequirement = {
      id: `req-${Date.now()}`,
      ...req,
      matchedLotsCount: matchedCount
    };
    const list = [newReq, ...this.getRequirements()];
    localStorageService.saveRequirements(list);
    return newReq;
  }
};
