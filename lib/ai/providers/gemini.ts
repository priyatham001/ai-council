import { AIProvider, ProviderContext } from './base';
import { ProviderResponse } from '../../../types/ai';
import {
  generateWithGeminiFallback,
  isRateLimitOrQuotaError,
} from '../geminiClient';

export class GeminiProvider implements AIProvider {
  id = 'gemini' as const;
  name = 'Google Gemini';
  modelName = 'gemini-3.8-flash';

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  }

  async generateResponse(prompt: string, context?: ProviderContext): Promise<ProviderResponse> {
    const startTime = Date.now();

    if (!this.isConfigured()) {
      return {
        provider: this.id,
        providerName: this.name,
        model: this.modelName,
        answer: '',
        responseTime: 0,
        status: 'error',
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to environment variables.',
      };
    }

    try {
      const modeInstruction = context?.mode ? `You are operating in ${context.mode} mode. Be thorough, precise, and structured.` : '';
      const fileContext = context?.filesText ? `\n\nReferenced Attachments:\n${context.filesText}` : '';
      const fullPrompt = `${prompt}${fileContext}`;

      const { text: responseText, modelUsed } = await generateWithGeminiFallback({
        contents: fullPrompt,
        systemInstruction: `You are Google Gemini, an expert AI reasoning member of the AI Council.
Provide a direct, high-caliber, factually grounded response.
Highlight your primary conclusions, key assumptions, and any uncertainties.
${modeInstruction}`,
        temperature: 0.3,
        timeoutMs: 30000,
      });

      const elapsed = Date.now() - startTime;

      // Extract key points and uncertainties from the response if present
      const claims = this.extractClaims(responseText);

      return {
        provider: this.id,
        providerName: this.name,
        model: modelUsed,
        answer: responseText,
        reasoningSummary: claims.slice(0, 3).join('; '),
        keyClaims: claims,
        uncertainties: this.extractUncertainties(responseText),
        responseTime: elapsed,
        status: 'success',
      };
    } catch (err: unknown) {
      const elapsed = Date.now() - startTime;
      let errorMessage = (err as Error)?.message || 'Gemini request failed.';

      if (isRateLimitOrQuotaError(err)) {
        errorMessage = 'Gemini free tier quota/rate limit reached (429). The Council will rely on other active models.';
      }

      return {
        provider: this.id,
        providerName: this.name,
        model: this.modelName,
        answer: '',
        responseTime: elapsed,
        status: 'error',
        error: errorMessage,
      };
    }
  }

  private extractClaims(text: string): string[] {
    const lines = text.split('\n')
      .map(l => l.trim().replace(/^[-*•\d.]+\s*/, ''))
      .filter(l => l.length > 20 && l.length < 200 && !l.startsWith('#'));
    return lines.slice(0, 5);
  }

  private extractUncertainties(text: string): string[] {
    const keywords = ['however', 'caveat', 'uncertain', 'depends on', 'assumption', 'note that', 'risk'];
    const sentences = text.split(/[.!?]\s+/);
    return sentences
      .filter(s => keywords.some(k => s.toLowerCase().includes(k)))
      .map(s => s.trim())
      .filter(s => s.length > 25 && s.length < 250)
      .slice(0, 3);
  }
}
