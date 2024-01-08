import { Game, GameState, Votes, preparePlayers } from "logic";
import { ApiError, Id } from "models";
import { redisJSON } from "./casting.js";
import LobbyStorage, { Lobby } from "./lobbies.js";
import { RedisClient } from "./redis.js";

export default class GameStorage {
  constructor(
    private readonly redis: RedisClient,
    private readonly lobbies: LobbyStorage
  ) {}

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

    game.on("event", async ({ players, choice }) => {
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
    const players = preparePlayers(lobby.players);

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
