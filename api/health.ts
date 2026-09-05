import { handleHealth } from '../lib/server/api-handlers';

export default async function handler(req: any, res: any) {
  return handleHealth(req, res);
}
