import { Effect } from "../effect/Effect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { EventFactory } from "./Event.js";

export class EventBus {
  private readonly events: Array<{
    factory: EventFactory;
    immediately: boolean;
  }> = [];

  register(factory: EventFactory, immediately = false) {
    this.events.push({ factory, immediately });
  }

  createEffects(): ReadonlyArray<Effect> {
    return this.events.map((it) => new EventEffect(it.factory, it.immediately));
  }
}
