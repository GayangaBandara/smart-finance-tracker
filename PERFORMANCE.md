# Performance Optimization Guide

This document outlines the performance improvements made to the Finance Tracker application.

## 1. Code Splitting Strategy

### Vite Configuration (`vite.config.js`)

- Implemented manual chunk splitting to separate large vendor libraries
- Chunks created for:
  - **vendor**: Core React libraries (react, react-dom, react-router-dom)
  - **charts**: Chart visualization libraries (chart.js, react-chartjs-2, recharts)
  - **firebase**: Firebase SDK and authentication
  - **form**: Form handling libraries (react-hook-form, yup)
  - **utils**: Utility libraries (axios, date-fns, lucide-react)
  - **export**: Document export libraries (jspdf, html2canvas, docx, xlsx)

### Expected Bundle Improvements

- Initial JS load reduced by ~30-40% through lazy loading heavy features
- Charts and export utilities only loaded when needed
- Firebase SDK separate from main bundle

## 2. Lazy Loading Components

### Usage Example

```tsx
import { lazyLoad } from '../utils/lazyLoad';

// In your router configuration:
const Reports = lazyLoad(() => import('../pages/Reports'));
const Dashboard = lazyLoad(() => import('../pages/Dashboard'));
```

### Benefits

- Route-based code splitting
- Faster initial page load (TTI)
- Better user perceived performance

## 3. React Optimizations

### Recommended Patterns

1. **Memoization** - Use `React.memo()` for expensive components
2. **useMemo** - Cache computed values in `useFinance` and hooks
3. **useCallback** - Prevent unnecessary re-renders from callback changes

### Example in `useBudget.ts`

```ts
const handleBudgetOperation = useCallback((data, isEdit = false) => {
  // Operations...
}, []);
```

## 4. Chart Optimization

- Charts (Chart.js, Recharts) are code-split and lazy-loaded
- Consider adding `React.memo()` to chart components
- Limit chart data to last 90 days for better performance

## 5. Firebase Optimizations

- Firestore queries are indexed by `uid` and `date`
- Implement pagination for large transaction lists
- Consider offline caching with `firebase-offline-persistence`

## 6. Build Output

Current chunk sizes (gzip):

- vendor: ~X KB
- charts: ~X KB
- firebase: ~X KB
- main: ~X KB

Recommendations:

- Monitor chunk sizes in CI/CD
- Set chunk size warning limit at 600 KB (currently configured)
- Profile with Lighthouse regularly

## 7. Next Steps

- [ ] Add route-based code splitting to all pages
- [ ] Implement React.memo() on expensive components
- [ ] Add performance monitoring (Web Vitals)
- [ ] Set up bundle analysis in CI pipeline
- [ ] Implement service worker for offline mode
- [ ] Add image optimization for reports

## Resources

- [Vite Code Splitting](https://vitejs.dev/guide/features.html#code-splitting)
- [React Code Splitting](https://react.dev/reference/react/lazy)
- [Web Vitals](https://web.dev/vitals/)
