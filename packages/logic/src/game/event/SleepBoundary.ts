import type { Event } from "models";
import { AnnouncementEffect } from "../effect/AnnouncementEffect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { TimeEffect } from "../effect/TimeEffect.js";
import type { SubjectMappers } from "../permissions/index.js";
import type { Player } from "../player/Player.js";
import { isAlive } from "../player/predicates.js";
import { EventFactoryBus } from "./EventBus.js";
import LynchEvent from "./LynchEvent.js";
import { NoDataEvent } from "./NoDataEvent.js";

export const SleepEvents = new EventFactoryBus();

export class SleepBoundary extends NoDataEvent {
  static create = this.createFactory("sleep", new SleepBoundary());

  override finish() {
    return [
      new TimeEffect("dawn"),
      new AnnouncementEffect("day"),
      new EventEffect(({ players, settings }) => {
        const alive = players.filter(isAlive);

        return LynchEvent.create(alive, settings, alive);
      }),
    ];
  }

  override view(
    player: Player,
    event: Event<never>,
    mapper: SubjectMappers,
  ): Event<never> {
    return {
      ...super.view(player, event, mapper),
      players: [],
    };
  }
}
