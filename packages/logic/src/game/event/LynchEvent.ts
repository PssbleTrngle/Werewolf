import type { Event, GameSettings, KillData, Vote } from "models";
import { DeathCause } from "models";
import { arrayOrSelf } from "../../util.js";
import { AnnouncementEffect } from "../effect/AnnouncementEffect.js";
import { TimeEffect } from "../effect/TimeEffect.js";
import type { Player } from "../player/Player.js";
import { registerEventFactory } from "./EventRegistry.js";
import { KillEvent } from "./KillEvent.js";
import { SleepEvents } from "./SleepBoundary.js";

export default class LynchEvent extends KillEvent {
  static create = registerEventFactory(
    "kill.lynch",
    new LynchEvent(),
    (settings: GameSettings, choices: ReadonlyArray<Player>) => ({
      choice: {
        players: choices,
        canSkip: settings.lynchSkippable,
      },
      data: {
        cause: DeathCause.LYNCHED,
      },
    }),
  );

  override finish(vote: Vote, event: Event<KillData>) {
    return [
      ...arrayOrSelf(super.finish(vote, event)),
      new TimeEffect("dusk"),
      new AnnouncementEffect("night"),
      ...SleepEvents.createEffects(),
    ];
  }
}
