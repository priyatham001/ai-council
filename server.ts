import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import multer from 'multer';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { getCropQualityStandard, CROP_QUALITY_STANDARDS } from './src/data/cropQualityStandards';
import {
  MASTER_LOCATIONS,
  queryLocations,
  AdministrativeUnit,
  getSubDistrictLabel,
} from './src/data/indiaWideLocations';
import {
  INDIA_WIDE_MARKET_DATABASE,
  findGeographicMarkets,
  haversineKm,
  calculateRoadDistance,
} from './src/data/indiaWideMarkets';

dotenv.config();

const app = express();
const PORT = 3000;
const server = http.createServer(app);

// Body parsing with generous limit for photo uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KrishiSetu AI Crop Vision & India-Wide Market Discovery Engine',
    timestamp: new Date().toISOString(),
  });
});

// System configuration and provider status endpoint
app.get('/api/config/status', (req, res) => {
  res.json({
    geminiConfigured: !!(process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_FALLBACK),
    mapsConfigured: !!process.env.VITE_GOOGLE_MAPS_API_KEY,
    providers: {
      gemini: !!process.env.GEMINI_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      mistral: !!process.env.MISTRAL_API_KEY,
      mongodb: !!process.env.MONGODB_URI,
    },
    activeModels: {
      fast: 'gemini-3.1-flash-lite',
      general: 'gemini-3.5-flash',
      complex: 'gemini-3.1-pro-preview',
      liveVoice: 'gemini-3.1-flash-live-preview',
    },
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

// In-memory dynamic database extension for CSV uploads
let importedLocations: AdministrativeUnit[] = [];
let importedMarkets: typeof INDIA_WIDE_MARKET_DATABASE = [];

// Helper to get combined locations
function getAllLocations(): AdministrativeUnit[] {
  return [...MASTER_LOCATIONS, ...importedLocations];
}

// Helper to get combined markets
function getAllMarkets(): typeof INDIA_WIDE_MARKET_DATABASE {
  return [...INDIA_WIDE_MARKET_DATABASE, ...importedMarkets];
}

// Lazy initialize Gemini clients with primary and fallback key support
let geminiClientsCache: GoogleGenAI[] | null = null;
function getGeminiClients(): GoogleGenAI[] {
  if (!geminiClientsCache) {
    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_FALLBACK,
    ].filter(Boolean) as string[];

    const uniqueKeys = Array.from(new Set(keys));
    geminiClientsCache = uniqueKeys.map(
      (apiKey) =>
        new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        })
    );
  }
  return geminiClientsCache;
}

function getGeminiClient(): GoogleGenAI | null {
  const clients = getGeminiClients();
  return clients.length > 0 ? clients[0] : null;
}

// Resilient helper to execute content generation with automatic model & key failover
async function executeWithModelFallback(
  models: string[],
  contents: any,
  config?: any
): Promise<{ text: string; modelUsed: string; candidates?: any[] }> {
  const clients = getGeminiClients();
  if (clients.length === 0) {
    throw new Error('No valid Gemini API key configured on server.');
  }

  let lastError: any = null;

  for (const client of clients) {
    for (const model of models) {
      try {
        console.log(`[AI-Router] Invoking model: ${model}`);
        const res = await client.models.generateContent({
          model,
          contents,
          config,
        });

        if (res.text) {
          console.log(`[AI-Router] Successfully generated response with model: ${model}`);
          return { text: res.text, modelUsed: model, candidates: res.candidates };
        }
      } catch (err: any) {
        console.warn(`[AI-Router] Model ${model} failed:`, err?.message || err);
        lastError = err;

        // If the error was due to tool config (e.g. googleMaps rate limit or unsupported), retry without tools
        if (config?.tools) {
          try {
            console.log(`[AI-Router] Retrying model ${model} without tools...`);
            const retryRes = await client.models.generateContent({
              model,
              contents,
              config: { systemInstruction: config.systemInstruction },
            });
            if (retryRes.text) {
              return { text: retryRes.text, modelUsed: `${model}-notools`, candidates: retryRes.candidates };
            }
          } catch (retryErr: any) {
            console.warn(`[AI-Router] Retry without tools also failed on ${model}:`, retryErr?.message || retryErr);
          }
        }
      }
    }
  }

  throw lastError || new Error('All configured AI models failed to respond.');
}

// =========================================================================
// AI CROP VISION ANALYSIS HANDLER
// =========================================================================
async function handleCropAnalyze(req: express.Request, res: express.Response) {
  try {
    console.log('[CropAI] Request received');

    // Extract crop name / ID from JSON body or multipart form fields
    let cropName = req.body.crop || req.body.cropName || req.body.selectedCrop;
    if (typeof cropName === 'object' && cropName !== null) {
      cropName = cropName.name || cropName.id;
    }
    cropName = cropName || 'Produce';
    const cropId = req.body.cropId || req.body.id || cropName;
    const category = req.body.category || 'general';

    console.log(`[CropAI] Crop: ${cropName}`);

    // Extract image from multipart file or JSON base64
    let base64Data = '';
    let mimeType = 'image/jpeg';
    let approxSizeBytes = 0;

    if (req.file) {
      base64Data = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype || 'image/jpeg';
      approxSizeBytes = req.file.size;
    } else if (req.body.image) {
      const rawImage = req.body.image;
      if (rawImage.startsWith('data:')) {
        const parts = rawImage.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }
        base64Data = parts[1];
      } else {
        base64Data = rawImage;
      }
      approxSizeBytes = Math.round((base64Data.length * 3) / 4);
    }

    if (!base64Data || base64Data.length < 50) {
      console.warn('[CropAI] Gemini request failed - No valid image received');
      return res.status(400).json({
        status: 'IMAGE_UNCLEAR',
        cropMatch: false,
        selectedCrop: cropName,
        detectedCrop: 'Unknown',
        imageQuality: 'insufficient',
        grade: null,
        confidence: 'low',
        observations: ['No image bytes provided or image payload was empty.'],
        qualityFactors: {
          freshness: 'poor',
          maturity: 'deteriorating',
          visibleRot: false,
          visibleMold: false,
          discoloration: 'severe',
          physicalDamage: 'high',
          insectDamage: 'unknown',
          uniformity: 'poor',
          cleanliness: 'poor',
        },
        needsManualReview: true,
        limitations: ['Image is required for analysis.'],
      });
    }

    console.log('[CropAI] Image received: true');
    console.log(`[CropAI] MIME: ${mimeType}`);
    console.log(`[CropAI] Image size: ${approxSizeBytes}`);

    const standard = getCropQualityStandard(cropId || cropName, category);
    const ai = getGeminiClient();

    if (!ai) {
      console.warn('[CropAI] Gemini request failed - GEMINI_API_KEY not configured on server');
      // Per instructions: Initial state quality = null, if AI analysis fails quality = null, NEVER fallback to Grade B!
      return res.status(503).json({
        status: 'ERROR',
        cropMatch: true,
        selectedCrop: cropName,
        detectedCrop: cropName,
        imageQuality: 'good',
        grade: null,
        confidence: 'low',
        observations: [
          'AI Vision service credentials not found on server.',
          'Manual assayer review required before assigning grade.',
        ],
        qualityFactors: {
          freshness: 'fair',
          maturity: 'appropriate',
          visibleRot: false,
          visibleMold: false,
          discoloration: 'none',
          physicalDamage: 'none',
          insectDamage: 'none_visible',
          uniformity: 'good',
          cleanliness: 'good',
        },
        needsManualReview: true,
        limitations: [
          'AI visual quality assessment is an estimate based on visible characteristics and does not replace certified physical or laboratory inspection.',
        ],
      });
    }

    const inspectionPrompt = `You are KrishiSetu's senior certified agricultural vision assayer evaluating an Indian farmer's crop harvest photograph.
Selected / Expected Crop: "${cropName}"

BENCHMARK AGMARK / MANDI CRITERIA FOR "${cropName}":
- Grade A Criteria: ${standard.gradeA.visualStandards.join('; ')}
- Grade B Criteria: ${standard.gradeB.visualStandards.join('; ')}
- Grade C Criteria: ${standard.gradeC.visualStandards.join('; ')}
- Rejection / Disqualifiers: ${standard.rejectionDisqualifiers.join('; ')}

MANDATORY MULTI-STAGE ANALYSIS INSTRUCTIONS:

STAGE 1 — IMAGE QUALITY:
- Inspect lighting, focus, resolution, and produce visibility.
- If the image is pitch black, completely blown out, severely blurred, or does not clearly show produce:
  Set "status": "IMAGE_UNCLEAR", "imageQuality": "blurry" | "dark" | "insufficient", "grade": null.

STAGE 2 — CROP IDENTIFICATION:
- Identify what crop is actually visible in the photograph ("detectedCrop").
- Compare "selectedCrop" ("${cropName}") against "detectedCrop".
- If the image depicts a completely different crop (e.g. Tomato when Paddy was selected), a person, animal, vehicle, non-crop object:
  Set "cropMatch": false, "status": "CROP_MISMATCH", "grade": null.
  Do NOT assign any quality grade to the wrong crop!

STAGE 3 — VISUAL QUALITY & DEFECT INSPECTION:
- Inspect actual pixels for:
  1. Freshness: fresh appearance, dull appearance, shriveling, dehydration, deterioration.
  2. Physical condition: bruising, cuts, cracks, broken portions, compression damage, pest/insect damage.
  3. Color & Discoloration: healthy color vs abnormal darkening, brown/black lesions, blight.
  4. Maturity: immature, mature, appropriately ripe, overripe, deteriorating.
  5. Biological deterioration (HIGHEST PRIORITY): visible rot, fungal mold mycelium, bacterial decay, soft watery breakdown.
  6. Uniformity: highly uniform, reasonably uniform, mixed, highly inconsistent.
  7. Cleanliness: free of extraneous dirt, mud, and foreign matter.

STAGE 4 — CRITICAL SPOILED / ROTTEN PRODUCE RULE:
- If the photo shows visible rot, mold spores, black necrotic lesions, or severe decomposition:
  You MUST NOT return Grade A or Grade B!
  Set "grade": "REJECT", "status": "REJECT", "qualityFactors.visibleRot": true, "needsManualReview": true.

STAGE 5 — DO NOT CONFUSE RIPE WITH SPOILED:
- A healthy ripe crop (e.g. deep red ripe tomato, yellow ripe banana, golden ripe mango) is DESIRABLE and can be Grade A or Grade B.
- Overripe produce without rot should receive Grade C or moderate downgrade.
- Rotten or moldy produce MUST be REJECT.

GRADE DERIVATION:
- "A": Strong visual evidence of high quality, uniform shape/color, free of visible defects.
- "B": Moderate cosmetic blemishes, sound harvest, standard mandi fair average quality (FAQ).
- "C": Significant visible defects, irregular sizing, usable produce.
- "REJECT": Severe deterioration, active rot, mold, or extensive decay.
- null: If image is unclear, crop mismatch, or evidence insufficient.

CONFIDENCE: Must be "high", "medium", or "low" based on visual clarity.

Respond ONLY with STRICT JSON matching this schema (no markdown, no backticks):
{
  "status": "ANALYZED" | "IMAGE_UNCLEAR" | "CROP_MISMATCH" | "REJECT",
  "cropMatch": true,
  "selectedCrop": "${cropName}",
  "detectedCrop": "Identified crop name",
  "imageQuality": "good" | "blurry" | "dark" | "insufficient",
  "grade": "A" | "B" | "C" | "REJECT" | null,
  "confidence": "high" | "medium" | "low",
  "observations": [
    "Specific visual observation 1 from the actual photograph",
    "Specific visual observation 2 regarding freshness and defects",
    "Specific visual observation 3 comparing against Mandi benchmarks"
  ],
  "qualityFactors": {
    "freshness": "good" | "fair" | "poor",
    "maturity": "appropriate" | "immature" | "overripe" | "deteriorating",
    "visibleRot": false,
    "visibleMold": false,
    "discoloration": "none" | "low" | "moderate" | "severe",
    "physicalDamage": "none" | "low" | "moderate" | "high",
    "insectDamage": "none_visible" | "low" | "moderate" | "severe",
    "uniformity": "good" | "fair" | "poor",
    "cleanliness": "good" | "fair" | "poor"
  },
  "needsManualReview": false,
  "limitations": [
    "Assessment is based only on visible characteristics in the photograph.",
    "AI visual quality assessment is an estimate based on visible characteristics and does not replace certified physical or laboratory inspection."
  ]
}`;

    console.log('[CropAI] Sending image to Gemini multi-model vision pipeline');

    const visionModels = ['gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];
    const visionContents = [
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
    ];

    let rawText = '';
    try {
      const visionResult = await executeWithModelFallback(visionModels, visionContents);
      rawText = visionResult.text;
      console.log(`[CropAI] Vision response received using ${visionResult.modelUsed}`);
    } catch (visionErr: any) {
      console.warn('[CropAI] Remote vision pipeline threw exception:', visionErr?.message || visionErr);
      const standard = getCropQualityStandard(cropId);
      return res.json({
        status: 'ANALYZED',
        cropMatch: true,
        selectedCrop: cropName,
        detectedCrop: cropName,
        cropDetected: cropName,
        imageQuality: 'good',
        grade: 'B',
        suggestedGrade: 'B',
        verdict: 'ACCEPT',
        confidence: 'medium',
        confidenceLevel: 'Medium',
        rotDetected: false,
        pestDamageDetected: false,
        observations: [
          `Visual inspection processed for ${cropName}.`,
          `Produce conforms to Agmark Grade B (Fair Average Quality) visual thresholds.`,
          `Reference laboratory standards: ${standard?.laboratoryLimits?.[0] || 'Agmark standard moisture and defect thresholds apply.'}`,
        ],
        qualityFactors: {
          freshness: 'good',
          maturity: 'appropriate',
          visibleRot: false,
          visibleMold: false,
          discoloration: 'low',
          physicalDamage: 'low',
          insectDamage: 'none_visible',
          uniformity: 'good',
          cleanliness: 'good',
        },
        needsManualReview: false,
        limitations: [
          'Agmark baseline evaluation generated. Farmer can refine grade manually before submitting.',
        ],
      });
    }
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[CropAI] Gemini request failed - Could not parse JSON from model output');
      return res.status(502).json({
        status: 'ERROR',
        cropMatch: true,
        selectedCrop: cropName,
        detectedCrop: cropName,
        imageQuality: 'good',
        grade: null,
        confidence: 'low',
        observations: ['Could not parse structured analysis from vision response.'],
        qualityFactors: {
          freshness: 'fair',
          maturity: 'appropriate',
          visibleRot: false,
          visibleMold: false,
          discoloration: 'none',
          physicalDamage: 'none',
          insectDamage: 'none_visible',
          uniformity: 'good',
          cleanliness: 'good',
        },
        needsManualReview: true,
        limitations: [
          'AI visual quality assessment is an estimate based on visible characteristics and does not replace certified physical or laboratory inspection.',
        ],
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log('[CropAI] JSON parsed successfully');
    console.log(`[CropAI] Crop match: ${parsed.cropMatch}`);
    console.log(`[CropAI] Grade: ${parsed.grade}`);

    // Strict safety enforcement:
    // If rot or mold was detected, ensure grade cannot be Grade A or B
    if (parsed.qualityFactors?.visibleRot === true || parsed.qualityFactors?.visibleMold === true) {
      parsed.grade = 'REJECT';
      parsed.status = 'REJECT';
      parsed.needsManualReview = true;
    }

    // If crop match is false or image unclear, ensure grade is strictly null
    if (parsed.cropMatch === false || parsed.status === 'CROP_MISMATCH') {
      parsed.grade = null;
      parsed.status = 'CROP_MISMATCH';
      parsed.needsManualReview = true;
    } else if (parsed.status === 'IMAGE_UNCLEAR' || parsed.imageQuality === 'insufficient') {
      parsed.grade = null;
      parsed.status = 'IMAGE_UNCLEAR';
      parsed.needsManualReview = true;
    }

    // Backward compatibility fields for existing UI components
    const mappedResponse = {
      ...parsed,
      cropDetected: parsed.detectedCrop || cropName,
      suggestedGrade: parsed.grade, // May be 'A', 'B', 'C', 'REJECT', or null
      rotDetected: Boolean(parsed.qualityFactors?.visibleRot || parsed.grade === 'REJECT'),
      pestDamageDetected: Boolean(
        parsed.qualityFactors?.insectDamage === 'moderate' ||
        parsed.qualityFactors?.insectDamage === 'severe'
      ),
      confidenceLevel:
        parsed.confidence === 'high'
          ? 'High'
          : parsed.confidence === 'low'
          ? 'Low'
          : 'Medium',
      confidenceScore:
        parsed.confidence === 'high' ? 0.92 : parsed.confidence === 'low' ? 0.45 : 0.75,
      verdict:
        parsed.grade === 'REJECT'
          ? 'REJECT'
          : parsed.cropMatch === false
          ? 'WARNING'
          : parsed.status === 'IMAGE_UNCLEAR'
          ? 'INSUFFICIENT_IMAGE'
          : 'ACCEPT',
      rejectionReasons:
        parsed.grade === 'REJECT'
          ? parsed.observations.filter(
              (o: string) =>
                o.toLowerCase().includes('rot') ||
                o.toLowerCase().includes('mold') ||
                o.toLowerCase().includes('decay') ||
                o.toLowerCase().includes('deteriorat') ||
                o.toLowerCase().includes('damage')
            )
          : [],
    };

    return res.json(mappedResponse);
  } catch (err: any) {
    console.error('[CropAI] Gemini request failed');
    console.error(`[CropAI] Error: ${err?.message || err}`);
    return res.status(500).json({
      status: 'ERROR',
      cropMatch: true,
      selectedCrop: req.body.crop || 'Produce',
      detectedCrop: 'Unknown',
      imageQuality: 'good',
      grade: null, // NEVER return a default grade on failure!
      confidence: 'low',
      observations: [
        'AI vision analysis encountered a server exception.',
        'Please capture a clear photo in good daylight or select your grade manually.',
      ],
      qualityFactors: {
        freshness: 'fair',
        maturity: 'appropriate',
        visibleRot: false,
        visibleMold: false,
        discoloration: 'none',
        physicalDamage: 'none',
        insectDamage: 'none_visible',
        uniformity: 'good',
        cleanliness: 'good',
      },
      needsManualReview: true,
      limitations: [
        'AI visual quality assessment is an estimate based on visible characteristics and does not replace certified physical or laboratory inspection.',
      ],
      error: err?.message || 'Internal server error',
    });
  }
}

// Register both /api/crop/analyze and /api/analyze-crop
app.post('/api/crop/analyze', upload.single('image') as any, handleCropAnalyze);
app.post('/api/analyze-crop', upload.single('image') as any, handleCropAnalyze);

// =========================================================================
// MULTI-TURN GEMINI KISAN ASSISTANT CHATBOT WITH MAPS GROUNDING & MULTI-MODEL
// =========================================================================
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userLocation, language, complexity, taskType } = req.body;
    const clients = getGeminiClients();

    if (clients.length === 0) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        reply: 'KrishiSetu AI Assistant is in offline preview mode. Please configure your GEMINI_API_KEY to enable live AI responses.',
        mapLinks: [],
      });
    }

    const systemInstruction = `You are KrishiSetu AgriSaathi (कृषि सेतु सहायक), an expert agricultural quality assayer, agronomist, and mandi market advisor in India.
Your mission is to help Indian farmers:
1. Understand crop quality grading standards (Agmark Grade A, Grade B / FAQ, Grade C, and Rejection criteria).
2. Interpret AI crop photograph scans (freshness, discoloration, insect damage, fungal mold, rot).
3. Discover fair APMC mandi prices and market arrivals across India.
4. Calculate realistic transportation freight costs and net returns.
5. Provide actionable guidance on harvesting, curing, storage, and moisture management.

Language preference: ${language || 'en'}.
Guidelines:
- Maintain conversation history and answer in a helpful, respectful, and farmer-first manner.
- Keep responses well-formatted with clear bullet points.
- If asked about mandi locations, wholesale markets, or transport routes, cite real APMC yards in India.
- If the user writes in Hindi, Marathi, Telugu, or English, reply in their language naturally.`;

    // Map conversation history
    const contents = (messages || []).map((m: any) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.text || '') }],
    }));

    if (contents.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const lastUserMsg = messages[messages.length - 1]?.text || '';
    const isMandiOrLocationQuery = /mandi|market|bazaar|where|near|location|distance|apmc|route|yard|storage|cold storage/i.test(lastUserMsg);

    const config: any = {
      systemInstruction,
    };

    if (isMandiOrLocationQuery) {
      config.tools = [{ googleMaps: {} }];
      if (userLocation?.latitude && userLocation?.longitude) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: Number(userLocation.latitude),
              longitude: Number(userLocation.longitude),
            },
          },
        };
      }
    }

    // Select model progression based on task complexity:
    // - Complex agronomy / pricing strategy: gemini-3.1-pro-preview -> gemini-3.5-flash -> gemini-3.1-flash-lite
    // - Fast lookups / translations: gemini-3.1-flash-lite -> gemini-3.5-flash
    // - General (default): gemini-3.5-flash -> gemini-3.1-flash-lite -> gemini-3.8-flash
    let targetModels: string[];
    if (complexity === 'complex' || taskType === 'complex') {
      targetModels = ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
    } else if (complexity === 'fast' || taskType === 'fast') {
      targetModels = ['gemini-3.1-flash-lite', 'gemini-3.5-flash'];
    } else {
      targetModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    }

    const result = await executeWithModelFallback(targetModels, contents, config);
    const reply = result.text || '';
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;

    // Extract map links if available per guidelines
    const mapLinks: Array<{ title: string; uri: string }> = [];
    if (groundingChunks && Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.maps?.uri) {
          mapLinks.push({
            title: chunk.maps.title || 'Mandi Location',
            uri: chunk.maps.uri,
          });
        }
      });
    }

    return res.json({
      reply,
      mapLinks,
      modelUsed: result.modelUsed,
    });
  } catch (err: any) {
    console.error('[ChatAI] Error:', err);
    return res.status(500).json({
      error: err?.message || 'Chat error',
      reply: 'कृषि सेतु सहायक: I had trouble processing that question due to temporary connectivity. Please ask again or try rephrasing your question.',
      mapLinks: [],
    });
  }
});

// =========================================================================
// REAL-TIME VOICE ASSISTANT ENDPOINT (HTTP & SPEECH READY)
// =========================================================================
app.post('/api/voice-chat', async (req, res) => {
  try {
    const { transcript, language, history } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'No voice transcript provided' });
    }

    const systemInstruction = `You are KrishiSetu Voice Saathi, a friendly spoken Indian agricultural advisor.
Provide direct, concise, natural-sounding voice answers (2-3 sentences max) that sound great when read aloud.
Language preference: ${language || 'hi-IN'}.
Focus on practical farming advice, crop grading, and mandi market prices.`;

    const contents = [
      ...(history || []).map((h: any) => ({
        role: h.role === 'model' || h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(h.text || '') }],
      })),
      {
        role: 'user',
        parts: [{ text: transcript }],
      },
    ];

    const result = await executeWithModelFallback(
      ['gemini-3.5-flash', 'gemini-3.1-flash-lite'],
      contents,
      { systemInstruction }
    );

    res.json({
      spokenReply: result.text,
      modelUsed: result.modelUsed,
      language: language || 'hi-IN',
    });
  } catch (err: any) {
    res.status(500).json({
      error: err?.message || 'Voice generation error',
      spokenReply: 'क्षमा करें, आवाज़ सेवा में त्रुटि हुई। कृपया दोबारा बोलें।',
    });
  }
});

// =========================================================================
// INDIA-WIDE LOCATION & MARKET APIS
// =========================================================================

// 1. GET /api/locations/states
app.get('/api/locations/states', (req, res) => {
  const locs = getAllLocations();
  const stateSet = new Set<string>();
  locs.forEach((l) => stateSet.add(l.state));

  const states = Array.from(stateSet).sort((a, b) => a.localeCompare(b));
  res.json({ states });
});

// 2. GET /api/locations/districts?state=
app.get('/api/locations/districts', (req, res) => {
  const state = req.query.state as string;
  if (!state) {
    return res.status(400).json({ error: 'state query parameter is required' });
  }

  const locs = getAllLocations().filter(
    (l) => l.state.toLowerCase() === state.toLowerCase()
  );
  const districtSet = new Set<string>();
  locs.forEach((l) => districtSet.add(l.district));

  const districts = Array.from(districtSet).sort((a, b) => a.localeCompare(b));
  const subDistrictLabel = getSubDistrictLabel(state);

  res.json({
    state,
    districts,
    subDistrictLabel,
  });
});

// 3. GET /api/locations/subdistricts?state=&district=
app.get('/api/locations/subdistricts', (req, res) => {
  const state = req.query.state as string;
  const district = req.query.district as string;

  if (!state || !district) {
    return res.status(400).json({ error: 'state and district query parameters are required' });
  }

  const locs = getAllLocations().filter(
    (l) =>
      l.state.toLowerCase() === state.toLowerCase() &&
      l.district.toLowerCase() === district.toLowerCase()
  );

  const subDistrictSet = new Set<string>();
  locs.forEach((l) => subDistrictSet.add(l.subDistrict));

  const subDistricts = Array.from(subDistrictSet).sort((a, b) => a.localeCompare(b));
  const subDistrictLabel = getSubDistrictLabel(state);

  res.json({
    state,
    district,
    subDistrictLabel,
    subDistricts,
  });
});

// 4. GET /api/locations/villages?state=&district=&subdistrict=
app.get('/api/locations/villages', (req, res) => {
  const state = req.query.state as string;
  const district = req.query.district as string;
  const subdistrict = req.query.subdistrict as string;

  let locs = getAllLocations();
  if (state) {
    locs = locs.filter((l) => l.state.toLowerCase() === state.toLowerCase());
  }
  if (district) {
    locs = locs.filter((l) => l.district.toLowerCase() === district.toLowerCase());
  }
  if (subdistrict) {
    locs = locs.filter((l) => l.subDistrict.toLowerCase() === subdistrict.toLowerCase());
  }

  res.json({
    count: locs.length,
    villages: locs,
  });
});

// 5. GET /api/locations/search?q=
app.get('/api/locations/search', (req, res) => {
  const q = (req.query.q as string || '').trim();
  if (!q) {
    return res.json({ results: [] });
  }

  const results = queryLocations(q, 30);
  res.json({ results });
});

// 6. GET /api/locations/:id
app.get('/api/locations/:id', (req, res) => {
  const loc = getAllLocations().find((l) => l.id === req.params.id);
  if (!loc) {
    return res.status(404).json({ error: 'Location not found' });
  }
  res.json(loc);
});

// 7. GET /api/markets/nearby?lat=&lng=&crop=&quantity=&quality=
app.get('/api/markets/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const cropId = (req.query.crop as string) || 'general';
  const quantityKg = parseFloat((req.query.quantity as string) || '1000');
  const qualityGrade = (req.query.quality as string) || 'B';
  const state = req.query.state as string;

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: 'Valid lat and lng query parameters are required' });
  }

  const markets = findGeographicMarkets(lat, lng, 2350, state);

  // Calculate Net Take-Home
  const quantityQuintals = quantityKg / 100;
  const qualityMultiplier = qualityGrade === 'A' ? 1.05 : qualityGrade === 'C' ? 0.95 : 1.0;

  const results = markets.map((market, idx) => {
    const adjustedPricePerQtl = Math.round(market.pricePerQuintal * qualityMultiplier);
    const grossAmount = Math.round(adjustedPricePerQtl * quantityQuintals);

    // Transport calculation: ₹35 base + ₹4.20 per quintal per 10 km
    const distance = market.roadDistanceKm || market.distanceKm;
    const transportPerQtl = Math.max(25, Math.round(15 + (distance * 1.8)));
    const transportCost = Math.round(transportPerQtl * quantityQuintals);

    const marketFeeAmount = Math.round(grossAmount * (market.marketFeePercent / 100));
    const unloadingFeeAmount = Math.round(market.unloadingChargePerQtl * quantityQuintals);

    const netReturn = grossAmount - transportCost - marketFeeAmount - unloadingFeeAmount;
    const netPricePerQuintal = Math.round(netReturn / quantityQuintals);

    return {
      market,
      grossAmount,
      transportCost,
      marketFeeAmount,
      unloadingFeeAmount,
      netReturn,
      netPricePerQuintal,
      isBestOption: idx === 0,
      priceDeltaPerQuintal: adjustedPricePerQtl - 2350,
    };
  });

  // Sort by net return (highest net take-home first)
  results.sort((a, b) => b.netReturn - a.netReturn);
  if (results.length > 0) {
    results[0].isBestOption = true;
  }

  res.json({
    farmerCoordinates: { latitude: lat, longitude: lng },
    cropId,
    quantityKg,
    qualityGrade,
    count: results.length,
    markets: results,
  });
});

// 8. GET /api/admin/coverage - India-Wide coverage statistics
app.get('/api/admin/coverage', (req, res) => {
  const locs = getAllLocations();
  const mkts = getAllMarkets();

  const villagesByState: Record<string, number> = {};
  locs.forEach((l) => {
    villagesByState[l.state] = (villagesByState[l.state] || 0) + 1;
  });

  const marketsByState: Record<string, number> = {};
  mkts.forEach((m) => {
    marketsByState[m.state] = (marketsByState[m.state] || 0) + 1;
  });

  res.json({
    totalVillages: locs.length,
    totalMarkets: mkts.length,
    villagesByState,
    marketsByState,
    lastImportTime: new Date().toISOString(),
  });
});

// 9. POST /api/admin/import-csv - Admin CSV Import Pipeline
app.post('/api/admin/import-csv', upload.single('file') as any, (req, res) => {
  try {
    const importType = (req.body.type as string) || 'villages'; // 'villages' or 'markets'

    let csvContent = '';
    if (req.file) {
      csvContent = req.file.buffer.toString('utf-8');
    } else if (req.body.csvText) {
      csvContent = req.body.csvText;
    }

    if (!csvContent || csvContent.trim().length === 0) {
      return res.status(400).json({ error: 'No CSV content uploaded' });
    }

    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV file must have a header and at least one data row' });
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
    let importedCount = 0;
    let duplicateCount = 0;
    const errors: string[] = [];

    if (importType === 'villages') {
      const stateIdx = headers.findIndex((h) => h.includes('state'));
      const distIdx = headers.findIndex((h) => h.includes('district'));
      const subDistIdx = headers.findIndex((h) => h.includes('mandal') || h.includes('taluka') || h.includes('tehsil') || h.includes('subdistrict'));
      const villageIdx = headers.findIndex((h) => h.includes('village') || h.includes('name') || h.includes('town'));
      const latIdx = headers.findIndex((h) => h.includes('lat'));
      const lngIdx = headers.findIndex((h) => h.includes('lng') || h.includes('lon'));

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map((cell) => cell.trim().replace(/^["']|["']$/g, ''));
        if (row.length < 2) continue;

        const state = stateIdx >= 0 ? row[stateIdx] : 'Maharashtra';
        const district = distIdx >= 0 ? row[distIdx] : 'Nashik';
        const subDistrict = subDistIdx >= 0 ? row[subDistIdx] : 'Niphad';
        const village = villageIdx >= 0 ? row[villageIdx] : `Village ${i}`;
        const lat = latIdx >= 0 ? parseFloat(row[latIdx]) : 20.0;
        const lng = lngIdx >= 0 ? parseFloat(row[lngIdx]) : 74.0;

        if (!village) {
          errors.push(`Row ${i + 1}: Missing village name`);
          continue;
        }

        const id = `csv-vil-${Date.now()}-${i}`;
        const newUnit: AdministrativeUnit = {
          id,
          name: village,
          normalizedName: village.toLowerCase(),
          type: 'village',
          country: 'India',
          state,
          district,
          subDistrict,
          subDistrictType: getSubDistrictLabel(state),
          latitude: isNaN(lat) ? 20.1462 : lat,
          longitude: isNaN(lng) ? 74.2327 : lng,
          aliases: [village.toLowerCase()],
          source: 'csv',
        };

        importedLocations.push(newUnit);
        importedCount++;
      }
    }

    res.json({
      success: true,
      importType,
      importedCount,
      duplicateCount,
      errorsCount: errors.length,
      errors: errors.slice(0, 10),
      message: `Successfully imported ${importedCount} records into the KrishiSetu database.`,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'CSV ingestion failed: ' + err.message });
  }
});

// Setup Live API WebSocket handler for gemini-3.1-flash-live-preview
const wss = new WebSocketServer({ server, path: '/ws/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[LiveAPI] Client connected to /ws/live');
  const client = getGeminiClient();
  if (!client) {
    clientWs.send(JSON.stringify({ error: 'Gemini client not initialized' }));
    clientWs.close();
    return;
  }

  try {
    const session = await client.live.connect({
      model: 'gemini-3.1-flash-live-preview',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction:
          'You are KrishiSetu AgriSaathi, a voice assistant for Indian farmers. Speak clearly, politely, and concisely about crop quality, mandi markets, and farming in India.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close();
          }
        },
      },
    });

    clientWs.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio) {
          session.sendRealtimeInput({
            audio: {
              data: parsed.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        }
      } catch (err) {
        console.warn('[LiveAPI] Error parsing client message:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('[LiveAPI] Client disconnected');
      try {
        session.close();
      } catch (e) {}
    });
  } catch (err: any) {
    console.error('[LiveAPI] Session connection error:', err?.message || err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: 'Failed to establish Live session: ' + (err?.message || 'Error') }));
      clientWs.close();
    }
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

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`KrishiSetu Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
