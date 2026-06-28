import { useCallback, useEffect, useRef, useState } from "react";
import type { PricePoint, Timeframe } from "../types";
import { fetchMarketChart } from "../api/coingecko";

interface UseAssetHistoryResult {
  history: PricePoint[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAssetHistory(assetId: string | null, days: Timeframe): UseAssetHistoryResult {
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Record<string, PricePoint[]>>({});

  const load = useCallback(async () => {
    if (!assetId) return;
    const cacheKey = `${assetId}-${days}`;
    if (cache.current[cacheKey]) {
      setHistory(cache.current[cacheKey]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMarketChart(assetId, days);
      cache.current[cacheKey] = data;
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [assetId, days]);

  useEffect(() => {
    load();
  }, [load]);

  return { history, loading, error, refetch: load };
}
