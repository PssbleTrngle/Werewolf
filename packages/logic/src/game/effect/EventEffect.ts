import { EventFactory } from "../event/Event.js";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

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
