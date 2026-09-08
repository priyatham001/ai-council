import type { VercelRequest, VercelResponse } from '@vercel/node';
import analyzeHandler, { config as analyzeConfig, maxDuration as analyzeMaxDuration } from './council/analyze';
import healthHandler from './health';
import modelsHandler from './models';
import uploadHandler, { config as uploadConfig } from './upload';
import historyIndexHandler from './history/index';
import historyItemHandler from './history/[id]';

export const maxDuration = analyzeMaxDuration;
export const config = {
  maxDuration: 60,
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';
  const pathname = url.split('?')[0].replace(/\/+$/, '');

  // Dispatch to corresponding serverless handler if routed through api/index
  if (pathname.endsWith('/council/analyze') || pathname.endsWith('/analyze')) {
    return analyzeHandler(req, res);
  }

  if (pathname.endsWith('/health')) {
    return healthHandler(req, res);
  }

  if (pathname.endsWith('/models')) {
    return modelsHandler(req, res);
  }

  if (pathname.endsWith('/upload')) {
    return uploadHandler(req, res);
  }

  if (pathname.endsWith('/history')) {
    return historyIndexHandler(req, res);
  }

  const historyItemMatch = pathname.match(/\/history\/([^/]+)$/);
  if (historyItemMatch) {
    req.query = { ...req.query, id: historyItemMatch[1] };
    return historyItemHandler(req, res);
  }

  // Default root /api status
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    name: 'AI Council Serverless API',
    status: 'online',
    platform: 'vercel',
    endpoints: [
      'POST /api/council/analyze',
      'POST /api/upload',
      'GET /api/history',
      'GET /api/history/:id',
      'DELETE /api/history/:id',
      'GET /api/models',
      'GET /api/health',
    ],
  });
}

