import { Vote } from "models";
import { arrayOrSelf } from "../../util.js";
import { AnnouncementEffect } from "../effect/AnnouncementEffect.js";
import { Player } from "../player/Player.js";
import { KillEvent } from "./KillEvent.js";
import { sleepEffects } from "./SleepBoundary.js";

export default class LynchEvent extends KillEvent {
  constructor(players: ReadonlyArray<Player>) {
    super("lynch", players, "lynching", { players, canSkip: true });
  }

  finish(vote: Vote) {
    return [
      ...arrayOrSelf(super.finish(vote)),
      new AnnouncementEffect(),
      ...sleepEffects(),
    ];
  }
}
