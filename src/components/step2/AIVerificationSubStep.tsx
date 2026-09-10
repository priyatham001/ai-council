import React, { useState } from 'react';
import {
  AIQualityAssessment,
  CropSelectionState,
  Language,
  QualityGrade,
  VisualQualityMarker,
} from '../../types/krishi';
import { TRANSLATIONS } from '../../utils/i18n';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Info,
  Layers,
  X,
  FileCheck2,
  Send,
  Eye,
} from 'lucide-react';

interface AIVerificationSubStepProps {
  language: Language;
  cropState: CropSelectionState;
  isAnalyzing: boolean;
  onAcceptAIGrade: (aiGrade: QualityGrade) => void;
  onConfirmVerifiedGrade: () => void;
  onRequestReupload: () => void;
  onSubmitDisputeManualReview: (disputeReason: string) => void;
  onBack: () => void;
}

export const AIVerificationSubStep: React.FC<AIVerificationSubStepProps> = ({
  language,
  cropState,
  isAnalyzing,
  onAcceptAIGrade,
  onConfirmVerifiedGrade,
  onRequestReupload,
  onSubmitDisputeManualReview,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedMarker, setSelectedMarker] = useState<VisualQualityMarker | null>(null);
  const [showDisputePanel, setShowDisputePanel] = useState(false);

  // 4 Required Checkboxes for Manual Verification
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);
  const [checkbox4, setCheckbox4] = useState(false);

  const allCheckboxesChecked = checkbox1 && checkbox2 && checkbox3 && checkbox4;

  const assessment = cropState.aiAssessment;
  const report = assessment?.explainableReport;
  const markers = report?.markers || assessment?.visualMarkers || [];

  const farmerGrade = cropState.qualityGrade;
  const aiGrade = (assessment?.suggestedGrade === 'REJECT'
    ? 'REJECT'
    : (assessment?.suggestedGrade as QualityGrade)) || 'B';

  // Check agreement
  const isAgreed =
    farmerGrade !== null &&
    farmerGrade !== 'Custom' &&
    farmerGrade === aiGrade;

  const isCustomOrUnsure = farmerGrade === 'Custom' || !farmerGrade;

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-3xl p-10 sm:p-14 border border-stone-200/80 shadow-md text-center space-y-6">
        <div className="relative w-36 h-36 mx-auto">
          {cropState.cropPhoto && (
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-stone-300">
              <img
                src={cropState.cropPhoto}
                alt="Scanning produce"
                className="w-full h-full object-cover filter blur-[1px]"
              />
            </div>
          )}
          {/* Animated Scanning Bar */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
          </div>
          <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md animate-spin">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-stone-900">
            🔍 KrishiSetu AI is verifying your crop quality...
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Running Explainable AI vision models: evaluating natural color pigments, sizing uniformity, surface cleanliness, and checking for blemishes.
          </p>
        </div>

        <div className="max-w-xs mx-auto bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
          Detecting quality landmarks & markers...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-7 border-2 shadow-xs ${
          isAgreed || isCustomOrUnsure
            ? 'bg-emerald-900 text-white border-emerald-700'
            : 'bg-amber-950 text-white border-amber-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                isAgreed || isCustomOrUnsure
                  ? 'bg-emerald-800 text-emerald-200'
                  : 'bg-amber-800 text-amber-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Step 3 of 3 • Explainable AI Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              {isAgreed ? (
                <>🟢 Quality Verified: Grade {aiGrade}</>
              ) : isCustomOrUnsure ? (
                <>✨ AI Recommended: Grade {aiGrade}</>
              ) : (
                <>⚠️ Quality Difference Detected</>
              )}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
              {isAgreed
                ? `Your selected quality grade matches our image analysis. All visual parameters align with Grade ${aiGrade}.`
                : isCustomOrUnsure
                ? `KrishiSetu AI has visually assessed your harvest photo and recommends Grade ${aiGrade}.`
                : `You selected Grade ${farmerGrade}, but KrishiSetu AI recommends Grade ${aiGrade} based on the highlighted areas.`}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white/20 shrink-0 text-center sm:text-right">
            <div className="text-[11px] text-stone-300 uppercase tracking-wider font-bold">
              AI Confidence
            </div>
            <div className="text-2xl font-black text-amber-300">
              {Math.round((report?.confidenceScore || 0.87) * 100)}%
            </div>
            <div className="text-[10px] text-stone-300">Visual Vision Model</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Crop Image with Markers + Explainable Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Crop Image with Interactive Markers Overlay */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-700" />
                Harvest Photograph & Visual Markers
              </h3>
              <p className="text-xs text-stone-500">
                Click any colored marker on the photo below to see the AI's explanation.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Good
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Minor
              </span>
              <span className="flex items-center gap-1 text-red-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Defect
              </span>
            </div>
          </div>

          {/* Interactive Image Canvas */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-300 bg-stone-950 select-none shadow-inner">
            {cropState.cropPhoto ? (
              <img
                src={cropState.cropPhoto}
                alt="Inspected produce harvest"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                No photo loaded
              </div>
            )}

            {/* Render Visual Markers as interactive SVG overlay pins */}
            {markers.map((marker, idx) => {
              const isSelected = selectedMarker?.id === marker.id;
              const colorClass =
                marker.type === 'good'
                  ? 'bg-emerald-600 border-white text-white ring-emerald-300'
                  : marker.type === 'minor'
                  ? 'bg-amber-500 border-white text-white ring-amber-300'
                  : 'bg-red-600 border-white text-white ring-red-300';

              const pulseRing =
                marker.type === 'good'
                  ? 'bg-emerald-400'
                  : marker.type === 'minor'
                  ? 'bg-amber-400'
                  : 'bg-red-400';

              return (
                <div
                  key={marker.id}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  onClick={() => setSelectedMarker(marker)}
                >
                  {/* Pulsing ring */}
                  <span
                    className={`absolute -inset-1.5 rounded-full opacity-75 animate-ping ${pulseRing}`}
                  />

                  {/* Marker Pin Circle */}
                  <button
                    type="button"
                    className={`relative w-8 h-8 rounded-full border-2 font-black text-xs flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${colorClass} ${
                      isSelected ? 'scale-125 ring-4' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>

                  {/* Label tooltip on hover */}
                  <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-0.5 rounded-md bg-stone-900/90 text-white text-[10px] font-bold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    {marker.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Marker List Pills */}
          <div className="pt-2">
            <div className="text-[11px] font-bold text-stone-700 mb-2">
              Detected Markers on Produce (Click to inspect):
            </div>
            <div className="flex flex-wrap gap-2">
              {markers.map((m, idx) => {
                const isSelected = selectedMarker?.id === m.id;
                const badgeColor =
                  m.type === 'good'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : m.type === 'minor'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-red-50 text-red-800 border-red-300';

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMarker(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${badgeColor} ${
                      isSelected ? 'ring-2 ring-stone-800 shadow-xs' : 'hover:opacity-90'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white text-stone-900 text-[10px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Marker Details Popup / Drawer */}
          {selectedMarker && (
            <div className="bg-stone-900 text-white p-4 rounded-2xl space-y-2 relative animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => setSelectedMarker(null)}
                className="absolute top-3 right-3 text-stone-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    selectedMarker.type === 'good'
                      ? 'bg-emerald-500 text-white'
                      : selectedMarker.type === 'minor'
                      ? 'bg-amber-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {selectedMarker.type === 'good'
                    ? '✓ Good Quality Feature'
                    : selectedMarker.type === 'minor'
                    ? '⚠ Minor Issue Detected'
                    : '✕ Defect / Quality Issue'}
                </span>
                <span className="text-xs text-stone-400">
                  Location: Marker #{markers.findIndex((m) => m.id === selectedMarker.id) + 1}
                </span>
              </div>

              <div className="text-sm font-bold text-stone-100">
                {selectedMarker.label}
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                <strong>AI Observation:</strong> {selectedMarker.observation}
              </p>

              <div className="text-xs text-amber-200 bg-white/10 p-2 rounded-xl">
                <strong>Impact on Grade:</strong> {selectedMarker.impact}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Explainable Factors & Comparison Table */}
        <div className="lg:col-span-5 space-y-5">
          {/* Factor Highlights Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-black text-stone-900">
              Explainable AI Visual Breakdown
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Color */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-stone-700">Color</span>
                  <span className="font-black text-emerald-700">
                    🟢 {report?.color.rating || 'Good'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  {report?.color.description || 'Healthy and consistent coloring.'}
                </p>
              </div>

              {/* Uniformity */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-stone-700">Uniformity</span>
                  <span className="font-black text-amber-700">
                    🟡 {report?.uniformity.rating || 'Moderate'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  {report?.uniformity.description || 'Noticeable sizing variation in sections.'}
                </p>
              </div>

              {/* Surface Quality */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-stone-700">Surface</span>
                  <span className="font-black text-amber-700">
                    🟡 {report?.surfaceQuality.rating || 'Minor Issues'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  {report?.surfaceQuality.description || 'A few areas show discoloration.'}
                </p>
              </div>

              {/* Damaged Items */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-stone-700">Damaged Items</span>
                  <span className="font-black text-red-700">
                    🔴 {report?.damage.rating || 'Minor Detected'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  {report?.damage.description || 'Minor damaged pieces in highlighted areas.'}
                </p>
              </div>
            </div>

            {/* Visual Assessment Notice */}
            <div className="bg-stone-100/90 rounded-2xl p-3 border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div className="font-bold text-stone-800 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-stone-700" />
                Visual assessment from this photo
              </div>
              <p>
                Evaluation is based on exterior optical traits (size, surface pigment, visible blemishes). Internal moisture percentage and biochemical metrics require laboratory moisture meter testing.
              </p>
            </div>
          </div>

          {/* Grade Comparison Table */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-black text-stone-900">
              Grade Comparison Table
            </h3>

            <div className="overflow-hidden rounded-2xl border border-stone-200 text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-2.5">Quality Factor</th>
                    <th className="p-2.5">Farmer Selected</th>
                    <th className="p-2.5">AI Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {report?.factorsTable.map((row, idx) => (
                    <tr
                      key={idx}
                      className={row.status === 'match' ? 'bg-emerald-50/40' : 'bg-white'}
                    >
                      <td className="p-2.5 font-bold text-stone-800">{row.factor}</td>
                      <td className="p-2.5 text-stone-600">{row.farmerSelected}</td>
                      <td className="p-2.5 font-bold text-stone-900">
                        {row.aiAnalysis}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Why the grades are different */}
            <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Why the grades are different
              </div>
              <p className="leading-relaxed">
                {report?.whyExplanation ||
                  `The farmer selected Grade ${farmerGrade}, but the AI recommends Grade ${aiGrade} because the image contains minor discoloration and some damaged crop areas highlighted in yellow/red.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Outcome Actions Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
        {/* Case 1: AI Agrees (or farmer is Custom/Not Sure) */}
        {isAgreed || isCustomOrUnsure ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                Ready for Market Discovery
              </div>
              <div className="text-xl font-black text-stone-900 mt-0.5">
                Confirm Grade {aiGrade} & Proceed
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                KrishiSetu will use Grade {aiGrade} to calculate modal price adjustments across nearby mandis.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onRequestReupload}
                className="px-4 py-3 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                🔄 Retake Photo
              </button>

              <button
                type="button"
                id="btn-confirm-verified-grade"
                onClick={onConfirmVerifiedGrade}
                className="px-7 py-3.5 rounded-2xl font-black text-sm bg-emerald-700 hover:bg-emerald-800 text-white shadow-md inline-flex items-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Continue to Market Comparison
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Case 2: AI Disagrees */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-amber-800">
                  Select Your Next Step
                </div>
                <div className="text-xl font-black text-stone-900 mt-0.5">
                  How would you like to proceed?
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Choose to accept the AI recommendation, capture another clearer photo, or dispute for authority manual review.
                </div>
              </div>
            </div>

            {/* Three Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Option 1: Accept AI Assessment */}
              <button
                type="button"
                id="btn-accept-ai-grade"
                onClick={() => onAcceptAIGrade(aiGrade as QualityGrade)}
                className="p-5 rounded-2xl border-2 border-emerald-600 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    Recommended
                  </span>
                  <h4 className="text-base font-black text-emerald-950 mt-2">
                    ✅ Accept AI Assessment — Grade {aiGrade}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Update your crop to Grade {aiGrade} and immediately view real-time market rates and transport calculations.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-emerald-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Continue with Grade {aiGrade} →
                </div>
              </button>

              {/* Option 2: Upload Another Photo */}
              <button
                type="button"
                id="btn-reupload-photo"
                onClick={onRequestReupload}
                className="p-5 rounded-2xl border-2 border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    Try Again
                  </span>
                  <h4 className="text-base font-black text-stone-900 mt-2">
                    🔄 Upload Another Photo
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Take a clearer photo in direct daylight or pick a different sample section of your harvest lot.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-stone-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Retake Photo →
                </div>
              </button>

              {/* Option 3: I Disagree */}
              <button
                type="button"
                id="btn-disagree-ai"
                onClick={() => setShowDisputePanel(!showDisputePanel)}
                className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xs ${
                  showDisputePanel
                    ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-400'
                    : 'border-amber-200 bg-amber-50/40 hover:bg-amber-100/50'
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-300">
                    Authority Review
                  </span>
                  <h4 className="text-base font-black text-amber-950 mt-2">
                    ⚠️ I Disagree With AI Assessment
                  </h4>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    Request manual verification from market/mandi authorities while retaining your selected Grade {farmerGrade}.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-amber-900 flex items-center gap-1">
                  {showDisputePanel ? 'Close Dispute Panel ▲' : 'Open Verification Request ▼'}
                </div>
              </button>
            </div>

            {/* Manual Verification Request Panel */}
            {showDisputePanel && (
              <div
                id="manual-verification-panel"
                className="bg-amber-50/90 rounded-3xl p-6 sm:p-7 border-2 border-amber-300 space-y-5 animate-in fade-in duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-stone-900">
                      Manual Verification Request for Mandi Authorities
                    </h4>
                    <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                      You have disagreed with the AI quality assessment. Your crop photograph, the AI analysis with highlighted issues, and the quality grade you selected (<strong>Grade {farmerGrade}</strong>) will be sent to the relevant agricultural/market authorities for manual verification. The final verification may affect the quality grade used for market comparison and pricing.
                    </p>
                  </div>
                </div>

                {/* 4 Required Checkboxes */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 space-y-3">
                  <div className="text-xs font-bold text-stone-900 mb-1">
                    Please confirm the following declarations to proceed with manual verification:
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="checkbox-ownership"
                      checked={checkbox1}
                      onChange={(e) => setCheckbox1(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-stone-800 font-medium">
                      1. I confirm this image belongs to my crop.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="checkbox-ai-awareness"
                      checked={checkbox2}
                      onChange={(e) => setCheckbox2(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-stone-800 font-medium">
                      2. I understand that the AI detected the highlighted quality issues.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="checkbox-disagree-intent"
                      checked={checkbox3}
                      onChange={(e) => setCheckbox3(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-stone-800 font-medium">
                      3. I still disagree with the AI assessment and request manual verification.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="checkbox-authority-ruling"
                      checked={checkbox4}
                      onChange={(e) => setCheckbox4(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-stone-800 font-medium">
                      4. I agree that the final authority decision may determine the market quality grade.
                    </span>
                  </label>
                </div>

                {/* Submit Dispute Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-amber-900 font-medium">
                    {!allCheckboxesChecked
                      ? '⚠️ All 4 declarations above must be checked to submit.'
                      : '✓ All declarations confirmed. Ready to submit to authorities.'}
                  </div>

                  <button
                    type="button"
                    id="btn-submit-dispute"
                    disabled={!allCheckboxesChecked}
                    onClick={() =>
                      onSubmitDisputeManualReview(
                        `Farmer disputed AI assessment (Grade ${aiGrade}) in favor of Grade ${farmerGrade}. All 4 verification declarations confirmed.`
                      )
                    }
                    className={`px-6 py-3 rounded-xl font-black text-xs inline-flex items-center gap-2 transition-all cursor-pointer ${
                      allCheckboxesChecked
                        ? 'bg-amber-800 hover:bg-amber-900 text-white shadow-md active:scale-98'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Submit for Authority Verification & Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
