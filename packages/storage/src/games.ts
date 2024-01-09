import {
  Game,
  GameHookKey,
  GameHookListener,
  GameState,
  Votes,
  generateRoles,
  preparePlayers,
} from "logic";
import { ApiError, Id } from "models";
import { redisJSON } from "./casting.js";
import LobbyStorage, { Lobby } from "./lobbies.js";
import { RedisClient } from "./redis.js";

type ListenerWithGame<T extends GameHookKey = GameHookKey> = (
  game: Game,
  ...args: Parameters<GameHookListener<T>>
) => ReturnType<GameHookListener<T>>;

export default class GameStorage {
  constructor(
    private readonly redis: RedisClient,
    private readonly lobbies: LobbyStorage
  ) {}

  private hooks: [GameHookKey, ListenerWithGame][] = [];

  async on<T extends GameHookKey>(event: T, listener: ListenerWithGame<T>) {
    this.hooks.push([event, listener as ListenerWithGame]);
  }

  private async createRemoteGame(
    id: Id,
    history: ReadonlyArray<GameState>,
    votes: Votes = []
  ) {
    const game = new Game(history, votes);

    game.on("save", (history) => this.saveGame(id, history));

    game.on("vote", async (votes) => {
      await this.setVotes(id, votes);
    });

    this.hooks.forEach(([event, listener]) => {
      game.on(event, (...args) => listener(game, ...args));
    });

    return game;
  }

  async getGame(id: Id) {
    const [result, votes] = await Promise.all([
      this.redis.json.get(
        `game:${id}`
      ) as Promise<ReadonlyArray<GameState> | null>,
      this.getVotes(id),
    ]);

    if (result) return this.createRemoteGame(id, result, votes);
    throw new ApiError(404, `Unable to find game with id ${id}`);
  }

  private async saveGame(id: Id, history: ReadonlyArray<GameState>) {
    await this.redis.json.set(`game:${id}`, "$", redisJSON(history));
  }

  async startGame(lobby: Lobby) {
    const players = preparePlayers(generateRoles(lobby.players));

    const id = lobby.id;
    const game = await this.createRemoteGame(id, Game.createState(players));
    await game.save();

    await this.setGame(
      players.map((it) => it.id),
      id
    );

    await this.lobbies.deleteLobby(lobby);

    return game;
  }

  private async setGame(playerIds: Id[], gameId: Id) {
    await Promise.all(
      playerIds.map((playerId) =>
        this.redis.set(`player:${playerId}:game`, gameId)
      )
    );
  }

  private async setVotes(gameId: Id, votes: Votes) {
    await this.redis.json.set(`game:${gameId}:votes`, "$", redisJSON(votes));
  }

  private async getVotes(gameId: Id) {
    const result = (await this.redis.json.get(
      `game:${gameId}:votes`
    )) as Votes | null;
    return result ?? [];
  }
}
