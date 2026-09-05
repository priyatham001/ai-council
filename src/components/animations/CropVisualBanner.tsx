import React from 'react';
import { CropInfo, Language } from '../../types';

interface CropVisualBannerProps {
  crop: CropInfo;
  language: Language;
}

export const CropVisualBanner: React.FC<CropVisualBannerProps> = ({ crop, language }) => {
  // Crop specific agricultural contextual badges & visual details
  const getCropContext = () => {
    switch (crop.id) {
      case 'paddy':
        return {
          bgGradient: 'from-emerald-600 via-emerald-700 to-teal-800',
          accentColor: 'text-amber-300',
          emoji: '🌾',
          cropCategoryName: language === 'te' ? 'వరి క్షేత్రాలు' : language === 'hi' ? 'धान/चावल' : language === 'mr' ? 'भात/धान शेती' : 'Wetland Paddy Fields',
          mandiHighlights: language === 'te' ? 'భీమవరం, తణుకు, ఏలూరు ప్రధాన కొనుగోలు కేంద్రాలు' : language === 'hi' ? 'भीमावरम, तणुका, एलुरु प्रमुख क्रय केंद्र' : 'Bhimavaram & Coastal Andhra Paddy Belt',
          typicalMoisture: '14.0% Standard MSP Benchmark',
          shelfLife: 'High (Storable in Jute Bags / Gunny Sacks)'
        };
      case 'wheat':
        return {
          bgGradient: 'from-amber-600 via-amber-700 to-yellow-800',
          accentColor: 'text-yellow-200',
          emoji: '🌾',
          cropCategoryName: language === 'te' ? 'గోధుమ పంట' : language === 'hi' ? 'गेहूँ की फसल' : language === 'mr' ? 'गहू शेती' : 'Golden Wheat Plains',
          mandiHighlights: language === 'te' ? 'ధాన్యపు మండిలలో స్థిరమైన గిరాకీ' : language === 'hi' ? 'मंडी में दैनिक नीलामी व खरीद' : 'Standard Grain Mandi Auctions',
          typicalMoisture: '12.0% Safe Grain Storage',
          shelfLife: 'Very High (12+ Months in dry godown)'
        };
      case 'cotton':
        return {
          bgGradient: 'from-slate-700 via-zinc-800 to-neutral-900',
          accentColor: 'text-sky-300',
          emoji: '☁️',
          cropCategoryName: language === 'te' ? 'పత్తి జిన్నింగ్ పంట' : language === 'hi' ? 'कपास (सफेद सोना)' : language === 'mr' ? 'कापूस जिनिंग पट्टा' : 'Commercial Cotton Fiber',
          mandiHighlights: language === 'te' ? 'గుంటూరు, ఆదిలాబాద్, అకోలా జిన్నింగ్ మిల్లులు' : language === 'hi' ? 'गुंटूर, अकोला, यवतमाल जिनिंग मिलें' : 'Ginning Mills & Spot CCI Centers',
          typicalMoisture: '8.0% Max Moisture Limit',
          shelfLife: 'High (Must be protected from rain transit)'
        };
      case 'tomato':
        return {
          bgGradient: 'from-rose-600 via-red-700 to-rose-900',
          accentColor: 'text-rose-200',
          emoji: '🍅',
          cropCategoryName: language === 'te' ? 'టమాటా కూరగాయ తోటలు' : language === 'hi' ? 'टमाटर की खेती' : language === 'mr' ? 'टोमॅटो भाजीपाला' : 'Fresh Perishable Vegetable',
          mandiHighlights: language === 'te' ? 'క్రేట్లలో రవాణా అవసరం, త్వరిత విక్రయం ముఖ్యం' : language === 'hi' ? 'क्रैट्स में ढुलाई व शीघ्र नीलामी आवश्यक' : 'Crate Transport & Fast Morning Auction',
          typicalMoisture: 'High Water Content',
          shelfLife: 'Short (24-48 hours transit window)'
        };
      case 'chilli':
        return {
          bgGradient: 'from-red-600 via-amber-700 to-red-800',
          accentColor: 'text-amber-200',
          emoji: '🌶️',
          cropCategoryName: language === 'te' ? 'మిర్చి వాణిజ్య పంట' : language === 'hi' ? 'लाल मिर्च (तेजा / गुंटूर)' : language === 'mr' ? 'लाल मिरची' : 'Red Hot Dry Chilli',
          mandiHighlights: language === 'te' ? 'గుంటూరు మరియు ఖమ్మం ఆసియాలోనే అతిపెద్ద మార్కెట్లు' : language === 'hi' ? 'गुंटूर व खम्मम एशिया की सबसे बड़ी मिर्च मंडी' : 'Guntur & Khammam Asia Benchmark Mandis',
          typicalMoisture: '10.0% Cold Storage Safe',
          shelfLife: 'High in Cold Storage'
        };
      case 'onion':
        return {
          bgGradient: 'from-fuchsia-800 via-purple-900 to-indigo-950',
          accentColor: 'text-fuchsia-200',
          emoji: '🧅',
          cropCategoryName: language === 'te' ? 'ఉల్లిగడ్డ మార్కెట్' : language === 'hi' ? 'प्याज (नासिक बेल्ट)' : language === 'mr' ? 'कांदा (लासलगाव / पिंपळगाव)' : 'Onion Commercial Hub',
          mandiHighlights: language === 'te' ? 'లాసల్‌గావ్ & పింపల్‌గావ్ దేశంలోనే అతిపెద్ద మార్కెట్లు' : language === 'hi' ? 'लासलगांव व पिंपलगांव देश की सबसे बड़ी प्याज मंडी' : 'Lasalgaon & Pimpalgaon Global Benchmarks',
          typicalMoisture: 'Well-cured outer skin required',
          shelfLife: 'Medium-High (Ventilated transit)'
        };
      case 'turmeric':
        return {
          bgGradient: 'from-amber-500 via-amber-600 to-yellow-700',
          accentColor: 'text-yellow-100',
          emoji: '🟡',
          cropCategoryName: language === 'te' ? 'పసుపు సుగంధ ద్రవ్యం' : language === 'hi' ? 'हल्दी (सांगली / निजामाबाद)' : language === 'mr' ? 'हळद (सांगली बाजारपेठ)' : 'Golden Spice Turmeric',
          mandiHighlights: language === 'te' ? 'నిజామాబాద్, దుగ్గిరాల & సాంగ్లీ ప్రధాన మార్కెట్లు' : language === 'hi' ? 'निज़ामाबाद व सांगली मुख्य हल्दी मंडी' : 'Sangli & Nizamabad Finger Auctions',
          typicalMoisture: 'Dry Finger Curcumin Content',
          shelfLife: 'Very High (18+ Months)'
        };
      default:
        return {
          bgGradient: 'from-emerald-700 via-emerald-800 to-teal-900',
          accentColor: 'text-emerald-200',
          emoji: '🌱',
          cropCategoryName: language === 'te' ? 'వ్యవసాయ పంట' : language === 'hi' ? 'कृषि उत्पाद' : language === 'mr' ? 'कृषी पीक' : 'Agricultural Harvest',
          mandiHighlights: language === 'te' ? 'ప్రాంతీయ APMC మండిలలో రోజువారీ కొనుగోలు' : language === 'hi' ? 'क्षेत्रीय कृषि उपज मंडी खरीद' : 'Regional Regulated APMC Yard Trading',
          typicalMoisture: 'Standard harvest moisture',
          shelfLife: 'APMC Grading Standard'
        };
    }
  };

  const context = getCropContext();

  const getCropDisplayName = () => {
    if (language === 'te' && crop.nameTelugu) return crop.nameTelugu;
    if (language === 'hi' && crop.nameHindi) return crop.nameHindi;
    if (language === 'mr' && crop.nameMarathi) return crop.nameMarathi;
    return crop.name;
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${context.bgGradient} text-white p-4 shadow-sm my-3`}>
      {/* Background graphic motif */}
      <div className="absolute right-3 -bottom-4 text-7xl select-none opacity-20 pointer-events-none" aria-hidden="true">
        {context.emoji}
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner shrink-0">
            {context.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {getCropDisplayName()}
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20 ${context.accentColor} font-medium`}>
                {context.cropCategoryName}
              </span>
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              {context.mandiHighlights}
            </p>
          </div>
        </div>

        {/* Quick parameters */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-black/25 text-white/90 backdrop-blur-xs">
            💧 {context.typicalMoisture}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-black/25 text-white/90 backdrop-blur-xs">
            📦 {context.shelfLife}
          </span>
        </div>
      </div>
    </div>
  );
};
