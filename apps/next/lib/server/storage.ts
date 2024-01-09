import { Storage } from "storage";

export default async function connectStorage(): Promise<Storage> {
  if (global.cachedStorage?.resolved) return global.cachedStorage.resolved;
  if (global.cachedStorage?.promise) return global.cachedStorage.promise;

  const promise = createStorage();
  global.cachedStorage = { promise };

  const resolved = await promise;
  global.cachedStorage = { resolved };

  return resolved;
}

async function createStorage() {
  const storage = await Storage.create();

  storage.games.on("event", async (game, { players, choice }) => {
    const seededUsers = players.filter((it) => it.provider === "seeded");

    if (choice) {
      await Promise.all(
        seededUsers.map(({ id }) => {
          if (choice.canSkip && Math.random() > 0.8)
            return game.vote(id, { type: "skip" });
          if (choice.players) {
            const targets = [...choice.players]
              .sort(() => Math.random() - 0.5)
              .slice(0, choice.voteCount ?? 1)
              .map((it) => it.id);
            return game.vote(id, { type: "players", players: targets });
          }
        })
      );
    }
  });

  storage.games.on("event", async (_, event) => {
    console.log("new event", event.type);
  });

  return storage;
}
