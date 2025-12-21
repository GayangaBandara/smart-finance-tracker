// Groq AI Insights API Proxy
// Using Groq API key directly as provided (for demo/testing only; use env variable in production)

import express, { json } from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(json());

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Supported/fallback models (preference order) — can be overridden by the request body:
const DEFAULT_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32k',
  'gemma-2-9b-it',
];

// Known aliases for common user-provided names — maps aliases to canonical model ids
const MODEL_ALIASES = {
  'llama-3.1-8b-instant': [
    'llama-3.1-8b-instant',
    'llama3-8b-8192',
    'llama-3-8b-8192',
    'llama3-8b',
    'llama-3-8b',
  ],
  'llama-3.1-70b-versatile': [
    'llama-3.1-70b-versatile',
    'llama3-70b-8192',
    'llama-3-70b-8192',
    'llama3-70b',
    'llama-3-70b',
  ],
  'mixtral-8x7b-32k': [
    'mixtral-8x7b-32k',
    'mixtral-8x7b-32768',
    'mixtral-8x7b-8192',
    'mixtral-8x7b',
  ],
  'gemma-2-9b-it': ['gemma-2-9b-it', 'gemma-7b', 'gemma7b', 'gemma'],
};

function canonicalModelName(name) {
  if (!name || typeof name !== 'string') return null;
  const n = name.toLowerCase().trim();
  for (const [canon, aliases] of Object.entries(MODEL_ALIASES)) {
    if (aliases.includes(n)) return canon;
  }
  if (DEFAULT_MODELS.includes(n)) return n;
  return null;
}

function normalizeModels(input) {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : [input];
  const mapped = [];
  for (const item of arr) {
    const canon = canonicalModelName(item);
    if (canon && !mapped.includes(canon)) mapped.push(canon);
  }
  return mapped;
}

// Helper to call Groq with a specific model and optional tuning params
async function callGroqModel(model, { messages, temperature, max_tokens, top_p } = {}) {
  const body = { model, messages };
  if (typeof temperature === 'number') body.temperature = temperature;
  if (typeof max_tokens === 'number') body.max_tokens = max_tokens;
  if (typeof top_p === 'number') body.top_p = top_p;

  return axios.post(GROQ_API_URL, body, {
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
  });
}

app.get('/', (req, res) => {
  res.json({
    message: 'Finance Tracker Groq Insights API',
    version: '1.0.0',
    endpoints: {
      'POST /ai-insight': 'Get AI-powered financial insights from transactions (Groq)',
      'GET /ai-insight/models': 'List supported model ids and aliases',
    },
  });
});

// Returns supported models and their aliases to help clients choose correct ids
app.get('/ai-insight/models', (req, res) => {
  res.json({ supported: DEFAULT_MODELS, aliases: MODEL_ALIASES });
});

// Simple in-memory cache to reduce repeated requests for the same data
const insightsCache = new Map();

app.post('/ai-insight', async (req, res) => {
  const { transactions } = req.body;
  console.log(
    `[AI Insight] request received - transactions: ${Array.isArray(transactions) ? transactions.length : 'invalid'}`
  );
  // Log a small preview to help debug malformed requests without leaking everything
  console.log('Request body snippet:', {
    transactionsPreview: Array.isArray(transactions) ? transactions.slice(0, 3) : transactions,
  });

  if (!transactions || !Array.isArray(transactions)) {
    return res.status(400).json({
      error: 'Invalid transactions data. Expected a non-empty array.',
      receivedType: Array.isArray(transactions) ? 'array' : typeof transactions,
      received: Array.isArray(transactions) ? `length:${transactions.length}` : transactions,
    });
  }

  if (transactions.length === 0) {
    return res.json({ insights: 'No transactions provided.' });
  }

  const payloadStr = JSON.stringify(transactions);
  if (payloadStr.length > 30000) {
    return res.status(413).json({ error: 'Transactions payload too large.' });
  }

  // Hash the payload for simple caching
  const crypto = await import('crypto');
  const hash = crypto.createHash('md5').update(payloadStr).digest('hex');
  const cached = insightsCache.get(hash);
  const now = Date.now();
  if (cached && now - cached.ts < 1000 * 60 * 5) {
    return res.json({ insights: cached.insights, cached: true });
  }

  const defaultSystemPrompt = `You are an expert financial advisor. Analyze the transactions and provide HIGH-IMPACT insights:

ANALYSIS RULES:
- Calculate total income vs expenses and identify spending patterns
- Identify the top spending categories and their percentage of total spend
- Find unusual transactions (outliers significantly above average spend in that category)
- Generate 3-5 specific, measurable, actionable saving opportunities with potential monthly savings
- Provide a risk assessment of current spending habits
- Suggest realistic budget improvements based on the data

TONE: Professional, encouraging, data-driven. Focus on empowering the user to make smart financial decisions.

Respond in this JSON format (all fields required):
{
  "overview": "1-2 sentence summary of overall financial health",
  "tips": [
    {
      "title": "Brief title",
      "description": "Specific, actionable tip with numbers",
      "potentialSavings": "$X/month",
      "priority": "high|medium|low"
    }
  ],
  "spendingSummary": [
    {
      "category": "Category name",
      "amount": number,
      "percentage": number,
      "trend": "increasing|stable|decreasing"
    }
  ],
  "alerts": [
    {
      "type": "unusual|excessive|opportunity",
      "message": "Specific, actionable alert",
      "impact": "$X/month"
    }
  ],
  "healthScore": number (0-100),
  "recommendation": "1-2 sentences on top priority action"
}`;

  // Allow client to suggest model(s) via `model` or `models` in the request body and tuning params
  const {
    model: requestedModel,
    models: requestedModels,
    systemPrompt,
    temperature,
    max_tokens,
    top_p,
  } = req.body;

  let attemptModels;
  if (Array.isArray(requestedModels) && requestedModels.length) {
    attemptModels = normalizeModels(requestedModels);
  } else if (requestedModel) {
    attemptModels = normalizeModels(requestedModel);
  } else {
    attemptModels = [...DEFAULT_MODELS];
  }

  if (!attemptModels || attemptModels.length === 0) {
    return res.status(400).json({
      error: 'No valid models provided. See /ai-insight/models for supported model ids.',
      supportedModels: DEFAULT_MODELS,
    });
  }

  const systemMessage = systemPrompt || defaultSystemPrompt;

  let lastError = null;
  for (const m of attemptModels) {
    try {
      console.log(`Trying Groq model: ${m}`);
      const response = await callGroqModel(m, {
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: `Transactions:\n${payloadStr}` },
        ],
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 1500,
        top_p: top_p ?? 0.9,
      });

      const aiText = response.data.choices?.[0]?.message?.content || 'No insights generated.';
      insightsCache.set(hash, { insights: aiText, ts: Date.now() });
      return res.json({ insights: aiText, model: m });
    } catch (error) {
      console.error('Groq API Request Error:', error.message);
      if (error.response) {
        console.error('Groq response status:', error.response.status);
        console.error('Groq response data:', JSON.stringify(error.response.data));

        const code = error.response.data?.error?.code;
        const msg = error.response.data?.error?.message || 'Failed to get insights from Groq API';

        // If model is decommissioned or not found, try the next model in the list
        if (code === 'model_decommissioned' || code === 'model_not_found') {
          console.warn(`Groq model "${m}" ${code}, trying next model. Reason: ${msg}`);
          lastError = error;
          continue; // try next model
        }

        if (error.response.status === 401) {
          return res.status(401).json({ error: 'Invalid Groq API key' });
        }
        if (error.response.status === 429) {
          return res.status(429).json({ error: 'Groq API rate limit exceeded' });
        }

        // For other errors, surface the message
        return res.status(502).json({ error: msg });
      }

      // non-HTTP error - capture and break (network, timeout, etc.)
      lastError = error;
      break;
    }
  }

  // If we reach here, all candidate models failed
  const finalMsg =
    lastError?.response?.data?.error?.message ||
    lastError?.message ||
    'Failed to get insights from Groq API';
  return res.status(502).json({ error: finalMsg, supportedModels: DEFAULT_MODELS });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Groq Insights API running on port ${PORT}`);
});
