import { Choice } from "./Choice.js";
import { Player } from "./Player.js";

export interface Event {
  type: string;
  players: ReadonlyArray<Player>;
  choice?: Choice;
  data?: Record<string, unknown>;
}
