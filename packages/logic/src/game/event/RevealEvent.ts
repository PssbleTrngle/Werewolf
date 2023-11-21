import { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { Event } from "./Event.js";

export class RevealEvent extends Event {
  constructor(
    readonly players: ReadonlyArray<Player>,
    readonly targets: ReadonlyArray<Player>
  ) {
    super(players, DismissChoice);
  }

  finish() {
    return [];
  }
}
