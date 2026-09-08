import type { VercelRequest, VercelResponse } from '@vercel/node';
import { orchestrator } from '../lib/ai/orchestrator';
import { isMongoDbConnected } from '../lib/mongodb';
import { HealthResponse } from '../types/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const providers = orchestrator.getAvailableProviders();
    const mongoConnected = await isMongoDbConnected();

    const health: HealthResponse = {
      status: 'ok',
      mongodb: mongoConnected,
      providers: {
        gemini: providers.find((p) => p.id === 'gemini')?.configured ?? false,
        openai: providers.find((p) => p.id === 'openai')?.configured ?? false,
        anthropic: providers.find((p) => p.id === 'anthropic')?.configured ?? false,
        mistral: providers.find((p) => p.id === 'mistral')?.configured ?? false,
      },
      totalConfigured: providers.filter((p) => p.configured).length,
      demoModeAvailable: true,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(health);
  } catch (_err) {
    return res.status(500).json({ status: 'degraded', error: 'Health check failed.' });
  }
}
