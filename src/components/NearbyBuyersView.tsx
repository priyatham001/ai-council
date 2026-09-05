import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Building,
  CheckCircle2,
  Shield,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { SAMPLE_BUYERS, CROPS_CATALOG } from '../lib/krishi-data-client';
import { Language } from '../types';
import { getTranslation } from '../lib/translations';

interface NearbyBuyersViewProps {
  language: Language;
  onSelectBuyerCrop: (cropId: string) => void;
  onConnectBuyer?: (buyer: any) => void;
}

export const NearbyBuyersView: React.FC<NearbyBuyersViewProps> = ({
  language,
  onSelectBuyerCrop,
  onConnectBuyer
}) => {
  const t = getTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');

  const filteredBuyers = SAMPLE_BUYERS.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop =
      selectedCrop === 'all' || b.acceptedCrops.includes(selectedCrop);

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Verified Agro-Processors, Mills & FPO Aggregators</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Direct institutional and bulk buyers purchasing commercial harvest lots
            </p>
          </div>

          <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>APMC Registered / Verified Credibility</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search buyer name, mill, or contact person..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Accepted Commodities</option>
              {CROPS_CATALOG.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBuyers.map((buyer) => (
          <div
            key={buyer.id}
            className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {buyer.name}
                  </h3>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{buyer.district}, {buyer.state}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  {buyer.businessType}
                </span>
              </div>

              {/* Accepted Commodities Chips */}
              <div className="mt-3 flex flex-wrap gap-1">
                {buyer.acceptedCrops.map((cId) => {
                  const crop = CROPS_CATALOG.find((c) => c.id === cId);
                  return (
                    <span
                      key={cId}
                      className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium"
                    >
                      {crop ? crop.name : cId}
                    </span>
                  );
                })}
              </div>

              <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Contact Person:</span>
                  <span className="font-semibold text-gray-800">{buyer.contactPerson || 'Procurement Desk'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Daily Intake Capacity:</span>
                  <span className="font-semibold text-gray-800">
                    {buyer.capacityQuintalsPerDay.toLocaleString('en-IN')} qtl/day
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Price Premium:</span>
                  <span className="font-semibold text-emerald-700">+{buyer.indicativePricePremiumPct}% above Mandi</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-500">Associated Mandi:</span>
                  <span className="text-gray-700 font-medium truncate max-w-[150px]">
                    {buyer.marketName}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${buyer.contactPhone}`}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              {onConnectBuyer && (
                <button
                  onClick={() => onConnectBuyer(buyer)}
                  className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Send Offer
                </button>
              )}

              <button
                onClick={() => onSelectBuyerCrop(buyer.acceptedCrops[0] || 'paddy')}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer"
                title="Calculate Net Return for this buyer's crop"
              >
                Quote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
