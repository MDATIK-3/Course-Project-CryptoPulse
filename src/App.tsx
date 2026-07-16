import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FavoritesProvider>
          <Layout activeTab={activeTab} onTabChange={setActiveTab}>
            <Dashboard activeTab={activeTab} />
          </Layout>
        </FavoritesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
