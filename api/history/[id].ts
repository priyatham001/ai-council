import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAnalysisById, deleteAnalysisById } from '../../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const analysisId = Array.isArray(id) ? id[0] : id;

  if (!analysisId) {
    return res.status(400).json({ success: false, error: 'Missing record ID parameter.' });
  }

  if (req.method === 'GET') {
    try {
      const analysis = await getAnalysisById(analysisId);
      if (!analysis) {
        return res.status(404).json({ success: false, error: 'Analysis record not found.' });
      }
      return res.status(200).json({ success: true, analysis });
    } catch (err: unknown) {
      console.error('[API /api/history/:id] Error:', (err as Error)?.message);
      return res.status(500).json({ success: false, error: 'Failed to fetch analysis record.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deleted = await deleteAnalysisById(analysisId);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Record not found or already deleted.' });
      }
      return res.status(200).json({ success: true, message: 'Analysis deleted successfully.' });
    } catch (err: unknown) {
      console.error('[API DELETE /api/history/:id] Error:', (err as Error)?.message);
      return res.status(500).json({ success: false, error: 'Failed to delete record.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
