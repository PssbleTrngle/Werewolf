import { RevealData } from "models";
import { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { Event } from "./Event.js";

export class RevealEvent extends Event implements RevealData {
  constructor(
    type: string,
    readonly players: ReadonlyArray<Player>,
    readonly targets: ReadonlyArray<Player>,
  ) {
    super(type, players, DismissChoice);
  }

  finish() {
    return [];
  }
}
