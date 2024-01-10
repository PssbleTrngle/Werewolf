import GameStorage from "./games.js";
import LobbyStorage from "./lobbies.js";
import { RedisClient, connectRedis, setupRedis } from "./redis.js";

export class Storage {
  readonly games: GameStorage;
  readonly lobbies: LobbyStorage;

  private constructor(private readonly redis: RedisClient) {
    this.lobbies = new LobbyStorage(redis);
    this.games = new GameStorage(redis, this.lobbies);
  }

  static async create() {
    const client = await connectRedis();
    return new Storage(client);
  }

  async flush() {
    await this.redis.flushAll();
    await setupRedis(this.redis);
  }

  async disconnect() {
    await this.redis.disconnect();
  }
}

export type { Lobby } from "./lobbies.js";
export type { RedisClient } from "./redis.js";
