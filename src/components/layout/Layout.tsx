import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import type { WsConnectionStatus } from "../../hooks/useWebSocketPrices";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  wsStatus: WsConnectionStatus;
}

export function Layout({ children, activeTab, onTabChange, wsStatus }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-[#0b0f1a] dark:text-gray-100">
      <Header activeTab={activeTab} onTabChange={onTabChange} wsStatus={wsStatus} />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
