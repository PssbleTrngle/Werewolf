export function notNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export type ArrayOrSingle<T> = T | ReadonlyArray<T>;

export function arrayOrSelf<T>(input: ArrayOrSingle<T>): ReadonlyArray<T> {
  if (Array.isArray(input)) return input;
  return [input as T];
}

export type PartialOrFactory<T> = Partial<T> | ((previous: T) => Partial<T>);

export function resolveFactory<T>(factory: PartialOrFactory<T>, current: T): T {
  const partial = typeof factory === "function" ? factory(current) : factory;
  return { ...current, ...partial };
}
