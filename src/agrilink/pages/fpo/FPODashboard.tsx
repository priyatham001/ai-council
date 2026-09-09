import React, { useState } from 'react';
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Building2,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  BarChart3,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { fpoService } from '../../services/fpoService';
import { showToast } from '../../components/common/Toast';

export const FPODashboard: React.FC = () => {
  const [profile] = useState(fpoService.getFpoProfile());
  const [members] = useState(fpoService.getMembers());
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'aggregate'>('overview');

  // Form for Aggregate Lot (Section 23 Requirement)
  const [aggCrop, setAggCrop] = useState('Tomato');
  const [aggVariety, setAggVariety] = useState('Vaishnavi Hybrid (Pooled)');
  const [aggQuantity, setAggQuantity] = useState(120);
  const [aggPrice, setAggPrice] = useState(2650);
  const [aggDescription, setAggDescription] = useState('Bulk consolidated lot from 14 member farmers across Undi & Somaram clusters. Grade A uniform crimson pack.');

  const chartData = [
    { crop: 'Paddy', volume: profile.availablePaddyQuintals },
    { crop: 'Tomato', volume: profile.availableTomatoQuintals },
    { crop: 'Maize', volume: 480 },
    { crop: 'Banana', volume: 320 }
  ];

  const handleCreateAggregatedLot = (e: React.FormEvent) => {
    e.preventDefault();
    fpoService.createAggregatedLot({
      crop: aggCrop,
      variety: aggVariety,
      quantityQuintals: aggQuantity,
      expectedPricePerQ: aggPrice,
      description: aggDescription
    });

    showToast({
      type: 'success',
      title: 'Bulk Aggregated Lot Created! 🏢',
      description: `${aggQuantity} quintals pooled from member farmers and published to corporate buyers.`
    });
    setActiveTab('overview');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-verified text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> NABARD Registered FPO
            </span>
            <span className="text-[11px] font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded font-bold">
              {profile.registrationNumber}
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1.5">
            {profile.name}
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            {profile.location} • Led by {profile.president}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('aggregate')}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Consolidated Bulk Lot</span>
        </button>
      </div>

      {/* Metric Cards Grid (Section 23 Requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-semibold text-gray-700 block">Total Member Farmers</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            {profile.totalMembers}
          </div>
          <div className="text-[11px] font-medium text-emerald-700 mt-1">
            8 Village Clusters Active
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-semibold text-gray-700 block">Available Tomato Supply</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-700 mt-1">
            {profile.availableTomatoQuintals} <span className="text-xs font-normal text-gray-700">q</span>
          </div>
          <div className="text-[11px] text-gray-700 mt-1">
            Ready for bulk contracts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-semibold text-gray-700 block">Available Paddy Supply</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            {profile.availablePaddyQuintals} <span className="text-xs font-normal text-gray-700">q</span>
          </div>
          <div className="text-[11px] text-gray-700 mt-1">
            BPT-5204 Grade A
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs bg-gradient-to-br from-emerald-50/50 to-white">
          <span className="text-xs font-semibold text-gray-700 block">Projected Season Value</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            ₹32.4 Lakh
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            12 Active Buyer Contracts
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${
            activeTab === 'overview' ? 'bg-brand-700 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Collective Supply Overview
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${
            activeTab === 'members' ? 'bg-brand-700 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Member Directory ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('aggregate')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${
            activeTab === 'aggregate' ? 'bg-brand-700 text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Aggregate New Bulk Lot
        </button>
      </div>

      {/* Tab 1: Collective Supply Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Pooled Crop Volumes (Quintals)</h3>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="crop" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(val: any) => [`${val} quintals`, 'Available']}
                  />
                  <Bar dataKey="volume" fill="#15803d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Active Bulk Buyer Demands</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Sri Lakshmi Agro Foods</span>
                  <span className="text-emerald-700">100–250q Tomato</span>
                </div>
                <p className="text-gray-700 text-[11px]">Bidding ₹2,650/q for Grade A farm-gate delivery</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Andhra Paddy Modern Mills</span>
                  <span className="text-emerald-700">200–800q Paddy</span>
                </div>
                <p className="text-gray-700 text-[11px]">Bidding ₹2,200/q with 24-hour escrow clearance</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Godavari Mega Food Park</span>
                  <span className="text-emerald-700">150–300q Chilli</span>
                </div>
                <p className="text-gray-700 text-[11px]">Direct purchase order for cold chain intake</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Member Directory */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Village Cluster</th>
                  <th className="py-3.5 px-4">Land Holding</th>
                  <th className="py-3.5 px-4">Primary Crop</th>
                  <th className="py-3.5 px-4">Active Digital Lots</th>
                  <th className="py-3.5 px-4 text-right">Season Production</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{m.name}</td>
                    <td className="py-3.5 px-4 text-gray-700">{m.village}</td>
                    <td className="py-3.5 px-4 text-gray-700">{m.landAcres} Acres</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded">
                        {m.crop}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{m.activeLotsCount}</td>
                    <td className="py-3.5 px-4 text-right font-black text-gray-900">
                      {m.expectedOutputQ} quintals
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Aggregate Lot Form */}
      {activeTab === 'aggregate' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-base">Consolidate Produce into Single Bulk Lot</h3>
            <p className="text-xs text-gray-700 mt-0.5">
              Consolidating multiple small farmer harvests into larger truckload lots yields higher institutional buyer prices.
            </p>
          </div>

          <form onSubmit={handleCreateAggregatedLot} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Crop to Consolidate</label>
              <select
                value={aggCrop}
                onChange={(e) => setAggCrop(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
              >
                <option value="Tomato">Tomato (Pulping Grade)</option>
                <option value="Paddy (BPT-5204)">Paddy (BPT-5204)</option>
                <option value="Maize">Maize (Feed Grade)</option>
                <option value="Banana">Banana (Grand Naine)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Pooled Quantity (Quintals)</label>
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={aggQuantity}
                  onChange={(e) => setAggQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Bulk Bid (₹/q)</label>
                <input
                  type="number"
                  value={aggPrice}
                  onChange={(e) => setAggPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-brand-800 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Consolidation Notes & Clusters</label>
              <textarea
                rows={3}
                value={aggDescription}
                onChange={(e) => setAggDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-medium text-xs"
              />
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-brand-200 text-xs space-y-1">
              <span className="font-bold text-brand-900 uppercase text-[11px] block">Projected Total Contract Value</span>
              <div className="text-2xl font-black text-brand-800">
                ₹{(aggQuantity * aggPrice).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-gray-700 block">
                Estimated net farmer dividend: +₹140/q above individual distress sale
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Publish Consolidated Bulk Lot to Buyers</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
