import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  Share2,
  FileCode,
  Swords,
  Database,
} from 'lucide-react';
import { CouncilAnalysisDocument, ProviderResponse } from '../../types/ai';
import { MarkdownView } from './MarkdownView';

interface AnalysisResultViewProps {
  analysis: CouncilAnalysisDocument;
  onReset?: () => void;
  savedToDb?: boolean;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  analysis,
  onReset,
  savedToDb = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(
    analysis.responses[0]?.provider || null
  );

  const handleCopyFinal = () => {
    navigator.clipboard.writeText(analysis.finalAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confidenceScore = analysis.confidence || 90;
  const isDemo = analysis.isDemo || analysis.responses.some((r) => r.isDemo);

  return (
    <div id="council-analysis-result-container" className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Demo Warning Banner if simulated */}
      {isDemo && (
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>
              <strong>Demo Mode:</strong> Responses and deliberations are simulated for demonstration.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono text-[10px] uppercase">
            Simulation
          </span>
        </div>
      )}

      {/* Query Banner */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#09090b] text-[#a1a1aa] border border-[#27272a] text-[11px] font-semibold uppercase tracking-wider">
              {analysis.mode}
            </span>
            <span className="text-xs text-[#71717a] font-mono">
              {new Date(analysis.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-[#71717a]">
              <Database className="w-3.5 h-3.5" />
              <span>{savedToDb ? 'Saved to MongoDB Atlas' : 'Saved to Session Storage'}</span>
            </div>
            {onReset && (
              <button
                onClick={onReset}
                className="text-white hover:text-blue-400 transition-colors font-medium cursor-pointer text-xs flex items-center gap-1"
              >
                + New Inquiry
              </button>
            )}
          </div>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {analysis.question}
        </h2>
        {analysis.files && analysis.files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#27272a]">
            {analysis.files.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#09090b] border border-[#27272a] text-[#a1a1aa] text-xs font-mono"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                {f.filename} ({(f.size / 1024).toFixed(1)} KB)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bento Grid Layout for Analysis & Synthesis */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Final Judge Synthesis tile */}
        <div
          id="final-answer-section"
          className="col-span-12 lg:col-span-8 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">
                  Final Judge Synthesis
                </h3>
              </div>
              <button
                onClick={handleCopyFinal}
                className="flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-white transition-colors cursor-pointer bg-[#09090b] px-2.5 py-1 rounded border border-[#27272a]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-[#fafafa] text-sm leading-relaxed">
              <MarkdownView content={analysis.finalAnswer} />
            </div>
          </div>
        </div>

        {/* Confidence Score Bento Tile */}
        <div className="col-span-12 lg:col-span-4 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-bold text-white mb-1 tracking-tight">
            {confidenceScore}<span className="text-2xl text-blue-500 font-bold">%</span>
          </div>
          <div className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-widest">
            Confidence Score
          </div>
          <div className="mt-4 w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-1000 ease-out"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[#71717a] mt-3">
            Calibrated against cross-model consensus and factual validation.
          </p>
        </div>

        {/* Council Consensus Bento Tile */}
        <div
          id="council-consensus-card"
          className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase text-[#a1a1aa]">Council Consensus</h3>
            <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
              {analysis.analysis?.consensus?.length || 0} Points
            </span>
          </div>
          <div className="space-y-2 flex-1">
            {analysis.analysis?.consensus && analysis.analysis.consensus.length > 0 ? (
              analysis.analysis.consensus.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-[#09090b] border border-[#27272a]/60 text-xs text-[#fafafa] flex items-start gap-2"
                >
                  <span className="text-green-500 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#71717a] italic">No consensus recorded.</p>
            )}
          </div>
        </div>

        {/* Critic Findings Bento Tile */}
        <div
          id="council-critic-card"
          className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase text-[#a1a1aa]">Critic Findings</h3>
            <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20">
              {(analysis.critic?.criticalErrors?.length || 0) + (analysis.critic?.unsupportedClaims?.length || 0)} Items
            </span>
          </div>
          <div className="space-y-2 flex-1">
            {analysis.critic?.criticalErrors && analysis.critic.criticalErrors.length > 0 ? (
              analysis.critic.criticalErrors.map((err, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-[#09090b] border-l-2 border-red-500 text-xs text-[#fafafa]"
                >
                  {err}
                </div>
              ))
            ) : (
              <div className="p-2.5 rounded bg-[#09090b] border border-[#27272a]/60 text-xs text-[#71717a]">
                Zero critical factual errors detected across models.
              </div>
            )}

            {analysis.critic?.unsupportedClaims?.map((claim, idx) => (
              <div
                key={`claim-${idx}`}
                className="p-2 rounded bg-[#09090b] border-l-2 border-yellow-500 text-[11px] text-[#a1a1aa]"
              >
                <span className="text-yellow-500 font-medium mr-1">Caveat:</span>
                {claim}
              </div>
            ))}
          </div>
        </div>

        {/* Disagreements Bento Tile */}
        <div
          id="council-disagreements-card"
          className="col-span-12 md:col-span-12 lg:col-span-4 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase text-[#a1a1aa]">Disagreements</h3>
            <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
              {analysis.analysis?.disagreements?.length || 0} Divergences
            </span>
          </div>
          <div className="space-y-2 flex-1">
            {analysis.analysis?.disagreements && analysis.analysis.disagreements.length > 0 ? (
              analysis.analysis.disagreements.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-[#09090b] border-l-2 border-yellow-500 text-xs text-[#fafafa]"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="p-2.5 rounded bg-[#09090b] border border-[#27272a]/60 text-xs text-[#71717a]">
                No significant divergences between models. High structural consensus.
              </div>
            )}
          </div>
        </div>

        {/* Missing Information & Constraints Tile */}
        <div
          id="council-missing-info-card"
          className="col-span-12 md:col-span-6 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col"
        >
          <h3 className="text-xs font-semibold uppercase text-[#a1a1aa] mb-4">
            Missing Information & Constraints
          </h3>
          <div className="space-y-2 flex-1">
            {analysis.analysis?.missingInformation && analysis.analysis.missingInformation.length > 0 ? (
              analysis.analysis.missingInformation.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-[#09090b] border border-[#27272a]/60 text-xs text-[#fafafa] flex items-start gap-2"
                >
                  <span className="text-blue-400 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#71717a]">No major unaddressed constraints.</p>
            )}
          </div>
        </div>

        {/* Specialized Debate or Coding Bento Tile */}
        {analysis.decision?.debate && (
          <div
            id="debate-synthesis-card"
            className="col-span-12 md:col-span-6 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#a1a1aa]">
              <Swords className="w-3.5 h-3.5 text-blue-400" />
              <span>Debate Dialectic</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#09090b] border border-[#27272a]">
                <span className="text-blue-400 font-bold block mb-1">Position A</span>
                <p className="text-white font-medium mb-1">{analysis.decision.debate.positionA}</p>
                <p className="text-[#a1a1aa] text-[11px]">{analysis.decision.debate.strongestArgA}</p>
              </div>
              <div className="p-2.5 rounded bg-[#09090b] border border-[#27272a]">
                <span className="text-purple-400 font-bold block mb-1">Position B</span>
                <p className="text-white font-medium mb-1">{analysis.decision.debate.positionB}</p>
                <p className="text-[#a1a1aa] text-[11px]">{analysis.decision.debate.strongestArgB}</p>
              </div>
            </div>
          </div>
        )}

        {analysis.decision?.coding && (
          <div
            id="coding-evaluation-card"
            className="col-span-12 md:col-span-6 bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#a1a1aa]">
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Algorithmic Complexity & Edge Cases</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#09090b] border border-[#27272a]">
                <span className="text-[#71717a] block text-[10px]">Time Complexity</span>
                <span className="text-emerald-400 font-mono font-bold">{analysis.decision.coding.timeComplexity}</span>
              </div>
              <div className="p-2.5 rounded bg-[#09090b] border border-[#27272a]">
                <span className="text-[#71717a] block text-[10px]">Space Complexity</span>
                <span className="text-blue-400 font-mono font-bold">{analysis.decision.coding.spaceComplexity}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: INDIVIDUAL AI RESPONSES BENTO TILE */}
      <section id="individual-ai-responses-section" className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#a1a1aa]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">
              Independent Provider Deliberations ({analysis.responses.length})
            </h3>
          </div>
          <span className="text-xs text-[#71717a]">
            Click to inspect raw model output & claims
          </span>
        </div>

        <div className="space-y-2">
          {analysis.responses.map((resp, idx) => {
            const isExpanded = expandedProvider === resp.provider;
            const isSuccess = resp.status === 'success';

            return (
              <div
                key={idx}
                id={`provider-response-${resp.provider}`}
                className="rounded-xl border border-[#27272a] bg-[#09090b] overflow-hidden transition-colors"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedProvider(isExpanded ? null : resp.provider)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#18181b]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#27272a] flex items-center justify-center font-bold text-xs text-white">
                      {resp.provider.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">
                          {resp.providerName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#18181b] text-[#a1a1aa] font-mono border border-[#27272a]">
                          {resp.model}
                        </span>
                        {resp.isDemo && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/40 text-purple-300 border border-purple-800/60 font-mono">
                            Demo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#71717a] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#71717a]" />
                          {resp.responseTime > 0 ? `${resp.responseTime.toLocaleString()} ms` : 'Cached'}
                        </span>
                        <span>•</span>
                        <span className={isSuccess ? 'text-green-500' : 'text-red-400'}>
                          {isSuccess ? 'Complete' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-1 rounded text-[#71717a]">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="p-5 border-t border-[#27272a] bg-[#09090b] text-xs sm:text-sm text-[#fafafa] space-y-4">
                    {resp.keyClaims && resp.keyClaims.length > 0 && (
                      <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                        <span className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider block mb-1.5">
                          Extracted Primary Claims:
                        </span>
                        <ul className="space-y-1 text-xs text-[#a1a1aa] list-disc list-inside">
                          {resp.keyClaims.map((claim, cIdx) => (
                            <li key={cIdx}>{claim}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {resp.error ? (
                      <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                        {resp.error}
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-xs leading-relaxed text-[#fafafa]">
                        <MarkdownView content={resp.answer} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
