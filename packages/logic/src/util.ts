import { omitBy } from "lodash-es";

export function notNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export type ArrayOrSingle<T> = T | ReadonlyArray<T>;

export function arrayOrSelf<T>(input: ArrayOrSingle<T>): ReadonlyArray<T> {
  if (Array.isArray(input)) return input;
  return [input as T];
}

export type PartialOrFactory<T> = Partial<T> | ((previous: T) => Partial<T>);

export function resolvePartialFactory<T>(
  factory: PartialOrFactory<T>,
  current: T,
): Partial<T> {
  return typeof factory === "function" ? factory(current) : factory;
}

export function resolveFactory<T>(factory: PartialOrFactory<T>, current: T): T {
  const partial = resolvePartialFactory(factory, current);
  return { ...current, ...partial };
}

export function omitByUndefined<T extends Record<string, unknown>>(
  value: T,
): T {
  return omitBy(value, (it) => !notNull(it)) as T;
}

interface TupleChecker {
  <T>(count: 1, array: T[]): array is [T];
  <T>(count: 2, array: T[]): array is [T, T];
  <T>(count: 3, array: T[]): array is [T, T, T];
  <T>(count: 4, array: T[]): array is [T, T, T, T];
  <T>(count: 5, array: T[]): array is [T, T, T, T, T];
  <T>(count: 6, array: T[]): array is [T, T, T, T, T, T];
  <T>(count: 7, array: T[]): array is [T, T, T, T, T, T, T];
  <T>(count: 8, array: T[]): array is [T, T, T, T, T, T, T, T];
  <T>(count: 9, array: T[]): array is [T, T, T, T, T, T, T, T, T];
  <T>(count: 10, array: T[]): array is [T, T, T, T, T, T, T, T, T, T];
}

export const hasSize = ((count: number, array: unknown[]) => {
  return array.length > count;
}) as TupleChecker;
