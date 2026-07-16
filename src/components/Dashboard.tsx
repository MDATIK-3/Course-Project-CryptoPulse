import { useMemo, useState, useEffect, useRef } from "react";
import type { Asset, SortConfig } from "../types";
import { useFetchAssets } from "../hooks/useFetchAssets";
import { useWebSocketPrices } from "../hooks/useWebSocketPrices";
import { useFavoritesContext } from "../context/FavoritesContext";
import { SearchBar } from "./common/SearchBar";
import { SortSelect } from "./common/SortSelect";
import { ViewToggle } from "./common/ViewToggle";
import { StatsBar } from "./common/StatsBar";
import { ErrorFallback } from "./common/ErrorFallback";
import { NotificationToast } from "./common/NotificationToast";
import { AssetGrid } from "./assets/AssetGrid";
import { AssetTable } from "./assets/AssetTable";
import { PriceChart } from "./charts/PriceChart";

interface DashboardProps {
  activeTab: string;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: "Top Cryptocurrencies",
  all: "All Assets",
  favorites: "Your Favorites",
};

// F-06: Format a relative "updated X ago" string
function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export function Dashboard({ activeTab }: DashboardProps) {
  const { assets, loading, loadingMore, error, hasMore, lastUpdated, refetch, loadMore } = useFetchAssets();
  const wsPrices = useWebSocketPrices();
  const { isFavorite } = useFavoritesContext();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>({ field: "market_cap_rank", direction: "asc" });
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // F-06: Relative time ticker — refreshes every 10s so "updated X ago" stays accurate
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    let result = [...assets];

    if (activeTab === "favorites") {
      result = result.filter((a) => isFavorite(a.id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const aVal = ((a[sort.field] as number | null) ?? 0);
      const bVal = ((b[sort.field] as number | null) ?? 0);
      return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [assets, search, sort, activeTab, isFavorite]);

  const displayAssets = activeTab === "dashboard" ? filtered.slice(0, 12) : filtered;

  // Load More ref for intersection observer (auto-load on scroll to bottom)
  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (error) {
    return <ErrorFallback message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-5">
      <NotificationToast prices={wsPrices} />

      {selectedAsset && (
        <PriceChart asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}

      {activeTab === "dashboard" && !loading && <StatsBar assets={assets} lastUpdated={lastUpdated} />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {TAB_TITLES[activeTab] ?? "Assets"}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {loading ? (
              <span>Loading…</span>
            ) : (
              <>
                <span>{`${displayAssets.length} ${displayAssets.length === 1 ? "asset" : "assets"}`}</span>
                {/* F-06: Last updated indicator */}
                {lastUpdated && (
                  <>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <span className="text-xs text-gray-400">Updated {formatRelativeTime(lastUpdated)}</span>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* R-05: SortSelect and ViewToggle are wrapped together so they never split on mobile */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-56">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex items-center gap-2">
            <SortSelect sort={sort} onChange={setSort} />
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </div>

      {displayAssets.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-800">
          {activeTab === "favorites" ? (
            <>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/30">
                <svg className="h-7 w-7 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">No favorites yet</p>
              <p className="mt-1 text-xs text-gray-400">Star some assets to see them here</p>
            </>
          ) : (
            <>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                <svg className="h-7 w-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">No results found</p>
              <p className="mt-1 text-xs text-gray-400">Try a different search term</p>
            </>
          )}
        </div>
      ) : view === "grid" ? (
        <AssetGrid
          assets={displayAssets}
          loading={loading}
          wsPrices={wsPrices}
          onSelectAsset={setSelectedAsset}
        />
      ) : (
        <AssetTable
          assets={displayAssets}
          loading={loading}
          wsPrices={wsPrices}
          onSelectAsset={setSelectedAsset}
        />
      )}

      {/* F-01: Load More button — shown on "all" tab when more pages exist */}
      {activeTab === "all" && !loading && !search.trim() && hasMore && (
        <div ref={loadMoreRef} className="flex justify-center pt-2 pb-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
          >
            {loadingMore ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 dark:border-gray-600 dark:border-t-indigo-400" />
                Loading…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Load More Assets
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
