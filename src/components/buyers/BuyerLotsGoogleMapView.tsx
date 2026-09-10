import React, { useState, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { DigitalLot } from '../../agrilink/types';
import {
  MapPin,
  Sparkles,
  Phone,
  ShieldCheck,
  Package,
  Layers,
  ExternalLink,
  DollarSign,
  Maximize2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  localizeCropName,
  localizeGrade,
  localizeState,
  localizeUnit,
} from '../../utils/cropLocalization';

interface BuyerLotsGoogleMapViewProps {
  lots: DigitalLot[];
  selectedLot: DigitalLot | null;
  onSelectLot: (lot: DigitalLot) => void;
  onOpenDetails: (lot: DigitalLot) => void;
}

// Map helper to center on selected lot
const MapCenterController: React.FC<{ targetCoords: { lat: number; lng: number } | null }> = ({
  targetCoords,
}) => {
  const map = useMap();
  React.useEffect(() => {
    if (map && targetCoords) {
      map.panTo(targetCoords);
      map.setZoom(10);
    }
  }, [map, targetCoords]);
  return null;
};

export const BuyerLotsGoogleMapView: React.FC<BuyerLotsGoogleMapViewProps> = ({
  lots,
  selectedLot,
  onSelectLot,
  onOpenDetails,
}) => {
  const { language, t } = useLanguage();
  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    (typeof window !== 'undefined' ? (window as any).__GOOGLE_MAPS_API_KEY__ : '') ||
    '';

  const [activeInfoWindowLot, setActiveInfoWindowLot] = useState<DigitalLot | null>(null);

  // Derive center
  const defaultCenter = useMemo(() => {
    if (selectedLot?.latitude && selectedLot?.longitude) {
      return { lat: selectedLot.latitude, lng: selectedLot.longitude };
    }
    if (lots.length > 0 && lots[0].latitude && lots[0].longitude) {
      return { lat: lots[0].latitude, lng: lots[0].longitude };
    }
    // Pan-India center (approx Nagpur / Central India)
    return { lat: 21.1458, lng: 79.0882 };
  }, [selectedLot, lots]);

  const getCropEmoji = (cropName: string) => {
    const c = cropName.toLowerCase();
    if (c.includes('paddy') || c.includes('rice')) return '🌾';
    if (c.includes('onion')) return '🧅';
    if (c.includes('tomato')) return '🍅';
    if (c.includes('wheat')) return '🌾';
    if (c.includes('cotton')) return '🌱';
    if (c.includes('soybean') || c.includes('soya')) return '🫘';
    if (c.includes('maize') || c.includes('corn')) return '🌽';
    if (c.includes('chilli')) return '🌶️';
    if (c.includes('potato')) return '🥔';
    return '🌱';
  };

  const getGradeBg = (grade: string) => {
    if (grade.includes('A')) return 'bg-emerald-600 text-white border-emerald-300';
    if (grade.includes('B')) return 'bg-amber-600 text-white border-amber-300';
    return 'bg-stone-700 text-white border-stone-400';
  };

  // Fallback interactive layout if API key is not configured
  if (!apiKey) {
    return (
      <div className="w-full h-[520px] rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white p-6 relative overflow-hidden border border-emerald-800/80 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-black text-white">
              {t('buyer.panIndiaMapVisualizer') || 'Pan-India Agricultural Map Visualizer'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-900/80 px-2.5 py-1 rounded-full border border-emerald-700">
            {lots.length} {t('buyer.geocodedLots') || 'Geocoded Lots'}
          </span>
        </div>

        {/* Spatial Grid of Lots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 z-10 overflow-y-auto max-h-[380px] pr-2">
          {lots.map((lot) => (
            <div
              key={lot.id}
              onClick={() => {
                onSelectLot(lot);
                onOpenDetails(lot);
              }}
              className="bg-stone-900/90 hover:bg-emerald-900/60 p-4 rounded-2xl border border-stone-700 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCropEmoji(lot.crop)}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {localizeCropName(lot.crop, language)}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {lot.lotNumber}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getGradeBg(lot.qualityGrade)}`}>
                  {localizeGrade(lot.qualityGrade, language)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800">
                <span className="text-stone-300">{lot.quantityQuintals} {localizeUnit('q', language)}</span>
                <span className="font-bold text-emerald-400">₹{lot.expectedPricePerQ}/{localizeUnit('q', language)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{lot.district}, {localizeState(lot.state, language)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-stone-400 text-center z-10">
          {t('buyer.showingGeolocations') || 'Showing interactive lot geolocation clusters across Indian mandis and farmgates.'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[540px] rounded-3xl overflow-hidden border-2 border-emerald-800/40 relative shadow-xl">
      <APIProvider
        apiKey={apiKey}
        region="IN"
        language="en"
        libraries={['marker', 'geometry']}
      >
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={defaultCenter}
          defaultZoom={6}
          mapId="DEMO_MAP_ID"
          gestureHandling="greedy"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          <MapCenterController
            targetCoords={
              selectedLot?.latitude && selectedLot?.longitude
                ? { lat: selectedLot.latitude, lng: selectedLot.longitude }
                : null
            }
          />

          {lots.map((lot) => {
            const lat = lot.latitude || 20.5937;
            const lng = lot.longitude || 78.9629;
            const isSelected = selectedLot?.id === lot.id;

            return (
              <AdvancedMarker
                key={lot.id}
                position={{ lat, lng }}
                onClick={() => {
                  onSelectLot(lot);
                  setActiveInfoWindowLot(lot);
                }}
                title={`${localizeCropName(lot.crop, language)} - ${lot.lotNumber}`}
              >
                <div
                  className={`px-2.5 py-1.5 rounded-2xl shadow-xl border-2 flex items-center gap-1.5 transition-all transform cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 border-white scale-110 ring-4 ring-amber-400/40 font-black'
                      : 'bg-emerald-950 text-white border-emerald-400 hover:scale-105'
                  }`}
                >
                  <span className="text-base">{getCropEmoji(lot.crop)}</span>
                  <div className="text-left leading-tight">
                    <span className="text-[11px] font-extrabold block truncate max-w-[90px]">
                      {localizeCropName(lot.crop, language)}
                    </span>
                    <span className="text-[10px] opacity-90 block">
                      ₹{lot.expectedPricePerQ}/{localizeUnit('q', language)}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      lot.qualityGrade.includes('A')
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-stone-950'
                    }`}
                  >
                    {localizeGrade(lot.qualityGrade, language).replace('Grade ', '')}
                  </span>
                </div>
              </AdvancedMarker>
            );
          })}

          {activeInfoWindowLot && activeInfoWindowLot.latitude && activeInfoWindowLot.longitude && (
            <InfoWindow
              position={{
                lat: activeInfoWindowLot.latitude,
                lng: activeInfoWindowLot.longitude,
              }}
              onCloseClick={() => setActiveInfoWindowLot(null)}
            >
              <div className="p-3 max-w-xs space-y-2 text-stone-900 font-sans">
                <div className="flex items-start justify-between gap-2 border-b border-stone-200 pb-1.5">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase">
                      {activeInfoWindowLot.lotNumber}
                    </span>
                    <h4 className="font-black text-sm text-stone-900">
                      {localizeCropName(activeInfoWindowLot.crop, language)}
                    </h4>
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {localizeGrade(activeInfoWindowLot.qualityGrade, language)}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t('buyer.volume') || 'Volume'}:</span>
                    <span className="font-bold">{activeInfoWindowLot.quantityQuintals} {localizeUnit('quintals', language)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t('buyer.askingPrice') || 'Asking Price'}:</span>
                    <span className="font-bold text-emerald-800">
                      ₹{activeInfoWindowLot.expectedPricePerQ}/{localizeUnit('q', language)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{t('buyer.farmer') || 'Farmer'}:</span>
                    <span className="font-medium">{activeInfoWindowLot.farmerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500 truncate pt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>{activeInfoWindowLot.district}, {localizeState(activeInfoWindowLot.state, language)}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenDetails(activeInfoWindowLot);
                      setActiveInfoWindowLot(null);
                    }}
                    className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t('buyer.inspectAIReport') || 'Inspect AI Report & Offer'}</span>
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
