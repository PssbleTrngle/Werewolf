import { Choice, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { ReviveEffect } from "../effect/ReviveEffect.js";
import { Player } from "../player/Player.js";
import { Event } from "./Event.js";

export class ReviveEvent extends Event {
  constructor(
    type: string,
    readonly players: ReadonlyArray<Player>,
    readonly choice: Choice,
  ) {
    super(type, players, choice);
  }

  finish(vote: Vote): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      // TODO vote strategy?
      return new ReviveEffect(vote.players[0]);
    }

    return [];
  }
}
