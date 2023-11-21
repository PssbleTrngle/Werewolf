import { Player } from "../../src/game/player/Player.js";
import { PlayerVote, SkipVote } from "../../src/game/vote/Vote.js";

export const skipVote = (): SkipVote => ({ type: "skip" });

export const playerVote = (...players: Player[]): PlayerVote => ({
  type: "players",
  players: players.map((it) => it.id),
});
