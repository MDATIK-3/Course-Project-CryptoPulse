import { describe, it, expect } from "vitest";
import type { Asset, SortConfig } from "../types";

function filterBySearch(assets: Asset[], search: string): Asset[] {
  if (!search.trim()) return assets;
  const q = search.toLowerCase();
  return assets.filter(
    (a) => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
  );
}

function sortAssets(assets: Asset[], sort: SortConfig): Asset[] {
  return [...assets].sort((a, b) => {
    const aVal = (a[sort.field] as number | null) ?? 0;
    const bVal = (b[sort.field] as number | null) ?? 0;
    return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
  });
}

const BTC: Asset = {
  id: "bitcoin",
  symbol: "BTC",
  name: "Bitcoin",
  image: "",
  current_price: 65000,
  market_cap: 1_200_000_000_000,
  market_cap_rank: 1,
  total_volume: 30_000_000_000,
  price_change_percentage_24h: 2.5,
  sparkline_in_7d: null,
};

const ETH: Asset = {
  id: "ethereum",
  symbol: "ETH",
  name: "Ethereum",
  image: "",
  current_price: 3500,
  market_cap: 420_000_000_000,
  market_cap_rank: 2,
  total_volume: 15_000_000_000,
  price_change_percentage_24h: -1.2,
  sparkline_in_7d: null,
};

const DOGE: Asset = {
  id: "dogecoin",
  symbol: "DOGE",
  name: "Dogecoin",
  image: "",
  current_price: 0.12,
  market_cap: 17_000_000_000,
  market_cap_rank: 8,
  total_volume: 800_000_000,
  price_change_percentage_24h: 5.0,
  sparkline_in_7d: null,
};

const ASSETS = [BTC, ETH, DOGE];

describe("filterBySearch", () => {
  it("returns all assets when search is empty", () => {
    expect(filterBySearch(ASSETS, "")).toHaveLength(3);
  });

  it("returns all assets when search is only whitespace", () => {
    expect(filterBySearch(ASSETS, "   ")).toHaveLength(3);
  });

  it("filters by full name (case-insensitive)", () => {
    const result = filterBySearch(ASSETS, "bitcoin");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("bitcoin");
  });

  it("filters by partial name", () => {
    const result = filterBySearch(ASSETS, "ethe");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ethereum");
  });

  it("filters by symbol (case-insensitive)", () => {
    const result = filterBySearch(ASSETS, "doge");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("dogecoin");
  });

  it("returns empty array when no match", () => {
    expect(filterBySearch(ASSETS, "zzz")).toHaveLength(0);
  });
});

describe("sortAssets", () => {
  it("sorts by market_cap_rank ascending", () => {
    const sorted = sortAssets([DOGE, ETH, BTC], {
      field: "market_cap_rank",
      direction: "asc",
    });
    expect(sorted.map((a) => a.id)).toEqual(["bitcoin", "ethereum", "dogecoin"]);
  });

  it("sorts by market_cap_rank descending", () => {
    const sorted = sortAssets([BTC, ETH, DOGE], {
      field: "market_cap_rank",
      direction: "desc",
    });
    expect(sorted.map((a) => a.id)).toEqual(["dogecoin", "ethereum", "bitcoin"]);
  });

  it("sorts by current_price descending", () => {
    const sorted = sortAssets(ASSETS, { field: "current_price", direction: "desc" });
    expect(sorted[0].id).toBe("bitcoin");
    expect(sorted[2].id).toBe("dogecoin");
  });

  it("sorts by price_change_percentage_24h descending (best performers first)", () => {
    const sorted = sortAssets(ASSETS, {
      field: "price_change_percentage_24h",
      direction: "desc",
    });
    expect(sorted[0].id).toBe("dogecoin");
    expect(sorted[2].id).toBe("ethereum");
  });

  it("treats null sort field values as 0", () => {
    const assetWithNull: Asset = { ...BTC, current_price: null };
    const sorted = sortAssets([ETH, assetWithNull], {
      field: "current_price",
      direction: "desc",
    });

    expect(sorted[0].id).toBe("ethereum");
  });

  it("does not mutate the original array", () => {
    const original = [DOGE, BTC, ETH];
    sortAssets(original, { field: "market_cap_rank", direction: "asc" });
    expect(original[0].id).toBe("dogecoin");
  });
});
