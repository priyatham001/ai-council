import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Ban,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  MapPin,
  Phone,
  FileCheck,
  RefreshCw,
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Star,
  Activity,
  Layers,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../context/LanguageContext';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    listings,
    bids,
    farmers,
    buyers,
    verifyFarmer,
    flagFarmer,
    suspendFarmer,
    removeFarmer,
    verifyBuyer,
    flagBuyer,
    suspendBuyer,
    removeBuyer,
    removeListing,
    flagListing,
    refreshData,
  } = useMarketplace();

  const { currentUser, logout, openAuthModal } = useAuth();
  const { isDarkMode, setTheme } = useTheme();
  const { t } = useTranslation();

  // Active Admin Tab: 'overview' | 'farmers' | 'buyers' | 'listings' | 'verifications'
  const [activeTab, setActiveTab] = useState<'overview' | 'farmers' | 'buyers' | 'listings' | 'verifications'>('overview');

  // Search & Filter queries
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Active' | 'Flagged' | 'Suspended'>('All');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const showActionToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  // Calculations for KPI cards
  const totalFarmers = farmers.length;
  const verifiedFarmers = farmers.filter((f) => f.status === 'Verified').length;
  const flaggedFarmers = farmers.filter((f) => f.status === 'Flagged' || f.status === 'Suspended').length;

  const totalBuyers = buyers.length;
  const verifiedBuyers = buyers.filter((b) => b.gstVerified || b.kycVerified).length;

  const totalListings = listings.length;
  const totalVolumeQuintals = listings.reduce((sum, l) => sum + (l.quantityQuintals || 0), 0);
  const totalMarketValue = listings.reduce(
    (sum, l) => sum + (l.expectedPricePerQ || 0) * (l.quantityQuintals || 0),
    0
  );

  const pendingFarmerVerifications = farmers.filter((f) => f.status === 'Active');
  const pendingBuyerVerifications = buyers.filter((b) => !(b.gstVerified || b.kycVerified));
  const totalPendingVerifications = pendingFarmerVerifications.length + pendingBuyerVerifications.length;

  // Filtered Farmers
  const filteredFarmers = farmers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Buyers
  const filteredBuyers = buyers.filter((b) => {
    const isVerified = b.gstVerified || b.kycVerified;
    const matchesSearch =
      b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Verified' && isVerified) ||
      (statusFilter === 'Active' && !isVerified);
    return matchesSearch && matchesStatus;
  });

  // Filtered Listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.district && l.district.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast alert */}
      {actionSuccessMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-md">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                  KrishiSetu Admin Console
                </span>
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  Official APMC / SIH Oversight
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Platform governance, user verification, escrow & listing moderation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshData()}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline font-bold">Sync</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700 text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                  AD
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-amber-400 uppercase font-mono">{currentUser.role}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-stone-400 hover:text-red-400 ml-1 p-1"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('admin')}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Login as Admin</span>
              </button>
            )}

            <Link
              to="/"
              className="text-xs font-bold text-stone-400 hover:text-white px-3 py-1.5 rounded-xl bg-stone-800 transition-colors"
            >
              Public App →
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 shadow-xs sticky top-18 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('farmers')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'farmers'
                ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Farmers Management</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 font-mono">
              {farmers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('buyers')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'buyers'
                ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Buyers Management</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 font-mono">
              {buyers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Listings Moderation</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 font-mono">
              {listings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'verifications'
                ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Verification Requests</span>
            {totalPendingVerifications > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 font-black">
                {totalPendingVerifications} Pending
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: SYSTEM OVERVIEW STATISTICS                                         */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                Platform Health & Metrics
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Live statistics from verified APMC mandis, active farmer lots, and institutional buyer orders
              </p>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Farmers */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span className="font-bold uppercase tracking-wider">Registered Farmers</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-stone-900 dark:text-white mb-1">
                  {totalFarmers}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{verifiedFarmers} Verified Producers</span>
                </div>
              </div>

              {/* Total Institutional Buyers */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span className="font-bold uppercase tracking-wider">Verified Buyers</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-stone-900 dark:text-white mb-1">
                  {totalBuyers}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{verifiedBuyers} KYC Approved Desks</span>
                </div>
              </div>

              {/* Live Crop Listings Volume */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span className="font-bold uppercase tracking-wider">Active Lot Volume</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-stone-900 dark:text-white mb-1">
                  {totalVolumeQuintals.toLocaleString('en-IN')} <span className="text-sm font-bold text-stone-400">Qtl</span>
                </div>
                <div className="text-xs text-stone-500 font-semibold">
                  Across {totalListings} active digital lots
                </div>
              </div>

              {/* Estimated Mandi Trade Value */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span className="font-bold uppercase tracking-wider">Gross Trade Potential</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-stone-900 dark:text-white mb-1">
                  ₹{(totalMarketValue / 100000).toFixed(1)} <span className="text-sm font-bold text-stone-400">Lakhs</span>
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                  ₹{totalMarketValue.toLocaleString('en-IN')} Total Value
                </div>
              </div>
            </div>

            {/* Quick Action Alerts */}
            {totalPendingVerifications > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                      {totalPendingVerifications} Verification Request(s) Require Review
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {pendingFarmerVerifications.length} Farmers and {pendingBuyerVerifications.length} Corporate Buyers are awaiting official badges.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('verifications')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  Review Requests →
                </button>
              </div>
            )}

            {/* Recent Live Activity Feed */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Recent Platform Activity Audit Log</span>
              </h3>
              <div className="divide-y divide-stone-200 dark:divide-stone-800 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      Farmer Ramesh Reddy listed 80 Qtl Sona Masoori Paddy in Kadapa, AP
                    </span>
                  </div>
                  <span className="text-stone-400">10 mins ago</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      Deccan Rice Processors placed an official bid of ₹2,450/qtl on Lot #LOT-AP-KD-01
                    </span>
                  </div>
                  <span className="text-stone-400">28 mins ago</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      Kadapa APMC Yard updated live modal benchmark: ₹2,380/qtl for Paddy
                    </span>
                  </div>
                  <span className="text-stone-400">1 hour ago</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      Escrow deal verified for FreshBasket Retail Hub (80 Qtl Tomato @ ₹1,950/qtl)
                    </span>
                  </div>
                  <span className="text-stone-400">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FARMER USER MANAGEMENT                                             */}
        {/* ========================================================================= */}
        {activeTab === 'farmers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                  Farmers Management
                </h2>
                <p className="text-xs text-stone-500">
                  Verify legitimate regional growers, inspect lot counts, and flag unverified brokers.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, district..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-white"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Active">Pending Verification</option>
                  <option value="Flagged">Flagged</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Farmers Table */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200 dark:border-stone-800">
                    <tr>
                      <th className="py-3.5 px-4">Farmer Details</th>
                      <th className="py-3.5 px-4">Location / APMC Region</th>
                      <th className="py-3.5 px-4">Active Lots</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {filteredFarmers.map((farmer) => (
                      <tr key={farmer.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900 dark:text-white text-sm">
                            {farmer.name}
                          </div>
                          <div className="text-stone-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{farmer.phone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-800 dark:text-stone-200">
                            {farmer.district}, {farmer.state}
                          </div>
                          <div className="text-stone-400 text-[11px]">{farmer.location}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-900 dark:text-white">
                            {farmer.activeLotsCount} lots
                          </span>
                          <span className="text-stone-400 block text-[11px]">
                            ({farmer.totalQuantityQuintals} Qtl volume)
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                              farmer.status === 'Verified'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : farmer.status === 'Flagged'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                : farmer.status === 'Suspended'
                                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            {farmer.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                            {farmer.status === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
                            {farmer.status === 'Suspended' && <Ban className="w-3 h-3" />}
                            <span>{farmer.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {farmer.status !== 'Verified' && (
                              <button
                                onClick={() => {
                                  verifyFarmer(farmer.id);
                                  showActionToast(`Farmer ${farmer.name} verified successfully!`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Verify
                              </button>
                            )}
                            {farmer.status !== 'Flagged' && (
                              <button
                                onClick={() => {
                                  flagFarmer(farmer.id);
                                  showActionToast(`Farmer ${farmer.name} has been flagged for review.`);
                                }}
                                className="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Flag
                              </button>
                            )}
                            {farmer.status !== 'Suspended' && (
                              <button
                                onClick={() => {
                                  suspendFarmer(farmer.id);
                                  showActionToast(`Farmer ${farmer.name} suspended from marketplace.`);
                                }}
                                className="px-2.5 py-1 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BUYER USER MANAGEMENT                                              */}
        {/* ========================================================================= */}
        {activeTab === 'buyers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                  Institutional Buyers Management
                </h2>
                <p className="text-xs text-stone-500">
                  Manage agro-processors, export houses, retail chains, and commission agents.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search company, contact, location..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200 dark:border-stone-800">
                    <tr>
                      <th className="py-3.5 px-4">Buyer Enterprise</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Terminal / Hub</th>
                      <th className="py-3.5 px-4">Verification</th>
                      <th className="py-3.5 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {filteredBuyers.map((buyer) => (
                      <tr key={buyer.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900 dark:text-white text-sm">
                            {buyer.companyName}
                          </div>
                          <div className="text-stone-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                            <span>Contact: {buyer.name}</span>
                            <span>•</span>
                            <span className="font-mono">{buyer.phone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-[11px]">
                            {buyer.businessType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-800 dark:text-stone-200">
                            {buyer.location}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {(() => {
                            const isVerified = buyer.gstVerified || buyer.kycVerified;
                            return (
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                                  isVerified
                                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                                }`}
                              >
                                {isVerified ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                <span>{isVerified ? 'Escrow Verified' : 'Standard KYC'}</span>
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!(buyer.gstVerified || buyer.kycVerified) && (
                              <button
                                onClick={() => {
                                  verifyBuyer(buyer.id);
                                  showActionToast(`Buyer ${buyer.companyName} approved for Escrow trading.`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Approve KYC
                              </button>
                            )}
                            <button
                              onClick={() => {
                                flagBuyer(buyer.id);
                                showActionToast(`Buyer ${buyer.companyName} flagged.`);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Audit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: LISTINGS MODERATION                                                */}
        {/* ========================================================================= */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                  Crop Lots & Listings Oversight
                </h2>
                <p className="text-xs text-stone-500">
                  Approve, flag quality discrepancies, or take down invalid agricultural lots.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by crop name or farmer..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((lot) => (
                <div
                  key={lot.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-stone-500">{lot.lotNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {lot.qualityGrade}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700">
                        {lot.imageUrl ? (
                          <img
                            src={lot.imageUrl}
                            alt={lot.crop}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🌾</div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white">
                          {lot.crop}
                        </h3>
                        <p className="text-xs text-stone-500">
                          {lot.quantityQuintals} Quintals • ₹{lot.expectedPricePerQ}/qtl
                        </p>
                        <p className="text-[11px] text-stone-400">
                          Farmer: {lot.farmerName} ({lot.district}, {lot.state})
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Total: ₹{((lot.expectedPricePerQ || 0) * (lot.quantityQuintals || 0)).toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          flagListing(lot.id);
                          showActionToast(`Lot ${lot.lotNumber} flagged for re-inspection.`);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Flag
                      </button>
                      <button
                        onClick={() => {
                          removeListing(lot.id);
                          showActionToast(`Lot ${lot.lotNumber} removed from marketplace.`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: VERIFICATION DESK                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                Pending Verification Requests
              </h2>
              <p className="text-xs text-stone-500">
                Grant AGMARK verification badges to eligible farmers and Escrow clearance to institutional buyers.
              </p>
            </div>

            {totalPendingVerifications === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center space-y-3 border border-stone-200 dark:border-stone-800">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-2xl">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  All Verifications Up to Date
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  No unreviewed applications pending in the queue. All regional accounts have verified badges.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Farmer Requests */}
                {pendingFarmerVerifications.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-amber-200 dark:border-amber-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xl">
                        🌾
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 dark:text-white text-base">
                            {f.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            Farmer Verification Request
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          Phone: {f.phone} • Region: {f.location} ({f.district}, {f.state})
                        </p>
                        <p className="text-[11px] text-stone-400">
                          Applying for: APMC Farmgate Verified Seller Badge
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          verifyFarmer(f.id);
                          showActionToast(`Approved badge for ${f.name}!`);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Approve Badge
                      </button>
                      <button
                        onClick={() => {
                          flagFarmer(f.id);
                          showActionToast(`Declined badge for ${f.name}.`);
                        }}
                        className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}

                {/* Buyer Requests */}
                {pendingBuyerVerifications.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-blue-200 dark:border-blue-900/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xl">
                        🏢
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 dark:text-white text-base">
                            {b.companyName}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                            Corporate Buyer Verification
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          Contact: {b.name} • {b.phone} • {b.location}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          Applying for: Institutional Escrow & High-Volume Bidding Desk
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          verifyBuyer(b.id);
                          showActionToast(`Approved Escrow desk for ${b.companyName}!`);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Approve Escrow
                      </button>
                      <button
                        onClick={() => {
                          flagBuyer(b.id);
                          showActionToast(`Flagged ${b.companyName} for review.`);
                        }}
                        className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
