import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Phone,
  Clock
} from 'lucide-react';
import { logisticsService } from '../../services/logisticsService';
import { lotService } from '../../services/lotService';
import { LogisticsVehicle, LogisticsBooking } from '../../types';
import { showToast } from '../../components/common/Toast';

export const LogisticsPage: React.FC = () => {
  const [vehicles] = useState<LogisticsVehicle[]>(logisticsService.getAvailableVehicles());
  const [bookings, setBookings] = useState<LogisticsBooking[]>(logisticsService.getBookings());

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[1]?.id || vehicles[0].id);
  const [distanceKm, setDistanceKm] = useState<number>(35);
  const [pickupLocation, setPickupLocation] = useState('Somaram Farm-Gate, Bhimavaram');
  const [dropLocation, setDropLocation] = useState('Tadepalligudem Food Park');
  const [scheduledDate, setScheduledDate] = useState('Today, 02:00 PM');

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  const estimatedCost = logisticsService.calculateFreightCost(selectedVehicleId, distanceKm);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = logisticsService.createBooking({
      lotId: 'lot-tom-00421',
      farmerId: 'farmer-ramesh',
      vehicleId: selectedVehicle.id,
      pickupLocation,
      dropLocation,
      distanceKm,
      scheduledDate
    });

    setBookings([newBooking, ...bookings]);
    showToast({
      type: 'success',
      title: 'Transport Vehicle Dispatched! 🚚',
      description: `Booking ${newBooking.bookingNumber} confirmed. Driver ${selectedVehicle.driverName} is en route.`
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-verified text-[11px]">Farm-to-Mandi Highway</span>
            <span className="text-[11px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
              GPS Tracked Vehicles
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Logistics & Transport Dispatch
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Book verified local commercial haulers with transparent, regulated freight tariffs
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
          <span className="text-gray-700 block">Current Route:</span>
          <span className="font-bold text-gray-900">Bhimavaram → Tadepalligudem (35 km)</span>
        </div>
      </div>

      {/* Animated Logistics Progress Timeline: FARM → PICKUP → TRANSPORT → MANDI → BUYER */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white p-6 rounded-2xl border border-emerald-800 shadow-xl overflow-hidden relative">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-400" />
            Live Logistics Highway Protocol
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700">
            GPS Fleet Tracking: Active
          </span>
        </div>

        <div className="overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center justify-between min-w-[560px] relative px-4">
            {/* Active connecting line */}
            <div className="absolute top-5 left-10 right-10 h-1 bg-stone-800 -z-0">
              <div className="h-full w-3/5 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 animate-pulse" />
            </div>

            {/* Step 1: FARM */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-stone-950 font-bold flex items-center justify-center text-lg shadow-lg ring-4 ring-emerald-400/20">
                🌾
              </div>
              <span className="text-xs font-black text-emerald-300">FARM</span>
              <span className="text-[10px] text-stone-400">Harvest Ready</span>
            </div>

            {/* Step 2: PICKUP */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow-lg ring-4 ring-emerald-400/20">
                📦
              </div>
              <span className="text-xs font-black text-emerald-300">PICKUP</span>
              <span className="text-[10px] text-stone-400">Farm-Gate Loading</span>
            </div>

            {/* Step 3: TRANSPORT */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-lg shadow-lg ring-4 ring-amber-400/40 animate-bounce">
                🚚
              </div>
              <span className="text-xs font-black text-amber-300">TRANSPORT</span>
              <span className="text-[10px] text-amber-300 font-mono">In Transit (35km)</span>
            </div>

            {/* Step 4: MANDI */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 font-bold flex items-center justify-center text-lg border border-stone-700">
                🏪
              </div>
              <span className="text-xs font-bold text-stone-400">MANDI</span>
              <span className="text-[10px] text-stone-500">Weighbridge Clear</span>
            </div>

            {/* Step 5: BUYER */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 font-bold flex items-center justify-center text-lg border border-stone-700">
                🏢
              </div>
              <span className="text-xs font-bold text-stone-400">BUYER</span>
              <span className="text-[10px] text-stone-500">Final Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Booking Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-700" />
              Request Farm-Gate Transport
            </h2>
            <p className="text-[11px] text-gray-700">Calculate fare and dispatch truck</p>
          </div>

          <form onSubmit={handleBook} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Select Vehicle Type</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.capacityQuintals}q capacity)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Pickup Point</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Destination Mandi / Factory</label>
              <input
                type="text"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">One-Way Distance (km)</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Pickup Time</label>
                <input
                  type="text"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Calculated Fare Summary */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-brand-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-700">
                <span>Base Dispatch Fare:</span>
                <span className="font-semibold text-gray-900">₹{selectedVehicle.baseFare}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Per Km Rate ({distanceKm} km × ₹{selectedVehicle.perKmRate}):</span>
                <span className="font-semibold text-gray-900">₹{distanceKm * selectedVehicle.perKmRate}</span>
              </div>
              <div className="pt-2 border-t border-brand-200 flex justify-between font-bold text-brand-900 text-sm">
                <span>Total Freight Quote:</span>
                <span className="text-base font-black text-brand-800">₹{estimatedCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Confirm & Dispatch Driver</span>
            </button>
          </form>
        </div>

        {/* Right 7 cols: Available Fleet Directory & Active Bookings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Logistics Bookings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-700" />
              Active Dispatch Bookings
            </h3>

            <div className="space-y-3">
              {bookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-800">{bk.bookingNumber}</span>
                      <span className="badge-verified text-[10px]">{bk.status}</span>
                    </div>
                    <div className="font-bold text-gray-900 text-sm">{bk.vehicleName}</div>
                    <p className="text-gray-700 text-[11px]">
                      {bk.pickupLocation} → {bk.dropLocation} ({bk.distanceKm} km)
                    </p>
                    <div className="text-[11px] text-gray-700">
                      Driver: <b>{bk.driverName}</b> ({bk.driverPhone})
                    </div>
                  </div>

                  <div className="text-right self-end sm:self-center">
                    <span className="text-base font-black text-gray-900 block">
                      ₹{bk.totalEstimatedCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-gray-700 font-medium">{bk.scheduledDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fleet Catalog */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Commercial Vehicle Roster</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all space-y-2 ${
                    v.id === selectedVehicleId
                      ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-400'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{v.name}</h4>
                      <span className="text-[11px] text-gray-700 block mt-0.5">
                        Capacity: {v.capacityQuintals} quintals
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{v.rating}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-gray-700 text-[11px] pt-1 border-t border-gray-100">
                    <span>Rate: ₹{v.perKmRate}/km</span>
                    <span>Base: ₹{v.baseFare}</span>
                  </div>

                  <div className="text-[11px] text-gray-700 flex items-center justify-between">
                    <span>Driver: {v.driverName}</span>
                    <span className={v.available ? 'text-emerald-700 font-bold' : 'text-gray-700'}>
                      {v.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
