import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import {
  CROPS_CATALOG,
  SAMPLE_MARKETS,
  SAMPLE_BUYERS,
  SAMPLE_TRANSPORTERS,
  VEHICLE_CONFIGS,
  rankMarketsForFarmer,
  generateDeterministicAIInsight,
  generateCropPriceTrends,
  generatePriceForecast,
  calculateHaversineDistanceKm
} from '../krishi-engine';
import {
  FarmerSearchHistory,
  DiscoveryRequestPayload,
  FarmerLocation,
  WeightUnit,
  VehicleTypeId
} from '../../types/krishi';

// In-memory persistent history store (with pre-populated initial sample records for demo)
let searchHistory: FarmerSearchHistory[] = [
  {
    id: 'hist_demo_1',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    cropName: 'Paddy (Dhan)',
    quantity: 10,
    unit: 'quintal',
    quantityInQuintals: 10,
    farmerLocation: 'Bhimavaram, West Godavari',
    marketsComparedCount: 6,
    recommendedMarket: 'Tanuku Commercial APMC Mandi',
    recommendedNetReturn: 22150,
    grossRevenue: 23200,
    estimatedTransport: 700,
    distanceKm: 32,
    isDemo: true
  },
  {
    id: 'hist_demo_2',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    cropName: 'Dry Red Chilli',
    quantity: 5,
    unit: 'quintal',
    quantityInQuintals: 5,
    farmerLocation: 'Palakollu, West Godavari',
    marketsComparedCount: 5,
    recommendedMarket: 'Palakollu Regulated Market Yard',
    recommendedNetReturn: 83200,
    grossRevenue: 84000,
    estimatedTransport: 350,
    distanceKm: 8,
    isDemo: true
  }
];

// In-memory dynamic vehicle rates table (admin configurable)
export const dynamicVehicleRates = [...VEHICLE_CONFIGS];

// Helper: Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize Gemini client:', err);
    return null;
  }
}

// 1. GET /api/health
export function handleHealth(_req: Request, res: Response) {
  res.json({
    status: 'ok',
    service: 'Smart Krishi Market (SIH26132)',
    theme: 'Agriculture, FoodTech & Rural Development',
    organization: 'Government of Maharashtra',
    demoMode: process.env.DEMO_MODE !== 'false',
    providers: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      claude: Boolean(process.env.ANTHROPIC_API_KEY),
      mistral: Boolean(process.env.MISTRAL_API_KEY)
    },
    totalCropsAvailable: CROPS_CATALOG.length,
    totalMarketsIndexed: SAMPLE_MARKETS.length,
    totalBuyersRegistered: SAMPLE_BUYERS.length,
    timestamp: new Date().toISOString()
  });
}

// 2. GET /api/crops
export function handleGetCrops(_req: Request, res: Response) {
  res.json({
    success: true,
    crops: CROPS_CATALOG
  });
}

// 3. GET /api/markets
export function handleGetMarkets(_req: Request, res: Response) {
  res.json({
    success: true,
    markets: SAMPLE_MARKETS
  });
}

// 4. GET /api/markets/nearby
export function handleGetNearbyMarkets(req: Request, res: Response) {
  const lat = parseFloat(req.query.lat as string) || 16.5449;
  const lng = parseFloat(req.query.lng as string) || 81.5212;

  const marketsWithDistance = SAMPLE_MARKETS.map((m) => ({
    ...m,
    distanceKm: calculateHaversineDistanceKm(lat, lng, m.lat, m.lng)
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  res.json({
    success: true,
    origin: { lat, lng },
    markets: marketsWithDistance
  });
}

// 5. GET /api/buyers/nearby
export function handleGetBuyers(req: Request, res: Response) {
  const cropId = req.query.crop as string;
  let buyers = [...SAMPLE_BUYERS];

  if (cropId) {
    buyers = buyers.filter((b) => b.acceptedCrops.includes(cropId.toLowerCase()));
  }

  res.json({
    success: true,
    buyers
  });
}

// 6. POST /api/recommend (Core Recommendation & Optimization Engine)
export async function handleRecommend(req: Request, res: Response) {
  try {
    const payload = req.body as DiscoveryRequestPayload;
    if (!payload || !payload.farmerLocation || !payload.cropId || !payload.quantity) {
      res.status(400).json({
        success: false,
        error: 'Invalid payload: farmerLocation, cropId, and quantity are required.'
      });
      return;
    }

    const {
      farmerLocation,
      cropId,
      quantity,
      unit = 'quintal',
      vehicleType = 'mini_truck',
      customRatePerKm,
      isRoundTrip = false,
      quality
    } = payload;

    // 1. Deterministic Calculation & Ranking
    const calculation = rankMarketsForFarmer(
      farmerLocation,
      cropId,
      quantity,
      unit,
      vehicleType,
      isRoundTrip,
      customRatePerKm,
      quality
    );

    // 2. Base Structured Insights
    let aiInsight = generateDeterministicAIInsight(
      calculation.crop,
      calculation.quantityInQuintals,
      calculation.rankedMarkets,
      vehicleType,
      isRoundTrip,
      quality
    );

    // 3. Server-side Gemini Enhancement if configured
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const topMkt = calculation.recommendedMarket;
        const highestPriceMkt = [...calculation.rankedMarkets].sort(
          (a, b) => b.cropPricePerQuintal - a.cropPricePerQuintal
        )[0];

        const prompt = `You are the lead Agricultural Economist for the Smart Krishi Market system (SIH26132).
Explain why ${topMkt.marketName} is recommended for a farmer selling ${calculation.quantityInQuintals} quintals of ${calculation.crop.name}.
Data:
- Farmer location: ${farmerLocation.villageOrTown}, ${farmerLocation.district}, ${farmerLocation.state}
- Recommended Market: ${topMkt.marketName} (${topMkt.distanceKm} km away), Price: ₹${topMkt.cropPricePerQuintal}/qtl, Gross: ₹${topMkt.grossRevenue}, Transport: ₹${topMkt.transportCost}, Other Fees: ₹${topMkt.marketCharges + topMkt.loadingCost}, Net Return: ₹${topMkt.estimatedNetReturn}
- Alternative Highest Board Price Market: ${highestPriceMkt.marketName} (${highestPriceMkt.distanceKm} km away), Price: ₹${highestPriceMkt.cropPricePerQuintal}/qtl, Gross: ₹${highestPriceMkt.grossRevenue}, Transport: ₹${highestPriceMkt.transportCost}, Net Return: ₹${highestPriceMkt.estimatedNetReturn}

Provide a concise, direct, professional 2-3 sentence strategic advisory addressing the net return vs transport cost trade-off. Do not use generic filler words. Clearly state why higher board price does not guarantee highest take-home profit.`;

        const geminiPromise = gemini.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        const timeoutPromise = new Promise<{ text?: string }>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 4000)
        );

        const geminiRes = await Promise.race([geminiPromise, timeoutPromise]);

        if (geminiRes.text) {
          aiInsight.aiInsights.unshift(geminiRes.text.trim());
          aiInsight.summary = geminiRes.text.trim();
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to deterministic insight:', geminiError);
      }
    }

    // 4. Save to history
    const searchId = 'hist_' + Date.now();
    const historyItem: FarmerSearchHistory = {
      id: searchId,
      createdAt: new Date().toISOString(),
      cropName: calculation.crop.name,
      quantity,
      unit,
      quantityInQuintals: calculation.quantityInQuintals,
      farmerLocation: `${farmerLocation.villageOrTown}, ${farmerLocation.district}`,
      marketsComparedCount: calculation.rankedMarkets.length,
      recommendedMarket: calculation.recommendedMarket.marketName,
      recommendedNetReturn: calculation.recommendedMarket.estimatedNetReturn,
      grossRevenue: calculation.recommendedMarket.grossRevenue,
      estimatedTransport: calculation.recommendedMarket.transportCost,
      distanceKm: calculation.recommendedMarket.distanceKm,
      isDemo: true
    };
    searchHistory.unshift(historyItem);
    if (searchHistory.length > 50) searchHistory = searchHistory.slice(0, 50);

    res.json({
      success: true,
      farmerLocation,
      crop: calculation.crop,
      quantity: {
        amount: quantity,
        unit,
        quintals: calculation.quantityInQuintals
      },
      transportConfig: {
        vehicleType,
        ratePerKm: customRatePerKm ?? 22,
        isRoundTrip
      },
      recommendedMarket: calculation.recommendedMarket,
      rankedMarkets: calculation.rankedMarkets,
      aiInsight,
      isDemo: true,
      searchId
    });
  } catch (error: any) {
    console.error('Error in handleRecommend:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to calculate market recommendation.'
    });
  }
}

// 7. GET /api/trends
export function handleGetTrends(req: Request, res: Response) {
  const cropId = (req.query.crop as string) || 'paddy';
  const marketId = (req.query.market as string) || 'mkt_tanuku';
  const period = ((req.query.period as string) || '30d') as '7d' | '30d' | '90d';

  const trends = generateCropPriceTrends(cropId, marketId, period);
  res.json({
    success: true,
    trends
  });
}

// 8. POST /api/forecast
export function handleGetForecast(req: Request, res: Response) {
  const cropId = req.body?.cropId || 'paddy';
  const marketId = req.body?.marketId || 'mkt_tanuku';

  const forecast = generatePriceForecast(cropId, marketId);
  res.json({
    success: true,
    forecast
  });
}

// 9. GET /api/history
export function handleGetHistory(_req: Request, res: Response) {
  res.json({
    success: true,
    history: searchHistory
  });
}

// 10. DELETE /api/history/:id
export function handleDeleteHistory(req: Request, res: Response) {
  const id = req.params.id;
  searchHistory = searchHistory.filter((item) => item.id !== id);
  res.json({
    success: true,
    deletedId: id
  });
}

// 11. GET /api/admin/data
export function handleAdminData(_req: Request, res: Response) {
  res.json({
    success: true,
    crops: CROPS_CATALOG,
    markets: SAMPLE_MARKETS,
    buyers: SAMPLE_BUYERS,
    vehicleConfigs: dynamicVehicleRates,
    demoModeActive: process.env.DEMO_MODE !== 'false',
    systemMetrics: {
      uptimeSeconds: Math.floor(process.uptime()),
      totalHistorySearches: searchHistory.length,
      nodeEnv: process.env.NODE_ENV || 'development'
    }
  });
}

// 12. POST /api/admin/rates
export function handleUpdateTransportRates(req: Request, res: Response) {
  const { vehicleId, baseRatePerKm, loadingChargePerQuintal } = req.body;
  const target = dynamicVehicleRates.find((v) => v.id === vehicleId);
  if (!target) {
    res.status(404).json({ success: false, error: 'Vehicle not found.' });
    return;
  }
  if (baseRatePerKm !== undefined) target.baseRatePerKm = Number(baseRatePerKm);
  if (loadingChargePerQuintal !== undefined) target.loadingChargePerQuintal = Number(loadingChargePerQuintal);

  res.json({
    success: true,
    updatedVehicle: target
  });
}

// 13. GET /api/transporters
export function handleGetTransporters(req: Request, res: Response) {
  const district = req.query.district as string;
  let transporters = [...SAMPLE_TRANSPORTERS];
  if (district) {
    transporters = transporters.filter(
      (t) => t.district.toLowerCase() === district.toLowerCase()
    );
  }
  res.json({
    success: true,
    transporters
  });
}
