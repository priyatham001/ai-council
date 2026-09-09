import React, { useState } from 'react';
import {
  CropCategory,
  CropItem,
  CropSelectionState,
  Language,
  WeightUnit,
} from '../../types/krishi';
import { CROP_DATABASE, filterCrops } from '../../data/cropsData';
import { TRANSLATIONS } from '../../utils/i18n';
import { Search, CheckCircle2, ArrowRight, Sparkles, Scale, RefreshCw } from 'lucide-react';

interface CropSelectionSubStepProps {
  language: Language;
  cropState: CropSelectionState;
  onSelectCrop: (crop: CropItem | null, customName?: string) => void;
  onUpdateQuantity: (value: number | '', unit: WeightUnit) => void;
  onContinue: () => void;
}

const CATEGORIES: { id: CropCategory; label: string }[] = [
  { id: 'all', label: 'All Crops' },
  { id: 'cereals', label: 'Cereals & Grains' },
  { id: 'pulses', label: 'Pulses / Dal' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'commercial', label: 'Cash Crops' },
];

export const CropSelectionSubStep: React.FC<CropSelectionSubStepProps> = ({
  language,
  cropState,
  onSelectCrop,
  onUpdateQuantity,
  onContinue,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<CropCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(
    cropState.selectedCrop?.id === 'other_custom' || Boolean(cropState.customCropName)
  );
  const [customInput, setCustomInput] = useState(cropState.customCropName || '');

  const filteredCrops = filterCrops(CROP_DATABASE, selectedCategory, searchQuery);

  const isCropSelected =
    (cropState.selectedCrop && cropState.selectedCrop.id !== 'other_custom') ||
    (isOtherSelected && customInput.trim().length > 0);

  const isQuantityValid =
    typeof cropState.quantityValue === 'number' && cropState.quantityValue > 0;

  const canContinue = isCropSelected && isQuantityValid;

  const handleCropCardClick = (crop: CropItem) => {
    setIsOtherSelected(false);
    onSelectCrop(crop);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setIsOtherSelected(true);
    onSelectCrop(
      {
        id: 'other_custom',
        name: customInput.trim(),
        localNames: {
          en: customInput.trim(),
          hi: customInput.trim(),
          mr: customInput.trim(),
          te: customInput.trim(),
        },
        category: 'other',
        icon: '🌾',
        defaultUnit: 'quintal',
        modalPrice: 2200,
        minPrice: 1900,
        maxPrice: 2600,
        qualityProfile: {
          visualTraits: ['Natural color', 'Grain fullness'],
          defectIndicators: ['Discoloration', 'Visible damage'],
          physicalLimits: ['Moisture content cannot be measured from photo'],
        },
      },
      customInput.trim()
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Question */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700/60 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Step 1 of 3 • Basic Details
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            What crop are you selling?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base mt-2">
            Select your harvest crop from the list or search below. This helps KrishiSetu calculate real-time mandi prices and compare net returns.
          </p>
        </div>
      </div>

      {/* Selected Crop Banner if already chosen */}
      {cropState.selectedCrop && (
        <div
          id="selected-crop-summary-banner"
          className="bg-emerald-50 border-2 border-emerald-500/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
              ✓
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                Selected Crop
              </div>
              <div className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
                {cropState.selectedCrop.name}
                {cropState.selectedCrop.localNames?.[language] && (
                  <span className="text-emerald-700 font-semibold text-base">
                    ({cropState.selectedCrop.localNames[language]})
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-600 mt-0.5">
                Benchmark Modal Rate: <strong className="text-stone-800">₹{cropState.selectedCrop.modalPrice || 2350} / quintal</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              // Smooth scroll to crop list
              const el = document.getElementById('crop-selection-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100/60 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
            Change Crop
          </button>
        </div>
      )}

      {/* Search & Category Filter */}
      <div id="crop-selection-grid" className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              id="crop-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crop (e.g. Wheat, Gehun, Paddy, Onion, Cotton)..."
              className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {filteredCrops.map((crop) => {
            const isSelected = cropState.selectedCrop?.id === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                id={`crop-card-${crop.id}`}
                onClick={() => handleCropCardClick(crop)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-emerald-400 hover:bg-stone-50/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
                      {crop.name}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  {crop.localNames?.[language] && (
                    <div className="text-xs text-stone-500 font-medium mt-0.5">
                      {crop.localNames[language]}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">Modal:</span>
                  <span className="font-bold text-emerald-800">
                    ₹{crop.modalPrice}/q
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Other / Custom Crop Option */}
        <div className="pt-2 border-t border-stone-200/60">
          <div className="text-xs font-bold text-stone-700 mb-2">
            Don't see your crop listed above?
          </div>
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter crop name (e.g. Cardamom, Jeera, Papaya)..."
              className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            >
              Set Custom Crop
            </button>
          </form>
        </div>
      </div>

      {/* Lot Quantity Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900">
              Estimated Lot Quantity
            </h3>
            <p className="text-xs text-stone-500">
              How much quantity are you preparing to transport or sell?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Quantity Value
            </label>
            <input
              type="number"
              min="0.1"
              step="any"
              id="lot-quantity-input"
              value={cropState.quantityValue}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                onUpdateQuantity(val, cropState.quantityUnit);
              }}
              placeholder="e.g. 10"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-base font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Weight Unit
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
              {(['quintal', 'tonne', 'kg'] as WeightUnit[]).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => onUpdateQuantity(cropState.quantityValue, unit)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    cropState.quantityUnit === unit
                      ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isQuantityValid && (
          <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/80 inline-flex items-center gap-2">
            <span>Standardized Weight:</span>
            <strong className="text-stone-900 font-bold">
              {cropState.normalizedKilograms.toLocaleString()} kg
            </strong>
            <span className="text-stone-400">•</span>
            <span>
              ({(cropState.normalizedKilograms / 100).toFixed(1)} Quintals)
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <div className="text-xs text-stone-500">
          {!isCropSelected ? (
            <span className="text-amber-700 font-medium">
              ⚠️ Please select your crop above to continue.
            </span>
          ) : !isQuantityValid ? (
            <span className="text-amber-700 font-medium">
              ⚠️ Please enter your estimated quantity to continue.
            </span>
          ) : (
            <span className="text-emerald-700 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Ready to proceed to Quality Grade & Photo
            </span>
          )}
        </div>

        <button
          type="button"
          id="btn-continue-to-step2"
          disabled={!canContinue}
          onClick={onContinue}
          className={`px-7 py-3.5 rounded-2xl font-black text-sm inline-flex items-center gap-2 transition-all cursor-pointer shadow-md ${
            canContinue
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-98'
              : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
          }`}
        >
          Continue to Quality & Photo
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
