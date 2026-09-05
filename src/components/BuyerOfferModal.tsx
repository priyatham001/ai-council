import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { BuyerProfile, MarketComparisonItem } from '../types';

interface BuyerOfferModalProps {
  buyer?: BuyerProfile | null;
  market?: MarketComparisonItem | null;
  cropName: string;
  quantity: number;
  unit: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const BuyerOfferModal: React.FC<BuyerOfferModalProps> = ({
  buyer,
  market,
  cropName,
  quantity,
  unit,
  onClose,
  onSuccess
}) => {
  const targetName = buyer?.name || market?.marketName || 'Buyer / Yard';
  const initialPrice = market?.cropPricePerQuintal || 2250;

  const [expectedPrice, setExpectedPrice] = useState(initialPrice);
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [pickupDate, setPickupDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [farmerPhone, setFarmerPhone] = useState('+91 ');
  const [notes, setNotes] = useState('Crop is well dried with under 12% moisture.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(
      `Your offer of ${quantity} ${unit} of ${cropName} (${grade}) at ₹${expectedPrice}/quintal has been transmitted to ${targetName}. Their procurement representative will contact you via ${farmerPhone}.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-200 mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Direct Linkage Request</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg">{targetName}</h3>
            <p className="text-xs text-emerald-200">
              Send your harvest batch offer directly to buyer / procurement agent
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-emerald-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Crop & Quantity
              </label>
              <input
                type="text"
                disabled
                value={`${cropName} • ${quantity} ${unit}`}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Quality Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800"
              >
                <option value="Grade A">Grade A (Premium clean)</option>
                <option value="Grade B">Grade B (Standard APMC)</option>
                <option value="Grade C">Grade C (Fair Average)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Expected Price (₹/quintal)
              </label>
              <input
                type="number"
                required
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Preferred Pickup / Sale Date
              </label>
              <input
                type="date"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Your Contact Phone Number
            </label>
            <input
              type="tel"
              required
              value={farmerPhone}
              onChange={(e) => setFarmerPhone(e.target.value)}
              placeholder="+91 98480 12345"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Remarks on Moisture / Packaging / Variety
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              Offers submitted are indicative and establish direct seller-buyer dialogue. Physical lot inspection will confirm payment release according to APMC / Buyer guidelines.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Direct Offer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
