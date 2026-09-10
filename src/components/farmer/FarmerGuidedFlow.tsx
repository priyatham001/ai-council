import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Check,
  MapPin,
  Camera,
  Upload,
  Sparkles,
  Phone,
  ArrowRight,
  ArrowLeft,
  Store,
  DollarSign,
  Truck,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  RotateCcw,
  Star,
  CheckCircle2,
} from 'lucide-react';
import {
  CropItem,
  CropCategory,
  Language,
  LocationData,
  MarketItem,
} from '../../types/krishi';
import { CROP_DATABASE, filterCrops, getCropImageUrl } from '../../data/cropsData';
import { findGeographicMarkets } from '../../data/indiaWideMarkets';
import { TRANSLATIONS, getTranslation } from '../../utils/i18n';
import { lotService } from '../../agrilink/services/lotService';
import { useFarmerGuide } from '../../context/FarmerGuideContext';

interface FarmerGuidedFlowProps {
  location: LocationData;
  language: Language;
  onChangeLocationClick: () => void;
  onLanguageChange: (lang: Language) => void;
}

export const FarmerGuidedFlow: React.FC<FarmerGuidedFlowProps> = ({
  location,
  language,
  onChangeLocationClick,
  onLanguageChange,
}) => {
  const navigate = useNavigate();
  const t = getTranslation(language);
  const { setGuideStepId, setTargetSelector } = useFarmerGuide();

  // 7 Guided Steps: 1=Crop, 2=Details, 3=Photos, 4=Quality, 5=Markets, 6=Contact, 7=Publish
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Sync farmer guide with current flow step
  useEffect(() => {
    switch (currentStep) {
      case 1:
        setGuideStepId('farmer-crop');
        setTargetSelector('#farmer-crop-section');
        break;
      case 2:
        setGuideStepId('farmer-details');
        setTargetSelector('#farmer-details-section');
        break;
      case 3:
        setGuideStepId('farmer-photos');
        setTargetSelector('#farmer-photos-section');
        break;
      case 4:
        setGuideStepId('farmer-quality');
        setTargetSelector('#farmer-quality-section');
        break;
      case 5:
        setGuideStepId('farmer-markets');
        setTargetSelector('#farmer-markets-section');
        break;
      case 6:
        setGuideStepId('farmer-contact');
        setTargetSelector('#farmer-contact-section');
        break;
      case 7:
        setGuideStepId('farmer-publish');
        setTargetSelector('#farmer-publish-section');
        break;
      default:
        setGuideStepId('idle');
        break;
    }
  }, [currentStep, setGuideStepId, setTargetSelector]);

  // Step 1: Crop Selection
  const [selectedCrop, setSelectedCrop] = useState<CropItem | null>(() => CROP_DATABASE[0]);
  const [categoryFilter, setCategoryFilter] = useState<CropCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customCropName, setCustomCropName] = useState<string>('');

  // Step 2: Crop Details
  const [variety, setVariety] = useState<string>('Standard FAQ Hybrid');
  const [quantity, setQuantity] = useState<string>('50');
  const [unit, setUnit] = useState<'quintal' | 'kg' | 'tonne'>('quintal');
  const [harvestDate, setHarvestDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [expectedPrice, setExpectedPrice] = useState<number>(() => CROP_DATABASE[0].modalPrice);

  // Step 3: Photos Upload
  const [cropPhotos, setCropPhotos] = useState<string[]>(() => [
    CROP_DATABASE[0].imageUrl || getCropImageUrl(CROP_DATABASE[0].id),
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4: Quality Info (Farmer-declared)
  const [declaredGrade, setDeclaredGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');

  // Step 5: Market Discovery & Comparison
  const [marketTab, setMarketTab] = useState<'recommended' | 'nearest' | 'best_price'>('recommended');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  // Step 6: Farmer Contact Details
  const [farmerName, setFarmerName] = useState<string>('Ramesh Reddy');
  const [farmerMobile, setFarmerMobile] = useState<string>('9848012345');
  const [contactMethod, setContactMethod] = useState<'both' | 'call' | 'whatsapp'>('both');
  const [contactError, setContactError] = useState<string>('');

  // Step 7: Publishing & Success Modal
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishedSuccess, setPublishedSuccess] = useState<boolean>(false);
  const [publishedListingId, setPublishedListingId] = useState<string>('');

  // Update default price when crop changes
  useEffect(() => {
    if (selectedCrop) {
      setExpectedPrice(selectedCrop.modalPrice);
      // Auto assign crop photo if none uploaded yet
      if (cropPhotos.length === 0 || cropPhotos[0].includes('photo-')) {
        setCropPhotos([selectedCrop.imageUrl || getCropImageUrl(selectedCrop.id)]);
      }
    }
  }, [selectedCrop]);

  // Filtered crop catalogue
  const filteredCrops = useMemo(() => {
    return filterCrops(CROP_DATABASE, categoryFilter, searchQuery);
  }, [categoryFilter, searchQuery]);

  // Calculate nearby markets based on farmer's REAL location
  const marketAnalysis = useMemo(() => {
    const lat = location.latitude || 14.4673;
    const lng = location.longitude || 78.8242;
    const basePrice = expectedPrice || 2350;

    const nearby = findGeographicMarkets(lat, lng, basePrice, location.state);

    const qtyNum = parseFloat(quantity) || 1;
    let qtyQuintals = qtyNum;
    if (unit === 'kg') qtyQuintals = qtyNum / 100;
    else if (unit === 'tonne') qtyQuintals = qtyNum * 10;

    const qualityMultiplier = declaredGrade === 'Grade A' ? 1.05 : declaredGrade === 'Grade C' ? 0.95 : 1.0;

    const calculated = nearby.map((mkt, idx) => {
      const adjustedPrice = Math.round(mkt.pricePerQuintal * qualityMultiplier);
      const grossAmount = Math.round(adjustedPrice * qtyQuintals);
      const distance = mkt.roadDistanceKm || mkt.distanceKm || 10;
      const transportPerQtl = Math.max(25, Math.round(15 + distance * 1.8));
      const transportCost = Math.round(transportPerQtl * qtyQuintals);
      const marketFee = Math.round(grossAmount * (mkt.marketFeePercent / 100));
      const unloadingCharge = Math.round(mkt.unloadingChargePerQtl * qtyQuintals);
      const netReturn = grossAmount - transportCost - marketFee - unloadingCharge;
      const netPerQtl = Math.round(netReturn / qtyQuintals);

      return {
        market: mkt,
        adjustedPrice,
        grossAmount,
        distance,
        transportCost,
        marketFee,
        unloadingCharge,
        netReturn,
        netPerQtl,
        isBestOption: false,
      };
    });

    // Mark best overall return
    calculated.sort((a, b) => b.netReturn - a.netReturn);
    if (calculated.length > 0) {
      calculated[0].isBestOption = true;
    }

    return calculated;
  }, [location, expectedPrice, quantity, unit, declaredGrade]);

  // Set default selected market
  useEffect(() => {
    if (marketAnalysis.length > 0 && !selectedMarketId) {
      setSelectedMarketId(marketAnalysis[0].market.id);
    }
  }, [marketAnalysis, selectedMarketId]);

  // Sorted list for tabs
  const displayedMarkets = useMemo(() => {
    const list = [...marketAnalysis];
    if (marketTab === 'nearest') {
      return list.sort((a, b) => a.distance - b.distance);
    }
    if (marketTab === 'best_price') {
      return list.sort((a, b) => b.adjustedPrice - a.adjustedPrice);
    }
    // 'recommended': sorted by net return
    return list.sort((a, b) => b.netReturn - a.netReturn);
  }, [marketAnalysis, marketTab]);

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCropPhotos((prev) => [event.target!.result as string, ...prev.slice(0, 3)]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (idx: number) => {
    setCropPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  // Step 6 Validation
  const validateContact = () => {
    if (!farmerName.trim()) {
      setContactError('Please enter your full name');
      return false;
    }
    const cleanPhone = farmerMobile.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setContactError('Please enter a valid 10-digit mobile number');
      return false;
    }
    setContactError('');
    return true;
  };

  // Step 7: Final Publishing to Database and Local Storage
  const handlePublishListing = async () => {
    if (!validateContact()) return;

    setIsPublishing(true);

    const qtyNum = parseFloat(quantity) || 1;
    let qtyQuintals = qtyNum;
    if (unit === 'kg') qtyQuintals = qtyNum / 100;
    else if (unit === 'tonne') qtyQuintals = qtyNum * 10;

    const cropTitle = customCropName.trim() || selectedCrop?.name || 'Farm Produce';
    const mainPhoto = cropPhotos[0] || getCropImageUrl(selectedCrop?.id || 'tomato');

    // 1. Save to localStorage service for immediate client reactivity
    try {
      lotService.createLot({
        crop: cropTitle,
        variety: variety || 'Standard FAQ',
        quantityQuintals: Math.round(qtyQuintals * 10) / 10,
        harvestDate: harvestDate,
        location: `${location.city || location.town || 'Farm'}, ${location.district || ''}`,
        district: location.district || 'YSR Kadapa',
        state: location.state || 'Andhra Pradesh',
        expectedPricePerQ: expectedPrice,
        qualityGrade: declaredGrade,
        qualityMetrics: {
          size: declaredGrade === 'Grade A' ? 90 : 75,
          color: declaredGrade === 'Grade A' ? 95 : 80,
          freshness: declaredGrade === 'Grade A' ? 92 : 78,
          damage: declaredGrade === 'Grade A' ? 95 : 82,
          moisture: declaredGrade === 'Grade A' ? 88 : 75,
          overallScore: declaredGrade === 'Grade A' ? 92 : 78,
          grade: declaredGrade,
        },
        imageUrl: mainPhoto,
        farmerName: farmerName,
        farmerPhone: farmerMobile,
        contactMethod: contactMethod === 'whatsapp' ? 'WhatsApp' : 'Phone Call',
        farmerConfirmedGrade: declaredGrade,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } catch (err) {
      console.warn('Local lotService error:', err);
    }

    // 2. Save to backend database API
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName,
          farmerPhone: farmerMobile,
          preferredContact: contactMethod,
          cropId: selectedCrop?.id || 'crop-custom',
          cropName: cropTitle,
          variety,
          category: selectedCrop?.category || 'vegetables',
          quantity: qtyNum,
          unit,
          expectedPricePerUnit: expectedPrice,
          qualityGrade: declaredGrade,
          photos: cropPhotos,
          harvestDate,
          location: {
            village: location.village || location.town || location.city,
            city: location.city || location.town,
            district: location.district,
            state: location.state,
            latitude: location.latitude,
            longitude: location.longitude,
            formattedAddress: location.formattedAddress,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPublishedListingId(data.listing?.id || 'list-1');
      }
    } catch (err) {
      console.warn('Backend listing save warning:', err);
    }

    setIsPublishing(false);
    setPublishedSuccess(true);
  };

  // Digital Guide Messages per step
  const guideMessages: Record<number, string> = {
    1: t.guideCrop,
    2: t.guideDetails,
    3: t.guidePhotos,
    4: t.guideQuality,
    5: t.guideMarkets,
    6: t.guideContact,
    7: t.guidePublish,
  };

  const stepsList = [
    { num: 1, label: 'Crop' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Photos' },
    { num: 4, label: 'Quality' },
    { num: 5, label: 'Markets' },
    { num: 6, label: 'Contact' },
    { num: 7, label: 'Publish' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* TOP BAR: LOCATION CHIP & ROLE SWITCHER                        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-stone-900 dark:text-white font-outfit uppercase tracking-wider">
                Farmer Selling Portal
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">
                Live
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {location.city || location.district || 'Kadapa'}, {location.state || 'Andhra Pradesh'}
              </span>
              <button
                type="button"
                onClick={onChangeLocationClick}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold ml-1 cursor-pointer"
              >
                (Change)
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/buyers"
            className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>🏢</span>
            <span>Switch to Buyer Mode</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DIGITAL FARMER GUIDE AVATAR & SPEECH BUBBLE                   */}
      {/* ------------------------------------------------------------- */}
      <motion.div
        key={`guide-${currentStep}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-3xl p-4 sm:p-5 text-white shadow-lg flex items-start sm:items-center gap-4 relative overflow-hidden"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner border border-white/30">
          👨‍🌾
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-wider uppercase text-emerald-200 font-mono">
              Digital Agri Guide
            </span>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              Step {currentStep} of 7
            </span>
          </div>
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-emerald-50">
            {guideMessages[currentStep]}
          </p>
        </div>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/* STEP PROGRESS BAR                                             */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-3 sm:p-4 border border-stone-200 dark:border-stone-800 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[550px] gap-2">
          {stepsList.map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => {
                  if (st.num < currentStep) setCurrentStep(st.num);
                }}
                disabled={st.num > currentStep}
                className={`flex-1 flex flex-col items-center gap-1.5 py-1 px-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'text-emerald-700 dark:text-emerald-400 font-black'
                    : isCompleted
                    ? 'text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer'
                    : 'text-stone-400 dark:text-stone-600 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <span className="text-[11px] whitespace-nowrap">{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: SELECT CROP                                           */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
                {t.whatSelling}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Choose from popular crops or search your harvest
              </p>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchCropsPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { key: 'all', label: t.allCrops, icon: '🌾' },
              { key: 'cereals', label: t.cereals, icon: '🥣' },
              { key: 'pulses', label: t.pulses, icon: '🍲' },
              { key: 'vegetables', label: t.vegetables, icon: '🥦' },
              { key: 'fruits', label: t.fruits, icon: '🥭' },
              { key: 'commercial', label: t.commercial, icon: '🌱' },
            ].map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategoryFilter(cat.key as CropCategory)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  categoryFilter === cat.key
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Crops Grid with natural photography */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCrops.map((crop) => {
              const isSelected = selectedCrop?.id === crop.id;
              const photoUrl = crop.imageUrl || getCropImageUrl(crop.id);
              const localName = crop.localNames[language] || crop.localNames.en || crop.name;

              return (
                <div
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop)}
                  className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-xl scale-[1.02] bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-stone-900 shadow-sm'
                  }`}
                >
                  <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={photoUrl}
                      alt={crop.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-2 left-2 text-xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-lg p-1">
                      {crop.icon}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        ✓
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <p className="text-xs sm:text-sm font-black truncate drop-shadow">
                        {localName}
                      </p>
                      <p className="text-[10px] text-stone-200 truncate">
                        {crop.localNames.hi || crop.name}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between gap-1 text-xs">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">
                      Benchmark:
                    </span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">
                      ₹{crop.modalPrice.toLocaleString('en-IN')}/{crop.defaultUnit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={!selectedCrop}
              onClick={() => setCurrentStep(2)}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{t.continueButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: CROP DETAILS                                          */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 2 && selectedCrop && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
                Harvest Details
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Selected Produce: <span className="font-bold text-emerald-600">{selectedCrop.name}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-stone-500 hover:text-emerald-600 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change Crop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variety */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Crop Variety / Hybrid Name
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Sona Masoori, Abhinav, Teja Bold, Desi"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quantity & Unit */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Quantity for Sale
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-black focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="quintal">Quintal (100 kg)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="tonne">Tonne (1,000 kg)</option>
                </select>
              </div>
            </div>

            {/* Expected Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Expected Price (₹ per {unit})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-black focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-stone-500">
                Regional APMC benchmark: ₹{selectedCrop.modalPrice} / {selectedCrop.defaultUnit}
              </p>
            </div>

            {/* Harvest Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Harvest Date / Availability
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-sm text-stone-700 dark:text-stone-300"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Upload Photos →</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: UPLOAD CROP PHOTOS                                    */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
              {t.uploadCropPhotos}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              {t.uploadCropPhotosDesc}
            </p>
          </div>

          {/* Photos Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cropPhotos.map((imgUrl, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden h-36 border-2 border-emerald-500/50 shadow-md group bg-stone-100 dark:bg-stone-800"
              >
                <img
                  src={imgUrl}
                  alt={`Crop Photo ${i + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-lg hover:scale-110 transition-transform"
                >
                  ✕
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-sm">
                  Photo {i + 1}
                </div>
              </div>
            ))}

            {/* Upload Action Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 h-36 flex flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer transition-colors bg-stone-50/50 dark:bg-stone-800/30"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                + Add Photo
              </span>
              <span className="text-[10px] text-stone-400">
                Camera or gallery
              </span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          {/* Quality Guidance Note */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <p className="font-bold">Tips for helpful photos:</p>
              <p>
                • Place produce in natural daylight without harsh shadows.
              </p>
              <p>
                • Include a close-up showing color, skin/grain cleanliness, and size uniformity.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-sm text-stone-700 dark:text-stone-300"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Declare Quality →</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 4: QUALITY INFORMATION (FARMER-DECLARED)                 */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                {t.farmerDeclaredQuality}
              </span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white font-outfit mt-2">
              {t.whatQuality}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              {t.farmerDeclaredNote}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Grade A */}
            <div
              onClick={() => setDeclaredGrade('Grade A')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                declaredGrade === 'Grade A'
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/30 ring-4 ring-emerald-500/20 shadow-lg'
                  : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-black">
                  Grade A
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  +5% Premium Price
                </span>
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base mb-1">
                {t.gradeAPremium}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {t.gradeADesc}
              </p>
            </div>

            {/* Grade B */}
            <div
              onClick={() => setDeclaredGrade('Grade B')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                declaredGrade === 'Grade B'
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/30 ring-4 ring-emerald-500/20 shadow-lg'
                  : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-black">
                  Grade B
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Standard Mandi FAQ
                </span>
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base mb-1">
                {t.gradeBStandard}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {t.gradeBDesc}
              </p>
            </div>

            {/* Grade C */}
            <div
              onClick={() => setDeclaredGrade('Grade C')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                declaredGrade === 'Grade C'
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/30 ring-4 ring-emerald-500/20 shadow-lg'
                  : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-stone-500 text-white text-xs font-black">
                  Grade C
                </span>
                <span className="text-xs font-bold text-stone-500">
                  -5% Discount
                </span>
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base mb-1">
                {t.gradeCBasic}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {t.gradeCDesc}
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-sm text-stone-700 dark:text-stone-300"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Compare Nearby Markets →</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 5: MARKET DISCOVERY & COMPARISON                         */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
                  {t.bestMarketsNearYou}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                  Calculated from your farm in{' '}
                  <span className="font-bold text-emerald-600">
                    {location.city || location.district || 'Kadapa'}, {location.state}
                  </span>{' '}
                  with live freight & fees
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMarketTab('recommended')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    marketTab === 'recommended'
                      ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  ⭐ {t.recommendedForYou}
                </button>
                <button
                  type="button"
                  onClick={() => setMarketTab('nearest')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    marketTab === 'nearest'
                      ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  📍 {t.nearestMarkets}
                </button>
                <button
                  type="button"
                  onClick={() => setMarketTab('best_price')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    marketTab === 'best_price'
                      ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  💰 {t.bestPriceMarkets}
                </button>
              </div>
            </div>

            {/* Markets List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedMarkets.map((item, idx) => {
                const isSelected = selectedMarketId === item.market.id;
                return (
                  <div
                    key={item.market.id}
                    onClick={() => setSelectedMarketId(item.market.id)}
                    className={`rounded-2xl p-5 border-2 cursor-pointer transition-all text-left relative space-y-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-4 ring-emerald-500/20 shadow-xl'
                        : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-stone-900'
                    }`}
                  >
                    {item.isBestOption && (
                      <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                        <span>🏆</span>
                        <span>Best Overall Choice</span>
                      </span>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-white text-base">
                          {item.market.name}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {item.market.district}, {item.market.state}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {item.distance} km
                      </span>
                    </div>

                    {/* Price and Net Return Breakdown */}
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Mandi Price:</span>
                        <span className="font-black text-stone-900 dark:text-white">
                          ₹{item.adjustedPrice}/qtl
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>Freight Cost:</span>
                        <span className="text-red-600 dark:text-red-400 font-bold">
                          - ₹{item.transportCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>Mandi Cess & Unloading:</span>
                        <span className="text-red-600 dark:text-red-400 font-bold">
                          - ₹{(item.marketFee + item.unloadingCharge).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between items-baseline font-black">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          Net Take-Home:
                        </span>
                        <span className="text-base text-emerald-600 dark:text-emerald-400">
                          ₹{item.netReturn.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified APMC Yard</span>
                      </span>
                      <span className="text-stone-400">Same-Day Payment</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-sm text-stone-700 dark:text-stone-300"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Contact Details →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 6: FARMER CONTACT DETAILS                                */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 6 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
              {t.farmerContactDetails}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Interested buyers and millers will contact you directly on these details
            </p>
          </div>

          {contactError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{contactError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                {t.farmerName} *
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder="e.g. Ramesh Reddy, Suresh Patil"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                {t.farmerMobile} *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={farmerMobile}
                  onChange={(e) => setFarmerMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9848012345"
                  className="w-full pl-14 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-bold tracking-wider focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                {t.contactMethod}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'both', label: 'Phone & WhatsApp', icon: '📱' },
                  { key: 'call', label: t.phoneCall, icon: '📞' },
                  { key: 'whatsapp', label: t.whatsApp, icon: '💬' },
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setContactMethod(m.key as any)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      contactMethod === m.key
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t.privacyNote}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-sm text-stone-700 dark:text-stone-300"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (validateContact()) setCurrentStep(7);
              }}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Review & Publish →</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 7: REVIEW & PUBLISH LISTING                              */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 7 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
              {t.reviewPublish}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Confirm your listing details before broadcasting to verified buyers
            </p>
          </div>

          {/* Detailed Summary Card */}
          <div className="rounded-3xl border-2 border-emerald-500/40 p-6 bg-gradient-to-br from-emerald-50/20 via-white to-stone-50/20 dark:from-emerald-950/20 dark:via-stone-900 dark:to-stone-900 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-44 h-40 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700 shadow-md">
                <img
                  src={cropPhotos[0] || getCropImageUrl(selectedCrop?.id || 'tomato')}
                  alt="Listing crop"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                    {declaredGrade} (Farmer-declared)
                  </span>
                  <span className="text-xs text-stone-500">
                    Harvest: {harvestDate}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
                  {customCropName.trim() || selectedCrop?.name}
                </h3>
                <p className="text-xs text-stone-500 font-semibold">
                  Variety: <span className="text-stone-800 dark:text-stone-200">{variety}</span>
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/80">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">
                      Quantity:
                    </span>
                    <p className="text-sm font-black text-stone-900 dark:text-white">
                      {quantity} {unit}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/80">
                    <span className="text-[10px] text-stone-500 uppercase font-bold">
                      Target Price:
                    </span>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      ₹{expectedPrice} / {unit}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-stone-500 font-bold uppercase">📍 Farm Location:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">
                  {location.city || location.district}, {location.state}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-stone-500 font-bold uppercase">👤 Contact Person:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">
                  {farmerName} (+91 {farmerMobile})
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-sm text-stone-700 dark:text-stone-300"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublishListing}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-emerald-700/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <>
                  <span>🚀 {t.publishMyCrop}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUCCESS CONFIRMATION MODAL                                    */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {publishedSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-md w-full border-2 border-emerald-500 shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-4xl shadow-inner animate-bounce">
                🎉
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
                  Listing Published!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                  {t.listingPublishedSuccess}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Produce:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {customCropName.trim() || selectedCrop?.name} ({variety})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Quantity:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {quantity} {unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Declared Quality:</span>
                  <span className="font-bold text-emerald-600">
                    {declaredGrade}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Location:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {location.city || location.district}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/buyers')}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.viewInBuyerMarketplace}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPublishedSuccess(false);
                    setCurrentStep(1);
                  }}
                  className="w-full py-3 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  {t.anotherCrop}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
