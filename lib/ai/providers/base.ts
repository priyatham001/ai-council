import { AIProviderId, ProviderResponse } from '../../../types/ai';

export interface ProviderContext {
  mode: string;
  filesText?: string;
  systemPrompt?: string;
}

export interface AIProvider {
  id: AIProviderId;
  name: string;
  modelName: string;
  isConfigured(): boolean;
  generateResponse(prompt: string, context?: ProviderContext): Promise<ProviderResponse>;
}
