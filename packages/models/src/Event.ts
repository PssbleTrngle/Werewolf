import { Choice } from "./Choice.js";
import { Player } from "./Player.js";

export interface Event {
  type: string;
  players: ReadonlyArray<Player>;
  choice?: Choice;
  timeLimit?: number;
  data?: Record<string, unknown>;
}

export interface RevealData {
  targets: ReadonlyArray<Player>;
}

export interface DeathData {
  deaths: ReadonlyArray<Player>;
}
