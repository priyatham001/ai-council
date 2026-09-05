import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MarketComparisonItem, Language } from '../types';
import { getTranslation } from '../lib/translations';

interface MarketComparisonChartsProps {
  markets: MarketComparisonItem[];
  language: Language;
}

export const MarketComparisonCharts: React.FC<MarketComparisonChartsProps> = ({
  markets,
  language
}) => {
  const t = getTranslation(language);

  // Prepare data for Chart 1: Price vs Net Return
  const priceVsNetData = markets.slice(0, 5).map((m) => ({
    name: m.marketName.split(' ')[0], // Short name
    fullName: m.marketName,
    marketPrice: m.cropPricePerQuintal,
    netReturnPerQuintal: m.effectivePricePerQuintal,
    isTop: m.rank === 1
  }));

  // Prepare data for Chart 2: Total Revenue breakdown
  const revenueBreakdownData = markets.slice(0, 5).map((m) => ({
    name: m.marketName.split(' ')[0],
    fullName: m.marketName,
    netReturn: m.estimatedNetReturn,
    transportCost: m.transportCost,
    otherFees: m.loadingCost + m.marketCharges,
    grossRevenue: m.grossRevenue,
    isTop: m.rank === 1
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Board Price vs Real Effective Net Price */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Market Board Rate vs Real Take-Home Rate (₹/quintal)
          </h3>
          <p className="text-xs text-gray-500">
            Notice how transport freight reduces the real cash in hand for distant high-rate mandis
          </p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={priceVsNetData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  `₹${Number(value).toLocaleString('en-IN')}`,
                  name === 'marketPrice'
                    ? 'Mandi Board Rate'
                    : 'Effective Net Take-Home'
                ]}
                labelFormatter={(label) => {
                  const item = priceVsNetData.find((p) => p.name === label);
                  return item ? item.fullName : label;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                formatter={(value) =>
                  value === 'marketPrice'
                    ? 'Mandi Board Price (₹/qtl)'
                    : 'Effective In-Pocket Price (₹/qtl)'
                }
              />
              <Bar dataKey="marketPrice" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="netReturnPerQuintal" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Total Revenue Allocation (Net Cash vs Transport Freight) */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Gross Revenue Allocation (Net Cash vs Transport Costs)
          </h3>
          <p className="text-xs text-gray-500">
            Comparison of total estimated earnings and logistics deductions (₹)
          </p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueBreakdownData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  `₹${Number(value).toLocaleString('en-IN')}`,
                  name === 'netReturn'
                    ? 'Estimated Net Return'
                    : name === 'transportCost'
                    ? 'Transport Freight'
                    : 'Other Fees'
                ]}
                labelFormatter={(label) => {
                  const item = revenueBreakdownData.find((p) => p.name === label);
                  return item ? item.fullName : label;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                formatter={(value) =>
                  value === 'netReturn'
                    ? 'Net Return (Your Pocket)'
                    : value === 'transportCost'
                    ? 'Transport Freight Cost'
                    : 'Loading & Mandi Cess'
                }
              />
              <Bar dataKey="netReturn" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="transportCost" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="otherFees" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
