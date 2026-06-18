import type { EventFactory } from "../event/Event.js";
import type { GameAccess } from "../state.js";
import type { Effect } from "./Effect.js";

export class EventEffect implements Effect {
  constructor(
    private readonly factory: EventFactory,
    private readonly immediately = false,
  ) {}

  apply(game: GameAccess) {
    if (this.immediately) game.immediately(this.factory);
    else game.arise(this.factory);
  }
}
