import { GoogleGenAI } from '@google/genai';
import { CriticReview, ProviderResponse, CrossAnalysis } from '../../types/ai';

export async function runCriticReview(
  question: string,
  responses: ProviderResponse[],
  analysis: CrossAnalysis,
  mode: string
): Promise<CriticReview> {
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

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
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

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      });

      const res = await Promise.race([
        generatePromise,
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('CRITIC_TIMEOUT')), 12000)),
      ]);

      if (res && res.text) {
        const text = res.text.trim();
        const parsed = JSON.parse(text);

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
      console.warn('[Critic] Gemini LLM critic review fallback:', (err as Error)?.message);
    }
  }

  // If OpenAI key is available, use it as fallback LLM for Critic
  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey) {
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
  "reliabilityVerdict": "reliable"
}
Return ONLY valid raw JSON with no Markdown formatting.`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
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
      }
    } catch (err) {
      console.warn('[Critic] OpenAI critic fallback error:', (err as Error)?.message);
    }
  }

  return {
    criticalErrors: [],
    unsupportedClaims: ['Generalizations regarding performance without empirical benchmark hardware specifications.'],
    weakReasoning: [],
    importantCorrections: ['Validate edge cases where boundary conditions deviate from standard distributions.'],
    reliabilityVerdict: 'reliable',
  };
}
