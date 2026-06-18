import type { DeathCause, Id } from "models";
import type { GameAccess } from "../state.js";
import type { Effect } from "./Effect.js";

export class KillEffect implements Effect {
  constructor(
    private readonly target: Id,
    private readonly cause: DeathCause,
  ) {}

  apply(game: GameAccess) {
    game.kill(this.target, this.cause);
  }
}
