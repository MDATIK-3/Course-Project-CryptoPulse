interface ViewToggleProps {
  view: "grid" | "table";
  onChange: (view: "grid" | "table") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
      <button
        onClick={() => onChange("grid")}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          view === "grid"
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
        aria-label="Grid view"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => onChange("table")}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          view === "table"
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
        aria-label="Table view"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
        </svg>
      </button>
    </div>
  );
}
