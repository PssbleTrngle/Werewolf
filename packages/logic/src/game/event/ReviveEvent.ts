import { Event, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { ReviveEffect } from "../effect/ReviveEffect.js";
import { NoDataEvent } from "./NoDataEvent.js";

export class ReviveEvent extends NoDataEvent {
  finish(vote: Vote, _event: Event<undefined>): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      // TODO vote strategy?
      return new ReviveEffect(vote.players[0]);
    }

    return [];
  }
}
