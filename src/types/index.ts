export interface Asset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
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
