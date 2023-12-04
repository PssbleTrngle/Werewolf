import { Game, GameState, Player } from "logic";
import { GameSettings, Id } from "models";
import { nanoid } from "nanoid";
import connectRedis from "./redis";

export class RemoteGame extends Game {
  public constructor(
    private readonly id: Id,
    history: ReadonlyArray<GameState>
  ) {
    super(history);
  }

  async onSave(history: readonly GameState[]) {
    // TODO async?
    await saveGame(this.id, history);
  }
}

interface Lobby {
  id: Id;
  players: ReadonlyArray<Id>;
  settings: GameSettings;
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

export async function createGame(owner: Player) {
  const redis = await connectRedis();

  const id = nanoid();

  const lobby: Lobby = { id, players: [owner.id], settings: {} };
  await redis.set(`lobby/${id}`, JSON.stringify(lobby));
  await joinLobby(owner.id, id);
}

async function joinLobby(playerId: Id, gameId: Id) {
  const redis = await connectRedis();

  redis.set(`player/${playerId}/lobby`, gameId);

  await redis.disconnect();
}

export async function startGame(...initialPlayers: Player[]) {
  const id = "1";
  const game = new RemoteGame(id, Game.createState(initialPlayers));
  await game.save();

  await setGame(
    initialPlayers.map((it) => it.id),
    id
  );

  return game;
}

async function setGame(playerIds: Id[], gameId: Id) {
  const redis = await connectRedis();

  await Promise.all(
    playerIds.map((playerId) => redis.set(`player/${playerId}/game`, gameId))
  );

  await redis.disconnect();
}

type OnlineStatus =
  | {
      type: "game";
      game: Game;
    }
  | {
      type: "lobby";
      lobby: Lobby;
    };

export async function statusOf(playerId: Id): Promise<OnlineStatus | null> {
  const redis = await connectRedis();

  const [lobbyId, gameId] = await Promise.all([
    redis.get(`player/${playerId}/lobby`),
    redis.get(`player/${playerId}/game`),
  ]);

  if (lobbyId) {
    const json = await redis.get(`lobby/${lobbyId}`);
    await redis.disconnect();

    if (!json) throw new Error(`Unable to find lobby with id ${gameId}`);

    const lobby: Lobby = JSON.parse(json);
    return {
      type: "lobby",
      lobby,
    };
  }

  if (gameId) {
    const json = await redis.get(`game/${gameId}`);
    await redis.disconnect();

    if (!json) throw new Error(`Unable to find game with id ${gameId}`);

    const history = JSON.parse(json);

    return {
      type: "game",
      game: new RemoteGame(gameId, history),
    };
  }

  await redis.disconnect();

  return null;
}
