import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  ArrowLeft,
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { FarmerLocation, Language } from '../../types';
import { getTranslation } from '../../lib/translations';
import {
  INDIAN_STATES_DISTRICTS,
  INDEXED_LOCATIONS,
  searchLocations,
  getCoordinatesForLocation,
  LocationOption
} from '../../lib/india-locations';

interface Page2FarmLocationProps {
  farmerName: string;
  setFarmerName: (name: string) => void;
  location: FarmerLocation;
  setLocation: (loc: FarmerLocation) => void;
  language: Language;
  onNext: () => void;
  onBack: () => void;
}

export const Page2FarmLocation: React.FC<Page2FarmLocationProps> = ({
  farmerName,
  setFarmerName,
  location,
  setLocation,
  language,
  onNext,
  onBack
}) => {
  const t = getTranslation(language);

  // Active sub-mode: 'gps' | 'search' | 'manual'
  const [mode, setMode] = useState<'gps' | 'search' | 'manual'>('gps');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationOption[]>([]);

  // Manual progressive selection state
  const availableStates = Object.keys(INDIAN_STATES_DISTRICTS);
  const [selectedState, setSelectedState] = useState(location.state || 'Andhra Pradesh');
  const availableDistricts = Object.keys(INDIAN_STATES_DISTRICTS[selectedState] || {});
  const [selectedDistrict, setSelectedDistrict] = useState(
    location.district && availableDistricts.includes(location.district)
      ? location.district
      : availableDistricts[0] || 'West Godavari'
  );
  const availableTowns =
    (INDIAN_STATES_DISTRICTS[selectedState] &&
      INDIAN_STATES_DISTRICTS[selectedState][selectedDistrict]) ||
    [];
  const [selectedTown, setSelectedTown] = useState(
    location.villageOrTown && availableTowns.includes(location.villageOrTown)
      ? location.villageOrTown
      : availableTowns[0] || 'Bhimavaram'
  );

  // Sync state dropdown
  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const districts = Object.keys(INDIAN_STATES_DISTRICTS[st] || {});
    const firstDist = districts[0] || '';
    setSelectedDistrict(firstDist);
    const towns =
      (INDIAN_STATES_DISTRICTS[st] && INDIAN_STATES_DISTRICTS[st][firstDist]) || [];
    const firstTown = towns[0] || '';
    setSelectedTown(firstTown);

    const coords = getCoordinatesForLocation(st, firstDist, firstTown);
    setLocation({
      country: 'India',
      state: st,
      district: firstDist,
      villageOrTown: firstTown || firstDist,
      lat: coords.lat,
      lng: coords.lng,
      isGps: false,
      isDemo: true,
      source: 'manual'
    });
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const towns =
      (INDIAN_STATES_DISTRICTS[selectedState] &&
        INDIAN_STATES_DISTRICTS[selectedState][dist]) ||
      [];
    const firstTown = towns[0] || '';
    setSelectedTown(firstTown);

    const coords = getCoordinatesForLocation(selectedState, dist, firstTown);
    setLocation({
      country: 'India',
      state: selectedState,
      district: dist,
      villageOrTown: firstTown || dist,
      lat: coords.lat,
      lng: coords.lng,
      isGps: false,
      isDemo: true,
      source: 'manual'
    });
  };

  const handleTownChange = (town: string) => {
    setSelectedTown(town);
    const coords = getCoordinatesForLocation(selectedState, selectedDistrict, town);
    setLocation({
      country: 'India',
      state: selectedState,
      district: selectedDistrict,
      villageOrTown: town,
      lat: coords.lat,
      lng: coords.lng,
      isGps: false,
      isDemo: true,
      source: 'manual'
    });
  };

  // Autocomplete search effect
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setSearchResults(searchLocations(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const selectSearchResult = (item: LocationOption) => {
    setLocation({
      country: item.country,
      state: item.state,
      district: item.district,
      villageOrTown: item.townOrCity,
      lat: item.lat,
      lng: item.lng,
      isGps: false,
      isDemo: true,
      source: 'search'
    });
    setSelectedState(item.state);
    setSelectedDistrict(item.district);
    setSelectedTown(item.townOrCity);
    setSearchQuery('');
    setGpsStatus({
      success: true,
      text: `${item.townOrCity}, ${item.district}`
    });
  };

  // GPS Request with pulse animation & gentle fallback
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus({
        success: false,
        text: "Couldn't detect your location."
      });
      setMode('manual');
      return;
    }

    setIsDetectingGps(true);
    setGpsStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let detectedState = 'Andhra Pradesh';
        let detectedDistrict = 'West Godavari';
        let detectedTown = 'Bhimavaram';

        // Reverse geocoding attempt (3.5s timeout)
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const a = data.address;
              detectedState = a.state || detectedState;
              detectedDistrict = a.state_district || a.county || a.district || detectedDistrict;
              detectedTown = a.village || a.town || a.suburb || a.city || detectedTown;
            }
          }
        } catch (e) {
          // Keep calibrated defaults if reverse geocoding is slow
        }

        setIsDetectingGps(false);
        setLocation({
          country: 'India',
          state: detectedState,
          district: detectedDistrict,
          villageOrTown: detectedTown,
          lat: latitude,
          lng: longitude,
          isGps: true,
          isDemo: false,
          source: 'gps'
        });
        setGpsStatus({
          success: true,
          text: `${detectedTown}, ${detectedDistrict}, ${detectedState}`
        });
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsStatus({
          success: false,
          text: "Couldn't detect your location."
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 p-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {language === 'te'
              ? 'భాష మార్పు'
              : language === 'hi'
              ? 'भाषा बदलें'
              : language === 'mr'
              ? 'भाषा बदला'
              : 'Back'}
          </span>
        </button>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {language === 'te'
            ? 'దశ 1 / 4 • పొలం వివరాలు'
            : language === 'hi'
            ? 'चरण 1 / 4 • खेत की जानकारी'
            : language === 'mr'
            ? 'टप्पा 1 / 4 • शेत माहिती'
            : 'Step 1 of 4 • Farm Details'}
        </span>
      </div>

      {/* Page Title */}
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {language === 'te'
            ? 'మీ పొలం ఎక్కడ ఉంది?'
            : language === 'hi'
            ? 'आपका खेत कहाँ है?'
            : language === 'mr'
            ? 'आपले शेत कोठे आहे?'
            : 'Tell Us About Your Farm'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'te'
            ? 'ఖచ్చితమైన రవాణా ఖర్చు మరియు సమీప మార్కెట్లను కనుగొనడానికి'
            : language === 'hi'
            ? 'सटीक मालभाड़ा व निकटतम मंडी खोजने के लिए'
            : language === 'mr'
            ? 'अचूक वाहतूक खर्च व जवळची बाजारपेठ शोधण्यासाठी'
            : 'To calculate accurate transport freight and nearby mandis'}
        </p>
      </div>

      {/* Integrated Location Visual: Farmer in field with pulsing location pin */}
      <div className="relative mb-5 bg-gradient-to-b from-amber-50/60 to-emerald-50/80 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between overflow-hidden">
        {/* Left: Animated/Stylized Scene */}
        <div className="relative w-36 h-24 select-none shrink-0" aria-hidden="true">
          <svg viewBox="0 0 160 100" className="w-full h-full">
            {/* Field contour */}
            <path d="M 0,60 Q 80,45 160,65 L 160,100 L 0,100 Z" fill="#86efac" opacity="0.6" />
            <path d="M 0,72 Q 70,60 160,75 L 160,100 L 0,100 Z" fill="#78350f" opacity="0.8" />
            {/* Furrows */}
            <line x1="0" y1="84" x2="160" y2="88" stroke="#381702" strokeWidth="2" opacity="0.5" />
            <line x1="0" y1="94" x2="160" y2="96" stroke="#381702" strokeWidth="2" opacity="0.5" />

            {/* Farmer figure */}
            <g transform="translate(45, 38)">
              <line x1="10" y1="26" x2="8" y2="38" stroke="#1e293b" strokeWidth="2" />
              <line x1="16" y1="26" x2="18" y2="38" stroke="#1e293b" strokeWidth="2" />
              <path d="M 6,12 L 20,12 L 18,28 L 8,28 Z" fill="#f8fafc" />
              <circle cx="13" cy="7" r="4.5" fill="#f59e0b" />
              <ellipse cx="13" cy="5" rx="5.5" ry="2.5" fill="#16a34a" />
            </g>

            {/* Location Pin with gentle pulse */}
            <g transform="translate(100, 20)">
              <circle
                cx="14"
                cy="14"
                r="18"
                fill="#10b981"
                className={isDetectingGps ? 'animate-ping opacity-40' : 'opacity-15'}
              />
              <path
                d="M 14,4 C 8.5,4 4,8.5 4,14 C 4,21 14,32 14,32 C 14,32 24,21 24,14 C 24,8.5 19.5,4 14,4 Z"
                fill="#047857"
              />
              <circle cx="14" cy="13" r="4" fill="#ffffff" />
            </g>
          </svg>
        </div>

        {/* Right: Confirmed Location Pill */}
        <div className="flex-1 pl-3">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            {location.isGps ? 'GPS Active' : 'Selected Farm'}
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
            {location.villageOrTown || 'Bhimavaram'}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {location.district}, {location.state}
          </p>
        </div>
      </div>

      {/* Farmer Name (Optional) */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {language === 'te'
            ? 'రైతు పేరు (ఐచ్ఛికం)'
            : language === 'hi'
            ? 'किसान का नाम (वैकल्पिक)'
            : language === 'mr'
            ? 'शेतकऱ्याचे नाव (पर्यायी)'
            : 'Farmer Name (Optional)'}
        </label>
        <input
          type="text"
          value={farmerName}
          onChange={(e) => setFarmerName(e.target.value)}
          placeholder={
            language === 'te'
              ? 'మీ పేరు నమోదు చేయండి (ఉదా: రాము)'
              : language === 'hi'
              ? 'अपना नाम दर्ज करें'
              : language === 'mr'
              ? 'आपले नाव टाका'
              : 'Enter your name'
          }
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-emerald-500 focus:outline-hidden text-slate-900 shadow-2xs"
        />
      </div>

      {/* Three Clear Location Choices */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          {language === 'te' ? 'ప్రాంతాన్ని ఎంచుకోండి' : 'Choose Your Location'}
        </label>

        <div className="grid grid-cols-3 gap-2">
          {/* Choice 1: Use Current Location (GPS) */}
          <button
            onClick={() => {
              setMode('gps');
              handleDetectGps();
            }}
            disabled={isDetectingGps}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 active:scale-[0.98] ${
              mode === 'gps'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <Navigation
              className={`w-5 h-5 ${isDetectingGps ? 'animate-spin' : ''}`}
            />
            <span className="text-xs font-bold leading-tight">
              {isDetectingGps ? 'Detecting...' : '📍 GPS Location'}
            </span>
          </button>

          {/* Choice 2: Search Location */}
          <button
            onClick={() => setMode('search')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 active:scale-[0.98] ${
              mode === 'search'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs font-bold leading-tight">
              🔍 Search Town
            </span>
          </button>

          {/* Choice 3: Manual Progressive Dropdown */}
          <button
            onClick={() => setMode('manual')}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 active:scale-[0.98] ${
              mode === 'manual'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-xs font-bold leading-tight">
              🗺 State / District
            </span>
          </button>
        </div>
      </div>

      {/* GPS Detection Status Banner */}
      {gpsStatus && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between mb-4 border ${
            gpsStatus.success
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {gpsStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {gpsStatus.success ? '✓ Location found' : gpsStatus.text}
              </span>
              {gpsStatus.success && (
                <span className="text-emerald-700">{gpsStatus.text}</span>
              )}
            </div>
          </div>

          {!gpsStatus.success && (
            <button
              onClick={() => setMode('manual')}
              className="text-xs font-bold underline text-amber-900 cursor-pointer"
            >
              Select Manually
            </button>
          )}
        </div>
      )}

      {/* Mode Sub-Panels */}
      {mode === 'search' && (
        <div className="mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type town, district, or village name..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 divide-y divide-slate-100 max-h-44 overflow-y-auto border border-slate-100 rounded-lg">
              {searchResults.map((item) => (
                <button
                  key={`${item.townOrCity}-${item.district}`}
                  onClick={() => selectSearchResult(item)}
                  className="w-full text-left p-2.5 text-xs hover:bg-emerald-50 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-bold text-slate-900">
                    {item.townOrCity}, {item.district}
                  </span>
                  <span className="text-slate-500">{item.state}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div className="mb-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
          {/* State */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.stateLabel}
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
            >
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.districtLabel}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
            >
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Town / Village */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.cityTownLabel}
            </label>
            <select
              value={selectedTown}
              onChange={(e) => handleTownChange(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
            >
              {availableTowns.map((tw) => (
                <option key={tw} value={tw}>
                  {tw}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Quick Agricultural Benchmark Hubs */}
      <div className="mb-6 pt-1">
        <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">
          Quick Agricultural Hubs (SIH Data):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {INDEXED_LOCATIONS.filter((l) => l.isPopularHub).slice(0, 6).map((hub) => {
            const isCurrent =
              location.villageOrTown.toLowerCase() === hub.townOrCity.toLowerCase();
            return (
              <button
                key={hub.townOrCity}
                onClick={() => selectSearchResult(hub)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                📍 {hub.townOrCity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div>
        <button
          onClick={onNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-md shadow-emerald-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>
            {language === 'te'
              ? 'పంట ఎంపికకు వెళ్లండి'
              : language === 'hi'
              ? 'फसल की जानकारी दें'
              : language === 'mr'
              ? 'पीक माहिती द्या'
              : 'Continue to Crop Details'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
