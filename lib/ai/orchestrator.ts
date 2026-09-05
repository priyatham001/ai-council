import { AIProvider } from './providers/base';
import { GeminiProvider } from './providers/gemini';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { MistralProvider } from './providers/mistral';
import { getDemoCouncilResponses } from './providers/demo';
import { runCrossAnalysis } from './analyzer';
import { runCriticReview } from './critic';
import { runFinalJudge } from './judge';
import {
  AnalyzeRequestPayload,
  CouncilAnalysisDocument,
  ProviderResponse,
  AIProviderMeta,
} from '../../types/ai';

export class AIOrchestrator {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    this.registerProvider(new GeminiProvider());
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new AnthropicProvider());
    this.registerProvider(new MistralProvider());
  }

  private registerProvider(provider: AIProvider) {
    this.providers.set(provider.id, provider);
  }

  public getAvailableProviders(): AIProviderMeta[] {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
      modelName: p.modelName,
      configured: p.isConfigured(),
      description: this.getProviderDescription(p.id),
    }));
  }

  private getProviderDescription(id: string): string {
    switch (id) {
      case 'gemini':
        return 'Google Gemini: Multi-modal frontier model with massive context and rapid inference.';
      case 'openai':
        return 'OpenAI GPT: Frontier reasoning with broad architectural knowledge.';
      case 'anthropic':
        return 'Anthropic Claude: Nuanced intellectual honesty, alignment, and analytical precision.';
      case 'mistral':
        return 'Mistral AI: European open-weight and frontier reasoning with dense mathematical clarity.';
      default:
        return '';
    }
  }

  public async runCouncilPipeline(
    payload: AnalyzeRequestPayload,
    onProgress?: (stage: string, stepNumber: number) => void
  ): Promise<CouncilAnalysisDocument> {
    const { question, mode, selectedProviders, files, enableDemoMode } = payload;

    onProgress?.('Preparing question & attachments', 1);

    // Context from uploaded files
    const filesText = files && files.length > 0
      ? files.map((f) => `[File: ${f.filename} (${f.mimeType})]:\n${f.extractedText || 'Binary/Media attached'}`).join('\n\n')
      : undefined;

    // Check which providers are active
    const configuredProviders = Array.from(this.providers.values()).filter((p) => p.isConfigured());
    const isDemoRequested = Boolean(enableDemoMode || process.env.DEMO_MODE === 'true');

    let responses: ProviderResponse[] = [];

    // If demo mode is explicitly enabled, or if NO providers are configured
    if (isDemoRequested || configuredProviders.length === 0) {
      onProgress?.('Consulting simulated Demo Council providers', 2);
      // Generate demo responses
      responses = getDemoCouncilResponses(question, mode);
      onProgress?.('Collecting independent demo responses', 3);
    } else {
      // Real provider execution
      // Determine which configured providers were selected
      let targetProviders = configuredProviders;
      if (selectedProviders && selectedProviders.length > 0) {
        const filtered = configuredProviders.filter((p) => selectedProviders.includes(p.id));
        if (filtered.length > 0) {
          targetProviders = filtered;
        }
      }

      onProgress?.(`Consulting ${targetProviders.length} active AI provider(s)`, 2);

      // Concurrent independent execution using Promise.allSettled for fault tolerance
      const providerSettled = await Promise.allSettled(
        targetProviders.map(async (provider) => {
          const startTime = Date.now();
          try {
            return await provider.generateResponse(question, {
              mode,
              filesText,
            });
          } catch (err: unknown) {
            const elapsed = Date.now() - startTime;
            return {
              provider: provider.id,
              providerName: provider.name,
              model: provider.modelName,
              answer: '',
              responseTime: elapsed,
              status: 'error' as const,
              error: (err as Error)?.message || 'Provider execution failed.',
            };
          }
        })
      );

      responses = providerSettled.map((outcome, idx) => {
        if (outcome.status === 'fulfilled') {
          return outcome.value;
        } else {
          const provider = targetProviders[idx];
          return {
            provider: provider.id,
            providerName: provider.name,
            model: provider.modelName,
            answer: '',
            responseTime: 0,
            status: 'error' as const,
            error: (outcome.reason as Error)?.message || 'Provider execution rejected.',
          };
        }
      });

      onProgress?.('Collecting independent responses', 3);
    }

    // Step 4: Run cross-analyzer across all responses
    onProgress?.('Comparing answers & identifying agreements', 4);
    const analysis = await runCrossAnalysis(question, responses, mode);

    // Step 5: Run adversarial critic receiving real analysis findings
    onProgress?.('Running adversarial critic & fact-check', 5);
    const critic = await runCriticReview(question, responses, analysis, mode);

    // Step 6: Evaluate disagreements
    onProgress?.('Evaluating critical disagreements and edge cases', 6);

    // Step 7: Convene Final Judge
    onProgress?.('Convening Supreme Judge for final synthesis', 7);
    const decision = await runFinalJudge(question, responses, analysis, critic, mode);

    // Step 8: Finalizing
    onProgress?.('Saving and formatting complete analysis', 8);

    const doc: CouncilAnalysisDocument = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      question,
      mode,
      selectedModels: responses.map((r) => r.provider),
      responses,
      analysis,
      critic,
      finalAnswer: decision.finalAnswer,
      decision,
      confidence: decision.confidence,
      files,
      isDemo: isDemoRequested || responses.some((r) => r.isDemo),
      createdAt: new Date().toISOString(),
    };

    onProgress?.('Complete', 9);

    return doc;
  }
}

export const orchestrator = new AIOrchestrator();
