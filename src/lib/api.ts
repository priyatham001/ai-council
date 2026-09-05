import {
  CouncilMode,
  CouncilAnalysisDocument,
  FileAttachment,
  HealthResponse,
  AIProviderMeta,
} from '../types';

export interface AnalyzePayload {
  question: string;
  mode: CouncilMode;
  selectedProviders?: string[];
  files?: FileAttachment[];
  enableDemoMode?: boolean;
}

export interface AnalyzeResultResponse {
  success: boolean;
  question?: string;
  finalAnswer?: string;
  analysis?: CouncilAnalysisDocument;
  providers?: Array<{
    provider: string;
    providerName: string;
    model: string;
    status: 'success' | 'error';
    response: string;
    responseTime: number;
    error?: string;
    keyClaims?: string[];
    uncertainties?: string[];
  }>;
  critique?: any;
  savedToDb?: boolean;
  id?: string;
  error?: string;
}

async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options?.headers || {}),
      },
    });
  } catch (networkErr: any) {
    throw new Error(
      `Network request failed: ${networkErr?.message || 'Unable to connect to server. Check your connection.'}`
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!isJson) {
    const textSnippet = (await response.text().catch(() => '')).slice(0, 150);
    throw new Error(
      `Server returned status ${response.status} (${response.statusText || 'Error'}), expected JSON. Response: "${textSnippet.trim() || 'Empty'}"`
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Failed to parse JSON response from ${url} (status: ${response.status})`);
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export async function fetchHealth(): Promise<HealthResponse> {
  return safeFetchJson<HealthResponse>('/api/health');
}

export async function fetchModels(): Promise<{ success: boolean; models?: AIProviderMeta[]; providers?: AIProviderMeta[] }> {
  return safeFetchJson<{ success: boolean; models?: AIProviderMeta[]; providers?: AIProviderMeta[] }>('/api/models');
}

export async function submitCouncilAnalysis(payload: AnalyzePayload): Promise<AnalyzeResultResponse> {
  return safeFetchJson<AnalyzeResultResponse>('/api/council/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function uploadAttachment(fileData: {
  filename: string;
  mimeType: string;
  size: number;
  base64Content?: string;
}): Promise<{ success: boolean; attachment?: FileAttachment; file?: FileAttachment; error?: string }> {
  return safeFetchJson<{ success: boolean; attachment?: FileAttachment; file?: FileAttachment; error?: string }>(
    '/api/upload',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileData),
    }
  );
}

export async function fetchHistoryList(limit = 50): Promise<CouncilAnalysisDocument[]> {
  const data = await safeFetchJson<{ success: boolean; count: number; analyses?: CouncilAnalysisDocument[]; history?: CouncilAnalysisDocument[] }>(
    `/api/history?limit=${limit}`
  );
  return data.analyses || data.history || [];
}

export async function fetchHistoryById(id: string): Promise<CouncilAnalysisDocument | null> {
  const data = await safeFetchJson<{ success: boolean; analysis: CouncilAnalysisDocument }>(
    `/api/history/${encodeURIComponent(id)}`
  );
  return data.analysis || null;
}

export async function deleteHistoryById(id: string): Promise<boolean> {
  const data = await safeFetchJson<{ success: boolean; deleted: boolean }>(
    `/api/history/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    }
  );
  return data.success && data.deleted;
}
