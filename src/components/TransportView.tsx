import React, { useState } from 'react';
import {
  Truck,
  Phone,
  CheckCircle,
  Star,
  MapPin,
  Calendar,
  Send,
  X,
  AlertCircle
} from 'lucide-react';
import { TransporterProfile, VehicleTypeId, Language } from '../types';
import { getTranslation } from '../lib/translations';
import { SAMPLE_TRANSPORTERS } from '../lib/krishi-data-client';

interface TransportViewProps {
  language: Language;
}

export const TransportView: React.FC<TransportViewProps> = ({ language }) => {
  const t = getTranslation(language);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [selectedTransporter, setSelectedTransporter] = useState<TransporterProfile | null>(null);
  const [requestSentMessage, setRequestSentMessage] = useState<string | null>(null);
  
  // Modal form state
  const [pickupLocation, setPickupLocation] = useState('Bhimavaram Rural');
  const [pickupDate, setPickupDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [cropBatch, setCropBatch] = useState('Paddy (10 Quintals)');
  const [destinationMandi, setDestinationMandi] = useState('Tanuku Commercial APMC Mandi');

  const filteredTransporters = SAMPLE_TRANSPORTERS.filter((trans) => {
    if (selectedVehicleType !== 'all' && trans.vehicleType !== selectedVehicleType) {
      return false;
    }
    return true;
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransporter) return;

    setRequestSentMessage(
      `Transport request sent to ${selectedTransporter.name} for ${cropBatch} from ${pickupLocation} to ${destinationMandi} on ${pickupDate}. Transporter will call you shortly.`
    );
    setSelectedTransporter(null);

    setTimeout(() => {
      setRequestSentMessage(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-teal-800 to-emerald-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-teal-900/60 px-3 py-1 rounded-full text-xs font-semibold text-teal-200 mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Farm Logistics & Transport Linkage</span>
          </div>
          <h1 className="text-2xl font-bold">
            {t.navTransport} (Registered Rural Freight)
          </h1>
          <p className="text-teal-100 text-sm mt-1">
            Connect directly with verified agricultural transporters, mini-truck drivers, and tractor operators in your district.
          </p>
        </div>
      </div>

      {/* Success alert message */}
      {requestSentMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-start gap-3 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Request Submitted Successfully!</p>
            <p className="text-emerald-800">{requestSentMessage}</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 mr-1">
          Vehicle Filter:
        </span>
        {[
          { id: 'all', label: 'All Vehicles' },
          { id: 'mini_truck', label: 'Mini Truck (Tata Ace)' },
          { id: 'pickup', label: 'Pickup (Mahindra 407)' },
          { id: 'tractor', label: 'Tractor Trolley' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedVehicleType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              selectedVehicleType === tab.id
                ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transporters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredTransporters.map((trans) => (
          <div
            key={trans.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">
                      {trans.name}
                    </h3>
                    {trans.verified && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    {trans.vehicleName}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 text-amber-900 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>{trans.rating}</span>
                  <span className="text-[10px] text-gray-500 font-normal">
                    ({trans.tripsCompleted} trips)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-700 border border-gray-100">
                <div>
                  <span className="text-gray-400 block text-[11px]">Capacity</span>
                  <span className="font-bold text-gray-900">
                    {trans.capacityQuintals} Quintals
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Benchmark Rate</span>
                  <span className="font-bold text-emerald-700">
                    ₹{trans.ratePerKm} / km
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Base Location</span>
                  <span className="font-medium text-gray-800">
                    {trans.baseLocation}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">State / District</span>
                  <span className="font-medium text-gray-800">
                    {trans.district}, {trans.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
              <a
                href={`tel:${trans.contactPhone}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <span>Call Transporter</span>
              </a>

              <button
                onClick={() => setSelectedTransporter(trans)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Transport</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Request Transport Modal */}
      {selectedTransporter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Request Transport</h3>
                <p className="text-xs text-emerald-200">
                  {selectedTransporter.name} • {selectedTransporter.vehicleName}
                </p>
              </div>
              <button
                onClick={() => setSelectedTransporter(null)}
                className="text-white hover:text-emerald-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Farm Pickup Location (Village / Land)
                </label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Crop & Estimated Weight
                  </label>
                  <input
                    type="text"
                    required
                    value={cropBatch}
                    onChange={(e) => setCropBatch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Destination APMC Mandi / Delivery Yard
                </label>
                <input
                  type="text"
                  required
                  value={destinationMandi}
                  onChange={(e) => setDestinationMandi(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span>Rate Benchmark: </span>
                  <span className="font-bold">
                    ₹{selectedTransporter.ratePerKm} / km
                  </span>
                  . Final loading/unloading arrangement is settled directly with the driver at farm gate.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedTransporter(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Send Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
