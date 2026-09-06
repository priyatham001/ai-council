import { MarketItem, MarketAnalysisResult, QualityGrade, WeightUnit } from '../types/krishi';

// Converts any supported unit to kilograms
export function normalizeToKilograms(value: number, unit: WeightUnit): number {
  if (value <= 0 || isNaN(value)) return 0;
  switch (unit) {
    case 'kg':
      return value;
    case 'quintal':
      return value * 100;
    case 'tonne':
      return value * 1000;
    default:
      return value;
  }
}

// Converts kilograms to quintals for market rate multiplication
export function convertKgToQuintals(kg: number): number {
  return kg / 100;
}

// Deterministic grade multiplier: Grade A = +5%, Grade B = 0% (Standard), Grade C = -5%, Custom = 0%
export function getGradeMultiplier(grade: QualityGrade | null): number {
  switch (grade) {
    case 'A':
      return 1.05; // +5% premium
    case 'B':
      return 1.0; // Standard modal rate
    case 'C':
      return 0.95; // -5% discount
    case 'Custom':
    default:
      return 1.0;
  }
}

// Deterministic transport cost calculation
// Base freight: ₹3.80 per tonne-km (or ₹0.38 per quintal-km), minimum ₹250 flat base haulage
export function calculateTransportCost(roadDistanceKm: number, weightKg: number): number {
  if (roadDistanceKm <= 0 || weightKg <= 0) return 0;
  const tonnes = weightKg / 1000;
  // Tiered freight rate based on vehicle capacity (small pickup vs medium mini-truck vs 10-wheeler)
  let ratePerTonneKm = 4.2;
  if (tonnes >= 5) {
    ratePerTonneKm = 3.2;
  } else if (tonnes >= 2) {
    ratePerTonneKm = 3.6;
  }

  const variableFreight = roadDistanceKm * ratePerTonneKm * Math.max(tonnes, 0.5);
  const loadingFee = tonnes * 80; // ₹80 per tonne loading
  const tollAndLocalHandling = Math.min(200, roadDistanceKm * 1.5);
  
  const total = Math.max(300, Math.round(variableFreight + loadingFee + tollAndLocalHandling));
  return total;
}

// Evaluates markets deterministically and calculates net returns
export function evaluateMarkets(
  markets: MarketItem[],
  normalizedWeightKg: number,
  qualityGrade: QualityGrade | null
): MarketAnalysisResult[] {
  const quintals = convertKgToQuintals(normalizedWeightKg);
  const gradeMultiplier = getGradeMultiplier(qualityGrade);

  const results: MarketAnalysisResult[] = markets.map((market) => {
    // 1. Adjusted price per quintal after deterministic grade adjustment
    const effectivePricePerQtl = Math.round(market.pricePerQuintal * gradeMultiplier);

    // 2. Gross revenue
    const grossAmount = Math.round(effectivePricePerQtl * quintals);

    // 3. Transport cost (using road distance)
    const roadDist = market.roadDistanceKm || market.distanceKm * 1.22;
    const transportCost = calculateTransportCost(roadDist, normalizedWeightKg);

    // 4. Mandi user fee / cess
    const marketFeeAmount = Math.round((grossAmount * market.marketFeePercent) / 100);

    // 5. Hamali / Unloading charges
    const unloadingFeeAmount = Math.round(market.unloadingChargePerQtl * quintals);

    // 6. Net Return = Gross - Transport - Mandi Fee - Unloading
    const netReturn = grossAmount - transportCost - marketFeeAmount - unloadingFeeAmount;
    const netPricePerQuintal = quintals > 0 ? Math.round(netReturn / quintals) : effectivePricePerQtl;

    return {
      market,
      grossAmount,
      transportCost,
      marketFeeAmount,
      unloadingFeeAmount,
      netReturn,
      netPricePerQuintal,
      isBestOption: false,
      priceDeltaPerQuintal: effectivePricePerQtl - market.pricePerQuintal,
    };
  });

  // Rank by Net Return (highest first)
  results.sort((a, b) => b.netReturn - a.netReturn);

  if (results.length > 0) {
    results[0].isBestOption = true;
  }

  return results;
}
