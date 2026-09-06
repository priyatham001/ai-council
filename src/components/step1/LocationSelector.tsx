import React, { useState } from 'react';
import { Language, LocationData } from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';
import { MapPin, Search, Navigation, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface LocationSelectorProps {
  language: Language;
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onContinue: () => void;
}

// Preset popular agricultural districts/hubs across Indian states for 1-click testing
const POPULAR_INDIAN_LOCATIONS: LocationData[] = [
  {
    latitude: 16.5449,
    longitude: 81.5212,
    country: 'India',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    city: 'Bhimavaram',
    formattedAddress: 'Bhimavaram, West Godavari, Andhra Pradesh, India',
    source: 'search',
  },
  {
    latitude: 20.0059,
    longitude: 73.7917,
    country: 'India',
    state: 'Maharashtra',
    district: 'Nashik',
    city: 'Nashik',
    formattedAddress: 'Nashik, Maharashtra, India',
    source: 'search',
  },
  {
    latitude: 17.9689,
    longitude: 79.5941,
    country: 'India',
    state: 'Telangana',
    district: 'Warangal',
    city: 'Warangal',
    formattedAddress: 'Enumamula / Warangal, Telangana, India',
    source: 'search',
  },
  {
    latitude: 30.8926,
    longitude: 75.8573,
    country: 'India',
    state: 'Punjab',
    district: 'Ludhiana',
    city: 'Ludhiana',
    formattedAddress: 'Ludhiana Grain Hub, Punjab, India',
    source: 'search',
  },
  {
    latitude: 13.0238,
    longitude: 77.5529,
    country: 'India',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    formattedAddress: 'Yeshwanthpur, Bengaluru, Karnataka, India',
    source: 'search',
  },
  {
    latitude: 11.0168,
    longitude: 76.9558,
    country: 'India',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    city: 'Coimbatore',
    formattedAddress: 'Coimbatore, Tamil Nadu, India',
    source: 'search',
  },
  {
    latitude: 22.7196,
    longitude: 75.8577,
    country: 'India',
    state: 'Madhya Pradesh',
    district: 'Indore',
    city: 'Indore',
    formattedAddress: 'Indore Mandi Region, Madhya Pradesh, India',
    source: 'search',
  },
  {
    latitude: 22.3392,
    longitude: 70.8144,
    country: 'India',
    state: 'Gujarat',
    district: 'Rajkot',
    city: 'Rajkot',
    formattedAddress: 'Rajkot, Saurashtra, Gujarat, India',
    source: 'search',
  },
  {
    latitude: 26.8048,
    longitude: 75.7601,
    country: 'India',
    state: 'Rajasthan',
    district: 'Jaipur',
    city: 'Jaipur',
    formattedAddress: 'Muhana Mandi, Jaipur, Rajasthan, India',
    source: 'search',
  },
  {
    latitude: 23.2324,
    longitude: 87.8615,
    country: 'India',
    state: 'West Bengal',
    district: 'Purba Bardhaman',
    city: 'Burdwan',
    formattedAddress: 'Burdwan, West Bengal, India',
    source: 'search',
  },
  {
    latitude: 25.3524,
    longitude: 82.9912,
    country: 'India',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    city: 'Varanasi',
    formattedAddress: 'Varanasi, Uttar Pradesh, India',
    source: 'search',
  },
  {
    latitude: 25.5941,
    longitude: 85.1376,
    country: 'India',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    formattedAddress: 'Bazar Samiti, Patna, Bihar, India',
    source: 'search',
  },
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Bihar',
  'Chhattisgarh',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Odisha',
  'Assam',
  'Kerala',
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

  // Filtered presets based on search query
  const filteredPresets = searchQuery.trim()
    ? POPULAR_INDIAN_LOCATIONS.filter(
        (loc) =>
          loc.formattedAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.district.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : POPULAR_INDIAN_LOCATIONS;

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
        const newLoc: LocationData = {
          latitude,
          longitude,
          country: 'India',
          state: 'GPS Detected State',
          district: 'Local District',
          formattedAddress: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (GPS Farm Location)`,
          source: 'gps',
        };
        onSelectLocation(newLoc);
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsError(`Could not access location: ${err.message}. You can search or select your village below.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const townName = villageInput.trim() || districtInput.trim() || selectedState;
    // Find approximate coords from presets or default center
    const matchedPreset = POPULAR_INDIAN_LOCATIONS.find(
      (p) => p.state.toLowerCase() === selectedState.toLowerCase()
    );

    const lat = matchedPreset ? matchedPreset.latitude + (Math.random() * 0.1 - 0.05) : 20.5937;
    const lng = matchedPreset ? matchedPreset.longitude + (Math.random() * 0.1 - 0.05) : 78.9629;

    const newLoc: LocationData = {
      latitude: lat,
      longitude: lng,
      country: 'India',
      state: selectedState,
      district: districtInput.trim() || 'District Center',
      village: villageInput.trim() || undefined,
      city: townName,
      formattedAddress: `${townName}${districtInput ? ', ' + districtInput : ''}, ${selectedState}, India`,
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
          KrishiSetu dynamically discovers nearby wholesale mandis, private yards, and mills within your state and across neighboring districts.
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
                placeholder={t.searchLocationPlaceholder}
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
              Coordinates: {currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E
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

      {/* Fast Preset Agricultural Hubs Across India */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Quick Select: Major Agricultural Hubs Across India
          </h3>
          <span className="text-[11px] text-stone-400">12 Indian Regions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filteredPresets.map((loc) => {
            const isSelected =
              Math.abs(loc.latitude - currentLocation.latitude) < 0.05 &&
              Math.abs(loc.longitude - currentLocation.longitude) < 0.05;

            return (
              <button
                key={loc.formattedAddress}
                type="button"
                onClick={() => onSelectLocation(loc)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30 font-bold'
                    : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {loc.city || loc.district}
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
              placeholder="e.g. West Godavari, Nashik, Warangal..."
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
                placeholder="e.g. Bhimavaram, Lasalgaon, Village..."
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
