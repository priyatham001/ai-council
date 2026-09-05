import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2, ChevronDown } from 'lucide-react';
import { FarmerLocation, Language } from '../types';
import { getTranslation } from '../lib/translations';

interface LocationCardProps {
  location: FarmerLocation;
  setLocation: (loc: FarmerLocation) => void;
  language: Language;
}

const PRESET_LOCATIONS: FarmerLocation[] = [
  {
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    villageOrTown: 'Bhimavaram',
    lat: 16.5449,
    lng: 81.5212,
    isGps: false,
    isDemo: true
  },
  {
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    villageOrTown: 'Tanuku',
    lat: 16.7570,
    lng: 81.6820,
    isGps: false,
    isDemo: true
  },
  {
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    villageOrTown: 'Palakollu',
    lat: 16.5256,
    lng: 81.7288,
    isGps: false,
    isDemo: true
  },
  {
    state: 'Maharashtra',
    district: 'Nashik',
    villageOrTown: 'Lasalgaon',
    lat: 20.1466,
    lng: 74.2263,
    isGps: false,
    isDemo: true
  },
  {
    state: 'Maharashtra',
    district: 'Nashik',
    villageOrTown: 'Pimpalgaon Baswant',
    lat: 20.1706,
    lng: 73.9856,
    isGps: false,
    isDemo: true
  },
  {
    state: 'Maharashtra',
    district: 'Pune',
    villageOrTown: 'Haveli (Pune)',
    lat: 18.5204,
    lng: 73.8567,
    isGps: false,
    isDemo: true
  }
];

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  setLocation,
  language
}) => {
  const t = getTranslation(language);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        setLocation({
          state: 'Andhra Pradesh',
          district: 'West Godavari',
          villageOrTown: `${position.coords.latitude.toFixed(4)}°N, ${position.coords.longitude.toFixed(4)}°E`,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isGps: true,
          isDemo: false
        });
        setGpsMessage(t.gpsDetected);
      },
      (error) => {
        setIsDetectingGps(false);
        // Fallback gracefully without crashing
        console.warn('GPS location access denied or unavailable:', error.message);
        setGpsMessage('GPS permission denied. Using verified demo farm location in Bhimavaram.');
        setLocation(PRESET_LOCATIONS[0]);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {t.yourLocation}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-gray-500">
                {location.villageOrTown}, {location.district}, {location.state}
              </span>
              {location.isDemo && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                  DEMO BENCHMARK
                </span>
              )}
            </div>
          </div>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleDetectGps}
          disabled={isDetectingGps}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer"
        >
          <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
          <span>{isDetectingGps ? 'Detecting...' : t.detectGps}</span>
        </button>
      </div>

      {gpsMessage && (
        <div className="mb-3 text-xs flex items-center gap-1.5 text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{gpsMessage}</span>
        </div>
      )}

      {/* Inputs: Village/Town, District, State */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {t.villageLabel}
          </label>
          <input
            type="text"
            value={location.villageOrTown}
            onChange={(e) =>
              setLocation({ ...location, villageOrTown: e.target.value, isDemo: true })
            }
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            placeholder="e.g. Bhimavaram / Lasalgaon"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {t.districtLabel}
          </label>
          <input
            type="text"
            value={location.district}
            onChange={(e) =>
              setLocation({ ...location, district: e.target.value, isDemo: true })
            }
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            placeholder="e.g. West Godavari / Nashik"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {t.stateLabel}
          </label>
          <input
            type="text"
            value={location.state}
            onChange={(e) =>
              setLocation({ ...location, state: e.target.value, isDemo: true })
            }
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            placeholder="e.g. Andhra Pradesh / Maharashtra"
          />
        </div>
      </div>

      {/* Quick Regional Presets Dropdown */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-gray-500 font-medium">
          Quick agricultural hubs (SIH Benchmark Data):
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESET_LOCATIONS.map((preset) => {
            const isSelected =
              location.villageOrTown === preset.villageOrTown &&
              location.district === preset.district;
            return (
              <button
                key={`${preset.villageOrTown}-${preset.district}`}
                onClick={() => setLocation(preset)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700'
                }`}
              >
                {preset.villageOrTown} ({preset.district})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
