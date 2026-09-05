import { handleUpload } from '../lib/server/api-handlers';

export default async function handler(req: any, res: any) {
  return handleUpload(req, res);
}
