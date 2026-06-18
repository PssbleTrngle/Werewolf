import type { WinData, WinState } from "models";
import type { ArrayOrSingle } from "../../util.js";
import type { Effect } from "../effect/Effect.js";
import type { SubjectMappers } from "../permissions/index.js";
import type { Player } from "../player/Player.js";
import type { GameReadAccess } from "../state.js";
import { EventType } from "./Event.js";
import { registerEventFactory } from "./EventRegistry.js";

export default class WinEvent extends EventType<WinData> {
  static create = registerEventFactory(
    "win",
    new WinEvent(),
    (state: WinState) => ({
      data: { state },
    }),
  );

  override finish(): ArrayOrSingle<Effect> {
    throw new Error("This should never be called");
  }

  override isFinished(_game: GameReadAccess): boolean {
    return false;
  }

  protected viewData(
    _player: Player,
    { state }: WinData,
    _mapper: SubjectMappers,
  ): WinData {
    // no player mapping since roles are reveal on the win screen
    return { state };
  }
}
