import type { VercelRequest, VercelResponse } from '@vercel/node';
import { orchestrator } from '../lib/ai/orchestrator';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const providers = orchestrator.getAvailableProviders();
    const totalConfigured = providers.filter((p) => p.configured).length;
    return res.status(200).json({
      providers,
      totalConfigured,
      demoAvailable: true,
    });
  } catch (_err) {
    return res.status(500).json({ error: 'Failed to retrieve provider metadata.' });
  }
}
