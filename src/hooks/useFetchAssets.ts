import { useCallback, useEffect, useState } from "react";
import type { Asset } from "../types";
import { fetchAssets } from "../api/coingecko";

interface UseFetchAssetsResult {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function friendlyError(err: unknown): string {
  if (err instanceof Error) {
    if (err.message.includes("429")) {
      return "CoinGecko API rate limit reached. Retrying in a moment…";
    }
    return err.message;
  }
  return "Failed to load assets";
}

export function useFetchAssets(): UseFetchAssetsResult {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAssets();
      setAssets(data);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Refresh every 90 seconds to stay within free-tier rate limits
    const interval = setInterval(load, 90000);
    return () => clearInterval(interval);
  }, [load]);

  return { assets, loading, error, refetch: load };
}
