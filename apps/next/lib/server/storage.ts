import { Storage } from "storage";

export default async function connectStorage(): Promise<Storage> {
  if (global.cachedStorage?.resolved) return global.cachedStorage.resolved;
  if (global.cachedStorage?.promise) return global.cachedStorage.promise;

  const promise = Storage.create();
  global.cachedStorage = { promise };

  const resolved = await promise;
  global.cachedStorage = { resolved };

  return resolved;
}
