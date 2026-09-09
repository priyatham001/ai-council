import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  Building2,
  MapPin,
  CheckCircle,
  ArrowRight,
  Filter,
  CheckCircle2,
  Search,
  Sparkles,
  Phone,
  Mail,
  Scale,
  Globe
} from 'lucide-react';
import { buyerService, BuyerMatchBreakdown } from '../../services/buyerService';
import { lotService } from '../../services/lotService';
import { localStorageService } from '../../services/storageService';
import { ALL_INDIA_STATES, PAN_INDIA_CROPS } from '../../data/panIndiaData';
import { DigitalLot, FarmerPersona } from '../../types';
import { showToast } from '../../components/common/Toast';

export const VerifiedBuyersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [persona, setPersona] = useState<FarmerPersona>(localStorageService.getPersona());

  useEffect(() => {
    const handlePersona = () => setPersona(localStorageService.getPersona());
    window.addEventListener('smartagrilink_persona_changed', handlePersona);
    return () => window.removeEventListener('smartagrilink_persona_changed', handlePersona);
  }, []);

  // Use active farmer persona lot for algorithmic compatibility matching
  const allLots = lotService.getAllLots();
  const farmerCrop = (persona.crop || persona.primaryCrop || '').toLowerCase();
  const activeLot: DigitalLot = allLots.find(l => 
    l.crop.toLowerCase().includes(farmerCrop) || 
    farmerCrop.includes(l.crop.toLowerCase())
  ) || allLots[0];

  const matchedList = buyerService.getMatchedBuyersForLot(activeLot);

  const filtered = matchedList.filter(item => {
    const b = item.buyer;
    const matchesSearch = !searchTerm || 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'All' || b.state.toLowerCase() === selectedState.toLowerCase();
    const matchesCrop = selectedCrop === 'All' || b.requiredCrops.some(c => c.toLowerCase().includes(selectedCrop.toLowerCase()));
    const matchesType = selectedType === 'All' || b.businessType === selectedType;
    return matchesSearch && matchesState && matchesCrop && matchesType;
  });

  const topMatch = filtered[0];

  const handleContactBuyer = (buyerName: string) => {
    showToast({
      type: 'info',
      title: `Connecting with ${buyerName}`,
      description: 'Institutional procurement desk notified. An offer negotiation draft has been created.'
    });
    navigate('/farmer/offers');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-verified text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% KYC & GST Validated
            </span>
            <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              Pan-India Institutional Network
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Verified Institutional Buyers
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Algorithmic compatibility matching for <b className="text-brand-800">{persona.name}</b> ({persona.district}, {persona.state}) • Matching against active <b>{activeLot.crop}</b> lot ({activeLot.quantityQuintals}q • {activeLot.qualityGrade})
          </p>
        </div>

        {topMatch && (
          <div className="bg-gradient-to-br from-emerald-50 to-brand-50 p-3.5 rounded-xl border border-emerald-200 text-xs self-start md:self-auto">
            <span className="text-emerald-800 font-semibold block text-[10px] uppercase tracking-wider">Top National Match:</span>
            <span className="font-black text-brand-900 text-sm">{topMatch.buyer.name} ({topMatch.overallMatchScore}% Fit)</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by buyer company or hub..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All States & UTs</option>
              {ALL_INDIA_STATES.map((s: any) => (
                <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          {/* Commodity Filter */}
          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Commodities</option>
              {PAN_INDIA_CROPS.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.hindiName})</option>
              ))}
            </select>
          </div>

          {/* Business Model Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Business Models</option>
              <option value="Food Processing">Food Processing & Puree</option>
              <option value="Retail Chain">Organized Retail Chain</option>
              <option value="Wholesale Trader">Wholesale APMC Trader</option>
              <option value="Exporter">Spice & Commodity Exporter</option>
              <option value="Agri Aggregator">Cold Storage Aggregator</option>
            </select>
          </div>
        </div>

        {/* Quick State Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-gray-500 font-medium">Quick State Select:</span>
          {['Maharashtra', 'Punjab', 'Karnataka', 'Gujarat', 'Madhya Pradesh', 'Andhra Pradesh'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedState(selectedState === st ? 'All' : st)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                selectedState === st
                  ? 'bg-brand-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
          {(selectedState !== 'All' || selectedCrop !== 'All' || searchTerm || selectedType !== 'All') && (
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCrop('All');
                setSelectedType('All');
                setSearchTerm('');
              }}
              className="text-rose-600 font-bold hover:underline ml-2"
            >
              Reset Filters
            </button>
          )}
          <span className="ml-auto text-gray-500 font-mono">
            {filtered.length} Buyers Matched
          </span>
        </div>
      </div>

      {/* Buyers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-200 space-y-3">
            <Building2 className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold text-gray-900 text-base">No Verified Buyers Match Current Filter</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Try selecting "All States" or clearing the commodity filter to explore other institutional buyers.
            </p>
          </div>
        ) : (
          filtered.map(({ buyer, overallMatchScore, cropMatch, qualityMatch, quantityMatch, distanceScore, paymentReliability, isRecommended }) => (
            <div
              key={buyer.id}
              className={`bg-white rounded-2xl border transition-all p-6 shadow-2xs space-y-5 flex flex-col justify-between ${
                isRecommended
                  ? 'border-brand-500 ring-2 ring-brand-400/20 shadow-md'
                  : 'border-gray-200 hover:border-brand-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header with Match Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-base">{buyer.name}</h3>
                      {isRecommended && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" /> Best Match
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-700 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{buyer.location}, <b className="text-gray-900">{buyer.state}</b> ({buyer.distanceKm} km away)</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-brand-700">
                      {overallMatchScore}%
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-700 font-bold block">
                      Match Score
                    </span>
                  </div>
                </div>

                {/* Match Score Breakdown */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2">
                  <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Algorithmic Compatibility Breakdown:
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                      <span className="text-[10px] text-gray-700 block">Crop</span>
                      <span className="font-bold text-emerald-700">{cropMatch}%</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                      <span className="text-[10px] text-gray-700 block">Quality</span>
                      <span className="font-bold text-emerald-700">{qualityMatch}%</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                      <span className="text-[10px] text-gray-700 block">Volume</span>
                      <span className="font-bold text-emerald-700">{quantityMatch}%</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                      <span className="text-[10px] text-gray-700 block">Distance</span>
                      <span className="font-bold text-emerald-700">{distanceScore}%</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                      <span className="text-[10px] text-gray-700 block">Pay Record</span>
                      <span className="font-bold text-emerald-700">{paymentReliability}%</span>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {buyer.kycVerified && (
                    <span className="badge-kyc">
                      <CheckCircle className="w-3.5 h-3.5" /> KYC Audited
                    </span>
                  )}
                  {buyer.gstVerified && (
                    <span className="badge-verified">
                      <CheckCircle className="w-3.5 h-3.5" /> GSTIN Validated
                    </span>
                  )}
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                    {buyer.paymentReliabilityPct}% On-Time Payment History
                  </span>
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    {buyer.rating} ({buyer.reviewCount} deals)
                  </span>
                </div>

                {/* Procurement Specifications */}
                <div className="space-y-1.5 text-xs text-gray-700 pt-1">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Procurement Focus:</span>
                    <span className="font-bold text-gray-900">{buyer.requiredCrops.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Order Quantity Range:</span>
                    <span className="font-semibold text-gray-900">{buyer.requiredQuantityMin} – {buyer.requiredQuantityMax} quintals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Required Quality Grade:</span>
                    <span className="font-bold text-emerald-700">{buyer.qualityRequirement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Expected Pricing Band:</span>
                    <span className="font-black text-brand-800">₹{buyer.expectedPriceMin.toLocaleString('en-IN')} – ₹{buyer.expectedPriceMax.toLocaleString('en-IN')} / q</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Payment Settlement:</span>
                    <span className="font-bold text-gray-900">Within {buyer.paymentWindowHours} hours via Direct Escrow</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleContactBuyer(buyer.name)}
                  className="flex-1 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>Create Offer to Buyer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleContactBuyer(buyer.name)}
                  className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
