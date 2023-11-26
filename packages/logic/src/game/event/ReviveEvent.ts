import { Event, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { ReviveEffect } from "../effect/ReviveEffect.js";
import { EventType } from "./Event.js";

export class ReviveEvent extends EventType {
  finish(vote: Vote, _event: Event): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      // TODO vote strategy?
      return new ReviveEffect(vote.players[0]);
    }

    return [];
  }
}
