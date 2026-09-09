import React from 'react';
import { LocationData, CropSelectionState } from '../../types/krishi';
import { MapPin, Sparkles, RefreshCw, Scale, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface FarmerDashboardBarProps {
  location: LocationData;
  cropState: CropSelectionState;
  onChangeLocation: () => void;
  onRefreshGps: () => void;
  isDetectingGps: boolean;
  onSelectStep: (step: number) => void;
}

export const FarmerDashboardBar: React.FC<FarmerDashboardBarProps> = ({
  location,
  cropState,
  onChangeLocation,
  onRefreshGps,
  isDetectingGps,
  onSelectStep,
}) => {
  // Determine time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Farmer';
    if (hour < 17) return 'Good afternoon, Farmer';
    return 'Namaste, Farmer';
  };

  const cropName =
    cropState.selectedCrop?.name || cropState.customCropName || 'Paddy (Dhan)';

  return (
    <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left Greeting & Location Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-stone-950 flex items-center justify-center text-xl shadow-sm font-bold shrink-0">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white font-outfit">
                  {getGreeting()} 👋
                </h3>
                <span className="hidden sm:inline text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Live Farm Status
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-md">
                Tracking agricultural price discovery & quality assessment across India.
              </p>
            </div>
          </div>

          {/* Center/Right: Live Farm Status Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* 1. Location Pill */}
            <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="leading-tight">
                <span className="text-[10px] text-stone-400 dark:text-stone-500 block uppercase font-bold">
                  Farm Origin
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-100 truncate max-w-[140px] inline-block">
                  {location.city || location.village || location.district || location.state}
                </span>
              </div>
              <button
                type="button"
                onClick={onChangeLocation}
                className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline ml-1"
              >
                Change
              </button>
            </div>

            {/* 2. Crop Lot Pill */}
            <div
              onClick={() => onSelectStep(2)}
              className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <div className="leading-tight">
                <span className="text-[10px] text-stone-400 dark:text-stone-500 block uppercase font-bold">
                  Crop Lot
                </span>
                <span className="font-bold text-stone-800 dark:text-stone-100">
                  {cropName} • {cropState.quantityValue} {cropState.quantityUnit}
                </span>
              </div>
            </div>

            {/* 3. AI Quality Pill */}
            <div
              onClick={() => onSelectStep(2)}
              className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-xl cursor-pointer hover:shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div className="leading-tight">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block uppercase font-bold">
                  AI Quality
                </span>
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  {cropState.qualityGrade
                    ? `${cropState.qualityGrade} (Confirmed)`
                    : 'Pending Photo'}
                </span>
              </div>
            </div>

            {/* 4. GPS Refresh Button */}
            <button
              type="button"
              onClick={onRefreshGps}
              disabled={isDetectingGps}
              title="Refresh GPS Location"
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin text-amber-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
