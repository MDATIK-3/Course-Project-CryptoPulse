import { formatPrice, formatDate, formatTime } from "../../utils/formatters";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: number;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length || !label) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
      <p className="text-[10px] text-gray-400">
        {formatDate(label)} {formatTime(label)}
      </p>
      <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-white">
        {formatPrice(payload[0].value)}
      </p>
    </div>
  );
}
