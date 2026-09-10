export interface MarketCostBreakdown {
  marketId: string;
  marketName: string;
  distanceKm: number;
  quotedPricePerQ: number;
  quantityQuintals: number;
  grossSaleValue: number;
  transportCost: number;
  handlingCost: number;
  storageCost: number;
  otherCharges: number;
  totalDeductions: number;
  netRealization: number;
  netRealizationPerQ: number;
}

export interface RealizationComparison {
  options: MarketCostBreakdown[];
  bestOption: MarketCostBreakdown;
  worstOption: MarketCostBreakdown;
  netDifference: number;
  insightMessage: string;
}

export const netRealizationService = {
  calculateSingle({
    marketId,
    marketName,
    distanceKm,
    pricePerQ,
    quantityQuintals,
    storageDays = 0,
    vehicleRatePerKm = 30,
    vehicleBaseFare = 800,
    handlingPerQ = 25,
    storageRatePerQPerDay = 4
  }: {
    marketId: string;
    marketName: string;
    distanceKm: number;
    pricePerQ: number;
    quantityQuintals: number;
    storageDays?: number;
    vehicleRatePerKm?: number;
    vehicleBaseFare?: number;
    handlingPerQ?: number;
    storageRatePerQPerDay?: number;
  }): MarketCostBreakdown {
    const grossSaleValue = pricePerQ * quantityQuintals;
    const transportCost = Math.round(vehicleBaseFare + (distanceKm * vehicleRatePerKm));
    const handlingCost = Math.round(quantityQuintals * handlingPerQ);
    const storageCost = Math.round(quantityQuintals * storageRatePerQPerDay * storageDays);
    const otherCharges = Math.round(grossSaleValue * 0.005); // 0.5% statutory APMC & digital weighment charges
    const totalDeductions = transportCost + handlingCost + storageCost + otherCharges;
    const netRealization = grossSaleValue - totalDeductions;
    const netRealizationPerQ = Math.round((netRealization / quantityQuintals) * 100) / 100;

    return {
      marketId,
      marketName,
      distanceKm,
      quotedPricePerQ: pricePerQ,
      quantityQuintals,
      grossSaleValue,
      transportCost,
      handlingCost,
      storageCost,
      otherCharges,
      totalDeductions,
      netRealization,
      netRealizationPerQ
    };
  },

  compareCalculations(options: MarketCostBreakdown[]): RealizationComparison {
    if (!options || options.length === 0) {
      throw new Error("No options provided for comparison");
    }

    const sorted = [...options].sort((a, b) => b.netRealization - a.netRealization);
    const bestOption = sorted[0];
    const worstOption = sorted[sorted.length - 1];
    const netDifference = bestOption.netRealization - (sorted[1]?.netRealization || worstOption.netRealization);

    let insightMessage = '';
    if (sorted.length > 1 && netDifference > 0) {
      insightMessage = `${bestOption.marketName} yields ₹${netDifference.toLocaleString('en-IN')} more in true net cash realization after deducting freight and handling costs.`;
    } else {
      insightMessage = `${bestOption.marketName} delivers the highest net realization of ₹${bestOption.netRealization.toLocaleString('en-IN')}.`;
    }

    return {
      options: sorted,
      bestOption,
      worstOption,
      netDifference,
      insightMessage
    };
  }
};
