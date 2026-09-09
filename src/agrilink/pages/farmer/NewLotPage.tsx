import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  Sparkles,
  Camera,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Upload,
  Info,
  Sliders,
  Check,
  MapPin,
  Globe
} from 'lucide-react';
import { lotService } from '../../services/lotService';
import { localStorageService } from '../../services/storageService';
import { PAN_INDIA_CROPS, ALL_INDIA_STATES } from '../../data/panIndiaData';
import { QualityMetrics, DigitalLot } from '../../types';
import { showToast } from '../../components/common/Toast';
import { QRCodeModal } from '../../components/common/QRCodeModal';

export const NewLotPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state || {};
  const persona = localStorageService.getPersona();

  const [state, setState] = useState(prefill.state || persona.state || 'Maharashtra');
  const [district, setDistrict] = useState(prefill.district || persona.district || 'Nashik');
  const [crop, setCrop] = useState(prefill.crop || persona.crop || 'Onion');
  const [variety, setVariety] = useState(prefill.variety || persona.variety || 'Nashik Red');
  const [quantity, setQuantity] = useState(prefill.quantityQuintals || persona.lotSizeQuintals || 50);
  const [harvestDate, setHarvestDate] = useState(prefill.harvestDate || '2026-09-12');
  const [farmerLocation, setFarmerLocation] = useState(prefill.location || `${persona.district} Farm Yard`);
  const [expectedPrice, setExpectedPrice] = useState(
    prefill.expectedPricePerQ || (crop.toLowerCase().includes('wheat') ? 2400 : crop.toLowerCase().includes('onion') ? 2800 : 2600)
  );
  const [description, setDescription] = useState(
    `Graded farm-gate harvest of ${crop} (${variety}) from ${district}, ${state}. Clean, verified moisture, raised bed farming.`
  );

  // Available districts for selected state
  const stateObj = ALL_INDIA_STATES.find((s: any) => s.name === state);
  const districts = stateObj?.districts || [district];

  const handleStateChange = (newState: string) => {
    setState(newState);
    const found = ALL_INDIA_STATES.find((s: any) => s.name === newState);
    if (found && found.districts.length > 0) {
      setDistrict(found.districts[0]);
      setFarmerLocation(`${found.districts[0]} Farm Gate`);
    }
  };

  const handleCropChange = (newCrop: string) => {
    setCrop(newCrop);
    const foundCrop = PAN_INDIA_CROPS.find(c => c.name === newCrop);
    if (foundCrop) {
      setExpectedPrice(foundCrop.benchmarkPrice || 2500);
      setVariety(foundCrop.majorVarieties?.[0] || 'Standard Hybrid');
    }
  };

  // Quality Grading State
  const [metrics, setMetrics] = useState<QualityMetrics>({
    size: 92,
    color: 95,
    freshness: 90,
    damage: 88,
    moisture: 94,
    overallScore: 91,
    grade: 'Grade A',
    aiAssessed: false
  });

  const [isAiGrading, setIsAiGrading] = useState(false);
  const [createdLot, setCreatedLot] = useState<DigitalLot | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Simulate AI Vision Grading
  const handleAiVisionGrading = () => {
    setIsAiGrading(true);
    setTimeout(() => {
      const assessed = lotService.simulateAiQualityGrading(crop);
      setMetrics(assessed);
      setIsAiGrading(false);
      showToast({
        type: 'success',
        title: 'AI Quality Assessment Complete',
        description: `Verified overall quality score: ${assessed.overallScore}/100 (${assessed.grade})`
      });
    }, 1000);
  };

  const handleMetricChange = (field: keyof QualityMetrics, val: number) => {
    const updated = { ...metrics, [field]: val };
    const avg = Math.round((updated.size + updated.color + updated.freshness + updated.damage + updated.moisture) / 5);
    updated.overallScore = avg;
    updated.grade = avg >= 88 ? 'Grade A' : avg >= 75 ? 'Grade B' : 'Grade C';
    setMetrics(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedStateObj = ALL_INDIA_STATES.find((s: any) => s.name === state);
    const stateCode = selectedStateObj?.code || state.substring(0, 2).toUpperCase();

    const lot = lotService.createLot({
      crop,
      variety,
      quantityQuintals: quantity,
      harvestDate,
      location: farmerLocation,
      district,
      state,
      stateCode,
      expectedPricePerQ: expectedPrice,
      qualityGrade: metrics.grade,
      qualityMetrics: metrics,
      description,
      farmerName: persona.name,
      farmerPhone: persona.phone
    });

    setCreatedLot(lot);
    setIsQrModalOpen(true);

    showToast({
      type: 'success',
      title: 'Digital Lot Created Successfully! 🎉',
      description: `Assigned ID: ${lot.lotNumber}. Published to 180+ verified buyers across India.`
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="badge-verified text-[11px]">Pan-India Traceability</span>
          <span className="text-[11px] font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            Farm-Gate Registration • Active: {persona.name}
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
          Create New Digital Crop Lot
        </h1>
        <p className="text-xs text-gray-700 mt-1">
          Register produce for any state in India, conduct verified quality grading, and generate a dynamic QR Lot Passport.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Crop Basics & Location */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-700" />
              1. Produce & Harvest Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* State Selection */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">State / UT</label>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
              >
                {ALL_INDIA_STATES.map((s: any) => (
                  <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            {/* District Selection */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
              >
                {districts.map((d: any) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Crop Commodity */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Crop Commodity (30+ Pan-India Crops)</label>
              <select
                value={crop}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
              >
                {PAN_INDIA_CROPS.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.hindiName}) — {c.category}</option>
                ))}
              </select>
            </div>

            {/* Variety */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Specific Variety / Hybrid</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900 text-xs"
              />
            </div>

            {/* Lot Quantity */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Lot Quantity (Quintals)</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
              />
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Harvest / Availability Date</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs font-medium"
              />
            </div>

            {/* Target Price */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Target Expected Price (₹ / quintal)</label>
              <input
                type="number"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-brand-800 text-xs"
              />
            </div>

            {/* Farm Location */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Village / Gate Pickup Point</label>
              <input
                type="text"
                value={farmerLocation}
                onChange={(e) => setFarmerLocation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs font-medium"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Description & Field Notes</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Quality Grading & AI-Assisted Assessment */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-700" />
                2. Quality Parameters & Certified Grading
              </h2>
              <p className="text-[11px] text-gray-700">
                Grade assigned via manual parameter inputs or one-click camera AI assessment
              </p>
            </div>

            <button
              type="button"
              onClick={handleAiVisionGrading}
              disabled={isAiGrading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-brand-800 rounded-xl text-xs font-bold border border-brand-300 transition-all shadow-2xs self-start sm:self-auto"
            >
              <Camera className="w-4 h-4 text-brand-700" />
              <span>{isAiGrading ? 'Analyzing Vision Model...' : 'Simulate AI-Assisted Grading'}</span>
            </button>
          </div>

          {/* Quality Score Highlight Box */}
          <div className="bg-gradient-to-r from-emerald-50 to-brand-50 p-5 rounded-2xl border border-brand-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-brand-900 font-bold uppercase tracking-wider">
                Overall Certified Grade:
              </div>
              <div className="text-3xl font-black text-brand-800">
                {metrics.grade}{' '}
                <span className="text-base font-bold text-gray-700">({metrics.overallScore} / 100)</span>
              </div>
              {metrics.aiAssessed && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" /> AI-Assisted Quality Estimate
                </span>
              )}
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-gray-700 block">Buyer Eligibility</span>
              <span className="text-sm font-bold text-emerald-700">100% Verified Processors</span>
            </div>
          </div>

          {/* 5 Quality Parameter Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Size */}
            <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between font-bold">
                <span className="text-gray-700">Uniform Size & Diameter:</span>
                <span className="text-brand-800 font-black">{metrics.size} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={metrics.size}
                onChange={(e) => handleMetricChange('size', Number(e.target.value))}
                className="w-full accent-brand-700 cursor-pointer"
              />
            </div>

            {/* Color */}
            <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between font-bold">
                <span className="text-gray-700">Color Consistency & Pigmentation:</span>
                <span className="text-brand-800 font-black">{metrics.color} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={metrics.color}
                onChange={(e) => handleMetricChange('color', Number(e.target.value))}
                className="w-full accent-brand-700 cursor-pointer"
              />
            </div>

            {/* Freshness */}
            <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between font-bold">
                <span className="text-gray-700">Harvest Freshness & Firmness:</span>
                <span className="text-brand-800 font-black">{metrics.freshness} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={metrics.freshness}
                onChange={(e) => handleMetricChange('freshness', Number(e.target.value))}
                className="w-full accent-brand-700 cursor-pointer"
              />
            </div>

            {/* Damage */}
            <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between font-bold">
                <span className="text-gray-700">Pest & Blemish Freedom:</span>
                <span className="text-brand-800 font-black">{metrics.damage} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={metrics.damage}
                onChange={(e) => handleMetricChange('damage', Number(e.target.value))}
                className="w-full accent-brand-700 cursor-pointer"
              />
            </div>

            {/* Moisture */}
            <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100 sm:col-span-2">
              <div className="flex justify-between font-bold">
                <span className="text-gray-700">Moisture Content Compliance:</span>
                <span className="text-brand-800 font-black">{metrics.moisture} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={metrics.moisture}
                onChange={(e) => handleMetricChange('moisture', Number(e.target.value))}
                className="w-full accent-brand-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            <b>Demo Notice:</b> Demo AI assessment — simulated computer vision grading engine for hackathon evaluation.
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/farmer/lots')}
            className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-7 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate Digital Lot & QR Passport</span>
          </button>
        </div>
      </form>

      {/* Modal on success */}
      {createdLot && (
        <QRCodeModal
          lot={createdLot}
          isOpen={isQrModalOpen}
          onClose={() => {
            setIsQrModalOpen(false);
            navigate('/farmer/offers');
          }}
        />
      )}
    </div>
  );
};
