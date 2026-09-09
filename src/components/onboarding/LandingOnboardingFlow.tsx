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
  CheckCircle2,
  Lock,
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
  { name: 'Tirupati', district: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
  { name: 'Vijayawada', district: 'NTR', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  { name: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
  { name: 'Kurnool', district: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373 },
  { name: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Warangal', district: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },
  { name: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Nashik', district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
];

export const LandingOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage, languages } = useTranslation();
  const { isDarkMode, setTheme } = useTheme();
  const { currentUser, isGuest, openAuthModal, logout } = useAuth();

  // Location status mode: 'requesting' | 'detected' | 'error'
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'detected' | 'error'>('requesting');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
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

  // Auto-request browser geolocation immediately upon website open as mandated by master prompt
  useEffect(() => {
    requestBrowserGeolocation();
  }, []);

  const requestBrowserGeolocation = () => {
    setLocationStatus('requesting');
    setGpsPhase(1);

    const timer2 = setTimeout(() => setGpsPhase(2), 900);
    const timer3 = setTimeout(() => setGpsPhase(3), 1800);

    if (!navigator.geolocation) {
      clearTimeout(timer2);
      clearTimeout(timer3);
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const locData = await reverseGeocodeLocation(lat, lng);
          setTimeout(() => {
            setLocation(locData);
            localStorage.setItem('krishi_location', JSON.stringify(locData));
            window.dispatchEvent(new CustomEvent('krishi_location_changed', { detail: locData }));
            setLocationStatus('detected');
          }, 2400);
        } catch (err) {
          console.warn('Reverse geocode error, using precise coordinates:', err);
          setTimeout(() => {
            const fallbackLoc: LocationData = {
              latitude: lat,
              longitude: lng,
              country: 'India',
              state: 'Andhra Pradesh',
              district: 'YSR Kadapa',
              city: 'Kadapa',
              formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, India`,
              source: 'gps',
            };
            setLocation(fallbackLoc);
            localStorage.setItem('krishi_location', JSON.stringify(fallbackLoc));
            window.dispatchEvent(new CustomEvent('krishi_location_changed', { detail: fallbackLoc }));
            setLocationStatus('detected');
          }, 2400);
        }
      },
      (error) => {
        clearTimeout(timer2);
        clearTimeout(timer3);
        console.warn(`Geolocation error code: ${error.code} - ${error.message}`);
        // If denied, set status to error so user gets manual search prompt
        setLocationStatus('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCoordinateSelect = async (lat: number, lng: number) => {
    try {
      const locData = await reverseGeocodeLocation(lat, lng);
      setLocation(locData);
      localStorage.setItem('krishi_location', JSON.stringify(locData));
      window.dispatchEvent(new CustomEvent('krishi_location_changed', { detail: locData }));
    } catch {
      const newLoc: LocationData = {
        ...location,
        latitude: lat,
        longitude: lng,
        formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, India`,
      };
      setLocation(newLoc);
      localStorage.setItem('krishi_location', JSON.stringify(newLoc));
      window.dispatchEvent(new CustomEvent('krishi_location_changed', { detail: newLoc }));
    }
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
    } catch {
      // fallback to local matches
    }

    const localMatches = queryLocations(query, 8).map((l) => ({
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

  const handleSelectLocation = (res: any) => {
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
    localStorage.setItem('krishi_location', JSON.stringify(newLoc));
    window.dispatchEvent(new CustomEvent('krishi_location_changed', { detail: newLoc }));
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
    setLocationStatus('detected');
  };

  const handleRoleClick = (role: 'farmer' | 'buyer') => {
    localStorage.setItem('krishi_user_role', role);
    localStorage.setItem('krishi_location', JSON.stringify(location));

    if (currentUser && currentUser.role === role) {
      navigate(role === 'farmer' ? '/farmer' : '/buyers');
    } else if (isGuest) {
      navigate(role === 'farmer' ? '/farmer' : '/buyers');
    } else {
      openAuthModal(role, role === 'farmer' ? '/farmer' : '/buyers');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Navbar */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-900 dark:text-white">
                  {t('app.name', 'Kisan Setu')}
                </span>
                <span className="hidden md:inline-block text-[10px] font-bold text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800">
                  SIH 2026
                </span>
              </div>
              <span className="hidden sm:block text-xs font-semibold text-stone-500 dark:text-stone-400">
                {t('app.tagline', 'Connecting Farmers to Better Markets and Better Buyers')}
              </span>
            </div>
          </div>

          {/* Right Controls: Languages + Theme + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector: English, Telugu, Marathi */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    language === lang.code
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title={lang.name}
                >
                  <span className="mr-1">{lang.flag}</span>
                  <span>{lang.native}</span>
                </button>
              ))}
            </div>

            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {currentUser.role === 'farmer' ? '🌾 ' : currentUser.role === 'buyer' ? '🛒 ' : '🛡️ '}
                  {currentUser.name}
                </span>
                <button
                  onClick={logout}
                  className="text-xs text-stone-500 hover:text-red-600 dark:hover:text-red-400 px-2 py-1 font-semibold cursor-pointer"
                >
                  {t('nav.logout', 'Sign Out')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('farmer')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                {t('nav.login', 'Sign In')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Dynamic Location Bar & Detection Status */}
        <section className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-sm transition-all">
          {locationStatus === 'requesting' ? (
            /* 3-Phase Radar Geolocation Loading Indicator */
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-600 animate-spin" />
                  <span className="text-base">📍</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    {gpsPhase === 1 && t('onboarding.detectingGps', '📍 Detecting your location...')}
                    {gpsPhase === 2 && t('onboarding.connectingServices', '🛰️ Connecting to location services...')}
                    {gpsPhase === 3 && t('onboarding.findingMarkets', '🗺️ Finding nearby agricultural markets...')}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Pinpointing coordinates to automatically rank authentic APMC mandis.
                  </p>
                </div>
              </div>

              {/* Instant Manual Search Fallback during detection */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t('enterCityManually', 'Enter city manually')}</span>
              </button>
            </div>
          ) : locationStatus === 'error' ? (
            /* Location Denied / Fallback Prompt */
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      {t('couldNotDetect', "📍 We couldn't detect your location.")}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Select or search your district to discover accurate nearby APMC mandis and prices:
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={requestBrowserGeolocation}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t('onboarding.retryGps', 'Retry GPS')}</span>
                </button>
              </div>

              {/* Quick Preset City Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[11px] font-bold text-stone-400">Popular:</span>
                {POPULAR_SEARCH_PRESETS.slice(0, 6).map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => handleSelectLocation(city)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 cursor-pointer"
                  >
                    📍 {city.name}, {city.state}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  + Search Other
                </button>
              </div>
            </div>
          ) : (
            /* Location Confirmed Banner */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {t('yourLocation', 'Your Location')}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      ({location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E)
                    </span>
                  </div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white">
                    {location.city || location.district}, {location.state}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t('changeLocation', 'Change Location')}</span>
                </button>

                <button
                  type="button"
                  onClick={requestBrowserGeolocation}
                  className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-emerald-600 cursor-pointer"
                  title="Refresh GPS"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Search Location Modal / Expandable Box */}
          {isSearchOpen && (
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {t('onboarding.searchLocation', 'Search location or Indian city...')}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="e.g. Kadapa, Tirupati, Vijayawada, Hyderabad, Mumbai, Nashik..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                {isSearching && (
                  <Loader2 className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 animate-spin" />
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-1 p-1 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(res)}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950 flex items-center justify-between text-xs text-stone-800 dark:text-stone-200 cursor-pointer"
                    >
                      <div>
                        <span className="font-bold">{res.name}</span>
                        <span className="text-stone-500 ml-1.5">• {res.district} District, {res.state}</span>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Select →</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {POPULAR_SEARCH_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectLocation(p)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-[11px] font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 cursor-pointer"
                  >
                    📍 {p.name}, {p.state}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Cinematic India Map Section with Pin Drop & Authentic Mandi Radius */}
        <section className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
          <IndiaMapZoomExperience
            location={location}
            onConfirm={() => {}}
            onChangeLocationClick={() => setIsSearchOpen(true)}
            onSelectCoordinates={handleCoordinateSelect}
            isDetecting={locationStatus === 'requesting'}
            onRetryGps={requestBrowserGeolocation}
          />
        </section>

        {/* Clear Role Separation: 🌾 I AM A FARMER vs 🛒 I AM A BUYER */}
        <section className="space-y-4 pt-2">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t('onboarding.howToUse', 'How would you like to use the platform?')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              Select Your Marketplace Portal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* FARMER CARD */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 hover:border-emerald-500 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-3xl shadow-xs">
                    🌾
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    {t('nav.farmer', 'Farmer Portal')}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                    {t('iAmFarmer', 'I AM A FARMER')}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium mt-1">
                    {t('farmerDesc', 'Sell your crops and find the best prices.')}
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300 font-semibold pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Upload crop photos & specify quantity in KG, Quintals, or Tons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Discover top nearby mandis sorted by distance with price realization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Receive and compare buyer bids with instant contact unlock</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleRoleClick('farmer')}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-emerald-500/20"
              >
                <span>Enter Farmer Portal</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* BUYER CARD */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-blue-500/40 hover:border-blue-500 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-3xl shadow-xs">
                    🛒
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                    {t('nav.buyer', 'Buyer Marketplace')}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                    {t('iAmBuyer', 'I AM A BUYER')}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium mt-1">
                    {t('buyerDesc', 'Discover crops directly from farmers.')}
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300 font-semibold pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Browse fresh verified farmer harvests with quality grades & harvest dates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Filter by distance, crop type, quantity, and minimum price</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Place direct competitive bids and negotiate with verified producers</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleRoleClick('buyer')}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-blue-500/20"
              >
                <span>Browse Buyer Marketplace</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        {/* Subtle Minimal Admin Access at Bottom */}
        <footer className="pt-8 pb-4 text-center">
          <button
            type="button"
            onClick={() => openAuthModal('admin', '/admin')}
            className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>•</span>
            <span>Admin Access</span>
            <span className="text-[10px] text-stone-400">(demo: admin / admin@123)</span>
          </button>
        </footer>
      </main>
    </div>
  );
};
