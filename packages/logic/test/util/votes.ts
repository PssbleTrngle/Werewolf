import { PlayerVote, SkipVote } from "models";
import { Player } from "../../src/game/player/Player.js";
import { Game } from "../../src/index.js";

export const skipVote = (): SkipVote => ({ type: "skip" });

export const playerVote = (...players: Player[]): PlayerVote => ({
  type: "players",
  players: players.map((it) => it.id),
});

export const dismiss = (game: Game) => {
  game.players.forEach((it) => game.vote(it, skipVote()));
};
