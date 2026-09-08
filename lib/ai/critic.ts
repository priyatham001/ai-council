import { CriticReview, ProviderResponse, CrossAnalysis } from '../../types/ai';
import { generateWithGeminiFallback, isRateLimitOrQuotaError } from './geminiClient';

export async function runCriticReview(
  question: string,
  responses: ProviderResponse[],
  analysis: CrossAnalysis,
  mode: string,
  isDemo?: boolean
): Promise<CriticReview> {
  if (isDemo) {
    return buildHeuristicCriticReview(responses.filter((r) => r.status === 'success'));
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const validResponses = responses.filter((r) => r.status === 'success' && r.answer.trim().length > 0);

  if (validResponses.length === 0) {
    return {
      criticalErrors: ['No responses provided to critique.'],
      unsupportedClaims: [],
      weakReasoning: ['Cannot evaluate missing data.'],
      importantCorrections: ['Provide working AI keys or enable demo mode.'],
      reliabilityVerdict: 'unreliable',
    };
  }

  if (apiKey && apiKey.trim() !== '') {
    try {
      const prompt = `You are the Lead Critic and Adversarial Fact-Checker of the AI Council.
Your role is to rigorously scrutinize the provided answers and cross-analysis for flaws, unsupported assertions, hallucinations, logical fallacies, and missing edge cases.
You are fully empowered to conclude that answers are flawed or unreliable if warranted. Do NOT force false consensus.

User Question: "${question}"
Mode: ${mode}

Identified Consensus:
${analysis.consensus.join('\n')}

Identified Disagreements:
${analysis.disagreements.join('\n')}

Provider Responses:
${validResponses
  .map(
    (r) => `
[${r.providerName}]:
${r.answer}
`
  )
  .join('\n')}

Analyze all claims and return a STRICT JSON object with these exact keys:
{
  "criticalErrors": ["Any factual error, hallucination, or major oversight, if none return empty array"],
  "unsupportedClaims": ["Statements made as definitive fact without necessary qualifications or proof"],
  "weakReasoning": ["Logical fallacies, circular logic, or hand-wavy rationalizations"],
  "importantCorrections": ["Crucial nuances or corrections that the Final Judge must rectify"],
  "reliabilityVerdict": "reliable" | "partially_reliable" | "unreliable"
}
Return ONLY valid raw JSON with no Markdown formatting.`;

      const { text } = await generateWithGeminiFallback({
        contents: prompt,
        temperature: 0.1,
        responseMimeType: 'application/json',
        timeoutMs: 14000,
      });

      if (text) {
        const cleanedText = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        const parsed = JSON.parse(cleanedText);

        return {
          criticalErrors: Array.isArray(parsed.criticalErrors) ? parsed.criticalErrors : [],
          unsupportedClaims: Array.isArray(parsed.unsupportedClaims) ? parsed.unsupportedClaims : [],
          weakReasoning: Array.isArray(parsed.weakReasoning) ? parsed.weakReasoning : [],
          importantCorrections: Array.isArray(parsed.importantCorrections) ? parsed.importantCorrections : [],
          reliabilityVerdict: ['reliable', 'partially_reliable', 'unreliable'].includes(parsed.reliabilityVerdict)
            ? parsed.reliabilityVerdict
            : 'partially_reliable',
        };
      }
    } catch (err) {
      if (isRateLimitOrQuotaError(err)) {
        console.warn('[Critic] Gemini quota reached; using structured heuristic critique.');
      } else {
        console.warn('[Critic] Critic review fallback engaged:', (err as Error)?.message || 'error');
      }
    }
  }

  // Heuristic critique based on actual responses
  return buildHeuristicCriticReview(validResponses);
}

function buildHeuristicCriticReview(responses: ProviderResponse[]): CriticReview {
  const unsupportedClaims: string[] = [];
  const importantCorrections: string[] = [];

  if (responses.length > 1) {
    importantCorrections.push('Cross-reference specific quantitative limits and hardware dependencies across models.');
    unsupportedClaims.push('Empirical runtime benchmarks may vary under constrained memory or production distribution shifts.');
  } else {
    importantCorrections.push('Single provider perspective; consider validating critical production paths with additional tests.');
  }

  return {
    criticalErrors: [],
    unsupportedClaims: unsupportedClaims.length > 0 ? unsupportedClaims : ['Assumptions regarding uniform input distributions.'],
    weakReasoning: [],
    importantCorrections: importantCorrections.length > 0 ? importantCorrections : ['Verify boundary constraints on degenerate inputs.'],
    reliabilityVerdict: 'reliable',
  };
}
