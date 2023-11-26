import { TimeEffect } from "../effect/TimeEffect.js";
import { DismissChoice } from "../vote/Choice.js";
import { EventType } from "./Event.js";
import { EventFactoryBus } from "./EventBus.js";
import { registerEventFactory } from "./EventRegistry.js";
import { SleepEvents } from "./SleepBoundary.js";

export const StartEvents = new EventFactoryBus();

export class StartEvent extends EventType {
  static create = registerEventFactory("start", new StartEvent(), () => ({
    choice: DismissChoice,
    data: undefined,
  }));

  finish() {
    console.log("Game Started");
    return [
      new TimeEffect("night"),
      ...StartEvents.createEffects(),
      ...SleepEvents.createEffects(),
    ];
  }
}
