import React from 'react';
import { Truck, HelpCircle, Repeat, Fuel } from 'lucide-react';
import { VehicleTypeId, Language } from '../types';
import { VEHICLE_CONFIGS } from '../lib/krishi-data-client';
import { getTranslation } from '../lib/translations';

interface TransportConfigCardProps {
  vehicleType: VehicleTypeId;
  setVehicleType: (type: VehicleTypeId) => void;
  customRatePerKm: number;
  setCustomRatePerKm: (rate: number) => void;
  isRoundTrip: boolean;
  setIsRoundTrip: (round: boolean) => void;
  quantityInQuintals: number;
  language: Language;
}

export const TransportConfigCard: React.FC<TransportConfigCardProps> = ({
  vehicleType,
  setVehicleType,
  customRatePerKm,
  setCustomRatePerKm,
  isRoundTrip,
  setIsRoundTrip,
  quantityInQuintals,
  language
}) => {
  const t = getTranslation(language);

  const selectedVehicle =
    VEHICLE_CONFIGS.find((v) => v.id === vehicleType) || VEHICLE_CONFIGS[0];

  const tripsNeeded = Math.ceil(
    (quantityInQuintals || 1) / selectedVehicle.capacityQuintals
  );

  const handleSelectVehicle = (id: VehicleTypeId) => {
    setVehicleType(id);
    const v = VEHICLE_CONFIGS.find((item) => item.id === id);
    if (v) {
      setCustomRatePerKm(v.baseRatePerKm);
    }
  };

  const getVehicleName = (v: typeof selectedVehicle) => {
    if (language === 'te') return v.nameTelugu;
    if (language === 'hi') return v.nameHindi;
    return v.name;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {t.transportSettings}
            </h2>
            <p className="text-xs text-gray-500">
              Transport freight directly determines real take-home net profit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <Fuel className="w-3.5 h-3.5" />
          <span>Configurable Freight Model</span>
        </div>
      </div>

      {/* Vehicle Type Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {VEHICLE_CONFIGS.filter((v) => v.id !== 'custom').map((v) => {
          const isSelected = vehicleType === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => handleSelectVehicle(v.id)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                  : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-gray-900">
                  {getVehicleName(v)}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Capacity: <span className="font-semibold text-gray-700">{v.capacityQuintals} qtl</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 text-[11px]">Default Rate:</span>
                <span className="font-mono font-bold text-emerald-800">
                  ₹{v.baseRatePerKm}/km
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Rate Configuration & Round Trip */}
      <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t.ratePerKm} (Adjustable)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              min={5}
              max={200}
              value={customRatePerKm}
              onChange={(e) => setCustomRatePerKm(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <span className="text-[11px] text-gray-400 mt-0.5 block">
            Baseline: ₹{selectedVehicle.baseRatePerKm}/km
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Loading / Unloading Porterage
          </label>
          <div className="text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
            ₹{selectedVehicle.loadingChargePerQuintal} / quintal
          </div>
          <span className="text-[11px] text-gray-400 mt-0.5 block">
            Standard APMC labor fee
          </span>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer mt-2 sm:mt-0">
            <input
              type="checkbox"
              checked={isRoundTrip}
              onChange={(e) => setIsRoundTrip(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                {t.roundTrip}
              </span>
              <span className="text-[11px] text-gray-500 block">
                {isRoundTrip
                  ? 'Charges applied for 2-way vehicle journey'
                  : 'Calculated as one-way freight'}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Trips Advisory Banner */}
      {tripsNeeded > 1 && (
        <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            Harvest batch of <strong>{quantityInQuintals} quintals</strong> exceeds the single-trip capacity ({selectedVehicle.capacityQuintals} qtl) of {selectedVehicle.name}. Transport requires <strong>{tripsNeeded} vehicle trips</strong>.
          </span>
        </div>
      )}
    </div>
  );
};
