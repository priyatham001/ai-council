import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAnalysesList } from '../../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const history = await getAnalysesList(100);
    return res.status(200).json({ success: true, history });
  } catch (err: unknown) {
    console.error('[API /api/history] Error fetching history:', (err as Error)?.message);
    return res.status(500).json({ success: false, error: 'Failed to retrieve analysis history.' });
  }
}
