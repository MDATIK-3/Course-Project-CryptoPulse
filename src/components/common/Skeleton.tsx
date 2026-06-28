interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full!" />
          <div>
            <Skeleton className="mb-1.5 h-4 w-20" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
        <Skeleton className="h-5 w-5 rounded-full!" />
      </div>
      <Skeleton className="mb-2 h-7 w-28" />
      <Skeleton className="mb-4 h-4 w-16" />
      <Skeleton className="mb-3 h-10 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-gray-50 px-4 py-4 dark:border-gray-800/50">
      <Skeleton className="h-4 w-4 rounded-full!" />
      <Skeleton className="h-4 w-6" />
      <Skeleton className="h-8 w-8 rounded-full!" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="ml-auto h-4 w-20" />
      <Skeleton className="h-4 w-14" />
      <Skeleton className="hidden h-4 w-20 md:block" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400" />
        <span className="text-sm text-gray-400">Loading chart...</span>
      </div>
    </div>
  );
}
