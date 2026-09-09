import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Cpu,
  QrCode,
  CheckCircle2,
  Truck,
  ArrowRight,
  Calculator,
  ShieldCheck
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Real-Time Mandi Intelligence',
      desc: 'Browse current daily prices, weekly trends, and arrival volumes across nearby APMC mandis. Filter by crop, district, and distance from your village.',
      badge: 'Price Transparency'
    },
    {
      num: '02',
      title: 'AI Sell Advisor & Net Realization',
      desc: 'Input harvest details to receive an algorithmic recommendation: optimal mandi, top verified buyer, selling date window, and a complete freight-adjusted cost deduction breakdown.',
      badge: 'Smart Decision Support'
    },
    {
      num: '03',
      title: 'Create Digital Lot & Quality Grading',
      desc: 'Register your produce with quantity and grade. Use our simulated AI camera grading assessment to assign Grade A, B, or C and generate a unique QR code lot passport.',
      badge: 'Tamper-Proof Traceability'
    },
    {
      num: '04',
      title: 'Receive & Compare Digital Offers',
      desc: 'Verified food processors and retail chains submit formal bids. Compare offers ranked by Net Cash Realization rather than misleading raw gross quotes.',
      badge: 'Best Net Realization'
    },
    {
      num: '05',
      title: 'Farm-Gate Logistics & Escrow Payout',
      desc: 'Book verified local transport, dispatch produce with live GPS tracking, certify digital weighbridge receipts, and trigger automated escrow release into your bank account.',
      badge: 'Guaranteed Liquidity'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Step-by-Step Workflow
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          How KrishiSetu Works
        </h1>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          An end-to-end digital highway designed to eliminate uncertainty and maximize the farmer's net profit.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row gap-5 items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-black text-lg font-mono shrink-0 border border-brand-200">
              {s.num}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">{s.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
                  {s.badge}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-sm shadow-md transition-all"
        >
          <span>Try the Interactive Demo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
