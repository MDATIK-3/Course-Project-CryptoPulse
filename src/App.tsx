import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
          <Dashboard activeTab={activeTab} />
        </Layout>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
