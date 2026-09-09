import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building2,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Scale,
  DollarSign,
  Activity,
  Award,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { grievanceService } from '../../services/grievanceService';
import { buyerService } from '../../services/buyerService';
import { transactionService } from '../../services/transactionService';
import { Grievance, BuyerProfile, Transaction } from '../../types';
import { showToast } from '../../components/common/Toast';

export const AdminDashboard: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>(grievanceService.getAll());
  const [buyers, setBuyers] = useState<BuyerProfile[]>(buyerService.getAllBuyers());
  const [transactions, setTransactions] = useState<Transaction[]>(transactionService.getAll());
  const [activeTab, setActiveTab] = useState<'overview' | 'grievances' | 'verification'>('overview');

  useEffect(() => {
    const load = () => {
      setGrievances(grievanceService.getAll());
      setBuyers(buyerService.getAllBuyers());
      setTransactions(transactionService.getAll());
    };
    load();
    window.addEventListener('smartagrilink_data_changed', load);
    return () => window.removeEventListener('smartagrilink_data_changed', load);
  }, []);

  // Growth Analytics Data for Recharts
  const monthlyVolumeData = [
    { month: 'Apr', tradeValueCr: 0.8, lots: 45 },
    { month: 'May', tradeValueCr: 1.4, lots: 82 },
    { month: 'Jun', tradeValueCr: 2.1, lots: 135 },
    { month: 'Jul', tradeValueCr: 3.2, lots: 210 },
    { month: 'Aug', tradeValueCr: 4.1, lots: 275 },
    { month: 'Sep', tradeValueCr: 4.82, lots: 312 }
  ];

  const cropShareData = [
    { name: 'Tomato', value: 35, color: '#15803d' },
    { name: 'Paddy', value: 30, color: '#2563eb' },
    { name: 'Chilli', value: 15, color: '#e11d48' },
    { name: 'Cotton', value: 12, color: '#d97706' },
    { name: 'Others', value: 8, color: '#8b5cf6' }
  ];

  const handleResolveGrievance = (id: string) => {
    grievanceService.resolveGrievance(id, 'APMC Redressal Desk reconciled ledger with partner escrow bank. Settled.');
    showToast({
      type: 'success',
      title: 'Dispute Marked as Resolved',
      description: 'Parties notified and resolution logged in public audit trail.'
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-kyc text-[11px]">APMC Platform Oversight</span>
            <span className="text-[11px] font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded font-bold">
              Root Superadmin
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            Admin Governance & Market Analytics Console
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Supervise trading integrity, enforce buyer KYC, monitor dispute resolution SLAs, and audit escrow flows
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs text-right">
            <span className="text-[10px] text-gray-700 block">System Integrity Status</span>
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operational
            </span>
          </div>
        </div>
      </div>

      {/* 6 Key Metrics Grid (Section 25 Requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] text-gray-700 font-semibold block">Registered Farmers</span>
          <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1">2,540</div>
          <span className="text-[10px] text-emerald-700 font-medium">+142 this month</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] text-gray-700 font-semibold block">Verified Buyers</span>
          <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1">184</div>
          <span className="text-[10px] text-emerald-700 font-medium">100% KYC Audit</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] text-gray-700 font-semibold block">Active Lots</span>
          <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1">312</div>
          <span className="text-[10px] text-blue-700 font-medium">Under trade</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] text-gray-700 font-semibold block">Total Trade Value</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">₹4.82 Cr</div>
          <span className="text-[10px] text-emerald-700 font-medium">Zero default rate</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] text-gray-700 font-semibold block">Avg Farmer Gain</span>
          <div className="text-xl sm:text-2xl font-black text-brand-800 mt-1">+18.4%</div>
          <span className="text-[10px] text-emerald-700 font-medium">vs distress sales</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-[11px] text-gray-700 font-semibold block">Open Grievances</span>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
            {grievances.filter(g => g.status !== 'Resolved').length}
          </div>
          <span className="text-[10px] text-amber-800 font-medium">SLA: Under 24h</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${
            activeTab === 'overview' ? 'bg-brand-700 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Growth Analytics
        </button>
        <button
          onClick={() => setActiveTab('grievances')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${
            activeTab === 'grievances' ? 'bg-brand-700 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Grievances Redressal Board ({grievances.length})
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${
            activeTab === 'verification' ? 'bg-brand-700 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Buyer KYC Directory ({buyers.length})
        </button>
      </div>

      {/* Tab 1: Charts and Growth Analytics */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Trade Volume Growth Chart (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Gross Trade Value Facilitated (₹ Crores)</h3>
                <p className="text-xs text-gray-700">Monthly cumulative volume transacted via KrishiSetu</p>
              </div>
              <span className="text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-full">
                FY 2026 Season
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyVolumeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15803d" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(val: any) => [`₹${val} Cr`, 'Volume']}
                  />
                  <Area type="monotone" dataKey="tradeValueCr" stroke="#15803d" strokeWidth={3} fillOpacity={1} fill="url(#adminGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Commodity Distribution Chart (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Commodity Share</h3>
              <p className="text-xs text-gray-700">Volume proportion across commodities</p>

              <div className="h-48 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropShareData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={35}
                      paddingAngle={4}
                    >
                      {cropShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
              {cropShareData.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span>{c.name}: <b>{c.value}%</b></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Grievances Oversight Board */}
      {activeTab === 'grievances' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-base">Dispute Settlement Queue</h3>
            <span className="text-xs text-gray-700">Mandated 24h APMC Resolution Protocol</span>
          </div>

          <div className="space-y-3">
            {grievances.map((grv) => (
              <div
                key={grv.id}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900 text-sm">{grv.ticketNumber}</span>
                    <span className="badge-verified text-[10px]">{grv.category}</span>
                    <span className="text-gray-700">Filed by <b>{grv.filedByName}</b></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      grv.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {grv.status}
                    </span>

                    {grv.status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolveGrievance(grv.id)}
                        className="px-3 py-1 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Resolve Dispute
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 bg-white p-2.5 rounded-lg border border-gray-100">
                  {grv.description}
                </p>

                {grv.adminResponse && (
                  <div className="text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <b>Admin Note:</b> {grv.adminResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Buyer Verification Directory */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Institutional Buyer Registry</h3>
            <span className="text-xs text-gray-700">100% KYC Audit Coverage</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Payment Track</th>
                  <th className="py-3.5 px-4">KYC / GSTIN</th>
                  <th className="py-3.5 px-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {buyers.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{b.name}</td>
                    <td className="py-3.5 px-4 text-gray-700">{b.location}, {b.district}</td>
                    <td className="py-3.5 px-4 text-gray-700">{b.businessType}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {b.paymentReliabilityPct}% on-time
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="badge-verified text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Audited
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                      {b.rating} ★
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
