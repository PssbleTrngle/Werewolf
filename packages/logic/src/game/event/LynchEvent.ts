import { Vote } from "models";
import { arrayOrSelf } from "../../util.js";
import { AnnouncementEffect } from "../effect/AnnouncementEffect.js";
import { TimeEffect } from "../effect/TimeEffect.js";
import { Player } from "../player/Player.js";
import { KillEvent } from "./KillEvent.js";
import { SleepEvents } from "./SleepBoundary.js";

export default class LynchEvent extends KillEvent {
  constructor(players: ReadonlyArray<Player>) {
    super("kill.lynch", players, "lynching", { players, canSkip: true });
  }

  finish(vote: Vote) {
    return [
      ...arrayOrSelf(super.finish(vote)),
      new TimeEffect("dusk"),
      new AnnouncementEffect("night"),
      ...SleepEvents.createEffects(),
    ];
  }
}
