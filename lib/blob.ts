import { FileAttachment } from '../types/ai';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, sanitizeFilename } from './validation';

export async function processUploadedFile(fileData: {
  filename: string;
  mimeType: string;
  size: number;
  base64Content?: string;
  buffer?: Buffer;
}): Promise<{ success: boolean; attachment?: FileAttachment; error?: string }> {
  const { filename, mimeType, size, base64Content } = fileData;

  if (size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: `File size exceeds the 10MB limit (size: ${(size / 1024 / 1024).toFixed(1)}MB).` };
  }

  const safeName = sanitizeFilename(filename);

  // Extract text if plain text / markdown / csv
  let extractedText = '';
  if (base64Content && (mimeType.startsWith('text/') || mimeType === 'application/json')) {
    try {
      const decoded = Buffer.from(base64Content, 'base64').toString('utf-8');
      extractedText = decoded.slice(0, 15000); // cap text preview to 15k chars
    } catch {
      extractedText = '[Text content could not be decoded]';
    }
  }

  let finalUrl = '';
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobToken && base64Content) {
    try {
      // Vercel Blob upload endpoint simulation / call
      const res = await fetch(`https://blob.vercel-storage.com/${encodeURIComponent(safeName)}`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${blobToken}`,
          'x-content-type': mimeType,
        },
        body: Buffer.from(base64Content, 'base64'),
      });

      if (res.ok) {
        const json = await res.json();
        finalUrl = json.url;
      }
    } catch (err) {
      console.warn('[Vercel Blob] Upload failed or token invalid:', (err as Error)?.message);
    }
  }

  const attachment: FileAttachment = {
    filename: safeName,
    mimeType,
    size,
    uploadedAt: new Date().toISOString(),
    url: finalUrl || undefined,
    extractedText: extractedText || `[Attachment: ${safeName} (${(size / 1024).toFixed(1)} KB)]`,
  };

  return { success: true, attachment };
}
