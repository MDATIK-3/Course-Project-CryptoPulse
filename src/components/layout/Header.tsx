import { ThemeToggle } from "../theme/ThemeToggle";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "all", label: "All Assets" },
  { id: "favorites", label: "Favorites" },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/70 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/70">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
              CP
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              CryptoPulse
            </span>
          </div>

          <nav className="hidden items-center gap-1 sm:flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-1 -bottom-[calc(0.5rem+1px)] h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            Live
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex border-t border-gray-100 dark:border-gray-800 sm:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}
