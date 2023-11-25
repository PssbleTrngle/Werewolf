import { AnnouncementEffect } from "../effect/AnnouncementEffect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { TimeEffect } from "../effect/TimeEffect.js";
import { Player } from "../player/Player.js";
import { isNotDead } from "../player/predicates.js";
import { Event } from "./Event.js";
import { EventBus } from "./EventBus.js";
import LynchEvent from "./LynchEvent.js";

export const SleepEvents = new EventBus();

export class SleepBoundary extends Event {
  constructor(players: ReadonlyArray<Player>) {
    super("sleep", players);
  }

  finish() {
    return [
      new TimeEffect("dawn"),
      new AnnouncementEffect("day"),
      new EventEffect(
        ({ players }) =>
          new LynchEvent(
            players.filter(isNotDead).filter((it) => it.status !== "dying"),
          ),
      ),
    ];
  }
}
