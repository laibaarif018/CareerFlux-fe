import { lazy, Suspense } from 'react';

const LazySampleReport = lazy(() => import('./sampleReport'));

const SampleReportWithSuspense = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans p-8">
          <div className="animate-pulse">
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-slate-200 dark:bg-slate-700 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <LazySampleReport />
    </Suspense>
  );
};

export default SampleReportWithSuspense;
