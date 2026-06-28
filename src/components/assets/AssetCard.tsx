import type { Asset, KrakenTickerData } from "../../types";
import { formatPrice, formatLargeNumber } from "../../utils/formatters";
import { PriceChange } from "../common/PriceChange";
import { FavoriteButton } from "../favorites/FavoriteButton";
import { SparklineChart } from "./SparklineChart";

interface AssetCardProps {
  asset: Asset;
  livePrice?: KrakenTickerData;
  onClick: () => void;
  index: number;
}

export function AssetCard({ asset, livePrice, onClick, index }: AssetCardProps) {
  const price = livePrice?.last ?? asset.current_price;
  const change = livePrice?.changePercent ?? asset.price_change_percentage_24h;
  const isUp = change >= 0;

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${index * 40}ms` }}
      className="group relative cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800 dark:hover:shadow-indigo-500/5 animate-fade-in"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={asset.image}
            alt={asset.name}
            className="h-10 w-10 rounded-full ring-2 ring-gray-100 dark:ring-gray-800"
            loading="lazy"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{asset.name}</h3>
            <div className="flex items-center gap-1.5">
              <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {asset.symbol}
              </span>
              <span className="text-[10px] text-gray-400">#{asset.market_cap_rank}</span>
            </div>
          </div>
        </div>
        <FavoriteButton assetId={asset.id} />
      </div>

      <div className="mb-1">
        <span className={`text-xl font-bold text-gray-900 dark:text-white ${livePrice ? "animate-price-pop" : ""}`}>
          {formatPrice(price)}
        </span>
      </div>

      <div className="mb-4">
        <PriceChange value={change} />
      </div>

      <div className="mb-4 h-12 opacity-70 transition-opacity group-hover:opacity-100">
        <SparklineChart data={asset.sparkline_in_7d?.price ?? []} />
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 pt-3 dark:border-gray-800">
        <div>
          <p className="text-[10px] text-gray-400">Market Cap</p>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{formatLargeNumber(asset.market_cap)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400">Volume 24h</p>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{formatLargeNumber(asset.total_volume)}</p>
        </div>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 h-0.5 rounded-b-2xl opacity-0 transition-opacity group-hover:opacity-100 ${
          isUp ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
    </div>
  );
}
