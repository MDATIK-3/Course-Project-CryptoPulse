import { useMemo, useState } from "react";
import type { Asset, SortConfig } from "../types";
import { useFavoritesContext } from "../context/FavoritesContext";

export interface UseDashboardFiltersResult {
  search: string;
  setSearch: (value: string) => void;
  sort: SortConfig;
  setSort: (config: SortConfig) => void;
  filtered: Asset[];
}

export function useDashboardFilters(assets: Asset[], activeTab: string): UseDashboardFiltersResult {
  const { isFavorite } = useFavoritesContext();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>({ field: "market_cap_rank", direction: "asc" });

  const filtered = useMemo(() => {
    let result = [...assets];

    if (activeTab === "favorites") {
      result = result.filter((a) => isFavorite(a.id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const aVal = (a[sort.field] as number | null) ?? 0;
      const bVal = (b[sort.field] as number | null) ?? 0;
      return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [assets, search, sort, activeTab, isFavorite]);

  return { search, setSearch, sort, setSort, filtered };
}
