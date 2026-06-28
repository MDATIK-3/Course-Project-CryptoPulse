import type { Timeframe } from "../../types";
import { TIMEFRAME_OPTIONS } from "../../utils/constants";

interface TimeframeToggleProps {
  value: Timeframe;
  onChange: (value: Timeframe) => void;
}

export function TimeframeToggle({ value, onChange }: TimeframeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
      {TIMEFRAME_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            value === opt.value
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
