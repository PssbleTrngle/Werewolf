import type { RedisJSON } from "@redis/json/dist/commands";

export function redisJSON<T>(object: T) {
  return object as RedisJSON;
}
