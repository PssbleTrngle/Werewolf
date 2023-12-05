import { SchemaFieldTypes, createClient } from "redis";

function connect() {
  console.log("Connecting to redis");
  return createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
}

type RedisClient = ReturnType<typeof createClient>;

let cachedClientPromise: Promise<RedisClient> | null = null;
let cachedClient: RedisClient | null = null;

export default async function connectRedis(): Promise<RedisClient> {
  if (cachedClient) return cachedClient;
  if (cachedClientPromise) return cachedClientPromise;

  cachedClientPromise = connect().then(setupRedis);

  const client = await cachedClientPromise;
  cachedClient = client;

  return client;
}

const SCHEMA_VERSION = 1;

async function setupRedis(client: RedisClient) {
  const schemaVersion = parseInt((await client.get("schema:version")) ?? "0");

  if (schemaVersion < 1) {
    await client.ft.create(
      "idx:lobbies",
      {
        id: SchemaFieldTypes.TEXT,
      },
      {
        ON: "JSON",
        PREFIX: "lobby:",
      }
    );
  }

  await client.set("schema:version", SCHEMA_VERSION.toString());

  return client;
}
