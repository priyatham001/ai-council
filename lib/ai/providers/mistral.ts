import { AIProvider, ProviderContext } from './base';
import { ProviderResponse } from '../../../types/ai';

export class MistralProvider implements AIProvider {
  id = 'mistral' as const;
  name = 'Mistral AI';
  modelName = 'mistral-large-latest';

  isConfigured(): boolean {
    return Boolean(process.env.MISTRAL_API_KEY && process.env.MISTRAL_API_KEY.trim() !== '');
  }

  async generateResponse(prompt: string, context?: ProviderContext): Promise<ProviderResponse> {
    const startTime = Date.now();
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      return {
        provider: this.id,
        providerName: this.name,
        model: this.modelName,
        answer: '',
        responseTime: 0,
        status: 'error',
        error: 'Mistral API key is not configured. Add MISTRAL_API_KEY to environment variables.',
      };
    }

    try {
      const modeInstruction = context?.mode ? `Operating in ${context.mode} mode.` : '';
      const fileContext = context?.filesText ? `\n\nAttachments:\n${context.filesText}` : '';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'system',
              content: `You are Mistral Large, a high-reasoning member of the AI Council. Provide clear, rigorous, technically grounded responses. ${modeInstruction}`,
            },
            {
              role: 'user',
              content: `${prompt}${fileContext}`,
            },
          ],
          temperature: 0.2,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errDetail = errorData?.error?.message || `HTTP ${res.status}`;
        throw new Error(errDetail);
      }

      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content || '';
      const elapsed = Date.now() - startTime;
      const claims = this.extractClaims(answer);

      return {
        provider: this.id,
        providerName: this.name,
        model: this.modelName,
        answer,
        reasoningSummary: claims.slice(0, 3).join('; '),
        keyClaims: claims,
        uncertainties: this.extractUncertainties(answer),
        responseTime: elapsed,
        status: 'success',
      };
    } catch (err: unknown) {
      const elapsed = Date.now() - startTime;
      return {
        provider: this.id,
        providerName: this.name,
        model: this.modelName,
        answer: '',
        responseTime: elapsed,
        status: 'error',
        error: `Mistral provider error: ${(err as Error)?.message || 'Request failed'}`,
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
