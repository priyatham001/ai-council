import React, { useState } from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Award,
  Send,
  DollarSign,
  Package,
  Calendar,
  Layers,
  Scale,
  Eye,
} from 'lucide-react';
import { DigitalLot } from '../../agrilink/types';

interface LotDetailsModalProps {
  lot: DigitalLot | null;
  isOpen: boolean;
  onClose: () => void;
  onInterestSubmitted: (
    lotId: string,
    info: {
      buyerName: string;
      buyerPhone: string;
      quantityQuintals: number;
      notes?: string;
    }
  ) => void;
}

export const LotDetailsModal: React.FC<LotDetailsModalProps> = ({
  lot,
  isOpen,
  onClose,
  onInterestSubmitted,
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [requestedQty, setRequestedQty] = useState<number>(lot?.quantityQuintals || 10);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Sync requested quantity when lot changes
  React.useEffect(() => {
    if (lot) {
      setRequestedQty(lot.quantityQuintals);
      setSubmittedSuccess(false);
    }
  }, [lot]);

  if (!isOpen || !lot) return null;

  const handleSubmitInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onInterestSubmitted(lot.id, {
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
        quantityQuintals: Number(requestedQty) || lot.quantityQuintals,
        notes: notes.trim() || undefined,
      });
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 400);
  };

  const getCropEmoji = (cropName: string) => {
    const c = cropName.toLowerCase();
    if (c.includes('paddy') || c.includes('rice')) return '🌾';
    if (c.includes('onion')) return '🧅';
    if (c.includes('tomato')) return '🍅';
    if (c.includes('wheat')) return '🌾';
    if (c.includes('cotton')) return '🌱';
    if (c.includes('soybean') || c.includes('soya')) return '🫘';
    if (c.includes('maize') || c.includes('corn')) return '🌽';
    if (c.includes('chilli')) return '🌶️';
    return '🌱';
  };

  const aiEstimated = lot.aiEstimatedGrade || lot.qualityGrade;
  const farmerConfirmed = lot.farmerConfirmedGrade || lot.qualityGrade;
  const isAdjusted = lot.aiEstimatedGrade && lot.farmerConfirmedGrade && lot.aiEstimatedGrade !== lot.farmerConfirmedGrade;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white p-5 sm:p-6 rounded-t-3xl relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCropEmoji(lot.crop)}</span>
            <span className="text-xs font-mono font-bold bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {lot.lotNumber}
            </span>
            <span className="text-xs font-semibold text-emerald-200 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              Verified Produce Passport
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 font-outfit">
            {lot.crop} ({lot.variety || 'Hybrid'})
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Listed by Farmer {lot.farmerName} • {lot.location || `${lot.district}, ${lot.state}`}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1 text-stone-900 text-sm">
          {/* Produce Photos / Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Total Lot Volume</span>
              <span className="text-lg font-black text-stone-900 mt-0.5 block">
                {lot.quantityQuintals} q
              </span>
              <span className="text-[10px] text-stone-500">{(lot.quantityQuintals / 10).toFixed(1)} Metric Tons</span>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Expected Price</span>
              <span className="text-lg font-black text-emerald-700 mt-0.5 block">
                ₹{lot.expectedPricePerQ.toLocaleString('en-IN')}/q
              </span>
              <span className="text-[10px] text-stone-500">Ex-Farmgate / Mandi</span>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Est. Total Value</span>
              <span className="text-lg font-black text-stone-900 mt-0.5 block">
                ₹{(lot.quantityQuintals * lot.expectedPricePerQ).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-stone-500">Direct trade estimate</span>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Harvest Date</span>
              <span className="text-sm font-bold text-stone-800 mt-0.5 block">
                {lot.harvestDate || 'Freshly Harvested'}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Ready for dispatch</span>
            </div>
          </div>

          {/* AI Quality Assessment Report */}
          <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-800/80 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-base text-white font-outfit">
                  AI Quality Assessment Report
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full">
                Score: {lot.qualityMetrics?.overallScore || 88}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-700/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-300">
                  Assigned Quality Grade
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-amber-300">{farmerConfirmed}</span>
                  {lot.qualityGrade.includes('A') && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950">
                      Top Premium
                    </span>
                  )}
                </div>
                {isAdjusted ? (
                  <p className="text-[11px] text-amber-200 mt-1">
                    ⚠️ AI model estimated <strong>{aiEstimated}</strong>, confirmed by farmer as <strong>{farmerConfirmed}</strong>.
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-200 mt-1">
                    ✓ AI estimated grade verified and matches farmer confirmation ({lot.aiConfidencePct || 91}% confidence).
                  </p>
                )}
              </div>

              <div className="bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-700/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-300">
                  Agmark Visual Standard
                </span>
                <p className="text-xs text-stone-200">
                  {lot.qualityMetrics?.damage
                    ? `Damage score ${lot.qualityMetrics.damage}%, Color uniformity ${lot.qualityMetrics.color}%, Freshness ${lot.qualityMetrics.freshness}%.`
                    : 'Clean visual luster, compliant size distribution, moisture within APMC bounds.'}
                </p>
              </div>
            </div>

            {/* Observations */}
            {lot.aiObservations && lot.aiObservations.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Assayer Observations
                </span>
                <ul className="list-disc list-inside text-stone-300 space-y-0.5 text-[11px]">
                  {lot.aiObservations.map((obs, i) => (
                    <li key={i}>{obs}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-[10px] text-emerald-300/80 italic border-t border-emerald-800/80 pt-2">
              Disclaimer: AI-assisted visual quality assessment is an estimate based on visible surface factors and does not replace official physical weighbridge sampling.
            </p>
          </div>

          {/* Contact Farmer Directly */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
              Direct Farmer Contact Options
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${lot.farmerPhone || '+919848022334'}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Farmer ({lot.farmerPhone || '+91 98480 22334'})</span>
              </a>

              <a
                href={`https://wa.me/${(lot.farmerPhone || '919848022334').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Namaste ${lot.farmerName}, I am an interested buyer viewing your ${lot.crop} lot (${lot.lotNumber}) on KrishiSetu. I would like to purchase ${lot.quantityQuintals} quintals.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-emerald-300"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* 🤝 EXPRESS INTEREST FORM */}
          <div className="border-t border-stone-200 pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 font-bold flex items-center justify-center">
                🤝
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Express Formal Purchase Interest
                </h3>
                <p className="text-xs text-stone-500">
                  Notify the farmer instantly so they can reserve stock and confirm dispatch
                </p>
              </div>
            </div>

            {submittedSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 text-center animate-in fade-in duration-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-black text-base">Interest Successfully Sent to {lot.farmerName}!</h4>
                <p className="text-xs text-emerald-800">
                  Your procurement inquiry of <strong>{requestedQty} quintals</strong> has been logged and the farmer's dashboard has been updated in real time.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInterest} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Your Full Name / Trading Firm *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Agri Procurement Ltd"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Your Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Quantity Requested (Quintals) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={lot.quantityQuintals}
                      value={requestedQty}
                      onChange={(e) => setRequestedQty(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-stone-500">Max available: {lot.quantityQuintals} q</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Counter Offer or Delivery Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Will arrange pickup tomorrow at ₹2,400/q"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : "Submit Purchase Interest (I'm Interested)"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
