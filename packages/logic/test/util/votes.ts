import { Id, PlayerVote, SkipVote } from "models";
import { Player } from "../../src/game/player/Player.js";
import { Game, isAlive } from "../../src/index.js";

export const skipVote = (): SkipVote => ({ type: "skip" });

export const playerVote = (...players: (Player | Id)[]): PlayerVote => ({
  type: "players",
  players: players.map((it) => (typeof it === "object" ? it.id : it)),
});

export const dismiss = (game: Game) => {
  game.players.filter(isAlive).forEach((it) => game.vote(it.id, skipVote()));
};
