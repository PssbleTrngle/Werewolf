import { Effect } from "../effect/Effect.js";
import { EventEffect } from "../effect/EventEffect.js";
import { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { Event, EventFactory } from "./Event.js";
import { sleepEffects } from "./SleepBoundary.js";

const startEvents: EventFactory[] = [];

export function registerStartEvent(factory: EventFactory) {
  startEvents.push(factory);
}

function startEffects(): ReadonlyArray<Effect> {
  return startEvents.map((it) => new EventEffect(it));
}

export class StartEvent extends Event {
  constructor(players: ReadonlyArray<Player>) {
    super(players, DismissChoice);
  }

  finish() {
    console.log("Game Started");
    return [...startEffects(), ...sleepEffects()];
  }
}
