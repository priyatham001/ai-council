import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { marketService } from '../../services/marketService';
import { PAN_INDIA_CROPS, ALL_INDIA_STATES } from '../../data/panIndiaData';
import { TrendingUp, TrendingDown, MapPin, ArrowRight, Calculator, Globe, Compass, Grid, Search, Filter } from 'lucide-react';
import { NetRealizationModal } from '../../components/common/NetRealizationModal';
import { NationalMarketMap } from '../../components/common/NationalMarketMap';

export const PublicMarketsPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isCalcOpen, setIsCalcOpen] = useState<boolean>(false);

  const allMarkets = marketService.getAllMarkets();

  const filteredMarkets = allMarkets.filter(m => {
    const matchState = selectedState === 'All' || m.state.toLowerCase() === selectedState.toLowerCase();
    const matchCrop = selectedCrop === 'All' || m.cropName.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchQuery = !searchQuery || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cropName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchState && matchCrop && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-verified text-[11px]">Pan-India APMC Network</span>
            <span className="text-[11px] font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded font-bold">
              50+ Mandis • 28 States & UTs
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1.5">
            National Agricultural Market Explorer
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Real-time daily modal prices, daily arrival volumes, and demand trends across all Indian states and APMCs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'map' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>National Map</span>
            </button>
          </div>

          <button
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-xl text-xs font-bold border border-brand-200 shadow-2xs"
          >
            <Calculator className="w-4 h-4 text-brand-700" />
            <span>Net Realization Calc</span>
          </button>
          <Link
            to="/login"
            className="flex items-center gap-1 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>Sign In to Sell</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>National Agricultural Topology & Mandi Arrivals</span>
            </h3>
            <span className="text-[11px] text-gray-500 font-medium">Click any state to filter local mandis</span>
          </div>
          <NationalMarketMap
            onSelectState={(stateName) => {
              setSelectedState(stateName);
              setViewMode('grid');
            }}
            selectedStateName={selectedState !== 'All' ? selectedState : undefined}
          />
        </div>
      ) : null}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by mandi name, district, or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* State Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All States & UTs (28 + 8)</option>
              {ALL_INDIA_STATES.map((s: any) => (
                <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          {/* Crop Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Commodities (30+ Crops)</option>
              {PAN_INDIA_CROPS.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.hindiName})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-gray-500 font-medium">Quick Filters:</span>
          {['Maharashtra', 'Punjab', 'Karnataka', 'Andhra Pradesh', 'Gujarat', 'Madhya Pradesh'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedState(selectedState === st ? 'All' : st)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                selectedState === st
                  ? 'bg-brand-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
          {(selectedState !== 'All' || selectedCrop !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCrop('All');
                setSearchQuery('');
              }}
              className="text-rose-600 font-bold hover:underline ml-2"
            >
              Reset Filters
            </button>
          )}
          <span className="ml-auto text-gray-500 font-mono">
            Showing {filteredMarkets.length} of {allMarkets.length} APMC Markets
          </span>
        </div>
      </div>

      {/* Market Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMarkets.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-200 space-y-3">
            <Compass className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold text-gray-900 text-base">No Mandis Match Your Current Search</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Try choosing "All States" or clearing the commodity filter to explore other regional markets.
            </p>
          </div>
        ) : (
          filteredMarkets.map(m => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{m.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{m.district}, <b className="text-gray-700">{m.state}</b></span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    m.demandLevel === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {m.demandLevel} Demand
                  </span>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-600 font-medium">
                    <span>Modal Trading Price ({m.cropName})</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.2 rounded text-[10px]">
                      ↑ {m.priceChangePct || 4.2}%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">
                    ₹{m.modalPrice.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-gray-500">/ quintal</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-600 pt-2 border-t border-gray-200/60">
                    <span>Range: ₹{m.minPrice} – ₹{m.maxPrice}</span>
                    <span className="font-bold text-gray-800">Arrivals: {m.arrivalsQuintals} q</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 font-mono">{m.lastUpdated}</span>
                <button
                  onClick={() => setIsCalcOpen(true)}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                >
                  <span>Net Calculator</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <NetRealizationModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
};
