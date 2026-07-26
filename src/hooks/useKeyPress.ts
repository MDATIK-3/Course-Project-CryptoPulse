import { useEffect } from "react";

export function useKeyPress(key: string, callback: () => void): void {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === key) callback();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [key, callback]);
}
