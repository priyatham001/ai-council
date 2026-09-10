import { DEMO_FPO_MEMBERS } from '../data/mockData';
import { lotService } from './lotService';

export const fpoService = {
  getFpoProfile() {
    return {
      id: 'fpo-godavari',
      name: 'Godavari Farmers Producer Organization',
      registrationNumber: 'FPO-AP-2021-WG-00481',
      totalMembers: 128,
      location: 'Undi Road, Bhimavaram, West Godavari, AP',
      president: 'S. Koteswara Rao',
      cropsHandled: ['Tomato', 'Paddy (BPT-5204)', 'Maize', 'Banana'],
      availableTomatoQuintals: 640,
      availablePaddyQuintals: 1250,
      activeBuyerContracts: 12,
      estimatedSeasonRevenue: 3240000,
      bankAccountVerified: true,
      nabardRegistered: true
    };
  },

  getMembers() {
    return DEMO_FPO_MEMBERS;
  },

  createAggregatedLot(data: {
    crop: string;
    variety: string;
    quantityQuintals: number;
    expectedPricePerQ: number;
    description: string;
  }) {
    return lotService.createLot({
      crop: data.crop,
      variety: data.variety,
      quantityQuintals: data.quantityQuintals,
      harvestDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      location: 'Godavari FPO Undi Consolidation Yard',
      district: 'West Godavari',
      expectedPricePerQ: data.expectedPricePerQ,
      qualityGrade: 'Grade A',
      qualityMetrics: {
        size: 93,
        color: 94,
        freshness: 92,
        damage: 94,
        moisture: 93,
        overallScore: 93,
        grade: 'Grade A',
        aiAssessed: true
      },
      description: `[FPO BULK CONSOLIDATION] ${data.description}`,
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      farmerName: 'Godavari FPO (128 Farmers Collective)',
      farmerPhone: '+91 8816 234890',
      isAggregated: true,
      fpoId: 'fpo-godavari'
    });
  }
};
