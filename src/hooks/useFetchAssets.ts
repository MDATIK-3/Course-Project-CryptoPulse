import { useCallback, useEffect, useState } from "react";
import type { Asset } from "../types";
import { fetchAssets } from "../api/coingecko";

interface UseFetchAssetsResult {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
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
      setError(err instanceof Error ? err.message : "Failed to load assets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  return { assets, loading, error, refetch: load };
}
