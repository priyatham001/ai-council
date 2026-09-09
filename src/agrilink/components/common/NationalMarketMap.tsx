import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowRight,
  Activity,
  Sparkles,
  ShieldCheck,
  Filter,
  Navigation,
  CheckCircle2,
  Users,
  Truck,
  DollarSign,
  Layers,
  RotateCcw,
  Compass,
  AlertCircle,
  X,
} from 'lucide-react';
import { INDIAN_STATES, PAN_INDIA_MARKETS, StateInfo } from '../../data/panIndiaData';

interface NationalMarketMapProps {
  onSelectState?: (stateName: string) => void;
  selectedStateName?: string;
  farmerState?: string;
  farmerDistrict?: string;
  className?: string;
}

// Coordinate mapping for major APMC Mandis on a 0-100 x 0-105 SVG space
interface MandiGeoNode {
  id: string;
  name: string;
  district: string;
  state: string;
  cropName: string;
  x: number;
  y: number;
  modalPrice: number;
  benchmarkPrice: number;
  demandLevel: 'High' | 'Moderate' | 'Low';
  trendPct: number;
  trendUp: boolean;
  activeBuyers: number;
  arrivalsQuintals: number;
  freightPerQtl: number;
  transitHours: number;
  aiRecommendation: string;
}

const MANDI_GEO_NODES: MandiGeoNode[] = [
  // Maharashtra
  {
    id: 'mkt-lasalgaon',
    name: 'Lasalgaon APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    cropName: 'Onion',
    x: 29,
    y: 59,
    modalPrice: 2890,
    benchmarkPrice: 2760,
    demandLevel: 'High',
    trendPct: 4.8,
    trendUp: true,
    activeBuyers: 22,
    arrivalsQuintals: 3850,
    freightPerQtl: 65,
    transitHours: 1.2,
    aiRecommendation:
      'Asia’s largest onion hub with intense institutional buying. Highest net realization for Grade A/B onion produce.',
  },
  {
    id: 'mkt-pimpalgaon',
    name: 'Pimpalgaon Baswant',
    district: 'Nashik',
    state: 'Maharashtra',
    cropName: 'Onion',
    x: 27.5,
    y: 57.5,
    modalPrice: 2760,
    benchmarkPrice: 2700,
    demandLevel: 'High',
    trendPct: 3.2,
    trendUp: true,
    activeBuyers: 16,
    arrivalsQuintals: 2100,
    freightPerQtl: 40,
    transitHours: 0.7,
    aiRecommendation:
      'Closest local mandi with minimal logistics costs and fast same-day unloading clearance.',
  },
  {
    id: 'mkt-pune-apmc',
    name: 'Pune Gultekdi APMC',
    district: 'Pune',
    state: 'Maharashtra',
    cropName: 'Onion',
    x: 31,
    y: 65,
    modalPrice: 3020,
    benchmarkPrice: 2800,
    demandLevel: 'High',
    trendPct: 5.6,
    trendUp: true,
    activeBuyers: 28,
    arrivalsQuintals: 4200,
    freightPerQtl: 140,
    transitHours: 4.5,
    aiRecommendation:
      'Major urban consumer center commanding premium prices for graded produce. Highly recommended for lots >50 quintals.',
  },
  {
    id: 'mkt-vashi-mumbai',
    name: 'Vashi APMC Navi Mumbai',
    district: 'Thane / Mumbai',
    state: 'Maharashtra',
    cropName: 'Onion',
    x: 25.5,
    y: 62.5,
    modalPrice: 3150,
    benchmarkPrice: 2900,
    demandLevel: 'High',
    trendPct: 6.2,
    trendUp: true,
    activeBuyers: 35,
    arrivalsQuintals: 5800,
    freightPerQtl: 160,
    transitHours: 5.0,
    aiRecommendation:
      'Top export and metropolitan market. High demand for export-standard onions and quality vegetables.',
  },
  {
    id: 'mkt-nagpur-kalamna',
    name: 'Nagpur Kalamna APMC',
    district: 'Nagpur',
    state: 'Maharashtra',
    cropName: 'Soybean',
    x: 46,
    y: 56,
    modalPrice: 4850,
    benchmarkPrice: 4650,
    demandLevel: 'High',
    trendPct: 3.9,
    trendUp: true,
    activeBuyers: 19,
    arrivalsQuintals: 3100,
    freightPerQtl: 280,
    transitHours: 9.0,
    aiRecommendation:
      'Leading soybean and orange market in Central India with active food processing aggregators.',
  },

  // Punjab / North
  {
    id: 'mkt-khanna-pb',
    name: 'Khanna Grain Market',
    district: 'Ludhiana',
    state: 'Punjab',
    cropName: 'Wheat',
    x: 32,
    y: 24,
    modalPrice: 2420,
    benchmarkPrice: 2275,
    demandLevel: 'High',
    trendPct: 3.4,
    trendUp: true,
    activeBuyers: 32,
    arrivalsQuintals: 7500,
    freightPerQtl: 290,
    transitHours: 16.0,
    aiRecommendation:
      'Asia’s largest grain market with instant FCI and private roller flour mill bidding.',
  },
  {
    id: 'mkt-karnal-hr',
    name: 'Karnal APMC',
    district: 'Karnal',
    state: 'Haryana',
    cropName: 'Paddy',
    x: 36,
    y: 28,
    modalPrice: 3850,
    benchmarkPrice: 3600,
    demandLevel: 'High',
    trendPct: 4.1,
    trendUp: true,
    activeBuyers: 24,
    arrivalsQuintals: 4900,
    freightPerQtl: 260,
    transitHours: 14.0,
    aiRecommendation:
      'Prime Basmati paddy trading belt. Direct mill gate export procurements active.',
  },
  {
    id: 'mkt-delhi-azadpur',
    name: 'Azadpur APMC Delhi',
    district: 'North Delhi',
    state: 'Delhi (NCT)',
    cropName: 'Tomato',
    x: 40,
    y: 31,
    modalPrice: 3400,
    benchmarkPrice: 3100,
    demandLevel: 'High',
    trendPct: 7.2,
    trendUp: true,
    activeBuyers: 45,
    arrivalsQuintals: 9200,
    freightPerQtl: 310,
    transitHours: 18.0,
    aiRecommendation:
      'National capital terminal market with immense absorption capacity across all categories.',
  },

  // Gujarat / West
  {
    id: 'mkt-unjha-gj',
    name: 'Unjha APMC (Spices Hub)',
    district: 'Mehsana',
    state: 'Gujarat',
    cropName: 'Cumin',
    x: 21,
    y: 46,
    modalPrice: 28500,
    benchmarkPrice: 27000,
    demandLevel: 'High',
    trendPct: 5.1,
    trendUp: true,
    activeBuyers: 38,
    arrivalsQuintals: 3200,
    freightPerQtl: 190,
    transitHours: 8.5,
    aiRecommendation:
      'Global benchmark hub for Cumin (Jeera), Fennel, and Isabgol. Strong international buyer interest.',
  },
  {
    id: 'mkt-rajkot-gj',
    name: 'Rajkot Marketing Yard',
    district: 'Rajkot',
    state: 'Gujarat',
    cropName: 'Groundnut',
    x: 17,
    y: 50,
    modalPrice: 6250,
    benchmarkPrice: 5900,
    demandLevel: 'Moderate',
    trendPct: 2.5,
    trendUp: true,
    activeBuyers: 21,
    arrivalsQuintals: 2800,
    freightPerQtl: 210,
    transitHours: 10.0,
    aiRecommendation:
      'Major Saurashtra oilseeds hub with steady oil miller crushing demands.',
  },

  // Central (MP & Rajasthan)
  {
    id: 'mkt-indore-mp',
    name: 'Indore Devi Ahilya APMC',
    district: 'Indore',
    state: 'Madhya Pradesh',
    cropName: 'Soybean',
    x: 37,
    y: 50,
    modalPrice: 4920,
    benchmarkPrice: 4700,
    demandLevel: 'High',
    trendPct: 4.3,
    trendUp: true,
    activeBuyers: 29,
    arrivalsQuintals: 4600,
    freightPerQtl: 180,
    transitHours: 7.5,
    aiRecommendation:
      'Central India apex grain and oilseed terminal with high competition among solvent extraction plants.',
  },
  {
    id: 'mkt-neemuch-mp',
    name: 'Neemuch Krishi Upaj Mandi',
    district: 'Neemuch',
    state: 'Madhya Pradesh',
    cropName: 'Garlic',
    x: 33,
    y: 43,
    modalPrice: 11200,
    benchmarkPrice: 10500,
    demandLevel: 'High',
    trendPct: 6.8,
    trendUp: true,
    activeBuyers: 26,
    arrivalsQuintals: 3100,
    freightPerQtl: 195,
    transitHours: 8.0,
    aiRecommendation:
      'Premier medicinal plant, garlic, and coriander trading exchange.',
  },
  {
    id: 'mkt-kota-rj',
    name: 'Kota Bhamashah APMC',
    district: 'Kota',
    state: 'Rajasthan',
    cropName: 'Soybean',
    x: 34,
    y: 38,
    modalPrice: 4800,
    benchmarkPrice: 4650,
    demandLevel: 'Moderate',
    trendPct: 1.8,
    trendUp: true,
    activeBuyers: 18,
    arrivalsQuintals: 2700,
    freightPerQtl: 240,
    transitHours: 11.0,
    aiRecommendation:
      'Major Hadoti grain terminal serving Rajasthan and MP border farmers.',
  },

  // South (KA, AP, TS, TN)
  {
    id: 'mkt-kolar-ka',
    name: 'Kolar APMC (Tomato Hub)',
    district: 'Kolar',
    state: 'Karnataka',
    cropName: 'Tomato',
    x: 38,
    y: 79,
    modalPrice: 2150,
    benchmarkPrice: 1900,
    demandLevel: 'High',
    trendPct: 8.4,
    trendUp: true,
    activeBuyers: 34,
    arrivalsQuintals: 8500,
    freightPerQtl: 230,
    transitHours: 13.0,
    aiRecommendation:
      'Asia’s second largest tomato market. High daily arrivals and pan-India truck dispatches.',
  },
  {
    id: 'mkt-bengaluru-ka',
    name: 'Yeshwanthpur APMC Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    cropName: 'Maize',
    x: 35,
    y: 81,
    modalPrice: 2450,
    benchmarkPrice: 2300,
    demandLevel: 'Moderate',
    trendPct: 2.1,
    trendUp: true,
    activeBuyers: 25,
    arrivalsQuintals: 3900,
    freightPerQtl: 240,
    transitHours: 14.0,
    aiRecommendation:
      'Major southern commercial consumption center with steady poultry feed buyer off-take.',
  },
  {
    id: 'mkt-guntur-ap',
    name: 'Guntur Mirchi Yard',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    cropName: 'Chilli',
    x: 48,
    y: 72,
    modalPrice: 18500,
    benchmarkPrice: 17200,
    demandLevel: 'High',
    trendPct: 7.9,
    trendUp: true,
    activeBuyers: 42,
    arrivalsQuintals: 6200,
    freightPerQtl: 260,
    transitHours: 15.0,
    aiRecommendation:
      'Asia’s largest red chilli market. Massive domestic spice brand and export buyer presence.',
  },
  {
    id: 'mkt-nizamabad-ts',
    name: 'Nizamabad APMC',
    district: 'Nizamabad',
    state: 'Telangana',
    cropName: 'Turmeric',
    x: 43,
    y: 67,
    modalPrice: 14200,
    benchmarkPrice: 13100,
    demandLevel: 'High',
    trendPct: 6.5,
    trendUp: true,
    activeBuyers: 28,
    arrivalsQuintals: 3400,
    freightPerQtl: 210,
    transitHours: 11.5,
    aiRecommendation:
      'Primary South-Central turmeric trading node with high curcumin grade premiums.',
  },
  {
    id: 'mkt-chennai-tn',
    name: 'Koyambedu Wholesale Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    cropName: 'Banana',
    x: 47,
    y: 82,
    modalPrice: 3200,
    benchmarkPrice: 2950,
    demandLevel: 'High',
    trendPct: 5.4,
    trendUp: true,
    activeBuyers: 31,
    arrivalsQuintals: 5100,
    freightPerQtl: 270,
    transitHours: 17.0,
    aiRecommendation:
      'Tamil Nadu’s largest perishables and fruit terminal market with rapid inventory turnover.',
  },

  // East (WB & Bihar)
  {
    id: 'mkt-burdwan-wb',
    name: 'Burdwan APMC (Rice Bowl)',
    district: 'Burdwan',
    state: 'West Bengal',
    cropName: 'Paddy',
    x: 69,
    y: 49,
    modalPrice: 2380,
    benchmarkPrice: 2200,
    demandLevel: 'Moderate',
    trendPct: 2.8,
    trendUp: true,
    activeBuyers: 22,
    arrivalsQuintals: 4400,
    freightPerQtl: 320,
    transitHours: 24.0,
    aiRecommendation:
      'Key Eastern rice trading centre supporting West Bengal, Assam, and Bihar consumption corridors.',
  },
  {
    id: 'mkt-patna-br',
    name: 'Gulabbagh Mandi Purnia',
    district: 'Purnia / Patna',
    state: 'Bihar',
    cropName: 'Maize',
    x: 64,
    y: 42,
    modalPrice: 2280,
    benchmarkPrice: 2150,
    demandLevel: 'High',
    trendPct: 4.2,
    trendUp: true,
    activeBuyers: 26,
    arrivalsQuintals: 5600,
    freightPerQtl: 310,
    transitHours: 22.0,
    aiRecommendation:
      'Eastern India’s largest maize hub supplying poultry feed millers across Nepal, Bangladesh, and NE India.',
  },
];

// Major Trade Corridors connecting mandis across India
const TRADE_CORRIDORS = [
  {
    id: 'corridor-mh-delhi',
    name: 'Western Agritech Corridor (Nashik → Delhi)',
    from: { x: 29, y: 59 }, // Lasalgaon / Nashik
    mid: { x: 37, y: 50 },  // Indore
    to: { x: 40, y: 31 },   // Delhi Azadpur
    volume: 'Heavy (Onion & Soybean)',
  },
  {
    id: 'corridor-mh-mumbai',
    name: 'Coastal Agro Express (Nashik → Vashi Mumbai)',
    from: { x: 29, y: 59 }, // Lasalgaon
    mid: { x: 27.5, y: 61 },
    to: { x: 25.5, y: 62.5 }, // Mumbai
    volume: 'Very Heavy (Daily Perishables)',
  },
  {
    id: 'corridor-mh-pune',
    name: 'Deccan Agro Link (Nashik → Pune)',
    from: { x: 29, y: 59 },
    mid: { x: 30, y: 62 },
    to: { x: 31, y: 65 }, // Pune
    volume: 'Moderate',
  },
  {
    id: 'corridor-pb-delhi',
    name: 'Northern Granary Corridor (Punjab → Delhi)',
    from: { x: 32, y: 24 }, // Khanna
    mid: { x: 36, y: 28 },  // Karnal
    to: { x: 40, y: 31 },   // Delhi
    volume: 'Heavy (Wheat & Basmati)',
  },
  {
    id: 'corridor-gj-central',
    name: 'Saurashtra Spices Link (Unjha → Indore → Mumbai)',
    from: { x: 21, y: 46 }, // Unjha
    mid: { x: 37, y: 50 },  // Indore
    to: { x: 25.5, y: 62.5 }, // Mumbai
    volume: 'High Value (Spices & Cotton)',
  },
  {
    id: 'corridor-south-ap-ts',
    name: 'Southern Spice & Veg Corridor (Kolar → Guntur → Hyderabad)',
    from: { x: 38, y: 79 }, // Kolar
    mid: { x: 48, y: 72 },  // Guntur
    to: { x: 43, y: 67 },   // Nizamabad
    volume: 'Heavy (Mirchi & Tomato)',
  },
  {
    id: 'corridor-east-ganga',
    name: 'Eastern Grain Highway (Purnia → Burdwan → Kolkata)',
    from: { x: 64, y: 42 }, // Purnia
    mid: { x: 69, y: 49 },  // Burdwan
    to: { x: 71, y: 53 },   // Kolkata
    volume: 'Heavy (Maize & Paddy)',
  },
  {
    id: 'corridor-central-kota',
    name: 'Central Pulse & Seed Corridor (Indore → Neemuch → Kota → Delhi)',
    from: { x: 37, y: 50 }, // Indore
    mid: { x: 33, y: 43 },  // Neemuch
    to: { x: 34, y: 38 },   // Kota
    volume: 'Moderate (Garlic & Pulses)',
  },
];

export const NationalMarketMap: React.FC<NationalMarketMapProps> = ({
  onSelectState,
  selectedStateName: externalSelectedState,
  farmerState = 'Maharashtra',
  farmerDistrict = 'Nashik',
  className = '',
}) => {
  const navigate = useNavigate();

  // Filters State
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');
  const [selectedDistanceRadius, setSelectedDistanceRadius] = useState<number>(0); // 0 = Pan-India
  const [selectedDemandFilter, setSelectedDemandFilter] = useState<string>('All');
  const [selectedMinPrice, setSelectedMinPrice] = useState<number>(0);

  // Active selected Mandi Node
  const [activeMandi, setActiveMandi] = useState<MandiGeoNode | null>(MANDI_GEO_NODES[0]);
  const [hoveredMandi, setHoveredMandi] = useState<MandiGeoNode | null>(null);

  // Farmer's Farm Location Node on the Map
  const farmerFarmLocation = useMemo(() => {
    // Default to Nashik coordinates (28.5, 58.5)
    return {
      name: `${farmerDistrict}, ${farmerState}`,
      x: 28.2,
      y: 58.2,
    };
  }, [farmerDistrict, farmerState]);

  // Filtered Mandi Nodes
  const filteredMandis = useMemo(() => {
    return MANDI_GEO_NODES.filter((m) => {
      // Crop filter
      if (selectedCrop !== 'All' && !m.cropName.toLowerCase().includes(selectedCrop.toLowerCase())) {
        return false;
      }
      // State filter
      if (selectedStateFilter !== 'All' && m.state.toLowerCase() !== selectedStateFilter.toLowerCase()) {
        return false;
      }
      // Demand filter
      if (selectedDemandFilter !== 'All' && m.demandLevel !== selectedDemandFilter) {
        return false;
      }
      // Price filter
      if (selectedMinPrice > 0 && m.modalPrice < selectedMinPrice) {
        return false;
      }
      // Distance filter: approximate distance from farmer node in km (1% map unit ~ 35km)
      if (selectedDistanceRadius > 0) {
        const dx = m.x - farmerFarmLocation.x;
        const dy = m.y - farmerFarmLocation.y;
        const distKm = Math.round(Math.sqrt(dx * dx + dy * dy) * 35);
        if (distKm > selectedDistanceRadius) {
          return false;
        }
      }
      return true;
    });
  }, [
    selectedCrop,
    selectedStateFilter,
    selectedDemandFilter,
    selectedMinPrice,
    selectedDistanceRadius,
    farmerFarmLocation,
  ]);

  // Compute distance from farm to active mandi
  const activeDistanceKm = useMemo(() => {
    if (!activeMandi) return 0;
    const dx = activeMandi.x - farmerFarmLocation.x;
    const dy = activeMandi.y - farmerFarmLocation.y;
    return Math.max(14, Math.round(Math.sqrt(dx * dx + dy * dy) * 35));
  }, [activeMandi, farmerFarmLocation]);

  // Potential additional net income on 100 quintal lot
  const netIncomeBoost = useMemo(() => {
    if (!activeMandi) return 0;
    const priceDiff = Math.max(0, activeMandi.modalPrice - activeMandi.benchmarkPrice);
    const netPerQtl = priceDiff - Math.round(activeMandi.freightPerQtl * 0.4);
    return Math.max(0, netPerQtl * 100);
  }, [activeMandi]);

  const handleResetFilters = () => {
    setSelectedCrop('All');
    setSelectedStateFilter('All');
    setSelectedDistanceRadius(0);
    setSelectedDemandFilter('All');
    setSelectedMinPrice(0);
  };

  return (
    <div
      id="national-market-map-container"
      className={`bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden ${className}`}
    >
      {/* 1. Header & Live Network Statistics Bar */}
      <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700/60">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Live Agricultural Intelligence Network
              </span>
              <span className="text-xs font-medium text-stone-400 hidden sm:inline">
                Real-Time APMC Feeds • e-NAM Synchronized
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
              Interactive National Market & Price Map
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Inspect APMC mandis, supply corridors, buyer demand intensity, and logistics realization metrics across India in real time.
            </p>
          </div>

          {/* Live Network Statistics Pill Box */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-stone-800/90 border border-stone-700/70 p-2.5 rounded-2xl shrink-0">
            <div className="px-2.5 py-1 text-center border-r border-stone-700">
              <div className="text-xs font-black text-emerald-400">28</div>
              <div className="text-[10px] text-stone-400 font-semibold">States</div>
            </div>
            <div className="px-2.5 py-1 text-center border-r border-stone-700">
              <div className="text-xs font-black text-emerald-400">8</div>
              <div className="text-[10px] text-stone-400 font-semibold">UTs</div>
            </div>
            <div className="px-2.5 py-1 text-center border-r border-stone-700">
              <div className="text-xs font-black text-amber-300">50+</div>
              <div className="text-[10px] text-stone-400 font-semibold">APMCs</div>
            </div>
            <div className="px-2.5 py-1 text-center border-r border-stone-700">
              <div className="text-xs font-black text-sky-400">24</div>
              <div className="text-[10px] text-stone-400 font-semibold">Verified Buyers</div>
            </div>
            <div className="px-2.5 py-1 text-center">
              <div className="text-xs font-black text-emerald-400">11</div>
              <div className="text-[10px] text-stone-400 font-semibold">Active Lots</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Filter Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            Filter Pan-India Mandi Network:
          </div>

          {(selectedCrop !== 'All' ||
            selectedStateFilter !== 'All' ||
            selectedDistanceRadius > 0 ||
            selectedDemandFilter !== 'All' ||
            selectedMinPrice > 0) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-stone-500 hover:text-stone-800 font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Crop Selector */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
              Crop Commodity
            </label>
            <select
              id="filter-crop-select"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full py-2 px-2.5 bg-white border border-stone-300 rounded-xl font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value="All">All Crops ({MANDI_GEO_NODES.length})</option>
              <option value="Onion">Onion (Nashik, Pune, Vashi)</option>
              <option value="Wheat">Wheat (Punjab, MP, Haryana)</option>
              <option value="Paddy">Paddy / Rice (Karnal, Burdwan)</option>
              <option value="Soybean">Soybean (Indore, Nagpur)</option>
              <option value="Cotton">Cotton (Rajkot, Warangal)</option>
              <option value="Tomato">Tomato (Kolar, Azadpur)</option>
              <option value="Maize">Maize (Purnia, Bengaluru)</option>
              <option value="Groundnut">Groundnut (Rajkot, Anantapur)</option>
              <option value="Chilli">Chilli (Guntur Mirchi Yard)</option>
              <option value="Cumin">Cumin (Unjha Spices Hub)</option>
              <option value="Garlic">Garlic (Neemuch Mandi)</option>
            </select>
          </div>

          {/* State Selector */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
              State Jurisdiction
            </label>
            <select
              id="filter-state-select"
              value={selectedStateFilter}
              onChange={(e) => {
                setSelectedStateFilter(e.target.value);
                if (onSelectState && e.target.value !== 'All') {
                  onSelectState(e.target.value);
                }
              }}
              className="w-full py-2 px-2.5 bg-white border border-stone-300 rounded-xl font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value="All">All States (Pan-India)</option>
              <option value="Maharashtra">Maharashtra (5 APMCs)</option>
              <option value="Punjab">Punjab</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Haryana">Haryana</option>
              <option value="Delhi (NCT)">Delhi (NCT)</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Bihar">Bihar</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>
          </div>

          {/* Distance Radius */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
              Distance Radius
            </label>
            <select
              id="filter-distance-select"
              value={selectedDistanceRadius}
              onChange={(e) => setSelectedDistanceRadius(Number(e.target.value))}
              className="w-full py-2 px-2.5 bg-white border border-stone-300 rounded-xl font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value={0}>Pan-India (Any Distance)</option>
              <option value={100}>Within 100 km (Local Mandis)</option>
              <option value={250}>Within 250 km (Regional Hubs)</option>
              <option value={500}>Within 500 km (Interstate Markets)</option>
            </select>
          </div>

          {/* Demand Level */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
              Buyer Demand
            </label>
            <select
              id="filter-demand-select"
              value={selectedDemandFilter}
              onChange={(e) => setSelectedDemandFilter(e.target.value)}
              className="w-full py-2 px-2.5 bg-white border border-stone-300 rounded-xl font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value="All">All Demand Levels</option>
              <option value="High">🟢 High Demand Only</option>
              <option value="Moderate">🟡 Moderate Demand</option>
            </select>
          </div>

          {/* Price Threshold */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
              Minimum Price
            </label>
            <select
              id="filter-price-select"
              value={selectedMinPrice}
              onChange={(e) => setSelectedMinPrice(Number(e.target.value))}
              className="w-full py-2 px-2.5 bg-white border border-stone-300 rounded-xl font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value={0}>All Price Points</option>
              <option value={2500}>Above ₹2,500/quintal</option>
              <option value={3500}>Above ₹3,500/quintal</option>
              <option value={4500}>Above ₹4,500/quintal</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main Body: Interactive Map (Left) + AI Market Intelligence Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
        {/* Left Column (7 Cols): SVG Interactive Map */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-gradient-to-b from-stone-50/70 via-white to-stone-50/40 relative flex flex-col items-center justify-center min-h-[500px]">
          {/* Map Top Status Pill */}
          <div className="w-full flex items-center justify-between gap-2 mb-2 text-xs font-bold text-stone-700">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                Showing {filteredMandis.length} Active APMC Mandi Hubs
              </span>
            </div>

            <div className="text-[11px] text-stone-500">
              Click any node to open AI Market Intelligence
            </div>
          </div>

          {/* SVG Map Canvas Container */}
          <div className="w-full max-w-lg aspect-[4/5] relative select-none">
            <svg
              viewBox="0 0 100 105"
              className="w-full h-full filter drop-shadow-sm select-none"
            >
              <defs>
                {/* Glow filter for active corridors */}
                <filter id="corridor-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* India Boundary Schematic Silhouette */}
              <path
                d="M 32 8 C 36 6, 42 12, 38 18 C 45 22, 52 24, 48 34 C 55 35, 68 36, 78 35 C 88 36, 85 45, 78 45 C 72 45, 70 52, 65 55 C 64 62, 55 72, 48 85 C 44 95, 38 98, 36 90 C 32 82, 28 72, 30 62 C 22 56, 16 52, 20 42 C 22 34, 28 26, 30 18 Z"
                fill="#f4fbf7"
                stroke="#a7f3d0"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />

              {/* Secondary internal state zone partitions */}
              <path
                d="M 38 18 Q 44 26 40 31 M 40 31 Q 34 38 37 50 M 37 50 Q 30 55 29 59 M 37 50 Q 45 60 43 67 M 43 67 Q 45 74 38 79 M 48 34 Q 55 42 64 42 M 64 42 Q 68 46 69 49 M 43 67 Q 48 70 48 72 M 38 79 Q 44 80 47 82"
                fill="none"
                stroke="#d1fae5"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />

              {/* Animated Trade Corridors */}
              {TRADE_CORRIDORS.map((corridor) => (
                <g key={corridor.id} className="pointer-events-none">
                  {/* Subtle track */}
                  <path
                    d={`M ${corridor.from.x} ${corridor.from.y} Q ${corridor.mid.x} ${corridor.mid.y} ${corridor.to.x} ${corridor.to.y}`}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.2"
                    opacity="0.6"
                  />
                  {/* Flowing animated dash stroke */}
                  <path
                    d={`M ${corridor.from.x} ${corridor.from.y} Q ${corridor.mid.x} ${corridor.mid.y} ${corridor.to.x} ${corridor.to.y}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.4"
                    strokeDasharray="3 3"
                    className="animate-corridor-flow"
                    filter="url(#corridor-glow)"
                    opacity="0.85"
                  />
                </g>
              ))}

              {/* Dynamic Connection lines from Farmer's Farm to nearby/active mandis */}
              {activeMandi && (
                <line
                  x1={farmerFarmLocation.x}
                  y1={farmerFarmLocation.y}
                  x2={activeMandi.x}
                  y2={activeMandi.y}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="animate-corridor-flow"
                />
              )}

              {/* 🌾 Farmer's Own Farm Location Marker with Radiating Pulse */}
              <g
                transform={`translate(${farmerFarmLocation.x}, ${farmerFarmLocation.y})`}
                className="cursor-pointer"
              >
                {/* Ping rings */}
                <circle
                  cx="0"
                  cy="0"
                  r="7"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  className="animate-ping opacity-60"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="4.5"
                  fill="#fef3c7"
                  stroke="#d97706"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="0" r="2.2" fill="#b45309" />

                {/* Farm Beacon Flag / Label */}
                <g transform="translate(4, -5)" pointerEvents="none">
                  <rect
                    x="0"
                    y="0"
                    width="26"
                    height="8"
                    rx="2"
                    fill="#78350f"
                    className="shadow-sm"
                  />
                  <text
                    x="13"
                    y="5.5"
                    textAnchor="middle"
                    fontSize="3"
                    fontWeight="bold"
                    fill="#fef3c7"
                  >
                    🌾 Your Farm
                  </text>
                </g>
              </g>

              {/* Interactive Mandi Nodes */}
              {filteredMandis.map((mandi) => {
                const isActive = activeMandi?.id === mandi.id;
                const isHovered = hoveredMandi?.id === mandi.id;
                const isHighDemand = mandi.demandLevel === 'High';

                return (
                  <g
                    key={mandi.id}
                    onClick={() => setActiveMandi(mandi)}
                    onMouseEnter={() => setHoveredMandi(mandi)}
                    onMouseLeave={() => setHoveredMandi(null)}
                    className="cursor-pointer group transition-transform"
                    transform={`translate(${mandi.x}, ${mandi.y})`}
                  >
                    {/* Pulsing ring for high demand */}
                    {isHighDemand && (
                      <circle
                        cx="0"
                        cy="0"
                        r={isActive ? '6' : '4.5'}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="0.8"
                        className="animate-ping opacity-50"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isActive ? '4.8' : isHovered ? '4.2' : '3.4'}
                      fill={isActive ? '#047857' : isHighDemand ? '#10b981' : '#f59e0b'}
                      stroke="#ffffff"
                      strokeWidth={isActive ? '1.8' : '1.2'}
                      className="shadow-sm transition-all"
                    />

                    {/* Small price badge next to node */}
                    <g
                      transform="translate(4, 2.5)"
                      className="pointer-events-none transition-opacity"
                    >
                      <rect
                        x="-1"
                        y="-4.5"
                        width="18"
                        height="6"
                        rx="1.5"
                        fill={isActive ? '#064e3b' : '#1e293b'}
                        opacity={isActive || isHovered ? '0.95' : '0.75'}
                      />
                      <text
                        x="8"
                        y="-0.5"
                        textAnchor="middle"
                        fontSize="2.8"
                        fontWeight="bold"
                        fill="#ffffff"
                      >
                        ₹{mandi.modalPrice}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Floating Hover Tooltip */}
            {hoveredMandi && (
              <div
                style={{
                  position: 'absolute',
                  left: `${hoveredMandi.x}%`,
                  top: `${Math.max(5, hoveredMandi.y - 12)}%`,
                }}
                className="pointer-events-none -translate-x-1/2 -translate-y-full z-30 bg-stone-900/95 text-white p-2.5 rounded-xl shadow-lg border border-stone-700 text-xs w-48 space-y-1 backdrop-blur-xs"
              >
                <div className="font-black text-stone-100 flex items-center justify-between">
                  <span>{hoveredMandi.name}</span>
                  <span className="text-[10px] text-amber-300 font-bold">
                    {hoveredMandi.cropName}
                  </span>
                </div>
                <div className="text-[11px] text-stone-300">
                  {hoveredMandi.district}, {hoveredMandi.state}
                </div>
                <div className="pt-1 border-t border-stone-700 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-400">
                    ₹{hoveredMandi.modalPrice}/q
                  </span>
                  <span
                    className={`font-bold ${
                      hoveredMandi.demandLevel === 'High'
                        ? 'text-emerald-300'
                        : 'text-amber-300'
                    }`}
                  >
                    ● {hoveredMandi.demandLevel} Demand
                  </span>
                </div>
              </div>
            )}

            {/* Map Legend (Bottom left) */}
            <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-stone-200 text-[11px] space-y-1.5 shadow-sm">
              <div className="font-bold text-stone-800 text-[10px] uppercase tracking-wider">
                Map Indicators
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-stone-900" />
                <span className="text-stone-700 font-semibold">Your Farm Origin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="text-stone-700 font-semibold">High Demand APMC</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-stone-700 font-semibold">Moderate Arrivals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-0.5 border-t-2 border-dashed border-emerald-500" />
                <span className="text-stone-700 font-semibold">Trade Corridors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): AI Market Intelligence Panel */}
        <div className="lg:col-span-5 p-5 sm:p-6 bg-white flex flex-col justify-between space-y-6">
          {activeMandi ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Mandi Top Badge & Title */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {activeMandi.state} • {activeMandi.district}
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                      activeMandi.demandLevel === 'High'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    ● {activeMandi.demandLevel} Demand
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-2">
                  {activeMandi.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Primary Trading Commodity: <strong className="text-stone-800">{activeMandi.cropName}</strong> • {activeMandi.arrivalsQuintals.toLocaleString()} quintals daily arrivals
                </p>
              </div>

              {/* Key Price & Intelligence Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Current Modal Price */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Current Modal Price
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-0.5">
                    ₹{activeMandi.modalPrice.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-stone-500">/q</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +{activeMandi.trendPct}% weekly trend
                  </div>
                </div>

                {/* Price Advantage vs Local Average */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    vs Local Benchmark
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
                    +{activeMandi.modalPrice - activeMandi.benchmarkPrice > 0 ? '₹' : '₹0'}
                    {Math.max(0, activeMandi.modalPrice - activeMandi.benchmarkPrice)}
                    <span className="text-xs font-normal text-stone-500">/q</span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Higher than farmgate avg
                  </div>
                </div>

                {/* Distance & Transit Time */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Distance from Farm
                  </div>
                  <div className="text-lg font-black text-stone-900 mt-0.5 flex items-center gap-1">
                    <Navigation className="w-4 h-4 text-emerald-700" />
                    {activeDistanceKm} km
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    ~{activeMandi.transitHours} hrs road haulage
                  </div>
                </div>

                {/* Verified Buyers & Demand */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Active Buyers Today
                  </div>
                  <div className="text-lg font-black text-stone-900 mt-0.5 flex items-center gap-1">
                    <Users className="w-4 h-4 text-emerald-700" />
                    {activeMandi.activeBuyers} Verified
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    Institutional & FPO bids
                  </div>
                </div>
              </div>

              {/* Logistics & Net Realization Breakdown */}
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">Estimated Freight Impact:</span>
                  <span className="font-black text-stone-900">
                    -₹{activeMandi.freightPerQtl}/quintal
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">Net Estimated In-Hand:</span>
                  <span className="font-black text-emerald-800">
                    ₹{activeMandi.modalPrice - activeMandi.freightPerQtl}/quintal
                  </span>
                </div>
                {netIncomeBoost > 0 && (
                  <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900">
                      Potential Additional Net Income (100q lot):
                    </span>
                    <span className="font-black text-emerald-900 text-sm">
                      +₹{netIncomeBoost.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              {/* 🤖 AI Recommendation Box */}
              <div className="bg-stone-900 text-white rounded-2xl p-4 space-y-1.5 shadow-sm">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  KrishiSetu AI Market Recommendation
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {activeMandi.aiRecommendation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/farmer/buyers?mandi=${encodeURIComponent(
                        activeMandi.name
                      )}&crop=${encodeURIComponent(activeMandi.cropName)}`
                    )
                  }
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>View Verified Buyers in {activeMandi.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/farmer/sell?crop=${encodeURIComponent(
                        activeMandi.cropName
                      )}&targetMandi=${encodeURIComponent(activeMandi.name)}`
                    )
                  }
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors border border-stone-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Start KrishiWorkflow for this Market</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-stone-500">
              <Compass className="w-12 h-12 text-stone-400 animate-pulse" />
              <div className="text-base font-bold text-stone-800">
                Select a Mandi on the Map
              </div>
              <p className="text-xs max-w-xs">
                Click any colored node on the Pan-India map or choose from the filters above to inspect live prices, transit logistics, and AI market recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
