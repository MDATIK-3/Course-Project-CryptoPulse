import { useCallback, useEffect, useRef, useState } from "react";
import type { Asset } from "../types";
import { fetchAssets } from "../api/coingecko";

interface UseFetchAssetsResult {
  assets: Asset[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  lastUpdated: Date | null;
  refetch: () => void;
  loadMore: () => void;
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

const PER_PAGE = 50;

export function useFetchAssets(): UseFetchAssetsResult {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pageRef = useRef(1);

  // Load the first page (or refresh)
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAssets(1, PER_PAGE);
      setAssets(data);
      pageRef.current = 1;
      setHasMore(data.length === PER_PAGE);
      setLastUpdated(new Date());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // F-01: Load the next page and append to existing assets
  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const data = await fetchAssets(nextPage, PER_PAGE);
      setAssets((prev) => [...prev, ...data]);
      pageRef.current = nextPage;
      setHasMore(data.length === PER_PAGE);
    } catch (err) {
      // Silently ignore load-more failures — existing data stays visible
      console.warn("Load more failed:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // Refresh every 90 seconds to stay within free-tier rate limits
    const interval = setInterval(load, 90000);
    return () => clearInterval(interval);
  }, [load]);

  return { assets, loading, loadingMore, error, hasMore, lastUpdated, refetch: load, loadMore };
}
