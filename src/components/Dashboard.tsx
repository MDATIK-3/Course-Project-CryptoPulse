import { useMemo, useState } from "react";
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

export function Dashboard({ activeTab }: DashboardProps) {
  const { assets, loading, error, refetch } = useFetchAssets();
  const wsPrices = useWebSocketPrices();
  const { isFavorite } = useFavoritesContext();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>({ field: "market_cap_rank", direction: "asc" });
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

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
      const aVal = a[sort.field] ?? 0;
      const bVal = b[sort.field] ?? 0;
      return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [assets, search, sort, activeTab, isFavorite]);

  const displayAssets = activeTab === "dashboard" ? filtered.slice(0, 12) : filtered;

  if (error) {
    return <ErrorFallback message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-5">
      <NotificationToast prices={wsPrices} />

      {selectedAsset && (
        <PriceChart asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}

      {activeTab === "dashboard" && !loading && <StatsBar assets={assets} />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {TAB_TITLES[activeTab] ?? "Assets"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? "Loading..." : `${displayAssets.length} ${displayAssets.length === 1 ? "asset" : "assets"}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-56">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <SortSelect sort={sort} onChange={setSort} />
          <ViewToggle view={view} onChange={setView} />
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
    </div>
  );
}
