import React from 'react';

interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

// Base Shimmer wrapper with animation
const Shimmer: React.FC<ShimmerProps> = ({ className = '', children }) => {
  return (
    <div 
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
      {children}
    </div>
  );
};

// Shimmer variants for different content types
export const ShimmerText: React.FC<{ className?: string; width?: string }> = ({
  className = '',
  width = '100%'
}) => (
  <Shimmer className={`h-4 rounded-md ${className}`}>
    <div style={{ width }} />
  </Shimmer>
);

export const ShimmerTitle: React.FC<{ className?: string; width?: string }> = ({
  className = '',
  width = '60%'
}) => (
  <Shimmer className={`h-6 rounded-md ${className}`}>
    <div style={{ width }} />
  </Shimmer>
);

export const ShimmerParagraph: React.FC<{ className?: string; lines?: number }> = ({
  className = '',
  lines = 3
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <ShimmerText 
        key={i} 
        width={i === lines - 1 ? '80%' : '100%'} 
      />
    ))}
  </div>
);

export const ShimmerCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 ${className}`}>
    <ShimmerTitle className="mb-4" />
    <ShimmerParagraph lines={3} className="mb-4" />
    <div className="flex space-x-3">
      <Shimmer className="w-10 h-10 rounded-full" />
      <Shimmer className="w-10 h-10 rounded-full" />
      <Shimmer className="w-10 h-10 rounded-full" />
    </div>
  </div>
);

export const ShimmerAvatar: React.FC<{ className?: string; size?: string }> = ({ 
  className = '',
  size = 'w-10 h-10'
}) => (
  <Shimmer className={`rounded-full ${size} ${className}`} />
);

export const ShimmerButton: React.FC<{ className?: string; width?: string }> = ({ 
  className = '',
  width = 'w-32'
}) => (
  <Shimmer className={`h-10 rounded-lg ${width} ${className}`} />
);

export const ShimmerInput: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <Shimmer className="h-4 w-24 rounded-md" />
    <Shimmer className="h-12 w-full rounded-lg" />
  </div>
);

export const ShimmerSection: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
      <Shimmer className="w-8 h-8 rounded-lg" />
      <Shimmer className="h-6 w-40 rounded-md" />
    </div>
    <div className="space-y-4">
      <ShimmerParagraph lines={2} />
    </div>
  </div>
);
export const ShimmerBadge: React.FC<{ className?: string }> = ({ 
  className = ''
}) => (
  <Shimmer className={`h-6 w-16 rounded-full ${className}`} />
);
export const ShimmerTableRow: React.FC = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <ShimmerAvatar />
        <div className="space-y-2">
          <ShimmerText width="128px" />
          <ShimmerText width="96px" className="h-3" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <ShimmerText width="96px" />
    </td>
    <td className="px-6 py-4">
      <ShimmerBadge />
    </td>
    <td className="px-6 py-4">
      <ShimmerText width="112px" />
    </td>
    <td className="px-6 py-4">
      <ShimmerText width="96px" />
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center justify-end gap-2">
        <ShimmerButton />
        <ShimmerButton width="w-24" />
      </div>
    </td>
  </tr>
);
export const ShimmerProfileForm: React.FC = () => (
  <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
    {/* Header */}
    <div className="flex flex-col gap-2">
      <Shimmer className="h-9 w-72 rounded-lg" />
      <Shimmer className="h-5 w-96 rounded" />
    </div>

    {/* Company Information Section */}
    <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Shimmer className="w-10 h-10 rounded-xl" />
          <div className="flex-1">
            <Shimmer className="h-5 w-48 rounded mb-2" />
            <Shimmer className="h-3 w-64 rounded" />
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-6">
        {/* Logo Upload */}
        <div>
          <Shimmer className="h-4 w-32 rounded mb-3" />
          <Shimmer className="h-48 w-full rounded-2xl" />
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Shimmer className="h-4 w-28 rounded mb-2" />
              <Shimmer className="h-11 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <Shimmer className="h-4 w-40 rounded mb-2" />
          <Shimmer className="h-24 w-full rounded-lg" />
        </div>
      </div>
    </section>

    {/* Primary Contact Section */}
    <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Shimmer className="w-10 h-10 rounded-xl" />
          <div className="flex-1">
            <Shimmer className="h-5 w-36 rounded mb-2" />
            <Shimmer className="h-3 w-56 rounded" />
          </div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(2)].map((_, i) => (
          <div key={i}>
            <Shimmer className="h-4 w-28 rounded mb-2" />
            <Shimmer className="h-11 w-full rounded-lg" />
          </div>
        ))}
        <div className="md:col-span-2">
          <Shimmer className="h-4 w-28 rounded mb-2" />
          <Shimmer className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </section>

    {/* Action Buttons */}
    <div className="flex justify-end gap-3 pb-8">
      <Shimmer className="h-11 w-28 rounded-xl" />
      <Shimmer className="h-11 w-40 rounded-xl" />
    </div>
  </div>
);

// Dashboard Stats Shimmer
export const ShimmerDashboardStats: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Shimmer className="w-12 h-12 rounded-lg" />
          <div className="flex-1">
            <Shimmer className="h-4 w-24 rounded mb-2" />
            <Shimmer className="h-8 w-16 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Dashboard Jobs Table Shimmer
export const ShimmerDashboardTable: React.FC = () => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <Shimmer className="h-6 w-48 rounded" />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Job Title
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Location
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Experience
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Type
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Applicants
            </th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              <td className="px-6 py-4">
                <Shimmer className="h-5 w-40 rounded mb-2" />
                <Shimmer className="h-4 w-32 rounded" />
              </td>
              <td className="px-6 py-4">
                <Shimmer className="h-4 w-28 rounded" />
              </td>
              <td className="px-6 py-4">
                <Shimmer className="h-6 w-16 rounded-full" />
              </td>
              <td className="px-6 py-4">
                <Shimmer className="h-6 w-20 rounded-full" />
              </td>
              <td className="px-6 py-4">
                <Shimmer className="h-4 w-12 rounded" />
              </td>
              <td className="px-6 py-4">
                <Shimmer className="h-9 w-20 rounded-lg" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
export default Shimmer;