import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_BUYERS } from '../../data/mockData';
import { ShieldCheck, Star, Building2, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

export const PublicBuyersPage: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('All');

  const types = ['All', 'Food Processing', 'Retail Chain', 'Wholesale Trader', 'Exporter', 'Agri Aggregator'];

  const filtered = DEMO_BUYERS.filter(b => filterType === 'All' || b.businessType === filterType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="badge-verified text-[11px] mb-2">Verified Network</span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Institutional Buyer Marketplace
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Over 180+ KYC-audited corporate processors, exporters, and retail buyers with guaranteed digital settlement
          </p>
        </div>

        <Link
          to="/login"
          className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-2xs"
        >
          <span>Connect as Farmer / FPO</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === t ? 'bg-brand-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(b => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{b.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{b.location}, {b.district} ({b.distanceKm} km away)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{b.rating}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {b.kycVerified && (
                  <span className="badge-kyc">
                    <ShieldCheck className="w-3 h-3" /> KYC
                  </span>
                )}
                {b.gstVerified && (
                  <span className="badge-verified">
                    <CheckCircle className="w-3 h-3" /> GST
                  </span>
                )}
                <span className="bg-emerald-100/70 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {b.paymentReliabilityPct}% On-Time Pay
                </span>
              </div>

              {/* Procurement requirements */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Buying:</span>
                  <span className="font-bold text-gray-900">{b.requiredCrops.join(', ')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Target Range:</span>
                  <span className="font-bold text-brand-800">₹{b.expectedPriceMin} - ₹{b.expectedPriceMax}/q</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Window:</span>
                  <span className="font-semibold text-gray-900">Within {b.paymentWindowHours} hours</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Quality Spec:</span>
                  <span className="font-semibold text-gray-900">{b.qualityRequirement}</span>
                </div>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full py-2 bg-gray-50 hover:bg-brand-50 hover:text-brand-700 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 text-center transition-colors flex items-center justify-center gap-1"
            >
              <span>Submit Digital Lot Offer</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
