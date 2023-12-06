import connectRedis, { setupRedis } from "../src/redis.js";

beforeEach(async () => {
  const redis = await connectRedis();
  await redis.flushAll();
  await setupRedis(redis);
});
