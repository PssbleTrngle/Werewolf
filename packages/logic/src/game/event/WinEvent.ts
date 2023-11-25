import { WinState } from "models";
import { ArrayOrSingle } from "../../util.js";
import { GameReadAccess } from "../Game.js";
import { Effect } from "../effect/Effect.js";
import { Player } from "../player/Player.js";
import { Event } from "./Event.js";

export default class WinEvent extends Event {
  constructor(
    players: ReadonlyArray<Player>,
    public readonly state: WinState,
  ) {
    super("win", players);
  }

  finish(): ArrayOrSingle<Effect> {
    throw new Error("This should never be called");
  }

  isFinished(_game: GameReadAccess): boolean {
    return false;
  }
}
