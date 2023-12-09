import { Game, GameState, generateRoles } from "logic";
import { ApiError, Id, User } from "models";
import { redisJSON } from "./casting.js";
import { Lobby, deleteLobby } from "./lobbies.js";
import connectRedis from "./redis.js";

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

  await redis.json.set(`game:${id}`, "$", redisJSON(history));
}

export async function joinLobby(user: User, lobbyId: Id) {
  const redis = await connectRedis();
  await Promise.all([
    redis.set(`player:${user.id}:lobby`, lobbyId),
    redis.json.arrAppend(`lobby:${lobbyId}`, ".players", redisJSON(user)),
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

  await deleteLobby(lobby);

  return game;
}

async function setGame(playerIds: Id[], gameId: Id) {
  const redis = await connectRedis();

  await Promise.all(
    playerIds.map((playerId) => redis.set(`player:${playerId}:game`, gameId))
  );
}