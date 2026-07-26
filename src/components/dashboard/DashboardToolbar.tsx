import type { SortConfig } from "../../types";
import { SearchBar } from "../common/SearchBar";
import { SortSelect } from "../common/SortSelect";
import { ViewToggle } from "../common/ViewToggle";

interface DashboardToolbarProps {
  title: string;
  assetCount: number;
  loading: boolean;
  lastUpdatedLabel: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortConfig;
  onSortChange: (config: SortConfig) => void;
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
}

export function DashboardToolbar({
  title,
  assetCount,
  loading,
  lastUpdatedLabel,
  search,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: DashboardToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {loading ? (
            <span>Loading…</span>
          ) : (
            <>
              <span>{`${assetCount} ${assetCount === 1 ? "asset" : "assets"}`}</span>
              {lastUpdatedLabel && (
                <>
                  <span className="text-gray-300 dark:text-gray-700">·</span>
                  <span className="text-xs text-gray-400">Updated {lastUpdatedLabel}</span>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-56">
          <SearchBar value={search} onChange={onSearchChange} />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect sort={sort} onChange={onSortChange} />
          <ViewToggle view={view} onChange={onViewChange} />
        </div>
      </div>
    </div>
  );
}
