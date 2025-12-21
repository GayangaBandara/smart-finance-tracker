import React from 'react';
import { fetchGroqInsights } from '../services/groqInsights';

export default function useAIInsights(transactions, { auto = true, debounce = 1500 } = {}) {
  const [insights, setInsights] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [lastUpdated, setLastUpdated] = React.useState(null);

  const cacheKey = React.useMemo(() => {
    try {
      return 'ai:insights:' + btoa(JSON.stringify(transactions || []));
    } catch (e) {
      return null;
    }
  }, [transactions]);

  const fetchFn = React.useCallback(
    async (signal) => {
      if (!transactions || transactions.length === 0) {
        setInsights('');
        setError('');
        setLastUpdated(null);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await fetchGroqInsights(transactions, { signal });
        setInsights(result);
        setLastUpdated(new Date().toISOString());
        try {
          if (cacheKey) {
            localStorage.setItem(cacheKey, JSON.stringify({ insights: result, ts: Date.now() }));
          }
        } catch (e) {
          // ignore localStorage errors
        }
      } catch (err) {
        setError(err?.message || 'Could not fetch AI insights.');
      } finally {
        setLoading(false);
      }
    },
    [transactions, cacheKey]
  );

  const refreshInsights = React.useCallback(() => {
    const controller = new AbortController();
    fetchFn(controller.signal);
    return () => controller.abort();
  }, [fetchFn]);

  // Try to load from recent cache, otherwise fetch (debounced)
  React.useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setInsights('');
      return;
    }

    // try from local cache first
    try {
      if (cacheKey) {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
        if (cached && Date.now() - cached.ts < 10 * 60 * 1000) {
          setInsights(cached.insights);
          setLastUpdated(new Date(cached.ts).toISOString());
          return;
        }
      }
    } catch (e) {
      // ignore
    }

    if (!auto) return;

    const controller = new AbortController();
    const handler = setTimeout(() => fetchFn(controller.signal), debounce);

    return () => {
      controller.abort();
      clearTimeout(handler);
    };
  }, [transactions, auto, debounce, fetchFn, cacheKey]);

  return { insights, loading, error, lastUpdated, refreshInsights };
}
