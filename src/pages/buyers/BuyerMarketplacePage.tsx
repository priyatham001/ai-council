import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Package,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Send,
  Plus,
  Clock,
  Sparkles,
  Phone,
  AlertCircle,
  X,
  Layers,
  Building2,
  Check,
  Compass,
  FileText,
  Map as MapIcon,
  LayoutGrid
} from 'lucide-react';
import { lotService } from '../../agrilink/services/lotService';
import { offerService } from '../../agrilink/services/offerService';
import { localStorageService } from '../../agrilink/services/storageService';
import { DigitalLot, BuyerOffer } from '../../agrilink/types';
import { DEMO_BUYERS } from '../../agrilink/data/mockData';
import { PAN_INDIA_MARKETS } from '../../agrilink/data/panIndiaData';
import { BuyerLotsGoogleMapView } from '../../components/buyers/BuyerLotsGoogleMapView';
import { LotDetailsModal } from '../../components/buyers/LotDetailsModal';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../../components/common/LanguageSelector';

// Buyer Procurement Request Interface
interface BuyerRequest {
  id: string;
  cropName: string;
  quantityQuintals: number;
  targetPricePerQ: number;
  deliveryLocation: string;
  requiredDate: string;
  qualityRequirement: string;
  buyerName: string;
  buyerType: string;
  status: 'Open' | 'Fulfilling' | 'Closed';
  createdAt: string;
  notes?: string;
}

const DEFAULT_BUYER_REQUESTS: BuyerRequest[] = [
  {
    id: 'req-01',
    cropName: 'Paddy (Basmati / Sona Masuri)',
    quantityQuintals: 150,
    targetPricePerQ: 2450,
    deliveryLocation: 'Nizamabad / Hyderabad Hub, Telangana',
    requiredDate: 'Within 5 days',
    qualityRequirement: 'Grade A or B (Clean luster, <14% moisture appearance)',
    buyerName: 'Deccan Rice Processors Pvt Ltd',
    buyerType: 'Food Processing',
    status: 'Open',
    createdAt: '2 hours ago',
    notes: 'Immediate full payment on weighbridge clearance. Truck pickup available from farm.'
  },
  {
    id: 'req-02',
    cropName: 'Onion (Nasik Red / Garwa)',
    quantityQuintals: 200,
    targetPricePerQ: 2920,
    deliveryLocation: 'Vashi Terminal, Navi Mumbai',
    requiredDate: 'Immediate',
    qualityRequirement: 'Grade A (55mm+ uniform size, dry outer skin)',
    buyerName: 'National Agri Export Hub',
    buyerType: 'Exporter',
    status: 'Open',
    createdAt: 'Today, 09:30 AM',
    notes: 'Direct container export dispatch. High-volume recurring purchase agreement available.'
  },
  {
    id: 'req-03',
    cropName: 'Tomato (Hybrid / Semi-Ripe)',
    quantityQuintals: 80,
    targetPricePerQ: 1950,
    deliveryLocation: 'Bengaluru / Kolar Hub, Karnataka',
    requiredDate: 'Next 48 hours',
    qualityRequirement: 'Grade A or Standard (Firm surface, minimal blemishes)',
    buyerName: 'FreshBasket Supermarkets Retail Chain',
    buyerType: 'Retail Chain',
    status: 'Open',
    createdAt: 'Yesterday',
    notes: 'Direct farmgate collection by refrigerated trucks.'
  },
  {
    id: 'req-04',
    cropName: 'Wheat (Sharbati / Lokwan)',
    quantityQuintals: 300,
    targetPricePerQ: 2520,
    deliveryLocation: 'Indore Mandi Gate, Madhya Pradesh',
    requiredDate: 'Within 7 days',
    qualityRequirement: 'Grade A (Bold grain, high protein)',
    buyerName: 'Malwa Flour & Agro Millers',
    buyerType: 'Wholesale Trader',
    status: 'Open',
    createdAt: '3 days ago',
    notes: 'Direct weighbridge receipt with instant RTGS escrow payment.'
  }
];

export const BuyerMarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  // Active Tab: 'lots' | 'requests' | 'farmers' | 'markets'
  const [activeTab, setActiveTab] = useState<'lots' | 'requests' | 'farmers' | 'markets'>('lots');

  // Filter states
  const [searchCrop, setSearchCrop] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistance, setSelectedDistance] = useState('All');

  // Lots View Mode: 'list' (cards) vs 'map' (Google Maps Platform)
  const [lotViewMode, setLotViewMode] = useState<'list' | 'map'>('list');

  // Active lots from service
  const [lots, setLots] = useState<DigitalLot[]>([]);
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>(DEFAULT_BUYER_REQUESTS);

  // Detailed Listing Inspection Modal
  const [selectedLotForDetails, setSelectedLotForDetails] = useState<DigitalLot | null>(null);

  // Offer Modal State
  const [selectedLotForOffer, setSelectedLotForOffer] = useState<DigitalLot | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerQuantity, setOfferQuantity] = useState<number>(0);
  const [offerNotes, setOfferNotes] = useState<string>('');
  const [offerSuccessToast, setOfferSuccessToast] = useState<string | null>(null);

  // New Request Form Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [newRequestCrop, setNewRequestCrop] = useState<string>('Paddy (Rice)');
  const [newRequestQty, setNewRequestQty] = useState<number>(50);
  const [newRequestPrice, setNewRequestPrice] = useState<number>(2400);
  const [newRequestLocation, setNewRequestLocation] = useState<string>('Hyderabad, Telangana');
  const [newRequestQuality, setNewRequestQuality] = useState<string>('Grade A or B');
  const [newRequestNotes, setNewRequestNotes] = useState<string>('');

  useEffect(() => {
    const load = () => {
      setLots(lotService.getAllLots());
    };
    load();
    window.addEventListener('smartagrilink_data_changed', load);
    return () => window.removeEventListener('smartagrilink_data_changed', load);
  }, []);

  // Filtered Lots
  const filteredLots = lots.filter((lot) => {
    if (searchCrop && !lot.crop.toLowerCase().includes(searchCrop.toLowerCase())) {
      return false;
    }
    if (selectedGrade !== 'All' && !lot.qualityGrade.includes(selectedGrade)) {
      return false;
    }
    if (selectedState !== 'All' && lot.state !== selectedState) {
      return false;
    }
    return true;
  });

  // Handle Offer Submission
  const handleOpenOfferModal = (lot: DigitalLot) => {
    setSelectedLotForOffer(lot);
    setOfferPrice(lot.expectedPricePerQ || 2400);
    setOfferQuantity(lot.quantityQuintals || 10);
    setOfferNotes('');
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotForOffer) return;

    // Create a new offer in offerService
    const gross = offerPrice * offerQuantity;
    const freight = Math.round(offerQuantity * 35);
    const handling = 600;
    const net = gross - (freight + handling);

    const newOffer: BuyerOffer = {
      id: `off-usr-${Date.now()}`,
      offerNumber: `BID-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      lotId: selectedLotForOffer.id,
      buyerId: 'buyer-portal-user',
      buyerName: 'Verified Agri Trader (You)',
      buyerRating: 4.9,
      buyerLocation: 'Regional Terminal Market',
      buyerDistanceKm: 32,
      buyerReliabilityPct: 98,
      offeredPricePerQ: offerPrice,
      quantityQuintals: offerQuantity,
      transportAllowance: freight,
      handlingCost: handling,
      estimatedNetRealizationPerQ: Math.round(net / offerQuantity),
      totalNetRealization: net,
      grossSaleValue: gross,
      paymentTerms: 'Within 24 hours via Escrow',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes: offerNotes || 'Official commercial bid submitted directly through KrishiSetu Marketplace.'
    };

    // Store in storage
    const all = localStorageService.getOffers();
    localStorageService.saveOffers([newOffer, ...all]);

    setOfferSuccessToast(
      `✓ Official Offer of ₹${offerPrice.toLocaleString('en-IN')}/q submitted to farmer ${selectedLotForOffer.farmerName}! Notification sent.`
    );
    setSelectedLotForOffer(null);

    setTimeout(() => {
      setOfferSuccessToast(null);
    }, 5000);
  };

  // Handle Formal "I'm Interested" Submission
  const handleInterestSubmitted = (
    lotId: string,
    info: {
      buyerName: string;
      buyerPhone: string;
      quantityQuintals: number;
      notes?: string;
    }
  ) => {
    const updated = lotService.addInterestedBuyer(lotId, info);
    if (updated) {
      setLots(lotService.getAllLots());
      setOfferSuccessToast(
        `✓ Purchase interest of ${info.quantityQuintals} quintals sent directly to farmer ${updated.farmerName}!`
      );
      setTimeout(() => setOfferSuccessToast(null), 5000);
    }
  };

  // Handle New Procurement Request Submission
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: BuyerRequest = {
      id: `req-${Date.now()}`,
      cropName: newRequestCrop,
      quantityQuintals: Number(newRequestQty),
      targetPricePerQ: Number(newRequestPrice),
      deliveryLocation: newRequestLocation,
      requiredDate: 'Within 7 days',
      qualityRequirement: newRequestQuality,
      buyerName: 'Institutional Commodity Buyer (You)',
      buyerType: 'Commercial Procurement',
      status: 'Open',
      createdAt: 'Just now',
      notes: newRequestNotes
    };

    setBuyerRequests([newReq, ...buyerRequests]);
    setIsRequestModalOpen(false);
    setOfferSuccessToast(`✓ New procurement request for ${newRequestCrop} published! Matching nearby farmers notified.`);
    setTimeout(() => setOfferSuccessToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Notification Toast */}
      {offerSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{offerSuccessToast}</span>
          <button
            type="button"
            onClick={() => setOfferSuccessToast(null)}
            className="text-stone-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header & Navigation Bar */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900/80 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 text-left group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center text-xl shadow-md font-bold group-hover:scale-105 transition-transform">
                  <span>🏪</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-black tracking-tight font-outfit text-white">
                      KRISHI<span className="text-emerald-400">SETU</span>
                    </span>
                    <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {t('buyer.marketplace') || 'BUYER MARKETPLACE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300 font-medium hidden sm:block">
                    {t('buyer.buyDirect') || 'Buy Directly From Verified Farmers Across India'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Nav Links + Language Selector */}
            <div className="flex items-center gap-2">
              <LanguageSelector variant="dark" />
              <Link
                to="/"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-200 hover:text-white transition-colors"
              >
                {t('buyer.home') || 'Home'}
              </Link>
              <Link
                to="/farmer"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-200 hover:text-white hover:bg-emerald-900 transition-colors flex items-center gap-1.5"
              >
                <span>👨‍🌾</span>
                <span>{t('buyer.farmerJourney') || 'Farmer Journey'}</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('buyer.postDemand') || 'Post Procurement Demand'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Header Navigation Tabs */}
        <div className="bg-emerald-900/60 border-t border-emerald-900 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('lots')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'lots'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>🌾 {t('buyer.availableLots') || 'Available Crop Lots'} ({lots.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>📢 {t('buyer.procurementRequests') || 'Buyer Procurement Requests'} ({buyerRequests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('farmers')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'farmers'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>👨‍🌾 {t('buyer.verifiedFarmers') || 'Verified Farmer Network'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('markets')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'markets'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>📊 {t('buyer.mandiBenchmarks') || 'Mandi Benchmark Rates'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/60 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Institutional & Commercial Procurement Exchange
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sourcing Directly from Verified Indian Farmers
            </h1>
            <p className="text-xs sm:text-sm text-stone-300">
              Review AI-graded produce lots with verified digital passports, place competitive bids, or publish procurement requirements for automatic farmer matching.
            </p>
          </div>
        </div>

        {/* TAB 1: BROWSE AVAILABLE CROP LOTS */}
        {activeTab === 'lots' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t('buyer.searchCropPlaceholder') || 'Search crop (Paddy, Onion, Tomato, Wheat...)'}
                    value={searchCrop}
                    onChange={(e) => setSearchCrop(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* Grade Filter */}
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="All">{t('buyer.allGrades') || 'All Quality Grades'}</option>
                  <option value="Grade A">🟢 Grade A (Premium)</option>
                  <option value="Grade B">🔵 Grade B (Standard)</option>
                  <option value="Grade C">🟠 Grade C (Lower)</option>
                </select>

                {/* State Filter */}
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="All">{t('buyer.allStates') || 'All States (Pan-India)'}</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>

              {/* View Switcher: List vs Google Map */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-300">
                  <button
                    type="button"
                    onClick={() => setLotViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      lotViewMode === 'list'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{t('buyer.cardsList') || 'Cards List'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLotViewMode('map')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      lotViewMode === 'map'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>{t('buyer.googleMapView') || 'Google Map View'}</span>
                  </button>
                </div>

                <div className="text-xs text-stone-500 font-medium hidden sm:block">
                  <strong className="text-stone-900">{filteredLots.length}</strong> {t('buyer.availableLotsCount') || 'available lots'}
                </div>
              </div>
            </div>

            {/* Render Google Map View or Card Grid */}
            {lotViewMode === 'map' ? (
              <BuyerLotsGoogleMapView
                lots={filteredLots}
                selectedLot={selectedLotForDetails}
                onSelectLot={(l) => setSelectedLotForDetails(l)}
                onOpenDetails={(l) => setSelectedLotForDetails(l)}
              />
            ) : (
              /* Lots Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLots.map((lot) => (
                  <div
                    key={lot.id}
                    className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4 card-3d preserve-3d transform-gpu hover:scale-[1.02] hover:-translate-y-1"
                  >
                    <div className="space-y-3">
                      {/* Header: Lot ID + Grade */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200 font-bold">
                            {lot.lotNumber}
                          </span>
                          <h3 className="text-lg font-black text-stone-900 mt-1">
                            {lot.crop}
                          </h3>
                          <p className="text-xs text-stone-500">
                            {lot.variety || 'Standard Hybrid'}
                          </p>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            lot.qualityGrade.includes('A')
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {lot.qualityGrade}
                        </span>
                      </div>

                      {/* Location & Farmer */}
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="font-semibold">{lot.location || `${lot.district}, ${lot.state}`}</span>
                        </div>
                        <div className="flex items-center justify-between text-stone-500 text-[11px] pt-1 border-t border-stone-200/60">
                          <span>Farmer: <strong className="text-stone-800">{lot.farmerName}</strong></span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> KYC Verified
                          </span>
                        </div>
                      </div>

                      {/* Metrics: Quantity & Asking Price */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                          <div className="text-[10px] uppercase font-bold text-stone-500">
                            Available Lot Size
                          </div>
                          <div className="text-base font-black text-stone-900 mt-0.5">
                            {lot.quantityQuintals} q
                            <span className="text-[11px] font-normal text-stone-500">
                              {' '}({(lot.quantityQuintals / 10).toFixed(1)} MT)
                            </span>
                          </div>
                        </div>

                        <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                          <div className="text-[10px] uppercase font-bold text-stone-500">
                            Farmer Asking Price
                          </div>
                          <div className="text-base font-black text-emerald-800 mt-0.5">
                            ₹{lot.expectedPricePerQ.toLocaleString('en-IN')}
                            <span className="text-[10px] font-normal text-stone-500">/q</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Verification Badge */}
                      <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg font-semibold border border-emerald-200">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                          <span>AI Assayed: {lot.qualityGrade}</span>
                        </div>
                        {lot.interestedBuyers && lot.interestedBuyers.length > 0 && (
                          <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-200/80 px-1.5 py-0.5 rounded">
                            {lot.interestedBuyers.length} buyers interested
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: View Details / Inspect + Direct Bid */}
                    <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLotForDetails(lot)}
                        className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{t('buyer.inspectContact') || 'Inspect & Contact'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenOfferModal(lot)}
                        className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Submit Quick Commercial Offer"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>{t('buyer.bid') || 'Bid'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BUYER PROCUREMENT REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div>
                <h2 className="text-lg font-black text-stone-900">
                  Active Buyer Procurement Requests
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Institutional buyers and retail aggregators seeking farmgate supply across India
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Procurement Demand</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {buyerRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {req.buyerType}
                        </span>
                        <h3 className="text-base font-black text-stone-900 mt-1">
                          {req.cropName}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium">
                          Buyer: <strong className="text-stone-800">{req.buyerName}</strong>
                        </p>
                      </div>

                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ● {req.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                        <div className="text-[10px] uppercase font-bold text-stone-500">
                          Required Volume
                        </div>
                        <div className="text-base font-black text-stone-900 mt-0.5">
                          {req.quantityQuintals} quintals
                        </div>
                      </div>

                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                        <div className="text-[10px] uppercase font-bold text-stone-500">
                          Target Budget
                        </div>
                        <div className="text-base font-black text-emerald-800 mt-0.5">
                          ₹{req.targetPricePerQ.toLocaleString('en-IN')}/q
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div>
                        <strong>Target Location:</strong> {req.deliveryLocation}
                      </div>
                      <div>
                        <strong>Quality Spec:</strong> {req.qualityRequirement}
                      </div>
                      {req.notes && (
                        <div className="text-stone-500 italic text-[11px] pt-1">
                          "{req.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Posted {req.createdAt}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/farmer?crop=${encodeURIComponent(req.cropName)}&request=${encodeURIComponent(req.id)}`
                        )
                      }
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      Match Produce Lot →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VERIFIED FARMER NETWORK */}
        {activeTab === 'farmers' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <h2 className="text-lg font-black text-stone-900">
                Pan-India Verified Farmer & FPO Network
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Farmers with authenticated PM-KISAN, KYC, and land records ready for direct institutional trade
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  name: 'Ramesh Varma',
                  village: 'Somaram, Bhimavaram',
                  district: 'West Godavari',
                  state: 'Andhra Pradesh',
                  crops: ['Paddy (BPT-5204)', 'Tomato'],
                  acres: 8.5,
                  fpo: 'Godavari Delta Krishi Producer Co.',
                  verified: true
                },
                {
                  name: 'Suresh Patil',
                  village: 'Lasalgaon, Niphad',
                  district: 'Nashik',
                  state: 'Maharashtra',
                  crops: ['Onion (Nasik Red)', 'Grapes'],
                  acres: 5.5,
                  fpo: 'Sahyadri Farmers Producer Co.',
                  verified: true
                },
                {
                  name: 'Gurpreet Singh',
                  village: 'Khanna Rural',
                  district: 'Ludhiana',
                  state: 'Punjab',
                  crops: ['Wheat (PBW-502)', 'Paddy (PR-126)'],
                  acres: 14.0,
                  fpo: 'Malwa Grain Farmers Union',
                  verified: true
                },
                {
                  name: 'Venkat Rao',
                  village: 'Kovvur',
                  district: 'Guntur',
                  state: 'Andhra Pradesh',
                  crops: ['Chilli (Guntur Teja)', 'Cotton'],
                  acres: 6.0,
                  fpo: 'Amaravati Spice Producers Association',
                  verified: true
                },
                {
                  name: 'Manjunath Gowda',
                  village: 'Vokkaleri',
                  district: 'Kolar',
                  state: 'Karnataka',
                  crops: ['Tomato', 'French Beans', 'Maize'],
                  acres: 4.5,
                  fpo: 'Kolar Agro Horticulture FPO',
                  verified: true
                },
                {
                  name: 'Ratan Lal Patidar',
                  village: 'Sanwer Tehsil',
                  district: 'Indore',
                  state: 'Madhya Pradesh',
                  crops: ['Soybean (Yellow)', 'Wheat (Sharbati)'],
                  acres: 9.0,
                  fpo: 'Narmada Valley Agro Producer Co.',
                  verified: true
                }
              ].map((farmer, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-black text-stone-900 text-base">
                          {farmer.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{farmer.village}, {farmer.district}, {farmer.state}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified
                      </span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1.5">
                      <div>
                        <span className="text-stone-500">Primary Crops:</span>{' '}
                        <strong className="text-stone-900">{farmer.crops.join(', ')}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500">Land Holding:</span>{' '}
                        <strong className="text-stone-900">{farmer.acres} Acres</strong>
                      </div>
                      <div>
                        <span className="text-stone-500">Affiliated FPO:</span>{' '}
                        <strong className="text-emerald-800">{farmer.fpo}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRequestModalOpen(true);
                      setNewRequestCrop(farmer.crops[0]);
                    }}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors border border-stone-200 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Request Farm Produce</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MANDI BENCHMARK RATES */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <h2 className="text-lg font-black text-stone-900">
                Pan-India APMC Mandi Benchmark Prices
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Official modal pricing and arrival volumes synchronized across e-NAM and APMC networks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PAN_INDIA_MARKETS.slice(0, 9).map((mkt) => (
                <div
                  key={mkt.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-stone-900 text-sm">{mkt.name}</h4>
                      <p className="text-xs text-stone-500">{mkt.district}, {mkt.state}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {mkt.cropName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold">Modal Price</span>
                      <div className="text-base font-black text-emerald-800">
                        ₹{mkt.modalPrice}/q
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold">Arrivals</span>
                      <div className="text-base font-black text-stone-800">
                        {mkt.arrivalsQuintals} q
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: MAKE AN OFFER / BID ON LOT */}
      {selectedLotForOffer && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-lg">
                  💰
                </span>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    Submit Commercial Bid / Offer
                  </h3>
                  <p className="text-xs text-stone-500">
                    Lot: {selectedLotForOffer.lotNumber} ({selectedLotForOffer.crop})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLotForOffer(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Produce snapshot */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Farmer:</span>
                <strong className="text-stone-900">{selectedLotForOffer.farmerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Location:</span>
                <strong className="text-stone-900">{selectedLotForOffer.location}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">AI Quality Grade:</span>
                <strong className="text-emerald-700 font-bold">{selectedLotForOffer.qualityGrade}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Farmer Asking Price:</span>
                <strong className="text-stone-900">₹{selectedLotForOffer.expectedPricePerQ}/quintal</strong>
              </div>
            </div>

            {/* Offer Form */}
            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Offered Price (₹ per Quintal) *
                </label>
                <input
                  type="number"
                  min={500}
                  max={200000}
                  required
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full py-2.5 px-3 bg-white border border-stone-300 rounded-xl text-sm font-black text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Quantity Wanted (Quintals) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedLotForOffer.quantityQuintals}
                  required
                  value={offerQuantity}
                  onChange={(e) => setOfferQuantity(Number(e.target.value))}
                  className="w-full py-2.5 px-3 bg-white border border-stone-300 rounded-xl text-sm font-black text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Max available in this lot: {selectedLotForOffer.quantityQuintals} quintals
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Buyer Notes / Transport Terms (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., We arrange pickup truck from farmgate within 24 hours. Immediate weighbridge RTGS payment."
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Total Calculation Preview */}
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between">
                <span className="font-bold text-stone-700">Gross Procurement Value:</span>
                <span className="text-base font-black text-emerald-900">
                  ₹{(offerPrice * offerQuantity).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLotForOffer(null)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Offer to Farmer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE PROCUREMENT DEMAND */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900 text-lg">
                  📢
                </span>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    Publish Procurement Demand
                  </h3>
                  <p className="text-xs text-stone-500">
                    Broadcast your produce requirements to verified farmers
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Crop Commodity *
                </label>
                <select
                  value={newRequestCrop}
                  onChange={(e) => setNewRequestCrop(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="Paddy (Dhan / Rice)">Paddy (Dhan / Rice)</option>
                  <option value="Wheat (Gehun)">Wheat (Gehun)</option>
                  <option value="Onion (Nasik Red)">Onion (Nasik Red)</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Maize (Corn)">Maize (Corn)</option>
                  <option value="Chilli (Teja)">Chilli (Teja)</option>
                  <option value="Soybean (Yellow)">Soybean (Yellow)</option>
                  <option value="Cotton (Kapas)">Cotton (Kapas)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Required Quantity (q) *
                  </label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={newRequestQty}
                    onChange={(e) => setNewRequestQty(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Target Budget (₹/q) *
                  </label>
                  <input
                    type="number"
                    min={500}
                    required
                    value={newRequestPrice}
                    onChange={(e) => setNewRequestPrice(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Target Delivery Location / APMC *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Nizamabad APMC, Hyderabad, or Farmgate pickup"
                  value={newRequestLocation}
                  onChange={(e) => setNewRequestLocation(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-stone-300 rounded-xl font-medium text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Quality Requirements
                </label>
                <input
                  type="text"
                  placeholder="e.g., Grade A preferred, clean luster, low moisture"
                  value={newRequestQuality}
                  onChange={(e) => setNewRequestQuality(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-stone-300 rounded-xl font-medium text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Procurement Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Immediate weighbridge RTGS payment. We can send our own 10-tonne truck."
                  value={newRequestNotes}
                  onChange={(e) => setNewRequestNotes(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-stone-300 rounded-xl font-medium text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Requirement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lot Details Modal with AI Quality Report & Express Interest */}
      <LotDetailsModal
        lot={selectedLotForDetails}
        isOpen={!!selectedLotForDetails}
        onClose={() => setSelectedLotForDetails(null)}
        onInterestSubmitted={handleInterestSubmitted}
      />

      {/* 3. Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🌾</span>
            <span className="font-extrabold text-stone-200 text-sm font-outfit">
              KrishiSetu
            </span>
            <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
              Kisan AI Marketplace
            </span>
          </div>
          <p className="text-amber-400 font-medium text-xs">
            From Your Farm to the Right Market
          </p>
          <p className="text-[11px] text-stone-500 max-w-xl mx-auto">
            KrishiSetu connects farmers directly with audited institutional buyers and regional APMC mandis with guaranteed digital settlement.
          </p>
          <p className="text-[10px] text-stone-600 pt-2 border-t border-stone-800">
            © 2026 KrishiSetu • Powered by Kisan AI • Built with ❤️ by IDEA FORGE
          </p>
        </div>
      </footer>
    </div>
  );
};
