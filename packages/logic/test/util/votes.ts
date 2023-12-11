import { Id, PlayerVote, SkipVote } from "models";
import { Player } from "../../src/game/player/Player.js";

export const skipVote = (): SkipVote => ({ type: "skip" });

export const playerVote = (...players: (Player | Id)[]): PlayerVote => ({
  type: "players",
  players: players.map((it) => (typeof it === "object" ? it.id : it)),
});
