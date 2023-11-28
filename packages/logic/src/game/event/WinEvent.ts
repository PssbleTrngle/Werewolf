import { WinData, WinState } from "models";
import { ArrayOrSingle } from "../../util.js";
import { GameReadAccess } from "../Game.js";
import { Effect } from "../effect/Effect.js";
import { EventType } from "./Event.js";
import { registerEventFactory } from "./EventRegistry.js";

export default class WinEvent extends EventType<WinData> {
  static create = registerEventFactory(
    "win",
    new WinEvent(),
    (state: WinState) => ({
      data: { state },
    })
  );

  finish(): ArrayOrSingle<Effect> {
    throw new Error("This should never be called");
  }

  isFinished(_game: GameReadAccess): boolean {
    return false;
  }
}
