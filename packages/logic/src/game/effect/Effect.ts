import { GameAccess } from "../state.js";

export interface Effect {
  apply(game: GameAccess): void;
}
