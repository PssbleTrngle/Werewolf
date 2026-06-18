import type { Time } from "models";
import type { GameAccess } from "../state.js";
import type { Effect } from "./Effect.js";

export class TimeEffect implements Effect {
  constructor(private readonly time: Time) {}

  apply(game: GameAccess) {
    game.setTime(this.time);
  }
}
