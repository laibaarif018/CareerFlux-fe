// components/Container.tsx
export function Container({ children, className = '' }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`px-4 md:px-10 max-w-6xl mx-auto ${className}`}>
      {children}
    </div>
  );
}