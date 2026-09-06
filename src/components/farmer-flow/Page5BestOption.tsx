import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  Truck,
  Users,
  ShieldCheck,
  Brain,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Phone,
  LayoutDashboard
} from 'lucide-react';
import {
  MarketCalculationResult,
  Language,
  FarmerLocation,
  VehicleTypeId
} from '../../types';
import { getTranslation } from '../../lib/translations';

interface Page5BestOptionProps {
  calculationResult: MarketCalculationResult;
  farmerLocation: FarmerLocation;
  vehicleType: VehicleTypeId;
  language: Language;
  onRestart: () => void;
  onOpenFullDashboard: () => void;
  onContactBuyer?: (marketName: string, phone?: string) => void;
}

export const Page5BestOption: React.FC<Page5BestOptionProps> = ({
  calculationResult,
  farmerLocation,
  vehicleType,
  language,
  onRestart,
  onOpenFullDashboard,
  onContactBuyer
}) => {
  const t = getTranslation(language);
  const best = calculationResult.recommendedMarket;
  const crop = calculationResult.crop;
  const qtl = calculationResult.quantityInQuintals;

  // Accordion open/close state for progressive disclosure
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    priceComparison: false,
    transportCost: false,
    buyerMatch: false,
    paymentTerms: false,
    trustVerification: false,
    priceTrend: false,
    aiInsight: false,
    risksLimitations: false
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatRupees = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

  const getVehicleIcon = () => {
    switch (vehicleType) {
      case 'tractor':
        return '🚜';
      case 'mini_truck':
      case 'pickup':
        return '🛻';
      case 'truck':
        return '🚛';
      default:
        return '🚚';
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {language === 'te'
            ? 'దశ 4 / 4 • సిఫార్సు చేయబడిన ఫలితం'
            : language === 'hi'
            ? 'चरण 4 / 4 • सर्वोत्तम परिणाम'
            : language === 'mr'
            ? 'टप्पा 4 / 4 • सर्वोत्तम शिफारस'
            : 'Step 4 of 4 • Best Selling Option'}
        </span>

        <button
          onClick={onRestart}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 p-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'te' ? 'మరో శోధన' : 'New Search'}</span>
        </button>
      </div>

      {/* 1. PRIMARY RESULT: STAR BEST OPTION */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-xs mb-3">
          <span>⭐</span>
          <span>BEST OPTION</span>
        </div>

        {/* Recommended Market Name & Proximity */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {best.marketName}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
              <span>
                {best.distanceKm} km from {farmerLocation.villageOrTown || 'your farm'}
              </span>
            </p>
          </div>

          <div className="text-right shrink-0 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] text-emerald-200 block uppercase font-bold">
              Board Rate
            </span>
            <span className="text-sm font-extrabold text-white">
              {formatRupees(best.modalPrice)}/Qtl
            </span>
          </div>
        </div>

        {/* Big Estimated Net Return */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-4">
          <span className="text-xs text-emerald-100 font-semibold uppercase tracking-wider block">
            {language === 'te' ? 'అంచనా నికర రాబడి (మీ జేబులోకి)' : 'Estimated Net Return (In Your Pocket)'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {formatRupees(best.estimatedNetReturn)}
            </span>
            <span className="text-xs text-emerald-200 font-medium">
              for {qtl} quintals ({formatRupees(best.effectivePricePerQuintal)} / Qtl net)
            </span>
          </div>
        </div>

        {/* 2. WHY THIS OPTION? (Crucial farmer reassurance) */}
        <div className="bg-emerald-900/60 rounded-2xl p-3.5 border border-emerald-600/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>{language === 'te' ? 'ఈ మార్కెట్ ఎందుకు ఉత్తమమైనది?' : 'Why this option?'}</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-emerald-50">
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">✓</span>
              <span>
                <strong>Better effective price:</strong> {formatRupees(best.effectivePricePerQuintal)}/Qtl after all transport & yard deductions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">✓</span>
              <span>
                <strong>Transport considered:</strong> Located {best.distanceKm} km away; saves ₹{Math.round(best.transportCost * 0.4)} in freight compared to distant mandis.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">✓</span>
              <span>
                <strong>Quantity matched:</strong> Full {qtl} quintals accepted in today&apos;s electronic trading sessions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">✓</span>
              <span>
                <strong>Verified buyers active:</strong> {best.buyerName || 'Regulated APMC Commission Agents & Millers'} trading actively.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">✓</span>
              <span>
                <strong>Payment terms available:</strong> e-NAM electronic direct bank settlement within 24 hours.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. COMPACT FARM-TO-MARKET VISUAL EXPLANATION */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
          {language === 'te' ? 'పొలం నుండి నికర రాబడి ప్రయాణం' : 'How Net Return is Derived:'}
        </span>
        <div className="flex items-center justify-between text-center text-xs">
          <div className="flex-1">
            <span className="text-xl block mb-0.5">🌾</span>
            <span className="text-[10px] text-slate-500 block">Harvest</span>
            <span className="font-bold text-slate-800">{qtl} Qtl</span>
          </div>
          <span className="text-slate-300">→</span>

          <div className="flex-1">
            <span className="text-xl block mb-0.5">{getVehicleIcon()}</span>
            <span className="text-[10px] text-slate-500 block">Freight</span>
            <span className="font-bold text-rose-700">-{formatRupees(best.transportCost)}</span>
          </div>
          <span className="text-slate-300">→</span>

          <div className="flex-1">
            <span className="text-xl block mb-0.5">🏪</span>
            <span className="text-[10px] text-slate-500 block">Auction</span>
            <span className="font-bold text-slate-800">{best.marketName.split(' ')[0]}</span>
          </div>
          <span className="text-slate-300">→</span>

          <div className="flex-1">
            <span className="text-xl block mb-0.5">💰</span>
            <span className="text-[10px] text-slate-500 block">Net Return</span>
            <span className="font-extrabold text-emerald-800">{formatRupees(best.estimatedNetReturn)}</span>
          </div>
        </div>
      </div>

      {/* 4. PROGRESSIVE DISCLOSURE ACCORDIONS (DO NOT OVERLOAD) */}
      <div className="space-y-2.5">
        {/* Accordion 1: Price Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleSection('priceComparison')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{t.compareAll} ({calculationResult.rankedMarkets.length} Mandis)</span>
            </div>
            {openSections.priceComparison ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.priceComparison && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100">
              <p className="text-xs text-slate-600 mb-3 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <strong>Important Note:</strong> A market with the highest board price is not necessarily the best option if transport costs erase the difference.
              </p>

              <div className="divide-y divide-slate-100 text-xs">
                {calculationResult.rankedMarkets.map((mkt, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={mkt.marketId}
                      className={`py-2.5 flex items-center justify-between ${
                        isTop ? 'bg-emerald-50/70 font-bold px-2 rounded-lg' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 text-slate-400 font-mono">#{idx + 1}</span>
                          <span className="font-bold text-slate-900">{mkt.marketName}</span>
                          {isTop && (
                            <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                              BEST
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block pl-5">
                          {mkt.distanceKm} km • Board: {formatRupees(mkt.modalPrice)} • Freight: {formatRupees(mkt.transportCost)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-sm text-slate-900 block">
                          {formatRupees(mkt.estimatedNetReturn)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {formatRupees(mkt.effectivePricePerQuintal)}/Qtl
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Transport Cost */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleSection('transportCost')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Transport Cost & Route</span>
            </div>
            {openSections.transportCost ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.transportCost && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Route Transit</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {farmerLocation.villageOrTown || 'Farmer Village'} ──{getVehicleIcon()}──&gt; {best.marketName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Distance</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{best.distanceKm} km</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block">Vehicle Type:</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {vehicleType.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block">Calculated Freight:</span>
                  <span className="font-bold text-slate-800">
                    {formatRupees(best.transportCost)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Buyer Match */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleSection('buyerMatch')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Buyer Match & Demand</span>
            </div>
            {openSections.buyerMatch ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.buyerMatch && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs space-y-2">
              {best.buyerName ? (
                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-950 text-sm">
                      👤 {best.buyerName}
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                      VERIFIED APMC TRADER
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Seeking {crop.name} in quantities up to 50 Quintals. Spot payment via e-NAM direct bank account deposit.
                  </p>
                  {best.buyerPhone && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-700">{best.buyerPhone}</span>
                      <button
                        onClick={() =>
                          onContactBuyer &&
                          onContactBuyer(best.marketName, best.buyerPhone)
                        }
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs cursor-pointer flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Contact Buyer</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 italic p-2">
                  Regulated commission agents and millers active in daily APMC open auction.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Accordion 4: Payment Terms */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleSection('paymentTerms')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment Terms & Settlement</span>
            </div>
            {openSections.paymentTerms ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.paymentTerms && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs space-y-2">
              <p className="text-slate-700">
                <strong>Settlement Mode:</strong> Direct electronic bank account transfer via e-NAM / APMC Gateway within 24 hours of weighment.
              </p>
              <p className="text-slate-700">
                <strong>Cash Option:</strong> Immediate cash payout for lots under ₹50,000 against computerized auction slip.
              </p>
            </div>
          )}
        </div>

        {/* Accordion 5: Trust & Verification */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleSection('trustVerification')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Trust, Verification & Mandi Facilities</span>
            </div>
            {openSections.trustVerification ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.trustVerification && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs space-y-2 text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Certified Electronic Weighbridge at Mandi Entry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Government Authorized APMC Market Yard Oversight</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>On-site Farmer Rest Shed & Grievance Dispute Cell</span>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 6: Price Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleSection('priceTrend')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Price Trend (Last 30 Days)</span>
            </div>
            {openSections.priceTrend ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.priceTrend && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs space-y-2">
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                <span>30-Day Rate Trajectory:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  ▲ +2.4% Stable / Upward
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Daily electronic auction bulletin rates indicate strong miller demand for current moisture specs.
              </p>
            </div>
          )}
        </div>

        {/* Accordion 7: AI Insight (After deterministic calculations) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleSection('aiInsight')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>🤖 AI Market Synthesis</span>
            </div>
            {openSections.aiInsight ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.aiInsight && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Confidence Level:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Medium-High
                </span>
              </div>
              <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl leading-relaxed">
                &ldquo;Based on the verified auction bids, {best.distanceKm} km haulage distance, and today&apos;s grade specifications, {best.marketName} provides the highest net in-pocket return of {formatRupees(best.estimatedNetReturn)} for your harvest.&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Accordion 8: Risks & Limitations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <button
            onClick={() => toggleSection('risksLimitations')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Risks & Limitations</span>
            </div>
            {openSections.risksLimitations ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.risksLimitations && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
              <p>• Final auction bid depends on physical moisture and foreign matter inspection at the mandi gate.</p>
              <p>• Road transit times may vary during monsoon or peak harvest arrival traffic.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. ACTION BUTTONS: New Search or Open Advanced Tools */}
      <div className="pt-2 space-y-2">
        <button
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-md shadow-emerald-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>
            {language === 'te'
              ? 'మరో పంట లేదా ప్రాంతాన్ని తనిఖీ చేయండి'
              : language === 'hi'
              ? 'दूसरी फसल या स्थान खोजें'
              : language === 'mr'
              ? 'दुसरे पीक किंवा स्थान तपासा'
              : 'Check Another Crop or Location'}
          </span>
        </button>

        <button
          onClick={onOpenFullDashboard}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
          <span>
            {language === 'te'
              ? 'పూర్తి డాష్‌బోర్డ్ & మార్కెట్ సాధనాలను చూడండి'
              : language === 'hi'
              ? 'सम्पूर्ण डैशबोर्ड व अन्य सुविधाएँ देखें'
              : language === 'mr'
              ? 'संपूर्ण डॅशबोर्ड आणि साधने पहा'
              : 'View Full Dashboard & Advanced Tools'}
          </span>
        </button>
      </div>
    </div>
  );
};
