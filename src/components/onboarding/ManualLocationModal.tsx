import React, { useState, useEffect, useMemo } from 'react';
import { LocationData, Language } from '../../types/krishi';
import {
  MASTER_LOCATIONS,
  queryLocations,
  AdministrativeUnit,
  getSubDistrictLabel,
} from '../../data/indiaWideLocations';
import {
  Search,
  MapPin,
  X,
  Check,
  Building2,
  ChevronDown,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface ManualLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  onApplyLocation: (newLoc: LocationData) => void;
  language: Language;
}

export const ManualLocationModal: React.FC<ManualLocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onApplyLocation,
  language,
}) => {
  if (!isOpen) return null;

  // Search tab vs Cascading dropdown tab
  const [activeTab, setActiveTab] = useState<'cascade' | 'search'>('cascade');

  // Cascading Selection States
  const [selectedState, setSelectedState] = useState<string>(currentLocation.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentLocation.district || '');
  const [selectedTaluka, setSelectedTaluka] = useState<string>(
    currentLocation.subDistrict || currentLocation.taluka || ''
  );
  const [selectedVillage, setSelectedVillage] = useState<string>(
    currentLocation.village || currentLocation.city || ''
  );

  // Available lists
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableTalukas, setAvailableTalukas] = useState<string[]>([]);
  const [availableVillages, setAvailableVillages] = useState<AdministrativeUnit[]>([]);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Dynamic label for subdistrict based on state (Taluka vs Mandal vs Tehsil)
  const subDistrictLabel = useMemo(() => {
    return getSubDistrictLabel(selectedState);
  }, [selectedState]);

  // 1. Fetch States on mount
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
      .catch(() => fallbackStates());

    function fallbackStates() {
      const set = new Set<string>();
      MASTER_LOCATIONS.forEach((l) => set.add(l.state));
      setAvailableStates(Array.from(set).sort((a, b) => a.localeCompare(b)));
    }
  }, []);

  // 2. When State changes -> Fetch districts, and RESET District, Taluka, Village
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    // Strict requirement: If the user changes: State -> reset District, Taluka and Village.
    setSelectedDistrict('');
    setSelectedTaluka('');
    setSelectedVillage('');
    setAvailableTalukas([]);
    setAvailableVillages([]);

    fetch(`/api/locations/districts?state=${encodeURIComponent(newState)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.districts && Array.isArray(data.districts)) {
          setAvailableDistricts(data.districts);
        } else {
          fallbackDistricts(newState);
        }
      })
      .catch(() => fallbackDistricts(newState));
  };

  const fallbackDistricts = (st: string) => {
    const matches = MASTER_LOCATIONS.filter(
      (l) => l.state.toLowerCase() === st.toLowerCase()
    );
    const dists = Array.from(new Set(matches.map((m) => m.district))).sort((a, b) =>
      a.localeCompare(b)
    );
    setAvailableDistricts(dists);
  };

  // Sync districts on initial load if state is preset
  useEffect(() => {
    if (selectedState && availableDistricts.length === 0) {
      fallbackDistricts(selectedState);
    }
  }, [selectedState]);

  // 3. When District changes -> Fetch talukas, and RESET Taluka and Village
  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    // Strict requirement: District -> reset Taluka and Village.
    setSelectedTaluka('');
    setSelectedVillage('');
    setAvailableVillages([]);

    if (!selectedState || !newDistrict) return;

    fetch(
      `/api/locations/subdistricts?state=${encodeURIComponent(
        selectedState
      )}&district=${encodeURIComponent(newDistrict)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.subDistricts && Array.isArray(data.subDistricts)) {
          setAvailableTalukas(data.subDistricts);
        } else {
          fallbackTalukas(selectedState, newDistrict);
        }
      })
      .catch(() => fallbackTalukas(selectedState, newDistrict));
  };

  const fallbackTalukas = (st: string, dist: string) => {
    const matches = MASTER_LOCATIONS.filter(
      (l) =>
        l.state.toLowerCase() === st.toLowerCase() &&
        l.district.toLowerCase() === dist.toLowerCase()
    );
    const subs = Array.from(new Set(matches.map((m) => m.subDistrict))).sort((a, b) =>
      a.localeCompare(b)
    );
    setAvailableTalukas(subs);
  };

  // 4. When Taluka changes -> Fetch villages, and RESET Village
  const handleTalukaChange = (newTaluka: string) => {
    setSelectedTaluka(newTaluka);
    // Strict requirement: Taluka -> reset Village.
    setSelectedVillage('');

    if (!selectedState || !selectedDistrict || !newTaluka) return;

    fetch(
      `/api/locations/villages?state=${encodeURIComponent(
        selectedState
      )}&district=${encodeURIComponent(selectedDistrict)}&subdistrict=${encodeURIComponent(
        newTaluka
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.villages && Array.isArray(data.villages)) {
          setAvailableVillages(data.villages);
        } else {
          fallbackVillages(selectedState, selectedDistrict, newTaluka);
        }
      })
      .catch(() => fallbackVillages(selectedState, selectedDistrict, newTaluka));
  };

  const fallbackVillages = (st: string, dist: string, sub: string) => {
    const matches = MASTER_LOCATIONS.filter(
      (l) =>
        l.state.toLowerCase() === st.toLowerCase() &&
        l.district.toLowerCase() === dist.toLowerCase() &&
        l.subDistrict.toLowerCase() === sub.toLowerCase()
    );
    setAvailableVillages(matches);
  };

  // 5. When Village changes -> update final location
  const handleVillageChange = (newVillage: string) => {
    setSelectedVillage(newVillage);
  };

  // Handle Search Input
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = queryLocations(q, 10);
    setSearchResults(results);
    setIsSearching(false);
  };

  // Apply location from search result
  const handleApplySearchResult = (unit: AdministrativeUnit) => {
    const newLoc: LocationData = {
      latitude: unit.latitude,
      longitude: unit.longitude,
      country: 'India',
      state: unit.state,
      district: unit.district,
      subDistrict: unit.subDistrict,
      taluka: unit.subDistrict,
      city: unit.name,
      village: unit.name,
      town: unit.name,
      formattedAddress: `${unit.name}, ${unit.subDistrict}, ${unit.district} District, ${unit.state}, India`,
      source: 'manual',
    };
    onApplyLocation(newLoc);
    onClose();
  };

  // Apply location from cascading selectors
  const handleApplyCascade = () => {
    // Find closest unit or calculate representative coordinates
    let lat = currentLocation.latitude;
    let lng = currentLocation.longitude;

    const matchedUnit = availableVillages.find(
      (v) => v.name.toLowerCase() === selectedVillage.toLowerCase()
    );

    if (matchedUnit) {
      lat = matchedUnit.latitude;
      lng = matchedUnit.longitude;
    } else {
      // Find matching item from MASTER_LOCATIONS for the taluka or district
      const matchedDistrict = MASTER_LOCATIONS.find(
        (m) =>
          m.state.toLowerCase() === selectedState.toLowerCase() &&
          m.district.toLowerCase() === selectedDistrict.toLowerCase()
      );
      if (matchedDistrict) {
        lat = matchedDistrict.latitude;
        lng = matchedDistrict.longitude;
      }
    }

    const villagePart = selectedVillage ? `${selectedVillage}, ` : '';
    const talukaPart = selectedTaluka ? `${selectedTaluka}, ` : '';
    const distPart = selectedDistrict ? `${selectedDistrict} District, ` : '';

    const newLoc: LocationData = {
      latitude: lat,
      longitude: lng,
      country: 'India',
      state: selectedState,
      district: selectedDistrict || 'General',
      subDistrict: selectedTaluka || undefined,
      taluka: selectedTaluka || undefined,
      city: selectedVillage || selectedTaluka || selectedDistrict,
      village: selectedVillage || undefined,
      town: selectedVillage || selectedTaluka || selectedDistrict,
      formattedAddress: `${villagePart}${talukaPart}${distPart}${selectedState}, India`,
      source: 'manual',
    };

    onApplyLocation(newLoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-500/50 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl shadow-xs">
              📍
            </div>
            <div>
              <h3 className="text-xl font-black text-stone-900 dark:text-white font-outfit">
                Select Farm Location
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                State → District → {subDistrictLabel} → Village
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Cascading Dropdowns vs Quick Search */}
        <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
          <button
            type="button"
            onClick={() => setActiveTab('cascade')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'cascade'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Hierarchical Selection
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Quick Search
          </button>
        </div>

        {/* TAB 1: CASCADING SELECTION */}
        {activeTab === 'cascade' && (
          <div className="space-y-4">
            {/* 1. State */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                1. State
              </label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="">-- Select State --</option>
                  {availableStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* 2. District */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                2. District
              </label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!selectedState || availableDistricts.length === 0}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedState ? '-- Select State First --' : '-- Select District --'}
                  </option>
                  {availableDistricts.map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* 3. Taluka / Sub-District */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                3. {subDistrictLabel} (Sub-District)
              </label>
              <div className="relative">
                <select
                  value={selectedTaluka}
                  onChange={(e) => handleTalukaChange(e.target.value)}
                  disabled={!selectedDistrict || availableTalukas.length === 0}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedDistrict ? '-- Select District First --' : `-- Select ${subDistrictLabel} --`}
                  </option>
                  {availableTalukas.map((tlk) => (
                    <option key={tlk} value={tlk}>
                      {tlk}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* 4. Village / Locality */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                4. Village / Locality
              </label>
              {availableVillages.length > 0 ? (
                <div className="relative">
                  <select
                    value={selectedVillage}
                    onChange={(e) => handleVillageChange(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    <option value="">-- Select Village --</option>
                    {availableVillages.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-3.5 pointer-events-none" />
                </div>
              ) : (
                <input
                  type="text"
                  value={selectedVillage}
                  onChange={(e) => handleVillageChange(e.target.value)}
                  placeholder="Enter village name..."
                  className="w-full bg-stone-50 dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              )}
            </div>

            {/* Live Location Summary */}
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                Selected Hierarchy:
              </span>
              <p className="text-emerald-800 dark:text-emerald-300">
                {selectedVillage ? `${selectedVillage}, ` : ''}
                {selectedTaluka ? `${selectedTaluka} (${subDistrictLabel}), ` : ''}
                {selectedDistrict ? `${selectedDistrict} Dist, ` : ''}
                {selectedState}
              </p>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApplyCascade}
              disabled={!selectedState}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Update Location</span>
            </button>
          </div>
        )}

        {/* TAB 2: SEARCH */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search village, city, taluka or district..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>

            {searchResults.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-1.5 border border-stone-200 dark:border-stone-800 rounded-2xl p-2">
                {searchResults.map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => handleApplySearchResult(unit)}
                    className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-stone-800 dark:text-stone-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <strong className="block text-sm text-stone-900 dark:text-white">
                        {unit.name}
                      </strong>
                      <span className="text-stone-500 dark:text-stone-400">
                        {unit.subDistrict}, {unit.district} District, {unit.state}
                      </span>
                    </div>
                    <span className="text-emerald-600 font-bold">Select →</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-stone-400">
                {searchQuery ? 'No matching locations found' : 'Type at least 2 characters to search'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
