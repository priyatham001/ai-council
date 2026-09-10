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
  LayoutGrid,
  Sun,
  Moon,
  Tv
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
import { useTheme } from '../../context/ThemeContext';
import { useFarmerGuide } from '../../context/FarmerGuideContext';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { FarmerBuyerLinkageAnimation } from '../../components/common/FarmerBuyerLinkageAnimation';
import {
  localizeCropName,
  localizeGrade,
  localizeState,
  localizeStatus,
  localizeBuyerType,
  localizeUnit,
} from '../../utils/cropLocalization';

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
  const { isDark, toggleTheme } = useTheme();
  const { setGuideStepId, setTargetSelector } = useFarmerGuide();

  // Linkage animation modal toggle
  const [showLinkageAnimation, setShowLinkageAnimation] = useState(false);

  // Active Tab: 'lots' | 'requests' | 'farmers' | 'markets'
  const [activeTab, setActiveTab] = useState<'lots' | 'requests' | 'farmers' | 'markets'>('lots');

  useEffect(() => {
    setGuideStepId('buyer-browse');
    setTargetSelector('#buyer-lots-section');
  }, [setGuideStepId, setTargetSelector]);

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
      notes: offerNotes || 'Official commercial bid submitted directly through AgriConnect Marketplace.'
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
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
                      AGRI<span className="text-emerald-400">CONNECT</span>
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

            {/* Nav Links + Language Selector + Theme Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-800 transition-colors cursor-pointer"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-200" />}
              </button>

              {/* View Animated Linkage Modal */}
              <button
                type="button"
                onClick={() => setShowLinkageAnimation(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title={t('buyer.howItConnects') || 'Watch Farmer to Buyer Connection Animation'}
              >
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{t('buyer.howItConnects') || 'How It Connects'}</span>
              </button>

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
              {t('buyer.exchangeTag') || 'Institutional & Commercial Procurement Exchange'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t('buyer.heroTitle') || 'Sourcing Directly from Verified Indian Farmers'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300">
              {t('buyer.heroSubtitle') || 'Review AI-graded produce lots with verified digital passports, place competitive bids, or publish procurement requirements for automatic farmer matching.'}
            </p>
          </div>
        </div>

        {/* TAB 1: BROWSE AVAILABLE CROP LOTS */}
        {activeTab === 'lots' && (
          <div id="buyer-lots-section" className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t('buyer.searchCropPlaceholder') || 'Search crop (Paddy, Onion, Tomato, Wheat...)'}
                    value={searchCrop}
                    onChange={(e) => setSearchCrop(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:bg-white dark:focus:bg-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* Grade Filter */}
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="py-2 px-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200 focus:bg-white dark:focus:bg-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="All">{t('buyer.allGrades') || 'All Quality Grades'}</option>
                  <option value="Grade A">🟢 {t('buyer.gradeA') || 'Grade A (Premium)'}</option>
                  <option value="Grade B">🔵 {t('buyer.gradeB') || 'Grade B (Standard)'}</option>
                  <option value="Grade C">🟠 {t('buyer.gradeC') || 'Grade C (Lower)'}</option>
                </select>

                {/* State Filter */}
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="py-2 px-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200 focus:bg-white dark:focus:bg-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="All">{t('buyer.allStates') || 'All States (Pan-India)'}</option>
                  <option value="Andhra Pradesh">{localizeState('Andhra Pradesh', language)}</option>
                  <option value="Maharashtra">{localizeState('Maharashtra', language)}</option>
                  <option value="Punjab">{localizeState('Punjab', language)}</option>
                  <option value="Karnataka">{localizeState('Karnataka', language)}</option>
                  <option value="Telangana">{localizeState('Telangana', language)}</option>
                  <option value="Madhya Pradesh">{localizeState('Madhya Pradesh', language)}</option>
                  <option value="Gujarat">{localizeState('Gujarat', language)}</option>
                </select>
              </div>

              {/* View Switcher: List vs Google Map */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setLotViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      lotViewMode === 'list'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
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
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>{t('buyer.googleMapView') || 'Google Map View'}</span>
                  </button>
                </div>

                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:block">
                  <strong className="text-stone-900 dark:text-stone-100">{filteredLots.length}</strong> {t('buyer.availableLotsCount') || 'available lots'}
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
                          <span className="text-[10px] font-mono uppercase bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700 font-bold">
                            {lot.lotNumber}
                          </span>
                          <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1">
                            {localizeCropName(lot.crop, language)}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {lot.variety || 'Standard Hybrid'}
                          </p>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            lot.qualityGrade.includes('A')
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {localizeGrade(lot.qualityGrade, language)}
                        </span>
                      </div>

                      {/* Location & Farmer */}
                      <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-100 dark:border-stone-700/60 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-semibold">
                            {lot.district ? `${lot.district}, ${localizeState(lot.state, language)}` : (lot.location || '')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-[11px] pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                          <span>{t('buyer.farmer') || 'Farmer'}: <strong className="text-stone-800 dark:text-stone-200">{lot.farmerName}</strong></span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> {t('buyer.kycVerified') || 'KYC Verified'}
                          </span>
                        </div>
                      </div>

                      {/* Metrics: Quantity & Asking Price */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                          <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
                            {t('buyer.availableLotSize') || 'Available Lot Size'}
                          </div>
                          <div className="text-base font-black text-stone-900 dark:text-stone-100 mt-0.5">
                            {lot.quantityQuintals} {localizeUnit('q', language)}
                            <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
                              {' '}({(lot.quantityQuintals / 10).toFixed(1)} {localizeUnit('MT', language)})
                            </span>
                          </div>
                        </div>

                        <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                          <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
                            {t('buyer.farmerAskingPrice') || 'Farmer Asking Price'}
                          </div>
                          <div className="text-base font-black text-emerald-800 dark:text-emerald-300 mt-0.5">
                            ₹{lot.expectedPricePerQ.toLocaleString('en-IN')}
                            <span className="text-[10px] font-normal text-stone-500 dark:text-stone-400">/{localizeUnit('q', language)}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Verification Badge */}
                      <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1.5 rounded-lg font-semibold border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{t('buyer.aiAssayed') || 'AI Assayed'}: {localizeGrade(lot.qualityGrade, language)}</span>
                        </div>
                        {lot.interestedBuyers && lot.interestedBuyers.length > 0 && (
                          <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 font-bold bg-amber-200/80 dark:bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-300/40 dark:border-amber-700/40">
                            {lot.interestedBuyers.length} {t('buyer.buyersInterested') || 'buyers interested'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: View Details / Inspect + Direct Bid */}
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLotForDetails(lot)}
                        className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{t('buyer.inspectContact') || 'Inspect & Contact'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenOfferModal(lot)}
                        className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title={t('buyer.bid') || 'Submit Quick Commercial Offer'}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
              <div>
                <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
                  {t('buyer.activeRequestsTitle') || 'Active Buyer Procurement Requests'}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {t('buyer.activeRequestsSubtitle') || 'Institutional buyers and retail aggregators seeking farmgate supply across India'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{t('buyer.publishDemand') || 'Publish Procurement Demand'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {buyerRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4 flex flex-col justify-between transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {localizeBuyerType(req.buyerType, language)}
                        </span>
                        <h3 className="text-base font-black text-stone-900 dark:text-stone-100 mt-1">
                          {localizeCropName(req.cropName, language)}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                          {t('buyer.buyer') || 'Buyer'}: <strong className="text-stone-800 dark:text-stone-200">{req.buyerName}</strong>
                        </p>
                      </div>

                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        ● {localizeStatus(req.status, language)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-stone-50 dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200/80 dark:border-stone-700">
                        <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
                          {t('buyer.requiredVolume') || 'Required Volume'}
                        </div>
                        <div className="text-base font-black text-stone-900 dark:text-stone-100 mt-0.5">
                          {req.quantityQuintals} {localizeUnit('quintals', language)}
                        </div>
                      </div>

                      <div className="bg-stone-50 dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200/80 dark:border-stone-700">
                        <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
                          {t('buyer.targetBudget') || 'Target Budget'}
                        </div>
                        <div className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                          ₹{req.targetPricePerQ.toLocaleString('en-IN')}/{localizeUnit('q', language)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-100 dark:border-stone-700/60">
                      <div>
                        <strong className="text-stone-800 dark:text-stone-200">{t('buyer.targetLocation') || 'Target Location'}:</strong> {req.deliveryLocation}
                      </div>
                      <div>
                        <strong className="text-stone-800 dark:text-stone-200">{t('buyer.qualitySpec') || 'Quality Spec'}:</strong> {req.qualityRequirement}
                      </div>
                      {req.notes && (
                        <div className="text-stone-500 dark:text-stone-400 italic text-[11px] pt-1">
                          "{req.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {t('buyer.posted') || 'Posted'} {req.createdAt}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/farmer?crop=${encodeURIComponent(req.cropName)}&request=${encodeURIComponent(req.id)}`
                        )
                      }
                      className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      {t('buyer.matchProduceLot') || 'Match Produce Lot →'}
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
            <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
              <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
                {t('buyer.farmerNetworkTitle') || 'Pan-India Verified Farmer & FPO Network'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {t('buyer.farmerNetworkSubtitle') || 'Farmers with authenticated PM-KISAN, KYC, and land records ready for direct institutional trade'}
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
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-3 flex flex-col justify-between transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-black text-stone-900 dark:text-stone-100 text-base">
                          {farmer.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{farmer.village}, {farmer.district}, {localizeState(farmer.state, language)}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {t('buyer.verifiedBadge') || 'Verified'}
                      </span>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-100 dark:border-stone-700 text-xs space-y-1.5">
                      <div>
                        <span className="text-stone-500 dark:text-stone-400">{t('buyer.primaryCrops') || 'Primary Crops'}:</span>{' '}
                        <strong className="text-stone-900 dark:text-stone-100">
                          {farmer.crops.map((c) => localizeCropName(c, language)).join(', ')}
                        </strong>
                      </div>
                      <div>
                        <span className="text-stone-500 dark:text-stone-400">{t('buyer.landHolding') || 'Land Holding'}:</span>{' '}
                        <strong className="text-stone-900 dark:text-stone-100">{farmer.acres} {t('buyer.acres') || 'Acres'}</strong>
                      </div>
                      <div>
                        <span className="text-stone-500 dark:text-stone-400">{t('buyer.affiliatedFPO') || 'Affiliated FPO'}:</span>{' '}
                        <strong className="text-emerald-700 dark:text-emerald-400">{farmer.fpo}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRequestModalOpen(true);
                      setNewRequestCrop(farmer.crops[0]);
                    }}
                    className="w-full py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition-colors border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{t('buyer.requestFarmProduce') || 'Request Farm Produce'}</span>
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
            <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
              <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
                {t('buyer.mandiBenchmarkTitle') || 'Pan-India APMC Mandi Benchmark Prices'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {t('buyer.mandiBenchmarkSubtitle') || 'Official modal pricing and arrival volumes synchronized across e-NAM and APMC networks'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PAN_INDIA_MARKETS.slice(0, 9).map((mkt) => (
                <div
                  key={mkt.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs space-y-3 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-stone-900 dark:text-stone-100 text-sm">{mkt.name}</h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{mkt.district}, {localizeState(mkt.state, language)}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {localizeCropName(mkt.cropName, language)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 dark:bg-stone-800 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700">
                    <div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-bold">{t('buyer.modalPrice') || 'Modal Price'}</span>
                      <div className="text-base font-black text-emerald-700 dark:text-emerald-400">
                        ₹{mkt.modalPrice}/{localizeUnit('q', language)}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-bold">{t('buyer.arrivals') || 'Arrivals'}</span>
                      <div className="text-base font-black text-stone-800 dark:text-stone-200">
                        {mkt.arrivalsQuintals} {localizeUnit('q', language)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: MAKE AN OFFER / BID ON LOT (DARK MODE ENABLED) */}
      {selectedLotForOffer && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150 transition-colors">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-lg">
                  💰
                </span>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    Submit Commercial Bid / Offer
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Lot: {selectedLotForOffer.lotNumber} ({selectedLotForOffer.crop})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLotForOffer(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Produce snapshot */}
            <div className="bg-stone-50 dark:bg-stone-800 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">{t('buyer.farmer') || 'Farmer'}:</span>
                <strong className="text-stone-900 dark:text-stone-100">{selectedLotForOffer.farmerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">{t('buyer.location') || 'Location'}:</span>
                <strong className="text-stone-900 dark:text-stone-100">{selectedLotForOffer.location}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">{t('buyer.aiGrade') || 'AI Quality Grade'}:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{localizeGrade(selectedLotForOffer.qualityGrade, language)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">{t('buyer.farmerAskingPrice') || 'Farmer Asking Price'}:</span>
                <strong className="text-stone-900 dark:text-stone-100">₹{selectedLotForOffer.expectedPricePerQ}/{localizeUnit('quintal', language)}</strong>
              </div>
            </div>

            {/* Offer Form */}
            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('buyer.yourOfferedPrice') || 'Your Offered Price (₹ per Quintal)'} *
                </label>
                <input
                  type="number"
                  min={500}
                  max={200000}
                  required
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full py-2.5 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-black text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('buyer.quantityWanted') || 'Quantity Wanted (Quintals)'} *
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedLotForOffer.quantityQuintals}
                  required
                  value={offerQuantity}
                  onChange={(e) => setOfferQuantity(Number(e.target.value))}
                  className="w-full py-2.5 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-black text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
                <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 block">
                  {t('buyer.maxAvailable') || 'Max available in this lot'}: {selectedLotForOffer.quantityQuintals} {localizeUnit('quintals', language)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('buyer.buyerNotes') || 'Buyer Notes / Transport Terms (Optional)'}
                </label>
                <textarea
                  rows={2}
                  placeholder={t('buyer.buyerNotesPlaceholder') || 'e.g., We arrange pickup truck from farmgate within 24 hours. Immediate weighbridge RTGS payment.'}
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  className="w-full py-2 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Total Calculation Preview */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
                <span className="font-bold text-stone-700 dark:text-stone-300">{t('buyer.grossValue') || 'Gross Procurement Value'}:</span>
                <span className="text-base font-black text-emerald-800 dark:text-emerald-300">
                  ₹{(offerPrice * offerQuantity).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLotForOffer(null)}
                  className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {t('common.cancel') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  id="buyer-offer-submit-btn"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('buyer.sendOffer') || 'Send Offer to Farmer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE PROCUREMENT DEMAND (DARK MODE ENABLED) */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150 transition-colors">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-lg">
                  📢
                </span>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    {t('buyer.publishDemand') || 'Publish Procurement Demand'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {t('buyer.broadcastSubtitle') || 'Broadcast your produce requirements to verified farmers'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('buyer.cropCommodity') || 'Crop Commodity'} *
                </label>
                <select
                  value={newRequestCrop}
                  onChange={(e) => setNewRequestCrop(e.target.value)}
                  className="w-full py-2 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="Paddy (Dhan / Rice)">{localizeCropName('Paddy (Dhan / Rice)', language)}</option>
                  <option value="Wheat (Gehun)">{localizeCropName('Wheat (Gehun)', language)}</option>
                  <option value="Onion (Nasik Red)">{localizeCropName('Onion (Nasik Red)', language)}</option>
                  <option value="Tomato">{localizeCropName('Tomato', language)}</option>
                  <option value="Maize (Corn)">{localizeCropName('Maize (Corn)', language)}</option>
                  <option value="Chilli (Teja)">{localizeCropName('Chilli (Teja)', language)}</option>
                  <option value="Soybean (Yellow)">{localizeCropName('Soybean (Yellow)', language)}</option>
                  <option value="Cotton (Kapas)">{localizeCropName('Cotton (Kapas)', language)}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('buyer.requiredQuantity') || 'Required Quantity (q)'} *
                  </label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={newRequestQty}
                    onChange={(e) => setNewRequestQty(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t('buyer.targetBudget') || 'Target Budget'} (₹/{localizeUnit('q', language)}) *
                  </label>
                  <input
                    type="number"
                    min={500}
                    required
                    value={newRequestPrice}
                    onChange={(e) => setNewRequestPrice(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('buyer.targetDeliveryLocation') || 'Target Delivery Location / APMC'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('buyer.targetLocationPlaceholder') || 'e.g., Nizamabad APMC, Hyderabad, or Farmgate pickup'}
                  value={newRequestLocation}
                  onChange={(e) => setNewRequestLocation(e.target.value)}
                  className="w-full py-2 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-medium text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('buyer.qualityRequirements') || 'Quality Requirements'}
                </label>
                <input
                  type="text"
                  placeholder={t('buyer.qualitySpecPlaceholder') || 'e.g., Grade A preferred, clean luster, low moisture'}
                  value={newRequestQuality}
                  onChange={(e) => setNewRequestQuality(e.target.value)}
                  className="w-full py-2 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-medium text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t('buyer.procurementNotes') || 'Procurement Notes'}
                </label>
                <textarea
                  rows={2}
                  placeholder={t('buyer.procurementNotesPlaceholder') || 'e.g., Immediate weighbridge RTGS payment. We can send our own 10-tonne truck.'}
                  value={newRequestNotes}
                  onChange={(e) => setNewRequestNotes(e.target.value)}
                  className="w-full py-2 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-medium text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {t('common.cancel') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('buyer.publishRequirement') || 'Publish Requirement'}</span>
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

      {/* Linkage Animation Modal */}
      {showLinkageAnimation && (
        <FarmerBuyerLinkageAnimation
          isOpen={showLinkageAnimation}
          onClose={() => setShowLinkageAnimation(false)}
        />
      )}

      {/* 3. Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🌾</span>
            <span className="font-extrabold text-stone-200 text-sm font-outfit">
              AgriConnect
            </span>
            <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
              {t('buyer.directFarmerLinkage') || 'Direct Farmer Linkage'}
            </span>
          </div>
          <p className="text-amber-400 font-medium text-xs">
            {t('buyer.footerHeadline') || 'Direct Farm-to-Buyer Marketplace Linkage Platform'}
          </p>
          <p className="text-[11px] text-stone-500 max-w-xl mx-auto">
            {t('buyer.footerDesc') || 'AgriConnect connects farmers directly with audited institutional buyers and regional APMC mandis with guaranteed digital settlement.'}
          </p>
          <p className="text-[10px] text-stone-600 pt-2 border-t border-stone-800">
            © {new Date().getFullYear()} AgriConnect • {t('buyer.directFarmerLinkage') || 'Direct Farmgate Linkage Platform'}
          </p>
        </div>
      </footer>
    </div>
  );
};
