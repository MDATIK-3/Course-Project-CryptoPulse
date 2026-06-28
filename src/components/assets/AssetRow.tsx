import type { Asset, KrakenTickerData } from "../../types";
import { formatPrice, formatLargeNumber } from "../../utils/formatters";
import { PriceChange } from "../common/PriceChange";
import { FavoriteButton } from "../favorites/FavoriteButton";
import { SparklineChart } from "./SparklineChart";

interface AssetRowProps {
  asset: Asset;
  livePrice?: KrakenTickerData;
  onClick: () => void;
  index: number;
}

export function AssetRow({ asset, livePrice, onClick, index }: AssetRowProps) {
  const price = livePrice?.last ?? asset.current_price;
  const change = livePrice?.changePercent ?? asset.price_change_percentage_24h;

  return (
    <tr
      onClick={onClick}
      style={{ animationDelay: `${index * 25}ms` }}
      className="group cursor-pointer border-b border-gray-50 transition-colors hover:bg-gray-50/80 dark:border-gray-800/50 dark:hover:bg-gray-800/30 animate-fade-in"
    >
      <td className="py-4 pl-4 pr-2">
        <FavoriteButton assetId={asset.id} />
      </td>
      <td className="px-2 py-4 text-xs tabular-nums text-gray-400">{asset.market_cap_rank}</td>
      <td className="px-2 py-4">
        <div className="flex items-center gap-3">
          <img
            src={asset.image}
            alt={asset.name}
            className="h-8 w-8 rounded-full"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{asset.name}</p>
            <p className="text-xs uppercase text-gray-400">{asset.symbol}</p>
          </div>
        </div>
      </td>
      <td className={`px-2 py-4 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-white ${livePrice ? "animate-price-pop" : ""}`}>
        {formatPrice(price)}
      </td>
      <td className="px-2 py-4 text-right">
        <PriceChange value={change} />
      </td>
      <td className="hidden px-2 py-4 text-right text-sm tabular-nums text-gray-500 dark:text-gray-400 md:table-cell">
        {formatLargeNumber(asset.market_cap)}
      </td>
      <td className="hidden px-2 py-4 text-right text-sm tabular-nums text-gray-500 dark:text-gray-400 lg:table-cell">
        {formatLargeNumber(asset.total_volume)}
      </td>
      <td className="hidden w-30 py-4 pl-2 pr-4 xl:table-cell">
        <SparklineChart data={asset.sparkline_in_7d?.price ?? []} />
      </td>
    </tr>
  );
}
