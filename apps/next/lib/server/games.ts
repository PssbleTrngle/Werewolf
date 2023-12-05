import { Game, GameState, generateRoles } from "logic";
import { GameSettings, GameStatus, Id, User } from "models";
import { nanoid } from "nanoid";
import { ApiError } from "next/dist/server/api-utils";
import connectRedis from "./redis";

export class RemoteGame extends Game {
  public constructor(
    public readonly id: Id,
    history: ReadonlyArray<GameState>
  ) {
    super(history);
  }

  async onSave(history: readonly GameState[]) {
    // TODO async?
    await saveGame(this.id, history);
  }
}

export interface Lobby {
  id: Id;
  players: ReadonlyArray<User>;
  owner: User;
  settings: GameSettings;
}

export async function getGame(id: Id) {
  const redis = await connectRedis();

  const result = (await redis.json.get(
    `game:${id}`
  )) as ReadonlyArray<GameState> | null;

  if (result) return new RemoteGame(id, result);
  throw new ApiError(404, `Unable to find game with id ${id}`);
}

async function saveGame(id: Id, history: ReadonlyArray<GameState>) {
  const redis = await connectRedis();

  await redis.json.set(`game:${id}`, "$", history as any);
}

export async function createLobby(owner: User) {
  const redis = await connectRedis();

  const id = nanoid();

  const lobby: Lobby = { id, players: [owner], owner, settings: {} };
  await Promise.all([
    redis.json.set(`lobby:${id}`, "$", lobby as any),
    redis.set(`player:${owner.id}:lobby`, id),
  ]);
}

export async function joinLobby(user: User, lobbyId: Id) {
  const redis = await connectRedis();
  await Promise.all([
    redis.set(`player:${user.id}:lobby`, lobbyId),
    redis.json.arrAppend(`lobby:${lobbyId}`, ".players", user as any),
  ]);
}

export async function leaveLobby(user: User, lobbyId: Id) {
  const redis = await connectRedis();
  const { players } = await getLobby(lobbyId);
  const index = players.findIndex((it) => it.id === user.id);

  if (index < 0) throw new ApiError(400, "Not part of this lobby");

  await Promise.all([
    redis.del(`player:${user.id}:lobby`),
    redis.json.arrPop(`lobby:${lobbyId}`, ".players", index),
  ]);
}

export async function startGame(lobby: Lobby) {
  const players = generateRoles(lobby.players);

  const id = lobby.id;
  const game = new RemoteGame(id, Game.createState(players));
  await game.save();

  await setGame(
    players.map((it) => it.id),
    id
  );

  return game;
}

async function setGame(playerIds: Id[], gameId: Id) {
  const redis = await connectRedis();

  await Promise.all(
    playerIds.map((playerId) => redis.set(`player:${playerId}:game`, gameId))
  );
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

export async function statusOf(playerId: Id): Promise<GameStatus> {
  const redis = await connectRedis();

  const [lobbyId, gameId] = await Promise.all([
    redis.get(`player:${playerId}:lobby`),
    redis.get(`player:${playerId}:game`),
  ]);

  if (gameId) {
    return {
      type: "game",
      id: gameId,
    };
  }

  if (lobbyId) {
    return {
      type: "lobby",
      id: lobbyId,
    };
  }

  return {
    type: "none",
  };
}
