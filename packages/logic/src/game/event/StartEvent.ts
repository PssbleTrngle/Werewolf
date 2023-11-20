import { Player } from "../player/Player";
import { Event } from "./Event";
import { sleepEffects } from "./SleepBoundary";

export class StartEvent extends Event {
  constructor(players: ReadonlyArray<Player>) {
    super(players);
  }

  finish() {
    return sleepEffects();
  }
}
