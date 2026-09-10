import { LocationData } from '../types/krishi';
import { getSubDistrictLabel, findClosestUnit, queryLocations } from '../data/indiaWideLocations';

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
 * Priority:
 * 1. Server-side /api/geocode/reverse proxy (Google Geocoding with attribution -> OSM Nominatim -> high-density spatial master)
 * 2. Client-side Google Geocoder (if SDK initialized)
 * 3. Client-side OpenStreetMap Nominatim
 * 4. KrishiSetu high-density India spatial database
 */
export async function reverseGeocodeLocation(lat: number, lng: number): Promise<LocationData> {
  // 1. Try server geocoding endpoint
  try {
    const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.district) {
        return {
          id: `loc-${lat.toFixed(4)}-${lng.toFixed(4)}`,
          latitude: lat,
          longitude: lng,
          country: 'India',
          state: data.state || 'Andhra Pradesh',
          district: data.district,
          subDistrict: data.subDistrict || data.district,
          taluka: data.subDistrictType === 'Taluka' ? data.subDistrict : undefined,
          mandal: data.subDistrictType === 'Mandal' ? data.subDistrict : undefined,
          tehsil: data.subDistrictType === 'Tehsil' ? data.subDistrict : undefined,
          city: data.city || data.village || data.district,
          village: data.village,
          pincode: data.pincode,
          formattedAddress: data.formattedAddress,
          source: (data.source as any) || 'gps',
        };
      }
    }
  } catch (err) {
    console.warn('[ReverseGeocode] Server endpoint unreachable, trying client fallbacks:', err);
  }

  // 2. Check if Google Maps JS SDK is available in the window
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
      console.warn('[Google Geocoder] Client geocoder warning:', err);
    }
  }

  // 3. Client-side OSM Nominatim fallback
  try {
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`
    );
    if (osmRes.ok) {
      const osmData = await osmRes.json();
      if (osmData && osmData.address) {
        const addr = osmData.address;
        const country = 'India';
        const state = addr.state || '';
        const district = (addr.state_district || addr.county || addr.district || '').replace(/ District$/i, '').trim();
        const subDistrict = (addr.taluk || addr.tehsil || addr.subdistrict || '').trim();
        const city = addr.city || addr.town || addr.municipality || addr.village || addr.hamlet || district;
        const village = addr.village || addr.hamlet || addr.suburb || city;
        const cleanParts = [village || city, district, state, country].filter(Boolean);

        return {
          id: `loc-${lat.toFixed(4)}-${lng.toFixed(4)}`,
          latitude: lat,
          longitude: lng,
          country: 'India',
          state: state || 'Andhra Pradesh',
          district: district || city,
          subDistrict: subDistrict || district,
          taluka: getSubDistrictLabel(state) === 'Taluka' ? subDistrict : undefined,
          mandal: getSubDistrictLabel(state) === 'Mandal' ? subDistrict : undefined,
          tehsil: getSubDistrictLabel(state) === 'Tehsil' ? subDistrict : undefined,
          city: city || district,
          village: village,
          pincode: addr.postcode,
          formattedAddress: cleanParts.join(', '),
          source: 'gps',
        };
      }
    }
  } catch (err) {
    console.warn('[Nominatim Geocoder] Direct client warning:', err);
  }

  // 4. Fallback: Use KrishiSetu's high-density India spatial database
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
  // 1. Try server search
  try {
    const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(addressText)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        const top = data.results[0];
        const state = top.state || 'Andhra Pradesh';
        return {
          id: `search-${top.lat.toFixed(4)}-${top.lng.toFixed(4)}`,
          latitude: top.lat,
          longitude: top.lng,
          country: 'India',
          state: state,
          district: top.district || top.name,
          subDistrict: top.district || top.name,
          city: top.name,
          formattedAddress: top.formattedAddress,
          source: 'search',
        };
      }
    }
  } catch (err) {
    console.warn('[ForwardGeocode] Server search warning:', err);
  }

  // 2. Try window.google.maps.Geocoder
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

  // 3. Fallback to local queryLocations
  const local = queryLocations(addressText, 1);
  if (local.length > 0) {
    const closest = local[0];
    return {
      id: closest.id,
      latitude: closest.latitude,
      longitude: closest.longitude,
      country: 'India',
      state: closest.state,
      district: closest.district,
      subDistrict: closest.subDistrict,
      city: closest.name,
      formattedAddress: `${closest.name}, ${closest.district}, ${closest.state}, India`,
      source: 'search',
    };
  }

  return null;
}
