import { Event, RevealData } from "models";
import { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { EventType } from "./Event.js";

export class RevealEvent extends EventType<RevealData> {
  static create(
    type: string,
    players: ReadonlyArray<Player>,
    targets: ReadonlyArray<Player>
  ): Event<RevealData> {
    return {
      players,
      type: `reveal.${type}`,
      choice: DismissChoice,
      data: { targets },
    };
  }

  finish() {
    return [];
  }
}
