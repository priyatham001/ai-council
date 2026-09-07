import React, { useState } from 'react';
import { Language, LocationData } from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';
import {
  ALL_INDIAN_LOCATIONS,
  searchIndianLocations,
  findClosestIndianLocation,
  LocationPreset,
} from '../../data/indianLocationsData';
import { MapPin, Search, Navigation, Check, AlertCircle, Loader2, Sparkles, Building2 } from 'lucide-react';

interface LocationSelectorProps {
  language: Language;
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onContinue: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Rajasthan',
  'Gujarat',
  'Uttar Pradesh',
  'West Bengal',
  'Bihar',
  'Odisha',
  'Chhattisgarh',
  'Kerala',
  'Assam',
  'Jharkhand',
  'Uttarakhand',
  'Himachal Pradesh',
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  language,
  currentLocation,
  onSelectLocation,
  onContinue,
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Manual fallback state
  const [selectedState, setSelectedState] = useState(currentLocation.state || 'Andhra Pradesh');
  const [districtInput, setDistrictInput] = useState(currentLocation.district || '');
  const [villageInput, setVillageInput] = useState(currentLocation.village || '');

  // Live dynamic search from our comprehensive Indian locations database
  const searchResults = searchQuery.trim()
    ? searchIndianLocations(searchQuery)
    : [];

  // Popular regions for quick 1-click select
  const popularPresets = ALL_INDIAN_LOCATIONS.filter((l) => l.popular);

  const handleUseGps = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setIsDetectingGps(false);
        const { latitude, longitude } = position.coords;

        // Determine closest Indian district / state using spatial lookup
        const closest = findClosestIndianLocation(latitude, longitude);

        const newLoc: LocationData = {
          latitude,
          longitude,
          country: 'India',
          state: closest.state,
          district: closest.district,
          city: closest.name.split(' (')[0],
          formattedAddress: `${closest.name}, ${closest.state}, India (GPS)`,
          source: 'gps',
        };
        onSelectLocation(newLoc);
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsError(`Could not access GPS: ${err.message}. Please search your district or town below.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectPreset = (preset: LocationPreset) => {
    const newLoc: LocationData = {
      latitude: preset.latitude,
      longitude: preset.longitude,
      country: 'India',
      state: preset.state,
      district: preset.district,
      city: preset.name.split(' (')[0],
      town: preset.name.split(' (')[0],
      formattedAddress: `${preset.name}, ${preset.state}, India`,
      source: 'search',
    };
    onSelectLocation(newLoc);
    setSearchQuery('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = [villageInput, districtInput, selectedState].filter(Boolean).join(' ');

    // Try finding exact or nearest coordinates from database
    const matches = searchIndianLocations(query);
    if (matches.length > 0) {
      const best = matches[0];
      onSelectLocation({
        ...best,
        village: villageInput.trim() || undefined,
        formattedAddress: `${villageInput.trim() ? villageInput.trim() + ', ' : ''}${best.formattedAddress}`,
        source: 'manual',
      });
      return;
    }

    // Default to center of state
    const stateMatch = ALL_INDIAN_LOCATIONS.find((l) => l.state.toLowerCase() === selectedState.toLowerCase());
    const lat = stateMatch ? stateMatch.latitude : 14.4673;
    const lng = stateMatch ? stateMatch.longitude : 78.8242;

    const newLoc: LocationData = {
      latitude: lat,
      longitude: lng,
      country: 'India',
      state: selectedState,
      district: districtInput.trim() || stateMatch?.district || 'District Center',
      village: villageInput.trim() || undefined,
      city: villageInput.trim() || districtInput.trim() || stateMatch?.name || selectedState,
      formattedAddress: `${villageInput ? villageInput + ', ' : ''}${districtInput ? districtInput + ', ' : ''}${selectedState}, India`,
      source: 'manual',
    };

    onSelectLocation(newLoc);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          {t.step1Title} • India-Wide Farm Coverage
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-outfit">
          {t.locationPrompt}
        </h2>
        <p className="text-stone-600 text-sm mt-1 max-w-xl mx-auto">
          KrishiSetu is genuine location-driven. Select your farm district to discover nearby APMC mandis, mills, and calculate accurate highway transport.
        </p>
      </div>

      {/* Primary Actions: GPS Button + Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* GPS Button */}
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={handleUseGps}
              disabled={isDetectingGps}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all text-sm disabled:opacity-75 cursor-pointer"
            >
              {isDetectingGps ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.gettingLocation}
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-amber-300" />
                  {t.useCurrentLocation}
                </>
              )}
            </button>
            <p className="text-[11px] text-stone-500 text-center mt-1.5 font-medium">
              {t.gpsAccuracy}
            </p>
          </div>

          <div className="md:col-span-2 text-center text-xs font-bold text-stone-400 uppercase">
            — OR —
          </div>

          {/* Search Box */}
          <div className="md:col-span-5">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kadapa, Warangal, Nashik, Kurnool..."
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5">
              Type village, taluk/mandal, or district name
            </p>
          </div>
        </div>

        {gpsError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Dynamic Search Dropdown / Results */}
        {searchQuery.trim().length > 0 && (
          <div className="mt-4 border-t border-stone-100 pt-3">
            <div className="text-xs font-bold text-stone-500 uppercase mb-2">
              Found {searchResults.length} location{searchResults.length === 1 ? '' : 's'} matching "{searchQuery}"
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-500">
                No matching location found. Use the manual form below to specify your state and district.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {searchResults.slice(0, 9).map((loc, idx) => (
                  <button
                    key={`${loc.formattedAddress}-${idx}`}
                    type="button"
                    onClick={() => {
                      onSelectLocation(loc);
                      setSearchQuery('');
                    }}
                    className="text-left p-2.5 rounded-xl border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900">{loc.city || loc.district}</div>
                      <div className="text-[11px] text-stone-500">{loc.district}, {loc.state}</div>
                    </div>
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current Selected Location Banner */}
      <div className="bg-amber-50 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center text-xl shrink-0 font-bold shadow-sm">
            📍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                Active Farm Location
              </span>
              <span className="text-xs text-amber-800 font-medium capitalize">
                Via {currentLocation.source}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-950 mt-0.5">
              {currentLocation.formattedAddress}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5 font-mono">
              Coordinates: {currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E • {currentLocation.district}, {currentLocation.state}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto shrink-0 bg-stone-900 hover:bg-black text-amber-300 font-extrabold px-6 py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          Confirm Location & Next →
        </button>
      </div>

      {/* Popular Agricultural Hubs Across India */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-stone-400" />
            Quick Select: Major Agricultural Hubs in India
          </h3>
          <span className="text-[11px] text-stone-400">Click any location to test market discovery</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {popularPresets.map((loc) => {
            const isSelected =
              Math.abs(loc.latitude - currentLocation.latitude) < 0.05 &&
              Math.abs(loc.longitude - currentLocation.longitude) < 0.05;

            return (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelectPreset(loc)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30 font-bold'
                    : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {loc.name}
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

      {/* Manual State & District Selector */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          {t.manualLocationTitle}
        </h3>

        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              {t.selectState}
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-600"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              {t.selectDistrict}
            </label>
            <input
              type="text"
              value={districtInput}
              onChange={(e) => setDistrictInput(e.target.value)}
              placeholder="e.g. Kadapa, Warangal, Nashik..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                {t.enterTownVillage}
              </label>
              <input
                type="text"
                value={villageInput}
                onChange={(e) => setVillageInput(e.target.value)}
                placeholder="e.g. Proddatur, Lasalgaon..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <button
              type="submit"
              className="self-end bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
