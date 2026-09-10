import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { LocationData, MarketItem } from '../../types/krishi';
import { INDIA_WIDE_MARKET_DATABASE } from '../../data/indiaWideMarkets';
import {
  Compass,
  MapPin,
  RefreshCw,
  Search,
  Navigation,
  Layers,
  Sparkles,
  CheckCircle2,
  Store,
  Star,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface CinematicLeafletMapProps {
  location: LocationData;
  onConfirm: () => void;
  onChangeLocationClick: () => void;
  onSelectCoordinates?: (lat: number, lng: number) => Promise<void> | void;
  onRetryGps?: () => void;
  isDetecting?: boolean;
}

// Approximate state centroids for cinematic stage 2 zoom
const STATE_COORDINATES: Record<string, [number, number]> = {
  'Andhra Pradesh': [15.9129, 79.74],
  Telangana: [17.8496, 79.1152],
  Maharashtra: [19.7515, 75.7139],
  Karnataka: [15.3173, 75.7139],
  'Tamil Nadu': [11.1271, 78.6569],
  'Madhya Pradesh': [22.9734, 78.6569],
  'Uttar Pradesh': [26.8467, 80.9462],
  Rajasthan: [27.0238, 74.2179],
  Gujarat: [22.2587, 71.1924],
  Punjab: [31.1471, 75.3412],
  Haryana: [29.0588, 76.0856],
  Bihar: [25.0961, 85.3131],
  'West Bengal': [22.9868, 87.855],
  Odisha: [20.9517, 85.0985],
  Kerala: [10.8505, 76.2711],
  Assam: [26.2006, 92.9376],
  Jharkhand: [23.6102, 85.2799],
  Chhattisgarh: [21.2787, 81.8661],
  Uttarakhand: [30.0668, 79.0193],
  'Himachal Pradesh': [31.1048, 77.1734],
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const CinematicLeafletMap: React.FC<CinematicLeafletMapProps> = ({
  location,
  onConfirm,
  onChangeLocationClick,
  onSelectCoordinates,
  onRetryGps,
  isDetecting = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const marketLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Animation Stage: 1 = India, 2 = State, 3 = District, 4 = User Location
  const [animationStage, setAnimationStage] = useState<1 | 2 | 3 | 4>(1);
  const [stageProgressText, setStageProgressText] = useState<string>('🇮🇳 India Overview');
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [selectedMarket, setSelectedMarket] = useState<MarketItem | null>(null);

  // Find nearest 4 authentic APMC Mandis around user location
  const nearbyMarkets = useMemo(() => {
    const list = INDIA_WIDE_MARKET_DATABASE.map((mkt) => {
      const dist = calculateDistanceKm(
        location.latitude,
        location.longitude,
        mkt.latitude,
        mkt.longitude
      );
      return { ...mkt, distanceKm: dist };
    });
    // Sort by distance
    list.sort((a, b) => a.distanceKm - b.distanceKm);
    const top = list.slice(0, 4);

    // Mark the one with highest price/net return as Recommended Market
    if (top.length > 0) {
      let bestIdx = 0;
      let maxNet = -1;
      top.forEach((m, idx) => {
        const estNet = m.pricePerQuintal - m.distanceKm * 2.5;
        if (estNet > maxNet) {
          maxNet = estNet;
          bestIdx = idx;
        }
      });
      return top.map((m, idx) => ({
        ...m,
        isRecommended: idx === bestIdx,
      }));
    }
    return top;
  }, [location.latitude, location.longitude]);

  // Tile layer URL switch
  const streetTilesUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const satelliteTilesUrl =
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 4.8,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Tile Layer
      const initialLayer = L.tileLayer(
        mapStyle === 'satellite' ? satelliteTilesUrl : streetTilesUrl,
        {
          maxZoom: 18,
        }
      ).addTo(map);

      tileLayerRef.current = initialLayer;

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Layer group for markets
      const marketGroup = L.layerGroup().addTo(map);
      marketLayerGroupRef.current = marketGroup;

      // Handle map click to re-position user marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (onSelectCoordinates) {
          onSelectCoordinates(lat, lng);
        }
      });

      mapInstanceRef.current = map;
    }

    // Invalidate size in case container rendered in animation
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Switch Tile Layer (Street vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newLayer = L.tileLayer(mapStyle === 'satellite' ? satelliteTilesUrl : streetTilesUrl, {
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapStyle]);

  // 3. Cinematic Zoom Animation Sequence
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || isDetecting) return;

    const userLat = location.latitude;
    const userLng = location.longitude;

    // Determine state centroid
    const stateCenter =
      STATE_COORDINATES[location.state] || [
        20.5937 * 0.3 + userLat * 0.7,
        78.9629 * 0.3 + userLng * 0.7,
      ];

    // Stage 1: India Overview (zoom 5)
    setAnimationStage(1);
    setStageProgressText('🇮🇳 Stage 1/4: National Overview — India');
    map.setView([20.5937, 78.9629], 4.9, { animate: false });

    // Stage 2: Zoom to State (after 900ms)
    const t1 = setTimeout(() => {
      setAnimationStage(2);
      setStageProgressText(`🗺️ Stage 2/4: Focusing on ${location.state || 'State'}`);
      map.flyTo(stateCenter, 7.2, {
        duration: 2.0,
        easeLinearity: 0.25,
      });
    }, 900);

    // Stage 3: Zoom to District (after 3000ms)
    const t2 = setTimeout(() => {
      setAnimationStage(3);
      setStageProgressText(`🔍 Stage 3/4: Navigating ${location.district || 'District'} Region`);
      map.flyTo([userLat, userLng], 10.2, {
        duration: 2.0,
        easeLinearity: 0.25,
      });
    }, 3000);

    // Stage 4: Zoom to exact User Location & show Mandi markers (after 5100ms)
    const t3 = setTimeout(() => {
      setAnimationStage(4);
      setStageProgressText(`📍 Stage 4/4: Precise Farm Location & Nearby Mandis`);
      map.flyTo([userLat, userLng], 12.8, {
        duration: 1.8,
        easeLinearity: 0.25,
      });
    }, 5100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.latitude, location.longitude, location.state, isDetecting]);

  // 4. Update User Marker & Accuracy Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing user marker & circle
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }
    if (userCircleRef.current) {
      map.removeLayer(userCircleRef.current);
    }

    // Glowing Green User Marker HTML DivIcon
    const userDivIcon = L.divIcon({
      className: 'custom-user-marker-container',
      html: `
        <div class="relative flex items-center justify-center w-12 h-12">
          <div class="absolute inset-0 rounded-full bg-emerald-500 opacity-40 animate-ping"></div>
          <div class="absolute -inset-2 rounded-full bg-emerald-400/20 animate-pulse"></div>
          <div class="relative w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-sm">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-emerald-500/40 pointer-events-none">
            📍 You Are Here
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const marker = L.marker([location.latitude, location.longitude], {
      icon: userDivIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Accuracy ripple radius circle
    const circle = L.circle([location.latitude, location.longitude], {
      radius: 800,
      color: '#10b981',
      fillColor: '#34d399',
      fillOpacity: 0.12,
      weight: 1.5,
      dashArray: '4, 6',
    }).addTo(map);

    userMarkerRef.current = marker;
    userCircleRef.current = circle;
  }, [location.latitude, location.longitude, location.city]);

  // 5. Render Nearby Mandi & ⭐ Recommended Market Markers
  useEffect(() => {
    const marketGroup = marketLayerGroupRef.current;
    if (!marketGroup) return;

    marketGroup.clearLayers();

    // Only render market markers if animation reached stage 3 or 4
    if (animationStage < 3) return;

    nearbyMarkets.forEach((mkt) => {
      const isRec = (mkt as any).isRecommended;

      // Icon HTML
      const iconHtml = isRec
        ? `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group">
          <div class="absolute -top-6 px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[9px] shadow-lg border border-amber-300 flex items-center gap-1 whitespace-nowrap animate-bounce">
            ⭐ Recommended Mandi
          </div>
          <div class="w-9 h-9 rounded-2xl bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-stone-950 font-black text-sm ring-4 ring-amber-400/40">
            🏪
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-md bg-stone-900/90 text-amber-300 text-[10px] font-bold whitespace-nowrap shadow-md border border-amber-500/50">
            ₹${mkt.pricePerQuintal}/qtl • ${mkt.distanceKm} km
          </div>
        </div>
      `
        : `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group">
          <div class="w-7 h-7 rounded-xl bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs ring-2 ring-blue-400/30">
            🏪
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded-md bg-stone-900/80 text-white text-[9px] font-medium whitespace-nowrap shadow-sm">
            ${mkt.name.slice(0, 16)} • ${mkt.distanceKm}km
          </div>
        </div>
      `;

      const mktIcon = L.divIcon({
        className: 'custom-mandi-marker',
        html: iconHtml,
        iconSize: isRec ? [130, 60] : [100, 50],
        iconAnchor: isRec ? [65, 30] : [50, 25],
      });

      const mMarker = L.marker([mkt.latitude, mkt.longitude], {
        icon: mktIcon,
        zIndexOffset: isRec ? 500 : 200,
      });

      mMarker.on('click', () => {
        setSelectedMarket(mkt);
      });

      marketGroup.addLayer(mMarker);
    });
  }, [nearbyMarkets, animationStage]);

  // Recenter helper
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([location.latitude, location.longitude], 13, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  };

  return (
    <div className="relative w-full h-[620px] sm:h-[700px] rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-200 dark:border-stone-800 bg-stone-950">
      {/* 1. Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. Top HUD Header: Cinematic Sequence Stage & Team Brand */}
      <div className="absolute top-4 left-4 right-4 z-400 pointer-events-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="pointer-events-auto bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-stone-700 shadow-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Compass className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">{stageProgressText}</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono">
              Idea Forge • KrishiSetu GeoEngine
            </p>
          </div>
        </div>

        {/* Top Right Controls: Map Style & Recenter */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Street / Satellite Switch */}
          <div className="bg-stone-900/90 backdrop-blur-md p-1 rounded-2xl border border-stone-700 shadow-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMapStyle('streets')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mapStyle === 'streets'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              🗺️ Map
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('satellite')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mapStyle === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              🛰️ Satellite
            </button>
          </div>

          {/* Recenter Button */}
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter to User Location"
            className="bg-stone-900/90 hover:bg-stone-800 text-white p-2.5 rounded-2xl border border-stone-700 shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Recenter</span>
          </button>
        </div>
      </div>

      {/* 3. Kisan AI Location Voice Bubble */}
      <div className="absolute top-20 left-4 max-w-sm z-400 pointer-events-none hidden md:block">
        <div className="pointer-events-auto bg-stone-900/90 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/40 shadow-xl text-white space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 font-black flex items-center justify-center text-xs">
              🤖
            </div>
            <span className="text-xs font-bold text-amber-300 font-outfit">Kisan AI Assayer</span>
          </div>
          <p className="text-xs text-stone-200 leading-snug">
            "Namaste Kisan Bhai! I mapped your farm in{' '}
            <strong className="text-emerald-400">
              {location.city || location.village || location.district}
            </strong>
            . Notice the <strong>⭐ Recommended Mandi</strong> with highest net realization!"
          </p>
        </div>
      </div>

      {/* 4. Click Anywhere Prompt Indicator */}
      <div className="absolute top-20 right-4 z-400 pointer-events-none">
        <div className="bg-stone-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-stone-700 text-[11px] text-stone-300 shadow-lg flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tip: Tap anywhere on map to reposition farm pin</span>
        </div>
      </div>

      {/* 5. Bottom Location Confirmation Card (Card smoothly appears from bottom) */}
      <div className="absolute bottom-4 left-4 right-4 z-400">
        <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-500/30 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Location details */}
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center shrink-0 text-xl shadow-xs">
                📍
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-black text-stone-900 dark:text-white leading-tight">
                    {location.city || location.village || location.district || 'Detected Location'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 uppercase">
                    {location.source.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {location.district ? `${location.district}, ` : ''}
                  {location.state}, India
                  <span className="ml-2 font-mono text-[11px] text-stone-400">
                    ({location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E)
                  </span>
                </p>
              </div>
            </div>

            {/* Nearest Markets Quick Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {nearbyMarkets.map((mkt) => {
                const isRec = (mkt as any).isRecommended;
                return (
                  <button
                    key={mkt.id}
                    type="button"
                    onClick={() => {
                      setSelectedMarket(mkt);
                      mapInstanceRef.current?.flyTo([mkt.latitude, mkt.longitude], 13.5, {
                        duration: 1.2,
                      });
                    }}
                    className={`shrink-0 px-2.5 py-1.5 rounded-xl text-left border transition-all text-[11px] cursor-pointer ${
                      isRec
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span className="font-bold block truncate max-w-[120px]">
                      {isRec ? '⭐ ' : ''}
                      {mkt.name}
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">
                      ₹{mkt.pricePerQuintal}/qtl • {mkt.distanceKm}km
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onChangeLocationClick}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-stone-500" />
                <span>Search Manually</span>
              </button>

              {onRetryGps && (
                <button
                  type="button"
                  onClick={onRetryGps}
                  className="px-3 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Re-query GPS"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden sm:inline">Re-detect GPS</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Yes, Confirm & Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Selected Market Popover Dialog */}
      {selectedMarket && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-500 max-w-sm w-full p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border-2 border-amber-400 shadow-2xl space-y-3 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                {(selectedMarket as any).isRecommended
                  ? '⭐ Highest Net Payout APMC'
                  : 'APMC Yard'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedMarket(null)}
                className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-base font-black text-stone-900 dark:text-white font-outfit">
                {selectedMarket.name}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {selectedMarket.district}, {selectedMarket.state} • {selectedMarket.distanceKm} km
                away
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[10px]">
                  Mandi Modal Price
                </span>
                <strong className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  ₹{selectedMarket.pricePerQuintal}/qtl
                </strong>
              </div>
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[10px]">
                  Est. Transport
                </span>
                <strong className="text-base font-black text-stone-900 dark:text-stone-100">
                  ₹{Math.round(selectedMarket.distanceKm * 2.5)}/qtl
                </strong>
              </div>
            </div>

            <p className="text-[11px] text-stone-600 dark:text-stone-300">
              Verified Buyer:{' '}
              <strong className="text-stone-900 dark:text-white">
                {selectedMarket.buyer?.name || 'Authorized APMC Commission Agent'}
              </strong>{' '}
              ({selectedMarket.buyer?.rating || 4.8}★)
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedMarket(null);
                onConfirm();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Select This Market & Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
