import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  CROPS_CATALOG,
  SAMPLE_MARKETS,
  generateCropPriceTrends,
  generatePriceForecast
} from '../lib/krishi-data-client';
import { Language } from '../types';
import { getTranslation } from '../lib/translations';

interface PriceTrendsViewProps {
  language: Language;
}

export const PriceTrendsView: React.FC<PriceTrendsViewProps> = ({ language }) => {
  const t = getTranslation(language);
  const [selectedCropId, setSelectedCropId] = useState('paddy');
  const [selectedMarketId, setSelectedMarketId] = useState('mkt_tanuku');
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const selectedCrop =
    CROPS_CATALOG.find((c) => c.id === selectedCropId) || CROPS_CATALOG[0];
  const selectedMarket =
    SAMPLE_MARKETS.find((m) => m.id === selectedMarketId) || SAMPLE_MARKETS[0];

  const trendSeries = generateCropPriceTrends(
    selectedCropId,
    selectedMarketId,
    period
  );
  const trendPoints = trendSeries.points;
  const forecast = generatePriceForecast(selectedCropId, selectedMarketId);

  // Calculate metrics
  const prices = trendPoints.map((d) => d.modalPrice);
  const avgPrice = trendSeries.averagePrice;
  const maxRecorded = trendSeries.highestPrice;
  const minRecorded = trendSeries.lowestPrice;
  const startPrice = prices[0] || 0;
  const endPrice = prices[prices.length - 1] || 0;
  const pctChange =
    startPrice > 0
      ? Math.round(((endPrice - startPrice) / startPrice) * 1000) / 10
      : 0;
  const isPositive = pctChange >= 0;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Historical Price Trends & Statistical Outlook</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Analyze multi-day price momentum and volume arrivals to time your harvest sale
            </p>
          </div>

          {/* Time Period Filter */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  period === p
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Selectors: Crop and Mandi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Select Crop
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
            >
              {CROPS_CATALOG.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nameTelugu})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Select APMC Mandi
            </label>
            <select
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
            >
              {SAMPLE_MARKETS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.district}, {m.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500">Period Average</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            ₹{avgPrice.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-gray-400">per quintal</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500">Peak High</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            ₹{maxRecorded.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600">Max auction price</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500">Period Low</div>
          <div className="text-xl font-bold text-gray-700 mt-1">
            ₹{minRecorded.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-gray-400">Floor level</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500">{period} Price Trajectory</div>
          <div
            className={`text-xl font-bold mt-1 flex items-center gap-1 ${
              isPositive ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-5 h-5" />
            ) : (
              <ArrowDownRight className="w-5 h-5" />
            )}
            <span>{pctChange > 0 ? `+${pctChange}%` : `${pctChange}%`}</span>
          </div>
          <div className="text-[11px] text-gray-400">Net momentum</div>
        </div>
      </div>

      {/* Main Interactive Recharts Composed Area Chart */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">
            {selectedCrop.name} Price Curve at {selectedMarket.name}
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            Values in ₹/Quintal
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={trendPoints}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                formatter={(val: any) => [`₹${val}/qtl`, 'Modal Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="modalPrice"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistical Price Forecast Card (Transparently Disclaimed) */}
      <div className="bg-linear-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg border border-purple-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-bold text-white">
              7-Day Statistical Price Outlook (Heuristic Forecast)
            </h3>
          </div>
          <span className="bg-white/20 text-purple-200 text-xs px-2.5 py-1 rounded-full font-medium uppercase">
            Confidence: {forecast.confidence}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
            <div className="text-xs text-purple-200">Direction</div>
            <div className="text-lg font-bold text-amber-300 mt-1 capitalize">
              {forecast.direction} Momentum
            </div>
            <div className="text-[11px] text-purple-300">Arrival momentum index</div>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
            <div className="text-xs text-purple-200">Projected Modal Range</div>
            <div className="text-lg font-bold text-white mt-1 font-mono">
              ₹{forecast.predictedRange.min} - ₹{forecast.predictedRange.max}
            </div>
            <div className="text-[11px] text-purple-300">Expected: ₹{forecast.expectedPrice}/qtl</div>
          </div>

          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
            <div className="text-xs text-purple-200">Economic Guidance</div>
            <div className="text-sm font-semibold text-emerald-300 mt-1 leading-snug">
              {forecast.explanation}
            </div>
          </div>
        </div>

        <div className="text-xs text-purple-200 bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> {forecast.disclaimer}
          </span>
        </div>
      </div>
    </div>
  );
};
