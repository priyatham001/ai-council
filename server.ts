import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { orchestrator } from './lib/ai/orchestrator';
import {
  saveAnalysis,
  getAnalysesList,
  getAnalysisById,
  deleteAnalysisById,
  isMongoDbConnected,
} from './lib/mongodb';
import { validateQuestion, validateMode } from './lib/validation';
import { processUploadedFile } from './lib/blob';
import { HealthResponse } from './types/ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with 20mb limit for uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // ===================== API ROUTES FIRST =====================

  // 1. Health check
  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      const providers = orchestrator.getAvailableProviders();
      const mongoConnected = await isMongoDbConnected();

      const health: HealthResponse = {
        status: 'ok',
        mongodb: mongoConnected,
        providers: {
          gemini: providers.find((p) => p.id === 'gemini')?.configured ?? false,
          openai: providers.find((p) => p.id === 'openai')?.configured ?? false,
          anthropic: providers.find((p) => p.id === 'anthropic')?.configured ?? false,
          mistral: providers.find((p) => p.id === 'mistral')?.configured ?? false,
        },
        totalConfigured: providers.filter((p) => p.configured).length,
        demoModeAvailable: true,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(health);
    } catch (err) {
      res.status(500).json({ status: 'degraded', error: 'Health check failed.' });
    }
  });

  // 2. Models status metadata (strictly no secrets)
  app.get('/api/models', (_req: Request, res: Response) => {
    try {
      const providers = orchestrator.getAvailableProviders();
      const totalConfigured = providers.filter((p) => p.configured).length;
      res.status(200).json({
        providers,
        totalConfigured,
        demoAvailable: true,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve provider metadata.' });
    }
  });

  // 3. Main Council Analysis pipeline
  app.post('/api/council/analyze', async (req: Request, res: Response) => {
    try {
      const { question, mode, selectedProviders, files, enableDemoMode } = req.body;

      // Validate question input
      const validation = validateQuestion(question);
      if (!validation.valid || !validation.cleanQuestion) {
        return res.status(400).json({
          success: false,
          error: validation.error || 'Invalid question provided.',
        });
      }

      const validMode = validateMode(mode);

      // Execute orchestrator
      const analysisDoc = await orchestrator.runCouncilPipeline({
        question: validation.cleanQuestion,
        mode: validMode,
        selectedProviders,
        files,
        enableDemoMode,
      });

      // Save to MongoDB (or in-memory fallback)
      const saveResult = await saveAnalysis(analysisDoc);
      analysisDoc.id = saveResult.id;

      return res.status(200).json({
        success: true,
        analysis: analysisDoc,
        savedToDb: saveResult.savedToDb,
        id: saveResult.id,
      });
    } catch (err: unknown) {
      console.error('[API /api/council/analyze] Pipeline execution error:', (err as Error)?.message);
      return res.status(500).json({
        success: false,
        error: 'The AI Council encountered an unexpected error processing your inquiry. Please try again.',
      });
    }
  });

  // 4. File upload endpoint
  app.post('/api/upload', async (req: Request, res: Response) => {
    try {
      const { filename, mimeType, size, base64Content } = req.body;

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
  });

  // 5. History list
  app.get('/api/history', async (_req: Request, res: Response) => {
    try {
      const history = await getAnalysesList(100);
      return res.status(200).json({ success: true, history });
    } catch (err: unknown) {
      console.error('[API /api/history] Error fetching history:', (err as Error)?.message);
      return res.status(500).json({ success: false, error: 'Failed to retrieve analysis history.' });
    }
  });

  // 6. History single item
  app.get('/api/history/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const analysis = await getAnalysisById(id);

      if (!analysis) {
        return res.status(404).json({ success: false, error: 'Analysis record not found.' });
      }

      return res.status(200).json({ success: true, analysis });
    } catch (err: unknown) {
      console.error('[API /api/history/:id] Error:', (err as Error)?.message);
      return res.status(500).json({ success: false, error: 'Failed to fetch analysis record.' });
    }
  });

  // 7. History delete item
  app.delete('/api/history/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await deleteAnalysisById(id);

      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Record not found or already deleted.' });
      }

      return res.status(200).json({ success: true, message: 'Analysis deleted successfully.' });
    } catch (err: unknown) {
      console.error('[API DELETE /api/history/:id] Error:', (err as Error)?.message);
      return res.status(500).json({ success: false, error: 'Failed to delete record.' });
    }
  });

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
