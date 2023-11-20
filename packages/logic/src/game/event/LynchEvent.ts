import { arrayOrSelf } from "../../util";
import { Player } from "../Player";
import { Vote } from "../choice/Vote";
import { KillEvent } from "./KillEvent";
import { sleepEffects } from "./SleepBoundary";

export default class LynchEvent extends KillEvent {
  constructor(players: ReadonlyArray<Player>) {
    super(players, "lynching", { players, canSkip: true });
  }

  finish(vote: Vote) {
    return [...arrayOrSelf(super.finish(vote)), ...sleepEffects()];
  }
}
