import type { Asset, KrakenTickerData } from "../types";

export interface LiveAssetPrice {
  price: number | null;
  change: number;
  isUp: boolean;
}

export function useLiveAssetPrice(
  asset: Asset,
  livePrice?: KrakenTickerData
): LiveAssetPrice {
  const price = livePrice?.last ?? asset.current_price;
  const change = livePrice?.changePercent ?? asset.price_change_percentage_24h ?? 0;
  const isUp = change >= 0;
  return { price, change, isUp };
}
