import { Effect } from "../effect/Effet";
import { EventEffect } from "../effect/EventEffect";
import { Player } from "../player/Player";
import { isAlive } from "../player/predicates";
import { Event, EventFactory } from "./Event";
import LynchEvent from "./LynchEvent";

const sleepEvents: EventFactory[] = [];

export function registerSleepEvent(factory: EventFactory) {
  sleepEvents.push(factory);
}

export function sleepEffects(): ReadonlyArray<Effect> {
  const boundary: EventFactory = (players) =>
    new SleepBoundary(players.filter(isAlive));
  return [...sleepEvents, boundary].map((it) => new EventEffect(it));
}

export class SleepBoundary extends Event {
  constructor(players: ReadonlyArray<Player>) {
    super(players);
  }

  finish() {
    return new EventEffect(
      (players) => new LynchEvent(players.filter(isAlive))
    );
  }
}
