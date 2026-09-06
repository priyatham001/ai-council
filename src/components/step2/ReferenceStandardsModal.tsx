import React from 'react';
import { CropItem } from '../../types/krishi';
import { getCropQualityStandard, CropQualityStandard } from '../../data/cropQualityStandards';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, BookOpen, Info } from 'lucide-react';

interface ReferenceStandardsModalProps {
  crop: CropItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceStandardsModal: React.FC<ReferenceStandardsModalProps> = ({
  crop,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const standard: CropQualityStandard = getCropQualityStandard(crop.id || crop.name, crop.category);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-fadeIn my-6">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center text-xl">
              {crop.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded">
                  Official Mandi / Agmark Standard
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Quality Inspection Standards: {standard.cropName}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-800 text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5 text-stone-800">
          {/* Overview Banner */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-600">
              <p className="font-bold text-stone-900">
                Indian APMC & Agmark Grading Protocol
              </p>
              <p className="mt-0.5">
                These standardized visual benchmarks are used by licensed Mandi assayers and KrishiSetu AI to grade agricultural harvest lots. Harvest samples are strictly compared against these thresholds.
              </p>
            </div>
          </div>

          {/* CRITICAL REJECTION DISQUALIFIERS */}
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-2">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <span>Mandatory Rejection Conditions (Disqualified from Grade A/B)</span>
            </div>
            <p className="text-xs text-red-800 mb-3">
              Any lot exhibiting ANY of the following defects is immediately rejected by assayers and flagged as unmarketable or sub-standard salvage:
            </p>
            <ul className="space-y-1.5 text-xs text-red-900 list-disc list-inside">
              {standard.rejectionDisqualifiers.map((reason, idx) => (
                <li key={idx} className="font-medium">
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* THREE GRADE TIERS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Grading Benchmark Tiers
            </h4>

            {/* Grade A Card */}
            <div className="border border-emerald-300 bg-emerald-50/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
                    A
                  </span>
                  <span className="font-extrabold text-sm text-emerald-950">
                    {standard.gradeA.title}
                  </span>
                </div>
                <span className="bg-emerald-200 text-emerald-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {standard.gradeA.priceImpact}
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-800 mb-2">
                Max Defect Limit: {standard.gradeA.maxDefectTolerance}
              </p>
              <ul className="space-y-1 text-xs text-emerald-900 list-disc list-inside pl-1">
                {standard.gradeA.visualStandards.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Grade B Card */}
            <div className="border border-blue-200 bg-blue-50/40 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center">
                    B
                  </span>
                  <span className="font-extrabold text-sm text-blue-950">
                    {standard.gradeB.title}
                  </span>
                </div>
                <span className="bg-blue-100 text-blue-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {standard.gradeB.priceImpact}
                </span>
              </div>
              <p className="text-[11px] font-bold text-blue-800 mb-2">
                Max Defect Limit: {standard.gradeB.maxDefectTolerance}
              </p>
              <ul className="space-y-1 text-xs text-blue-900 list-disc list-inside pl-1">
                {standard.gradeB.visualStandards.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Grade C Card */}
            <div className="border border-amber-300 bg-amber-50/40 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center">
                    C
                  </span>
                  <span className="font-extrabold text-sm text-amber-950">
                    {standard.gradeC.title}
                  </span>
                </div>
                <span className="bg-amber-200 text-amber-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {standard.gradeC.priceImpact}
                </span>
              </div>
              <p className="text-[11px] font-bold text-amber-800 mb-2">
                Max Defect Limit: {standard.gradeC.maxDefectTolerance}
              </p>
              <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside pl-1">
                {standard.gradeC.visualStandards.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* LABORATORY TESTING BOUNDARIES */}
          <div className="bg-stone-100 border border-stone-300 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs mb-2">
              <Info className="w-4 h-4 text-stone-600 shrink-0" />
              <span>Mandatory Physical & Chemical Testing Boundaries</span>
            </div>
            <p className="text-xs text-stone-600 mb-2">
              Computer vision evaluates optical surface traits only. The following critical parameters require accredited physical instruments:
            </p>
            <ul className="space-y-1 text-xs text-stone-700 list-disc list-inside">
              {standard.laboratoryLimits.map((limit, idx) => (
                <li key={idx}>{limit}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
