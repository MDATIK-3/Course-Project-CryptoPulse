import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0f1a] dark:text-gray-100">
      <Header activeTab={activeTab} onTabChange={onTabChange} />
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
