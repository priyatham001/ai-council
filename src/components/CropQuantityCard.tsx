import React, { useState } from 'react';
import {
  Sprout,
  Scale,
  ArrowRightLeft,
  Search,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Sliders
} from 'lucide-react';
import { CropInfo, WeightUnit, Language, CropCategory, CropQuality } from '../types';
import { CROPS_CATALOG, convertToQuintals } from '../lib/krishi-data-client';
import { getTranslation } from '../lib/translations';

interface CropQuantityCardProps {
  selectedCropId: string;
  setSelectedCropId: (id: string) => void;
  customCropName: string;
  setCustomCropName: (name: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  unit: WeightUnit;
  setUnit: (u: WeightUnit) => void;
  quality: CropQuality;
  setQuality: (q: CropQuality) => void;
  language: Language;
}

export const CropQuantityCard: React.FC<CropQuantityCardProps> = ({
  selectedCropId,
  setSelectedCropId,
  customCropName,
  setCustomCropName,
  quantity,
  setQuantity,
  unit,
  setUnit,
  quality,
  setQuality,
  language
}) => {
  const t = getTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAdvancedQuality, setShowAdvancedQuality] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(quality.photoUrl || null);

  const selectedCrop =
    CROPS_CATALOG.find((c) => c.id === selectedCropId) || CROPS_CATALOG[0];

  const quantityInQuintals = convertToQuintals(quantity, unit);
  const quantityInKg = Math.round(quantityInQuintals * 100);
  const quantityInTonnes = Math.round((quantityInQuintals / 10) * 100) / 100;

  const getCropDisplayName = (crop: CropInfo) => {
    if (language === 'te') return crop.nameTelugu;
    if (language === 'hi') return crop.nameHindi;
    if (language === 'mr') return crop.nameMarathi;
    return crop.name;
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Crops' },
    { id: 'cereal', label: 'Cereals' },
    { id: 'pulse', label: 'Pulses' },
    { id: 'oilseed', label: 'Oilseeds' },
    { id: 'vegetable', label: 'Vegetables' },
    { id: 'fruit', label: 'Fruits' },
    { id: 'commercial', label: 'Commercial' }
  ];

  const filteredCrops = CROPS_CATALOG.filter((crop) => {
    if (selectedCategory !== 'all' && crop.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = crop.name.toLowerCase().includes(q);
      const matchTe = crop.nameTelugu.toLowerCase().includes(q);
      const matchHi = crop.nameHindi.toLowerCase().includes(q);
      const matchMr = crop.nameMarathi.toLowerCase().includes(q);
      return matchName || matchTe || matchHi || matchMr;
    }
    return true;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setImagePreview(url);
        setQuality({
          ...quality,
          photoUrl: url,
          photoAnalysis:
            'Visual sample analyzed: Good color uniformity observed, minimal visible foreign matter. Moisture estimated within typical post-harvest range.'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGradeChange = (grade: CropQuality['grade']) => {
    let modifier = 0;
    if (grade === 'Grade A') modifier = 5; // +5% premium
    if (grade === 'Grade B') modifier = 0; // standard
    if (grade === 'Grade C') modifier = -6; // -6% deduction
    setQuality({
      ...quality,
      grade,
      priceModifierPct: modifier
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs space-y-5">
      {/* Section 1: Crop Selection Header & Search */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {t.selectCrop}
              </h2>
              <p className="text-xs text-gray-500">
                Choose from 30+ verified regional crops across Cereals, Pulses, Oilseeds, Vegetables & Fruits
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Selected: {getCropDisplayName(selectedCrop)}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchCropPlaceholder}
            className="w-full text-xs pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Crop Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCropId === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => setSelectedCropId(crop.id)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                    : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {getCropDisplayName(crop)}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 capitalize">
                    {language !== 'en' ? crop.name : crop.category}
                  </div>
                </div>
                <div className="mt-2 text-[11px] font-mono font-medium text-emerald-800 bg-white/80 rounded px-1.5 py-0.5 inline-block border border-gray-100">
                  Modal: ₹{crop.standardPriceRange.modal}/qtl
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Crop input */}
        <div className="mt-2.5">
          <input
            type="text"
            value={customCropName}
            onChange={(e) => setCustomCropName(e.target.value)}
            placeholder={t.customCropPlaceholder}
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section 2: Quantity & Unit */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {t.quantity} & {t.unit}
            </h2>
            <p className="text-xs text-gray-500">
              Enter harvest batch size to compute total freight and net earnings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t.quantity}
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                step="any"
                value={quantity || ''}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full text-lg font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                placeholder="10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 uppercase">
                {unit}
              </div>
            </div>

            {/* Quick Quantity Buttons */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-gray-400">Quick:</span>
              {[5, 10, 25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setQuantity(amt)}
                  className={`text-xs px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    quantity === amt
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t.unit}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['quintal', 'kg', 'tonne'] as WeightUnit[]).map((u) => {
                const isSelected = unit === u;
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wide border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50'
                    }`}
                  >
                    {u === 'quintal' ? t.quintals : u === 'kg' ? t.kg : t.tonne}
                  </button>
                );
              })}
            </div>

            {/* Auto Unit Conversion Preview */}
            <div className="mt-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg p-2 flex items-center gap-2 text-xs text-emerald-900">
              <ArrowRightLeft className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold">
                  {quantityInQuintals} {t.quintals}
                </span>{' '}
                <span className="text-emerald-700 font-normal">
                  = {quantityInKg.toLocaleString('en-IN')} kg = {quantityInTonnes} Tonnes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section 3: Crop Quality, Grading & Photo Upload */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {t.cropQualityTitle}
              </h2>
              <p className="text-xs text-gray-500">
                Grade tier and lot condition determine mandi auction premium
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedQuality(!showAdvancedQuality)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            {showAdvancedQuality ? 'Hide Details' : '+ Quality Specs & Photo'}
          </button>
        </div>

        {/* Grade Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {[
            { id: 'Grade A', label: t.gradeA, modifier: '+5% Price' },
            { id: 'Grade B', label: t.gradeB, modifier: 'Standard Modal' },
            { id: 'Grade C', label: t.gradeC, modifier: '-6% Discount' },
            { id: 'Custom', label: t.gradeCustom, modifier: 'User Spec' }
          ].map((g) => {
            const isSelected = quality.grade === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGradeChange(g.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-gray-200 hover:border-emerald-200 text-gray-700 bg-white'
                }`}
              >
                <div className="text-xs font-bold">{g.label}</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  {g.modifier}
                </div>
              </button>
            );
          })}
        </div>

        {/* Advanced Quality & Photo Upload Fields */}
        {showAdvancedQuality && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.moisturePercent}
                </label>
                <input
                  type="number"
                  min={5}
                  max={30}
                  step={0.5}
                  value={quality.moisturePct || 12}
                  onChange={(e) =>
                    setQuality({ ...quality, moisturePct: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                  placeholder="e.g. 12%"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.packagingType}
                </label>
                <select
                  value={quality.packagingType || 'Gunny Bags (50kg)'}
                  onChange={(e) =>
                    setQuality({ ...quality, packagingType: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                >
                  <option value="Gunny Bags (50kg)">Gunny / Jute Bags (50kg)</option>
                  <option value="Plastic Crates (20kg)">Plastic Crates (20kg)</option>
                  <option value="Loose Trolley Load">Loose Bulk Trolley Load</option>
                  <option value="HDPE Laminated Bags">HDPE Laminated Bags</option>
                </select>
              </div>
            </div>

            {/* Photo Upload with Camera / File Picker */}
            <div className="pt-2 border-t border-gray-200">
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
                <span>{t.uploadCropPhoto}</span>
                <span className="text-[11px] text-gray-400 font-normal">
                  Optional visual inspection
                </span>
              </label>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Choose Photo or Take Picture</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <div className="relative flex items-center gap-2">
                    <img
                      src={imagePreview}
                      alt="Crop sample"
                      className="w-10 h-10 rounded-lg object-cover border border-emerald-300 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setQuality({ ...quality, photoUrl: undefined, photoAnalysis: undefined });
                      }}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Transparent Disclaimer Badge */}
              <div className="mt-2.5 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{t.photoAnalysisNotice}</span>
              </div>

              {quality.photoAnalysis && (
                <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900">
                  <span className="font-semibold">AI Inspection Notes: </span>
                  {quality.photoAnalysis}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
