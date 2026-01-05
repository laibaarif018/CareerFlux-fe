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

export default Shimmer;