import type { Asset, WebSocketPriceMap } from "../../types";
import { AssetRow } from "./AssetRow";
import { TableRowSkeleton } from "../common/Skeleton";

interface AssetTableProps {
  assets: Asset[];
  loading: boolean;
  wsPrices: WebSocketPriceMap;
  onSelectAsset: (asset: Asset) => void;
}

function getWsKey(symbol: string): string {
  return `${symbol.toUpperCase()}USD`;
}

export function AssetTable({ assets, loading, wsPrices, onSelectAsset }: AssetTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="w-full min-w-150">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="w-12 py-3 pl-4 pr-2" />
            <th className="px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">#</th>
            <th className="px-2 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Name</th>
            <th className="px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Price</th>
            <th className="px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">24h</th>
            <th className="hidden px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400 md:table-cell">Market Cap</th>
            <th className="hidden px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400 lg:table-cell">Volume</th>
            <th className="hidden px-2 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400 xl:table-cell">7d Chart</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, i) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              index={i}
              livePrice={wsPrices[getWsKey(asset.symbol)]}
              onClick={() => onSelectAsset(asset)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
