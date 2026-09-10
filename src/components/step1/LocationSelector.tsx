import React, { useState, useEffect, useMemo } from 'react';
import { Language, LocationData } from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';
import {
  AdministrativeUnit,
  MASTER_LOCATIONS,
  queryLocations,
  findClosestUnit,
  getSubDistrictLabel,
} from '../../data/indiaWideLocations';
import {
  reverseGeocodeLocation,
  forwardGeocodeAddress,
} from '../../services/googleMapsService';
import { useMapsContext } from '../map/GoogleMapsProvider';
import { GooglePlacesSearch } from './GooglePlacesSearch';
import {
  MapPin,
  Search,
  Navigation,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Building2,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface LocationSelectorProps {
  language: Language;
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onContinue: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  language,
  currentLocation,
  onSelectLocation,
  onContinue,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStage, setGpsStage] = useState<number>(0);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [justDetected, setJustDetected] = useState<boolean>(false);

  // States list (dynamic from API with fallback to MASTER_LOCATIONS)
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState(currentLocation.state || 'Maharashtra');

  // Districts list for selected state
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState(currentLocation.district || '');

  // Subdistricts (Talukas / Mandals / Tehsils) for selected district
  const [availableSubDistricts, setAvailableSubDistricts] = useState<string[]>([]);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(
    currentLocation.subDistrict || currentLocation.taluka || currentLocation.mandal || ''
  );

  // Village list / input
  const [availableVillages, setAvailableVillages] = useState<AdministrativeUnit[]>([]);
  const [villageInput, setVillageInput] = useState(currentLocation.village || '');

  // Dynamic label for subdistrict
  const subDistrictLabel = useMemo(() => {
    return getSubDistrictLabel(selectedState);
  }, [selectedState]);

  const { hasApiKey } = useMapsContext();

  // Sync state dropdowns whenever currentLocation changes
  useEffect(() => {
    if (currentLocation) {
      if (currentLocation.state && currentLocation.state !== selectedState) {
        setSelectedState(currentLocation.state);
      }
      if (currentLocation.district && currentLocation.district !== selectedDistrict) {
        setSelectedDistrict(currentLocation.district);
      }
      const sub = currentLocation.subDistrict || currentLocation.taluka || currentLocation.mandal;
      if (sub && sub !== selectedSubDistrict) {
        setSelectedSubDistrict(sub);
      }
      const v = currentLocation.village || currentLocation.city;
      if (v && v !== villageInput) {
        setVillageInput(v);
      }
    }
  }, [currentLocation]);

  // Fetch states on mount
  useEffect(() => {
    fetch('/api/locations/states')
      .then((res) => res.json())
      .then((data) => {
        if (data.states && Array.isArray(data.states) && data.states.length > 0) {
          setAvailableStates(data.states);
        } else {
          fallbackStates();
        }
      })
      .catch(() => {
        fallbackStates();
      });

    function fallbackStates() {
      const set = new Set<string>();
      MASTER_LOCATIONS.forEach((l) => set.add(l.state));
      setAvailableStates(Array.from(set).sort((a, b) => a.localeCompare(b)));
    }
  }, []);

  // Fetch districts whenever selectedState changes
  useEffect(() => {
    if (!selectedState) return;

    fetch(`/api/locations/districts?state=${encodeURIComponent(selectedState)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.districts && Array.isArray(data.districts)) {
          setAvailableDistricts(data.districts);
          if (!data.districts.includes(selectedDistrict)) {
            setSelectedDistrict(data.districts[0] || '');
          }
        }
      })
      .catch(() => {
        const matches = MASTER_LOCATIONS.filter(
          (l) => l.state.toLowerCase() === selectedState.toLowerCase()
        );
        const dists = Array.from(new Set(matches.map((m) => m.district))).sort((a, b) =>
          a.localeCompare(b)
        );
        setAvailableDistricts(dists);
        if (!dists.includes(selectedDistrict)) {
          setSelectedDistrict(dists[0] || '');
        }
      });
  }, [selectedState]);

  // Fetch subdistricts (talukas/mandals) whenever district changes
  useEffect(() => {
    if (!selectedState || !selectedDistrict) return;

    fetch(
      `/api/locations/subdistricts?state=${encodeURIComponent(
        selectedState
      )}&district=${encodeURIComponent(selectedDistrict)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.subDistricts && Array.isArray(data.subDistricts)) {
          setAvailableSubDistricts(data.subDistricts);
          if (!data.subDistricts.includes(selectedSubDistrict)) {
            setSelectedSubDistrict(data.subDistricts[0] || '');
          }
        }
      })
      .catch(() => {
        const matches = MASTER_LOCATIONS.filter(
          (l) =>
            l.state.toLowerCase() === selectedState.toLowerCase() &&
            l.district.toLowerCase() === selectedDistrict.toLowerCase()
        );
        const subDists = Array.from(new Set(matches.map((m) => m.subDistrict))).sort((a, b) =>
          a.localeCompare(b)
        );
        setAvailableSubDistricts(subDists);
        if (!subDists.includes(selectedSubDistrict)) {
          setSelectedSubDistrict(subDists[0] || '');
        }
      });
  }, [selectedState, selectedDistrict]);

  // Fetch villages for subdistrict
  useEffect(() => {
    if (!selectedState || !selectedDistrict) return;

    const queryParams = new URLSearchParams({
      state: selectedState,
      district: selectedDistrict,
    });
    if (selectedSubDistrict) {
      queryParams.set('subdistrict', selectedSubDistrict);
    }

    fetch(`/api/locations/villages?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.villages && Array.isArray(data.villages)) {
          setAvailableVillages(data.villages);
        }
      })
      .catch(() => {
        const matches = MASTER_LOCATIONS.filter(
          (l) =>
            l.state.toLowerCase() === selectedState.toLowerCase() &&
            l.district.toLowerCase() === selectedDistrict.toLowerCase() &&
            (!selectedSubDistrict ||
              l.subDistrict.toLowerCase() === selectedSubDistrict.toLowerCase())
        );
        setAvailableVillages(matches);
      });
  }, [selectedState, selectedDistrict, selectedSubDistrict]);

  // Live dynamic search from India-wide locations database
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return queryLocations(searchQuery, 12);
  }, [searchQuery]);

  // GPS Action with progressive stages: Detecting -> Coordinates -> District -> Village -> Mandis
  const handleUseGps = () => {
    setGpsError(null);
    setJustDetected(false);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsStage(1);

    const timer1 = setTimeout(() => setGpsStage(2), 600);
    const timer2 = setTimeout(() => setGpsStage(3), 1200);
    const timer3 = setTimeout(() => setGpsStage(4), 1800);
    const timer4 = setTimeout(() => setGpsStage(5), 2400);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Attempt Google Geocoding with fallback to spatial master data
          const detected = await reverseGeocodeLocation(latitude, longitude);
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          clearTimeout(timer4);
          setIsDetectingGps(false);
          setGpsStage(0);
          setJustDetected(true);
          onSelectLocation(detected);
        } catch (err: any) {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          clearTimeout(timer4);
          setIsDetectingGps(false);
          setGpsStage(0);
          setJustDetected(true);
          const closest = findClosestUnit(latitude, longitude);
          const newLoc: LocationData = {
            id: closest.id,
            latitude,
            longitude,
            country: 'India',
            state: closest.state,
            district: closest.district,
            subDistrict: closest.subDistrict,
            taluka: closest.subDistrictType === 'Taluka' ? closest.subDistrict : undefined,
            mandal: closest.subDistrictType === 'Mandal' ? closest.subDistrict : undefined,
            tehsil: closest.subDistrictType === 'Tehsil' ? closest.subDistrict : undefined,
            city: closest.name,
            village: closest.type === 'village' ? closest.name : undefined,
            formattedAddress: `${closest.name}, ${closest.subDistrictType}: ${closest.subDistrict}, ${closest.district}, ${closest.state} (Field GPS)`,
            source: 'gps',
          };
          onSelectLocation(newLoc);
        }
      },
      (err) => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        setIsDetectingGps(false);
        setGpsStage(0);
        setGpsError(
          `Could not access GPS (${err.message}). Please choose your farm's state, district, and taluka/mandal below.`
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Preset quick selects
  const handleSelectUnit = (unit: AdministrativeUnit) => {
    const newLoc: LocationData = {
      id: unit.id,
      latitude: unit.latitude,
      longitude: unit.longitude,
      country: 'India',
      state: unit.state,
      district: unit.district,
      subDistrict: unit.subDistrict,
      taluka: unit.subDistrictType === 'Taluka' ? unit.subDistrict : undefined,
      mandal: unit.subDistrictType === 'Mandal' ? unit.subDistrict : undefined,
      tehsil: unit.subDistrictType === 'Tehsil' ? unit.subDistrict : undefined,
      city: unit.name,
      village: unit.type === 'village' ? unit.name : undefined,
      formattedAddress: `${unit.name}, ${unit.subDistrictType}: ${unit.subDistrict}, ${unit.district}, ${unit.state}`,
      source: 'search',
    };
    onSelectLocation(newLoc);
    setSearchQuery('');
  };

  // Manual submission across State -> District -> Sub-District -> Village
  const handleManualApply = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if entered village matches an existing record in availableVillages
    const matched = availableVillages.find(
      (v) =>
        v.name.toLowerCase() === villageInput.trim().toLowerCase() ||
        v.normalizedName === villageInput.trim().toLowerCase()
    );

    if (matched) {
      handleSelectUnit(matched);
      return;
    }

    // Try Google Geocoding for precise village/mandal coordinates if available
    const addressQuery = `${villageInput.trim() || selectedSubDistrict || selectedDistrict}, ${selectedSubDistrict || ''}, ${selectedDistrict}, ${selectedState}`;
    const geocoded = await forwardGeocodeAddress(addressQuery);
    if (geocoded) {
      onSelectLocation(geocoded);
      return;
    }

    // Otherwise find closest unit in the district
    const districtMatches = MASTER_LOCATIONS.filter(
      (l) =>
        l.state.toLowerCase() === selectedState.toLowerCase() &&
        l.district.toLowerCase() === selectedDistrict.toLowerCase()
    );

    const baseUnit = districtMatches[0] || findClosestUnit(19.9975, 73.7898);
    const vName = villageInput.trim() || baseUnit.name;

    const newLoc: LocationData = {
      id: `manual-${Date.now()}`,
      latitude: baseUnit.latitude,
      longitude: baseUnit.longitude,
      country: 'India',
      state: selectedState,
      district: selectedDistrict,
      subDistrict: selectedSubDistrict || baseUnit.subDistrict,
      taluka: subDistrictLabel === 'Taluka' ? selectedSubDistrict : undefined,
      mandal: subDistrictLabel === 'Mandal' ? selectedSubDistrict : undefined,
      tehsil: subDistrictLabel === 'Tehsil' ? selectedSubDistrict : undefined,
      village: vName,
      city: baseUnit.name,
      formattedAddress: `${vName}, ${subDistrictLabel}: ${
        selectedSubDistrict || baseUnit.subDistrict
      }, ${selectedDistrict}, ${selectedState}`,
      source: 'manual',
    };

    onSelectLocation(newLoc);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Title & Subtitle */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          India-Wide Farm Intelligence
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-outfit">
          🌾 Select Your Farm Location
        </h2>
        <p className="text-stone-600 text-sm mt-1 max-w-xl mx-auto">
          Where is your farm or produce located? Discover genuine nearby APMC mandis, buyers, and exact highway transport.
        </p>
      </div>

      {/* Primary Actions: GPS Button + Search Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-5 sm:p-6 transition-colors">
        {/* Animated 5-Stage Progressive GPS Detection Panel */}
        {isDetectingGps && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white border-2 border-emerald-500/60 shadow-xl overflow-hidden relative">
            {/* Background radar sweep */}
            <div className="absolute right-4 top-4 w-24 h-24 rounded-full border border-emerald-500/30 animate-gps-ring pointer-events-none" />

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl animate-bounce">🚜</span>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>Field Geolocation in Progress</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  </h4>
                  <p className="text-[11px] text-emerald-300">
                    Connecting to Indian Administrative Survey & GIS Satellites...
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-900 text-amber-300 border border-emerald-700">
                STAGE {gpsStage || 1}/5
              </span>
            </div>

            {/* 5-Step Visual Progress Bar */}
            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold mb-3">
              {[
                { stage: 1, label: '📡 Detecting', desc: 'Hardware GPS' },
                { stage: 2, label: '🛰️ Coordinates', desc: 'Lat / Long' },
                { stage: 3, label: '📍 District', desc: 'Survey Boundary' },
                { stage: 4, label: '🏡 Village', desc: 'Revenue Village' },
                { stage: 5, label: '🏪 Mandis', desc: 'APMC Network' },
              ].map((s) => {
                const isCurrent = gpsStage === s.stage;
                const isDone = gpsStage > s.stage;
                return (
                  <div
                    key={s.stage}
                    className={`p-2 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-md font-black scale-105'
                        : isDone
                        ? 'bg-emerald-900/80 text-emerald-200 border-emerald-700'
                        : 'bg-stone-800/60 text-stone-500 border-stone-700'
                    }`}
                  >
                    <div>{s.label}</div>
                    <div className="text-[9px] opacity-80 font-normal hidden sm:block">
                      {s.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Moving Tractor & Plant Progress */}
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(15, gpsStage * 20))}%` }}
              />
            </div>
          </div>
        )}

        {/* Location Detection Succeeded Banner with Animate Hierarchy */}
        {justDetected && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500/80 text-emerald-950 dark:text-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌱</span>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Your farm location has been detected!
                </h4>
                <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 font-bold text-emerald-800 dark:text-emerald-300">
                    {currentLocation.state}
                  </span>
                  <span className="text-emerald-600">→</span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 font-bold text-emerald-800 dark:text-emerald-300">
                    {currentLocation.district}
                  </span>
                  <span className="text-emerald-600">→</span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 font-bold text-emerald-800 dark:text-emerald-300">
                    {currentLocation.taluka || currentLocation.subDistrict || currentLocation.mandal || 'Taluka'}
                  </span>
                  <span className="text-emerald-600">→</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 border border-amber-400 dark:border-amber-700 font-black text-amber-900 dark:text-amber-200">
                    {currentLocation.village || currentLocation.city || 'Village'}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setJustDetected(false)}
              className="text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* GPS Button */}
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={handleUseGps}
              disabled={isDetectingGps}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all text-sm disabled:opacity-75 cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isDetectingGps ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Locating Field Coordinates...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-amber-300" />
                  <span>📍 Use Current GPS Location</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center mt-1.5 font-medium">
              Accurate to field level coordinates
            </p>
          </div>

          <div className="md:col-span-2 text-center text-xs font-bold text-stone-400 uppercase">
            — OR —
          </div>

          {/* Search Box */}
          <div className="md:col-span-5">
            {hasApiKey ? (
              <div>
                <GooglePlacesSearch
                  onSelectLocation={(loc) => {
                    onSelectLocation(loc);
                  }}
                  placeholder="Search village, mandi, taluka or city across India..."
                />
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                  Google Places (New API) + KrishiSetu Mandi Database
                </p>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search village, town, mandal, taluka or district..."
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs sm:text-sm focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-stone-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5">
                  Instant search across Maharashtra, AP, Telangana & All India
                </p>
              </div>
            )}
          </div>
        </div>

        {gpsError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Dynamic Search Dropdown with Full Administrative Hierarchy */}
        {searchQuery.trim().length > 0 && (
          <div className="mt-4 border-t border-stone-100 pt-3">
            <div className="text-xs font-bold text-stone-500 uppercase mb-2">
              Found {searchResults.length} location{searchResults.length === 1 ? '' : 's'} matching "{searchQuery}"
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-500">
                No matching village or town found. Please choose your state and district in the manual selector below.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {searchResults.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectUnit(loc)}
                    className="text-left p-3 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{loc.name}</span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded uppercase font-bold">
                          {loc.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 mt-0.5">
                        🌾 {loc.subDistrictType}: <strong className="text-stone-800">{loc.subDistrict}</strong> • District:{' '}
                        <strong className="text-stone-800">{loc.district}</strong>, {loc.state}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current Selected Location Banner */}
      <div className="bg-amber-50 dark:bg-stone-900 border-2 border-amber-400 dark:border-amber-500/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center text-xl shrink-0 font-bold shadow-sm">
            📍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-900 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-950/80 px-2 py-0.5 rounded">
                Confirmed Farm Location
              </span>
              <span className="text-xs text-amber-800 dark:text-amber-400 font-medium capitalize">
                Via {currentLocation.source}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-950 dark:text-white mt-0.5">
              {currentLocation.formattedAddress}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 font-mono">
              Coordinates: {currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E •{' '}
              {currentLocation.district}, {currentLocation.state}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto shrink-0 bg-stone-900 dark:bg-amber-500 hover:bg-black dark:hover:bg-amber-400 text-amber-300 dark:text-stone-950 font-extrabold px-6 py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm cursor-pointer hover:scale-105"
        >
          <span>Confirm Location & Next →</span>
        </button>
      </div>

      {/* Manual Hierarchical Selector: State -> District -> Taluka/Mandal -> Village */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm transition-colors">
        <div className="border-b border-stone-100 dark:border-stone-800 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              Choose Farm Location Manually Across India
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Select your administrative hierarchy to discover local markets accurately
            </p>
          </div>
        </div>

        <form onSubmit={handleManualApply} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. State */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                State *
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-900 dark:text-white focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-600"
              >
                {availableStates.map((st) => (
                  <option key={st} value={st} className="dark:bg-stone-900 dark:text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. District */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                District *
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-900 dark:text-white focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-600"
              >
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist} className="dark:bg-stone-900 dark:text-white">
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Sub-District (Dynamic Label: Taluka / Mandal / Tehsil) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {subDistrictLabel} *
              </label>
              <select
                value={selectedSubDistrict}
                onChange={(e) => setSelectedSubDistrict(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-900 dark:text-white focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-600"
              >
                {availableSubDistricts.map((sub) => (
                  <option key={sub} value={sub} className="dark:bg-stone-900 dark:text-white">
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Village / Town */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Village / Town *
              </label>
              <input
                type="text"
                value={villageInput}
                onChange={(e) => setVillageInput(e.target.value)}
                placeholder="e.g. Lasalgaon, Vinchur, Proddatur..."
                list="village-datalist"
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-900 dark:text-white focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-emerald-600"
              />
              <datalist id="village-datalist">
                {availableVillages.map((v) => (
                  <option key={v.id} value={v.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              💡 {selectedState} administrative structure: State → District → {subDistrictLabel} → Village
            </span>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              Apply Selected Farm Location
            </button>
          </div>
        </form>
      </div>

      {/* Popular Agricultural Hubs (Maharashtra & Across India) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-stone-400" />
            Quick Select: Prominent Agricultural Hubs
          </h3>
          <span className="text-[11px] text-stone-400">Click to discover local APMC mandis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {MASTER_LOCATIONS.filter((l) => l.popular).map((loc) => {
            const isSelected =
              Math.abs(loc.latitude - currentLocation.latitude) < 0.05 &&
              Math.abs(loc.longitude - currentLocation.longitude) < 0.05;

            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectUnit(loc)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30 font-bold'
                    : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>{loc.name}</span>
                    <span className="text-[10px] text-stone-500 font-normal">
                      ({loc.subDistrictType}: {loc.subDistrict})
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                    {loc.district}, {loc.state}
                  </div>
                </div>
                {isSelected ? (
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
