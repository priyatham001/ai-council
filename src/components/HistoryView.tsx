import React from 'react';
import {
  History as HistoryIcon,
  Trash2,
  RefreshCw,
  MapPin,
  Calendar,
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { FarmerSearchHistory, Language } from '../types';
import { getTranslation } from '../lib/translations';

interface HistoryViewProps {
  history: FarmerSearchHistory[];
  language: Language;
  onSelectHistoryItem: (item: FarmerSearchHistory) => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  language,
  onSelectHistoryItem,
  onDeleteHistoryItem
}) => {
  const t = getTranslation(language);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-emerald-600" />
            <span>Saved Farm Search & Price Comparison Records</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Review your previously evaluated market recommendations and net margin calculations
          </p>
        </div>

        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          {history.length} Saved Records
        </span>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">
            No Search Records Yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Run a market calculation in the Find Best Market tab to save comparison records here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-emerald-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {item.cropName} • {item.quantity} {item.unit}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1.5">
                      {item.recommendedMarket}
                    </h3>
                  </div>

                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.createdAt)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>Farm Origin: {item.farmerLocation}</span>
                </div>

                {/* Numbers Row */}
                <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                  <div>
                    <div className="text-[11px] text-gray-400">Gross Sale</div>
                    <div className="text-xs font-bold text-gray-800 font-mono mt-0.5">
                      ₹{item.grossRevenue.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-amber-600">Transport</div>
                    <div className="text-xs font-bold text-amber-700 font-mono mt-0.5">
                      − ₹{item.estimatedTransport.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-emerald-600 font-bold">Net Return</div>
                    <div className="text-sm font-black text-emerald-700 font-mono mt-0.5">
                      ₹{item.recommendedNetReturn.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => onDeleteHistoryItem(item.id)}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>

                <button
                  onClick={() => onSelectHistoryItem(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-emerald-200"
                >
                  <span>Re-run Comparison</span>
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
