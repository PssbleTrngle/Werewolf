import { Game } from "../Game";

export interface Effect {
  apply(game: Game): void;
}
