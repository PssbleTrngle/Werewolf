import { Player } from "models";
import { Storage } from "storage";

const cacheStorage = process.env.CACHE_STORAGE !== "false";

export default async function connectStorage(): Promise<Storage> {
  if (!cacheStorage) return createStorage();

  if (global.cachedStorage?.resolved) return global.cachedStorage.resolved;
  if (global.cachedStorage?.promise) return global.cachedStorage.promise;

  const promise = createStorage();
  global.cachedStorage = { promise };

  const resolved = await promise;
  global.cachedStorage = { resolved };

  return resolved;
}

function isBot(player: Player) {
  return ["bot", "seeded"].includes(player.provider!);
}

async function createStorage() {
  const storage = await Storage.create();

  storage.games.on("event", async (game, { players, choice }) => {
    const seededUsers = players.filter(isBot);
    console.log(`Found ${seededUsers.length} seeded users`);

    if (choice) {
      await Promise.all(
        seededUsers.map(({ id }) => {
          const canVotePlayer = choice.players?.length;
          const wouldSkip = Math.random() > 0.8 || !canVotePlayer;
          if (choice.canSkip && wouldSkip)
            return game.vote(id, { type: "skip" });

          if (canVotePlayer) {
            const targets = [...choice.players!]
              .sort(() => Math.random() - 0.5)
              .slice(0, choice.voteCount ?? 1)
              .map((it) => it.id);

            return game.vote(id, { type: "players", players: targets });
          }
        }),
      );
    }
  });

  return storage;
}
