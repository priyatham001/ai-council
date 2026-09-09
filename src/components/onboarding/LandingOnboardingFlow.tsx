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
  User,
  KeyRound,
} from 'lucide-react';
import { LocationData } from '../../types/krishi';
import { reverseGeocodeLocation } from '../../services/googleMapsService';
import { IndiaMapZoomExperience } from './IndiaMapZoomExperience';
import { queryLocations } from '../../data/indiaWideLocations';
import { useTranslation, Language } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const POPULAR_SEARCH_PRESETS = [
  { name: 'Kadapa', district: 'YSR Kadapa', state: 'Andhra Pradesh', lat: 14.4673, lng: 78.8242 },
  { name: 'Proddatur', district: 'YSR Kadapa', state: 'Andhra Pradesh', lat: 14.7527, lng: 78.5524 },
  { name: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
  { name: 'Kurnool', district: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373 },
  { name: 'Tirupati', district: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
  { name: 'Warangal', district: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },
  { name: 'Nizamabad', district: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941 },
  { name: 'Nashik', district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Kolar', district: 'Kolar', state: 'Karnataka', lat: 13.1367, lng: 78.1292 },
];

export const LandingOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage, languages } = useTranslation();
  const { theme, isDarkMode, setTheme } = useTheme();
  const { currentUser, openAuthModal } = useAuth();

  // Onboarding Step: 1 = Language & Theme, 2 = Location Detection, 3 = Role Selection
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Location State Machine for Step 2
  // 'explain' -> 'requesting' -> ('map_preview' | 'error' | 'manual_search')
  const [locationStepMode, setLocationStepMode] = useState<
    'explain' | 'requesting' | 'error' | 'map_preview' | 'manual_search'
  >('explain');

  const [geoErrorCode, setGeoErrorCode] = useState<number | null>(null);
  const [gpsPhase, setGpsPhase] = useState<1 | 2 | 3>(1);

  // Location state: load from localStorage if previously set, default to Kadapa, Andhra Pradesh
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

  // Trigger Browser Geolocation with 3-phase loading animation
  const requestBrowserGeolocation = () => {
    setLocationStepMode('requesting');
    setGeoErrorCode(null);
    setGpsPhase(1);

    // Progression timers for 3-step animation requested by user:
    // 1. 📍 Detecting your location...
    // 2. 🛰️ Connecting to location services...
    // 3. 🗺️ Finding nearby agricultural markets...
    const timer2 = setTimeout(() => setGpsPhase(2), 1000);
    const timer3 = setTimeout(() => setGpsPhase(3), 2000);

    if (!navigator.geolocation) {
      clearTimeout(timer2);
      clearTimeout(timer3);
      setGeoErrorCode(0);
      setLocationStepMode('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

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
          }, 2800);
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
          }, 2800);
        }
      },
      (error) => {
        clearTimeout(timer2);
        clearTimeout(timer3);
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

  const handleLocationConfirmed = () => {
    localStorage.setItem('krishi_location', JSON.stringify(location));
    window.dispatchEvent(
      new CustomEvent('krishi_location_changed', {
        detail: location,
      })
    );
    setStep(3);
  };

  const handleRoleSelect = (role: 'farmer' | 'buyer') => {
    localStorage.setItem('krishi_user_role', role);
    localStorage.setItem('krishi_onboarded', 'true');

    // Check if already authenticated with this role
    if (currentUser && currentUser.role === role) {
      if (role === 'farmer') {
        navigate('/farmer');
      } else {
        navigate('/buyers');
      }
    } else {
      // Require Phone OTP Login before granting access to dashboard
      openAuthModal(role, role === 'farmer' ? '/farmer' : '/buyers');
    }
  };

  const handleAdminAccess = () => {
    openAuthModal('admin', '/admin');
  };

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
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

    const localMatches = queryLocations(query, 10).map((l) => ({
      name: l.name,
      formattedAddress: `${l.name}, ${l.district} District, ${l.state}, India`,
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Brand Navigation Bar */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              🌾
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-900 dark:text-white">
                {t('app.name', 'KrishiSetu')}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold text-amber-800 dark:text-amber-300 ml-2 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800">
                {t('app.tagline', 'Direct Farmer & Buyer Marketplace')}
              </span>
            </div>
          </div>

          {/* Quick Theme Switcher & Step Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs font-bold">
              <span
                className={`px-3 py-1 rounded-full transition-colors ${
                  step === 1
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                1. {t('onboarding.selectLanguage', 'Language & Theme')}
              </span>
              <span className="text-stone-400">→</span>
              <span
                className={`px-3 py-1 rounded-full transition-colors ${
                  step === 2
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                2. {t('nav.markets', 'Location')}
              </span>
              <span className="text-stone-400">→</span>
              <span
                className={`px-3 py-1 rounded-full transition-colors ${
                  step === 3
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                3. {t('onboarding.howToUse', 'Role')}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1: EXACT 3 LANGUAGES (ENGLISH, TELUGU, MARATHI) & IMMEDIATE THEME */}
          {/* ========================================================================= */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t('onboarding.welcome', 'Welcome to KrishiSetu')}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
                  {t('onboarding.selectLanguage', 'Select Language')} & {t('onboarding.selectTheme', 'Theme')}
                </h1>
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                  {t('onboarding.subtitle', 'Fair crop prices, verified institutional buyers, and transparent mandi intelligence.')}
                </p>
              </div>

              {/* Exact 3 Languages Specified by Prompt */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {languages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code as Language)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-lg ring-2 ring-emerald-500/30'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl">{lang.flag}</span>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-2xl font-black text-stone-900 dark:text-white mb-1">
                          {lang.native}
                        </div>
                        <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                          {lang.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Theme Toggle Section */}
              <div className="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-stone-900 dark:text-white block">
                    {t('onboarding.selectTheme', 'Visual Theme')}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {isDarkMode ? t('onboarding.darkModeDesc', 'Low-strain dark mode') : t('onboarding.lightModeDesc', 'Natural daylight view')}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      !isDarkMode
                        ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-stone-200'
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>{t('onboarding.lightMode', 'Light Mode')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isDarkMode
                        ? 'bg-stone-900 text-white shadow-xs ring-1 ring-stone-700'
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>{t('onboarding.darkMode', 'Dark Mode')}</span>
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{t('onboarding.continueToLocation', 'Continue to Location Detection')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: LOCATION DETECTION & INDIA MAP WITH STRICT KADAPA INTEGRATION */}
          {/* ========================================================================= */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Compass className="w-3.5 h-3.5 text-amber-500" /> Step 2: Location Detection
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
                  {t('onboarding.findingLocation', 'Finding Your Location')}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Discover nearby mandis and calculate accurate net price realization for your region.
                </p>
              </div>

              {/* Mode: Explain & Trigger GPS */}
              {locationStepMode === 'explain' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-emerald-500/30 shadow-2xl space-y-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center text-3xl shadow-xs">
                    📍
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white">
                      Detect Nearby Mandis Automatically
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                      Allow location access to instantly zoom to your farm location and see real-time prices for mandis in your district.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={requestBrowserGeolocation}
                      className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Use My Current Location</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationStepMode('manual_search')}
                      className="px-6 py-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>{t('onboarding.enterManually', 'Enter City / District Manually')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mode: 3-Phase Geolocation Animation */}
              {locationStepMode === 'requesting' && (
                <div className="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-200 dark:border-emerald-950 border-t-emerald-600 animate-spin" />
                    <span className="text-3xl">📍</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {gpsPhase === 1 && t('onboarding.detectingGps', '📍 Detecting your location...')}
                      {gpsPhase === 2 && t('onboarding.connectingServices', '🛰️ Connecting to location services...')}
                      {gpsPhase === 3 && t('onboarding.findingMarkets', '🗺️ Finding nearby agricultural markets...')}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Pinpointing coordinates and querying verified APMC yards...
                    </p>
                  </div>

                  <div className="flex justify-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full transition-colors ${gpsPhase >= 1 ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'}`} />
                    <div className={`w-2.5 h-2.5 rounded-full transition-colors ${gpsPhase >= 2 ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'}`} />
                    <div className={`w-2.5 h-2.5 rounded-full transition-colors ${gpsPhase >= 3 ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'}`} />
                  </div>
                </div>
              )}

              {/* Mode: Permission Denied / Error */}
              {locationStepMode === 'error' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-8 border border-red-200 dark:border-red-900 shadow-xl space-y-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center text-2xl">
                    <AlertCircle className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                      {t('onboarding.permissionDenied', "We couldn't access your location. Please enter your location manually.")}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      Search any Indian city, town, or APMC hub to continue with full distance calculation.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => setLocationStepMode('manual_search')}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>{t('onboarding.searchLocation', 'Search City Manually')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={requestBrowserGeolocation}
                      className="px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{t('onboarding.retryGps', 'Retry GPS Detection')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mode: Manual Search */}
              {locationStepMode === 'manual_search' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <Search className="w-4 h-4 text-emerald-600" />
                      <span>{t('onboarding.searchLocation', 'Search location or Indian city...')}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setLocationStepMode('map_preview')}
                      className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="e.g. Kadapa, Proddatur, Guntur, Nashik..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    {isSearching && (
                      <Loader2 className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 animate-spin" />
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-1 max-h-56 overflow-y-auto p-1 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800">
                      {searchResults.map((res, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectSearchResult(res)}
                          className="p-3 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950 text-xs text-stone-800 dark:text-stone-200 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-stone-900 dark:text-white text-sm">
                              {res.name}
                            </span>
                            <span className="text-stone-500 ml-1">
                              • {res.district} District, {res.state}
                            </span>
                          </div>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            Select →
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      {t('onboarding.popularCities', 'Or select popular district:')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleSelectSearchResult(p)}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer border border-stone-200 dark:border-stone-700"
                        >
                          📍 {p.name}, {p.state}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode: India Map Experience with Camera Zoom & Nearest Markets */}
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
                  ← {t('common.back', 'Back to Language & Theme Selection')}
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: ROLE SELECTION & AUTHENTICATION ENFORCEMENT */}
          {/* ========================================================================= */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Step 3: Select Account Role
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white">
                  {t('onboarding.howToUse', 'How would you like to use the platform?')}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {t('onboarding.selectRoleDesc', 'Choose your account type to access tailored features and services.')}
                </p>
              </div>

              {/* Two Distinct Role Cards as Required by Prompt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* 1. FARMER CARD */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-emerald-500/50 hover:border-emerald-500 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between space-y-6 relative overflow-hidden group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-3xl shadow-xs">
                        🌾
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        {t('nav.farmer', 'Farmer Portal')}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                      {t('onboarding.iAmFarmer', 'I AM A FARMER')}
                    </h3>

                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                      {t(
                        'onboarding.farmerDesc',
                        'List your crops, discover nearby markets, and receive competitive offers directly from buyers.'
                      )}
                    </p>

                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 font-semibold pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Instant Crop Listing with photo uploads & KG/Quintal pricing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Best nearby mandis with distance & transport realization</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Compare buyer bids and unlock direct phone contacts</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('farmer')}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('onboarding.continueFarmer', 'Continue as Farmer')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* 2. BUYER CARD */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-blue-500/50 hover:border-blue-500 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between space-y-6 relative overflow-hidden group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-3xl shadow-xs">
                        🏢
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                        {t('nav.buyer', 'Buyer Marketplace')}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                      {t('onboarding.iAmBuyer', 'I AM A BUYER')}
                    </h3>

                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                      {t(
                        'onboarding.buyerDesc',
                        'Discover verified farmers, browse available crops, and place competitive bids.'
                      )}
                    </p>

                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 font-semibold pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-600" />
                        <span>Filter nearby crop lots by distance, volume, and crop variety</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-600" />
                        <span>Place direct bids with custom KG/Quintal pricing & terms</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-600" />
                        <span>Procure safely from verified regional farmgate producers</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('buyer')}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('onboarding.continueBuyer', 'Continue as Buyer')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Admin Access Link */}
              <div className="text-center pt-4 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleAdminAccess}
                  className="text-xs font-semibold text-stone-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{t('onboarding.adminAccess', 'Admin Console Login')} (Regulators & APMC Officials)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer mt-1"
                >
                  ← {t('common.back', 'Back to Location Confirmation')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-4 px-6 text-center text-xs text-stone-500 dark:text-stone-400">
        {t('app.name', 'KrishiSetu')} Platform • {t('app.nationalTagline', "India's Intelligent Agricultural Market-Linkage Platform")}
      </footer>
    </div>
  );
};
