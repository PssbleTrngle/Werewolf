import { TimeEffect } from "../effect/TimeEffect.js";
import { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { Event } from "./Event.js";
import { EventBus } from "./EventBus.js";
import { SleepEvents } from "./SleepBoundary.js";

export const StartEvents = new EventBus();

export class StartEvent extends Event {
  constructor(players: ReadonlyArray<Player>) {
    super("start", players, DismissChoice);
  }

  finish() {
    console.log("Game Started");
    return [
      new TimeEffect("night"),
      ...StartEvents.createEffects(),
      ...SleepEvents.createEffects(),
    ];
  }
}
