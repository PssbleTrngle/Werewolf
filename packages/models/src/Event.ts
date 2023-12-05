import { Choice } from "./Choice.js";
import { Time, WinState } from "./Game.js";
import { DeathCause, Player } from "./Player.js";

export interface Event<T = unknown> {
  type: string;
  players: ReadonlyArray<Player>;
  choice?: Choice;
  timeLimit?: number;
  data: T;
}

export interface KillData {
  cause: DeathCause;
}

export interface RevealData {
  targets: ReadonlyArray<Player>;
}

export interface DeathData {
  deaths: ReadonlyArray<Player>;
  time?: Time;
}

export interface WinData {
  state: WinState;
}
