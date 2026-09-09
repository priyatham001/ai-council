import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  QrCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Filter,
  Eye
} from 'lucide-react';
import { lotService } from '../../services/lotService';
import { DigitalLot, LotStatus } from '../../types';
import { QRCodeModal } from '../../components/common/QRCodeModal';

export const LotsPage: React.FC = () => {
  const [lots, setLots] = useState<DigitalLot[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedLotForQr, setSelectedLotForQr] = useState<DigitalLot | null>(null);

  useEffect(() => {
    const load = () => setLots(lotService.getAllLots());
    load();
    window.addEventListener('smartagrilink_data_changed', load);
    return () => window.removeEventListener('smartagrilink_data_changed', load);
  }, []);

  const filteredLots = lots.filter(lot => {
    if (statusFilter === 'All') return true;
    return lot.status === statusFilter;
  });

  const getStatusColor = (status: LotStatus) => {
    switch (status) {
      case 'Published':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Offers Received':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Offer Accepted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'In Transit':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Delivered':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Payment Processing':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-verified text-[11px]">Digital Inventory</span>
            <span className="text-[11px] font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
              {lots.length} Registered Lots
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Your Digital Crop Lots
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Track produce passports, quality certifications, received bids, and transit dispatches
          </p>
        </div>

        <Link
          to="/farmer/lots/new"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Digital Lot</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {['All', 'Published', 'Offers Received', 'Offer Accepted', 'In Transit', 'Delivered', 'Completed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              statusFilter === s
                ? 'bg-brand-700 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLots.map((lot) => (
          <div
            key={lot.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(lot.status)}`}>
                    {lot.status}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base mt-2">
                    {lot.crop} ({lot.variety})
                  </h3>
                  <div className="text-[11px] font-mono text-gray-700 font-bold mt-0.5">
                    {lot.lotNumber}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLotForQr(lot)}
                  className="p-2 text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 transition-colors shrink-0"
                  title="View QR Code Passport"
                >
                  <QrCode className="w-5 h-5" />
                </button>
              </div>

              {/* Quality & Quantity Banner */}
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-gray-700 block">Quantity</span>
                  <span className="font-bold text-gray-900">{lot.quantityQuintals} q</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-700 block">Quality</span>
                  <span className="font-bold text-emerald-700">{lot.qualityGrade}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-700 block">Score</span>
                  <span className="font-bold text-brand-800">{lot.qualityMetrics.overallScore}/100</span>
                </div>
              </div>

              {/* Harvest details */}
              <div className="text-xs text-gray-700 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-gray-700">Target Price:</span>
                  <span className="font-black text-brand-800">₹{lot.expectedPricePerQ}/q</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Harvest Date:</span>
                  <span className="font-medium text-gray-900">{lot.harvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Location:</span>
                  <span className="font-medium text-gray-900">{lot.location}, {lot.district}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-700 line-clamp-2 pt-1 border-t border-gray-100">
                {lot.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setSelectedLotForQr(lot)}
                className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg text-xs font-bold border border-gray-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-gray-700" />
                <span>Passport</span>
              </button>

              <Link
                to="/farmer/offers"
                className="flex-1 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Offers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <QRCodeModal
        lot={selectedLotForQr}
        isOpen={!!selectedLotForQr}
        onClose={() => setSelectedLotForQr(null)}
      />
    </div>
  );
};
