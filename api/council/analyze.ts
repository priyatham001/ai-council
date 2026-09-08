import type { VercelRequest, VercelResponse } from '@vercel/node';
import { orchestrator } from '../../lib/ai/orchestrator';
import { saveAnalysis } from '../../lib/mongodb';
import { validateQuestion, validateMode } from '../../lib/validation';

export const maxDuration = 60;
export const config = {
  maxDuration: 60,
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid JSON request payload.' });
      }
    }

    const { question, mode, selectedProviders, files, enableDemoMode } = body || {};

    const validation = validateQuestion(question);
    if (!validation.valid || !validation.cleanQuestion) {
      return res.status(400).json({
        success: false,
        error: validation.error || 'Invalid question provided.',
      });
    }

    const validMode = validateMode(mode);

    const analysisDoc = await orchestrator.runCouncilPipeline({
      question: validation.cleanQuestion,
      mode: validMode,
      selectedProviders,
      files,
      enableDemoMode,
    });

    const saveResult = await saveAnalysis(analysisDoc);
    analysisDoc.id = saveResult.id;

    return res.status(200).json({
      success: true,
      analysis: analysisDoc,
      savedToDb: saveResult.savedToDb,
      id: saveResult.id,
    });
  } catch (err: unknown) {
    const errorMsg = (err as Error)?.message || 'The AI Council encountered an unexpected error processing your inquiry.';
    console.error('[API /api/council/analyze] Pipeline execution error:', errorMsg);
    return res.status(500).json({
      success: false,
      error: errorMsg,
    });
  }
}
