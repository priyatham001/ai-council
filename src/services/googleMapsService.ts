import { LocationData } from '../types/krishi';
import { getSubDistrictLabel, findClosestUnit } from '../data/indiaWideLocations';

/**
 * Parses Google Maps address_components into KrishiSetu's standardized LocationData structure
 * respecting India's administrative hierarchy (State -> District -> Taluka/Mandal/Tehsil -> Village/City).
 */
export function parseGoogleAddressComponents(
  components: any[],
  formattedAddress: string,
  lat: number,
  lng: number,
  placeId?: string,
  source: 'gps' | 'search' | 'manual' = 'gps'
): LocationData {
  let country = 'India';
  let state = '';
  let district = '';
  let subDistrict = '';
  let city = '';
  let village = '';
  let pincode = '';

  if (Array.isArray(components)) {
    for (const comp of components) {
      const types: string[] = comp.types || [];
      const name: string = comp.long_name || comp.longText || comp.short_name || '';

      if (types.includes('country')) {
        country = name;
      } else if (types.includes('administrative_area_level_1')) {
        state = name;
      } else if (types.includes('administrative_area_level_2')) {
        district = name.replace(/ District$/i, '').replace(/ Dist$/i, '').trim();
      } else if (types.includes('administrative_area_level_3')) {
        subDistrict = name
          .replace(/ Taluk(a)?$/i, '')
          .replace(/ Tehsil$/i, '')
          .replace(/ Mandal$/i, '')
          .trim();
      } else if (types.includes('locality')) {
        city = name;
      } else if (
        types.includes('sublocality') ||
        types.includes('sublocality_level_1') ||
        types.includes('sublocality_level_2') ||
        types.includes('neighborhood')
      ) {
        if (!village) village = name;
      } else if (types.includes('postal_code')) {
        pincode = name;
      }
    }
  }

  // If district is not explicitly found, fallback gracefully
  if (!district && city) district = city;
  if (!subDistrict && village) subDistrict = village;
  if (!village && city) village = city;

  // Fallback to closest known administrative center if state/district were omitted by geocoder
  if (!state || !district) {
    const closest = findClosestUnit(lat, lng);
    state = state || closest.state;
    district = district || closest.district;
    subDistrict = subDistrict || closest.subDistrict;
  }

  const subDistrictType = getSubDistrictLabel(state);

  return {
    id: placeId || `loc-${Date.now()}`,
    latitude: lat,
    longitude: lng,
    country,
    state,
    district,
    subDistrict: subDistrict || district,
    taluka: subDistrictType === 'Taluka' ? subDistrict || district : undefined,
    mandal: subDistrictType === 'Mandal' ? subDistrict || district : undefined,
    tehsil: subDistrictType === 'Tehsil' ? subDistrict || district : undefined,
    city: city || village || district,
    village: village || city || district,
    pincode,
    formattedAddress:
      formattedAddress ||
      `${village || city}, ${subDistrictType}: ${subDistrict || district}, ${district}, ${state}`,
    placeId,
    source,
  };
}

/**
 * Reverse geocodes latitude/longitude coordinates to a full administrative location.
 * Uses Google Geocoding API when available; gracefully falls back to local master locations.
 */
export async function reverseGeocodeLocation(lat: number, lng: number): Promise<LocationData> {
  // Check if Google Maps JS SDK is available in the window
  if (typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });

      if (response && response.results && response.results.length > 0) {
        const bestResult = response.results[0];
        return parseGoogleAddressComponents(
          bestResult.address_components,
          bestResult.formatted_address,
          lat,
          lng,
          bestResult.place_id,
          'gps'
        );
      }
    } catch (err) {
      console.warn('[Google Geocoder] Reverse geocoding warning, falling back to local master data:', err);
    }
  }

  // Fallback: Use KrishiSetu's high-density India spatial database
  const closest = findClosestUnit(lat, lng);
  return {
    id: closest.id,
    latitude: lat,
    longitude: lng,
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
}

/**
 * Forward geocodes an address string to precise coordinates.
 * Returns lat/lng and parsed location data or null if not resolved.
 */
export async function forwardGeocodeAddress(addressText: string): Promise<LocationData | null> {
  if (typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const query = addressText.toLowerCase().includes('india') ? addressText : `${addressText}, India`;
      const response = await geocoder.geocode({
        address: query,
        componentRestrictions: { country: 'IN' },
      });

      if (response && response.results && response.results.length > 0) {
        const bestResult = response.results[0];
        const lat = bestResult.geometry.location.lat();
        const lng = bestResult.geometry.location.lng();
        return parseGoogleAddressComponents(
          bestResult.address_components,
          bestResult.formatted_address,
          lat,
          lng,
          bestResult.place_id,
          'search'
        );
      }
    } catch (err) {
      console.warn('[Google Geocoder] Forward geocode warning:', err);
    }
  }
  return null;
}
