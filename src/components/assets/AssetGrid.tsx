import type { Asset, WebSocketPriceMap } from "../../types";
import { AssetCard } from "./AssetCard";
import { CardSkeleton } from "../common/Skeleton";

interface AssetGridProps {
  assets: Asset[];
  loading: boolean;
  wsPrices: WebSocketPriceMap;
  onSelectAsset: (asset: Asset) => void;
}

function getWsKey(symbol: string): string {
  return `${symbol.toUpperCase()}USD`;
}

export function AssetGrid({ assets, loading, wsPrices, onSelectAsset }: AssetGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset, i) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          index={i}
          livePrice={wsPrices[getWsKey(asset.symbol)]}
          onClick={() => onSelectAsset(asset)}
        />
      ))}
    </div>
  );
}
