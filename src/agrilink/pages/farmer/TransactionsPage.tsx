import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Truck,
  FileText,
  AlertCircle,
  PlayCircle,
  CreditCard,
  QrCode,
  Minus,
  Equal,
  Sparkles,
  Layers,
  Landmark
} from 'lucide-react';
import { transactionService } from '../../services/transactionService';
import { Transaction } from '../../types';
import { showToast } from '../../components/common/Toast';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTxnId, setSelectedTxnId] = useState<string>('');

  useEffect(() => {
    const load = () => {
      const all = transactionService.getAll();
      setTransactions(all);
      if (all.length > 0 && !selectedTxnId) {
        setSelectedTxnId(all[0].id);
      }
    };
    load();
    window.addEventListener('smartagrilink_data_changed', load);
    return () => window.removeEventListener('smartagrilink_data_changed', load);
  }, [selectedTxnId]);

  const activeTxn = transactions.find(t => t.id === selectedTxnId) || transactions[0];

  const handleAdvanceStep = () => {
    if (!activeTxn) return;
    const updated = transactionService.advanceTransactionStep(activeTxn.id);
    if (updated) {
      showToast({
        type: 'success',
        title: 'Transaction Milestone Advanced',
        description: `Current status: ${updated.status}. Timeline updated in real time.`
      });
    }
  };

  const handleReleasePayment = () => {
    if (!activeTxn) return;
    const updated = transactionService.completePayment(activeTxn.id);
    if (updated) {
      showToast({
        type: 'success',
        title: 'Escrow Payment Released! 💰',
        description: `₹${updated.netRealizationAmount.toLocaleString('en-IN')} successfully credited to farmer bank account via RTGS.`
      });
    }
  };

  // Calculate current stage progress
  const completedSteps = activeTxn ? activeTxn.timeline.filter(s => s.completed).length : 0;
  const totalSteps = activeTxn ? activeTxn.timeline.length : 8;
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-verified text-[11px]">8-Stage Deal Lifecycle</span>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Escrow Protected
            </span>
            <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              Real-Time Settlement
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Transaction & Payment Tracking
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Real-time digital weighbridge certification, milestone transitions, and automated escrow settlement.
          </p>
        </div>

        {/* Demo Action Buttons */}
        {activeTxn && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAdvanceStep}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              title="Advance to next step in demo"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Simulate Next Milestone</span>
            </button>

            {activeTxn.paymentStatus !== 'Payment Completed' && (
              <button
                onClick={handleReleasePayment}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                title="Release escrow payout immediately"
              >
                <DollarSign className="w-4 h-4" />
                <span>Simulate Fast Escrow Payout</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Transaction Roster (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900 text-sm">Active & Past Transactions</h2>
            <p className="text-[11px] text-gray-700">Select transaction to inspect timeline & money journey</p>
          </div>

          <div className="space-y-3">
            {transactions.map((txn) => {
              const isSelected = txn.id === activeTxn?.id;
              return (
                <div
                  key={txn.id}
                  onClick={() => setSelectedTxnId(txn.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 shadow-2xs ring-1 ring-brand-400'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-gray-900 block text-xs">
                        {txn.transactionNumber}
                      </span>
                      <h4 className="font-bold text-brand-900 text-sm mt-0.5">
                        {txn.crop} ({txn.quantityQuintals}q)
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      txn.paymentStatus === 'Payment Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {txn.paymentStatus}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-700 pt-1 border-t border-gray-100">
                    <span>Buyer: {txn.buyerName}</span>
                    <span className="font-bold text-gray-900">
                      ₹{txn.netRealizationAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 8-Stage Timeline & Money Journey (8 cols) */}
        {activeTxn && (
          <div className="lg:col-span-8 space-y-6">
            {/* Visual "Money Journey" Card */}
            <div className="bg-gradient-to-br from-brand-900 via-emerald-950 to-brand-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-emerald-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-black bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                      Visual Money Journey
                    </span>
                    <span className="text-xs text-emerald-200 font-medium font-mono">
                      {activeTxn.transactionNumber}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Transparent Take-Home Cash Flow
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    activeTxn.paymentStatus === 'Payment Completed'
                      ? 'bg-emerald-400 text-emerald-950'
                      : 'bg-amber-300 text-amber-950 animate-pulse'
                  }`}>
                    {activeTxn.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Flow Ribbon: Gross - Freight - Handling = Take-Home */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {/* 1. Gross Contract Value */}
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-200 block">1. Gross Contract</span>
                    <div className="text-xl font-black text-white mt-0.5">
                      ₹{activeTxn.grossAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    {activeTxn.quantityQuintals}q @ ₹{Math.round(activeTxn.grossAmount / activeTxn.quantityQuintals)}/q
                  </span>
                </div>

                {/* 2. Transportation */}
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-300 block">2. Freight Transport</span>
                    <div className="text-xl font-black text-rose-300 mt-0.5">
                      -₹{activeTxn.transportCost.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-[10px] text-rose-200">
                    Door-to-door transit
                  </span>
                </div>

                {/* 3. Handling & Mandi Fees */}
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">3. Handling & Weighment</span>
                    <div className="text-xl font-black text-amber-300 mt-0.5">
                      -₹{activeTxn.handlingCost.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-200">
                    Digital weighbridge slip
                  </span>
                </div>

                {/* 4. Net Realization Amount */}
                <div className="bg-emerald-500/20 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-400/50 flex flex-col justify-between space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-black text-emerald-300 block">4. Net Farmer Credit</span>
                    <div className="text-2xl font-black text-emerald-300 mt-0.5">
                      ₹{activeTxn.netRealizationAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-100 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Direct Bank Account
                  </span>
                </div>
              </div>

              {/* Settlement Bank Details & UTR */}
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-gray-300 text-[11px] block">Settlement Destination:</span>
                    <span className="text-white font-bold">State Bank of India •••• 4892 (RTGS Verified)</span>
                  </div>
                </div>

                {activeTxn.paymentUtr ? (
                  <div className="text-[11px] text-emerald-200 font-mono flex items-center gap-1.5">
                    <span>UTR Ref:</span>
                    <span className="bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 text-white font-bold">
                      {activeTxn.paymentUtr}
                    </span>
                  </div>
                ) : (
                  <span className="text-amber-300 text-[11px] font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Scheduled Upon Weighment
                  </span>
                )}
              </div>
            </div>

            {/* 8-Stage Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Fulfillment & Escrow Milestone Timeline</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Stage {completedSteps} of {totalSteps} Complete ({progressPct}%)
                  </p>
                </div>
                <div className="w-36 bg-gray-200 rounded-full h-2 overflow-hidden self-start sm:self-auto">
                  <div className="bg-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {activeTxn.timeline.map((step) => {
                  return (
                    <div key={step.stepIndex} className="relative flex items-start gap-4 text-xs">
                      {/* Node circle */}
                      <div
                        className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition-all ${
                          step.completed
                            ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                            : step.current
                            ? 'bg-brand-600 text-white shadow-md ring-4 ring-brand-200 animate-pulse'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : step.stepIndex}
                      </div>

                      <div className="flex-1 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                          <span className="text-[11px] font-medium text-gray-700 font-mono">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 text-xs leading-relaxed">{step.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
