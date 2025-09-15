import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Loading fallback component
const LoadingFallback = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      <span className="text-gray-600">{message}</span>
    </div>
  </div>
);

// Higher-order component for lazy loading
export const withLazyLoading = (importFunc, fallbackMessage) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Pre-configured lazy loaded components for heavy modules
export const LazyCharts = withLazyLoading(
  () => import('./Charts'),
  "Loading charts..."
);

export const LazyAnalyticsTab = withLazyLoading(
  () => import('./AnalyticsTab'),
  "Loading analytics..."
);

export const LazyWorkflowTab = withLazyLoading(
  () => import('./WorkflowTab'),
  "Loading workflow settings..."
);

export const LazyFormSettingsTab = withLazyLoading(
  () => import('./FormSettingsTab'),
  "Loading form settings..."
);

export const LazySetupTab = withLazyLoading(
  () => import('./SetupTab'),
  "Loading setup..."
);

export default LoadingFallback;
