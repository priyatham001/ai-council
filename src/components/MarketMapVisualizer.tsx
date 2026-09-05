import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Store,
  UserCheck,
  Compass,
  Layers
} from 'lucide-react';
import { FarmerLocation, MarketComparisonItem, Language } from '../types';
import { getTranslation } from '../lib/translations';

interface MarketMapVisualizerProps {
  farmerLocation: FarmerLocation;
  markets: MarketComparisonItem[];
  language: Language;
}

export const MarketMapVisualizer: React.FC<MarketMapVisualizerProps> = ({
  farmerLocation,
  markets,
  language
}) => {
  const t = getTranslation(language);
  const [selectedMarket, setSelectedMarket] = useState<MarketComparisonItem>(
    markets[0]
  );

  // SVG coordinate transformation
  // Map center at farmerLocation
  const svgWidth = 600;
  const svgHeight = 360;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Scale factor: 1 km = 3.5 px
  const scale = 3.4;

  // Derive coordinates relative to farmer
  const plottedMarkets = markets.map((m, idx) => {
    // Offset lat/lng to px
    const dx = (m.lng - farmerLocation.lng) * 85 * scale;
    const dy = (farmerLocation.lat - m.lat) * 85 * scale;
    // Clamp to canvas boundaries
    const cx = Math.max(50, Math.min(svgWidth - 50, centerX + dx));
    const cy = Math.max(50, Math.min(svgHeight - 50, centerY + dy));

    return {
      ...m,
      cx,
      cy
    };
  });

  const handleOpenGoogleMaps = (mkt: MarketComparisonItem) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${farmerLocation.lat},${farmerLocation.lng}&destination=${mkt.lat},${mkt.lng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Interactive Market & Transport Logistics Network
            </h3>
            <p className="text-xs text-gray-500">
              Visual route layout connecting your farm to regional APMC mandis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Rank #1 (Best Net Return)
          </span>
          <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            Other Evaluated Mandis
          </span>
        </div>
      </div>

      {/* SVG Canvas Map Visualizer */}
      <div className="relative w-full h-[360px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#0ea5e9 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Distance Range concentric circles */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
        >
          {/* Distance radar circles */}
          {[15, 35, 60].map((dist) => (
            <g key={dist}>
              <circle
                cx={centerX}
                cy={centerY}
                r={dist * scale * 0.9}
                fill="none"
                stroke="#cbd5e1"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={centerX + 6}
                y={centerY - dist * scale * 0.9 + 12}
                fill="#94a3b8"
                fontSize="10"
                fontWeight="500"
              >
                {dist} km
              </text>
            </g>
          ))}

          {/* Route lines to each market */}
          {plottedMarkets.map((m) => {
            const isTop = m.rank === 1;
            const isSelected = selectedMarket.marketId === m.marketId;
            return (
              <line
                key={`line-${m.marketId}`}
                x1={centerX}
                y1={centerY}
                x2={m.cx}
                y2={m.cy}
                stroke={isTop ? '#10b981' : isSelected ? '#0ea5e9' : '#cbd5e1'}
                strokeWidth={isTop ? '2.5' : '1.5'}
                strokeDasharray={isTop ? undefined : '5 3'}
              />
            );
          })}

          {/* Farmer Location Pin (Center) */}
          <g transform={`translate(${centerX}, ${centerY})`}>
            <circle r="18" fill="#10b981" opacity="0.2" className="animate-ping" />
            <circle r="12" fill="#047857" stroke="#ffffff" strokeWidth="2" />
            <text
              y="22"
              textAnchor="middle"
              fill="#065f46"
              fontSize="10"
              fontWeight="700"
            >
              Farm ({farmerLocation.villageOrTown})
            </text>
          </g>

          {/* Plotted Markets Pins */}
          {plottedMarkets.map((m) => {
            const isTop = m.rank === 1;
            const isSelected = selectedMarket.marketId === m.marketId;
            return (
              <g
                key={m.marketId}
                transform={`translate(${m.cx}, ${m.cy})`}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => setSelectedMarket(m)}
              >
                {isTop && (
                  <circle
                    r="16"
                    fill="#f59e0b"
                    opacity="0.3"
                    className="animate-pulse"
                  />
                )}
                <circle
                  r={isTop ? '11' : '8'}
                  fill={isTop ? '#f59e0b' : isSelected ? '#0284c7' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  y="-12"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="10"
                  fontWeight={isTop ? '700' : '500'}
                  className="bg-white/80"
                >
                  {m.marketName.split(' ')[0]} ({m.distanceKm} km)
                </text>
                <text
                  y="18"
                  textAnchor="middle"
                  fill={isTop ? '#047857' : '#475569'}
                  fontSize="9"
                  fontWeight="600"
                >
                  Net: ₹{Math.round(m.estimatedNetReturn / 1000)}k
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Active Market Inspector Box */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur p-3 rounded-xl border border-gray-200 shadow-md text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">
              {selectedMarket.marketName}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                selectedMarket.rank === 1
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Rank #{selectedMarket.rank}
            </span>
          </div>

          <div className="text-gray-600 flex items-center justify-between">
            <span>Distance: <strong>{selectedMarket.distanceKm} km</strong></span>
            <span>Freight: <strong>₹{selectedMarket.transportCost}</strong></span>
          </div>

          <div className="text-gray-600 flex items-center justify-between pt-1 border-t border-gray-100">
            <span>Net Return:</span>
            <span className="font-black text-emerald-700 text-sm">
              ₹{selectedMarket.estimatedNetReturn.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={() => handleOpenGoogleMaps(selectedMarket)}
            className="w-full mt-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Directions in Maps</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>

      <div className="text-[11px] text-gray-400 text-center italic">
        * Visual coordinates plotted relative to farm anchor. Highway road distances incorporate rural curvature factors.
      </div>
    </div>
  );
};
