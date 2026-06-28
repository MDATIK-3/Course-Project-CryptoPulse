import type { SortConfig, SortField } from "../../types";

interface SortSelectProps {
  sort: SortConfig;
  onChange: (sort: SortConfig) => void;
}

const OPTIONS: { value: SortField; label: string }[] = [
  { value: "market_cap_rank", label: "Rank" },
  { value: "current_price", label: "Price" },
  { value: "market_cap", label: "Market Cap" },
  { value: "total_volume", label: "Volume" },
  { value: "price_change_percentage_24h", label: "24h %" },
];

export function SortSelect({ sort, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-1.5">
      <select
        value={sort.field}
        onChange={(e) => onChange({ ...sort, field: e.target.value as SortField })}
        className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition-all focus:border-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => onChange({ ...sort, direction: sort.direction === "asc" ? "desc" : "asc" })}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-500 transition-all hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white"
        aria-label="Toggle sort direction"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          {sort.direction === "asc" ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          )}
        </svg>
      </button>
    </div>
  );
}
