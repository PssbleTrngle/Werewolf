import { Id } from "models";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

export class ReviveEffect implements Effect {
  constructor(private readonly target: Id) {}

  apply(game: GameAccess) {
    game.revive(this.target);
  }
}
