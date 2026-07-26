import { describe, it, expect } from "vitest";
import type { KrakenTickerData } from "../types";

interface RawKrakenTick {
  symbol?: string;
  last?: number;
  volume?: number;
  bid?: number;
  ask?: number;
  change?: number;
  change_pct?: number;
}

function parseKrakenTick(tick: RawKrakenTick): { key: string; data: KrakenTickerData } {
  const symbol = tick.symbol?.replace("/", "") ?? "";
  return {
    key: symbol,
    data: {
      symbol: tick.symbol ?? "",
      last: tick.last ?? 0,
      volume: tick.volume ?? 0,
      bid: tick.bid ?? 0,
      ask: tick.ask ?? 0,
      change: tick.change ?? 0,
      changePercent: tick.change_pct ?? 0,
    },
  };
}

function parseKrakenMessage(raw: string): Record<string, KrakenTickerData> | null {
  try {
    const msg = JSON.parse(raw) as {
      channel?: string;
      type?: string;
      data?: RawKrakenTick[];
    };
    if (msg.channel !== "ticker" || msg.type !== "update" || !Array.isArray(msg.data)) {
      return null;
    }
    const result: Record<string, KrakenTickerData> = {};
    for (const tick of msg.data) {
      const { key, data } = parseKrakenTick(tick);
      result[key] = data;
    }
    return result;
  } catch {
    return null;
  }
}

describe("parseKrakenTick", () => {
  it("strips the slash from symbol to create the map key", () => {
    const { key } = parseKrakenTick({ symbol: "BTC/USD" });
    expect(key).toBe("BTCUSD");
  });

  it("maps change_pct to changePercent", () => {
    const { data } = parseKrakenTick({ symbol: "ETH/USD", change_pct: 2.5 });
    expect(data.changePercent).toBe(2.5);
  });

  it("defaults missing numeric fields to 0", () => {
    const { data } = parseKrakenTick({ symbol: "SOL/USD" });
    expect(data.last).toBe(0);
    expect(data.volume).toBe(0);
    expect(data.bid).toBe(0);
    expect(data.ask).toBe(0);
    expect(data.change).toBe(0);
    expect(data.changePercent).toBe(0);
  });

  it("defaults missing symbol to empty string for key", () => {
    const { key } = parseKrakenTick({});
    expect(key).toBe("");
  });
});

describe("parseKrakenMessage", () => {
  it("returns null for malformed JSON", () => {
    expect(parseKrakenMessage("not json")).toBeNull();
  });

  it("returns null when channel is not ticker", () => {
    const msg = JSON.stringify({ channel: "heartbeat", type: "update", data: [] });
    expect(parseKrakenMessage(msg)).toBeNull();
  });

  it("returns null when type is not update", () => {
    const msg = JSON.stringify({ channel: "ticker", type: "snapshot", data: [] });
    expect(parseKrakenMessage(msg)).toBeNull();
  });

  it("returns null when data is not an array", () => {
    const msg = JSON.stringify({ channel: "ticker", type: "update", data: null });
    expect(parseKrakenMessage(msg)).toBeNull();
  });

  it("parses a valid ticker update message", () => {
    const msg = JSON.stringify({
      channel: "ticker",
      type: "update",
      data: [
        {
          symbol: "BTC/USD",
          last: 65000,
          volume: 1234.5,
          bid: 64990,
          ask: 65010,
          change: 500,
          change_pct: 0.77,
        },
      ],
    });
    const result = parseKrakenMessage(msg);
    expect(result).not.toBeNull();
    expect(result!["BTCUSD"]).toBeDefined();
    expect(result!["BTCUSD"].last).toBe(65000);
    expect(result!["BTCUSD"].changePercent).toBe(0.77);
  });

  it("parses multiple tickers in one message", () => {
    const msg = JSON.stringify({
      channel: "ticker",
      type: "update",
      data: [
        { symbol: "BTC/USD", last: 65000, volume: 0, bid: 0, ask: 0, change: 0, change_pct: 0 },
        { symbol: "ETH/USD", last: 3500, volume: 0, bid: 0, ask: 0, change: 0, change_pct: 0 },
      ],
    });
    const result = parseKrakenMessage(msg);
    expect(Object.keys(result!)).toHaveLength(2);
    expect(result!["ETHUSD"].last).toBe(3500);
  });
});
