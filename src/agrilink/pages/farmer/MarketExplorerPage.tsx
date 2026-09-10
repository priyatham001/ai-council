import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Filter,
  Calculator,
  ArrowRight,
  Scale,
  Calendar,
  Layers,
  ChevronDown,
  Search,
  Compass,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { marketService } from '../../services/marketService';
import { localStorageService } from '../../services/storageService';
import { MandiMarket, FarmerPersona } from '../../types';
import { INDIAN_STATES, PAN_INDIA_CROPS, getDistrictsByState } from '../../data/panIndiaData';
import { NetRealizationModal } from '../../components/common/NetRealizationModal';
import { NationalMarketMap } from '../../components/common/NationalMarketMap';

export const MarketExplorerPage: React.FC = () => {
  const currentPersona = localStorageService.getPersona();

  // Filter States
  const [selectedState, setSelectedState] = useState<string>(currentPersona.state);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'markets' | 'map'>('markets');

  // Compared market IDs
  const allInitial = marketService.getAllMarkets();
  const [comparedMarkets, setComparedMarkets] = useState<string[]>([
    allInitial[0]?.id || 'mkt-lasalgaon',
    allInitial[1]?.id || 'mkt-pimpalgaon'
  ]);

  // Sync when demo location changes
  useEffect(() => {
    const handleLocationChange = () => {
      const p = localStorageService.getPersona();
      setSelectedState(p.state);
      setSelectedDistrict(p.district);
    };
    window.addEventListener('smartagrilink_persona_changed', handleLocationChange);
    window.addEventListener('smartagrilink_location_changed', handleLocationChange);
    return () => {
      window.removeEventListener('smartagrilink_persona_changed', handleLocationChange);
      window.removeEventListener('smartagrilink_location_changed', handleLocationChange);
    };
  }, []);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedDistrict('All');
  };

  const handleNearMeClick = () => {
    const p = localStorageService.getPersona();
    setSelectedState(p.state);
    setSelectedDistrict(p.district);
    setSelectedCrop(p.primaryCrop);
  };

  // Filtered markets
  const allMarkets = marketService.getAllMarkets();
  const filteredMarkets = allMarkets.filter(m => {
    const matchesState = selectedState === 'All' || m.state.toLowerCase() === selectedState.toLowerCase();
    const matchesDistrict = selectedDistrict === 'All' || m.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesCrop = selectedCrop === 'All' || m.cropName.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch = !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.district.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesDistrict && matchesCrop && matchesSearch;
  });

  const availableDistricts = getDistrictsByState(selectedState);

  // Comparison markets
  const activeMarket = allMarkets.find(m => m.id === comparedMarkets[0]) || filteredMarkets[0] || allMarkets[0];
  const secondaryMarket = allMarkets.find(m => m.id === comparedMarkets[1]) || filteredMarkets[1] || allMarkets[1];

  const comparativeChartData = activeMarket.weeklyTrend.map((pt, idx) => {
    const secPt = secondaryMarket?.weeklyTrend[idx] || pt;
    return {
      date: pt.date,
      [activeMarket.name]: pt.price,
      [secondaryMarket.name]: secPt.price,
      [`${activeMarket.name} Arrivals`]: pt.arrivals,
      [`${secondaryMarket.name} Arrivals`]: secPt.arrivals
    };
  });

  const toggleCompare = (id: string) => {
    if (comparedMarkets.includes(id)) {
      if (comparedMarkets.length > 1) {
        setComparedMarkets(comparedMarkets.filter(x => x !== id));
      }
    } else {
      setComparedMarkets([comparedMarkets[0], id]);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-verified text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Pan-India Mandi Price Intelligence
            </span>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Demo market data
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1.5">
            Pan-India Market Price Explorer
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Real-time daily modal rates, arrival absorption volumes, and cross-state mandi price trends
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleNearMeClick}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300 transition-colors shadow-2xs"
            title="Filter mandis near your selected demo farmer location"
          >
            <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
            <span>Markets Near Me ({currentPersona.district})</span>
          </button>

          <button
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-xl text-xs font-bold border border-brand-200 transition-colors shadow-2xs"
          >
            <Calculator className="w-4 h-4 text-brand-700" />
            <span>Net Realization Calc</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs: Mandi Directory vs National Map */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('markets')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'markets'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Mandi Directory & Comparisons ({filteredMarkets.length})
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'map'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>National Market Activity Map</span>
        </button>
      </div>

      {activeTab === 'map' ? (
        <NationalMarketMap onSelectState={(st) => {
          setSelectedState(st);
          setActiveTab('markets');
        }} />
      ) : (
        <>
          {/* Pan-India Filter Bar (Section 4 Requirement: Crop, State, District, Search) */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-emerald-600" />
                Filter Mandi Feeds Across India:
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">
                Showing {filteredMarkets.length} of {allMarkets.length} Mandis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by mandi or district name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* State filter */}
              <div>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="All">All Indian States (National)</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st.code} value={st.name}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* District filter */}
              <div>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="All">All Districts in {selectedState}</option>
                  {availableDistricts.map((d, idx) => (
                    <option key={idx} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop filter */}
              <div>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="All">All Crops & Commodities</option>
                  {PAN_INDIA_CROPS.map(c => (
                    <option key={c.id} value={c.name.split(' (')[0]}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dual-Mandi Comparative Intelligence Chart */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-gray-900 text-base">
                    Comparative APMC Trend: {activeMarket.name} vs {secondaryMarket.name}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Side-by-side 7-day modal pricing curve and daily arrival volume analysis
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {activeMarket.cropName} Benchmark
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  Updated: Today 09:30 AM
                </span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={comparativeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15803d" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gradSecondary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 150', 'dataMax + 150']} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(val: any, name: any) => [`₹${val}/q`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey={activeMarket.name} stroke="#15803d" strokeWidth={2.5} fillOpacity={1} fill="url(#gradPrimary)" />
                  <Area type="monotone" dataKey={secondaryMarket.name} stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#gradSecondary)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mandi Cards Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMarkets.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-gray-200 space-y-3">
                <MapPin className="w-10 h-10 text-gray-400 mx-auto" />
                <h3 className="font-bold text-gray-900 text-sm">No APMC Mandis match the selected filter</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Try switching the state to Maharashtra, Punjab, Karnataka, Andhra Pradesh, Gujarat, or reset to "All Indian States".
                </p>
                <button
                  onClick={() => { setSelectedState('All'); setSelectedDistrict('All'); setSelectedCrop('All'); setSearchTerm(''); }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredMarkets.map((m) => {
                const isCompared = comparedMarkets.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`bg-white rounded-3xl border p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                      isCompared ? 'border-emerald-500 ring-2 ring-emerald-400/20' : 'border-gray-200'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {m.state}
                          </span>
                          <h3 className="font-bold text-gray-900 text-base mt-1.5">
                            {m.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{m.district} • {m.distanceKm} km from origin</span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.demandLevel === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.demandLevel} Demand
                        </span>
                      </div>

                      {/* Modal and Range Pricing Strip */}
                      <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-1.5 text-xs">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[11px] text-gray-600">Modal Price ({m.cropName}):</span>
                          <span className="text-xl font-black text-emerald-800">
                            ₹{m.modalPrice.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-600">/q</span>
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
                          <span>Range: ₹{m.minPrice} – ₹{m.maxPrice}/q</span>
                          <span className="font-semibold text-gray-800">{m.arrivalsQuintals} q arrivals</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-gray-500 font-medium">
                        {m.lastUpdated}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => toggleCompare(m.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          isCompared
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {isCompared ? 'Compared in Chart' : 'Compare Market'}
                      </button>

                      <button
                        onClick={() => setIsCalcOpen(true)}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
                        title="Calculate net realization for this market"
                      >
                        Net Calc
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Net Realization Modal */}
      <NetRealizationModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />
    </div>
  );
};
