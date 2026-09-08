import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processUploadedFile } from '../lib/blob';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { filename, mimeType, size, base64Content } = req.body || {};

    if (!filename || !mimeType || typeof size !== 'number') {
      return res.status(400).json({ success: false, error: 'Missing file metadata.' });
    }

    const result = await processUploadedFile({
      filename,
      mimeType,
      size,
      base64Content,
    });

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.status(200).json({ success: true, file: result.attachment });
  } catch (err: unknown) {
    console.error('[API /api/upload] File processing error:', (err as Error)?.message);
    return res.status(500).json({ success: false, error: 'File processing failed.' });
  }
}
