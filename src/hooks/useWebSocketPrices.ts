import { useCallback, useEffect, useRef, useState } from "react";
import type { WebSocketPriceMap } from "../types";
import { KRAKEN_WS_URL, TRACKED_PAIRS } from "../utils/constants";

export type WsConnectionStatus = "connecting" | "live" | "reconnecting" | "offline";

export interface UseWebSocketPricesResult {
  prices: WebSocketPriceMap;
  status: WsConnectionStatus;
}

/** Actively probe internet by fetching a tiny resource. Returns true if reachable. */
async function probeConnectivity(): Promise<boolean> {
  try {
    // Use favicon.ico with a cache-buster so it is never cached
    const res = await fetch(`https://www.google.com/favicon.ico?_=${Date.now()}`, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
    });
    // no-cors always returns opaque (status 0) but does NOT throw if reachable
    return res.type === "opaque" || res.ok;
  } catch {
    return false;
  }
}

export function useWebSocketPrices(): UseWebSocketPricesResult {
  const [prices, setPrices] = useState<WebSocketPriceMap>({});
  const [status, setStatus] = useState<WsConnectionStatus>("connecting");
  const statusRef = useRef<WsConnectionStatus>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const heartbeatTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const cleaningUp = useRef(false);

  // Keep statusRef in sync so closures always read the latest value
  const setStatusSynced = useCallback((s: WsConnectionStatus) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const connectWs = useCallback(() => {
    if (cleaningUp.current) return;

    setStatusSynced("connecting");
    const ws = new WebSocket(KRAKEN_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatusSynced("live");
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
      // Use browser flag first; real probe happens via heartbeat
      if (!navigator.onLine) {
        setStatusSynced("offline");
        return;
      }
      setStatusSynced("reconnecting");
      reconnectTimer.current = setTimeout(() => {
        if (!cleaningUp.current) connectWs();
      }, 3000);
    };

    ws.onerror = () => {
      setStatusSynced("offline");
      ws.close();
    };
  }, [setStatusSynced]);

  useEffect(() => {
    cleaningUp.current = false;

    // --- Initial connection ---
    if (!navigator.onLine) {
      setStatusSynced("offline");
    } else {
      connectWs();
    }

    // --- Heartbeat: probe real internet every 5 seconds ---
    heartbeatTimer.current = setInterval(async () => {
      if (cleaningUp.current) return;

      const isOnline = navigator.onLine && (await probeConnectivity());

      if (!isOnline) {
        // Internet gone: close socket and mark offline
        if (statusRef.current !== "offline") {
          setStatusSynced("offline");
          clearTimeout(reconnectTimer.current);
          const ws = wsRef.current;
          if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            ws.close();
          }
        }
      } else {
        // Internet is back: reconnect if socket is dead
        const ws = wsRef.current;
        if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
          connectWs();
        }
      }
    }, 5000);

    // --- Browser online/offline events (instant feedback) ---
    function handleOffline() {
      if (cleaningUp.current) return;
      setStatusSynced("offline");
      clearTimeout(reconnectTimer.current);
      const ws = wsRef.current;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close();
      }
    }

    function handleOnline() {
      if (cleaningUp.current) return;
      // Don't reconnect immediately — let the heartbeat confirm real connectivity
      // But do a quick probe so recovery feels instant
      void probeConnectivity().then((reachable) => {
        if (cleaningUp.current) return;
        if (reachable) {
          const ws = wsRef.current;
          if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
            connectWs();
          }
        }
      });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && navigator.onLine) {
        const ws = wsRef.current;
        if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
          connectWs();
        }
      }
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cleaningUp.current = true;
      clearTimeout(reconnectTimer.current);
      clearInterval(heartbeatTimer.current);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectWs, setStatusSynced]);

  return { prices, status };
}
