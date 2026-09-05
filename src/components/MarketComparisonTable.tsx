import React from 'react';
import {
  Award,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  MapPin,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { MarketComparisonItem, Language } from '../types';
import { getTranslation } from '../lib/translations';

interface MarketComparisonTableProps {
  markets: MarketComparisonItem[];
  quantityInQuintals: number;
  language: Language;
  onSelectMarket?: (mkt: MarketComparisonItem) => void;
}

export const MarketComparisonTable: React.FC<MarketComparisonTableProps> = ({
  markets,
  quantityInQuintals,
  language,
  onSelectMarket
}) => {
  const t = getTranslation(language);

  const getFreshnessBadge = (freshness: string) => {
    switch (freshness) {
      case 'fresh':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.freshnessFresh}
          </span>
        );
      case 'aging':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {t.freshnessAging}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {t.freshnessStale}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
      {/* Table Header / Title */}
      <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Nearby Markets Ranked by Estimated Net Return
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Strictly optimized for net take-home cash after freight and mandi cess
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Net Return Principle: Rank 1 = Maximum Cash in Hand</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">{t.colRank}</th>
              <th className="py-3 px-4">{t.colMarket}</th>
              <th className="py-3 px-4 text-right">{t.colPrice}</th>
              <th className="py-3 px-4 text-center">{t.distance}</th>
              <th className="py-3 px-4 text-right">{t.colGross}</th>
              <th className="py-3 px-4 text-right text-amber-700">{t.colTransport}</th>
              <th className="py-3 px-4 text-right text-amber-700">{t.colCharges}</th>
              <th className="py-3 px-4 text-right text-emerald-800 font-bold">{t.colNetReturn}</th>
              <th className="py-3 px-4 text-center">Freshness</th>
              <th className="py-3 px-4 text-center">{t.colAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {markets.map((mkt) => {
              const isTop = mkt.rank === 1;
              return (
                <tr
                  key={mkt.marketId}
                  className={`hover:bg-emerald-50/40 transition-colors ${
                    isTop ? 'bg-emerald-50/30 font-medium' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isTop ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-emerald-950 font-black text-xs shadow-xs">
                        1
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-xs">
                        {mkt.rank}
                      </span>
                    )}
                  </td>

                  {/* Market Name & District */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900">
                      {mkt.marketName}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{mkt.district}, {mkt.state}</span>
                      {mkt.whyNotHighestGross && (
                        <span className="ml-2 text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded text-[10px] font-medium border border-rose-100">
                          {mkt.whyNotHighestGross}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Crop Selling Price */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                    ₹{mkt.cropPricePerQuintal.toLocaleString('en-IN')}
                    <span className="text-xs text-gray-400 font-normal"> /qtl</span>
                  </td>

                  {/* Distance */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-xs font-semibold text-gray-700">
                    {mkt.distanceKm} km
                  </td>

                  {/* Gross Revenue */}
                  <td className="py-3.5 px-4 text-right font-mono text-gray-900 whitespace-nowrap">
                    ₹{mkt.grossRevenue.toLocaleString('en-IN')}
                  </td>

                  {/* Transport Freight */}
                  <td className="py-3.5 px-4 text-right font-mono text-amber-700 font-semibold whitespace-nowrap">
                    − ₹{mkt.transportCost.toLocaleString('en-IN')}
                  </td>

                  {/* Other Fees */}
                  <td className="py-3.5 px-4 text-right font-mono text-gray-600 whitespace-nowrap text-xs">
                    − ₹{(mkt.loadingCost + mkt.marketCharges).toLocaleString('en-IN')}
                  </td>

                  {/* Net Return */}
                  <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-700 text-base whitespace-nowrap">
                    ₹{mkt.estimatedNetReturn.toLocaleString('en-IN')}
                  </td>

                  {/* Freshness */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getFreshnessBadge(mkt.priceFreshness)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => onSelectMarket && onSelectMarket(mkt)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      <span>Select</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
