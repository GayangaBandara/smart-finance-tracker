// Groq AI Insights Service
const DEFAULT_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.1-70b-versatile',
  'mixtral-8x7b-32k',
  'gemma-2-9b-it',
];

export async function fetchGroqInsights(transactions, { signal, model, models } = {}) {
  // Basic validation to prevent malformed requests from the app
  if (!transactions || !Array.isArray(transactions)) {
    throw new Error('Invalid transactions argument: expected an array of transactions');
  }

  if (!Array.isArray(models) || models.length === 0) {
    models = DEFAULT_MODELS;
  }
  const attemptModels = model ? [model] : models;

  const INSIGHTS_API_URL =
    import.meta.env.VITE_INSIGHTS_API_URL || 'http://localhost:5001/ai-insight';

  // If external signal aborts, we should abort attempts.
  const overallController = new AbortController();
  if (signal) {
    signal.addEventListener('abort', () => overallController.abort());
  }

  const tryWithModel = async (modelName) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    overallController.signal.addEventListener('abort', () => controller.abort());
    try {
      console.debug('Posting AI insights request', {
        model: modelName,
        transactionsLength: transactions.length,
      });
      const res = await fetch(INSIGHTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, model: modelName }),
        signal: controller.signal,
      });

      if (!res.ok) {
        // Try to parse JSON to inspect Groq error codes
        let parsed;
        try {
          parsed = await res.json();
        } catch (e) {
          // ignore parse errors
        }

        const message =
          parsed?.error?.message ||
          parsed?.error ||
          parsed?.message ||
          `Failed to fetch insights: ${res.status}`;
        const code = parsed?.error?.code || parsed?.code;

        if (code === 'model_decommissioned') {
          // Throw special object to let caller try next model
          const err = new Error(message);
          err.code = 'model_decommissioned';
          throw err;
        }

        throw new Error(message);
      }

      const data = await res.json();
      return data;
    } finally {
      clearTimeout(timeout);
    }
  };

  let lastErr;
  for (const m of attemptModels) {
    if (overallController.signal.aborted) throw new Error('Request aborted or timed out');
    try {
      const data = await tryWithModel(m);
      // Keep compatibility: return just the insights (as existing code expects)
      return data.insights;
    } catch (err) {
      if (err?.code === 'model_decommissioned') {
        // try next model
        console.warn(`Groq model "${m}" decommissioned, trying next model. Reason: ${err.message}`);
        lastErr = new Error(`Model "${m}" decommissioned: ${err.message}`);
        continue;
      }
      if (err?.name === 'AbortError') {
        throw new Error('Request aborted or timed out');
      }
      lastErr = err;
      break;
    }
  }

  throw lastErr || new Error('Failed to fetch insights from any model');
}
