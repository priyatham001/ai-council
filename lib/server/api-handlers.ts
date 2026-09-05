import { AIOrchestrator } from '../ai/orchestrator';
import { validateQuestion, validateMode } from '../validation';
import { processUploadedFile } from '../blob';
import {
  saveAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysisById,
  isMongoDbConnected,
} from '../mongodb';
import { CouncilMode, FileAttachment } from '../../types/ai';

export const orchestrator = new AIOrchestrator();

export function parseRequestBody(req: any): any {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export function sendJson(res: any, status: number, data: any) {
  try {
    if (res.setHeader) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
    }
  } catch {
    // Header might already be sent in certain environments
  }

  if (typeof res.status === 'function') {
    res.status(status);
  } else {
    res.statusCode = status;
  }

  if (typeof res.json === 'function') {
    return res.json(data);
  }
  return res.end(JSON.stringify(data));
}

// GET /api/health
export async function handleHealth(req: any, res: any) {
  try {
    const mongoConnected = await isMongoDbConnected();
    const providers = {
      gemini: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''),
      openai: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== ''),
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim() !== ''),
      mistral: Boolean(process.env.MISTRAL_API_KEY && process.env.MISTRAL_API_KEY.trim() !== ''),
    };
    const totalConfigured = Object.values(providers).filter(Boolean).length;

    return sendJson(res, 200, {
      status: totalConfigured > 0 ? 'ok' : 'degraded',
      mongodb: mongoConnected,
      providers,
      totalConfigured,
      demoModeAvailable: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return sendJson(res, 500, {
      status: 'error',
      error: (err as Error)?.message || 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
}

// GET /api/models
export async function handleModels(req: any, res: any) {
  try {
    const models = orchestrator.getAvailableProviders();
    return sendJson(res, 200, {
      success: true,
      models,
    });
  } catch (err: unknown) {
    return sendJson(res, 500, {
      success: false,
      error: (err as Error)?.message || 'Failed to list models',
    });
  }
}

// POST /api/council/analyze
export async function handleAnalyze(req: any, res: any) {
  try {
    if (req.method && req.method !== 'POST') {
      return sendJson(res, 405, { success: false, error: 'Method Not Allowed. Use POST.' });
    }

    const body = parseRequestBody(req);
    const { question, mode, selectedProviders, files, enableDemoMode } = body;

    const validation = validateQuestion(question);
    if (!validation.valid || !validation.cleanQuestion) {
      return sendJson(res, 400, {
        success: false,
        error: validation.error || 'Invalid question provided.',
      });
    }

    const cleanMode: CouncilMode = validateMode(mode);

    // Run Council pipeline with all configured providers in parallel
    const analysisDoc = await orchestrator.runCouncilPipeline({
      question: validation.cleanQuestion,
      mode: cleanMode,
      selectedProviders,
      files: files as FileAttachment[],
      enableDemoMode,
    });

    // Save to persistent storage
    const saveResult = await saveAnalysis(analysisDoc);

    // Return comprehensive multi-provider synthesis
    return sendJson(res, 200, {
      success: true,
      question: analysisDoc.question,
      finalAnswer: analysisDoc.finalAnswer,
      analysis: analysisDoc,
      providers: analysisDoc.responses.map((r) => ({
        provider: r.provider,
        providerName: r.providerName,
        model: r.model,
        status: r.status,
        response: r.answer,
        responseTime: r.responseTime,
        error: r.error,
        keyClaims: r.keyClaims,
        uncertainties: r.uncertainties,
      })),
      critique: analysisDoc.critic,
      savedToDb: saveResult.savedToDb,
      id: saveResult.id || analysisDoc.id,
    });
  } catch (err: unknown) {
    console.error('[API Council Analyze] Internal error:', err);
    return sendJson(res, 500, {
      success: false,
      error: (err as Error)?.message || 'An unexpected error occurred during council analysis.',
    });
  }
}

// POST /api/upload
export async function handleUpload(req: any, res: any) {
  try {
    if (req.method && req.method !== 'POST') {
      return sendJson(res, 405, { success: false, error: 'Method Not Allowed. Use POST.' });
    }

    const body = parseRequestBody(req);
    const { filename, mimeType, size, base64Content } = body;

    if (!filename || !mimeType || typeof size !== 'number') {
      return sendJson(res, 400, {
        success: false,
        error: 'Filename, mimeType, and size are required fields.',
      });
    }

    const result = await processUploadedFile({
      filename,
      mimeType,
      size,
      base64Content,
    });

    if (!result.success) {
      return sendJson(res, 400, {
        success: false,
        error: result.error || 'Upload processing failed.',
      });
    }

    return sendJson(res, 200, {
      success: true,
      attachment: result.attachment,
    });
  } catch (err: unknown) {
    return sendJson(res, 500, {
      success: false,
      error: (err as Error)?.message || 'Failed to process file upload.',
    });
  }
}

// GET /api/history
export async function handleGetHistory(req: any, res: any) {
  try {
    const query = req.query || {};
    const limit = query.limit ? parseInt(String(query.limit), 10) : 25;
    const analyses = await getAnalyses(Math.min(100, Math.max(1, limit)));

    return sendJson(res, 200, {
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (err: unknown) {
    return sendJson(res, 500, {
      success: false,
      error: (err as Error)?.message || 'Failed to retrieve analysis history.',
    });
  }
}

// GET /api/history/:id
export async function handleGetHistoryById(req: any, res: any, docId?: string) {
  try {
    const id = docId || req.params?.id || req.query?.id;
    if (!id || typeof id !== 'string') {
      return sendJson(res, 400, {
        success: false,
        error: 'Valid analysis ID is required.',
      });
    }

    const analysis = await getAnalysisById(id);
    if (!analysis) {
      return sendJson(res, 404, {
        success: false,
        error: `Analysis with ID '${id}' was not found.`,
      });
    }

    return sendJson(res, 200, {
      success: true,
      analysis,
    });
  } catch (err: unknown) {
    return sendJson(res, 500, {
      success: false,
      error: (err as Error)?.message || 'Failed to retrieve analysis.',
    });
  }
}

// DELETE /api/history/:id
export async function handleDeleteHistoryById(req: any, res: any, docId?: string) {
  try {
    const id = docId || req.params?.id || req.query?.id;
    if (!id || typeof id !== 'string') {
      return sendJson(res, 400, {
        success: false,
        error: 'Valid analysis ID is required.',
      });
    }

    const deleted = await deleteAnalysisById(id);
    return sendJson(res, 200, {
      success: true,
      deleted,
      id,
    });
  } catch (err: unknown) {
    return sendJson(res, 500, {
      success: false,
      error: (err as Error)?.message || 'Failed to delete analysis.',
    });
  }
}
