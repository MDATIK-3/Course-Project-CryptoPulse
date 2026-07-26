import { useState, useEffect } from "react";
import type { Asset, WebSocketPriceMap } from "../types";
import { useFetchAssets } from "../hooks/useFetchAssets";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { StatsBar } from "./common/StatsBar";
import { ErrorFallback } from "./common/ErrorFallback";
import { NotificationToast } from "./common/NotificationToast";
import { PriceChart } from "./charts/PriceChart";
import { DashboardToolbar } from "./dashboard/DashboardToolbar";
import { AssetListSection } from "./dashboard/AssetListSection";

interface DashboardProps {
  activeTab: string;

  wsPrices: WebSocketPriceMap;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: "Top Cryptocurrencies",
  all: "All Assets",
  favorites: "Your Favorites",
};

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export function Dashboard({ activeTab, wsPrices }: DashboardProps) {
  const { assets, loading, loadingMore, error, hasMore, lastUpdated, refetch, loadMore } =
    useFetchAssets();

  const { search, setSearch, sort, setSort, filtered } = useDashboardFilters(assets, activeTab);

  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, []);

  const displayAssets = activeTab === "dashboard" ? filtered.slice(0, 12) : filtered;
  const lastUpdatedLabel = lastUpdated ? formatRelativeTime(lastUpdated) : null;

  if (error) {
    return <ErrorFallback message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-5">
      <NotificationToast prices={wsPrices} />

      {selectedAsset && <PriceChart asset={selectedAsset} onClose={() => setSelectedAsset(null)} />}

      {activeTab === "dashboard" && !loading && (
        <StatsBar assets={assets} lastUpdated={lastUpdated} />
      )}

      <DashboardToolbar
        title={TAB_TITLES[activeTab] ?? "Assets"}
        assetCount={displayAssets.length}
        loading={loading}
        lastUpdatedLabel={lastUpdatedLabel}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
      />

      <AssetListSection
        assets={displayAssets}
        loading={loading}
        loadingMore={loadingMore}
        wsPrices={wsPrices}
        view={view}
        activeTab={activeTab}
        hasMore={hasMore}
        searchActive={search.trim().length > 0}
        onSelectAsset={setSelectedAsset}
        onLoadMore={loadMore}
      />
    </div>
  );
}
