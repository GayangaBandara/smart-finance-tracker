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
  'llama3-8b-8192',
  'mixtral-8x7b-8192',
  'llama3-70b-8192',
  'gemma-7b'
];

// Helper to call Groq with a specific model
async function callGroqModel(model, payload) {
  return axios.post(
    GROQ_API_URL,
    {
      model,
      messages: payload.messages
    },
    {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      }
    }
  );
}

app.get('/', (req, res) => {
  res.json({
    message: 'Finance Tracker Groq Insights API',
    version: '1.0.0',
    endpoints: {
      'POST /ai-insight': 'Get AI-powered financial insights from transactions (Groq)'
    }
  });
});

// Simple in-memory cache to reduce repeated requests for the same data
const insightsCache = new Map();

app.post('/ai-insight', async (req, res) => {
  const { transactions } = req.body;
  console.log(`[AI Insight] request received - transactions: ${Array.isArray(transactions) ? transactions.length : 'invalid'}`);

  if (!transactions || !Array.isArray(transactions)) {
    return res.status(400).json({ error: 'Invalid transactions data.' });
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

  const prompt = `Analyze the following user transactions and provide personalized saving tips, budget suggestions, and alert any unusual transactions.`;

  // Allow client to suggest model(s) via `model` or `models` in the request body
  const { model: requestedModel, models: requestedModels } = req.body;
  const attemptModels = Array.isArray(requestedModels) && requestedModels.length
    ? requestedModels
    : (requestedModel ? [requestedModel] : DEFAULT_MODELS);

  let lastError = null;
  for (const m of attemptModels) {
    try {
      console.log(`Trying Groq model: ${m}`);
      const response = await callGroqModel(m, {
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: `Transactions:\n${payloadStr}` }
        ]
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
  const finalMsg = lastError?.response?.data?.error?.message || lastError?.message || 'Failed to get insights from Groq API';
  return res.status(502).json({ error: finalMsg });

});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Groq Insights API running on port ${PORT}`);
});
