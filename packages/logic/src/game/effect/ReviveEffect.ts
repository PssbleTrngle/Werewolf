import type { Id } from "models";
import type { GameAccess } from "../state.js";
import type { Effect } from "./Effect.js";

export class ReviveEffect implements Effect {
  constructor(private readonly target: Id) {}

  apply(game: GameAccess) {
    game.revive(this.target);
  }
}
