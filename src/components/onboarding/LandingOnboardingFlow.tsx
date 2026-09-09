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
  ChevronRight,
  Compass,
  Building2,
  Package,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Loader2,
  Layers,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { Language, LocationData } from '../../types/krishi';
import { reverseGeocodeLocation, forwardGeocodeAddress } from '../../services/googleMapsService';
import { IndiaMapZoomExperience } from './IndiaMapZoomExperience';
import { MASTER_LOCATIONS, queryLocations } from '../../data/indiaWideLocations';

interface LanguageOption {
  code: Language;
  label: string;
  native: string;
  greeting: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English', greeting: 'Welcome to KrishiSetu' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', greeting: 'కృషిసేతుకి స్వాగతం' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', greeting: 'कृषिसेतु में आपका स्वागत है' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', greeting: 'कृषीसेतू मध्ये आपले स्वागत आहे' },
];

const POPULAR_SEARCH_PRESETS = [
  { name: 'Bhimavaram', district: 'West Godavari', state: 'Andhra Pradesh', lat: 16.5449, lng: 81.5212 },
  { name: 'Kadapa', district: 'YSR Kadapa', state: 'Andhra Pradesh', lat: 14.4673, lng: 78.8242 },
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

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    return (localStorage.getItem('krishi_language') as Language) || 'en';
  });

  // Theme state: Default is Light Theme as requested
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('krishi_theme');
    if (saved === 'dark') return true;
    return false; // Default setting: Light Theme
  });

  // Location state (Defaults to Bhimavaram, Andhra Pradesh as primary demonstration)
  const [location, setLocation] = useState<LocationData>({
    latitude: 16.5449,
    longitude: 81.5212,
    country: 'India',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    city: 'Bhimavaram',
    town: 'Bhimavaram',
    formattedAddress: 'Bhimavaram, West Godavari District, Andhra Pradesh, India',
    source: 'gps',
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [detectionSuccess, setDetectionSuccess] = useState<boolean>(true);
  const [showManualSearch, setShowManualSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Apply Theme to documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('krishi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('krishi_theme', 'light');
    }
  }, [isDarkMode]);

  // Save language
  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    localStorage.setItem('krishi_language', lang);
  };

  // Attempt real browser geolocation
  const detectBrowserLocation = () => {
    setIsDetectingLocation(true);
    setDetectionSuccess(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const locData = await reverseGeocodeLocation(lat, lng);
            setLocation(locData);
            setDetectionSuccess(true);
          } catch {
            // Fallback gracefully
            setLocation((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              formattedAddress: `Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}, India`,
            }));
            setDetectionSuccess(true);
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          console.warn('Geolocation denied or unavailable, using state center:', error);
          setIsDetectingLocation(false);
          // Still provide clean default location
          setDetectionSuccess(true);
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      setIsDetectingLocation(false);
      setDetectionSuccess(true);
    }
  };

  // Step transitions
  const handleLanguageStepSubmit = () => {
    setStep(2);
    // Automatically attempt detection on entering Step 2
    detectBrowserLocation();
  };

  const handleLocationConfirmed = () => {
    // Save chosen location
    localStorage.setItem('krishi_location', JSON.stringify(location));
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

  // Location search query
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const localMatches = queryLocations(query).slice(0, 5);
    setSearchResults(localMatches);
  };

  const handleSelectSearchResult = (res: any) => {
    const newLoc: LocationData = {
      latitude: res.lat || res.latitude,
      longitude: res.lng || res.longitude,
      country: 'India',
      state: res.state,
      district: res.district,
      city: res.name || res.city,
      town: res.name || res.city,
      formattedAddress: `${res.name || res.city}, ${res.district} District, ${res.state}, India`,
      source: 'search',
    };
    setLocation(newLoc);
    setShowManualSearch(false);
    setSearchQuery('');
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
                Krishi<span className="text-emerald-600 dark:text-emerald-400">Setu</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold text-amber-800 dark:text-amber-300 ml-2 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800">
                Farmer & Buyer Linkage
              </span>
            </div>
          </div>

          {/* Step Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span
              className={`px-3 py-1 rounded-full ${
                step === 1
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              1. Language & Theme
            </span>
            <span className="text-stone-400">→</span>
            <span
              className={`px-3 py-1 rounded-full ${
                step === 2
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              2. Location
            </span>
            <span className="text-stone-400">→</span>
            <span
              className={`px-3 py-1 rounded-full ${
                step === 3
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              3. Role
            </span>
          </div>
        </div>
      </header>

      {/* Main Flow Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1: LANGUAGE & THEME SELECTION */}
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
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Welcome to KrishiSetu
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight text-stone-900 dark:text-white">
                  Choose Your Language
                </h1>
                <p className="text-lg sm:text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                  మీ భాషను ఎంచుకోండి / अपनी भाषा चुनें
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Select your preferred language and display theme to begin your direct agricultural trade journey.
                </p>
              </div>

              {/* Language Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      <div>
                        <span className="text-2xl font-black block font-outfit text-stone-900 dark:text-white">
                          {lang.native}
                        </span>
                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                          {lang.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-3 block">
                        {lang.greeting}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Theme Options Card (Starts in Light by default) */}
              <div className="max-w-md mx-auto bg-white dark:bg-stone-900 rounded-3xl p-5 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Display Appearance / థీమ్
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDarkMode(false)}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                      !isDarkMode
                        ? 'bg-amber-50 border-amber-500 text-stone-900 shadow-sm ring-2 ring-amber-400/30'
                        : 'border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>☀️ Light Theme</span>
                    {!isDarkMode && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDarkMode(true)}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                      isDarkMode
                        ? 'bg-stone-800 border-emerald-500 text-white shadow-sm ring-2 ring-emerald-400/30'
                        : 'border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>🌙 Dark Theme</span>
                    {isDarkMode && <Check className="w-4 h-4 text-emerald-400" />}
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
                  <span>Continue to Location Detection</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: LOCATION DETECTION WITH INDIA MAP ZOOM ANIMATION */}
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
                  <Compass className="w-3.5 h-3.5 text-amber-500" /> Step 2: Location Verification
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-outfit text-stone-900 dark:text-white">
                  Detecting Your Location
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  We use India-wide spatial coordinates to connect you with your closest mandis and nearby verified buyers.
                </p>
              </div>

              {/* Manual Search Modal / Drawer */}
              {showManualSearch && (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border-2 border-emerald-500 shadow-xl space-y-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 dark:text-white text-base flex items-center gap-2">
                      <Search className="w-4 h-4 text-emerald-600" />
                      Search City, Village, or District in India
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowManualSearch(false)}
                      className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold cursor-pointer"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="e.g. Bhimavaram, Kadapa, Nashik, Guntur..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      autoFocus
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1">
                      {searchResults.map((res, i) => (
                        <div
                          key={i}
                          onClick={() => handleSelectSearchResult(res)}
                          className="p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-stone-800 dark:text-stone-200 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-emerald-300"
                        >
                          <div>
                            <span className="font-bold">{res.name}</span>, {res.district} District ({res.state})
                          </div>
                          <span className="text-emerald-600 font-mono text-[10px]">Select →</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Preset Locations */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                    <span className="text-[11px] font-bold text-stone-400 uppercase block mb-2">
                      Popular Agricultural Centers:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleSelectSearchResult(p)}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer transition-colors"
                        >
                          📍 {p.name}, {p.state}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Map Zoom Experience Component */}
              <IndiaMapZoomExperience
                location={location}
                onConfirm={handleLocationConfirmed}
                onChangeLocationClick={() => setShowManualSearch(true)}
                isDetecting={isDetectingLocation}
              />

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
                >
                  ← Back to Language Selection
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Step 3: Select Your Role
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-stone-900 dark:text-white">
                  How Will You Use KrishiSetu?
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Select your role to access dedicated dashboards, tailored pricing, and direct market linkage.
                </p>
              </div>

              {/* Two Distinct Role Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* 1. FARMER CARD */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-emerald-500/50 hover:border-emerald-500 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-3xl shadow-md">
                        🌾
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        For Crop Producers
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black font-outfit text-stone-900 dark:text-white">
                      I AM A FARMER
                    </h3>

                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                      Sell your crops, check quality with certified AI vision lens, discover highest-paying mandis, and connect directly with verified buyers.
                    </p>

                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 font-semibold pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        AI Quality Grading (Grade A, B, C)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Smart Mandi Profit Calculator with Diesel Freight
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Direct Buyer Inquiries & WhatsApp Bids
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('farmer')}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-emerald-600/50"
                  >
                    <span>Continue as Farmer</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* 2. BUYER CARD */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border-2 border-amber-500/50 hover:border-amber-500 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-3xl shadow-md">
                        🏢
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                        For Institutional Buyers
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black font-outfit text-stone-900 dark:text-white">
                      I AM A BUYER
                    </h3>

                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                      Discover available crops from nearby farmers, compare AI-inspected quality and prices, and contact farmers directly for institutional procurement.
                    </p>

                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 font-semibold pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        Explore verified farmer crop lots on Map & List
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        Filter by Grade (A/B/C), Distance, and Volume
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        One-click "I'm Interested" alerts sent to farmers
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('buyer')}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-base shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-amber-500/50"
                  >
                    <span>Continue as Buyer</span>
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
                  ← Back to Location Confirmation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-4 px-6 text-center text-xs text-stone-500 dark:text-stone-400">
        KrishiSetu Platform • Built with Google Maps Platform and Gemini Vision Assayer • Direct Farm-to-Buyer Linkage
      </footer>
    </div>
  );
};
