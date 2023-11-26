import { SetStateAction, useCallback, useMemo, useReducer } from "react";

export function readLocalStorage<T>(key: string) {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved) as T;
  return null;
}

type SerializeAble = Record<string, unknown> | ReadonlyArray<unknown>;

export default function useLocalStorage<T extends SerializeAble>(
  key: string,
  initial: () => T
) {
  const saved = useMemo(() => readLocalStorage<T>(key), [key]);

  const save = useCallback(
    (data: T) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    [key]
  );

  return useReducer((previous: T, value: SetStateAction<T>) => {
    const readValue = typeof value === "function" ? value(previous) : value;
    save(readValue);
    return readValue;
  }, saved ?? initial());
}
