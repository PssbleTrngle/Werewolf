import { Game, GameState, generateRoles } from "logic";
import { ApiError, Id } from "models";
import { redisJSON } from "./casting.js";
import LobbyStorage, { Lobby } from "./lobbies.js";
import { RedisClient } from "./redis.js";

export default class GameStorage {
  constructor(
    private readonly redis: RedisClient,
    private readonly lobbies: LobbyStorage
  ) {}

  private createRemoteGame(id: Id, history: ReadonlyArray<GameState>) {
    const game = new Game(history);
    game.on("save", (history) => this.saveGame(id, history));
    return game;
  }

  async getGame(id: Id) {
    const result = (await this.redis.json.get(
      `game:${id}`
    )) as ReadonlyArray<GameState> | null;

    if (result) return this.createRemoteGame(id, result);
    throw new ApiError(404, `Unable to find game with id ${id}`);
  }

  private async saveGame(id: Id, history: ReadonlyArray<GameState>) {
    await this.redis.json.set(`game:${id}`, "$", redisJSON(history));
  }

  async startGame(lobby: Lobby) {
    const players = generateRoles(lobby.players);

    const id = lobby.id;
    const game = this.createRemoteGame(id, Game.createState(players));
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
}
