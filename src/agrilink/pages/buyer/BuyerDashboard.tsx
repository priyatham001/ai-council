import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Truck,
  Filter,
  Layers,
  Sparkles,
  Send,
  CreditCard
} from 'lucide-react';
import { buyerService } from '../../services/buyerService';
import { lotService } from '../../services/lotService';
import { offerService } from '../../services/offerService';
import { transactionService } from '../../services/transactionService';
import { BuyerDemandRequirement, DigitalLot, Transaction } from '../../types';
import { showToast } from '../../components/common/Toast';

export const BuyerDashboard: React.FC = () => {
  const [requirements, setRequirements] = useState<BuyerDemandRequirement[]>(buyerService.getRequirements());
  const [lots, setLots] = useState<DigitalLot[]>(lotService.getAllLots());
  const [transactions, setTransactions] = useState<Transaction[]>(transactionService.getAll());
  const [activeTab, setActiveTab] = useState<'demands' | 'lots' | 'orders'>('demands');

  // New demand form state (Section 24 Requirement)
  const [newCrop, setNewCrop] = useState('Tomato');
  const [newQtyRange, setNewQtyRange] = useState('100–300 quintals');
  const [newGrade, setNewGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [newPriceMin, setNewPriceMin] = useState(2500);
  const [newPriceMax, setNewPriceMax] = useState(2750);
  const [newLocation, setNewLocation] = useState('Tadepalligudem Food Processing Yard');
  const [newDate, setNewDate] = useState('Sep 12–18, 2026');
  const [newTerms, setNewTerms] = useState('Within 48 hours via Direct Escrow');

  // Make offer modal
  const [selectedLotForOffer, setSelectedLotForOffer] = useState<DigitalLot | null>(null);
  const [offeredPrice, setOfferedPrice] = useState(2680);
  const [transportAllowance, setTransportAllowance] = useState(3200);

  useEffect(() => {
    const load = () => {
      setRequirements(buyerService.getRequirements());
      setLots(lotService.getAllLots());
      setTransactions(transactionService.getAll());
    };
    load();
    window.addEventListener('smartagrilink_data_changed', load);
    return () => window.removeEventListener('smartagrilink_data_changed', load);
  }, []);

  const handleCreateDemand = (e: React.FormEvent) => {
    e.preventDefault();
    const created = buyerService.createRequirement({
      buyerId: 'buyer-lakshmi',
      buyerName: 'Sri Lakshmi Agro Foods',
      crop: newCrop,
      quantityRange: newQtyRange,
      qualityGrade: newGrade,
      targetPriceMin: newPriceMin,
      targetPriceMax: newPriceMax,
      deliveryLocation: newLocation,
      targetDeliveryDate: newDate,
      paymentTerms: newTerms
    });

    setRequirements([created, ...requirements]);
    showToast({
      type: 'success',
      title: 'Procurement Demand Published!',
      description: `Targeting ${newCrop} ${newQtyRange} at ₹${newPriceMin}–₹${newPriceMax}/q. Matched with farmer lots.`
    });
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotForOffer) return;

    offerService.createOffer({
      lotId: selectedLotForOffer.id,
      buyerId: 'buyer-lakshmi',
      buyerName: 'Sri Lakshmi Agro Foods',
      buyerRating: 4.8,
      buyerLocation: 'Tadepalligudem (28 km)',
      buyerDistanceKm: 28,
      buyerReliabilityPct: 96,
      offeredPricePerQ: offeredPrice,
      quantityQuintals: selectedLotForOffer.quantityQuintals,
      transportAllowance,
      handlingCost: 1000,
      paymentTerms: 'Within 48 hours via Direct Escrow',
      notes: 'Direct institutional purchase from processing unit. Guaranteed escrow settlement upon weighment.'
    });

    showToast({
      type: 'success',
      title: 'Commercial Offer Submitted!',
      description: `Offer of ₹${offeredPrice}/q sent to ${selectedLotForOffer.farmerName} for Lot ${selectedLotForOffer.lotNumber}.`
    });
    setSelectedLotForOffer(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-kyc text-[11px]">KYC & GSTIN Verified Corporate</span>
            <span className="text-[11px] font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded font-bold">
              Escrow Facility Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Sri Lakshmi Agro Foods — Procurement Console
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Publish raw commodity procurement demands, inspect matching farmer lots, and issue digital purchase contracts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs">
            <span className="text-[10px] text-gray-700 block">Escrow Balance Allocated</span>
            <span className="font-black text-emerald-800 text-sm">₹15,00,000</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('demands')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${
            activeTab === 'demands' ? 'bg-brand-700 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Active Procurement Demands ({requirements.length})
        </button>
        <button
          onClick={() => setActiveTab('lots')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${
            activeTab === 'lots' ? 'bg-brand-700 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Matched Farmer Lots ({lots.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${
            activeTab === 'orders' ? 'bg-brand-700 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Accepted Orders & Payouts ({transactions.length})
        </button>
      </div>

      {/* Tab 1: Demands & Create Demand Form */}
      {activeTab === 'demands' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Demand Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-700" />
                Post New Procurement Demand
              </h3>
              <p className="text-[11px] text-gray-700">Broadcast your specifications to regional farmers & FPOs</p>
            </div>

            <form onSubmit={handleCreateDemand} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Required Crop</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                >
                  <option value="Tomato">Tomato (Pulping Grade)</option>
                  <option value="Paddy (BPT-5204)">Paddy (BPT-5204)</option>
                  <option value="Chilli (Guntur Teja)">Chilli (Guntur Teja)</option>
                  <option value="Onion (Nasik Red)">Onion (Nasik Red)</option>
                  <option value="Banana (Grand Naine)">Banana (Grand Naine)</option>
                  <option value="Maize (Yellow Corn)">Maize (Yellow Corn)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Volume</label>
                  <input
                    type="text"
                    value={newQtyRange}
                    onChange={(e) => setNewQtyRange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Required Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                  >
                    <option value="Grade A">Grade A Only</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Commercial Mill Grade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Min Price (₹/q)</label>
                  <input
                    type="number"
                    value={newPriceMin}
                    onChange={(e) => setNewPriceMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Price (₹/q)</label>
                  <input
                    type="number"
                    value={newPriceMax}
                    onChange={(e) => setNewPriceMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Unloading Delivery Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Payment Settlement Term</label>
                <input
                  type="text"
                  value={newTerms}
                  onChange={(e) => setNewTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Post Procurement Demand</span>
              </button>
            </form>
          </div>

          {/* Active Demands Roster (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-gray-900 text-base">Your Active Demands on the Network</h3>

              <div className="space-y-3">
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">{req.crop}</h4>
                          <span className="badge-verified text-[10px]">{req.qualityGrade}</span>
                        </div>
                        <span className="text-gray-700 text-[11px] block mt-0.5">
                          Target Volume: <b>{req.quantityRange}</b>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-brand-800 block">
                          ₹{req.targetPriceMin} – ₹{req.targetPriceMax}/q
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {req.matchedLotsCount} Matched Lots
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-700">
                      <span>Delivery: {req.deliveryLocation}</span>
                      <span>Terms: {req.paymentTerms}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Matched Farmer Lots */}
      {activeTab === 'lots' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
            <h3 className="font-bold text-gray-900 text-base mb-1">
              Available Farmer & FPO Lots for Procurement
            </h3>
            <p className="text-xs text-gray-700 mb-4">
              Verified lots certified with digital quality scores ready for direct bids
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lots.map((lot) => (
                <div
                  key={lot.id}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-brand-400 transition-all text-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {lot.qualityGrade} ({lot.qualityMetrics.overallScore}/100)
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm mt-1">{lot.crop} ({lot.variety})</h4>
                        <span className="text-[10px] font-mono text-gray-700">{lot.lotNumber}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-gray-900 block">{lot.quantityQuintals} q</span>
                        <span className="text-[10px] text-gray-700">₹{lot.expectedPricePerQ}/q target</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-700 pt-1 border-t border-gray-100">
                      Farmer: <b>{lot.farmerName}</b> • {lot.location}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLotForOffer(lot);
                      setOfferedPrice(lot.expectedPricePerQ + 50);
                    }}
                    className="w-full py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>Submit Commercial Bid</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Orders & Escrow Payments */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-gray-900 text-base">Fulfillment Orders & Escrow Releases</h3>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900">{t.transactionNumber}</span>
                    <span className="badge-verified text-[10px]">{t.status}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mt-1">{t.crop} ({t.quantityQuintals}q)</h4>
                  <div className="text-[11px] text-gray-700">
                    Seller: <b>{t.farmerName}</b> • Escrow UTR: <span className="font-mono">{t.paymentUtr}</span>
                  </div>
                </div>

                <div className="text-right self-end sm:self-center">
                  <span className="text-base font-black text-gray-900 block">
                    ₹{t.grossAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold block">
                    Escrow: {t.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Commercial Offer Modal */}
      {selectedLotForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-100">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                Submit Bid for {selectedLotForOffer.crop}
              </h3>
              <p className="text-xs text-gray-700">
                Lot {selectedLotForOffer.lotNumber} ({selectedLotForOffer.quantityQuintals} quintals • {selectedLotForOffer.qualityGrade})
              </p>
            </div>

            <form onSubmit={handleSendOffer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Offered Price (₹ / quintal)</label>
                <input
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Freight / Transport Allowance (₹)</label>
                <input
                  type="number"
                  value={transportAllowance}
                  onChange={(e) => setTransportAllowance(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-brand-200 text-xs space-y-1">
                <div className="flex justify-between text-gray-700">
                  <span>Gross Contract:</span>
                  <span className="font-bold text-gray-900">
                    ₹{(offeredPrice * selectedLotForOffer.quantityQuintals).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Farmer Net Realization:</span>
                  <span className="font-black">
                    ₹{((offeredPrice * selectedLotForOffer.quantityQuintals) - transportAllowance - 1000).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLotForOffer(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs shadow-sm"
                >
                  Send Formal Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
