import { GameAccess } from "../Game.js";

export interface Effect {
  apply(game: GameAccess): void;
}
