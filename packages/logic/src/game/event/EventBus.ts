import { Effect } from "../effect/Effect";
import { EventEffect } from "../effect/EventEffect";
import { EventFactory } from "./Event";

export class EventBus {
  private readonly events: EventFactory[] = [];

  register(factory: EventFactory) {
    this.events.push(factory);
  }

  createEffects(): ReadonlyArray<Effect> {
    return this.events.map((it) => new EventEffect(it));
  }
}
