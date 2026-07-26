import { useRef } from "react";
import type { Asset, WebSocketPriceMap } from "../../types";
import { AssetGrid } from "../assets/AssetGrid";
import { AssetTable } from "../assets/AssetTable";

interface AssetListSectionProps {
  assets: Asset[];
  loading: boolean;
  loadingMore: boolean;
  wsPrices: WebSocketPriceMap;
  view: "grid" | "table";
  activeTab: string;
  hasMore: boolean;
  searchActive: boolean;
  onSelectAsset: (asset: Asset) => void;
  onLoadMore: () => void;
}

function EmptyState({ activeTab }: { activeTab: string }) {
  if (activeTab === "favorites") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-800">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/30">
          <svg
            className="h-7 w-7 text-amber-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">No favorites yet</p>
        <p className="mt-1 text-xs text-gray-400">Star some assets to see them here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-800">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <svg
          className="h-7 w-7 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">No results found</p>
      <p className="mt-1 text-xs text-gray-400">Try a different search term</p>
    </div>
  );
}

export function AssetListSection({
  assets,
  loading,
  loadingMore,
  wsPrices,
  view,
  activeTab,
  hasMore,
  searchActive,
  onSelectAsset,
  onLoadMore,
}: AssetListSectionProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (assets.length === 0 && !loading) {
    return <EmptyState activeTab={activeTab} />;
  }

  return (
    <>
      {view === "grid" ? (
        <AssetGrid
          assets={assets}
          loading={loading}
          wsPrices={wsPrices}
          onSelectAsset={onSelectAsset}
        />
      ) : (
        <AssetTable
          assets={assets}
          loading={loading}
          wsPrices={wsPrices}
          onSelectAsset={onSelectAsset}
        />
      )}

      {activeTab === "all" && !loading && !searchActive && hasMore && (
        <div ref={loadMoreRef} className="flex justify-center pt-2 pb-4">
          <button
            onClick={onLoadMore}
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
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Load More Assets
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
