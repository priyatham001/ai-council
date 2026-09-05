import React from 'react';
import {
  HelpCircle,
  Calculator,
  Truck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../lib/translations';

interface HelpViewProps {
  language: Language;
}

export const HelpView: React.FC<HelpViewProps> = ({ language }) => {
  const t = getTranslation(language);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-600" />
          <span>How Smart Krishi Market Works</span>
        </h2>
        <p className="text-sm text-gray-600">
          Understanding the Net Return formula and how factoring in transportation saves thousands of rupees for farmers.
        </p>
      </div>

      {/* The Core Discovery / Mathematical Rule */}
      <div className="bg-linear-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-700 space-y-4">
        <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          <Scale className="w-3.5 h-3.5" />
          <span>The Golden Principle</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white">
          Why Highest Board Price Does NOT Equal Highest Profit
        </h3>

        <p className="text-sm text-emerald-100 leading-relaxed">
          Many farmers travel long distances to distant mandis after seeing higher price board quotations on WhatsApp or phone calls. However, long-distance freight, loading labor, and two-way vehicle tariffs often wipe out the price gain.
        </p>

        {/* The Exact Formula Box */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 font-mono text-sm space-y-2">
          <div className="text-xs text-amber-300 uppercase tracking-widest font-sans font-bold">
            The Net Return Formula:
          </div>
          <div className="text-emerald-100">
            1. <strong>Gross Revenue</strong> = Crop Selling Price (₹/qtl) × Quantity (qtl)
          </div>
          <div className="text-amber-200">
            2. <strong>Transport Freight</strong> = Distance (km) × Freight Rate (₹/km) × Trips
          </div>
          <div className="text-amber-200">
            3. <strong>Other Mandi Fees</strong> = Mandi Cess (1%) + Loading Labor (₹/qtl)
          </div>
          <div className="pt-2 border-t border-white/20 text-base sm:text-lg font-bold text-white">
            4. <span className="text-amber-300">Net Return</span> = Gross Revenue − Transport Freight − Other Fees
          </div>
        </div>
      </div>

      {/* Worked Case Study / Real Comparison Example */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900">
          Real Case Study: Selling 10 Quintals of Paddy from Bhimavaram
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A: Distant Mandi */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 uppercase">
                Option A: Distant City Mandi (95 km)
              </span>
              <span className="text-xs font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                High Board Rate
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-rose-950">
              <div className="flex justify-between">
                <span>Board Price:</span>
                <span className="font-bold">₹2,360 / quintal</span>
              </div>
              <div className="flex justify-between">
                <span>Gross Revenue:</span>
                <span className="font-bold">₹23,600</span>
              </div>
              <div className="flex justify-between text-rose-700 font-semibold">
                <span>Transport (95 km × ₹22):</span>
                <span>− ₹2,090</span>
              </div>
              <div className="flex justify-between text-rose-700 font-semibold">
                <span>Loading & Cess:</span>
                <span>− ₹380</span>
              </div>
              <div className="pt-2 border-t border-rose-200 flex justify-between text-sm font-black text-rose-900">
                <span>Cash in Pocket:</span>
                <span>₹21,130</span>
              </div>
            </div>
          </div>

          {/* Option B: Tanuku APMC */}
          <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-5 space-y-3 ring-1 ring-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase">
                Option B: Tanuku APMC (32 km)
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Optimal Net Return ⭐
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-emerald-950">
              <div className="flex justify-between">
                <span>Board Price:</span>
                <span className="font-bold">₹2,320 / quintal (₹40 lower!)</span>
              </div>
              <div className="flex justify-between">
                <span>Gross Revenue:</span>
                <span className="font-bold">₹23,200</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Transport (32 km × ₹22):</span>
                <span>− ₹704</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Loading & Cess:</span>
                <span>− ₹346</span>
              </div>
              <div className="pt-2 border-t border-emerald-300 flex justify-between text-sm font-black text-emerald-900">
                <span>Cash in Pocket:</span>
                <span>₹22,150 (+₹1,020 HIGHER!)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
          💡 <strong>Conclusion:</strong> Even though Option B had a ₹40 lower board rate, you saved over ₹1,380 in transport freight and ended up taking home <strong>₹1,020 more actual profit</strong>!
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs text-gray-700">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900">
              How does the system calculate road distance?
            </h4>
            <p className="leading-relaxed">
              We calculate geodesic coordinates between your farm and the APMC mandi, applying a 1.25x rural road curvature factor to account for state highways, turns, and unpaved village access roads.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900">
              What if I have my own tractor or vehicle?
            </h4>
            <p className="leading-relaxed">
              You can adjust the Freight Rate per km in the Transport Settings tab. If you only pay for diesel (approx ₹12-14/km for a tractor), enter that value to see your personalized net return.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-900">
              Are these prices guaranteed?
            </h4>
            <p className="leading-relaxed">
              Prices represent latest modal auction averages from APMC electronic boards and trade bulletins. Final settlement depends on crop quality, moisture level, and open bidding at the mandi yard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
