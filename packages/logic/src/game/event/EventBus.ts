import { Effect } from "../effect/Effect";
import { EventEffect } from "../effect/EventEffect";
import { EventFactory } from "./Event";

function isResult<T>(value: T | false): value is T {
  return value !== false;
}

export class EventBus<Listener extends (...args: any[]) => any> {
  protected readonly listeners: Array<Listener> = [];

  register(listener: Listener) {
    this.listeners.push(listener);
  }

  notify(
    ...args: Parameters<Listener>
  ): ReadonlyArray<Exclude<ReturnType<Listener>, "false">> {
    return this.listeners.map((it) => it(...args)).filter(isResult);
  }
}

export class EventFactoryBus extends EventBus<EventFactory> {
  createEffects(): ReadonlyArray<Effect> {
    return this.listeners.map((it) => new EventEffect(it));
  }
}
