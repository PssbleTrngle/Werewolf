import { Event, WinData, WinState } from "models";
import { ArrayOrSingle } from "../../util.js";
import { GameReadAccess } from "../Game.js";
import { Effect } from "../effect/Effect.js";
import { Player } from "../player/Player.js";
import { EventType } from "./Event.js";

export default class WinEvent extends EventType<WinData> {
  static create(
    players: ReadonlyArray<Player>,
    state: WinState
  ): Event<WinData> {
    return {
      type: "win",
      players,
      data: { state },
    };
  }

  finish(): ArrayOrSingle<Effect> {
    throw new Error("This should never be called");
  }

  isFinished(_game: GameReadAccess): boolean {
    return false;
  }
}
