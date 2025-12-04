import { lazy, Suspense, ReactNode, ComponentType } from 'react';

/**
 * A fallback component shown while lazy-loaded components are loading
 */
const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

/**
 * Wraps a lazy-loaded component with a Suspense boundary
 * @param importFunc - Dynamic import function
 * @returns Wrapped component with Suspense fallback
 */
export const lazyLoad = (importFunc: () => Promise<{ default: ComponentType<any> }>) => {
  const Component = lazy(importFunc);

  return (props: any) => (
    <Suspense fallback={<LazyFallback />}>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyFallback;
