import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Asset, Timeframe } from "../../types";
import { useAssetHistory } from "../../hooks/useAssetHistory";
import { formatPrice, formatLargeNumber, formatDate, formatTime } from "../../utils/formatters";
import { TimeframeToggle } from "./TimeframeToggle";
import { ChartTooltip } from "./ChartTooltip";
import { ChartSkeleton } from "../common/Skeleton";
import { ErrorFallback } from "../common/ErrorFallback";
import { PriceChange } from "../common/PriceChange";

interface PriceChartProps {
  asset: Asset;
  onClose: () => void;
}

export function PriceChart({ asset, onClose }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1");
  const { history, loading, error, refetch } = useAssetHistory(asset.id, timeframe);

  const isUp = history.length >= 2 && history[history.length - 1].price >= history[0].price;
  const color = isUp ? "#10b981" : "#ef4444";

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center animate-fade-in-fast">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl rounded-t-3xl border border-gray-200 bg-white p-5 shadow-2xl sm:m-4 sm:rounded-3xl sm:p-8 dark:border-gray-800 dark:bg-gray-900 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={asset.image} alt={asset.name} className="h-12 w-12 rounded-full ring-2 ring-gray-100 dark:ring-gray-800" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{asset.name}</h2>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {asset.symbol}
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                  {formatPrice(asset.current_price)}
                </span>
                <PriceChange value={asset.price_change_percentage_24h} />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
            <p className="text-[11px] text-gray-400">Market Cap</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">{formatLargeNumber(asset.market_cap)}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
            <p className="text-[11px] text-gray-400">Volume 24h</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">{formatLargeNumber(asset.total_volume)}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
            <p className="text-[11px] text-gray-400">Rank</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">#{asset.market_cap_rank}</p>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Price Chart</h3>
          <TimeframeToggle value={timeframe} onChange={setTimeframe} />
        </div>

        {loading && <ChartSkeleton />}
        {error && <ErrorFallback message={error} onRetry={refetch} />}

        {!loading && !error && history.length > 0 && (
          <div className="rounded-xl bg-gray-50/50 p-2 dark:bg-gray-800/20">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id={`grad-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(t) => (timeframe === "1" ? formatTime(t) : formatDate(t))}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => formatPrice(v)}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={75}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#grad-${asset.id})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
