import { handleGetHistoryById, handleDeleteHistoryById, sendJson } from '../../lib/server/api-handlers';

export default async function handler(req: any, res: any) {
  const { id } = req.query || {};

  if (!id) {
    return sendJson(res, 400, { success: false, error: 'ID is required' });
  }

  if (req.method === 'GET') {
    return handleGetHistoryById(req, res, String(id));
  }

  if (req.method === 'DELETE') {
    return handleDeleteHistoryById(req, res, String(id));
  }

  return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
}
