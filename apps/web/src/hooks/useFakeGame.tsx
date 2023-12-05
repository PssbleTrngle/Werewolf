import { GameInfo, Time } from "models";
import { useEffect, useMemo, useReducer } from "react";

const TIMES: Time[] = ["dawn", "day", "dusk", "night"];

export default function useFakeGame() {
  const [i, increment] = useReducer((it: number) => it + 1, 0);

  useEffect(() => {
    const interval = setInterval(increment, 3_000);
    return () => clearInterval(interval);
  }, []);

  return useMemo<GameInfo>(
    () => ({
      time: TIMES[i % TIMES.length],
      day: Math.floor(i / TIMES.length),
    }),
    [i]
  );
}
