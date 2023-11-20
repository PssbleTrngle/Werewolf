import { Player } from "../../src/game/Player";
import { PlayerVote, SkipVote } from "../../src/game/choice/Vote";

export const skipVote = (): SkipVote => ({ type: "skip" });

export const playerVote = (...players: Player[]): PlayerVote => ({
  type: "players",
  players,
});
