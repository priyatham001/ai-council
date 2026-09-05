import { handleAnalyze } from '../../lib/server/api-handlers';

export default async function handler(req: any, res: any) {
  return handleAnalyze(req, res);
}
