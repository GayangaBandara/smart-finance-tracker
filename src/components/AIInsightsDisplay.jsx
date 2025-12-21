import React from 'react';
import { motion } from 'framer-motion';
import CurrencyDisplay from './common/CurrencyDisplay';

export default function AIInsightsDisplay({ insights, loading, error }) {
  const [parsedData, setParsedData] = React.useState(null);

  React.useEffect(() => {
    if (insights) {
      try {
        // Try to parse JSON if it's a string
        const data = typeof insights === 'string' ? JSON.parse(insights) : insights;
        setParsedData(data);
      } catch (e) {
        // If parsing fails, keep as is
        setParsedData(null);
      }
    }
  }, [insights]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-100/50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-100/50';
      case 'low':
        return 'border-blue-300 bg-blue-100/50';
      default:
        return 'border-gray-300 bg-gray-100/50';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'unusual':
        return '⚠️';
      case 'excessive':
        return '🔴';
      case 'opportunity':
        return '💡';
      default:
        return '📌';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
        <p className="mt-3 text-gray-700">Analyzing your finances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100/50 border border-red-300 rounded-lg">
        <p className="text-red-800 font-semibold">⚠️ Unable to fetch insights</p>
        <p className="text-red-700 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!insights) {
    return <div className="text-gray-700 text-center py-6">No insights available yet.</div>;
  }

  // If we couldn't parse JSON, show raw text
  if (!parsedData) {
    return (
      <div className="bg-gray-100/50 p-4 rounded-lg border border-gray-300">
        <div className="text-black text-sm whitespace-pre-wrap">{insights}</div>
      </div>
    );
  }

  const data = parsedData;

  return (
    <div className="space-y-6">
      {/* Overview */}
      {data.overview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 border border-indigo-300/50 rounded-lg"
        >
          <h3 className="font-semibold text-indigo-800 mb-2">📊 Financial Overview</h3>
          <p className="text-black font-medium leading-relaxed">{data.overview}</p>
        </motion.div>
      )}

      {/* Health Score */}
      {data.healthScore !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gradient-to-r from-emerald-100/50 to-green-100/50 border border-emerald-300/50 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-emerald-800">💚 Financial Health Score</h3>
              <p className="text-sm text-gray-700 mt-1">Your overall financial wellness rating</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-emerald-800">{data.healthScore}</div>
              <div className="text-xs text-gray-700">/100</div>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-600 to-green-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(data.healthScore, 100)}%` }}
            ></div>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {data.recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 bg-gradient-to-r from-orange-100/50 to-red-100/50 border border-orange-300/50 rounded-lg"
        >
          <h3 className="font-semibold text-orange-800 mb-2">🎯 Top Priority Action</h3>
          <p className="text-black font-medium leading-relaxed">{data.recommendation}</p>
        </motion.div>
      )}

      {/* Tips */}
      {data.tips && Array.isArray(data.tips) && data.tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-black mb-3 flex items-center gap-2">💡 Saving Tips</h3>
          <div className="space-y-3">
            {data.tips.map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className={`p-4 rounded-lg border-l-4 bg-gray-50/50 ${getPriorityColor(tip.priority)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-black">{tip.title}</h4>
                    <p className="text-black text-sm mt-1 font-medium">{tip.description}</p>
                  </div>
                  {tip.potentialSavings && (
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="text-lg font-bold text-emerald-400">
                        <CurrencyDisplay amount={tip.potentialSavings} />
                      </div>
                      <div className="text-xs text-gray-700">potential savings</div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Spending Summary */}
      {data.spendingSummary &&
        Array.isArray(data.spendingSummary) &&
        data.spendingSummary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
              📈 Spending by Category
            </h3>
            <div className="space-y-3">
              {data.spendingSummary.map((category, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + idx * 0.05 }}
                  className="p-3 bg-gray-100/50 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-black">{category.category}</div>
                    <div className="text-right">
                      <div className="font-bold text-indigo-800">
                        <CurrencyDisplay amount={category.amount} />
                      </div>
                      <div className="text-xs text-gray-700">
                        {category.percentage?.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${Math.min(category.percentage || 0, 100)}%` }}
                    ></div>
                  </div>
                  {category.trend && (
                    <div className="text-xs text-gray-700 mt-1">
                      Trend:{' '}
                      <span className="text-black font-semibold capitalize">{category.trend}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      {/* Alerts */}
      {data.alerts && Array.isArray(data.alerts) && data.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
            🔔 Financial Alerts
          </h3>
          <div className="space-y-2">
            {data.alerts.map((alert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + idx * 0.05 }}
                className="p-3 bg-gray-100/50 rounded-lg border-l-2 border-orange-500"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{getAlertIcon(alert.type)}</span>
                  <div className="flex-1">
                    <p className="text-black">{alert.message}</p>
                    {alert.impact && (
                      <p className="text-xs text-gray-700 mt-1">
                        Impact:{' '}
                        <span className="text-orange-800 font-semibold">{alert.impact}/month</span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
