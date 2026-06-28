interface ErrorFallbackProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorFallback({ message, onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50/50 px-6 py-12 text-center dark:border-red-900/30 dark:bg-red-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
        <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-red-700 dark:text-red-400">Something went wrong</p>
        <p className="mt-1 text-xs text-red-500/70 dark:text-red-400/50">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
