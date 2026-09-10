import { MandiMarket, Crop } from '../types';
import { PAN_INDIA_MARKETS, PAN_INDIA_CROPS, getCropByName } from '../data/panIndiaData';

/**
 * Architecture Provider Abstraction
 * Allows seamless switching from DemoMarketDataProvider to future real e-NAM, Agmarknet, or State APMC APIs
 */
export interface IMarketDataProvider {
  readonly providerName: string;
  readonly isDemo: boolean;
  getCrops(): Crop[];
  getCropById(cropId: string): Crop | undefined;
  getAllMarkets(): MandiMarket[];
  getMarketsByState(stateName: string): MandiMarket[];
  getMarketsForCrop(cropName: string, stateFilter?: string): MandiMarket[];
  getMarketById(id: string): MandiMarket | undefined;
  compareMarkets(marketIds: string[]): MandiMarket[];
  getBestMarket(cropName: string, stateFilter?: string): MandiMarket;
  getNearbyMarkets(farmerState: string, district?: string, maxDistanceKm?: number): MandiMarket[];
}

export class DemoMarketDataProvider implements IMarketDataProvider {
  readonly providerName = 'KrishiSetu National Demo Market Intelligence (e-NAM format)';
  readonly isDemo = true;

  getCrops(): Crop[] {
    return PAN_INDIA_CROPS;
  }

  getCropById(cropId: string): Crop | undefined {
    const term = cropId.toLowerCase();
    return PAN_INDIA_CROPS.find(c => c.id === cropId || c.name.toLowerCase() === term || c.id.replace('crop-', '') === term);
  }

  getAllMarkets(): MandiMarket[] {
    return PAN_INDIA_MARKETS;
  }

  getMarketsByState(stateName: string): MandiMarket[] {
    if (!stateName || stateName === 'All India (National View)' || stateName === 'All') {
      return PAN_INDIA_MARKETS;
    }
    const norm = stateName.toLowerCase();
    return PAN_INDIA_MARKETS.filter(m => m.state.toLowerCase() === norm || m.state.toLowerCase().includes(norm));
  }

  getMarketsForCrop(cropName: string, stateFilter?: string): MandiMarket[] {
    const term = cropName.toLowerCase();
    let pool = PAN_INDIA_MARKETS;

    if (stateFilter && stateFilter !== 'All India (National View)' && stateFilter !== 'All') {
      const stateNorm = stateFilter.toLowerCase();
      pool = pool.filter(m => m.state.toLowerCase() === stateNorm || m.state.toLowerCase().includes(stateNorm));
    }

    const matched = pool.filter(m => m.cropName.toLowerCase().includes(term));
    if (matched.length > 0) return matched;

    // Adapt markets dynamically for the requested crop with realistic commodity price scaling
    const baseCrop = getCropByName(cropName) || PAN_INDIA_CROPS[0];
    const fallbackMarkets = pool.length > 0 ? pool : PAN_INDIA_MARKETS.slice(0, 8);

    return fallbackMarkets.map(m => {
      const priceFactor = baseCrop.currentModalPrice / 2500;
      return {
        ...m,
        cropName: baseCrop.name,
        minPrice: Math.round(m.minPrice * priceFactor),
        maxPrice: Math.round(m.maxPrice * priceFactor),
        modalPrice: Math.round(m.modalPrice * priceFactor),
        weeklyTrend: m.weeklyTrend.map(pt => ({
          ...pt,
          price: Math.round(pt.price * priceFactor)
        })),
        monthlyTrend: m.monthlyTrend.map(pt => ({
          ...pt,
          price: Math.round(pt.price * priceFactor)
        }))
      };
    });
  }

  getMarketById(id: string): MandiMarket | undefined {
    return PAN_INDIA_MARKETS.find(m => m.id === id);
  }

  compareMarkets(marketIds: string[]): MandiMarket[] {
    return PAN_INDIA_MARKETS.filter(m => marketIds.includes(m.id));
  }

  getBestMarket(cropName: string, stateFilter?: string): MandiMarket {
    const list = this.getMarketsForCrop(cropName, stateFilter);
    return list.reduce((prev, current) => (current.modalPrice > prev.modalPrice ? current : prev), list[0]);
  }

  getNearbyMarkets(farmerState: string, district?: string, maxDistanceKm: number = 250): MandiMarket[] {
    const stateMarkets = this.getMarketsByState(farmerState);
    if (district) {
      const districtMatch = stateMarkets.filter(m => m.district.toLowerCase() === district.toLowerCase());
      if (districtMatch.length > 0) return districtMatch;
    }
    return stateMarkets.length > 0 ? stateMarkets : PAN_INDIA_MARKETS.slice(0, 6);
  }
}

// Default active provider
const activeProvider: IMarketDataProvider = new DemoMarketDataProvider();

export const marketService = {
  provider: activeProvider,

  getCrops(): Crop[] {
    return activeProvider.getCrops();
  },

  getCropById(cropId: string): Crop | undefined {
    return activeProvider.getCropById(cropId);
  },

  getAllMarkets(): MandiMarket[] {
    return activeProvider.getAllMarkets();
  },

  getMarketsByState(stateName: string): MandiMarket[] {
    return activeProvider.getMarketsByState(stateName);
  },

  getMarketsForCrop(cropName: string, stateFilter?: string): MandiMarket[] {
    return activeProvider.getMarketsForCrop(cropName, stateFilter);
  },

  getMarketById(id: string): MandiMarket | undefined {
    return activeProvider.getMarketById(id);
  },

  compareMarkets(marketIds: string[]): MandiMarket[] {
    return activeProvider.compareMarkets(marketIds);
  },

  getBestMarket(cropName: string, stateFilter?: string): MandiMarket {
    return activeProvider.getBestMarket(cropName, stateFilter);
  },

  getNearbyMarkets(farmerState: string, district?: string, maxDistanceKm?: number): MandiMarket[] {
    return activeProvider.getNearbyMarkets(farmerState, district, maxDistanceKm);
  }
};
