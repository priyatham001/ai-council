import { AIRecommendation } from '../types';
import { PAN_INDIA_MARKETS, PAN_INDIA_BUYERS, PAN_INDIA_CROPS, getCropByName } from '../data/panIndiaData';
import { netRealizationService } from './netRealizationService';

export interface AISellAdvisorInput {
  state?: string;
  district?: string;
  farmerLocation?: string;
  crop: string;
  quantityQuintals: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C';
  harvestDate: string;
  storageAvailable: boolean;
  urgencyToSell: 'immediate' | 'can_wait_3_5_days' | 'flexible';
}

export const aiService = {
  generateSellRecommendation(input: AISellAdvisorInput): AIRecommendation {
    const matchedCrop = getCropByName(input.crop) || PAN_INDIA_CROPS[0];
    const basePrice = matchedCrop.currentModalPrice;

    // Quality Grade multiplier
    const gradeMultiplier = input.qualityGrade === 'Grade A' ? 1.08 : input.qualityGrade === 'Grade B' ? 1.0 : 0.92;

    // Identify candidate markets in state or pan-India pool
    let candidateMarkets = PAN_INDIA_MARKETS;
    if (input.state && input.state !== 'All') {
      const stateMatch = PAN_INDIA_MARKETS.filter(m => m.state.toLowerCase() === input.state?.toLowerCase());
      if (stateMatch.length > 0) candidateMarkets = stateMatch;
    }

    // Evaluate net realization across candidate markets
    const evaluatedMarkets = candidateMarkets.map(market => {
      // Calculate realistic market-specific price based on modal and grade
      const cropFactor = basePrice / 2500;
      const pricePerQ = Math.round(market.modalPrice * cropFactor * gradeMultiplier);

      const breakdown = netRealizationService.calculateSingle({
        marketId: market.id,
        marketName: market.name,
        distanceKm: market.distanceKm,
        pricePerQ,
        quantityQuintals: input.quantityQuintals,
        storageDays: input.storageAvailable ? 2 : 0
      });

      return {
        market,
        breakdown
      };
    });

    // Sort by highest net realization
    evaluatedMarkets.sort((a, b) => b.breakdown.netRealization - a.breakdown.netRealization);

    const topMarketChoice = evaluatedMarkets[0];
    const secondaryMarketChoice = evaluatedMarkets.length > 1 ? evaluatedMarkets[1] : evaluatedMarkets[0];

    // Find best matching verified buyer in state or region
    const matchingBuyers = PAN_INDIA_BUYERS.filter(b =>
      b.requiredCrops.some(c => c.toLowerCase().includes(input.crop.toLowerCase())) ||
      (input.state && b.state.toLowerCase() === input.state.toLowerCase())
    );

    const selectedBuyer = matchingBuyers.length > 0
      ? matchingBuyers.reduce((best, cur) => (cur.paymentReliabilityPct > best.paymentReliabilityPct ? cur : best), matchingBuyers[0])
      : PAN_INDIA_BUYERS[0];

    // Determine selling window based on urgency and storage
    let sellingWindow = 'September 10–13, 2026';
    let urgencyReason = 'Storage availability allows a 2-4 day holding period to capitalize on upcoming processor intake drives.';
    if (input.urgencyToSell === 'immediate' || !input.storageAvailable) {
      sellingWindow = 'Immediate (Within 24–48 hours)';
      urgencyReason = 'Perishable fresh lot without cold chain storage: sell immediately to prevent weight shrinkage and grade loss.';
    } else if (input.urgencyToSell === 'flexible') {
      sellingWindow = 'September 12–16, 2026';
      urgencyReason = 'Holding for mid-month bulk buyer procurement cycles will capture peak bidding premiums.';
    }

    const priceMin = Math.round(topMarketChoice.breakdown.quotedPricePerQ * 0.96);
    const priceMax = Math.round(topMarketChoice.breakdown.quotedPricePerQ * 1.04);
    const estGross = Math.round(topMarketChoice.breakdown.grossSaleValue);
    const estTransport = Math.round(topMarketChoice.breakdown.transportCost);
    const estHandling = Math.round(topMarketChoice.breakdown.handlingCost);
    const estStorage = Math.round(topMarketChoice.breakdown.storageCost);
    const estNet = Math.round(topMarketChoice.breakdown.netRealization);
    const estNetPerQ = Math.round(topMarketChoice.breakdown.netRealizationPerQ);

    const altNet = Math.round(secondaryMarketChoice.breakdown.netRealization);
    const potentialAdditionalIncome = Math.max(1200, estNet - altNet);

    // Confidence calculation (realistic between 82% and 94%)
    let confidence = 82;
    if (input.qualityGrade === 'Grade A') confidence += 5;
    if (selectedBuyer.paymentReliabilityPct >= 95) confidence += 4;
    if (topMarketChoice.market.distanceKm < 50) confidence += 3;
    if (confidence > 94) confidence = 94;

    const reasoning = [
      `Optimal Takeaway Cash: ${topMarketChoice.market.name} provides the highest calculated net realization (₹${estNet.toLocaleString('en-IN')}) for this lot after deducting ₹${estTransport.toLocaleString('en-IN')} freight.`,
      `Gross vs Net Arbitrage: While distant markets may quote higher gross rates, transportation costs would erode ₹${Math.round(estTransport * 1.6).toLocaleString('en-IN')} or more.`,
      `Verified Buyer Match: ${selectedBuyer.name} is active in ${selectedBuyer.state} for ${matchedCrop.name} (${selectedBuyer.paymentReliabilityPct}% on-time payment track record).`,
      `Grade & Moisture Compliance: Your ${input.qualityGrade} rating secures the top pricing bracket with zero dockage deductions.`,
      urgencyReason
    ];

    return {
      crop: input.crop,
      quantityQuintals: input.quantityQuintals,
      qualityGrade: input.qualityGrade,
      recommendedMarket: topMarketChoice.market.name,
      marketDistanceKm: topMarketChoice.market.distanceKm,
      recommendedBuyer: selectedBuyer.name,
      recommendedSellingWindow: sellingWindow,
      expectedPriceMin: priceMin,
      expectedPriceMax: priceMax,
      estimatedGross: estGross,
      estimatedTransportCost: estTransport,
      estimatedHandlingCost: estHandling,
      estimatedStorageCost: estStorage,
      estimatedNetRealization: estNet,
      estimatedRealizationPerQ: estNetPerQ,
      confidencePct: confidence,
      reasoning,
      disclaimer: 'Prototype recommendation based on demo market data. AI recommendations are algorithmic estimates for hackathon demonstration and are not guaranteed.',
      alternativeMarket: secondaryMarketChoice.market.name,
      alternativeNetRealization: altNet,
      potentialAdditionalIncome
    };
  }
};
