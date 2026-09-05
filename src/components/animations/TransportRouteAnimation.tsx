import React from 'react';
import { Truck, MapPin, ArrowRight, Gauge, Clock } from 'lucide-react';
import { Language, VehicleTypeId } from '../../types';

interface TransportRouteAnimationProps {
  farmerTown: string;
  marketName: string;
  distanceKm: number;
  vehicleType: VehicleTypeId;
  transportCost: number;
  isRoundTrip: boolean;
  language: Language;
}

export const TransportRouteAnimation: React.FC<TransportRouteAnimationProps> = ({
  farmerTown,
  marketName,
  distanceKm,
  vehicleType,
  transportCost,
  isRoundTrip,
  language
}) => {
  // Estimated rural road travel time (average rural speed ~30-40 km/h)
  const estHours = Math.max(0.5, Math.round((distanceKm / 35) * 10) / 10);

  const getVehicleIcon = () => {
    switch (vehicleType) {
      case 'tractor':
        return '🚜';
      case 'mini_truck':
      case 'pickup':
        return '🛻';
      case 'truck':
        return '🚛';
      default:
        return '🚜';
    }
  };

  return (
    <div className="w-full bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 sm:p-4 my-3">
      <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
        <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
          <span>{getVehicleIcon()}</span>
          <span>
            {language === 'te' ? 'రవాణా మార్గం & దూర లెక్కింపు' : language === 'hi' ? 'परिवहन मार्ग व मालभाड़ा' : language === 'mr' ? 'वाहतूक मार्ग व अंतर' : 'Transport Route & Freight Calculation'}
          </span>
        </span>
        <span className="font-medium bg-white px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-700">
          {isRoundTrip ? (language === 'te' ? 'రాను-పోను (రెండు వైపులా)' : 'Round Trip (2-Way)') : (language === 'te' ? 'ఒక వైపు మాత్రమే' : 'One Way')}
        </span>
      </div>

      {/* Road Visual Container */}
      <div className="relative py-2 select-none overflow-hidden">
        {/* Road Line */}
        <div className="h-3 w-full bg-slate-700 rounded-full relative flex items-center shadow-inner">
          {/* Dashed Center Line */}
          <div className="w-full border-t-2 border-dashed border-amber-300/80 mx-2" />
        </div>

        {/* Animated Moving Vehicle along road */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center">
          <div className="route-vehicle flex items-center gap-1">
            <span className="text-xl sm:text-2xl filter drop-shadow-sm">{getVehicleIcon()}</span>
          </div>
        </div>

        {/* Source & Destination Markers */}
        <div className="flex justify-between items-center mt-3 text-xs">
          {/* Origin */}
          <div className="flex items-center gap-1.5 text-slate-800 font-semibold max-w-[45%]">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="block text-[11px] text-slate-500 font-normal">
                {language === 'te' ? 'రైతు పొలం' : 'Farm'}
              </span>
              <span className="truncate">{farmerTown || 'Bhimavaram'}</span>
            </div>
          </div>

          {/* Center Stats Pill */}
          <div className="flex flex-col items-center bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs text-center shrink-0">
            <span className="text-xs font-bold text-slate-900">
              {distanceKm} km
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              ~{estHours} {language === 'te' ? 'గంటలు' : 'hrs'}
            </span>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-1.5 text-slate-800 font-semibold max-w-[45%] text-right justify-end">
            <div className="truncate">
              <span className="block text-[11px] text-slate-500 font-normal">
                {language === 'te' ? 'లక్ష్య మండి' : 'Destination'}
              </span>
              <span className="truncate">{marketName}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
              <span className="text-xs">🏪</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost summary banner */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-100/80 text-xs">
        <span className="text-slate-600">
          {language === 'te' ? 'మొత్తం అంచనా రవాణా ఖర్చు:' : 'Total Calculated Freight:'}
        </span>
        <span className="font-bold text-slate-900 text-sm text-emerald-800">
          ₹{transportCost.toLocaleString('en-IN')}
        </span>
      </div>

      <style>{`
        @keyframes vehicleTravel {
          0% {
            transform: translateX(5%);
          }
          50% {
            transform: translateX(85%);
          }
          100% {
            transform: translateX(5%);
          }
        }

        .route-vehicle {
          animation: vehicleTravel 12s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .route-vehicle {
            animation: none !important;
            transform: translateX(45%) !important;
          }
        }
      `}</style>
    </div>
  );
};
