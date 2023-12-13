import { SchemaFieldTypes, createClient } from "redis";

export function connectRedis(): Promise<RedisClient> {
  console.log("Connecting to redis");
  return createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect()
    .then(setupRedis);
}

export type RedisClient = ReturnType<typeof createClient>;

const SCHEMA_VERSION = 1;

export async function setupRedis(client: RedisClient): Promise<RedisClient> {
  const schemaVersion = parseInt((await client.get("schema:version")) ?? "0");

  if (schemaVersion < 1) {
    console.log(`Migrating DB to version 1`);

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
