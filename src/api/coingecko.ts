import type { Asset, PricePoint, Timeframe } from "../types";
import { COINGECKO_BASE } from "../utils/constants";

export async function fetchAssets(page = 1, perPage = 50): Promise<Asset[]> {
  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch assets: ${res.status}`);
  return res.json();
}

export async function fetchMarketChart(id: string, days: Timeframe): Promise<PricePoint[]> {
  const url = `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch chart data: ${res.status}`);
  const json: { prices: [number, number][] } = await res.json();
  return json.prices.map(([time, price]) => ({ time, price }));
}
