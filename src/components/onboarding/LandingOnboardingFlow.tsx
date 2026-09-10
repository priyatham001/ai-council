import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Compass,
  Search,
  Check,
  AlertCircle,
  RotateCcw,
  Languages,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Store,
  Navigation,
} from 'lucide-react';
import { Language, LocationData } from '../../types/krishi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { reverseGeocodeLocation } from '../../services/googleMapsService';
import { IndiaMapZoomExperience } from './IndiaMapZoomExperience';
import { ManualLocationModal } from './ManualLocationModal';
import { queryLocations } from '../../data/indiaWideLocations';

// 5-stage agricultural animation steps
const AGRICULTURAL_DETECTION_STEPS = [
  { phase: 1, icon: '🌱', label: 'Preparing farm map' },
  { phase: 2, icon: '📍', label: 'Detecting your location' },
  { phase: 3, icon: '🗺️', label: 'Identifying your region' },
  { phase: 4, icon: '🌾', label: 'Finding your agricultural area' },
  { phase: 5, icon: '🏪', label: 'Preparing nearby markets' },
];

export const LandingOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  // Page state: 'permission' (1st Page) | 'detecting' (Agricultural Animation) | 'confirmation' (2nd Page) | 'error'
  const [flowMode, setFlowMode] = useState<
    'permission' | 'detecting' | 'confirmation' | 'error'
  >(() => {
    // If the user already confirmed location, we can start in confirmation mode
    const saved = localStorage.getItem('krishi_location');
    return saved ? 'confirmation' : 'permission';
  });

  // Agricultural animation phase: 1 to 5
  const [animPhase, setAnimPhase] = useState<number>(1);

  // Failure code: 1 = Permission Denied, 2 = GPS Unavailable, 3 = Geocoding Unavailable
  const [failureType, setFailureType] = useState<
    'denied' | 'unavailable' | 'geocoding' | null
  >(null);

  // Location Data State
  const [location, setLocation] = useState<LocationData>(() => {
    const saved = localStorage.getItem('krishi_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Default fallback to Kadapa, Andhra Pradesh
    return {
      latitude: 14.4673,
      longitude: 78.8242,
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      subDistrict: 'Kadapa',
      taluka: 'Kadapa',
      city: 'Kadapa',
      village: 'Kadapa',
      town: 'Kadapa',
      formattedAddress: 'Kadapa, YSR Kadapa District, Andhra Pradesh, India',
      source: 'search',
    };
  });

  // State for manual cascading location modal
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);

  // 1. Detect My Location Handler
  const handleDetectLocation = () => {
    setFlowMode('detecting');
    setFailureType(null);
    setAnimPhase(1);

    // Timers for the 5-step agricultural animation
    const t2 = setTimeout(() => setAnimPhase(2), 600);
    const t3 = setTimeout(() => setAnimPhase(3), 1300);
    const t4 = setTimeout(() => setAnimPhase(4), 2100);
    const t5 = setTimeout(() => setAnimPhase(5), 2900);

    if (!navigator.geolocation) {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      setFailureType('unavailable');
      setFlowMode('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const locData = await reverseGeocodeLocation(lat, lng);
          if (locData && locData.state) {
            // Update state with reverse geocoded info
            setTimeout(() => {
              setLocation(locData);
              setFlowMode('confirmation');
            }, 3300);
          } else {
            // Reverse geocoding unavailable: coordinates known but details not determined automatically
            setTimeout(() => {
              setLocation((prev) => ({
                ...prev,
                latitude: lat,
                longitude: lng,
                formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, India`,
              }));
              setFailureType('geocoding');
              setFlowMode('error');
            }, 3300);
          }
        } catch (err) {
          console.warn('Reverse geocoding failed:', err);
          setTimeout(() => {
            setLocation((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, India`,
            }));
            setFailureType('geocoding');
            setFlowMode('error');
          }, 3300);
        }
      },
      (error) => {
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        console.warn('Geolocation error:', error.code, error.message);

        if (error.code === error.PERMISSION_DENIED) {
          setFailureType('denied');
        } else {
          setFailureType('unavailable');
        }
        setFlowMode('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // 2. Location Confirmation Handler
  const handleConfirmLocation = () => {
    // Save confirmed location to localStorage
    localStorage.setItem('krishi_location', JSON.stringify(location));
    localStorage.setItem('krishi_onboarded', 'true');

    // Dispatch global event for listeners across the application
    window.dispatchEvent(
      new CustomEvent('krishi_location_changed', {
        detail: location,
      })
    );

    // Continue to the existing Farmer Journey
    navigate('/farmer');
  };

  // 3. Manual Location Selection Callback
  const handleApplyManualLocation = (newLoc: LocationData) => {
    setLocation(newLoc);
    setFlowMode('confirmation');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* ========================================================================= */}
      {/* Top Header: Brand Logo, Language Selector (TE, EN, MR), Theme Toggle, Admin */}
      {/* ========================================================================= */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand treatment */}
          <Link to="/" className="flex items-center gap-3 group text-left">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black font-outfit tracking-tight text-emerald-950 dark:text-white">
                  KRISHI<span className="text-emerald-600 dark:text-emerald-400">SETU</span>
                </span>
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40">
                  🤖 Kisan AI
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
                From Your Farm to the Right Market • By Idea Forge
              </p>
            </div>
          </Link>

          {/* Controls: Language Selector, Theme Toggle, Admin Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 3-Language Selector: Telugu, English, Marathi */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5 border border-stone-200 dark:border-stone-700">
              <Languages className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 ml-2 mr-0.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent text-xs font-bold text-stone-900 dark:text-white px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="te" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">
                  తెలుగు
                </option>
                <option value="en" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">
                  English
                </option>
                <option value="mr" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">
                  मराठी
                </option>
              </select>
            </div>

            {/* Instant Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Agricultural Daylight' : 'Switch to Earth Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-700" />
              )}
            </button>

            {/* Admin Portal Link */}
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 px-2.5 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors"
            >
              <span>🛡️</span>
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* Main Flow Container */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* --------------------------------------------------------------------- */}
          {/* 1. FIRST PAGE: LOCATION PERMISSION ONBOARDING */}
          {/* --------------------------------------------------------------------- */}
          {flowMode === 'permission' && (
            <motion.div
              key="permission_page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl mx-auto w-full bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-10 border-2 border-emerald-500/40 shadow-2xl text-center space-y-6"
            >
              {/* Agricultural Farm Pin Icon */}
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center text-4xl shadow-md border border-emerald-300 dark:border-emerald-800">
                📍
              </div>

              {/* Exact Required Title & Supporting Text */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-black font-outfit text-stone-900 dark:text-white tracking-tight">
                  Let's find your farm location
                </h1>
                <p className="text-base text-stone-600 dark:text-stone-300 max-w-lg mx-auto leading-relaxed">
                  KrishiSetu uses your location to identify your state, district, taluka and nearby agricultural markets.
                </p>
              </div>

              {/* Feature Highlights: Why Location Matters for Farmers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto pt-2">
                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs">
                  <strong className="block text-stone-900 dark:text-white font-bold mb-1">
                    ⚡ Nearest Mandis
                  </strong>
                  <span className="text-stone-500 dark:text-stone-400">
                    Live APMC prices for your crop variety
                  </span>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs">
                  <strong className="block text-stone-900 dark:text-white font-bold mb-1">
                    🚚 Diesel Freight
                  </strong>
                  <span className="text-stone-500 dark:text-stone-400">
                    Calculates exact transport cost per quintal
                  </span>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs">
                  <strong className="block text-stone-900 dark:text-white font-bold mb-1">
                    🤝 Verified Buyers
                  </strong>
                  <span className="text-stone-500 dark:text-stone-400">
                    Match with procurement agents in your region
                  </span>
                </div>
              </div>

              {/* Action Buttons: Detect My Location & Select Manually */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-5 h-5 text-amber-300" />
                  <span>📍 Detect My Location</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-stone-700 dark:text-stone-200 font-bold text-sm transition-all hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-stone-500" />
                  <span>Select Location Manually</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* 2. AGRICULTURAL ANIMATION EXPERIENCE */}
          {/* --------------------------------------------------------------------- */}
          {flowMode === 'detecting' && (
            <motion.div
              key="detecting_page"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="max-w-xl mx-auto w-full bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-10 border-2 border-emerald-500/50 shadow-2xl text-center space-y-6"
            >
              {/* Pulsing Radar Ring */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-25 animate-ping" />
                <span className="absolute inset-3 rounded-full bg-emerald-400 opacity-20 animate-pulse" />
                <div className="relative w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-emerald-900/30 font-bold">
                  <span>🌾</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
                  Detecting Farm Coordinates
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                  Please allow device GPS permission when prompted
                </p>
              </div>

              {/* 5 Sequential Agricultural Animation Steps */}
              <div className="space-y-2.5 max-w-md mx-auto text-left">
                {AGRICULTURAL_DETECTION_STEPS.map((step) => {
                  const isCurrent = animPhase === step.phase;
                  const isDone = animPhase > step.phase;
                  return (
                    <div
                      key={step.phase}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                        isDone || isCurrent
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{step.icon}</span>
                        <span>{step.label}</span>
                      </div>
                      {isDone ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">
                          ✓
                        </span>
                      ) : isCurrent ? (
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="text-stone-300 dark:text-stone-600">Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(true)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
                >
                  Taking too long? Select location manually instead →
                </button>
              </div>
            </motion.div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* 3. LOCATION FAILURE STATES */}
          {/* --------------------------------------------------------------------- */}
          {flowMode === 'error' && (
            <motion.div
              key="error_page"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="max-w-xl mx-auto w-full bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-amber-500/50 shadow-xl text-center space-y-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center text-2xl shadow-sm">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-outfit">
                  {failureType === 'denied'
                    ? 'Location Permission Denied'
                    : failureType === 'unavailable'
                    ? 'GPS Unavailable'
                    : 'Location Details Unavailable'}
                </h3>

                <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                  {failureType === 'denied' && (
                    <>Location permission was not granted.</>
                  )}
                  {failureType === 'unavailable' && (
                    <>Unable to detect your location right now.</>
                  )}
                  {failureType === 'geocoding' && (
                    <>Location details could not be determined automatically.</>
                  )}
                </p>
              </div>

              {/* Exact action buttons per requirement */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {failureType === 'unavailable' && (
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Select Location Manually</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* 4. SECOND PAGE: CONFIRM YOUR LOCATION */}
          {/* --------------------------------------------------------------------- */}
          {flowMode === 'confirmation' && (
            <motion.div
              key="confirmation_page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 max-w-4xl mx-auto w-full"
            >
              {/* Page Title & Status Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>✓ Location detected successfully</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black font-outfit text-stone-900 dark:text-white">
                  Confirm Your Location
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                  Verify your agricultural region before continuing to your farm journey
                </p>
              </div>

              {/* Exact Required Structure:
                  📍 Location Detected
                  Village: [detected village]
                  Taluka: [detected taluka]
                  District: [detected district]
                  State: [detected state]
                  [Google Map]
                  ✓ Location detected successfully
                  [ Confirm Location ]
                  [ Change Location ]
              */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-xl space-y-6">
                {/* 1. Clear Location Breakdown Card */}
                <div className="bg-stone-50 dark:bg-stone-800/80 rounded-2xl p-5 border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">📍</span>
                    <h3 className="text-lg font-black text-stone-900 dark:text-white font-outfit">
                      Your Detected Location
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Village / Locality
                      </span>
                      <strong className="text-sm sm:text-base text-stone-900 dark:text-white font-black truncate block mt-0.5">
                        {location.village || location.city || location.town || 'Detected Locality'}
                      </strong>
                    </div>

                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Taluka / Sub-District
                      </span>
                      <strong className="text-sm sm:text-base text-stone-900 dark:text-white font-black truncate block mt-0.5">
                        {location.subDistrict || location.taluka || location.city || 'Sub-District'}
                      </strong>
                    </div>

                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        District
                      </span>
                      <strong className="text-sm sm:text-base text-stone-900 dark:text-white font-black truncate block mt-0.5">
                        {location.district || 'District'}
                      </strong>
                    </div>

                    <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        State
                      </span>
                      <strong className="text-sm sm:text-base text-stone-900 dark:text-white font-black truncate block mt-0.5">
                        {location.state || 'India'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Google / Leaflet Map with Animated Marker */}
                <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-inner">
                  <IndiaMapZoomExperience
                    location={location}
                    onConfirm={handleConfirmLocation}
                    onChangeLocationClick={() => setIsManualModalOpen(true)}
                    isDetecting={false}
                    onRetryGps={handleDetectLocation}
                  />
                </div>

                {/* 3. Primary Buttons: [ Confirm Location ] and [ Change Location ] */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-stone-700 dark:text-stone-200 font-bold text-sm transition-all hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-stone-500" />
                    <span>Change Location</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmLocation}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-5 h-5 text-amber-300" />
                    <span>Confirm Location & Start Journey</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Manual Cascading Location Modal: State -> District -> Taluka -> Village */}
      <ManualLocationModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        currentLocation={location}
        onApplyLocation={handleApplyManualLocation}
        language={language}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-4 px-6 text-center text-xs text-stone-500 dark:text-stone-400">
        KrishiSetu Platform • Built with Google Maps Platform and Gemini Vision Assayer • Direct Farm-to-Buyer Linkage
      </footer>
    </div>
  );
};
