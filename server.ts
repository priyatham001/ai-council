import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import {
  handleHealth as handleCouncilHealth,
  handleModels,
  handleAnalyze,
  handleUpload,
  handleGetHistory as handleCouncilGetHistory,
  handleGetHistoryById,
  handleDeleteHistoryById,
} from './lib/server/api-handlers';

import {
  handleHealth as handleKrishiHealth,
  handleGetCrops,
  handleGetMarkets,
  handleGetNearbyMarkets,
  handleGetBuyers,
  handleGetTransporters,
  handleRecommend,
  handleGetTrends,
  handleGetForecast,
  handleGetHistory as handleKrishiGetHistory,
  handleDeleteHistory as handleKrishiDeleteHistory,
  handleAdminData,
  handleUpdateTransportRates,
} from './lib/server/krishi-handlers';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with 20mb limit for uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // ===================== API ROUTES FIRST =====================

  // 1. Health check (Smart Krishi Market & SIH26132)
  app.get('/api/health', (req: Request, res: Response) => handleKrishiHealth(req, res));

  // 2. Krishi Market discovery & catalog endpoints
  app.get('/api/crops', (req: Request, res: Response) => handleGetCrops(req, res));
  app.get('/api/markets', (req: Request, res: Response) => handleGetMarkets(req, res));
  app.get('/api/markets/nearby', (req: Request, res: Response) => handleGetNearbyMarkets(req, res));
  app.get('/api/buyers/nearby', (req: Request, res: Response) => handleGetBuyers(req, res));
  app.get('/api/transporters', (req: Request, res: Response) => handleGetTransporters(req, res));

  // 3. Core Net Return Recommendation & Comparison
  app.post('/api/recommend', (req: Request, res: Response) => handleRecommend(req, res));
  app.post('/api/compare', (req: Request, res: Response) => handleRecommend(req, res));

  // 4. Trends & Forecasting
  app.get('/api/trends', (req: Request, res: Response) => handleGetTrends(req, res));
  app.post('/api/forecast', (req: Request, res: Response) => handleGetForecast(req, res));

  // 5. History management
  app.get('/api/history', (req: Request, res: Response) => handleKrishiGetHistory(req, res));
  app.delete('/api/history/:id', (req: Request, res: Response) => handleKrishiDeleteHistory(req, res));

  // 6. Admin Panel endpoints
  app.get('/api/admin/data', (req: Request, res: Response) => handleAdminData(req, res));
  app.post('/api/admin/rates', (req: Request, res: Response) => handleUpdateTransportRates(req, res));

  // Legacy / AI Council endpoints for backwards compatibility
  app.get('/api/council/health', (req: Request, res: Response) => handleCouncilHealth(req, res));
  app.get('/api/models', (req: Request, res: Response) => handleModels(req, res));
  app.post('/api/council/analyze', (req: Request, res: Response) => handleAnalyze(req, res));
  app.post('/api/upload', (req: Request, res: Response) => handleUpload(req, res));
  app.get('/api/council/history', (req: Request, res: Response) => handleCouncilGetHistory(req, res));
  app.get('/api/council/history/:id', (req: Request, res: Response) => handleGetHistoryById(req, res, req.params.id));
  app.delete('/api/council/history/:id', (req: Request, res: Response) => handleDeleteHistoryById(req, res, req.params.id));

  // ===================== VITE MIDDLEWARE =====================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Council server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
