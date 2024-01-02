import { ApiError, defaultGameSettings, GameSettings, Id, User } from "models";
import { nanoid } from "nanoid";
import { redisJSON } from "./casting.js";
import { RedisClient } from "./redis.js";

export interface Lobby {
  id: Id;
  players: ReadonlyArray<User>;
  owner: User;
  settings: GameSettings;
}

export default class LobbyStorage {
  constructor(private readonly redis: RedisClient) {}

  async createLobby(owner: User) {
    const id = nanoid();

    const lobby: Lobby = {
      id,
      players: [owner],
      owner,
      settings: defaultGameSettings,
    };
    await Promise.all([
      this.redis.json.set(`lobby:${id}`, "$", redisJSON(lobby)),
      this.redis.set(`player:${owner.id}:lobby`, id),
    ]);

    return id;
  }

  async joinLobby(user: User, lobbyId: Id) {
    await Promise.all([
      this.redis.set(`player:${user.id}:lobby`, lobbyId),
      this.redis.json.arrAppend(
        `lobby:${lobbyId}`,
        ".players",
        redisJSON(user),
      ),
    ]);
  }

  async leaveLobby(user: User, lobbyId: Id) {
    const lobby = await this.getLobby(lobbyId);
    const index = lobby.players.findIndex((it) => it.id === user.id);

    if (index < 0) throw new ApiError(400, "Not part of this lobby");

    if (lobby.players.length === 1) return this.deleteLobby(lobby);

    await Promise.all([
      this.redis.del(`player:${user.id}:lobby`),
      this.redis.json.arrPop(`lobby:${lobbyId}`, ".players", index),
    ]);
  }

  async getLobby(id: Id) {
    const lobby = (await this.redis.json.get(`lobby:${id}`)) as Lobby | null;

    if (lobby) return lobby;
    throw new ApiError(404, `Unable to find lobby with id ${id}`);
  }

  async deleteLobby(lobby: Lobby) {
    await Promise.all([
      this.redis.del(`lobby:${lobby.id}`),
      ...lobby.players.map((it) => this.redis.del(`player:${it.id}:lobby`)),
    ]);
  }

  async getLobbies() {
    const result = await this.redis.ft.search("idx:lobbies", "*");

    return result.documents.map((it) => it.value as unknown as Lobby);
  }
}
