import { ApiError, GameSettings, Id, User } from "models";
import { nanoid } from "nanoid";
import { redisJSON } from "./casting.js";
import connectRedis from "./redis.js";

export interface Lobby {
  id: Id;
  players: ReadonlyArray<User>;
  owner: User;
  settings: GameSettings;
}

export async function createLobby(owner: User) {
  const redis = await connectRedis();

  const id = nanoid();

  const lobby: Lobby = { id, players: [owner], owner, settings: {} };
  await Promise.all([
    redis.json.set(`lobby:${id}`, "$", redisJSON(lobby)),
    redis.set(`player:${owner.id}:lobby`, id),
  ]);

  return id;
}

export async function leaveLobby(user: User, lobbyId: Id) {
  const redis = await connectRedis();
  const lobby = await getLobby(lobbyId);
  const index = lobby.players.findIndex((it) => it.id === user.id);

  if (index < 0) throw new ApiError(400, "Not part of this lobby");

  if (lobby.players.length === 1) return deleteLobby(lobby);

  await Promise.all([
    redis.del(`player:${user.id}:lobby`),
    redis.json.arrPop(`lobby:${lobbyId}`, ".players", index),
  ]);
}

export async function getLobby(id: Id) {
  const redis = await connectRedis();
  const lobby = (await redis.json.get(`lobby:${id}`)) as Lobby | null;

  if (lobby) return lobby;
  throw new ApiError(404, `Unable to find lobby with id ${id}`);
}

export async function deleteLobby(lobby: Lobby) {
  const redis = await connectRedis();

  await Promise.all([
    redis.del(`lobby:${lobby.id}`),
    ...lobby.players.map((it) => redis.del(`player:${it.id}:lobby`)),
  ]);
}

export async function getLobbies() {
  const redis = await connectRedis();

  const result = await redis.ft.search("idx:lobbies", "*");

  return result.documents.map((it) => it.value as unknown as Lobby);
}
