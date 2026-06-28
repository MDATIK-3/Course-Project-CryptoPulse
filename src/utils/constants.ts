export const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export const KRAKEN_WS_URL = "wss://ws.kraken.com/v2";

export const TRACKED_PAIRS = [
  "BTC/USD",
  "ETH/USD",
  "SOL/USD",
  "XRP/USD",
  "ADA/USD",
  "DOGE/USD",
  "DOT/USD",
  "AVAX/USD",
  "LINK/USD",
  "BNB/USD",
];

export const SYMBOL_TO_GECKO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  DOT: "polkadot",
  AVAX: "avalanche-2",
  LINK: "chainlink",
  BNB: "binancecoin",
};

export const TIMEFRAME_OPTIONS: { label: string; value: "1" | "7" | "30" }[] = [
  { label: "24H", value: "1" },
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
];

export const FAVORITES_KEY = "cryptopulse_favorites";

export const THEME_KEY = "cryptopulse_theme";
