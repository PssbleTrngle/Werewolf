import { GameAccess } from "../Game.js";
import { EventFactory } from "../event/Event.js";
import { Effect } from "./Effect.js";

export class EventEffect implements Effect {
  constructor(private readonly factory: EventFactory) {}

  apply(game: GameAccess) {
    game.arise(this.factory);
  }
}
