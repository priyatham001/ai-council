import React from 'react';
import { DEMO_CROPS } from '../../data/mockData';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export const MarketTicker: React.FC = () => {
  return (
    <div className="bg-emerald-900 text-white text-xs py-2 px-4 overflow-hidden border-b border-emerald-800 shadow-inner flex items-center select-none">
      <div className="flex items-center gap-2 pr-4 border-r border-emerald-700/80 shrink-0 font-semibold tracking-wide text-emerald-300">
        <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
        <span className="uppercase text-[10px] bg-emerald-800/80 px-1.5 py-0.5 rounded text-emerald-200">
          Mandi Ticker
        </span>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap pl-4 py-0.5">
        {DEMO_CROPS.map((crop) => {
          const isUp = crop.priceChangePct >= 0;
          return (
            <div key={crop.id} className="flex items-center gap-2 hover:bg-emerald-800/50 px-2 py-0.5 rounded transition-colors">
              <span className="font-medium text-emerald-100">{crop.name}</span>
              <span className="font-bold text-white">₹{crop.currentModalPrice.toLocaleString('en-IN')}<span className="text-[10px] text-emerald-300/80 font-normal">/q</span></span>
              <span
                className={`flex items-center text-[11px] font-semibold px-1 rounded ${
                  isUp ? 'text-emerald-300 bg-emerald-950/60' : 'text-rose-300 bg-rose-950/60'
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 text-rose-400" />
                )}
                {isUp ? '+' : ''}
                {crop.priceChangePct}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="ml-auto pl-4 shrink-0 text-[10px] text-emerald-300/90 font-mono hidden md:block">
        <span className="bg-emerald-800/60 px-2 py-0.5 rounded border border-emerald-700/50">
          Demo market data
        </span>
      </div>
    </div>
  );
};
