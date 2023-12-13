import { useEffect } from "react";

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void
) {
  useEffect(() => {
    window.addEventListener(type, listener);
    return () => window.removeEventListener(type, listener);
  }, [type, listener]);
}
