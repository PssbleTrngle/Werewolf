import { AnnouncementEffect } from "../effect/AnnouncementEffect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { TimeEffect } from "../effect/TimeEffect.js";
import { isNotDead } from "../player/predicates.js";
import { EventType } from "./Event.js";
import { EventFactoryBus } from "./EventBus.js";
import { registerEventFactory } from "./EventRegistry.js";
import LynchEvent from "./LynchEvent.js";

export const SleepEvents = new EventFactoryBus();

export class SleepBoundary extends EventType {
  static create = registerEventFactory("sleep", new SleepBoundary(), () => ({
    data: undefined,
  }));

  finish() {
    return [
      new TimeEffect("dawn"),
      new AnnouncementEffect("day"),
      new EventEffect(({ players }) => {
        // TODO isAlive?
        const alive = players
          .filter(isNotDead)
          .filter((it) => it.status !== "dying");

        return LynchEvent.create(alive, alive);
      }),
    ];
  }
}
