import type { Asset } from "../../types";
import { formatLargeNumber } from "../../utils/formatters";

interface StatsBarProps {
  assets: Asset[];
}

interface StatItemProps {
  label: string;
  value: string;
  icon: string;
  color: string;
  bg: string;
}

function StatItem({ label, value, icon, color, bg }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        <svg className={`h-5 w-5 ${color}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-0.5 text-base font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export function StatsBar({ assets }: StatsBarProps) {
  const totalMarketCap = assets.reduce((sum, a) => sum + (a.market_cap || 0), 0);
  const totalVolume = assets.reduce((sum, a) => sum + (a.total_volume || 0), 0);
  const gainers = assets.filter((a) => a.price_change_percentage_24h > 0).length;
  const losers = assets.filter((a) => a.price_change_percentage_24h < 0).length;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-fade-in">
      <StatItem
        label="Market Cap"
        value={formatLargeNumber(totalMarketCap)}
        icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        color="text-indigo-600 dark:text-indigo-400"
        bg="bg-indigo-50 dark:bg-indigo-950/50"
      />
      <StatItem
        label="24h Volume"
        value={formatLargeNumber(totalVolume)}
        icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        color="text-sky-600 dark:text-sky-400"
        bg="bg-sky-50 dark:bg-sky-950/50"
      />
      <StatItem
        label="Gainers"
        value={`${gainers} assets`}
        icon="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        color="text-emerald-600 dark:text-emerald-400"
        bg="bg-emerald-50 dark:bg-emerald-950/50"
      />
      <StatItem
        label="Losers"
        value={`${losers} assets`}
        icon="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
        color="text-red-500 dark:text-red-400"
        bg="bg-red-50 dark:bg-red-950/50"
      />
    </div>
  );
}
