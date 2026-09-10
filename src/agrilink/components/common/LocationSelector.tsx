import React from 'react';
import { MapPin, Navigation, RotateCcw } from 'lucide-react';
import { INDIAN_STATES, getDistrictsByState, getMarketsByState } from '../../data/panIndiaData';

interface LocationSelectorProps {
  selectedState: string;
  selectedDistrict: string;
  selectedMarket?: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  onMarketChange?: (market: string) => void;
  showMarketDropdown?: boolean;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedState,
  selectedDistrict,
  selectedMarket,
  onStateChange,
  onDistrictChange,
  onMarketChange,
  showMarketDropdown = true,
  className = ''
}) => {
  const availableDistricts = getDistrictsByState(selectedState);
  const availableMarkets = getMarketsByState(selectedState);

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    onStateChange(newState);
    const newDistricts = getDistrictsByState(newState);
    if (newDistricts.length > 0) {
      onDistrictChange(newDistricts[0]);
    } else {
      onDistrictChange('All');
    }
  };

  const handleReset = () => {
    onStateChange('Maharashtra');
    onDistrictChange('Nashik');
    if (onMarketChange) onMarketChange('All');
  };

  return (
    <div className={`bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
          <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Pan-India Location Hierarchy:</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            State → District → APMC
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-[11px] font-semibold text-gray-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          title="Reset to default region"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* State Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">
            1. Select State / UT
          </label>
          <select
            value={selectedState}
            onChange={handleStateSelect}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st.code} value={st.name}>
                {st.name} ({st.code}) • {st.zone} Zone
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">
            2. Agricultural District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Districts</option>
            {availableDistricts.map((dist, idx) => (
              <option key={idx} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Market Dropdown */}
        {showMarketDropdown && onMarketChange && (
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">
              3. Nearby APMC Mandi Hub
            </label>
            <select
              value={selectedMarket || 'All'}
              onChange={(e) => onMarketChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Mandis in {selectedState}</option>
              {availableMarkets.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.district})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
