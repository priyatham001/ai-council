import { AIProvider, ProviderContext } from './base';
import { ProviderResponse } from '../../../types/ai';

export class AnthropicProvider implements AIProvider {
  id = 'anthropic' as const;
  name = 'Anthropic Claude';
  modelName = 'claude-3-5-sonnet-20241022';

  isConfigured(): boolean {
    return Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim() !== '');
  }

  async generateResponse(prompt: string, context?: ProviderContext): Promise<ProviderResponse> {
    const startTime = Date.now();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return {
        provider: this.id,
        providerName: this.name,
        model: this.modelName,
        answer: '',
        responseTime: 0,
        status: 'error',
        error: 'Anthropic API key is not configured. Add ANTHROPIC_API_KEY to environment variables.',
      };
    }

    try {
      const modeInstruction = context?.mode ? `Operating in ${context.mode} mode.` : '';
      const fileContext = context?.filesText ? `\n\nAttachments:\n${context.filesText}` : '';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.modelName,
          max_tokens: 2048,
          system: `You are Claude by Anthropic, an analytical member of the AI Council. Provide direct, intellectually honest, and well-structured perspectives. ${modeInstruction}`,
          messages: [
            {
              role: 'user',
              content: `${prompt}${fileContext}`,
            },
          ],
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
      const answer = data.content?.[0]?.text || '';
      const elapsed = Date.now() - startTime;

      return {
        provider: this.id,
        providerName: this.name,
        model: this.modelName,
        answer,
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
        error: `Anthropic provider error: ${(err as Error)?.message || 'Request failed'}`,
      };
    }
  }
}
