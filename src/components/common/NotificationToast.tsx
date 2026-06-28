import { useEffect, useState } from "react";
import type { KrakenTickerData } from "../../types";

interface Notification {
  id: number;
  message: string;
  type: "up" | "down";
}

interface NotificationToastProps {
  prices: Record<string, KrakenTickerData>;
}

const THRESHOLD = 2;
let notifId = 0;

export function NotificationToast({ prices }: NotificationToastProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [seen] = useState(() => new Set<string>());

  useEffect(() => {
    Object.values(prices).forEach((tick) => {
      if (!tick.changePercent) return;
      const pct = Math.abs(tick.changePercent);
      const key = `${tick.symbol}-${tick.changePercent > 0 ? "up" : "down"}`;
      if (pct >= THRESHOLD && !seen.has(key)) {
        seen.add(key);
        const id = ++notifId;
        const direction = tick.changePercent > 0 ? "up" : "down";
        setNotifications((prev) => [
          ...prev.slice(-3),
          {
            id,
            message: `${tick.symbol} ${direction === "up" ? "surged" : "dropped"} ${pct.toFixed(1)}%`,
            type: direction,
          },
        ]);
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
      }
    });
  }, [prices, seen]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl animate-slide-in-right ${
            n.type === "up"
              ? "bg-linear-to-r from-emerald-600 to-emerald-500"
              : "bg-linear-to-r from-red-600 to-red-500"
          }`}
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={n.type === "up" ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
          </svg>
          {n.message}
        </div>
      ))}
    </div>
  );
}
