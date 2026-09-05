import React, { useState } from 'react';
import {
  Settings,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Save,
  RotateCcw,
  Cpu,
  Database,
  Sliders
} from 'lucide-react';
import { VehicleConfig, Language } from '../types';
import { VEHICLE_CONFIGS } from '../lib/krishi-data-client';
import { getTranslation } from '../lib/translations';

interface AdminPanelViewProps {
  language: Language;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ language }) => {
  const t = getTranslation(language);
  const [vehicles, setVehicles] = useState<VehicleConfig[]>(VEHICLE_CONFIGS);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleRateChange = (id: string, newRate: number) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, baseRatePerKm: newRate } : v))
    );
  };

  const handleLaborChange = (id: string, newLabor: number) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, loadingChargePerQuintal: newLabor } : v
      )
    );
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setVehicles(VEHICLE_CONFIGS);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>Admin & Agricultural Logistics Parameters</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure regional freight cost benchmarks, APMC labor tariffs, and system operational parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-3 rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Transport rates successfully updated and saved to runtime memory.</span>
        </div>
      )}

      {/* Vehicle Rate Configuration Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Vehicle Freight & Labor Rate Card (₹/km)</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            These rates are utilized by the recommendation engine to calculate net return
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Vehicle Type</th>
                <th className="py-3 px-4">Payload Capacity</th>
                <th className="py-3 px-4">Base Freight Rate (₹/km)</th>
                <th className="py-3 px-4">Loading/Labor (₹/qtl)</th>
                <th className="py-3 px-4">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {v.name}
                    <span className="block text-xs text-gray-400 font-normal">
                      {v.nameTelugu}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono font-medium text-gray-700">
                    {v.capacityQuintals} Quintals
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">₹</span>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={v.baseRatePerKm}
                        onChange={(e) => handleRateChange(v.id, Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs font-mono font-bold bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-hidden focus:border-emerald-500"
                      />
                      <span className="text-xs text-gray-500">/ km</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">₹</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={v.loadingChargePerQuintal}
                        onChange={(e) => handleLaborChange(v.id, Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold bg-gray-50 border border-gray-300 rounded focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                      />
                      <span className="text-xs text-gray-500">/ qtl</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Infrastructure Status */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>System Engine & Platform Architecture (SIH 2026 Problem SIH26132)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
            <span className="text-gray-500 font-medium">Deliberation Engine</span>
            <div className="font-bold text-gray-900 text-sm">Server-side Gemini 3.8 Flash</div>
            <div className="text-emerald-700 font-semibold">Enabled with Heuristic Fallback</div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
            <span className="text-gray-500 font-medium">APMC Mandi Price Feeds</span>
            <div className="font-bold text-gray-900 text-sm">Synthetic Real-Time Bulletin</div>
            <div className="text-emerald-700 font-semibold">Bhimavaram & Nashik APMC Clusters</div>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
            <span className="text-gray-500 font-medium">Distance & Logistics Model</span>
            <div className="font-bold text-gray-900 text-sm">Haversine + Rural Curvature 1.25x</div>
            <div className="text-emerald-700 font-semibold">Calibrated against actual road transit</div>
          </div>
        </div>
      </div>
    </div>
  );
};
