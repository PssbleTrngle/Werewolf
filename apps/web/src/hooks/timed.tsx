import { useEffect, type Dispatch } from "react";

export function useInterval(callback: Dispatch<void>, timeout: number) {
  useEffect(() => {
    const id = setInterval(callback, timeout);
    return () => clearInterval(id);
  }, [callback, timeout]);
}
