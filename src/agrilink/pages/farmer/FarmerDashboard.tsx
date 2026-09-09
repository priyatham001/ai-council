import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  Package,
  Clock,
  CheckCircle2,
  DollarSign,
  Truck,
  Building2,
  ChevronRight,
  Calculator,
  QrCode,
  Activity,
  Award,
  Zap,
  BadgePercent,
  Layers,
  Globe,
  Compass
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { lotService } from '../../services/lotService';
import { offerService } from '../../services/offerService';
import { marketService } from '../../services/marketService';
import { localStorageService } from '../../services/storageService';
import { DigitalLot, BuyerOffer, MandiMarket, FarmerPersona } from '../../types';
import { QRCodeModal } from '../../components/common/QRCodeModal';
import { NetRealizationModal } from '../../components/common/NetRealizationModal';

export const FarmerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<FarmerPersona>(localStorageService.getPersona());
  const [lots, setLots] = useState<DigitalLot[]>([]);
  const [offers, setOffers] = useState<BuyerOffer[]>([]);
  const [selectedLotForQr, setSelectedLotForQr] = useState<DigitalLot | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setPersona(localStorageService.getPersona());
      setLots(lotService.getAllLots());
      setOffers(offerService.getAllOffers());
    };
    loadData();

    window.addEventListener('smartagrilink_data_changed', loadData);
    window.addEventListener('smartagrilink_persona_changed', loadData);
    window.addEventListener('smartagrilink_location_changed', loadData);
    return () => {
      window.removeEventListener('smartagrilink_data_changed', loadData);
      window.removeEventListener('smartagrilink_persona_changed', loadData);
      window.removeEventListener('smartagrilink_location_changed', loadData);
    };
  }, []);

  const market = (persona.mandiId ? marketService.getMarketById(persona.mandiId) : undefined) || 
                 marketService.getMarketsByState(persona.state)[0] || 
                 marketService.getAllMarkets()[0];
  const chartData = market.weeklyTrend || [];

  const personaCrop = persona.crop || persona.primaryCrop || 'Produce';
  const personaVariety = persona.variety || 'Standard Hybrid';
  const personaAcres = persona.acres || persona.farmSizeAcres || 5;
  const personaLotSize = persona.lotSizeQuintals || 50;

  // Active crop lot matching persona's crop or first lot
  const activeCropLot = lots.find(l => 
    l.crop.toLowerCase().includes(personaCrop.toLowerCase()) || 
    personaCrop.toLowerCase().includes(l.crop.toLowerCase())
  ) || lots[0];

  const displayCrop = activeCropLot?.crop || personaCrop;
  const displayVariety = activeCropLot?.variety || personaVariety;
  const displayQuantity = activeCropLot?.quantityQuintals || personaLotSize;

  // Real-time calculations for opportunity banner
  const lotOffers = activeCropLot ? offerService.getOffersForLot(activeCropLot.id) : [];
  const bestOffer = lotOffers[0];
  const bestRealizationPrice = bestOffer ? Math.round(bestOffer.estimatedNetRealizationPerQ) : (market.modalPrice + 210);
  const bestBuyerName = bestOffer ? bestOffer.buyerName : 'Verified Institutional Buyer';
  const priceGainPerQ = Math.max(90, bestRealizationPrice - market.modalPrice);
  const totalAdditionalIncome = bestOffer 
    ? Math.max(1500, bestOffer.totalNetRealization - (market.modalPrice * displayQuantity))
    : (priceGainPerQ * displayQuantity);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Personalized Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Good morning, {persona.name.split(' ')[0]} 👋
            </h1>
            <span className="badge-verified text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> PM-KISAN Verified
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700 mt-1.5 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <b className="text-gray-900">{persona.district}</b>, {persona.state}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-brand-800 font-semibold bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
              Primary: {personaCrop} ({personaAcres} Acres)
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Last updated: <b className="text-gray-800 font-semibold">Today, 09:24 AM</b></span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-xl text-xs font-bold border border-brand-200 transition-colors shadow-2xs"
          >
            <Calculator className="w-4 h-4 text-brand-700" />
            <span>Net Realization Calc</span>
          </button>

          <Link
            to="/farmer/lots/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Digital Lot</span>
          </Link>
        </div>
      </div>

      {/* 2. "Today's Opportunity" Prominent Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-brand-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-8 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Today's Opportunity
              </span>
              <span className="text-xs text-emerald-200 font-medium">
                High Net Realization Detected
              </span>
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">
                YOUR {displayCrop.toUpperCase()} LOT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                {displayQuantity} quintals • Grade A ({displayVariety})
              </h2>
            </div>

            {/* Opportunity comparison row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-emerald-200 block">Current nearby average:</span>
                <span className="text-lg font-bold text-white">₹{market.modalPrice.toLocaleString('en-IN')} / q</span>
                <span className="text-[10px] text-emerald-300/80 block mt-0.5 truncate">{market.name}</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-emerald-200 block">Best available realization:</span>
                <span className="text-lg font-black text-emerald-300">₹{bestRealizationPrice.toLocaleString('en-IN')} / q</span>
                <span className="text-[10px] text-emerald-200 block mt-0.5 truncate">{bestBuyerName}</span>
              </div>

              <div className="bg-emerald-800/50 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-400/40 sm:col-span-1">
                <span className="text-[11px] text-emerald-200 block font-semibold">Potential additional income:</span>
                <span className="text-xl font-black text-emerald-300 block">
                  +₹{totalAdditionalIncome.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-100 font-medium block mt-0.5">After freight & handling</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <Link
              to="/farmer/offers"
              className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore Offers ({lotOffers.length > 0 ? lotOffers.length : 2})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/farmer/ai-advisor"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs border border-white/20 transition-colors text-center"
            >
              Run Full AI Sell Advisor
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Pan-India National Agricultural Intelligence Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                Pan-India Market Intelligence Network
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                28 States + 8 UTs Active
              </span>
            </div>
            <p className="text-xs text-gray-700 mt-0.5 font-medium">
              Live arbitrage monitoring across 50+ APMC Mandis. Active Persona: <b className="text-brand-900">{persona.name}</b> ({persona.district}, {persona.state})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/farmer/markets"
            className="px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Interactive National Map</span>
          </Link>
          <Link
            to="/farmer/ai-advisor"
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Advisor</span>
          </Link>
        </div>
      </div>

      {/* 4. Dashboard KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Best Nearby Price */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Best Nearby Price
              </span>
              <div className="text-3xl font-black text-gray-900 mt-1">
                ₹{market.modalPrice.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-700">/q</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> ↑ {market.priceChangePct ?? 4.2}%
            </span>
            <span className="text-gray-700 font-medium truncate max-w-[140px]">{market.name} ({market.distanceKm || 25} km)</span>
          </div>
        </div>

        {/* KPI 2: Potential Additional Income */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-white shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Potential Additional Income
              </span>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                +₹{totalAdditionalIncome.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-100 text-xs text-gray-700 flex items-center justify-between">
            <span>Net take-home gain</span>
            <span className="font-bold text-brand-800 truncate max-w-[150px]">{displayQuantity}q {displayCrop}</span>
          </div>
        </div>

        {/* KPI 3: Verified Buyers */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Verified Buyers
              </span>
              <div className="text-3xl font-black text-gray-900 mt-1">
                24
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-700 flex items-center justify-between">
            <span>100% KYC & GSTIN vetted</span>
            <Link to="/farmer/buyers" className="text-brand-700 font-bold hover:underline">View →</Link>
          </div>
        </div>

        {/* KPI 4: Active Lots */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Active Lots
              </span>
              <div className="text-3xl font-black text-gray-900 mt-1">
                {lots.length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-700 flex items-center justify-between">
            <span>{offers.length} commercial bids active</span>
            <Link to="/farmer/lots" className="text-brand-700 font-bold hover:underline">Manage →</Link>
          </div>
        </div>
      </div>

      {/* 5. Price Intelligence Panel & Recharts Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 cols: Price Intelligence with 7-Day & 30-Day Metrics */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-gray-900">
                    {displayCrop} — {market.name}
                  </h3>
                  <span className="badge-verified text-[10px] font-bold">APMC Yard</span>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{persona.state}</span>
                </div>
                <p className="text-xs text-gray-700 mt-0.5">
                  7-Day trading trajectory and arrival absorption analysis ({persona.district} district)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 7-day: +{market.priceChangePct ?? 4.2}%
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                  30-day: +12.4%
                </span>
              </div>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-[10px] text-gray-700 block font-medium">Current Modal Price:</span>
                <span className="text-base font-black text-gray-900">₹{market.modalPrice.toLocaleString('en-IN')} / q</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-700 block font-medium">Daily Arrivals:</span>
                <span className="text-base font-black text-gray-900">{market.arrivalsQuintals.toLocaleString('en-IN')} q</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-700 block font-medium">Buyer Demand:</span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  {market.demandLevel} Demand
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-700 block font-medium">Trading Range:</span>
                <span className="text-xs font-bold text-gray-700 font-mono block mt-0.5">
                  ₹{market.minPrice.toLocaleString('en-IN')} – ₹{market.maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="farmerPriceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15803d" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}/q`, 'Modal Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke="#15803d" strokeWidth={2.5} fillOpacity={1} fill="url(#farmerPriceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-700">Source: APMC {market.name} Ledger • Demo market data</span>
            <Link to="/farmer/markets" className="text-brand-700 font-bold hover:underline flex items-center gap-1">
              <span>Compare {persona.state} & National Mandis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right 4 cols: Active Lots Quick Hub */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Your Digital Lots</h3>
              <Link to="/farmer/lots/new" className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> New
              </Link>
            </div>

            <div className="space-y-2.5">
              {lots.slice(0, 3).map((lot) => (
                <div
                  key={lot.id}
                  className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-brand-300 transition-all text-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{lot.crop}</span>
                      <span className="text-[10px] text-gray-700 font-mono block mt-0.5">{lot.lotNumber}</span>
                    </div>
                    <span className="badge-verified text-[10px]">{lot.qualityGrade}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-700 pt-1 border-t border-gray-100">
                    <span>{lot.quantityQuintals} quintals</span>
                    <button
                      onClick={() => setSelectedLotForQr(lot)}
                      className="text-brand-700 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <QrCode className="w-3 h-3" /> Passport
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/farmer/offers"
            className="w-full py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-xl text-xs font-bold text-center border border-brand-200 transition-colors block"
          >
            Review Received Bids ({offers.length}) →
          </Link>
        </div>
      </div>

      <QRCodeModal
        lot={selectedLotForQr}
        isOpen={!!selectedLotForQr}
        onClose={() => setSelectedLotForQr(null)}
      />

      <NetRealizationModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        initialCrop={displayCrop}
        initialQuantity={displayQuantity}
      />
    </div>
  );
};
