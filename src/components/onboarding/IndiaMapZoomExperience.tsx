import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { LocationData } from '../../types/krishi';
import { MapPin, Check, Sparkles, Compass, Navigation, RefreshCw, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IndiaMapZoomExperienceProps {
  location: LocationData;
  onConfirm: () => void;
  onChangeLocationClick: () => void;
  isDetecting: boolean;
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
      // Step 2: Pin drops at user coordinates (still zoomed out)
      map.panTo({ lat: targetLocation.latitude, lng: targetLocation.longitude });
      map.setZoom(5.2);
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
  isDetecting,
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [animationStep, setAnimationStep] = useState<number>(1);
  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);

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
    // 0s: Step 1 - India Map appears
    // 0.8s: Step 2 - Pin drops
    // 2.0s: Step 3 - Zooms into state
    // 3.4s: Step 4 - Zooms into district/city
    // 4.6s: Step 5 - Complete

    const t1 = setTimeout(() => setAnimationStep(2), 800);
    const t2 = setTimeout(() => setAnimationStep(3), 2000);
    const t3 = setTimeout(() => setAnimationStep(4), 3300);
    const t4 = setTimeout(() => {
      setAnimationStep(5);
      setIsAnimationComplete(true);
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [location.formattedAddress, isDetecting]);

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

  const getStageTitle = () => {
    switch (animationStep) {
      case 1:
        return '🇮🇳 Mapping India Overview...';
      case 2:
        return '📍 Pin Dropping on Approximate GPS...';
      case 3:
        return `🔍 Zooming into ${location.state || 'State'} Region...`;
      case 4:
        return `🏘️ Zooming into ${location.district || location.city || 'District'}...`;
      case 5:
      default:
        return `✅ Location Locked: ${location.city || location.village || location.district}`;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-stone-900 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-xl overflow-hidden flex flex-col">
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
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs flex items-center gap-1 px-2"
            title="Replay Zoom Animation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-stone-100 dark:bg-stone-950 overflow-hidden">
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
            >
              <MapCameraController targetLocation={location} animationStep={animationStep} />

              {/* Pin with drop animation */}
              {animationStep >= 2 && (
                <AdvancedMarker
                  position={{ lat: location.latitude, lng: location.longitude }}
                  title={location.formattedAddress}
                >
                  <div className="relative flex flex-col items-center">
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-2xl border-2 border-white transform transition-transform hover:scale-110">
                      <MapPin className="w-6 h-6 fill-white text-emerald-700" />
                    </div>
                    <div className="bg-stone-950/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-md mt-1 shadow-md border border-emerald-500/40 whitespace-nowrap">
                      {location.city || location.village || location.district}
                    </div>
                  </div>
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Interactive Animated Canvas / SVG Vector India Map Fallback */
          <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-stone-900 via-stone-950 to-emerald-950 text-white select-none overflow-hidden">
            {/* Subtle Coordinate Grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* Simulated Animated Zoom Canvas */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-all duration-1000 ease-out"
              style={{
                transform:
                  animationStep === 1
                    ? 'scale(1) translate(0, 0)'
                    : animationStep === 2
                    ? 'scale(1.1) translate(0, 0)'
                    : animationStep === 3
                    ? 'scale(1.9) translate(-5%, -10%)'
                    : 'scale(3.4) translate(-10%, -15%)',
              }}
            >
              {/* Stylized India Geography Vector Outline */}
              <svg
                viewBox="0 0 600 650"
                className="w-[360px] sm:w-[480px] h-auto drop-shadow-[0_0_25px_rgba(16,185,129,0.2)]"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.8"
              >
                {/* Simplified India Border Contour */}
                <path
                  d="M 280,45 L 310,65 L 340,55 L 380,85 L 395,115 L 430,135 L 480,140 L 510,165 L 535,170 L 560,200 L 525,230 L 470,225 L 430,240 L 400,265 L 360,290 L 340,320 L 320,380 L 305,430 L 285,490 L 270,540 L 260,570 L 250,540 L 225,480 L 195,410 L 180,360 L 160,330 L 130,300 L 120,270 L 135,245 L 120,220 L 140,195 L 180,180 L 210,150 L 230,105 L 250,75 Z"
                  className="fill-emerald-950/60 stroke-emerald-400"
                  strokeWidth="2.2"
                />

                {/* Internal State Hub Reference Lines */}
                <circle cx="280" cy="180" r="3" fill="#fbbf24" opacity="0.6" /> {/* Delhi */}
                <circle cx="210" cy="380" r="3" fill="#fbbf24" opacity="0.6" /> {/* Mumbai */}
                <circle cx="340" cy="380" r="3" fill="#fbbf24" opacity="0.6" /> {/* Hyderabad */}
                <circle cx="270" cy="460" r="3" fill="#fbbf24" opacity="0.6" /> {/* Bengaluru */}
                <circle cx="320" cy="470" r="3" fill="#fbbf24" opacity="0.6" /> {/* Chennai */}
                <circle cx="440" cy="270" r="3" fill="#fbbf24" opacity="0.6" /> {/* Kolkata */}

                {/* Target Location Node */}
                <g className="transition-opacity duration-500">
                  {/* Ripple pulse rings */}
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
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                    <MapPin className="w-4 h-4 fill-stone-950" />
                  </div>
                  <div className="bg-stone-900/90 text-amber-300 text-[9px] font-mono px-1.5 py-0.5 rounded shadow border border-amber-400/40 mt-0.5 whitespace-nowrap">
                    {location.city || location.village || 'Detected Farm'}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Corner Badge */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur border border-emerald-500/30 px-3 py-1.5 rounded-xl text-[11px] font-medium text-stone-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>India Spatial Geocoder</span>
            </div>
          </div>
        )}

        {/* Floating Zoom Action Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
          <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 shadow-md">
            📍 {location.latitude.toFixed(3)}° N, {location.longitude.toFixed(3)}° E
          </div>
        </div>
      </div>

      {/* Detected Location Card & Action Buttons */}
      <div className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <Check className="w-3.5 h-3.5" /> Your Location Detected
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                {location.source === 'gps' ? 'Verified Field GPS' : 'Administrative Center'}
              </span>
            </div>

            <h3 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
              {location.city || location.village || location.district},{' '}
              <span className="text-emerald-600 dark:text-emerald-400">{location.state}</span>
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium">
              {location.formattedAddress}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 pt-1">
              <span>
                <strong>District:</strong> {location.district}
              </span>
              {location.subDistrict && (
                <span>
                  <strong>Sub-District:</strong> {location.subDistrict}
                </span>
              )}
              {location.pincode && (
                <span>
                  <strong>PIN:</strong> {location.pincode}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onChangeLocationClick}
              className="px-5 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-stone-700 dark:text-stone-200 font-bold text-sm transition-all hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Change Location</span>
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Location & Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
