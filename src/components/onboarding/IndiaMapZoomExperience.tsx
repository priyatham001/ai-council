import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { LocationData } from '../../types/krishi';
import { MapPin, Check, Search, Compass, RefreshCw, Sparkles, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

interface IndiaMapZoomExperienceProps {
  location: LocationData;
  onConfirm: () => void;
  onChangeLocationClick: () => void;
  onSelectCoordinates?: (lat: number, lng: number) => Promise<void> | void;
  isDetecting: boolean;
  onRetryGps?: () => void;
}

// Sub-component controlling smooth camera moves on Google Maps instance
const MapCameraController: React.FC<{
  targetLocation: LocationData;
  animationStep: number;
}> = ({ targetLocation, animationStep }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (animationStep === 1) {
      // Step 1: Whole India overview
      map.setCenter({ lat: 20.5937, lng: 78.9629 });
      map.setZoom(4.6);
    } else if (animationStep === 2) {
      // Step 2: Pin drops at user coordinates
      map.panTo({ lat: targetLocation.latitude, lng: targetLocation.longitude });
      map.setZoom(5.4);
    } else if (animationStep === 3) {
      // Step 3: Zoom into state
      map.panTo({ lat: targetLocation.latitude, lng: targetLocation.longitude });
      map.setZoom(7.5);
    } else if (animationStep >= 4) {
      // Step 4 & 5: Zoom deep into district / city
      map.panTo({ lat: targetLocation.latitude, lng: targetLocation.longitude });
      map.setZoom(12);
    }
  }, [map, animationStep, targetLocation.latitude, targetLocation.longitude]);

  return null;
};

export const IndiaMapZoomExperience: React.FC<IndiaMapZoomExperienceProps> = ({
  location,
  onConfirm,
  onChangeLocationClick,
  onSelectCoordinates,
  isDetecting,
  onRetryGps,
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [animationStep, setAnimationStep] = useState<number>(1);
  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);
  const [isPinMoving, setIsPinMoving] = useState<boolean>(false);

  // Run the sequential camera zoom sequence
  useEffect(() => {
    if (isDetecting) {
      setAnimationStep(1);
      setIsAnimationComplete(false);
      return;
    }

    setAnimationStep(1);
    setIsAnimationComplete(false);

    // Sequence timer:
    // Step 1: India overview
    // Step 2: Pin drops & pulses
    // Step 3: Zoom to state
    // Step 4: Zoom to city/district
    // Step 5: Final highlight
    const t1 = setTimeout(() => setAnimationStep(2), 700);
    const t2 = setTimeout(() => setAnimationStep(3), 1800);
    const t3 = setTimeout(() => setAnimationStep(4), 3100);
    const t4 = setTimeout(() => {
      setAnimationStep(5);
      setIsAnimationComplete(true);
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [location.latitude, location.longitude, isDetecting]);

  const restartAnimation = () => {
    setAnimationStep(1);
    setIsAnimationComplete(false);
    setTimeout(() => setAnimationStep(2), 500);
    setTimeout(() => setAnimationStep(3), 1600);
    setTimeout(() => setAnimationStep(4), 2800);
    setTimeout(() => {
      setAnimationStep(5);
      setIsAnimationComplete(true);
    }, 3900);
  };

  const handleCoordinateClick = async (lat: number, lng: number) => {
    setIsPinMoving(true);
    try {
      if (onSelectCoordinates) {
        await onSelectCoordinates(lat, lng);
      }
    } finally {
      setIsPinMoving(false);
    }
  };

  // Click handler on vector SVG fallback map
  const handleVectorMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const yRatio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Map pixel percentages to approximate India coordinates:
    // India Lat approx 8.4° N (South) to 35.5° N (North)
    // India Lng approx 68.7° E (West) to 97.2° E (East)
    const lat = 35.5 - yRatio * (35.5 - 8.4);
    const lng = 68.7 + xRatio * (97.2 - 68.7);

    handleCoordinateClick(lat, lng);
  };

  const getStageTitle = () => {
    switch (animationStep) {
      case 1:
        return '🇮🇳 Mapping India Overview...';
      case 2:
        return '📍 Dropping Pin at Coordinates...';
      case 3:
        return `🔍 Zooming into ${location.state || 'State'} Region...`;
      case 4:
        return `🏘️ Zooming into ${location.district || location.city || 'District'}...`;
      case 5:
      default:
        return `✅ Location Locked: ${location.city || location.village || location.district}`;
    }
  };

  // Formatted location components for confirmation card
  const locationDisplay = [
    location.city || location.village || location.district,
    location.district && location.district !== location.city ? location.district : null,
    location.state,
    'India',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="w-full bg-white dark:bg-stone-900 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl overflow-hidden flex flex-col">
      {/* Top Map Stage Indicator Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs sm:text-sm font-bold tracking-wide">
            {getStageTitle()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-200">
            <span>Stage {animationStep}/5</span>
          </div>

          <button
            type="button"
            onClick={restartAnimation}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs flex items-center gap-1 px-2.5"
            title="Replay Zoom Animation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay Zoom</span>
          </button>
        </div>
      </div>

      {/* AI Guide Speech Bubble */}
      <div className="bg-emerald-950 border-b border-emerald-800/60 px-4 sm:px-6 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-base shrink-0 shadow-sm">
            🤖
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-extrabold text-amber-300 mr-1.5">AI Guide:</span>
            <span className="text-stone-200 font-medium italic">
              “I found your location. Let me show you where you are.”
            </span>
          </div>
        </div>

        <span className="text-[11px] text-emerald-300/80 font-mono hidden md:inline-flex items-center gap-1">
          <Compass className="w-3 h-3" /> Click map or drag pin to adjust
        </span>
      </div>

      {/* Map Viewport Area */}
      <div className="relative w-full h-[340px] sm:h-[420px] bg-stone-900 overflow-hidden cursor-crosshair">
        {apiKey ? (
          <APIProvider
            apiKey={apiKey}
            region="IN"
            language="en"
            libraries={['places', 'geometry', 'marker']}
          >
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
              defaultZoom={4.8}
              mapId="DEMO_MAP_ID"
              gestureHandling="greedy"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              onClick={(e: any) => {
                if (e.detail?.latLng) {
                  handleCoordinateClick(e.detail.latLng.lat, e.detail.latLng.lng);
                }
              }}
            >
              <MapCameraController targetLocation={location} animationStep={animationStep} />

              {/* Pin with drop animation & pulsing ring */}
              {animationStep >= 2 && (
                <AdvancedMarker
                  position={{ lat: location.latitude, lng: location.longitude }}
                  title={`${location.formattedAddress} (Click or drag to move)`}
                  draggable={true}
                  onDragEnd={(e: any) => {
                    if (e.latLng) {
                      handleCoordinateClick(e.latLng.lat(), e.latLng.lng());
                    }
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Pulsing rings */}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                    </span>

                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-2xl border-2 border-white transform transition-transform hover:scale-125 cursor-grab active:cursor-grabbing">
                      <MapPin className="w-6 h-6 fill-white text-emerald-800" />
                    </div>

                    <div className="bg-stone-950/95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md mt-1 shadow-lg border border-emerald-500/40 whitespace-nowrap">
                      {location.city || location.village || location.district}
                    </div>
                  </div>
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Interactive Animated Canvas / SVG Vector India Map Fallback */
          <div
            onClick={handleVectorMapClick}
            className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-stone-950 via-stone-900 to-emerald-950 text-white select-none overflow-hidden"
          >
            {/* Coordinate Grid Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Smooth Zoom Canvas */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-all duration-1000 ease-out"
              style={{
                transform:
                  animationStep === 1
                    ? 'scale(1) translate(0, 0)'
                    : animationStep === 2
                    ? 'scale(1.15) translate(0, 0)'
                    : animationStep === 3
                    ? 'scale(1.9) translate(-4%, -8%)'
                    : 'scale(3.2) translate(-8%, -12%)',
              }}
            >
              {/* Stylized India Geography Vector Outline */}
              <svg
                viewBox="0 0 600 650"
                className="w-[360px] sm:w-[480px] h-auto drop-shadow-[0_0_25px_rgba(16,185,129,0.2)] pointer-events-none"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.8"
              >
                <path
                  d="M 280,45 L 310,65 L 340,55 L 380,85 L 395,115 L 430,135 L 480,140 L 510,165 L 535,170 L 560,200 L 525,230 L 470,225 L 430,240 L 400,265 L 360,290 L 340,320 L 320,380 L 305,430 L 285,490 L 270,540 L 260,570 L 250,540 L 225,480 L 195,410 L 180,360 L 160,330 L 130,300 L 120,270 L 135,245 L 120,220 L 140,195 L 180,180 L 210,150 L 230,105 L 250,75 Z"
                  className="fill-emerald-950/70 stroke-emerald-400"
                  strokeWidth="2.2"
                />

                {/* Major Agricultural Hub Coordinates */}
                <circle cx="280" cy="180" r="3" fill="#fbbf24" opacity="0.6" />
                <circle cx="210" cy="380" r="3" fill="#fbbf24" opacity="0.6" />
                <circle cx="340" cy="380" r="3" fill="#fbbf24" opacity="0.6" />
                <circle cx="270" cy="460" r="3" fill="#fbbf24" opacity="0.6" />
                <circle cx="320" cy="470" r="3" fill="#fbbf24" opacity="0.6" />
                <circle cx="440" cy="270" r="3" fill="#fbbf24" opacity="0.6" />

                {/* Target Location Node */}
                <g className="transition-opacity duration-500">
                  <circle
                    cx="330"
                    cy="400"
                    r="24"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                  <circle
                    cx="330"
                    cy="400"
                    r="12"
                    fill="#10b981"
                    opacity="0.4"
                    className="animate-pulse"
                  />
                  <circle cx="330" cy="400" r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                </g>
              </svg>

              {/* Pin Overlay */}
              {animationStep >= 2 && (
                <motion.div
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="absolute z-20 flex flex-col items-center pointer-events-none"
                  style={{ top: '61%', left: '55%' }}
                >
                  <div className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                    <MapPin className="w-5 h-5 fill-stone-950" />
                  </div>
                  <div className="bg-stone-950/90 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded shadow border border-amber-400/40 mt-1 whitespace-nowrap">
                    {location.city || location.village || 'Detected Location'}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Corner Helper Badge */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur border border-emerald-500/30 px-3 py-1.5 rounded-xl text-[11px] font-medium text-stone-300 flex items-center gap-1.5 pointer-events-none">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive India Spatial Map • Click anywhere to reposition</span>
            </div>
          </div>
        )}

        {/* Pin Moving Loader Overlay */}
        {isPinMoving && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-30 pointer-events-none">
            <div className="bg-stone-900/90 border border-emerald-500/40 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-white text-xs font-bold shadow-xl">
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
              Reverse geocoding coordinates...
            </div>
          </div>
        )}

        {/* Floating Coordinates Tag */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
          <div className="bg-stone-950/90 backdrop-blur border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-emerald-300 shadow-md">
            📍 {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 7 — CONFIRMATION CARD (Strict User Requirement) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Step 7: Location Confirmation
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-outfit">
            📍 Is this your location?
          </h3>

          <div className="bg-stone-50 dark:bg-stone-800/70 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-700 shadow-xs space-y-1">
            <p className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-300 font-outfit">
              {locationDisplay}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              {location.formattedAddress}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 font-mono">
              <span>District: <strong>{location.district}</strong></span>
              {location.subDistrict && <span>Sub-District: <strong>{location.subDistrict}</strong></span>}
              {location.pincode && <span>PIN: <strong>{location.pincode}</strong></span>}
              <span className="text-emerald-600 dark:text-emerald-400">
                Source: {location.source === 'gps' ? 'Field GPS' : 'Manual / Spatial'}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400">
            Click anywhere on the map or drag the pin to adjust your exact field position.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onChangeLocationClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-stone-700 dark:text-stone-200 font-bold text-sm transition-all hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-stone-500" />
              <span>Change Location</span>
            </button>

            {onRetryGps && (
              <button
                type="button"
                onClick={onRetryGps}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 hover:border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold text-sm transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Re-detect GPS</span>
              </button>
            )}

            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              <span>Yes, Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
