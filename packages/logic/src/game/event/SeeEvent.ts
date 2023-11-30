import { Event, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { RevealEffect } from "../effect/RevealEffect.js";
import { Player } from "../player/Player.js";
import { registerEventFactory } from "./EventRegistry.js";
import { NoDataEvent } from "./NoDataEvent.js";

export class SeeEvent extends NoDataEvent {
  static create = registerEventFactory(
    "see",
    new SeeEvent(),
    (targets: ReadonlyArray<Player>) => ({
      choice: { players: targets },
      data: undefined,
    })
  );

  finish(vote: Vote, event: Event<undefined>): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      return new RevealEffect("seer", event.players[0].id, vote.players);
    }

    return [];
  }
}
