import React, { useState } from 'react';
import { MapPin, CheckCircle2, User, ArrowRight, Sparkles } from 'lucide-react';
import { FarmerLocation, Language } from '../types';
import { getTranslation } from '../lib/translations';

interface OnboardingModalProps {
  onComplete: (location: FarmerLocation, farmerName?: string) => void;
  language: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onComplete,
  language
}) => {
  const t = getTranslation(language);
  const [name, setName] = useState('');
  const [location, setLocation] = useState<FarmerLocation>({
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    villageOrTown: 'Bhimavaram',
    lat: 16.5449,
    lng: 81.5212,
    isGps: false,
    isDemo: true
  });
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const presets = [
    {
      label: '🌾 Bhimavaram (West Godavari, AP)',
      state: 'Andhra Pradesh',
      district: 'West Godavari',
      villageOrTown: 'Bhimavaram',
      lat: 16.5449,
      lng: 81.5212
    },
    {
      label: '🧅 Lasalgaon (Nashik, Maharashtra)',
      state: 'Maharashtra',
      district: 'Nashik',
      villageOrTown: 'Lasalgaon',
      lat: 20.1466,
      lng: 74.2263
    },
    {
      label: '🍇 Pune APMC Yard (Maharashtra)',
      state: 'Maharashtra',
      district: 'Pune',
      villageOrTown: 'Gultekdi',
      lat: 18.4975,
      lng: 73.8647
    },
    {
      label: '🌶️ Guntur Market Yard (AP)',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      villageOrTown: 'Guntur',
      lat: 16.3067,
      lng: 80.4365
    }
  ];

  const handleGpsDetect = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            state: 'Detected State',
            district: 'Detected District',
            villageOrTown: 'Current Farm GPS',
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
            isGps: true,
            isDemo: false
          });
          setIsDetectingGps(false);
        },
        (_err) => {
          // Fallback to preset
          setIsDetectingGps(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingGps(false);
    }
  };

  const handleFinish = () => {
    onComplete(location, name.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 to-teal-700 text-white p-6">
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 2 of 2 • Setup Profile</span>
          </div>
          <h2 className="text-xl font-bold">{t.onboardingTitle}</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            {t.onboardingSubtitle}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Optional Farmer Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.farmerNameOptional}</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Patil / K. Venkateswara Rao"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Location presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.selectLocationTitle} (Quick Hub Presets)</span>
              </span>
              <button
                type="button"
                onClick={handleGpsDetect}
                className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer text-xs"
              >
                {isDetectingGps ? 'Detecting...' : `📍 ${t.detectGps}`}
              </button>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {presets.map((p, idx) => {
                const isSelected =
                  location.villageOrTown === p.villageOrTown &&
                  location.district === p.district;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setLocation({
                        state: p.state,
                        district: p.district,
                        villageOrTown: p.villageOrTown,
                        lat: p.lat,
                        lng: p.lng,
                        isGps: false,
                        isDemo: true
                      })
                    }
                    className={`p-3 rounded-xl text-left border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'border-gray-200 hover:border-emerald-300 text-gray-700 bg-white'
                    }`}
                  >
                    <span>{p.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {/* Current coordinates summary */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex flex-wrap items-center justify-between gap-2 text-gray-600">
              <div>
                <span className="font-semibold text-gray-800">
                  {location.villageOrTown}, {location.district}
                </span>{' '}
                ({location.state})
              </div>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200">
                {location.lat}°N, {location.lng}°E
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>{t.startExploringBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
