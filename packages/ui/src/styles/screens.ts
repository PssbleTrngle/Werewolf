import { useEffect, useMemo, useReducer } from "react";

const PREFIX = "@media ";
export const XS = `${PREFIX}(max-width: 600px)`;

export function useMedia(query: string) {
  const q = useMemo(
    () => window.matchMedia(query.replace(PREFIX, "")),
    [query],
  );
  const [matches, updateMatches] = useReducer(() => q.matches, q.matches);

  useEffect(() => {
    q.addEventListener("change", updateMatches);
  }, [q]);

  return matches;
}
