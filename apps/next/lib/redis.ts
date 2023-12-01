import { createClient } from "redis";

export default function connectRedis() {
  return createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
}
