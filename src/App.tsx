import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { useWebSocketPrices } from "./hooks/useWebSocketPrices";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { prices: wsPrices, status: wsStatus } = useWebSocketPrices();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FavoritesProvider>
          <Layout activeTab={activeTab} onTabChange={setActiveTab} wsStatus={wsStatus}>
            <Dashboard activeTab={activeTab} wsPrices={wsPrices} />
          </Layout>
        </FavoritesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
