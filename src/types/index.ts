export interface Asset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
  sparkline_in_7d: {
    price: number[];
  } | null;
}

export interface PricePoint {
  time: number;
  price: number;
}

export interface KrakenTickerData {
  symbol: string;
  last: number;
  volume: number;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
}

export interface WebSocketPriceMap {
  [symbol: string]: KrakenTickerData;
}

export type Timeframe = "1" | "7" | "30";

export type SortField = "market_cap_rank" | "current_price" | "market_cap" | "total_volume" | "price_change_percentage_24h";

export type SortDirection = "asc" | "desc";

export type Theme = "dark" | "light";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
