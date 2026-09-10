import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Sparkles,
  Check,
  X,
  MessageSquare,
  AlertCircle,
  Building2,
  Scale,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { offerService } from '../../services/offerService';
import { lotService } from '../../services/lotService';
import { localStorageService } from '../../services/storageService';
import { BuyerOffer, DigitalLot, FarmerPersona } from '../../types';
import { showToast } from '../../components/common/Toast';

export const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<BuyerOffer[]>([]);
  const [lots, setLots] = useState<DigitalLot[]>([]);
  const [persona, setPersona] = useState<FarmerPersona>(localStorageService.getPersona());
  const [selectedLotId, setSelectedLotId] = useState<string>('');
  const [messageModalBuyer, setMessageModalBuyer] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const load = () => {
      const allLots = lotService.getAllLots();
      const allOffers = offerService.getAllOffers();
      const currentPersona = localStorageService.getPersona();
      setLots(allLots);
      setOffers(allOffers);
      setPersona(currentPersona);

      // Default selected lot to persona's matching crop lot or first lot
      if (!selectedLotId && allLots.length > 0) {
        const personaCrop = (currentPersona.crop || currentPersona.primaryCrop || '').toLowerCase();
        const matching = allLots.find(l => 
          l.crop.toLowerCase().includes(personaCrop) || 
          personaCrop.includes(l.crop.toLowerCase())
        );
        setSelectedLotId(matching ? matching.id : allLots[0].id);
      }
    };
    load();
    window.addEventListener('smartagrilink_data_changed', load);
    window.addEventListener('smartagrilink_persona_changed', load);
    return () => {
      window.removeEventListener('smartagrilink_data_changed', load);
      window.removeEventListener('smartagrilink_persona_changed', load);
    };
  }, [selectedLotId]);

  const activeLot = lots.find(l => l.id === selectedLotId) || lots[0];
  const lotOffers = activeLot ? offerService.getOffersForLot(activeLot.id) : [];

  // Sort by highest Net Realization
  const sortedOffers = [...lotOffers].sort((a, b) => b.totalNetRealization - a.totalNetRealization);
  const bestOffer = sortedOffers[0];
  const bestOfferId = bestOffer?.id;

  const handleAcceptOffer = (offerId: string) => {
    const res = offerService.acceptOffer(offerId);
    if (res.success) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback gracefully
      }

      showToast({
        type: 'success',
        title: 'Offer Accepted! Deal Locked 🎉',
        description: 'Transaction and Escrow Hold initiated. Proceeding to Transaction Tracker.'
      });

      setTimeout(() => {
        navigate('/farmer/transactions');
      }, 1200);
    }
  };

  const handleRejectOffer = (offerId: string) => {
    offerService.rejectOffer(offerId);
    showToast({
      type: 'info',
      title: 'Offer Declined',
      description: 'Buyer will be notified to revise their bid.'
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    showToast({
      type: 'success',
      title: 'Message Sent to Buyer Desk',
      description: `Your message to ${messageModalBuyer} has been logged in the direct deal chat.`
    });
    setMessageModalBuyer(null);
    setMessageText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-verified text-[11px]">Commercial Deal Room</span>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Ranked by True Net Realization
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Received Buyer Offers
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Compare bids based on freight-adjusted net takeaway cash in bank — NOT just raw quoted gross price.
          </p>
        </div>

        {/* Lot Selector Dropdown */}
        {lots.length > 0 && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-bold text-gray-700">Active Lot:</span>
            <select
              value={activeLot?.id}
              onChange={(e) => setSelectedLotId(e.target.value)}
              className="px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
            >
              {lots.map(l => (
                <option key={l.id} value={l.id}>
                  {l.crop} ({l.quantityQuintals}q) • {l.lotNumber} ({l.state || 'India'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Lot Snapshot Bar */}
      {activeLot && (
        <div className="bg-emerald-950 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="font-bold text-emerald-200">{activeLot.crop} ({activeLot.variety})</span>
              <span className="text-emerald-400 mx-2">•</span>
              <span className="font-mono text-white">{activeLot.lotNumber}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-emerald-200">
            <span>Origin: <b className="text-white">{activeLot.district}, {activeLot.state || persona.state}</b></span>
            <span>Lot Size: <b className="text-white">{activeLot.quantityQuintals} quintals</b></span>
            <span>Grade: <b className="text-white">{activeLot.qualityGrade}</b></span>
            <span>Target Price: <b className="text-white">₹{activeLot.expectedPricePerQ}/q</b></span>
          </div>
        </div>
      )}

      {/* BEST NET REALIZATION Hero Card */}
      {bestOffer && activeLot && (
        <div className="bg-gradient-to-br from-brand-900 via-emerald-950 to-brand-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-800 relative overflow-hidden space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Top Recommended Realization
                </span>
                <span className="text-xs text-emerald-200">
                  {bestOffer.buyerName}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                ₹{bestOffer.estimatedNetRealizationPerQ.toLocaleString('en-IN')}{' '}
                <span className="text-sm font-normal text-emerald-300">/ quintal take-home in bank</span>
              </h2>
            </div>

            {bestOffer.status === 'Pending' && (
              <button
                onClick={() => handleAcceptOffer(bestOffer.id)}
                className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <Check className="w-4 h-4" />
                <span>Lock Top Realization Deal</span>
              </button>
            )}
          </div>

          {/* Equation Ribbon: Gross - Freight - Handling = Net Cash */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">1. Quoted Gross</span>
              <div className="text-lg font-black text-white mt-0.5">
                ₹{bestOffer.offeredPricePerQ.toLocaleString('en-IN')}/q
              </div>
              <span className="text-[10px] text-gray-300 block mt-0.5">
                Total: ₹{bestOffer.grossSaleValue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-rose-300 block">2. Logistics Freight</span>
              <div className="text-lg font-black text-rose-300 mt-0.5">
                -₹{bestOffer.transportAllowance.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-rose-200 block mt-0.5">
                {bestOffer.buyerDistanceKm} km door-to-gate
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">3. Mandi Cess & Handling</span>
              <div className="text-lg font-black text-amber-300 mt-0.5">
                -₹{bestOffer.handlingCost.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-amber-200 block mt-0.5">
                Unloading & Weighment
              </span>
            </div>

            <div className="bg-emerald-500/20 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-400/50">
              <span className="text-[10px] uppercase font-black text-emerald-300 block">4. Total Net Bank Payout</span>
              <div className="text-xl font-black text-emerald-300 mt-0.5">
                ₹{bestOffer.totalNetRealization.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-100 font-bold block mt-0.5">
                100% Escrow Protected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Offers Cards Grid */}
      <div className="space-y-4">
        {sortedOffers.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 space-y-3">
            <DollarSign className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold text-gray-900 text-sm">No Offers Received Yet for this Lot</h3>
            <p className="text-xs text-gray-700 max-w-sm mx-auto">
              Your lot is live on the marketplace. Verified institutional buyers will submit bids matching your specifications shortly.
            </p>
          </div>
        ) : (
          sortedOffers.map((offer, index) => {
            const isBest = offer.id === bestOfferId;
            const isAccepted = offer.status === 'Accepted';
            const isRejected = offer.status === 'Rejected';

            return (
              <div
                key={offer.id}
                className={`bg-white rounded-2xl border p-6 transition-all shadow-2xs space-y-4 ${
                  isAccepted
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/30'
                    : isBest
                    ? 'border-brand-500 ring-2 ring-brand-400/20 shadow-md'
                    : 'border-gray-200'
                }`}
              >
                {/* Offer Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-base">{offer.buyerName}</h3>
                        {isBest && !isAccepted && (
                          <span className="badge-verified text-[10px] font-black uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 text-amber-500" /> Highest Net Realization
                          </span>
                        )}
                        {isAccepted && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Deal Locked
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700 mt-0.5">
                        <span>{offer.buyerLocation}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{offer.buyerReliabilityPct}% On-Time Pay Record</span>
                        <span>•</span>
                        <span>Rating: {offer.buyerRating} ★</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-700 block">Offer Number</span>
                    <span className="font-mono text-xs font-bold text-gray-700">{offer.offerNumber}</span>
                  </div>
                </div>

                {/* Net Realization vs Quoted Gross Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200/80 text-xs">
                  <div>
                    <span className="text-[11px] text-gray-700 block">Quoted Gross Price</span>
                    <div className="text-lg font-bold text-gray-900 mt-0.5">
                      ₹{offer.offeredPricePerQ.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] font-normal text-gray-700">/q</span>
                    </div>
                    <span className="text-[10px] text-gray-700">
                      Gross: ₹{offer.grossSaleValue.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-rose-600 font-medium block">Freight Deduction</span>
                    <div className="text-lg font-bold text-rose-600 mt-0.5">
                      -₹{offer.transportAllowance.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-gray-700">
                      Distance: {offer.buyerDistanceKm} km
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-700 block">Payment Settlement</span>
                    <div className="text-base font-bold text-gray-900 mt-0.5">
                      {offer.paymentTerms}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Direct Escrow
                    </span>
                  </div>

                  <div className="bg-emerald-100/70 p-2.5 rounded-lg border border-emerald-300">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-900 block">
                      True Net Realization
                    </span>
                    <div className="text-xl font-black text-brand-900">
                      ₹{offer.totalNetRealization.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 block">
                      ₹{offer.estimatedNetRealizationPerQ.toLocaleString('en-IN')}/q in hand
                    </span>
                  </div>
                </div>

                {offer.notes && (
                  <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded-lg border border-gray-100">
                    "{offer.notes}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-gray-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-700" />
                    Offered {new Date(offer.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMessageModalBuyer(offer.buyerName)}
                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-gray-700" />
                      <span>Negotiate / Message</span>
                    </button>

                    {!isAccepted && !isRejected && (
                      <>
                        <button
                          onClick={() => handleRejectOffer(offer.id)}
                          className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-gray-200 transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept Offer & Lock Deal</span>
                        </button>
                      </>
                    )}

                    {isAccepted && (
                      <Link
                        to="/farmer/transactions"
                        className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <span>Track Deal & Payment</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Modal */}
      {messageModalBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-100">
            <h3 className="text-base font-bold text-gray-900">
              Direct Negotiation with {messageModalBuyer}
            </h3>
            <p className="text-xs text-gray-700">
              Send a counter-offer, ask about pickup scheduling, or clarify quality dockage policies.
            </p>
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="e.g., Can you arrange farm-gate pickup by tomorrow 10 AM if we agree on the revised price?"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setMessageModalBuyer(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
