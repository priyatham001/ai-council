import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  ThermometerSnowflake,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
  Clock,
  Warehouse
} from 'lucide-react';
import { storageHubService } from '../../services/storageHubService';
import { StorageWarehouse, StorageBooking } from '../../types';
import { showToast } from '../../components/common/Toast';

export const StoragePage: React.FC = () => {
  const [warehouses] = useState<StorageWarehouse[]>(storageHubService.getWarehouses());
  const [bookings, setBookings] = useState<StorageBooking[]>(storageHubService.getBookings());

  const [selectedWhId, setSelectedWhId] = useState<string>(warehouses[0].id);
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState(40);
  const [days, setDays] = useState(4);
  const [startDate, setStartDate] = useState('Sep 08, 2026');

  const selectedWh = warehouses.find(w => w.id === selectedWhId) || warehouses[0];
  const totalCost = storageHubService.calculateStorageCost(selectedWhId, quantity, days);

  const handleBookStorage = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = storageHubService.createBooking({
      warehouseId: selectedWh.id,
      farmerId: 'farmer-ramesh',
      crop,
      quantityQuintals: quantity,
      startDate,
      estimatedDays: days
    });

    setBookings([newBooking, ...bookings]);
    showToast({
      type: 'success',
      title: 'Warehouse Space Reserved! 🏢',
      description: `Booking ${newBooking.bookingNumber} confirmed at ${selectedWh.name}. Gate pass issued.`
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-verified text-[11px]">WDRA Accredited</span>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              e-NWR Receipts Issued
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Cold Storage & Warehouse Hub
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Store harvests to avoid distress selling; hold produce for peak buyer procurement windows
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
          <span className="text-gray-700 block">Available Cold Capacity:</span>
          <span className="font-bold text-brand-800">53,700 quintals across 3 hubs</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Booking Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-brand-700" />
              Reserve Storage Chamber
            </h2>
            <p className="text-[11px] text-gray-700">Calculate tariff and secure space</p>
          </div>

          <form onSubmit={handleBookStorage} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Select Facility</label>
              <select
                value={selectedWhId}
                onChange={(e) => setSelectedWhId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.distanceKm} km) • ₹{w.pricePerDayPerQuintal}/q/day
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Quantity (Quintals)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Holding Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Deposit Start Date</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-medium"
              />
            </div>

            {/* Total Storage Cost Breakdown */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-brand-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-700">
                <span>Daily Storage Rate:</span>
                <span className="font-semibold text-gray-900">₹{selectedWh.pricePerDayPerQuintal} / quintal / day</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Total Days & Quantity:</span>
                <span className="font-semibold text-gray-900">{quantity}q × {days} days</span>
              </div>
              <div className="pt-2 border-t border-brand-200 flex justify-between font-bold text-brand-900 text-sm">
                <span>Estimated Total Storage Cost:</span>
                <span className="text-base font-black text-brand-800">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Warehouse className="w-4 h-4" />
              <span>Book Warehouse Space</span>
            </button>
          </form>
        </div>

        {/* Right 7 cols: Available Warehouses & Active Bookings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Bookings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-700" />
              Active Warehouse Deposits
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
                    <div className="font-bold text-gray-900 text-sm">{bk.warehouseName}</div>
                    <p className="text-gray-700 text-[11px]">
                      {bk.crop} • {bk.quantityQuintals} quintals deposited on {bk.startDate}
                    </p>
                    <div className="text-[11px] text-gray-700">
                      Duration: <b>{bk.estimatedDays} days</b>
                    </div>
                  </div>

                  <div className="text-right self-end sm:self-center">
                    <span className="text-base font-black text-gray-900 block">
                      ₹{bk.totalEstimatedCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">e-NWR Token Generated</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse Directory */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Regional Warehouse Directory</h3>

            <div className="space-y-3">
              {warehouses.map((w) => (
                <div
                  key={w.id}
                  className={`p-4 rounded-xl border text-xs transition-all space-y-2.5 ${
                    w.id === selectedWhId
                      ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-400'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">{w.name}</h4>
                        {w.temperatureControlled && (
                          <span className="badge-ai text-[10px]">
                            <ThermometerSnowflake className="w-3 h-3 text-emerald-600" /> Cold Storage
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-700 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-700" />
                        <span>{w.location}, {w.district} ({w.distanceKm} km)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-brand-800 block">
                        ₹{w.pricePerDayPerQuintal}/q
                      </span>
                      <span className="text-[10px] text-gray-700 font-medium">per day</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-700">
                    <div>
                      <span>Total Capacity:</span>
                      <b className="block text-gray-900">{w.totalCapacityQuintals.toLocaleString('en-IN')} q</b>
                    </div>
                    <div>
                      <span>Available Space:</span>
                      <b className="block text-emerald-700">{w.availableCapacityQuintals.toLocaleString('en-IN')} q</b>
                    </div>
                    <div>
                      <span>Operator:</span>
                      <b className="block text-gray-900 truncate">{w.operator}</b>
                    </div>
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
