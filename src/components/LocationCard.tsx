import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Search,
  SlidersHorizontal,
  Map as MapIcon,
  RefreshCw,
  X
} from 'lucide-react';
import { FarmerLocation, Language } from '../types';
import { getTranslation } from '../lib/translations';
import {
  INDIAN_STATES_DISTRICTS,
  INDEXED_LOCATIONS,
  searchLocations,
  getCoordinatesForLocation,
  LocationOption
} from '../lib/india-locations';

interface LocationCardProps {
  location: FarmerLocation;
  setLocation: (loc: FarmerLocation) => void;
  language: Language;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  setLocation,
  language
}) => {
  const t = getTranslation(language);

  // View state: 'summary' | 'search' | 'manual' | 'map'
  const [activeTab, setActiveTab] = useState<'quick' | 'search' | 'manual' | 'map'>('quick');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationOption[]>([]);

  // Manual cascaded dropdown state
  const availableStates = Object.keys(INDIAN_STATES_DISTRICTS);
  const [selectedState, setSelectedState] = useState(location.state || 'Andhra Pradesh');
  const availableDistricts = Object.keys(INDIAN_STATES_DISTRICTS[selectedState] || {});
  const [selectedDistrict, setSelectedDistrict] = useState(
    location.district && availableDistricts.includes(location.district)
      ? location.district
      : availableDistricts[0] || 'West Godavari'
  );
  const availableTowns = (INDIAN_STATES_DISTRICTS[selectedState] && INDIAN_STATES_DISTRICTS[selectedState][selectedDistrict]) || [];
  const [selectedTown, setSelectedTown] = useState(
    location.villageOrTown && availableTowns.includes(location.villageOrTown)
      ? location.villageOrTown
      : availableTowns[0] || 'Bhimavaram'
  );

  // Sync state changes when state dropdown changes
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const districts = Object.keys(INDIAN_STATES_DISTRICTS[newState] || {});
    const firstDistrict = districts[0] || '';
    setSelectedDistrict(firstDistrict);
    const towns = (INDIAN_STATES_DISTRICTS[newState] && INDIAN_STATES_DISTRICTS[newState][firstDistrict]) || [];
    const firstTown = towns[0] || '';
    setSelectedTown(firstTown);

    const coords = getCoordinatesForLocation(newState, firstDistrict, firstTown);
    setLocation({
      country: 'India',
      state: newState,
      district: firstDistrict,
      villageOrTown: firstTown || firstDistrict,
      lat: coords.lat,
      lng: coords.lng,
      isGps: false,
      isDemo: true,
      source: 'manual'
    });
    setStatusMessage({ text: `${firstTown}, ${firstDistrict}, ${newState} selected.`, type: 'success' });
  };

  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    const towns = (INDIAN_STATES_DISTRICTS[selectedState] && INDIAN_STATES_DISTRICTS[selectedState][newDistrict]) || [];
    const firstTown = towns[0] || '';
    setSelectedTown(firstTown);

    const coords = getCoordinatesForLocation(selectedState, newDistrict, firstTown);
    setLocation({
      country: 'India',
      state: selectedState,
      district: newDistrict,
      villageOrTown: firstTown || newDistrict,
      lat: coords.lat,
      lng: coords.lng,
      isGps: false,
      isDemo: true,
      source: 'manual'
    });
    setStatusMessage({ text: `${firstTown}, ${newDistrict} selected.`, type: 'success' });
  };

  const handleTownChange = (newTown: string) => {
    setSelectedTown(newTown);
    const coords = getCoordinatesForLocation(selectedState, selectedDistrict, newTown);
    setLocation({
      country: 'India',
      state: selectedState,
      district: selectedDistrict,
      villageOrTown: newTown,
      lat: coords.lat,
      lng: coords.lng,
      isGps: false,
      isDemo: true,
      source: 'manual'
    });
    setStatusMessage({ text: `${newTown}, ${selectedDistrict} selected.`, type: 'success' });
  };

  // Autocomplete search handler
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
      source: 'search',
      formattedAddress: `${item.townOrCity}, ${item.district}, ${item.state}, India`
    });
    setSelectedState(item.state);
    setSelectedDistrict(item.district);
    setSelectedTown(item.townOrCity);
    setSearchQuery('');
    setStatusMessage({ text: `${item.townOrCity} (${item.district}, ${item.state}) selected.`, type: 'success' });
  };

  // GPS Geolocation Handler with reverse geocoding
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setStatusMessage({
        text: t.locationAutoUnavailable,
        type: 'error'
      });
      return;
    }

    setIsDetectingGps(true);
    setStatusMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedState = 'Andhra Pradesh';
        let detectedDistrict = 'West Godavari';
        let detectedTown = 'Current Farm Coordinates';
        let formattedAddr = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;

        // Reverse Geocoding attempt with 3s timeout
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
              formattedAddr = data.display_name || formattedAddr;
            }
          }
        } catch (e) {
          console.log('Reverse geocoding timed out or bypassed, using coordinates directly.');
        }

        setIsDetectingGps(false);
        setLocation({
          country: 'India',
          state: detectedState,
          district: detectedDistrict,
          villageOrTown: detectedTown,
          lat: latitude,
          lng: longitude,
          latitude,
          longitude,
          formattedAddress: formattedAddr,
          isGps: true,
          isDemo: false,
          source: 'gps'
        });

        setStatusMessage({
          text: `${t.gpsDetected}: ${detectedTown}, ${detectedDistrict} (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
          type: 'success'
        });
      },
      (error) => {
        setIsDetectingGps(false);
        console.warn('Geolocation error:', error);
        let errorText = t.errUnableToDetectLocation;
        if (error.code === error.PERMISSION_DENIED) {
          errorText = t.locationPermissionDenied;
        } else if (error.code === error.TIMEOUT) {
          errorText = t.locationDetectTimeout;
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorText = t.locationAutoUnavailable;
        }
        setStatusMessage({
          text: errorText,
          type: 'warning'
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs mb-4">
      {/* Current Location Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-inner">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {t.yourLocation}
              </h2>
              {location.isGps ? (
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  GPS ACTIVE
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  SIH BENCHMARK
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              <span className="font-semibold text-slate-900">{location.villageOrTown}</span>, {location.district}, {location.state}
              <span className="text-slate-500 text-[11px] ml-1.5 font-mono">
                ({location.lat.toFixed(3)}°N, {location.lng.toFixed(3)}°E)
              </span>
            </p>
          </div>
        </div>

        {/* GPS Quick Action */}
        <button
          onClick={handleDetectGps}
          disabled={isDetectingGps}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
        >
          <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
          <span>{isDetectingGps ? 'Detecting GPS...' : t.useCurrentLocationBtn}</span>
        </button>
      </div>

      {/* Status Notice Banner */}
      {statusMessage && (
        <div
          className={`mt-3 p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : statusMessage.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border border-amber-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="p-1 hover:bg-black/5 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs for Location Selection Modes */}
      <div className="flex items-center gap-1.5 mt-3 border-b border-slate-200 text-xs font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'quick'
              ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ⚡ Quick Hubs
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-3 py-1.5 rounded-t-lg flex items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'search'
              ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search Town</span>
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-3 py-1.5 rounded-t-lg flex items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t.enterManuallyBtn}</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`px-3 py-1.5 rounded-t-lg flex items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'map'
              ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>{t.selectOnMapBtn}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-3">
        {/* Quick Agricultural Hubs */}
        {activeTab === 'quick' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium">
                Select a benchmark agricultural center:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INDEXED_LOCATIONS.filter((l) => l.isPopularHub).map((hub) => {
                const isCurrent =
                  location.villageOrTown.toLowerCase() === hub.townOrCity.toLowerCase() &&
                  location.district.toLowerCase() === hub.district.toLowerCase();

                return (
                  <button
                    key={`${hub.townOrCity}-${hub.district}`}
                    onClick={() => selectSearchResult(hub)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer border ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    📍 {hub.townOrCity} <span className="text-[11px] opacity-75">({hub.district}, {hub.state})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Input Tab */}
        {activeTab === 'search' && (
          <div className="relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchLocationPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((item) => (
                  <button
                    key={`${item.townOrCity}-${item.district}`}
                    onClick={() => selectSearchResult(item)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{item.townOrCity}</span>
                      <span className="text-slate-500 ml-1.5">({item.district}, {item.state})</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-mono">
                      {item.lat.toFixed(2)}, {item.lng.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cascading Manual Dropdowns Tab */}
        {activeTab === 'manual' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.stateLabel}
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.districtLabel}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.cityTownLabel}
              </label>
              <select
                value={selectedTown}
                onChange={(e) => handleTownChange(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                {availableTowns.map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Map Tab with Graceful Fallback Notice */}
        {activeTab === 'map' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-2">
              <MapIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Interactive Map Selection
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto mb-3">
              {t.mapProviderNotConfigured} You can accurately select your farm location using the <strong>Search Town</strong> tab or <strong>Enter Manually</strong> dropdowns.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setActiveTab('search')}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Use Town Search
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Use State/District Dropdowns
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
