import { useEffect, useRef, useState } from "react";
import type { WebSocketPriceMap } from "../types";
import { KRAKEN_WS_URL, TRACKED_PAIRS } from "../utils/constants";

export function useWebSocketPrices(): WebSocketPriceMap {
  const [prices, setPrices] = useState<WebSocketPriceMap>({});
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(KRAKEN_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            method: "subscribe",
            params: { channel: "ticker", symbol: TRACKED_PAIRS },
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.channel === "ticker" && msg.type === "update" && Array.isArray(msg.data)) {
            setPrices((prev) => {
              const next = { ...prev };
              for (const tick of msg.data) {
                const symbol = tick.symbol?.replace("/", "") || "";
                next[symbol] = {
                  symbol: tick.symbol,
                  last: tick.last,
                  volume: tick.volume,
                  bid: tick.bid,
                  ask: tick.ask,
                  change: tick.change,
                  changePercent: tick.change_pct,
                };
              }
              return next;
            });
          }
        } catch {
          /* ignore parse errors */
        }
      };

      ws.onclose = () => {
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);

  return prices;
}
