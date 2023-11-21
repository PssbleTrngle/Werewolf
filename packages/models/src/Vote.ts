import { Id } from "./Player.js";

export interface SkipVote {
  type: "skip";
}

export interface PlayerVote {
  type: "players";
  players: ReadonlyArray<Id>;
}

export type Vote = PlayerVote | SkipVote;
