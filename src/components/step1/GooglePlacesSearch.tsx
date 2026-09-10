import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { LocationData } from '../../types/krishi';
import { parseGoogleAddressComponents } from '../../services/googleMapsService';
import { queryLocations, AdministrativeUnit } from '../../data/indiaWideLocations';
import { Search, MapPin, Loader2, Sparkles, Building2 } from 'lucide-react';

interface GooglePlacesSearchProps {
  onSelectLocation: (loc: LocationData) => void;
  placeholder?: string;
}

export const GooglePlacesSearch: React.FC<GooglePlacesSearchProps> = ({
  onSelectLocation,
  placeholder = 'Search village, mandi, taluka, town or city across India...',
}) => {
  const placesLib = useMapsLibrary('places');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sessionTokenRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Local India-wide master locations matching query
  const localMatches = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    return queryLocations(query.trim(), 5);
  }, [query]);

  // Fetch Google Places suggestions with session token
  useEffect(() => {
    if (!placesLib || !query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Initialize session token if not already active
    if (!sessionTokenRef.current && (placesLib as any).AutocompleteSessionToken) {
      sessionTokenRef.current = new (placesLib as any).AutocompleteSessionToken();
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        if ((placesLib as any).AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
          const request: any = {
            input: query,
            sessionToken: sessionTokenRef.current,
            includedRegionCodes: ['in'],
          };
          const res = await (placesLib as any).AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
          setSuggestions(res.suggestions || []);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.warn('[Places API New] Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [placesLib, query]);

  // Handle selecting a Google Places suggestion
  const handleSelectGoogleSuggestion = useCallback(
    async (suggestion: any) => {
      try {
        setIsLoading(true);
        if (suggestion.placePrediction) {
          const place = suggestion.placePrediction.toPlace();
          await place.fetchFields({
            fields: ['displayName', 'formattedAddress', 'location', 'addressComponents', 'id'],
          });

          const lat = place.location?.lat();
          const lng = place.location?.lng();

          if (typeof lat === 'number' && typeof lng === 'number') {
            const parsedLoc = parseGoogleAddressComponents(
              place.addressComponents || [],
              place.formattedAddress || place.displayName || query,
              lat,
              lng,
              place.id,
              'search'
            );
            onSelectLocation(parsedLoc);
            setQuery('');
            setIsOpen(false);
          }
        }
      } catch (err) {
        console.warn('[Places API] Could not fetch place details:', err);
      } finally {
        setIsLoading(false);
        // Reset session token for next search session
        sessionTokenRef.current = null;
      }
    },
    [onSelectLocation, query]
  );

  // Handle selecting a local curated administrative unit
  const handleSelectLocalUnit = useCallback(
    (unit: AdministrativeUnit) => {
      const loc: LocationData = {
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
      onSelectLocation(loc);
      setQuery('');
      setIsOpen(false);
      sessionTokenRef.current = null;
    },
    [onSelectLocation]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const hasAnyResults = suggestions.length > 0 || localMatches.length > 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
        />
        {isLoading && (
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
        )}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 max-h-96 overflow-y-auto p-2">
          {/* Google Places Results */}
          {suggestions.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Google Places (Live Verification)
              </div>
              {suggestions.map((item, idx) => {
                const text = item.placePrediction?.text?.toString() || item.text || 'Location';
                return (
                  <button
                    key={`g-${idx}`}
                    type="button"
                    onClick={() => handleSelectGoogleSuggestion(item)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-xs flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-stone-900 line-clamp-1">{text}</div>
                      <div className="text-[11px] text-stone-500">Google Verified Location • India</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Local Mandi Database Results */}
          {localMatches.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1 border-t border-stone-100 pt-2">
                <Building2 className="w-3 h-3 text-amber-600" />
                KrishiSetu Agricultural Records & Mandis
              </div>
              {localMatches.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectLocalUnit(loc)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 text-xs flex items-start gap-2.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-900">
                      {loc.name}
                      <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-semibold uppercase">
                        {loc.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {loc.subDistrictType}: {loc.subDistrict} • {loc.district}, {loc.state}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!hasAnyResults && !isLoading && (
            <div className="p-4 text-center text-xs text-stone-500">
              No matching location found. You can select your state, district, and taluka manually below.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
