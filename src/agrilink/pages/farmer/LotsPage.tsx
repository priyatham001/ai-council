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
  Eye,
  Users,
  Phone,
  MessageCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { lotService } from '../../services/lotService';
import { DigitalLot, LotStatus } from '../../types';
import { QRCodeModal } from '../../components/common/QRCodeModal';

export const LotsPage: React.FC = () => {
  const [lots, setLots] = useState<DigitalLot[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedLotForQr, setSelectedLotForQr] = useState<DigitalLot | null>(null);
  const [selectedLotForBuyers, setSelectedLotForBuyers] = useState<DigitalLot | null>(null);

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

              {/* Interested Buyers Banner */}
              {lot.interestedBuyers && lot.interestedBuyers.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSelectedLotForBuyers(lot)}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center justify-between transition-colors cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>{lot.interestedBuyers.length} Verified Buyer{lot.interestedBuyers.length > 1 ? 's' : ''} Interested</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                    View & Call →
                  </span>
                </button>
              ) : (
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 px-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live on Buyer Marketplace • Awaiting incoming inquiries</span>
                </div>
              )}

              <p className="text-[11px] text-gray-700 line-clamp-2 pt-1 border-t border-gray-100">
                {lot.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setSelectedLotForQr(lot)}
                className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg text-xs font-bold border border-gray-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-gray-700" />
                <span>Passport</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLotForBuyers(lot)}
                className="flex-1 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Buyers ({lot.interestedBuyers?.length || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <QRCodeModal
        lot={selectedLotForQr}
        isOpen={!!selectedLotForQr}
        onClose={() => setSelectedLotForQr(null)}
      />

      {/* Interested Buyers List Modal */}
      {selectedLotForBuyers && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                  Direct Buyer Demand
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-1">
                  Interested Buyers for {selectedLotForBuyers.crop}
                </h3>
                <p className="text-xs text-stone-600">
                  Lot: {selectedLotForBuyers.lotNumber} • {selectedLotForBuyers.quantityQuintals} Quintals
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLotForBuyers(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedLotForBuyers.interestedBuyers && selectedLotForBuyers.interestedBuyers.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {selectedLotForBuyers.interestedBuyers.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{b.buyerName}</h4>
                        <span className="text-[11px] text-stone-500 font-medium">
                          Requested: <strong className="text-emerald-700">{b.quantityQuintals} Quintals</strong>
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {b.notes && (
                      <p className="text-xs text-stone-700 italic bg-white p-2 rounded-lg border border-stone-200">
                        "{b.notes}"
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${b.buyerPhone}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call ({b.buyerPhone})</span>
                      </a>

                      <a
                        href={`https://wa.me/${b.buyerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Namaste ${b.buyerName}, I saw your interest in my ${selectedLotForBuyers.crop} lot (${selectedLotForBuyers.lotNumber}) on KrishiSetu. Let us discuss delivery.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2 text-stone-500">
                <Users className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-xs font-semibold">No buyer inquiries registered yet for this lot.</p>
                <p className="text-[11px] text-stone-400">
                  Your lot is actively promoted to verified institutional buyers and local aggregators.
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLotForBuyers(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <QRCodeModal
        lot={selectedLotForQr}
        isOpen={!!selectedLotForQr}
        onClose={() => setSelectedLotForQr(null)}
      />
    </div>
  );
};
