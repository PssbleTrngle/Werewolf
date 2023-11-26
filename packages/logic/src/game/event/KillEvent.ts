import { Event, KillData, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { KillEffect } from "../effect/KillEffect.js";
import { EventType } from "./Event.js";

export class KillEvent extends EventType<KillData> {
  finish(vote: Vote, { data }: Event<KillData>): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      // TODO vote strategy?
      return new KillEffect(vote.players[0], data.cause);
    }

    return [];
  }
}
