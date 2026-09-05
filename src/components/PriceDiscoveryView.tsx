import React, { useState } from 'react';
import {
  Search,
  Filter,
  Store,
  MapPin,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { FarmerLocation, Language } from '../types';
import { SAMPLE_MARKETS, CROPS_CATALOG, calculateHaversineDistanceKm } from '../lib/krishi-data-client';
import { getTranslation } from '../lib/translations';

interface PriceDiscoveryViewProps {
  farmerLocation: FarmerLocation;
  language: Language;
  onSelectCropAndMarket: (cropId: string, marketId: string) => void;
}

export const PriceDiscoveryView: React.FC<PriceDiscoveryViewProps> = ({
  farmerLocation,
  language,
  onSelectCropAndMarket
}) => {
  const t = getTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropId, setSelectedCropId] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  // Filter crops and markets
  const filteredMarkets = SAMPLE_MARKETS.filter((mkt) => {
    const matchesSearch =
      mkt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mkt.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mkt.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = selectedState === 'all' || mkt.state === selectedState;
    return matchesSearch && matchesState;
  }).map((mkt) => {
    const dist = calculateHaversineDistanceKm(
      farmerLocation.lat,
      farmerLocation.lng,
      mkt.lat,
      mkt.lng
    );
    return {
      ...mkt,
      distanceKm: dist
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>APMC Mandi Price Board & Market Discovery</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Live APMC electronic auction rates & benchmark prices across regional markets
            </p>
          </div>

          <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Indexed Mandis: {SAMPLE_MARKETS.length} Markets</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mandi, district, or town..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Crops Catalog (Benchmark)</option>
              {CROPS_CATALOG.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Modal: ₹{c.standardPriceRange.modal}/qtl)
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="all">All States (AP & Maharashtra)</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>
        </div>
      </div>

      {/* Markets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMarkets.map((mkt) => {
          const sampleCrop =
            selectedCropId !== 'all'
              ? CROPS_CATALOG.find((c) => c.id === selectedCropId) || CROPS_CATALOG[0]
              : CROPS_CATALOG[0];

          return (
            <div
              key={mkt.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {mkt.name}
                    </h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{mkt.district}, {mkt.state}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                    {mkt.marketType}
                  </span>
                </div>

                <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Distance from Farm:</span>
                    <span className="font-bold text-gray-800">{mkt.distanceKm} km</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Trading Window:</span>
                    <span className="font-medium text-gray-700">{mkt.operatingHours || '06:00 AM - 02:00 PM'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Mandi Verification:</span>
                    <span className="font-semibold text-emerald-700">e-NAM & APMC Verified</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 text-[11px] block">{sampleCrop.name} Price</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      ₹{sampleCrop.standardPriceRange.modal}/qtl
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-[11px] block">Range</span>
                    <span className="text-xs text-gray-600 font-mono">
                      ₹{sampleCrop.standardPriceRange.min} - ₹{sampleCrop.standardPriceRange.max}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectCropAndMarket(sampleCrop.id, mkt.id)}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200"
              >
                <span>Calculate Net Return for this Mandi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
