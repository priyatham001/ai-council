import React, { useState, useMemo } from 'react';
import { X, Calculator, ArrowRight, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { netRealizationService, MarketCostBreakdown } from '../../services/netRealizationService';
import { DEMO_MARKETS } from '../../data/mockData';

interface NetRealizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCrop?: string;
  initialQuantity?: number;
}

export const NetRealizationModal: React.FC<NetRealizationModalProps> = ({
  isOpen,
  onClose,
  initialCrop = 'Tomato',
  initialQuantity = 40
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [storageDays, setStorageDays] = useState<number>(0);

  // Market 1 settings (e.g. Bhimavaram - closer, moderate price)
  const [market1Id, setMarket1Id] = useState<string>('mkt-bhimavaram');
  const [customPrice1, setCustomPrice1] = useState<number>(2450);

  // Market 2 settings (e.g. Tadepalligudem or Vijayawada - farther, higher price)
  const [market2Id, setMarket2Id] = useState<string>('mkt-tadepalligudem');
  const [customPrice2, setCustomPrice2] = useState<number>(2580);

  const m1 = DEMO_MARKETS.find(m => m.id === market1Id) || DEMO_MARKETS[0];
  const m2 = DEMO_MARKETS.find(m => m.id === market2Id) || DEMO_MARKETS[1];

  const breakdown1: MarketCostBreakdown = useMemo(() => {
    return netRealizationService.calculateSingle({
      marketId: m1.id,
      marketName: m1.name,
      distanceKm: m1.distanceKm,
      pricePerQ: customPrice1,
      quantityQuintals: quantity,
      storageDays
    });
  }, [m1, customPrice1, quantity, storageDays]);

  const breakdown2: MarketCostBreakdown = useMemo(() => {
    return netRealizationService.calculateSingle({
      marketId: m2.id,
      marketName: m2.name,
      distanceKm: m2.distanceKm,
      pricePerQ: customPrice2,
      quantityQuintals: quantity,
      storageDays
    });
  }, [m2, customPrice2, quantity, storageDays]);

  const diff = breakdown2.netRealization - breakdown1.netRealization;
  const isM2Better = diff >= 0;
  const absDiff = Math.abs(diff);
  const winner = isM2Better ? breakdown2 : breakdown1;
  const runnerUp = isM2Better ? breakdown1 : breakdown2;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-gray-100 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-brand-50 to-emerald-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Net Realization Calculator
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-brand-200 text-brand-900 px-2 py-0.5 rounded">
                  Core Mandi Tool
                </span>
              </h2>
              <p className="text-xs text-gray-700">
                Gross Quote minus Freight, Labour & Holding = True Net Cash In Hand
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/80 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Top Inputs: Quantity & Holding Days */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Crop Quantity (Quintals)
              </label>
              <input
                type="number"
                min="1"
                max="2000"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Storage / Holding Period (Days)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={storageDays}
                onChange={(e) => setStorageDays(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-gray-700 mb-1">Active Commodity</span>
              <span className="text-sm font-bold text-brand-800 bg-brand-100/70 px-3 py-2 rounded-lg border border-brand-200 inline-block">
                {initialCrop} (40q Standard Lot)
              </span>
            </div>
          </div>

          {/* Side-by-side Market Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market 1 Card */}
            <div className={`p-5 rounded-xl border transition-all ${!isM2Better ? 'bg-emerald-50/50 border-brand-500 shadow-md ring-2 ring-brand-400/30' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Option A (Local / Closer)
                </span>
                {!isM2Better && (
                  <span className="badge-verified">
                    <CheckCircle className="w-3 h-3" /> Highest Net Payout
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Select Market</label>
                  <select
                    value={market1Id}
                    onChange={(e) => {
                      setMarket1Id(e.target.value);
                      const m = DEMO_MARKETS.find(x => x.id === e.target.value);
                      if (m) setCustomPrice1(m.modalPrice);
                    }}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold bg-white"
                  >
                    {DEMO_MARKETS.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.distanceKm} km)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Offered Price (₹ / quintal)</label>
                  <input
                    type="number"
                    value={customPrice1}
                    onChange={(e) => setCustomPrice1(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-900"
                  />
                </div>

                {/* Deductions Breakdown */}
                <div className="pt-3 border-t border-gray-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-700">
                    <span>Gross Sale Value ({quantity}q × ₹{breakdown1.quotedPricePerQ}):</span>
                    <span className="font-semibold text-gray-900">₹{breakdown1.grossSaleValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Freight / Transport ({breakdown1.distanceKm} km):</span>
                    <span>-₹{breakdown1.transportCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Handling & Hamali (Labour):</span>
                    <span>-₹{breakdown1.handlingCost.toLocaleString('en-IN')}</span>
                  </div>
                  {storageDays > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Holding / Storage ({storageDays} days):</span>
                      <span>-₹{breakdown1.storageCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-rose-600">
                    <span>Weighment & Cess (0.5%):</span>
                    <span>-₹{breakdown1.otherCharges.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Final Net Realization Box */}
                <div className="mt-4 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-700">Net Cash Realization</div>
                  <div className="text-2xl font-black text-gray-900">
                    ₹{breakdown1.netRealization.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-medium text-emerald-700 mt-0.5">
                    ₹{breakdown1.netRealizationPerQ.toLocaleString('en-IN')} / quintal net
                  </div>
                </div>
              </div>
            </div>

            {/* Market 2 Card */}
            <div className={`p-5 rounded-xl border transition-all ${isM2Better ? 'bg-emerald-50/50 border-brand-500 shadow-md ring-2 ring-brand-400/30' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Option B (Alternative / Farther)
                </span>
                {isM2Better && (
                  <span className="badge-verified">
                    <CheckCircle className="w-3 h-3" /> Highest Net Payout
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Select Market</label>
                  <select
                    value={market2Id}
                    onChange={(e) => {
                      setMarket2Id(e.target.value);
                      const m = DEMO_MARKETS.find(x => x.id === e.target.value);
                      if (m) setCustomPrice2(m.modalPrice);
                    }}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold bg-white"
                  >
                    {DEMO_MARKETS.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.distanceKm} km)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Offered Price (₹ / quintal)</label>
                  <input
                    type="number"
                    value={customPrice2}
                    onChange={(e) => setCustomPrice2(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-900"
                  />
                </div>

                {/* Deductions Breakdown */}
                <div className="pt-3 border-t border-gray-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-700">
                    <span>Gross Sale Value ({quantity}q × ₹{breakdown2.quotedPricePerQ}):</span>
                    <span className="font-semibold text-gray-900">₹{breakdown2.grossSaleValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Freight / Transport ({breakdown2.distanceKm} km):</span>
                    <span>-₹{breakdown2.transportCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Handling & Hamali (Labour):</span>
                    <span>-₹{breakdown2.handlingCost.toLocaleString('en-IN')}</span>
                  </div>
                  {storageDays > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Holding / Storage ({storageDays} days):</span>
                      <span>-₹{breakdown2.storageCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-rose-600">
                    <span>Weighment & Cess (0.5%):</span>
                    <span>-₹{breakdown2.otherCharges.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Final Net Realization Box */}
                <div className="mt-4 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-700">Net Cash Realization</div>
                  <div className="text-2xl font-black text-gray-900">
                    ₹{breakdown2.netRealization.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-medium text-emerald-700 mt-0.5">
                    ₹{breakdown2.netRealizationPerQ.toLocaleString('en-IN')} / quintal net
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Highlight Comparison Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-700 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-brand-100 font-semibold">
                  Net Realization Advantage
                </div>
                <div className="text-base font-bold">
                  {winner.marketName} gives{' '}
                  <span className="underline decoration-white/60 font-black text-white">
                    ₹{absDiff.toLocaleString('en-IN')} more
                  </span>{' '}
                  in true net realization!
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-brand-100">Takeaway per quintal</div>
              <div className="text-sm font-bold text-white">
                +₹{Math.round(absDiff / quantity)} / q extra
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-2xl">
          <span className="text-xs text-gray-700 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-gray-700" />
            Freight calculated at ₹30/km base + ₹800 fixed dispatch fare
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand-700 text-white rounded-lg text-sm font-semibold hover:bg-brand-800 transition-colors shadow-sm"
          >
            Apply Decision
          </button>
        </div>
      </div>
    </div>
  );
};
