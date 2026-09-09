import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Scale,
  DollarSign,
  Check,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { aiService, AISellAdvisorInput } from '../../services/aiService';
import { localStorageService } from '../../services/storageService';
import { AIRecommendation, FarmerPersona } from '../../types';
import { INDIAN_STATES, PAN_INDIA_CROPS, getDistrictsByState } from '../../data/panIndiaData';

export const AISellAdvisorPage: React.FC = () => {
  const navigate = useNavigate();
  const currentPersona = localStorageService.getPersona();

  // Dynamic Form State initialized from active demo persona
  const [selectedState, setSelectedState] = useState(currentPersona.state);
  const [selectedDistrict, setSelectedDistrict] = useState(currentPersona.district);
  const [formData, setFormData] = useState<AISellAdvisorInput>({
    state: currentPersona.state,
    district: currentPersona.district,
    crop: currentPersona.primaryCrop,
    quantityQuintals: currentPersona.primaryCrop === 'Onion' ? 80 : currentPersona.primaryCrop === 'Wheat' ? 100 : 40,
    qualityGrade: 'Grade A',
    harvestDate: '2026-09-10',
    farmerLocation: `${currentPersona.village}, ${currentPersona.district}`,
    storageAvailable: currentPersona.storageAvailable,
    urgencyToSell: 'can_wait_3_5_days'
  });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(() => {
    return aiService.generateSellRecommendation({
      ...formData,
      state: currentPersona.state,
      district: currentPersona.district
    });
  });

  // Re-sync when global persona or location changes
  useEffect(() => {
    const handlePersonaChange = () => {
      const p = localStorageService.getPersona();
      setSelectedState(p.state);
      setSelectedDistrict(p.district);
      const updated = {
        ...formData,
        state: p.state,
        district: p.district,
        crop: p.primaryCrop,
        quantityQuintals: p.primaryCrop === 'Onion' ? 80 : p.primaryCrop === 'Wheat' ? 100 : 40,
        farmerLocation: `${p.village}, ${p.district}`,
        storageAvailable: p.storageAvailable
      };
      setFormData(updated);
      setRecommendation(aiService.generateSellRecommendation(updated));
    };

    window.addEventListener('smartagrilink_persona_changed', handlePersonaChange);
    window.addEventListener('smartagrilink_location_changed', handlePersonaChange);
    return () => {
      window.removeEventListener('smartagrilink_persona_changed', handlePersonaChange);
      window.removeEventListener('smartagrilink_location_changed', handlePersonaChange);
    };
  }, []);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = getDistrictsByState(stateName);
    const firstDistrict = districts.length > 0 ? districts[0] : 'Central';
    setSelectedDistrict(firstDistrict);
    setFormData({
      ...formData,
      state: stateName,
      district: firstDistrict,
      farmerLocation: `${firstDistrict} Farm-Gate`
    });
  };

  const handleRunAdvisor = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const rec = aiService.generateSellRecommendation({
        ...formData,
        state: selectedState,
        district: selectedDistrict
      });
      setRecommendation(rec);
      setLoading(false);
    }, 450);
  };

  const handleProceedToLot = () => {
    navigate('/farmer/lots/new', {
      state: {
        crop: formData.crop,
        quantityQuintals: formData.quantityQuintals,
        qualityGrade: formData.qualityGrade,
        harvestDate: formData.harvestDate,
        location: formData.farmerLocation,
        district: selectedDistrict,
        state: selectedState,
        expectedPricePerQ: recommendation ? Math.round((recommendation.expectedPriceMin + recommendation.expectedPriceMax) / 2) : 2600
      }
    });
  };

  const availableDistricts = getDistrictsByState(selectedState);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-ai text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Pan-India Decision Engine
              </span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Active Region: {selectedDistrict}, {selectedState}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1.5">
              AI Sell Advisor
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">
              Where should you sell, when should you sell, and how much will you actually take home?
            </p>
          </div>

          <div className="text-xs text-gray-700 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 max-w-sm">
            <span className="font-bold text-emerald-950 block mb-0.5">Core Objective:</span>
            <span>Eliminate distress selling by ranking APMC mandis and institutional buyers by freight-adjusted net takeaway cash.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-sm">Harvest & Regional Parameters</h2>
            <p className="text-xs text-gray-500">Provide harvest specifications to generate localized net advice</p>
          </div>

          <form onSubmit={handleRunAdvisor} className="space-y-4 text-xs">
            {/* State & District Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">State / UT</label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st.code} value={st.name}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setFormData({ ...formData, district: e.target.value, farmerLocation: `${e.target.value} Belt` });
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {availableDistricts.map((d, idx) => (
                    <option key={idx} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Crop Selector */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Commodity / Crop</label>
              <select
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {PAN_INDIA_CROPS.map(c => (
                  <option key={c.id} value={c.name.split(' (')[0]}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Grade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Quantity (Quintals)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.quantityQuintals}
                  onChange={(e) => setFormData({ ...formData, quantityQuintals: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Produce Grade</label>
                <select
                  value={formData.qualityGrade}
                  onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                >
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Grade C">Grade C (Processing)</option>
                </select>
              </div>
            </div>

            {/* Harvest Date and Village Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Harvest Date</label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Village / Origin</label>
                <input
                  type="text"
                  value={formData.farmerLocation}
                  onChange={(e) => setFormData({ ...formData, farmerLocation: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs font-medium"
                />
              </div>
            </div>

            {/* Storage Availability */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Storage Availability</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, storageAvailable: true })}
                  className={`py-2 text-center rounded-xl font-bold border transition-colors ${
                    formData.storageAvailable
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-gray-50 border-gray-300 text-gray-700'
                  }`}
                >
                  Storage Available
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, storageAvailable: false })}
                  className={`py-2 text-center rounded-xl font-bold border transition-colors ${
                    !formData.storageAvailable
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-gray-50 border-gray-300 text-gray-700'
                  }`}
                >
                  No Storage
                </button>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Selling Urgency</label>
              <select
                value={formData.urgencyToSell}
                onChange={(e) => setFormData({ ...formData, urgencyToSell: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs font-medium"
              >
                <option value="immediate">Immediate Liquidity Needed (1–2 Days)</option>
                <option value="can_wait_3_5_days">Can Wait 3–5 Days for Higher Rate</option>
                <option value="flexible">Flexible (Hold for Optimal Trading Peak)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{loading ? 'Evaluating Market Arbitrage...' : 'Run Pan-India AI Sell Advisor'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: SMARTAGRILINK RECOMMENDATION Output (7 Cols) */}
        {recommendation && (
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border-2 border-emerald-500 p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  KrishiSetu Recommendation
                </span>

                {/* Visual Confidence Dial */}
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                  <span>Confidence:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-2 bg-emerald-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${recommendation.confidencePct}%` }} />
                    </div>
                    <span className="font-black">{recommendation.confidencePct}%</span>
                  </div>
                </div>
              </div>

              {/* 4 Core Recommendation Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recommended Market */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Recommended Market
                  </span>
                  <div className="text-xl font-black text-gray-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="truncate">{recommendation.recommendedMarket}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 block">
                    {recommendation.marketDistanceKm} km away from origin
                  </span>
                </div>

                {/* Expected Price */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Expected Quoted Price Band
                  </span>
                  <div className="text-xl font-black text-emerald-800">
                    ₹{recommendation.expectedPriceMin.toLocaleString('en-IN')} – ₹{recommendation.expectedPriceMax.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-gray-600">/q</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 block">
                    Buyer: {recommendation.recommendedBuyer}
                  </span>
                </div>

                {/* Estimated Net Realization */}
                <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-300 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">
                    Estimated Net Realization (Take-Home)
                  </span>
                  <div className="text-2xl font-black text-emerald-900">
                    ₹{recommendation.estimatedNetRealization.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 block">
                    ₹{recommendation.estimatedRealizationPerQ.toLocaleString('en-IN')}/q in hand after ₹{recommendation.estimatedTransportCost.toLocaleString('en-IN')} freight
                  </span>
                </div>

                {/* Recommended Selling Window */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Recommended Selling Window
                  </span>
                  <div className="text-xl font-black text-gray-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{recommendation.recommendedSellingWindow}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 block">
                    Optimal liquidity & demand timing
                  </span>
                </div>
              </div>

              {/* Side-by-Side Alternative Market Comparison */}
              {recommendation.alternativeMarket && (
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-amber-700" />
                      Comparative Net Realization Analysis:
                    </span>
                    <span className="text-xs bg-amber-200/60 px-2 py-0.5 rounded font-black text-amber-900">
                      Market Arbitrage
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-gray-500 block">Optimal Choice:</span>
                      <span className="font-bold text-emerald-800 block">{recommendation.recommendedMarket}</span>
                      <span className="text-sm font-black text-emerald-700">
                        ₹{recommendation.estimatedNetRealization.toLocaleString('en-IN')} net
                      </span>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-gray-500 block">Alternative Option:</span>
                      <span className="font-bold text-gray-800 block">{recommendation.alternativeMarket}</span>
                      <span className="text-sm font-bold text-gray-700">
                        ₹{recommendation.alternativeNetRealization?.toLocaleString('en-IN')} net
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-900 font-semibold pt-1">
                    ✓ <b>{recommendation.recommendedMarket}</b> provides <b>+₹{recommendation.potentialAdditionalIncome?.toLocaleString('en-IN')}</b> higher net realization after accounting for transportation and handling costs.
                  </p>
                </div>
              )}

              {/* Why This Recommendation Checklist */}
              <div className="space-y-3 pt-1">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Why This Recommendation?
                </h3>
                <div className="space-y-2 text-xs">
                  {recommendation.reasoning.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-gray-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={handleProceedToLot}
                  className="w-full sm:flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Create Digital Lot with these Settings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/farmer/offers')}
                  className="w-full sm:w-auto px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition-colors"
                >
                  View Matched Offers
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
                <b>Prototype Notice:</b> {recommendation.disclaimer}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
