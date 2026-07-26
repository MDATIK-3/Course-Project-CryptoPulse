import { useEffect, useRef, useState } from "react";
import type { WebSocketPriceMap } from "../types";
import { KRAKEN_WS_URL, TRACKED_PAIRS } from "../utils/constants";

export type WsConnectionStatus = "connecting" | "live" | "reconnecting" | "offline";

export interface UseWebSocketPricesResult {
  prices: WebSocketPriceMap;
  status: WsConnectionStatus;
}

export function useWebSocketPrices(): UseWebSocketPricesResult {
  const [prices, setPrices] = useState<WebSocketPriceMap>({});
  const [status, setStatus] = useState<WsConnectionStatus>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cleaningUp = useRef(false);

  useEffect(() => {
    cleaningUp.current = false;

    function connect() {
      if (!navigator.onLine) {
        setStatus("offline");
        return;
      }
      setStatus("connecting");
      const ws = new WebSocket(KRAKEN_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("live");
        ws.send(
          JSON.stringify({
            method: "subscribe",
            params: { channel: "ticker", symbol: TRACKED_PAIRS },
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as {
            channel?: string;
            type?: string;
            data?: Array<{
              symbol?: string;
              last?: number;
              volume?: number;
              bid?: number;
              ask?: number;
              change?: number;
              change_pct?: number;
            }>;
          };
          if (msg.channel === "ticker" && msg.type === "update" && Array.isArray(msg.data)) {
            setPrices((prev) => {
              const next = { ...prev };
              for (const tick of msg.data!) {
                const symbol = tick.symbol?.replace("/", "") ?? "";
                next[symbol] = {
                  symbol: tick.symbol ?? "",
                  last: tick.last ?? 0,
                  volume: tick.volume ?? 0,
                  bid: tick.bid ?? 0,
                  ask: tick.ask ?? 0,
                  change: tick.change ?? 0,
                  changePercent: tick.change_pct ?? 0,
                };
              }
              return next;
            });
          }
        } catch {}
      };

      ws.onclose = () => {
        if (cleaningUp.current) return;
        // If the browser is offline, don't bother reconnecting — wait for the 'online' event
        if (!navigator.onLine) {
          setStatus("offline");
          return;
        }
        setStatus("reconnecting");
        reconnectTimer.current = setTimeout(() => {
          if (!cleaningUp.current) connect();
        }, 3000);
      };

      ws.onerror = () => {
        setStatus("offline");
        ws.close();
      };
    }

    connect();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        const ws = wsRef.current;
        if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
          connect();
        }
      }
    }

    function handleOnline() {
      connect();
    }

    function handleOffline() {
      setStatus("offline");
      wsRef.current?.close();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      cleaningUp.current = true;
      clearTimeout(reconnectTimer.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      wsRef.current?.close();
      setStatus("offline");
    };
  }, []);

  return { prices, status };
}
