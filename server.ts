import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { getCropQualityStandard, CROP_QUALITY_STANDARDS } from './src/data/cropQualityStandards';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with generous limit for photo uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KrishiSetu AI Crop Vision & Market Discovery Engine',
    timestamp: new Date().toISOString(),
  });
});

// Reference quality standards endpoint for Agmark/Mandi inspection benchmarks
app.get('/api/reference-standards', (req, res) => {
  const cropId = req.query.cropId as string | undefined;
  if (cropId) {
    const standard = getCropQualityStandard(cropId);
    return res.json(standard);
  }
  res.json(CROP_QUALITY_STANDARDS);
});

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
    }
  }
  return geminiClient;
}

// AI Crop Vision Analysis Endpoint
app.post('/api/analyze-crop', async (req, res) => {
  const requestStartTime = Date.now();
  try {
    const { image, cropId, cropName, category, qualityProfile } = req.body;

    console.log('[AI Vision] Incoming crop analysis request received');
    console.log(`[AI Vision] Selected crop: "${cropName}" (ID: ${cropId}, Category: ${category || 'standard'})`);

    if (!image) {
      console.warn('[AI Vision] Missing image data in request payload');
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Strip data:image/...;base64, prefix if present
    let base64Data = image;
    let mimeType = 'image/jpeg';
    if (image.startsWith('data:')) {
      const parts = image.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
      base64Data = parts[1];
    }

    const approxSizeBytes = Math.round((base64Data.length * 3) / 4);
    const approxSizeKb = (approxSizeBytes / 1024).toFixed(1);
    console.log(`[AI Vision] Image received - MIME: ${mimeType}, Size: ~${approxSizeKb} KB`);

    const standard = getCropQualityStandard(cropId || cropName || 'generic', category);
    const ai = getGeminiClient();

    if (!ai) {
      console.warn('[AI Vision] Gemini client not configured (GEMINI_API_KEY is not set)');
      return res.status(503).json({
        status: 'AI_UNAVAILABLE',
        verdict: 'ERROR',
        error: 'AI analysis service is currently unavailable. Please verify GEMINI_API_KEY or proceed with manual assayer review.',
        cropDetected: cropName || 'Unknown',
        cropMatch: true,
        suggestedGrade: 'REJECT',
        confidence: 'low',
        needsManualReview: true,
        observations: ['AI Vision service is offline or not configured with valid API credentials.'],
      });
    }

    const inspectionPrompt = `You are KrishiSetu's senior certified agricultural harvest inspector evaluating an Indian farmer's crop photograph under AGMARK and Mandi quality standards.
Expected Crop: "${cropName}" (Category: ${category || standard.category}).

OFFICIAL AGMARK / MANDI BENCHMARK STANDARDS FOR THIS CROP:
- Grade A Standards: ${standard.gradeA.visualStandards.join('; ')}
- Grade B Standards (FAQ): ${standard.gradeB.visualStandards.join('; ')}
- Grade C Standards (Secondary): ${standard.gradeC.visualStandards.join('; ')}
- Critical Disqualifiers: ${standard.rejectionDisqualifiers.join('; ')}

MANDATORY INSPECTION RULES:
1. ROT / MOLD / SPOILAGE DETECTION (HIGHEST PRIORITY):
   - You must inspect the ACTUAL pixels of the photo.
   - Under NO circumstances should an image showing rot, fungal mold mycelium, soft watery decomposition, black rot spots, pest infestation, or decay be assigned Grade A or Grade B!
   - If ANY rot, mold, decomposition, or severe damage is observed, you MUST set:
     * "status": "REJECT"
     * "verdict": "REJECT"
     * "suggestedGrade": "REJECT"
     * "qualityFactors.visibleRot": true
     * "qualityFactors.visibleMold": true or as observed
     * "confidence": "high"
     * Add explicit details of the rot/decay in "observations".
2. CROP IDENTITY MATCH:
   - Verify if the photo actually depicts the expected crop ("${cropName}").
   - If the photo shows a completely different crop (e.g. Tomato when Paddy was selected), an animal, a shoe, furniture, or a non-agricultural object:
     * "cropMatch": false
     * "status": "MISMATCH"
     * "verdict": "WARNING"
     * "suggestedGrade": "REJECT"
     * "needsManualReview": true
3. IMAGE CLARITY & QUALITY:
   - If the photo is too dark, blurry, out of focus, or does not clearly show produce details:
     * "imageQuality": "blurry" | "dark" | "insufficient"
     * "status": "INSUFFICIENT_IMAGE"
     * "verdict": "INSUFFICIENT_IMAGE"
     * "suggestedGrade": "REJECT"
     * "confidence": "low"
     * "needsManualReview": true
4. VALID HEALTHY CROPS:
   - Grade A: Clean, uniform, free of defects, optimal ripeness.
   - Grade B (FAQ): Normal fair average quality, minor cosmetic blemishes, sound produce.
   - Grade C: Sound but with noticeable cosmetic defects, uneven sizing, or discoloration.
5. MANDATORY LABORATORY DISCLAIMER:
   - Moisture %, oil %, gluten, and chemical/pesticide residue CANNOT be determined from a 2D photograph. Always list this in "limitations".

Respond with STRICT JSON ONLY matching this exact structure (no markdown, no backticks):
{
  "cropDetected": "${cropName}",
  "cropMatch": true,
  "imageQuality": "good",
  "status": "ACCEPTABLE",
  "verdict": "ACCEPT",
  "suggestedGrade": "A" | "B" | "C" | "REJECT",
  "confidence": "high" | "medium" | "low",
  "confidenceScore": 0.90,
  "rotDetected": false,
  "pestDamageDetected": false,
  "observations": [
    "Observation 1 about grain/fruit appearance and color",
    "Observation 2 about defects or lack thereof",
    "Observation 3 about comparison with Mandi standards"
  ],
  "qualityFactors": {
    "ripeness": "Optimal harvest maturity" | "Immature" | "Overripe" | "Not applicable",
    "visibleRot": false,
    "visibleMold": false,
    "discoloration": "none" | "low" | "moderate" | "severe",
    "physicalDamage": "none" | "low" | "moderate" | "high",
    "uniformity": "high" | "moderate" | "poor",
    "freshness": "good" | "fair" | "poor"
  },
  "needsManualReview": false,
  "limitations": [
    "AI visual estimate — not an accredited laboratory chemical certification",
    "Exact moisture % requires a physical moisture meter"
  ]
}`;

    console.log('[AI Vision] Gemini request started with model gemini-2.5-flash');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: inspectionPrompt,
            },
          ],
        },
      ],
    });

    const elapsed = Date.now() - requestStartTime;
    console.log(`[AI Vision] Gemini response received in ${elapsed}ms`);

    const rawText = response.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[AI Vision] Failed to parse JSON from Gemini response');
      return res.status(502).json({
        status: 'ERROR',
        verdict: 'ERROR',
        error: 'Could not parse structured analysis from vision response.',
        needsManualReview: true,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log(`[AI Vision] Parsing success - Crop Match: ${parsed.cropMatch}, Status: ${parsed.status || parsed.verdict}, Suggested Grade: ${parsed.suggestedGrade}`);
    console.log(`[AI Vision] Final AI status: ${parsed.status || parsed.verdict}`);

    return res.json(parsed);
  } catch (error: any) {
    const elapsed = Date.now() - requestStartTime;
    console.error(`[AI Vision] Error in /api/analyze-crop after ${elapsed}ms:`, error?.message || error);
    res.status(500).json({
      status: 'ERROR',
      verdict: 'ERROR',
      error: 'Crop image inspection error: ' + (error?.message || 'Server failure'),
      needsManualReview: true,
    });
  }
});

// Start Express server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KrishiSetu Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
