import React, { useState } from 'react';
import {
  Search,
  Check,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  Info,
  Sparkles
} from 'lucide-react';
import { CropInfo, CropQuality, Language, WeightUnit } from '../../types';
import { CROPS_CATALOG, convertToQuintals } from '../../lib/krishi-data-client';

interface Page3CropDetailsProps {
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
  onNext: () => void;
  onBack: () => void;
}

export const Page3CropDetails: React.FC<Page3CropDetailsProps> = ({
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
  language,
  onNext,
  onBack
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCustomCrop, setIsCustomCrop] = useState<boolean>(false);
  const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: language === 'te' ? 'అన్నీ' : 'All', icon: '🌾' },
    { id: 'cereals', label: language === 'te' ? 'ధాన్యాలు' : 'Cereals', icon: '🌾' },
    { id: 'pulses', label: language === 'te' ? 'పప్పుధాన్యాలు' : 'Pulses', icon: '🥜' },
    { id: 'vegetables', label: language === 'te' ? 'కూరగాయలు' : 'Vegetables', icon: '🥬' },
    { id: 'fruits', label: language === 'te' ? 'పండ్లు' : 'Fruits', icon: '🍎' },
    { id: 'commercial', label: language === 'te' ? 'వాణిజ్య పంటలు' : 'Commercial', icon: '🌱' }
  ];

  // Filter crops
  const filteredCrops = CROPS_CATALOG.filter((crop) => {
    const matchesCat = activeCategory === 'all' || crop.category === activeCategory;
    const nameMatch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (crop.nameTelugu && crop.nameTelugu.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (crop.nameHindi && crop.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && nameMatch;
  });

  const selectedCrop = CROPS_CATALOG.find((c) => c.id === selectedCropId) || CROPS_CATALOG[0];

  // Normalized Quintals
  const normalizedQuintals = convertToQuintals(quantity, unit);

  // Helper for crop emojis
  const getCropIcon = (cropId: string, category: string) => {
    switch (cropId) {
      case 'paddy': return '🌾';
      case 'wheat': return '🌾';
      case 'tomato': return '🍅';
      case 'cotton': return '☁️';
      case 'chilli': return '🌶️';
      case 'onion': return '🧅';
      case 'soybean': return '🌱';
      case 'maize': return '🌽';
      case 'potato': return '🥔';
      case 'banana': return '🍌';
      case 'mango': return '🥭';
      case 'turmeric': return '🟡';
      default:
        if (category === 'cereals') return '🌾';
        if (category === 'pulses') return '🥜';
        if (category === 'vegetables') return '🥬';
        if (category === 'fruits') return '🍎';
        return '🌱';
    }
  };

  // Subtle adaptive crop visual styling
  const getCropAesthetic = () => {
    switch (selectedCropId) {
      case 'paddy':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          gradient: 'from-emerald-600 to-teal-700',
          emoji: '🌾',
          note: language === 'te' ? 'వరి పంట — భీమవరం & కోస్తా ఆంధ్ర ప్రధాన కొనుగోలు' : 'Wetland Paddy — standard APMC moisture benchmark 14%'
        };
      case 'wheat':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          gradient: 'from-amber-600 to-yellow-700',
          emoji: '🌾',
          note: language === 'te' ? 'గోధుమ — ధాన్యపు మార్కెట్లలో అధిక డిమాండ్' : 'Golden Wheat — dry grain storage benchmark'
        };
      case 'tomato':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          gradient: 'from-rose-600 to-red-700',
          emoji: '🍅',
          note: language === 'te' ? 'టమాటా — క్రేట్ల రవాణా & త్వరిత వేలం' : 'Fresh Vegetable — fast auction & crate transport'
        };
      case 'cotton':
        return {
          bg: 'bg-slate-100 border-slate-300 text-slate-900',
          gradient: 'from-slate-700 to-zinc-800',
          emoji: '☁️',
          note: language === 'te' ? 'పత్తి — గుంటూరు & ఆదిలాబాద్ జిన్నింగ్ మిల్లులు' : 'Commercial Cotton — Ginning mill standards'
        };
      case 'chilli':
        return {
          bg: 'bg-red-50 border-red-200 text-red-900',
          gradient: 'from-red-600 to-rose-700',
          emoji: '🌶️',
          note: language === 'te' ? 'మిర్చి — గుంటూరు & ఖమ్మం మార్కెట్లలో రోజువారీ వేలం' : 'Red Chilli — Guntur Asia benchmark mandi'
        };
      case 'onion':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-900',
          gradient: 'from-purple-700 to-indigo-800',
          emoji: '🧅',
          note: language === 'te' ? 'ఉల్లిగడ్డ — లాసల్‌గావ్ & పింపల్‌గావ్ ప్రధాన కేంద్రాలు' : 'Onion — Lasalgaon global benchmark hub'
        };
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          gradient: 'from-emerald-600 to-teal-700',
          emoji: '🌱',
          note: language === 'te' ? 'వ్యవసాయ ఉత్పత్తులు — ప్రాంతీయ మార్కెట్ వేలం' : 'Agricultural Commodity — standard APMC yard trading'
        };
    }
  };

  const aesthetic = getCropAesthetic();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoUploaded(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 p-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {language === 'te'
              ? 'ప్రాంతం మార్పు'
              : language === 'hi'
              ? 'स्थान बदलें'
              : language === 'mr'
              ? 'स्थान बदला'
              : 'Back'}
          </span>
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {language === 'te'
            ? 'దశ 2 / 4 • పంట వివరాలు'
            : language === 'hi'
            ? 'चरण 2 / 4 • फसल की जानकारी'
            : language === 'mr'
            ? 'टप्पा 2 / 4 • पीक माहिती'
            : 'Step 2 of 4 • Crop Details'}
        </span>
      </div>

      {/* Page Title */}
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {language === 'te'
            ? 'మీరు ఏ పంటను విక్రయించాలనుకుంటున్నారు?'
            : language === 'hi'
            ? 'आप कौन सी फसल बेचना चाहते हैं?'
            : language === 'mr'
            ? 'तुम्हाला कोणते पीक विकायचे आहे?'
            : 'What are you selling?'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'te'
            ? 'పంటను ఎంచుకోండి లేదా శోధించండి'
            : language === 'hi'
            ? 'फसल चुनें या खोजें'
            : language === 'mr'
            ? 'पीक निवडा किंवा शोधा'
            : 'Choose your crop or search by name'}
        </p>
      </div>

      {/* Adaptive Subtle Crop Visual Environment (Responds gracefully to selection) */}
      <div className={`p-3.5 rounded-2xl border mb-5 transition-all flex items-center justify-between ${aesthetic.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${aesthetic.gradient} text-white flex items-center justify-center text-2xl shadow-sm shrink-0`}>
            {aesthetic.emoji}
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              {language === 'te' ? 'ఎంచుకున్న పంట' : 'Selected Crop'}
            </span>
            <span className="text-base font-bold text-slate-900 block leading-tight">
              {isCustomCrop
                ? customCropName || 'Custom Harvest Crop'
                : (language === 'te' && selectedCrop.nameTelugu)
                ? selectedCrop.nameTelugu
                : (language === 'hi' && selectedCrop.nameHindi)
                ? selectedCrop.nameHindi
                : selectedCrop.name}
            </span>
            <span className="text-xs text-slate-600 mt-0.5 block">
              {aesthetic.note}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Modal APMC Rate
          </span>
          <span className="text-sm font-bold text-emerald-800">
            ₹{selectedCrop.standardPriceRange.modal}
            <span className="text-[11px] font-normal text-slate-500"> / Qtl</span>
          </span>
        </div>
      </div>

      {/* 1. Crop Selection Section */}
      <div className="mb-6">
        {/* Search Crop Input */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'te'
                ? 'పంట పేరు శోధించండి (ఉదా: వరి, టమాటా, మిర్చి)...'
                : language === 'hi'
                ? 'फसल खोजें (जैसे: धान, गेहूं, टमाटर)...'
                : 'Search crop (e.g. Paddy, Wheat, Tomato)...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:outline-hidden text-slate-900 shadow-2xs"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCropId === crop.id && !isCustomCrop;
            const displayName =
              (language === 'te' && crop.nameTelugu)
                ? crop.nameTelugu
                : (language === 'hi' && crop.nameHindi)
                ? crop.nameHindi
                : crop.name;

            return (
              <button
                key={crop.id}
                onClick={() => {
                  setSelectedCropId(crop.id);
                  setIsCustomCrop(false);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative active:scale-[0.98] ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{getCropIcon(crop.id, crop.category)}</span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                </div>
                <span className="text-xs font-bold block mt-1 leading-tight truncate">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  ₹{crop.standardPriceRange.modal}/Qtl
                </span>
              </button>
            );
          })}

          {/* "Other Crop" Choice Card */}
          <button
            onClick={() => setIsCustomCrop(true)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative active:scale-[0.98] ${
              isCustomCrop
                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🌱</span>
              {isCustomCrop && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
            </div>
            <span className="text-xs font-bold block mt-1 leading-tight">
              {language === 'te' ? 'ఇతర పంట' : 'Other Crop'}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Custom Name
            </span>
          </button>
        </div>

        {/* Custom crop input if Other Crop chosen */}
        {isCustomCrop && (
          <div className="mt-3">
            <input
              type="text"
              value={customCropName}
              onChange={(e) => setCustomCropName(e.target.value)}
              placeholder="Enter crop name (e.g. Maize, Groundnut, Ginger)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/40 text-sm focus:border-emerald-600 focus:outline-hidden"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* 2. Quantity Section */}
      <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <label className="block text-sm font-bold text-slate-900 mb-2">
          {language === 'te'
            ? 'మీరు ఎంత పరిమాణాన్ని విక్రయించాలనుకుంటున్నారు?'
            : language === 'hi'
            ? 'आप कितनी मात्रा बेचना चाहते हैं?'
            : language === 'mr'
            ? 'तुम्हाला किती माल विकायचा आहे?'
            : 'How much do you want to sell?'}
        </label>

        <div className="flex items-center gap-3">
          {/* Large Quantity Input */}
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max="5000"
              value={quantity || ''}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-4 py-3 text-2xl font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Unit Dropdown */}
          <div className="w-36">
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as WeightUnit)}
              className="w-full px-3 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="quintal">
                {language === 'te' ? 'క్వింటాళ్ళు (Qtl)' : 'quintal'}
              </option>
              <option value="kg">
                {language === 'te' ? 'కిలోలు (kg)' : 'kg'}
              </option>
              <option value="tonne">
                {language === 'te' ? 'టన్నులు (Tonne)' : 'tonne'}
              </option>
            </select>
          </div>
        </div>

        {/* Normalized Quantity Display */}
        <div className="mt-2 text-xs text-slate-600 font-medium flex items-center justify-between">
          <span>Standardized auction lot:</span>
          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            {normalizedQuintals} quintals ({Math.round(normalizedQuintals * 100).toLocaleString('en-IN')} kg)
          </span>
        </div>
      </div>

      {/* 3. Quality Section */}
      <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <label className="block text-sm font-bold text-slate-900 mb-2">
          {language === 'te'
            ? 'పంట నాణ్యత (గ్రేడ్) ఎంత?'
            : language === 'hi'
            ? 'फसल की गुणवत्ता (ग्रेड) क्या है?'
            : language === 'mr'
            ? 'मालाचा दर्जा (ग्रेड) कोणता आहे?'
            : 'What is the quality?'}
        </label>

        {/* Grade Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { id: 'Grade A', label: 'Grade A', sub: '+5% Premium' },
            { id: 'Grade B', label: 'Grade B', sub: 'Standard FAQ' },
            { id: 'Grade C', label: 'Grade C', sub: '-5% Fair' },
            { id: 'Custom', label: 'Custom', sub: 'Custom Lot' }
          ].map((gr) => {
            const isSelected = quality.grade === gr.id;
            return (
              <button
                key={gr.id}
                onClick={() => {
                  let mod = 0;
                  if (gr.id === 'Grade A') mod = 5;
                  else if (gr.id === 'Grade C') mod = -5;
                  setQuality({ ...quality, grade: gr.id, priceModifierPct: mod });
                }}
                className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <span className="block text-xs font-bold leading-tight">{gr.label}</span>
                <span className="block text-[10px] opacity-80 mt-0.5">{gr.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Optional Photo Upload */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 text-slate-700 cursor-pointer transition-colors font-medium">
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>{photoUploaded ? '✓ Photo Attached' : 'Upload Crop Photo (Optional)'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </label>

          <span className="text-[11px] text-slate-500">
            Standard APMC Fair Average Quality (FAQ)
          </span>
        </div>
      </div>

      {/* Next Button */}
      <div>
        <button
          onClick={onNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-md shadow-emerald-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>
            {language === 'te'
              ? 'మార్కెట్ విశ్లేషణకు వెళ్లండి'
              : language === 'hi'
              ? 'मंडी विश्लेषण देखें'
              : language === 'mr'
              ? 'बाजार विश्लेषण पहा'
              : 'Continue to Market Comparison'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
