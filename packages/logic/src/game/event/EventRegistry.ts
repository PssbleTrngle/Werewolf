import { Event, Player } from "models";
import Registry from "../../Registry.js";
import { EventType } from "./Event.js";

const REGISTRY = new Registry<EventType<unknown>>("event type");

type BareEvent<T> = Omit<Event<T>, "type" | "players"> & {
  players?: never;
  type?: never;
};

export function registerEvent<TData>(key: string, type: EventType<TData>) {
  REGISTRY.register(key, type);
}

export function registerEventFactory<TData, TArgs extends unknown[]>(
  key: string,
  type: EventType<TData>,
  factory: (...args: TArgs) => BareEvent<TData>
) {
  registerEvent(key, type);
  return (players: ReadonlyArray<Player>, ...args: TArgs): Event<TData> => {
    return { ...factory(...args), players, type: key };
  };
}

export const EventRegistry = REGISTRY.freeze();
