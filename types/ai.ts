export type CouncilMode = 'QUICK' | 'BALANCED' | 'DEEP ANALYSIS' | 'DEBATE' | 'CODING';

export type AIProviderId = 'gemini' | 'openai' | 'anthropic' | 'mistral' | 'demo';

export interface AIProviderMeta {
  id: AIProviderId;
  name: string;
  modelName: string;
  configured: boolean;
  description: string;
}

export interface ProviderResponse {
  provider: AIProviderId | string;
  providerName: string;
  model: string;
  answer: string;
  reasoningSummary?: string;
  keyClaims?: string[];
  uncertainties?: string[];
  responseTime: number; // in ms
  status: 'success' | 'error';
  error?: string;
  isDemo?: boolean;
}

export interface CrossAnalysis {
  consensus: string[];
  disagreements: string[];
  claimEvaluation: string[];
  strengths: string[];
  weaknesses: string[];
  missingInformation: string[];
  unsupportedClaims: string[];
  reasoningAssessment: string;
  overallAssessment?: string;
}

export interface CriticReview {
  criticalErrors: string[];
  unsupportedClaims: string[];
  weakReasoning: string[];
  importantCorrections: string[];
  reliabilityVerdict: 'reliable' | 'partially_reliable' | 'unreliable';
}

export interface DebateStructure {
  positionA: string;
  positionB: string;
  strongestArgA: string;
  strongestArgB: string;
  weaknessesA: string;
  weaknessesB: string;
  rebuttals: string;
  finalJudgment: string;
}

export interface CodingStructure {
  problemUnderstanding: string;
  recommendedApproach: string;
  algorithm: string;
  code: string;
  language?: string;
  timeComplexity: string;
  spaceComplexity: string;
  edgeCases: string[];
  commonMistakes: string[];
}

export interface FinalDecision {
  finalAnswer: string;
  confidence: number; // 0 to 100
  uncertainty: string[];
  decisionSummary: string;
  debate?: DebateStructure;
  coding?: CodingStructure;
}

export interface FileAttachment {
  url?: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  extractedText?: string;
}

export interface CouncilAnalysisDocument {
  _id?: string;
  id?: string;
  question: string;
  mode: CouncilMode;
  selectedModels: string[];
  responses: ProviderResponse[];
  analysis: CrossAnalysis;
  critic: CriticReview;
  finalAnswer: string;
  decision: FinalDecision;
  confidence: number;
  files?: FileAttachment[];
  isDemo?: boolean;
  createdAt: string;
}

export interface AnalyzeRequestPayload {
  question: string;
  mode: CouncilMode;
  selectedProviders?: string[];
  files?: FileAttachment[];
  enableDemoMode?: boolean;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  mongodb: boolean;
  providers: {
    gemini: boolean;
    openai: boolean;
    anthropic: boolean;
    mistral: boolean;
  };
  totalConfigured: number;
  demoModeAvailable: boolean;
  timestamp: string;
}
