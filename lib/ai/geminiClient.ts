import { GoogleGenAI } from '@google/genai';

// Standard recommended models in order of preference
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
] as const;

export interface GeminiGenerateOptions {
  contents: string | Array<Record<string, unknown>>;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
  timeoutMs?: number;
}

export interface GeminiGenerateResult {
  text: string;
  modelUsed: string;
}

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Checks whether an error is a 429 quota exhaustion or rate limit error
 */
export function isRateLimitOrQuotaError(err: unknown): boolean {
  if (!err) return false;
  const message = String((err as Error)?.message || err);
  const code = (err as Record<string, unknown>)?.code || (err as Record<string, unknown>)?.status;
  return (
    code === 429 ||
    code === 'RESOURCE_EXHAUSTED' ||
    message.includes('429') ||
    message.includes('RESOURCE_EXHAUSTED') ||
    message.toLowerCase().includes('quota exceeded') ||
    message.toLowerCase().includes('rate limit')
  );
}

/**
 * Executes a Gemini prompt with automatic fallback across recommended models
 * (gemini-3.8-flash -> gemini-3.1-flash-lite -> gemini-flash-latest)
 * if rate limits or quota errors occur.
 */
export async function generateWithGeminiFallback(
  options: GeminiGenerateOptions
): Promise<GeminiGenerateResult> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const {
    contents,
    systemInstruction,
    temperature = 0.2,
    responseMimeType,
    timeoutMs = 15000,
  } = options;

  let lastError: unknown = null;

  for (const model of GEMINI_MODELS) {
    try {
      const config: Record<string, unknown> = {
        temperature,
      };
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      if (responseMimeType) {
        config.responseMimeType = responseMimeType;
      }

      const generatePromise = client.models.generateContent({
        model,
        contents: typeof contents === 'string' ? contents : (contents as any),
        config,
      });

      const response = await Promise.race([
        generatePromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`TIMEOUT_${model}`)), timeoutMs)
        ),
      ]);

      const text = response?.text || '';
      if (text.trim()) {
        return {
          text,
          modelUsed: model,
        };
      }
    } catch (err: unknown) {
      lastError = err;
      if (isRateLimitOrQuotaError(err)) {
        console.warn(`[Gemini] Model ${model} rate/quota limit encountered. Attempting next candidate model.`);
        // Continue to the next fallback model
        continue;
      }
      // For timeouts or other transient errors on flash models, also try fallback
      console.warn(`[Gemini] Model ${model} failed (${(err as Error)?.message || 'unknown'}). Attempting fallback.`);
    }
  }

  throw lastError || new Error('All Gemini models exhausted.');
}
