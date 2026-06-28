import { formatPercent } from "../../utils/formatters";

interface PriceChangeProps {
  value: number;
  className?: string;
}

export function PriceChange({ value, className = "" }: PriceChangeProps) {
  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold ${
        isPositive
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          : "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
      } ${className}`}
    >
      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={isPositive ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"}
        />
      </svg>
      {formatPercent(value)}
    </span>
  );
}
