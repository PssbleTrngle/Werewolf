import { Effect } from "../effect/Effect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { EventFactory } from "./Event.js";

function isResult<T>(value: T | false): value is T {
  return value !== false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventBus<Listener extends (...args: any[]) => any> {
  protected readonly listeners: Array<Listener> = [];

  register(listener: Listener) {
    this.listeners.push(listener);
  }

  notify(
    ...args: Parameters<Listener>
  ): ReadonlyArray<Exclude<ReturnType<Listener>, false>> {
    return this.listeners.map((it) => it(...args)).filter(isResult);
  }
}

export class EventFactoryBus extends EventBus<EventFactory> {
  createEffects(): ReadonlyArray<Effect> {
    return this.listeners.map((it) => new EventEffect(it));
  }
}
