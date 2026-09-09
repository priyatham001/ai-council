import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  BarChart2,
  ShieldCheck
} from 'lucide-react';
import { INDIAN_STATES, PAN_INDIA_MARKETS, StateInfo } from '../../data/panIndiaData';

interface NationalMarketMapProps {
  onSelectState?: (stateName: string) => void;
  selectedStateName?: string;
  className?: string;
}

export const NationalMarketMap: React.FC<NationalMarketMapProps> = ({
  onSelectState,
  selectedStateName: externalSelectedState,
  className = ''
}) => {
  const navigate = useNavigate();
  const [activeZone, setActiveZone] = useState<string>('All');
  const [internalSelectedState, setInternalSelectedState] = useState<string>('Maharashtra');
  const selectedStateName = externalSelectedState || internalSelectedState;

  const setSelectedStateName = (name: string) => {
    setInternalSelectedState(name);
    if (onSelectState) onSelectState(name);
  };

  // Key state coordinates on procedural schematic SVG map
  const stateCoordinates: Record<string, { x: number; y: number; label: string; code: string; demand: 'High' | 'Medium'; trend: string; up: boolean }> = {
    'Jammu & Kashmir': { x: 34, y: 12, label: 'J&K', code: 'JK', demand: 'Medium', trend: '+4.2%', up: true },
    'Himachal Pradesh': { x: 38, y: 19, label: 'HP', code: 'HP', demand: 'Medium', trend: '+6.1%', up: true },
    'Punjab': { x: 32, y: 24, label: 'Punjab', code: 'PB', demand: 'High', trend: '+3.4%', up: true },
    'Haryana': { x: 36, y: 28, label: 'Haryana', code: 'HR', demand: 'High', trend: '+2.8%', up: true },
    'Delhi (NCT)': { x: 40, y: 31, label: 'Delhi', code: 'DL', demand: 'High', trend: '+5.4%', up: true },
    'Rajasthan': { x: 26, y: 36, label: 'Rajasthan', code: 'RJ', demand: 'Medium', trend: '+3.9%', up: true },
    'Uttar Pradesh': { x: 48, y: 38, label: 'UP', code: 'UP', demand: 'High', trend: '+4.5%', up: true },
    'Bihar': { x: 62, y: 41, label: 'Bihar', code: 'BR', demand: 'Medium', trend: '+2.1%', up: true },
    'West Bengal': { x: 69, y: 49, label: 'West Bengal', code: 'WB', demand: 'High', trend: '+3.6%', up: true },
    'Assam': { x: 80, y: 39, label: 'Assam', code: 'AS', demand: 'Medium', trend: '+5.0%', up: true },
    'Gujarat': { x: 19, y: 48, label: 'Gujarat', code: 'GJ', demand: 'High', trend: '+4.5%', up: true },
    'Madhya Pradesh': { x: 40, y: 49, label: 'MP', code: 'MP', demand: 'High', trend: '+4.1%', up: true },
    'Maharashtra': { x: 32, y: 62, label: 'Maharashtra', code: 'MH', demand: 'High', trend: '+11.4%', up: true },
    'Chhattisgarh': { x: 52, y: 56, label: 'Chhattisgarh', code: 'CT', demand: 'Medium', trend: '+1.9%', up: true },
    'Odisha': { x: 60, y: 59, label: 'Odisha', code: 'OD', demand: 'Medium', trend: '+3.1%', up: true },
    'Telangana': { x: 43, y: 68, label: 'Telangana', code: 'TS', demand: 'High', trend: '+5.7%', up: true },
    'Andhra Pradesh': { x: 47, y: 76, label: 'Andhra Pradesh', code: 'AP', demand: 'High', trend: '+8.2%', up: true },
    'Karnataka': { x: 34, y: 78, label: 'Karnataka', code: 'KA', demand: 'High', trend: '+7.4%', up: true },
    'Tamil Nadu': { x: 41, y: 88, label: 'Tamil Nadu', code: 'TN', demand: 'High', trend: '+6.8%', up: true },
    'Kerala': { x: 34, y: 89, label: 'Kerala', code: 'KL', demand: 'Medium', trend: '+4.0%', up: true }
  };

  const selectedStateInfo: StateInfo =
    INDIAN_STATES.find(s => s.name.toLowerCase() === selectedStateName.toLowerCase()) || INDIAN_STATES[0];

  const stateMarkets = PAN_INDIA_MARKETS.filter(
    m => m.state.toLowerCase() === selectedStateName.toLowerCase()
  );

  const handleStateClick = (name: string) => {
    setSelectedStateName(name);
    if (onSelectState) onSelectState(name);
  };

  const handleExploreMarkets = () => {
    navigate(`/markets?state=${encodeURIComponent(selectedStateName)}`);
  };

  return (
    <div className={`bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 via-white to-teal-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-ai text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Pan-India Demo Market Intelligence
            </span>
            <span className="text-[11px] text-gray-500 font-semibold hidden md:inline">
              e-NAM Standard Format
            </span>
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight mt-1">
            National Agricultural Market Intelligence Map
          </h3>
          <p className="text-xs text-gray-600">
            Click on any state to inspect APMC market demand intensity, price trends, and arrival volumes
          </p>
        </div>

        {/* Zone Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs bg-gray-100 p-1 rounded-xl">
          {['All', 'North', 'West', 'South', 'Central', 'East'].map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className={`px-3 py-1 rounded-lg font-bold transition-all text-[11px] ${
                activeZone === zone
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        {/* Left: Interactive Schematic India Map (7 cols) */}
        <div className="lg:col-span-7 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white relative min-h-[420px]">
          {/* Schematic SVG Map */}
          <div className="w-full max-w-md aspect-[4/5] relative">
            <svg
              viewBox="0 0 100 105"
              className="w-full h-full filter drop-shadow-sm select-none"
            >
              {/* Subtle India boundary silhouette */}
              <path
                d="M 32 8 C 36 6, 42 12, 38 18 C 45 22, 52 24, 48 34 C 55 35, 68 36, 78 35 C 88 36, 85 45, 78 45 C 72 45, 70 52, 65 55 C 64 62, 55 72, 48 85 C 44 95, 38 98, 36 90 C 32 82, 28 72, 30 62 C 22 56, 16 52, 20 42 C 22 34, 28 26, 30 18 Z"
                fill="#f0fdf4"
                stroke="#bbf7d0"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Connecting supply flow corridors */}
              <line x1="32" y1="24" x2="40" y2="31" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
              <line x1="26" y1="36" x2="32" y2="62" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
              <line x1="32" y1="62" x2="43" y2="68" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
              <line x1="43" y1="68" x2="47" y2="76" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
              <line x1="34" y1="78" x2="41" y2="88" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
              <line x1="19" y1="48" x2="32" y2="62" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

              {/* State Interactive Nodes */}
              {Object.entries(stateCoordinates).map(([stateName, node]) => {
                const isSelected = selectedStateName.toLowerCase() === stateName.toLowerCase();
                const stateData = INDIAN_STATES.find(s => s.name === stateName);
                if (activeZone !== 'All' && stateData && stateData.zone !== activeZone) {
                  return null;
                }

                return (
                  <g
                    key={stateName}
                    onClick={() => handleStateClick(stateName)}
                    className="cursor-pointer transition-transform duration-200 group"
                  >
                    {/* Pulsing ring for high-demand states */}
                    {node.demand === 'High' && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? '5.5' : '4.5'}
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="0.8"
                        className="animate-ping opacity-50"
                      />
                    )}

                    {/* Node base circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? '4.8' : '3.8'}
                      fill={isSelected ? '#15803d' : '#ffffff'}
                      stroke={isSelected ? '#14532d' : '#16a34a'}
                      strokeWidth={isSelected ? '1.5' : '1.2'}
                      className="shadow-sm transition-all group-hover:scale-125"
                    />

                    {/* State Code Label inside/beside */}
                    <text
                      x={node.x}
                      y={node.y + 1.2}
                      textAnchor="middle"
                      fontSize="2.6"
                      fontWeight="bold"
                      fill={isSelected ? '#ffffff' : '#1e293b'}
                      pointerEvents="none"
                    >
                      {node.code}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-1 left-2 bg-white/90 backdrop-blur-xs p-2 rounded-xl border border-gray-200 text-[10px] space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-gray-700 font-semibold">High Demand APMC Cluster</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-emerald-600" />
                <span className="text-gray-700 font-semibold">Moderate Arrivals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: State Intelligence Inspector Drawer (5 cols) */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-5 bg-white">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedStateInfo.zone} Zone • {selectedStateInfo.code}
                </span>
                <h4 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
                  {selectedStateInfo.name}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Representative state agricultural marketing intelligence feed
                </p>
              </div>

              <span className="badge-verified text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Active APMCs
              </span>
            </div>

            {/* Major Agricultural Commodities */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 space-y-2">
              <div className="text-[11px] font-bold text-gray-700">
                Major State Commodities:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedStateInfo.majorCrops.map((c, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white text-gray-800 font-semibold px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Representative Mandi Price Strip */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                <span>Featured APMC Mandis in {selectedStateInfo.name}:</span>
                <span className="text-emerald-700 font-bold">{stateMarkets.length} Available</span>
              </div>

              {stateMarkets.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-500 text-center border border-gray-200">
                  Select a state with active demo mandi feeds (Maharashtra, Punjab, Karnataka, Andhra Pradesh, Gujarat, Tamil Nadu, MP, UP, etc.).
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {stateMarkets.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 bg-white hover:bg-emerald-50/40 rounded-xl border border-gray-200 shadow-2xs transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-gray-900">{m.name}</div>
                        <div className="text-[11px] text-gray-500">
                          {m.cropName} • {m.district} • {m.arrivalsQuintals}q arrivals
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-800">
                          ₹{m.modalPrice.toLocaleString('en-IN')}/q
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 justify-end">
                          <TrendingUp className="w-3 h-3" /> Demand {m.demandLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleExploreMarkets}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore All Mandis in {selectedStateInfo.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
