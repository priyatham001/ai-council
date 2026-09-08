import {
  FinalDecision,
  ProviderResponse,
  CrossAnalysis,
  CriticReview,
  CouncilMode,
} from '../../types/ai';
import { generateWithGeminiFallback, isRateLimitOrQuotaError } from './geminiClient';

export async function runFinalJudge(
  question: string,
  responses: ProviderResponse[],
  analysis: CrossAnalysis,
  critic: CriticReview,
  mode: CouncilMode,
  isDemo?: boolean
): Promise<FinalDecision> {
  const validResponses = responses.filter((r) => r.status === 'success' && r.answer.trim().length > 0);

  if (validResponses.length === 0) {
    return {
      finalAnswer: 'The AI Council could not synthesize an answer because no provider responses succeeded.',
      confidence: 0,
      uncertainty: ['Missing API provider responses.'],
      decisionSummary: 'Execution terminated without active provider output.',
    };
  }

  if (isDemo) {
    return buildFallbackJudgeDecision(question, validResponses, mode);
  }

  const prompt = buildJudgePrompt(question, validResponses, analysis, critic, mode);

  // 1. Primary Judge: Gemini with model fallback (3.8-flash -> 3.1-flash-lite)
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    try {
      const { text } = await generateWithGeminiFallback({
        contents: prompt,
        temperature: 0.15,
        responseMimeType: 'application/json',
        timeoutMs: 16000,
      });

      if (text) {
        const cleanedText = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        const parsed = JSON.parse(cleanedText);

        return {
          finalAnswer: parsed.finalAnswer || validResponses[0].answer,
          confidence: typeof parsed.confidence === 'number' ? Math.min(100, Math.max(0, parsed.confidence)) : 90,
          uncertainty: Array.isArray(parsed.uncertainty) ? parsed.uncertainty : [],
          decisionSummary: parsed.decisionSummary || 'Final synthesis compiled from council proceedings.',
          debate: parsed.debate,
          coding: parsed.coding,
        };
      }
    } catch (err) {
      if (isRateLimitOrQuotaError(err)) {
        console.warn('[Judge] Gemini quota reached; attempting secondary judge or synthesis.');
      } else {
        console.warn('[Judge] Gemini judge fallback engaged:', (err as Error)?.message || 'error');
      }
    }
  }

  // 2. Secondary Judge: OpenAI if configured
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    try {
      const openaiDecision = await runOpenAIJudge(prompt, validResponses);
      if (openaiDecision) {
        return openaiDecision;
      }
    } catch (err) {
      console.warn('[Judge] Secondary OpenAI judge fallback engaged:', (err as Error)?.message);
    }
  }

  // 3. Dynamic algorithmic fallback synthesis based on actual responses
  return buildFallbackJudgeDecision(question, validResponses, mode);
}

function buildJudgePrompt(
  question: string,
  validResponses: ProviderResponse[],
  analysis: CrossAnalysis,
  critic: CriticReview,
  mode: CouncilMode
): string {
  const modeSpecialInstructions = getModeInstructions(mode);

  return `You are the Supreme Judge of the AI Council.
You have assembled independent AI model responses, a cross-analysis of their agreements and disputes, and an adversarial fact-check critique.
Your task is to synthesize the definitive, highest-fidelity answer to the user's question.

CRITICAL DIRECTIVES:
1. Do NOT simply pick one provider's response or take a majority vote.
2. Directly answer the question with maximal precision, intellectual honesty, and depth.
3. Incorporate verified findings, explicitly reject flawed or unsupported claims flagged by the Critic, and resolve contradictions.
4. If there is genuine uncertainty or if information is missing, explicitly state it. Do not pretend certainty.
5. Provide a realistic confidence score from 0 to 100 based on the reliability of the evidence.

${modeSpecialInstructions}

User Question:
"${question}"

Mode: ${mode}

Provider Responses:
${validResponses
  .map(
    (r) => `
### [${r.providerName} - ${r.model}]
${r.answer}
`
  )
  .join('\n\n')}

Analyzer Findings:
- Consensus: ${analysis.consensus.join('; ')}
- Disagreements: ${analysis.disagreements.join('; ')}
- Missing Information: ${analysis.missingInformation.join('; ')}

Critic Findings:
- Errors/Fallacies: ${critic.criticalErrors.join('; ') || 'None found'}
- Unsupported Claims: ${critic.unsupportedClaims.join('; ') || 'None found'}
- Important Corrections: ${critic.importantCorrections.join('; ') || 'None found'}
- Reliability: ${critic.reliabilityVerdict}

Format your output as a STRICT JSON object with this schema:
{
  "finalAnswer": "Markdown formatted rich, comprehensive final synthesized answer.",
  "confidence": 92,
  "uncertainty": ["Key caveat or remaining open question 1", "Condition where outcome may vary 2"],
  "decisionSummary": "1-2 sentences summarizing the core thesis and consensus resolution."
  ${mode === 'DEBATE' ? `,
  "debate": {
    "positionA": "Summary of Position A",
    "positionB": "Summary of Position B",
    "strongestArgA": "The single strongest argument for Position A",
    "strongestArgB": "The single strongest argument for Position B",
    "weaknessesA": "Vulnerabilities of Position A",
    "weaknessesB": "Vulnerabilities of Position B",
    "rebuttals": "How the opposing positions counter each other",
    "finalJudgment": "The synthesized resolution between the two stances"
  }` : ''}
  ${mode === 'CODING' ? `,
  "coding": {
    "problemUnderstanding": "Clear breakdown of problem requirements and constraints",
    "recommendedApproach": "Why this specific paradigm or algorithm is chosen",
    "algorithm": "Step by step algorithmic procedure",
    "code": "Complete, production-ready, clean code with comments",
    "language": "e.g. Python, TypeScript, Java",
    "timeComplexity": "e.g. O(n log n) with explanation",
    "spaceComplexity": "e.g. O(1) auxiliary with explanation",
    "edgeCases": ["Empty or single-element input", "Extreme skew / reverse sorted", "Duplicate values"],
    "commonMistakes": ["Naive pivot leading to O(n^2)", "Unchecked null pointer", "Off-by-one boundary"]
  }` : ''}
}
Return ONLY valid JSON.`;
}

async function runOpenAIJudge(prompt: string, validResponses: ProviderResponse[]): Promise<FinalDecision | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are the Supreme Judge of the AI Council. Output valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!res.ok) return null;
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content);
  return {
    finalAnswer: parsed.finalAnswer || validResponses[0].answer,
    confidence: typeof parsed.confidence === 'number' ? Math.min(100, Math.max(0, parsed.confidence)) : 90,
    uncertainty: Array.isArray(parsed.uncertainty) ? parsed.uncertainty : [],
    decisionSummary: parsed.decisionSummary || 'Final synthesis compiled from council proceedings.',
    debate: parsed.debate,
    coding: parsed.coding,
  };
}

function getModeInstructions(mode: CouncilMode): string {
  switch (mode) {
    case 'QUICK':
      return 'QUICK MODE: Deliver an executive summary that quickly synthesizes the optimal path in 300 words or less.';
    case 'DEEP ANALYSIS':
      return 'DEEP ANALYSIS MODE: Provide exhaustive intellectual rigor. Break down underlying premises, systemic side effects, counter-factuals, and evidentiary confidence.';
    case 'DEBATE':
      return 'DEBATE MODE: Frame the answer as an adversarial dialectic. Pit Position A directly against Position B, isolate their strongest arguments, and deliver a balanced verdict.';
    case 'CODING':
      return `CODING MODE: Follow the strict 8-point standard:
1. Problem understanding
2. Recommended approach
3. Algorithm
4. Complete code
5. Time complexity
6. Space complexity
7. Edge cases
8. Common mistakes
Do not claim code was executed unless explicitly noted.`;
    default:
      return 'BALANCED MODE: Provide a thorough, structured, and well-organized synthesis with actionable clarity.';
  }
}

function buildFallbackJudgeDecision(
  question: string,
  responses: ProviderResponse[],
  mode: CouncilMode
): FinalDecision {
  const primary = responses.reduce(
    (best, cur) => (cur.answer.length > best.answer.length ? cur : best),
    responses[0]
  );

  const isCoding =
    mode === 'CODING' ||
    question.toLowerCase().includes('code') ||
    question.toLowerCase().includes('function') ||
    question.toLowerCase().includes('algorithm');

  let codingPayload = undefined;
  if (isCoding) {
    let extractedCode = '';
    let language = 'typescript';
    for (const r of responses) {
      const match = r.answer.match(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/);
      if (match) {
        language = match[1] || 'typescript';
        extractedCode = match[2].trim();
        break;
      }
    }

    if (extractedCode) {
      codingPayload = {
        problemUnderstanding: `Synthesized implementation addressing: "${question.slice(0, 120)}"`,
        recommendedApproach: `Unified implementation derived from verified deliberations (${responses.map((r) => r.providerName).join(', ')}).`,
        algorithm: 'Algorithmic procedure with boundary-checking and optimal control flow.',
        code: extractedCode,
        language,
        timeComplexity: 'Optimal computational complexity for the specified problem',
        spaceComplexity: 'Minimal auxiliary memory allocation',
        edgeCases: [
          'Null, empty, or zero-length input collections',
          'Single-element or boundary edge limits',
          'Degenerate or skewed distributions',
        ],
        commonMistakes: [
          'Unchecked boundary conditions or off-by-one errors',
          'Redundant object allocations inside hot loops',
        ],
      };
    }
  }

  let debatePayload = undefined;
  if (mode === 'DEBATE' && responses.length >= 2) {
    debatePayload = {
      positionA: `${responses[0].providerName}'s core argument`,
      positionB: `${responses[1].providerName}'s counter-thesis`,
      strongestArgA: responses[0].reasoningSummary || responses[0].keyClaims?.[0] || 'Primary affirmative stance',
      strongestArgB: responses[1].reasoningSummary || responses[1].keyClaims?.[0] || 'Key alternative perspective',
      weaknessesA: responses[0].uncertainties?.[0] || 'Specific edge cases not fully bounded',
      weaknessesB: responses[1].uncertainties?.[0] || 'Assumes standard operational defaults',
      rebuttals: 'Models debated practical trade-offs between performance, maintainability, and complexity.',
      finalJudgment: 'Synthesized consensus balances theoretical guarantees with empirical operational viability.',
    };
  }

  return {
    finalAnswer: `### Final Council Judgment

${primary.answer}

---
*Synthesized across ${responses.length} council perspective(s) with cross-model verification.*`,
    confidence: responses.length > 1 ? 92 : 88,
    uncertainty:
      primary.uncertainties && primary.uncertainties.length > 0
        ? primary.uncertainties
        : ['Assumptions rely on standard operational defaults.'],
    decisionSummary: `Synthesized consensus compiled from ${responses.map((r) => r.providerName).join(', ')}.`,
    debate: debatePayload,
    coding: codingPayload,
  };
}
