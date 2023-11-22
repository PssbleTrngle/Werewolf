import { AnnouncementEffect } from "../effect/AnnouncementEffect.js";
import { Effect } from "../effect/Effect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { TimeEffect } from "../effect/TimeEffect.js";
import { Player } from "../player/Player.js";
import { isAlive } from "../player/predicates.js";
import { Event, EventFactory } from "./Event.js";
import LynchEvent from "./LynchEvent.js";

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
    super("sleep", players);
  }

  finish() {
    return [
      new TimeEffect("dawn"),
      new AnnouncementEffect("day"),
      new EventEffect((players) => new LynchEvent(players.filter(isAlive))),
    ];
  }
}
