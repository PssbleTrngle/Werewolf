import { Game, GameState, Player } from "logic";
import { Id } from "models";
import connectRedis from "./redis";

export class RemoteGame extends Game {
  public constructor(
    private readonly id: Id,
    history: ReadonlyArray<GameState>
  ) {
    super(history);
  }

  onSave(history: readonly GameState[]) {
    // TODO async?
    saveGame(this.id, history);
  }
}

export async function getGame(id: Id) {
  const redis = await connectRedis();

  const game = await redis.get(`game/${id}`);
  if (!game) throw new Error(`Unable to find game with id ${id}`);

  await redis.disconnect();

  const history = JSON.parse(game);
  return new RemoteGame(id, history);
}

async function saveGame(id: Id, history: ReadonlyArray<GameState>) {
  const redis = await connectRedis();

  await redis.set(`game/${id}`, JSON.stringify(history));

  await redis.disconnect();
}

export async function createGame(...initialPlayers: Player[]) {
  const id = "1";
  await setGame(
    initialPlayers.map((it) => it.id),
    id
  );
  return new RemoteGame(id, Game.createState(initialPlayers));
}

async function setGame(playerIds: Id[], gameId: Id) {
  const redis = await connectRedis();

  await Promise.all(
    playerIds.map((playerId) => redis.set(`player/${playerId}/game`, gameId))
  );

  await redis.disconnect();
}

export async function gameOf(playerId: Id) {
  const redis = await connectRedis();

  const gameId = await redis.get(`player/${playerId}/game`);
  if (!gameId) return null;

  const game = await redis.get(`game/${gameId}`);
  if (!game) throw new Error(`Unable to find game with id ${gameId}`);

  await redis.disconnect();

  const history = JSON.parse(game);
  return new RemoteGame(gameId, history);
}
