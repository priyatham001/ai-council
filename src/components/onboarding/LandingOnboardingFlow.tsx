import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Sun,
  Moon,
  MapPin,
  Search,
  Check,
  ArrowRight,
  Compass,
  Building2,
  ShieldCheck,
  RotateCcw,
  Loader2,
  Navigation,
  AlertCircle,
  X,
} from 'lucide-react';
import { Language, LocationData } from '../../types/krishi';
import { SUPPORTED_LANGUAGES } from '../../utils/i18n';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useFarmerGuide } from '../../context/FarmerGuideContext';
import { reverseGeocodeLocation } from '../../services/googleMapsService';
import { IndiaMapZoomExperience } from './IndiaMapZoomExperience';
import { queryLocations } from '../../data/indiaWideLocations';
import { FarmToMarket3DHero } from '../landing/FarmToMarket3DHero';

// Language cards — all 7 languages from the central registry
// See src/utils/i18n.ts SUPPORTED_LANGUAGES for the full list

const POPULAR_SEARCH_PRESETS = [
  { name: 'Kadapa', district: 'YSR Kadapa', state: 'Andhra Pradesh', lat: 14.4673, lng: 78.8242 },
  { name: 'Proddatur', district: 'YSR Kadapa', state: 'Andhra Pradesh', lat: 14.7527, lng: 78.5524 },
  { name: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
  { name: 'Warangal', district: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },
  { name: 'Nizamabad', district: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941 },
  { name: 'Nashik', district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Indore', district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Kolar', district: 'Kolar', state: 'Karnataka', lat: 13.1367, lng: 78.1292 },
  { name: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
];

export const LandingOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();

  // Onboarding Step: 1 = Language & Theme, 2 = Location Detection, 3 = Role Selection
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Language state — synced with global LanguageContext
  const { language: selectedLanguage, setLanguage: setGlobalLanguage, t } = useLanguage();


  // Theme state — synced with global ThemeContext (single source of truth)
  const { isDark: isDarkMode, setTheme, toggleTheme } = useTheme();
  const { setGuideStepId, setTargetSelector } = useFarmerGuide();

  // Sync guide step with current onboarding step
  useEffect(() => {
    if (step === 1) {
      setGuideStepId('start-language');
      setTargetSelector('#guide-language-step');
    } else if (step === 2) {
      setGuideStepId('start-location');
      setTargetSelector('#guide-location-step');
    } else if (step === 3) {
      setGuideStepId('start-role');
      setTargetSelector('#guide-role-step');
    }
  }, [step, setGuideStepId, setTargetSelector]);

  // Location State Machine for Step 2
  // 'explain' -> 'requesting' -> ('map_preview' | 'error' | 'manual_search')
  const [locationStepMode, setLocationStepMode] = useState<
    'explain' | 'requesting' | 'error' | 'map_preview' | 'manual_search'
  >('explain');

  const [geoErrorCode, setGeoErrorCode] = useState<number | null>(null);
  const [gpsPhase, setGpsPhase] = useState<1 | 2 | 3 | 4>(1);

  // Location state: load from localStorage if previously set, else default coordinates
  const [location, setLocation] = useState<LocationData>(() => {
    const saved = localStorage.getItem('krishi_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      latitude: 14.4673,
      longitude: 78.8242,
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'YSR Kadapa',
      city: 'Kadapa',
      town: 'Kadapa',
      formattedAddress: 'Kadapa, YSR Kadapa District, Andhra Pradesh, India',
      source: 'search',
    };
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Save language — writes to global context (which persists to localStorage)
  const handleSelectLanguage = (lang: Language) => {
    setGlobalLanguage(lang);
    // Ask for location permission early during language selection so that the next page will be ready
    if (navigator.geolocation && locationStepMode === 'explain') {
      requestBrowserGeolocation();
    }
  };

  // Step 1 -> Step 2 transition: Show explanation card first, DO NOT auto-trigger GPS without consent
  const handleLanguageStepSubmit = () => {
    setStep(2);
    // Check if user already confirmed location previously
    const saved = localStorage.getItem('krishi_location');
    if (saved) {
      setLocationStepMode('map_preview');
    } else {
      setLocationStepMode('explain');
    }
  };

  // Trigger Real Browser Geolocation API with Sequential 4-Step Animation
  const requestBrowserGeolocation = () => {
    setLocationStepMode('requesting');
    setGeoErrorCode(null);
    setGpsPhase(1);

    // Progression timers for realistic GPS detection HUD
    const timer2 = setTimeout(() => setGpsPhase(2), 700);
    const timer3 = setTimeout(() => setGpsPhase(3), 1600);
    const timer4 = setTimeout(() => setGpsPhase(4), 2500);

    if (!navigator.geolocation) {
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setGeoErrorCode(0);
      setLocationStepMode('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Immediately update coordinates so phase 2 shows the live GPS coordinates
        setLocation((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        try {
          const locData = await reverseGeocodeLocation(lat, lng);
          setTimeout(() => {
            setLocation(locData);
            setLocationStepMode('map_preview');
          }, 2400);
        } catch (err) {
          console.warn('Reverse geocode error, using precise coordinates:', err);
          setTimeout(() => {
            setLocation((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, India`,
              source: 'gps',
            }));
            setLocationStepMode('map_preview');
          }, 2400);
        }
      },
      (error) => {
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        console.warn(`Geolocation error code: ${error.code} - ${error.message}`);
        setGeoErrorCode(error.code);
        setLocationStepMode('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // Reverse geocode whenever coordinates change via map click or pin drag
  const handleCoordinateSelect = async (lat: number, lng: number) => {
    try {
      const locData = await reverseGeocodeLocation(lat, lng);
      setLocation(locData);
    } catch {
      setLocation((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, India`,
      }));
    }
  };

  // Step 7: Confirm Location
  const handleLocationConfirmed = () => {
    // Save chosen location in localStorage
    localStorage.setItem('krishi_location', JSON.stringify(location));

    // Dispatch global event for listeners across the app
    window.dispatchEvent(
      new CustomEvent('krishi_location_changed', {
        detail: location,
      })
    );

    // Proceed to Step 3 (Role Selection)
    setStep(3);
  };

  const handleRoleSelect = (role: 'farmer' | 'buyer') => {
    localStorage.setItem('krishi_user_role', role);
    localStorage.setItem('krishi_onboarded', 'true');
    if (role === 'farmer') {
      navigate('/farmer');
    } else {
      navigate('/buyers');
    }
  };

  // Location search input query with debounce
  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // 1. Check server geocode search endpoint
      const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.results && data.results.length > 0) {
          setSearchResults(data.results);
          setIsSearching(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Search endpoint error, falling back to local master list:', err);
    }

    // 2. Fallback to local master locations
    const localMatches = queryLocations(query, 10).map((l) => ({
      name: l.name,
      formattedAddress: `${l.name}, ${l.subDistrict}, ${l.district} District, ${l.state}, India`,
      district: l.district,
      state: l.state,
      country: 'India',
      lat: l.latitude,
      lng: l.longitude,
      source: 'local',
    }));

    setSearchResults(localMatches);
    setIsSearching(false);
  };

  const handleSelectSearchResult = (res: any) => {
    const lat = res.lat || res.latitude;
    const lng = res.lng || res.longitude;
    const newLoc: LocationData = {
      latitude: lat,
      longitude: lng,
      country: 'India',
      state: res.state,
      district: res.district,
      city: res.name || res.city,
      town: res.name || res.city,
      formattedAddress: res.formattedAddress || `${res.name}, ${res.district}, ${res.state}, India`,
      source: 'search',
    };
    setLocation(newLoc);
    setSearchQuery('');
    setSearchResults([]);
    setLocationStepMode('map_preview');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Brand Bar */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              🌾
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black font-outfit tracking-tight text-emerald-900 dark:text-white">
                Agri<span className="text-emerald-600 dark:text-emerald-400">Connect</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold text-amber-800 dark:text-amber-300 ml-2 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800">
                Direct Farmer & Buyer Linkage
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Header Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-amber-300 transition-colors border border-stone-200 dark:border-stone-700 cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Step Breadcrumbs */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold">
            <span
              className={`px-3 py-1 rounded-full transition-colors ${
                step === 1
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              1. Language & Theme
            </span>
            <span className="text-stone-400">→</span>
            <span
              className={`px-3 py-1 rounded-full transition-colors ${
                step === 2
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              2. Location
            </span>
            <span className="text-stone-400">→</span>
            <span
              className={`px-3 py-1 rounded-full transition-colors ${
                step === 3
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              3. Role
            </span>
          </div>
        </div>
      </div>
    </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1: LANGUAGE & THEME SELECTION */}
          {/* ========================================================================= */}
          {step === 1 && (
            <motion.div
              key="step1"
              id="guide-language-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t('onboarding.step1') || 'Step 1: Personalize Your Experience'}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-stone-900 dark:text-white tracking-tight">
                  {t('onboarding.chooseLanguage') || 'Choose Language & Theme'}
                </h1>
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                  {t('onboarding.chooseLanguageSub') || 'Select your preferred regional language and visual style. You can change these anytime in the settings.'}
                </p>
              </div>

              {/* Language Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
                {SUPPORTED_LANGUAGES.map((lang, langIdx) => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <motion.button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: langIdx * 0.06, ease: [0.4, 0, 0.2, 1] }}
                      whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.97 }}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-colors relative overflow-hidden flex flex-col justify-between cursor-pointer min-h-[100px] ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-lg ring-2 ring-emerald-500/30'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                          {lang.native}
                        </span>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                              className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">
                          {lang.label}
                        </div>
                        <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                          {lang.greeting}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Theme Toggle Section */}
              <div className="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-stone-900 dark:text-white block">
                    Visual Display Theme
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Default is clean, bright Light Mode
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      !isDarkMode
                        ? 'bg-white text-emerald-800 shadow-sm ring-1 ring-stone-200'
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isDarkMode
                        ? 'bg-stone-900 text-white shadow-sm ring-1 ring-stone-700'
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleLanguageStepSubmit}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{t('onboarding.continueLocation') || 'Continue to Location Verification'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* 3D Farm-to-Market Pipeline Hero Visualization */}
              <FarmToMarket3DHero />
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: ROBUST LOCATION SYSTEM WITH MULTIPLE FALLBACK METHODS */}
          {/* ========================================================================= */}
          {step === 2 && (
            <motion.div
              key="step2"
              id="guide-location-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Compass className="w-3.5 h-3.5 text-amber-500" /> Step 2: Location Verification
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-outfit text-stone-900 dark:text-white">
                  Detecting Your Location
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  We use India-wide spatial coordinates to connect you with your closest mandis and nearby verified buyers.
                </p>
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* SUB-STATE 1: BEFORE ASKING FOR PERMISSION (EXPLAIN WHY CLEARLY) */}
              {/* --------------------------------------------------------------------- */}
              {locationStepMode === 'explain' && (
                <div className="max-w-2xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-10 border-2 border-emerald-500/40 shadow-2xl space-y-6 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center text-4xl shadow-md border border-emerald-300 dark:border-emerald-800">
                    📍
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-outfit">
                      📍 Let's Find Your Location
                    </h3>
                    <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-lg mx-auto leading-relaxed">
                      We use your location to find the best nearby markets and farmers.
                    </p>
                  </div>

                  {/* Benefit highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto pt-2">
                    <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
                      <strong className="block text-stone-900 dark:text-white font-bold mb-1">
                        ⚡ Nearest Mandis
                      </strong>
                      <span className="text-stone-500 dark:text-stone-400">
                        Live prices across closest agricultural markets
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
                      <strong className="block text-stone-900 dark:text-white font-bold mb-1">
                        🚚 Diesel Freight
                      </strong>
                      <span className="text-stone-500 dark:text-stone-400">
                        Accurate transport cost calculation per quintal
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
                      <strong className="block text-stone-900 dark:text-white font-bold mb-1">
                        🤝 Verified Buyers
                      </strong>
                      <span className="text-stone-500 dark:text-stone-400">
                        Match with buyers in your district and state
                      </span>
                    </div>
                  </div>

                  {/* Primary & Fallback Buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={requestBrowserGeolocation}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-xl shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MapPin className="w-5 h-5 text-amber-300" />
                      <span>📍 Detect My Location</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLocationStepMode('manual_search')}
                      className="w-full sm:w-auto px-6 py-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-stone-700 dark:text-stone-200 font-bold text-sm transition-all hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-stone-500" />
                      <span>Search Manually</span>
                    </button>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------------------- */}
              {/* SUB-STATE 2: REQUESTING BROWSER GEOLOCATION WITH 4-STEP ANIMATION */}
              {/* --------------------------------------------------------------------- */}
              {locationStepMode === 'requesting' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-10 border-2 border-emerald-500/50 shadow-2xl text-center space-y-6">
                  {/* Radar Signal Wave Indicator */}
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-25 animate-ping" />
                    <span className="absolute inset-3 rounded-full bg-emerald-400 opacity-20 animate-pulse" />
                    <div className="relative w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-emerald-900/30">
                      <Compass className="w-8 h-8 animate-spin" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-stone-900 dark:text-white font-outfit">
                      Detecting Your Coordinates
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                      Please allow browser GPS permission if prompted
                    </p>
                  </div>

                  {/* 4-Step Sequential Progress HUD */}
                  <div className="space-y-2.5 max-w-md mx-auto text-left">
                    <div
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                        gpsPhase >= 1
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📡</span>
                        <span>Step 1: Connecting to GPS...</span>
                      </div>
                      {gpsPhase >= 1 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">
                          ✓ Signals Locked
                        </span>
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                        gpsPhase >= 2
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📍</span>
                        <span>Step 2: Finding your location...</span>
                      </div>
                      {gpsPhase >= 2 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                          {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
                        </span>
                      ) : (
                        <span>Pending</span>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                        gpsPhase >= 3
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🗺️</span>
                        <span>Step 3: Loading your region...</span>
                      </div>
                      {gpsPhase >= 3 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">
                          ✓ India Region Ready
                        </span>
                      ) : (
                        <span>Pending</span>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                        gpsPhase >= 4
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                          : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📌</span>
                        <span>Step 4: Finding nearby agricultural markets...</span>
                      </div>
                      {gpsPhase >= 4 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">
                          ✓ Mandis Found
                        </span>
                      ) : (
                        <span>Pending</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setLocationStepMode('manual_search')}
                      className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
                    >
                      Taking too long? Search location manually instead →
                    </button>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------------------- */}
              {/* SUB-STATE 3: GEOLOCATION ERROR STATES (STRICT REQUIREMENTS) */}
              {/* --------------------------------------------------------------------- */}
              {locationStepMode === 'error' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-amber-500/40 shadow-xl text-center space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center text-2xl shadow-sm">
                    <AlertCircle className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-outfit">
                      {geoErrorCode === 1
                        ? 'Location Permission Denied'
                        : geoErrorCode === 2
                        ? 'Location Unavailable'
                        : geoErrorCode === 3
                        ? 'Detection Timed Out'
                        : 'Location Unsupported'}
                    </h3>

                    <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                      {geoErrorCode === 1 && (
                        <>Location permission was denied. You can search for your location manually.</>
                      )}
                      {geoErrorCode === 2 && (
                        <>We couldn't get your current location. Please try again or search manually.</>
                      )}
                      {geoErrorCode === 3 && (
                        <>Location detection is taking longer than expected.</>
                      )}
                      {geoErrorCode === 0 && (
                        <>Your browser does not support automatic location detection.</>
                      )}
                    </p>
                  </div>

                  {/* Specific Action Buttons per error code */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {(geoErrorCode === 2 || geoErrorCode === 3) && (
                      <button
                        type="button"
                        onClick={requestBrowserGeolocation}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Try Again</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setLocationStepMode('manual_search')}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>
                        {geoErrorCode === 3 ? 'Enter Location' : 'Search Location Manually'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLocationStepMode('map_preview')}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-stone-700 dark:text-stone-300 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>Select on Map</span>
                    </button>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------------------- */}
              {/* SUB-STATE 4: MANUAL SEARCH DRAWER / MODAL */}
              {/* --------------------------------------------------------------------- */}
              {locationStepMode === 'manual_search' && (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-2xl space-y-5 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-stone-900 dark:text-white text-lg sm:text-xl font-outfit flex items-center gap-2">
                        <Search className="w-5 h-5 text-emerald-600" />
                        Search Location Manually
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Search any village, town, city, district, or PIN code in India
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLocationStepMode('map_preview')}
                      className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Back to Map</span>
                    </button>
                  </div>

                  {/* Autocomplete Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Type your village, taluka, city or district (e.g. Bhimavaram, Kadapa, Nashik)..."
                      className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm shadow-inner"
                      autoFocus
                    />
                    <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-4" />
                    {isSearching && (
                      <Loader2 className="w-4 h-4 text-emerald-600 animate-spin absolute right-3.5 top-4" />
                    )}
                  </div>

                  {/* Autocomplete Results */}
                  {searchResults.length > 0 && (
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pt-1 rounded-2xl border border-stone-200 dark:border-stone-800 p-2 bg-stone-50 dark:bg-stone-800/60">
                      {searchResults.map((res, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectSearchResult(res)}
                          className="p-3 rounded-xl hover:bg-emerald-100/70 dark:hover:bg-emerald-950/60 text-xs font-semibold text-stone-800 dark:text-stone-200 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-emerald-400"
                        >
                          <div>
                            <span className="font-bold text-stone-900 dark:text-white text-sm">
                              {res.name}
                            </span>
                            <span className="text-stone-500 dark:text-stone-400 ml-1">
                              • {res.district} District, {res.state}
                            </span>
                          </div>
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold shrink-0">
                            Select & Map →
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Popular Agricultural Centers Preset Buttons */}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Or Quick Select Major Agricultural Hubs:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleSelectSearchResult(p)}
                          className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer transition-colors border border-stone-200 dark:border-stone-700 hover:border-emerald-400"
                        >
                          📍 {p.name}, {p.state}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------------------- */}
              {/* SUB-STATE 5: INDIA MAP EXPERIENCE WITH CAMERA ZOOM & CONFIRMATION */}
              {/* --------------------------------------------------------------------- */}
              {locationStepMode === 'map_preview' && (
                <div className="space-y-4">
                  <IndiaMapZoomExperience
                    location={location}
                    onConfirm={handleLocationConfirmed}
                    onChangeLocationClick={() => setLocationStepMode('manual_search')}
                    onSelectCoordinates={handleCoordinateSelect}
                    isDetecting={false}
                    onRetryGps={requestBrowserGeolocation}
                  />
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
                >
                  ← Back to Language & Theme Selection
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: USER ROLE SELECTION (FARMER VS BUYER) */}
          {/* ========================================================================= */}
          {step === 3 && (
            <motion.div
              key="step3"
              id="guide-role-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> {t('onboarding.step3') || 'Step 3: Select Your Role'}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-stone-900 dark:text-white">
                  {t('onboarding.roleTitle') || 'How Will You Use AgriConnect?'}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {t('onboarding.roleSubtitle') || 'Select your role to access dedicated dashboards, tailored pricing, and direct market linkage.'}
                </p>
              </div>

              {/* Two Distinct Role Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto perspective-1000">
                {/* 1. FARMER CARD */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-emerald-500/50 hover:border-emerald-500 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between space-y-6 relative overflow-hidden group card-3d preserve-3d">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-3xl shadow-md">
                        🌾
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        {t('onboarding.forProducers') || 'For Crop Producers'}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black font-outfit text-stone-900 dark:text-white">
                      {t('onboarding.farmerTitle') || 'Farmer'}
                    </h3>

                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                      {t('onboarding.farmerTagline') || 'Sell your crops, check quality with certified AI vision lens, discover highest-paying mandis, and connect directly with verified buyers.'}
                    </p>

                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 font-semibold pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        {t('onboarding.farmerFeature1') || 'AI Quality Grading (Grade A, B, C)'}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        {t('onboarding.farmerFeature2') || 'Smart Mandi Profit Calculator with Diesel Freight'}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        {t('onboarding.farmerFeature3') || 'Direct Buyer Inquiries & WhatsApp Bids'}
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('farmer')}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-emerald-600/50"
                  >
                    <span>{t('onboarding.enterFarmer') || 'Continue as Farmer'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* 2. BUYER CARD */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-amber-500/50 hover:border-amber-500 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between space-y-6 relative overflow-hidden group card-3d preserve-3d">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-3xl shadow-md">
                        🏢
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                        {t('onboarding.forBuyers') || 'For Institutional Buyers'}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black font-outfit text-stone-900 dark:text-white">
                      {t('onboarding.buyerTitle') || 'Buyer'}
                    </h3>

                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                      {t('onboarding.buyerTagline') || 'Discover available crops from nearby farmers, compare AI-inspected quality and prices, and contact farmers directly for institutional procurement.'}
                    </p>

                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 font-semibold pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        {t('onboarding.buyerFeature1') || 'Explore verified farmer crop lots on Map & List'}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        {t('onboarding.buyerFeature2') || 'Filter by Grade (A/B/C), Distance, and Volume'}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        {t('onboarding.buyerFeature3') || 'One-click "I\'m Interested" alerts sent to farmers'}
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('buyer')}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-base shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-amber-500/50"
                  >
                    <span>{t('onboarding.enterBuyer') || 'Continue as Buyer'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
                >
                  {t('onboarding.backToLocation') || '← Back to Location Confirmation'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-4 px-6 text-center text-xs text-stone-500 dark:text-stone-400">
        AgriConnect Platform • Built with Google Maps Platform and Direct Farm-to-Buyer Linkage
      </footer>
    </div>
  );
};
