import { useMemo, useReducer, type ReactNode } from "react";
import { InfoIcon } from "ui";

export type Hint = (
  | {
      key: string;
      target?: string;
    }
  | {
      key?: string;
      target: string;
    }
) & {
  icon?: ReactNode;
};

export default function useHints(gameId: string, hints: ReadonlyArray<Hint>) {
  const [highlightedIndex, moveHighlighted] = useReducer(
    (index: number, by: number) => {
      return (index + by + hints.length) % hints.length;
    },
    0,
  );

  const next = useMemo(
    () =>
      highlightedIndex < hints.length - 1
        ? () => moveHighlighted(1)
        : undefined,
    [moveHighlighted, highlightedIndex, hints],
  );

  const previous = useMemo(
    () => (highlightedIndex > 0 ? () => moveHighlighted(-1) : undefined),
    [moveHighlighted, highlightedIndex],
  );

  const highlighted = useMemo(
    () => hints[highlightedIndex],
    [hints, highlightedIndex],
  );

  const target = useMemo(
    () => highlighted?.target && `#${gameId}-${highlighted.target}`,
    [highlighted, gameId],
  );

  const translation = useMemo(
    () =>
      `guide.hint.${highlighted?.key ?? highlighted?.target}`.replaceAll(
        "-",
        ".",
      ),
    [highlighted],
  );

  const icon = useMemo(() => highlighted?.icon ?? <InfoIcon />, [highlighted]);

  return { next, previous, target, translation, icon };
}

export type SelectedHint = ReturnType<typeof useHints>;
