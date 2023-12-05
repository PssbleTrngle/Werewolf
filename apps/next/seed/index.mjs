import { faker } from "@faker-js/faker";
import { createClient } from "redis";
import fakeLobby from "./lobby.mjs";

async function run() {
  const redis = await createClient().connect();

  const total = 40;
  let completed = 0;

  await Promise.all(
    new Array(total).fill(null).map(async () => {
      const lobby = fakeLobby(faker);

      await Promise.all([
        redis.json.set(`lobby:${lobby.id}`, "$", lobby),
        ...lobby.players.map((it) =>
          redis.set(`player:${it.id}:lobby`, lobby.id)
        ),
      ]);

      console.log(`${++completed}/${total}`);
    })
  );

  console.log("Successfully seeded redis");

  await redis.disconnect();
}

run().catch((e) => console.error(e));
