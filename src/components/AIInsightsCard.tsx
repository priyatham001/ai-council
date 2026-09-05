import React from 'react';
import {
  Brain,
  CheckCircle2,
  Calculator,
  Truck,
  Lightbulb,
  AlertTriangle,
  Cpu,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AIInsightSection, Language } from '../types';
import { getTranslation } from '../lib/translations';

interface AIInsightsCardProps {
  insightResult: AIInsightSection;
  language: Language;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  insightResult,
  language
}) => {
  const t = getTranslation(language);

  const modelStatuses = [
    { name: 'Google Gemini (Flash 3.8)', active: true, badge: 'Active Server-side Deliberation' },
    { name: 'Anthropic Claude', active: false, badge: 'Optional (Unconfigured)' },
    { name: 'OpenAI GPT', active: false, badge: 'Optional (Unconfigured)' },
    { name: 'Mistral AI', active: false, badge: 'Optional (Unconfigured)' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Header with Confidence Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {t.aiExplanationTitle}
            </h3>
            <p className="text-xs text-gray-500">
              Multi-model economic reasoning with transparent fact vs calculation distinction
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confidence Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {insightResult.confidenceLevel === 'High'
                ? t.confidenceHigh
                : insightResult.confidenceLevel === 'Medium'
                ? t.confidenceMedium
                : t.confidenceLow}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-purple-900 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>

      {/* WHY THIS IS BEST SECTION */}
      {insightResult.whyExplanation && (
        <div className="bg-linear-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>Why {insightResult.recommendedMarket} is the Best Option</span>
          </div>
          <p className="text-sm text-emerald-50 leading-relaxed">
            {insightResult.whyExplanation}
          </p>
          {insightResult.confidenceReason && (
            <p className="text-xs text-emerald-200/80 pt-1 border-t border-emerald-800/80">
              ℹ️ {insightResult.confidenceReason}
            </p>
          )}
        </div>
      )}

      {/* Quality Match Note if provided */}
      {insightResult.qualityMatchExplanation && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
          <span className="font-bold">Quality Factor:</span>
          <span>{insightResult.qualityMatchExplanation}</span>
        </div>
      )}

      {/* Alternative Market Option Considered */}
      {insightResult.alternativeOption && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>{t.alternativeOption} Considered</span>
            </div>
            <span className="text-xs font-bold text-gray-900 bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
              ₹{insightResult.alternativeOption.estimatedNetReturn.toLocaleString('en-IN')} Net
            </span>
          </div>
          <div className="text-xs text-gray-700">
            <span className="font-bold text-gray-900">
              {insightResult.alternativeOption.marketName}
            </span>{' '}
            ({insightResult.alternativeOption.distanceKm} km, ₹{insightResult.alternativeOption.cropPricePerQuintal}/qtl).{' '}
            <span className="text-gray-600">
              {insightResult.alternativeOption.reason}
            </span>
          </div>
        </div>
      )}

      {/* Model Providers Deliberation Status */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
        <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Providers State (Multi-Model Architecture):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {modelStatuses.map((m) => (
            <div
              key={m.name}
              className="bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 flex items-center justify-between text-xs"
            >
              <span className="font-medium text-gray-800">{m.name}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  m.active
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {m.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Pillar Transparent Breakdown (Mandatory Rule) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. FACTS */}
        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{t.aiFacts}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-emerald-950">
            {insightResult.facts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. CALCULATIONS */}
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wide">
            <Calculator className="w-4 h-4 text-blue-700" />
            <span>{t.aiCalculations}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-blue-950">
            {insightResult.calculations.map((calc, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>{calc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. ESTIMATES */}
        <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>{t.aiEstimates}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-950">
            {insightResult.estimates.map((est, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{est}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. AI INSIGHTS & ECONOMIC ADVISORY */}
        <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-purple-700" />
            <span>{t.aiInsights}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-purple-950">
            {insightResult.aiInsights.map((ai, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>{ai}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Risks & Logistics Precautions */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wide">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{t.aiRisks}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-950">
          {(insightResult.riskAndUncertainties || []).map((risk, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-rose-500 font-bold">⚠</span>
              <span>{risk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Transparency Note */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Ethical AI Standard:</strong> Recommendations strictly separate hard facts (mandi rates, distance) from estimates (fuel, wait times) to ensure farmers make fully informed decisions.
        </span>
      </div>
    </div>
  );
};
